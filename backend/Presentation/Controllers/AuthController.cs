using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SLBFE.HRM.API.Application.Services.Interfaces;
using SLBFE.HRM.API.Application.DTOs.Request;

namespace SLBFE.HRM.API.Presentation.Controllers
{
    /// <summary>
    /// Authentication controller with JWT and Refresh Token support
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        /// <summary>
        /// User login endpoint - Returns JWT access token and refresh token
        /// </summary>
        /// <param name="loginDto">Login credentials (username and password)</param>
        /// <returns>Token response with access token and refresh token</returns>
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var tokenResponse = await _authService.LoginAsync(loginDto);

                if (tokenResponse == null)
                {
                    return Unauthorized(new { message = "Invalid username or password" });
                }

                return Ok(tokenResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login");
                return StatusCode(500, new { message = "An error occurred during login" });
            }
        }

        /// <summary>
        /// Refresh access token using a valid refresh token
        /// </summary>
        /// <param name="refreshTokenDto">Refresh token request containing access and refresh tokens</param>
        /// <returns>New token response with refreshed access token and refresh token</returns>
        [HttpPost("refresh-token")]
        [AllowAnonymous]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenDto refreshTokenDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var tokenResponse = await _authService.RefreshTokenAsync(refreshTokenDto);

                if (tokenResponse == null)
                {
                    return Unauthorized(new { message = "Invalid or expired refresh token" });
                }

                return Ok(tokenResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during token refresh");
                return StatusCode(500, new { message = "An error occurred during token refresh" });
            }
        }

        /// <summary>
        /// Revoke a specific refresh token (logout)
        /// </summary>
        /// <param name="request">Object containing the refresh token to revoke</param>
        /// <returns>Success or failure message</returns>
        [HttpPost("revoke-token")]
        [Authorize]
        public async Task<IActionResult> RevokeToken([FromBody] RevokeTokenRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.RefreshToken))
                    return BadRequest(new { message = "Refresh token is required" });

                var result = await _authService.RevokeRefreshTokenAsync(request.RefreshToken);

                if (!result)
                {
                    return NotFound(new { message = "Refresh token not found" });
                }

                return Ok(new { message = "Token revoked successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during token revocation");
                return StatusCode(500, new { message = "An error occurred during token revocation" });
            }
        }

        /// <summary>
        /// Revoke all refresh tokens for the current user (logout from all devices)
        /// </summary>
        /// <returns>Number of tokens revoked</returns>
        [HttpPost("revoke-all-tokens")]
        [Authorize]
        public async Task<IActionResult> RevokeAllTokens()
        {
            try
            {
                var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new { message = "Invalid user ID in token" });
                }

                var revokedCount = await _authService.RevokeAllUserTokensAsync(userId);

                return Ok(new 
                { 
                    message = $"Successfully revoked {revokedCount} token(s)",
                    revokedCount 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error revoking all tokens");
                return StatusCode(500, new { message = "An error occurred while revoking tokens" });
            }
        }

        /// <summary>
        /// Initiate forgot password process - sends OTP to registered email
        /// </summary>
        /// <param name="forgotPasswordDto">Employee ID</param>
        /// <returns>Success message with masked email</returns>
        [HttpPost("forgot-password")]
        [AllowAnonymous]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto forgotPasswordDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var result = await _authService.ForgotPasswordAsync(forgotPasswordDto);

                if (!result.Success)
                {
                    return BadRequest(new { message = result.Message });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in forgot password");
                return StatusCode(500, new { message = "An error occurred. Please try again later." });
            }
        }

        /// <summary>
        /// Reset password after OTP verification
        /// </summary>
        /// <param name="resetPasswordDto">Reset password request with Employee ID, OTP, and new password</param>
        /// <returns>Success or failure message</returns>
        [HttpPost("reset-password")]
        [AllowAnonymous]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var result = await _authService.ResetPasswordAsync(resetPasswordDto);

                if (!result.Success)
                {
                    return BadRequest(new { message = result.Message });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in reset password");
                return StatusCode(500, new { message = "An error occurred. Please try again later." });
            }
        }
    }

    /// <summary>
    /// Request model for token revocation
    /// </summary>
    public class RevokeTokenRequest
    {
        public string RefreshToken { get; set; } = string.Empty;
    }
}
