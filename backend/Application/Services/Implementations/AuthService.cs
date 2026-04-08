using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using SLBFE.HRM.API.Application.DTOs.Request;
using SLBFE.HRM.API.Application.DTOs.Response;
using SLBFE.HRM.API.Application.Services.Interfaces;
using SLBFE.HRM.API.Core.Entities;
using SLBFE.HRM.API.Infrastructure.Data.Context;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace SLBFE.HRM.API.Application.Services.Implementations
{
    /// <summary>
    /// Authentication service implementation with JWT and Refresh Token support
    /// </summary>
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthService> _logger;
        private const int DEFAULT_JWT_EXPIRY_MINUTES = 60; // 1 hour
        private const int REFRESH_TOKEN_EXPIRY_DAYS = 7; // 7 days

        public AuthService(ApplicationDbContext context, IConfiguration configuration, ILogger<AuthService> logger)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
        }

        /// <summary>
        /// Authenticate user and generate JWT access token with refresh token
        /// </summary>
        public async Task<TokenResponseDto?> LoginAsync(LoginDto loginDto)
        {
            try
            {
                // Find user by username
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.UserName == loginDto.UserName);

                if (user == null)
                {
                    _logger.LogWarning($"Login failed: User not found - {loginDto.UserName}");
                    return null;
                }

                // Check if user is active
                if (user.Status != "Active")
                {
                    _logger.LogWarning($"Login failed: User is not active - {loginDto.UserName}");
                    return null;
                }

                // Verify password
                bool isPasswordValid = BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash);
                
                if (!isPasswordValid)
                {
                    _logger.LogWarning($"Login failed: Invalid password - {loginDto.UserName}");
                    return null;
                }

                // Get JWT settings from Configuration
                var jwtSecretKey = _configuration["JwtSettings:SecretKey"];
                var jwtIssuer = _configuration["JwtSettings:Issuer"];
                var jwtAudience = _configuration["JwtSettings:Audience"];
                var jwtExpiryMinutesStr = _configuration["JwtSettings:ExpiryMinutes"];

                if (string.IsNullOrEmpty(jwtSecretKey))
                {
                    _logger.LogError("JWT_Secret_Key not found in Configuration");
                    throw new InvalidOperationException("JWT configuration is missing");
                }

                int expiryMinutes = DEFAULT_JWT_EXPIRY_MINUTES;
                if (!string.IsNullOrEmpty(jwtExpiryMinutesStr) && int.TryParse(jwtExpiryMinutesStr, out int parsedExpiry))
                {
                    expiryMinutes = parsedExpiry;
                }

                // Generate JWT access token
                var accessToken = GenerateJwtToken(user.UserId, user.RoleID, jwtSecretKey, jwtIssuer, jwtAudience, expiryMinutes);

                // Generate refresh token
                var refreshToken = GenerateRefreshToken();

                // Store refresh token in database
                await StoreRefreshTokenAsync(user.UserId, refreshToken);

                // Update last login timestamp
                user.LastLogin = DateTime.UtcNow;
                user.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                _logger.LogInformation($"User logged in successfully: {loginDto.UserName}, RoleId: {user.RoleID}");

                // Return token response
                return new TokenResponseDto
                {
                    AccessToken = accessToken,
                    RefreshToken = refreshToken,
                    ExpiresIn = expiryMinutes * 60, // Convert to seconds
                    TokenType = "Bearer",
                    UserId = user.UserId,
                    RoleId = user.RoleID,
                    UserName = user.UserName
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error during login for user: {loginDto.UserName}");
                throw;
            }
        }

        /// <summary>
        /// Refresh access token using a valid refresh token
        /// </summary>
        public async Task<TokenResponseDto?> RefreshTokenAsync(RefreshTokenDto refreshTokenDto)
        {
            try
            {
                // Validate the refresh token
                var storedToken = await _context.UserRefreshTokens
                    .Include(rt => rt.User)
                    .FirstOrDefaultAsync(rt => rt.Token == refreshTokenDto.RefreshToken);

                if (storedToken == null)
                {
                    _logger.LogWarning("Refresh token not found");
                    return null;
                }

                // Check if token is active (not expired and not revoked)
                if (!storedToken.IsActive)
                {
                    _logger.LogWarning($"Refresh token is inactive. Expired: {storedToken.IsExpired}, Revoked: {storedToken.IsRevoked}");
                    return null;
                }

                // Extract claims from the expired access token (without validation)
                var principal = GetPrincipalFromExpiredToken(refreshTokenDto.AccessToken);
                if (principal == null)
                {
                    _logger.LogWarning("Invalid access token");
                    return null;
                }

                var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    _logger.LogWarning("Invalid user ID in access token");
                    return null;
                }

                // Verify that the refresh token belongs to the user in the access token
                if (storedToken.UserId != userId)
                {
                    _logger.LogWarning("Refresh token does not belong to the user in the access token");
                    return null;
                }

                // Get user details
                var user = storedToken.User ?? await _context.Users.FindAsync(userId);
                if (user == null || user.Status != "Active")
                {
                    _logger.LogWarning($"User not found or not active: {userId}");
                    return null;
                }

                // Get JWT settings from appsettings.json
                var jwtSecretKey = _configuration["JwtSettings:SecretKey"];
                var jwtIssuer = _configuration["JwtSettings:Issuer"];
                var jwtAudience = _configuration["JwtSettings:Audience"];

                if (string.IsNullOrEmpty(jwtSecretKey))
                {
                    _logger.LogError("JWT_Secret_Key not found in configuration");
                    throw new InvalidOperationException("JWT configuration is missing");
                }

                int expiryMinutes = DEFAULT_JWT_EXPIRY_MINUTES;
                if (int.TryParse(_configuration["JwtSettings:ExpirationMinutes"], out int configExpiry))
                {
                    expiryMinutes = configExpiry;
                }

                // Generate new JWT access token
                var newAccessToken = GenerateJwtToken(user.UserId, user.RoleID, jwtSecretKey, jwtIssuer, jwtAudience, expiryMinutes);

                // Generate new refresh token
                var newRefreshToken = GenerateRefreshToken();

                // Revoke the old refresh token
                storedToken.RevokedAt = DateTime.UtcNow;

                // Store the new refresh token
                await StoreRefreshTokenAsync(user.UserId, newRefreshToken);

                await _context.SaveChangesAsync();

                _logger.LogInformation($"Token refreshed successfully for user: {user.UserName}");

                // Return new token response
                return new TokenResponseDto
                {
                    AccessToken = newAccessToken,
                    RefreshToken = newRefreshToken,
                    ExpiresIn = expiryMinutes * 60, // Convert to seconds
                    TokenType = "Bearer",
                    UserId = user.UserId,
                    RoleId = user.RoleID,
                    UserName = user.UserName
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during token refresh");
                throw;
            }
        }

        /// <summary>
        /// Revoke a specific refresh token (logout)
        /// </summary>
        public async Task<bool> RevokeRefreshTokenAsync(string refreshToken)
        {
            try
            {
                var storedToken = await _context.UserRefreshTokens
                    .FirstOrDefaultAsync(rt => rt.Token == refreshToken);

                if (storedToken == null)
                {
                    _logger.LogWarning("Refresh token not found for revocation");
                    return false;
                }

                if (storedToken.IsRevoked)
                {
                    _logger.LogInformation("Refresh token already revoked");
                    return true;
                }

                storedToken.RevokedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Refresh token revoked successfully for user: {storedToken.UserId}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during token revocation");
                throw;
            }
        }

        /// <summary>
        /// Revoke all refresh tokens for a specific user
        /// </summary>
        public async Task<int> RevokeAllUserTokensAsync(int userId)
        {
            try
            {
                var activeTokens = await _context.UserRefreshTokens
                    .Where(rt => rt.UserId == userId && rt.RevokedAt == null)
                    .ToListAsync();

                foreach (var token in activeTokens)
                {
                    token.RevokedAt = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();

                _logger.LogInformation($"Revoked {activeTokens.Count} tokens for user: {userId}");
                return activeTokens.Count;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error revoking all tokens for user: {userId}");
                throw;
            }
        }

        #region Private Helper Methods

        /// <summary>
        /// Generate JWT access token with user claims
        /// </summary>
        private string GenerateJwtToken(int userId, int roleId, string secretKey, string issuer, string audience, int expiryMinutes)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(secretKey);

            // Map roleId to role name for authorization
            var roleName = MapRoleIdToRoleName(roleId);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                    new Claim(ClaimTypes.Role, roleName),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), // Unique token ID
                    new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
                }),
                Expires = DateTime.UtcNow.AddMinutes(expiryMinutes),
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        /// <summary>
        /// Map RoleID to role name
        /// </summary>
        private string MapRoleIdToRoleName(int roleId)
        {
            return roleId switch
            {
                1 => "SystemAdmin",
                2 => "HR Manager",
                3 => "Employee",
                _ => "Employee"
            };
        }

        /// <summary>
        /// Generate a cryptographically secure random refresh token
        /// </summary>
        private string GenerateRefreshToken()
        {
            var randomBytes = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomBytes);
            return Convert.ToBase64String(randomBytes);
        }

        /// <summary>
        /// Store refresh token in database
        /// </summary>
        private async Task StoreRefreshTokenAsync(int userId, string refreshToken)
        {
            var userRefreshToken = new UserRefreshToken
            {
                UserId = userId,
                Token = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddDays(REFRESH_TOKEN_EXPIRY_DAYS),
                CreatedAt = DateTime.UtcNow
            };

            _context.UserRefreshTokens.Add(userRefreshToken);
            await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Get claims principal from an expired JWT token (without validation)
        /// </summary>
        private ClaimsPrincipal? GetPrincipalFromExpiredToken(string token)
        {
            try
            {
                var jwtSecretKey = _configuration["JwtSettings:SecretKey"];
                var jwtIssuer = _configuration["JwtSettings:Issuer"];
                var jwtAudience = _configuration["JwtSettings:Audience"];

                if (string.IsNullOrEmpty(jwtSecretKey))
                {
                    return null;
                }

                var tokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = false, // Don't validate lifetime for expired token
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtIssuer,
                    ValidAudience = jwtAudience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecretKey)),
                    ClockSkew = TimeSpan.Zero
                };

                var tokenHandler = new JwtSecurityTokenHandler();
                var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);

                var jwtSecurityToken = securityToken as JwtSecurityToken;
                if (jwtSecurityToken == null ||
                    !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                {
                    return null;
                }

                return principal;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Error extracting principal from expired token");
                return null;
            }
        }

        /// <summary>
        /// Get system setting value by key
        /// </summary>
        private async Task<string?> GetSystemSettingAsync(string settingKey)
        {
            var setting = await _context.SystemSettings
                .FirstOrDefaultAsync(s => s.SettingKey == settingKey);

            return setting?.SettingValue;
        }

        /// <summary>
        /// Initiate forgot password process by sending OTP to user's email
        /// </summary>
        public async Task<ForgotPasswordResponseDto> ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto)
        {
            try
            {
                // Find user by Employee ID
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.EmployeeId == forgotPasswordDto.EmployeeId);

                if (user == null)
                {
                    _logger.LogWarning($"Forgot password request: Employee not found - {forgotPasswordDto.EmployeeId}");
                    return new ForgotPasswordResponseDto
                    {
                        Success = false,
                        Message = "Employee ID not found in the system"
                    };
                }

                // Get employee details including email
                var employee = await _context.Employees
                    .FirstOrDefaultAsync(e => e.EmployeeId == forgotPasswordDto.EmployeeId);

                if (employee == null || string.IsNullOrEmpty(employee.Email))
                {
                    _logger.LogWarning($"Forgot password request: Email not found for employee - {forgotPasswordDto.EmployeeId}");
                    return new ForgotPasswordResponseDto
                    {
                        Success = false,
                        Message = "Email address not found for this employee"
                    };
                }

                // Generate and send OTP
                var random = new Random();
                var otp = random.Next(100000, 999999).ToString();
                var expiresAt = DateTime.UtcNow.AddMinutes(10); // OTP valid for 10 minutes

                // Delete any existing OTPs for this email
                var existingOtps = await _context.OtpRecords
                    .Where(o => o.Email == employee.Email && !o.IsUsed)
                    .ToListAsync();

                _context.OtpRecords.RemoveRange(existingOtps);

                // Store OTP in database
                var otpRecord = new OtpRecord
                {
                    Email = employee.Email,
                    Otp = otp,
                    CreatedAt = DateTime.UtcNow,
                    ExpiresAt = expiresAt,
                    IsUsed = false,
                    Purpose = "PASSWORD_RESET"
                };

                _context.OtpRecords.Add(otpRecord);
                await _context.SaveChangesAsync();

                // Print OTP to console/terminal for development
                Console.WriteLine("\n===========================================");
                Console.WriteLine($"PASSWORD RESET OTP");
                Console.WriteLine($"Employee ID: {forgotPasswordDto.EmployeeId}");
                Console.WriteLine($"Email: {employee.Email}");
                Console.WriteLine($"OTP Code: {otp}");
                Console.WriteLine($"Valid until: {expiresAt.ToLocalTime():yyyy-MM-dd HH:mm:ss}");
                Console.WriteLine("===========================================\n");

                _logger.LogInformation($"Password reset OTP generated for Employee ID: {forgotPasswordDto.EmployeeId}");

                // Mask email for response
                var maskedEmail = MaskEmail(employee.Email);

                return new ForgotPasswordResponseDto
                {
                    Success = true,
                    Message = $"OTP has been sent to your registered email address",
                    Email = maskedEmail
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in forgot password process");
                return new ForgotPasswordResponseDto
                {
                    Success = false,
                    Message = "An error occurred. Please try again later."
                };
            }
        }

        /// <summary>
        /// Reset password after OTP verification
        /// </summary>
        public async Task<ForgotPasswordResponseDto> ResetPasswordAsync(ResetPasswordDto resetPasswordDto)
        {
            try
            {
                // Find user by Employee ID
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.EmployeeId == resetPasswordDto.EmployeeId);

                if (user == null)
                {
                    _logger.LogWarning($"Reset password request: Employee not found - {resetPasswordDto.EmployeeId}");
                    return new ForgotPasswordResponseDto
                    {
                        Success = false,
                        Message = "Employee ID not found in the system"
                    };
                }

                // Get employee details including email
                var employee = await _context.Employees
                    .FirstOrDefaultAsync(e => e.EmployeeId == resetPasswordDto.EmployeeId);

                if (employee == null || string.IsNullOrEmpty(employee.Email))
                {
                    _logger.LogWarning($"Reset password request: Email not found for employee - {resetPasswordDto.EmployeeId}");
                    return new ForgotPasswordResponseDto
                    {
                        Success = false,
                        Message = "Email address not found for this employee"
                    };
                }

                // Verify OTP
                var otpRecord = await _context.OtpRecords
                    .Where(o => o.Email == employee.Email && 
                                o.Otp == resetPasswordDto.Otp && 
                                !o.IsUsed &&
                                o.Purpose == "PASSWORD_RESET")
                    .OrderByDescending(o => o.CreatedAt)
                    .FirstOrDefaultAsync();

                if (otpRecord == null)
                {
                    _logger.LogWarning($"Reset password request: Invalid OTP for employee - {resetPasswordDto.EmployeeId}");
                    return new ForgotPasswordResponseDto
                    {
                        Success = false,
                        Message = "Invalid OTP. Please check and try again."
                    };
                }

                if (otpRecord.ExpiresAt < DateTime.UtcNow)
                {
                    _logger.LogWarning($"Reset password request: Expired OTP for employee - {resetPasswordDto.EmployeeId}");
                    return new ForgotPasswordResponseDto
                    {
                        Success = false,
                        Message = "OTP has expired. Please request a new one."
                    };
                }

                // Mark OTP as used
                otpRecord.IsUsed = true;

                // Update password
                var newPasswordHash = BCrypt.Net.BCrypt.HashPassword(resetPasswordDto.NewPassword);
                user.PasswordHash = newPasswordHash;
                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                Console.WriteLine("\n===========================================");
                Console.WriteLine($"PASSWORD RESET SUCCESSFUL");
                Console.WriteLine($"Employee ID: {resetPasswordDto.EmployeeId}");
                Console.WriteLine($"Username: {user.UserName}");
                Console.WriteLine($"Reset at: {DateTime.Now:yyyy-MM-dd HH:mm:ss}");
                Console.WriteLine("===========================================\n");

                _logger.LogInformation($"Password reset successful for Employee ID: {resetPasswordDto.EmployeeId}");

                return new ForgotPasswordResponseDto
                {
                    Success = true,
                    Message = "Password has been reset successfully. You can now login with your new password."
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in reset password process");
                return new ForgotPasswordResponseDto
                {
                    Success = false,
                    Message = "An error occurred. Please try again later."
                };
            }
        }

        /// <summary>
        /// Mask email address for security
        /// </summary>
        private string MaskEmail(string email)
        {
            if (string.IsNullOrEmpty(email))
                return string.Empty;

            var parts = email.Split('@');
            if (parts.Length != 2)
                return email;

            var localPart = parts[0];
            var domain = parts[1];

            if (localPart.Length <= 2)
                return $"{localPart[0]}***@{domain}";

            var visibleChars = Math.Min(2, localPart.Length);
            var maskedLocal = localPart.Substring(0, visibleChars) + new string('*', Math.Max(3, localPart.Length - visibleChars));

            return $"{maskedLocal}@{domain}";
        }

        #endregion
    }
}
