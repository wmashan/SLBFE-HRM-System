using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SLBFE.HRM.API.Application.DTOs.Request;
using SLBFE.HRM.API.Application.DTOs.Response;
using SLBFE.HRM.API.Application.Services.Interfaces;
using SLBFE.HRM.API.Infrastructure.Data.Context;
using BCrypt.Net;

namespace SLBFE.HRM.API.Application.Services.Implementations
{
    /// <summary>
    /// Authentication service implementation
    /// </summary>
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<AuthService> _logger;

        public AuthService(ApplicationDbContext context, ILogger<AuthService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<LoginResponseDto?> LoginAsync(LoginDto loginDto)
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

                // Update last login timestamp
                user.LastLogin = DateTime.UtcNow;
                user.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                _logger.LogInformation($"User logged in successfully: {loginDto.UserName}, RoleId: {user.RoleID}");

                // Return user information
                return new LoginResponseDto
                {
                    UserId = user.UserId,
                    EmployeeId = user.EmployeeId,
                    RoleId = user.RoleID,
                    UserName = user.UserName,
                    Status = user.Status ?? "Active",
                    LastLogin = user.LastLogin
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error during login for user: {loginDto.UserName}");
                throw;
            }
        }
    }
}
