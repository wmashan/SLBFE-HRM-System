using SLBFE.HRM.API.Application.DTOs.Request;
using SLBFE.HRM.API.Application.DTOs.Response;

namespace SLBFE.HRM.API.Application.Services.Interfaces
{
    /// <summary>
    /// Authentication service interface
    /// </summary>
    public interface IAuthService
    {
        /// <summary>
        /// Authenticate user and return JWT access token with refresh token
        /// </summary>
        /// <param name="loginDto">Login credentials</param>
        /// <returns>Token response with access and refresh tokens</returns>
        Task<TokenResponseDto?> LoginAsync(LoginDto loginDto);

        /// <summary>
        /// Refresh access token using a valid refresh token
        /// </summary>
        /// <param name="refreshTokenDto">Refresh token request containing access and refresh tokens</param>
        /// <returns>New token response with refreshed access and refresh tokens</returns>
        Task<TokenResponseDto?> RefreshTokenAsync(RefreshTokenDto refreshTokenDto);

        /// <summary>
        /// Revoke a refresh token (logout)
        /// </summary>
        /// <param name="refreshToken">Refresh token to revoke</param>
        /// <returns>True if revoked successfully</returns>
        Task<bool> RevokeRefreshTokenAsync(string refreshToken);

        /// <summary>
        /// Revoke all refresh tokens for a specific user
        /// </summary>
        /// <param name="userId">User ID</param>
        /// <returns>Number of tokens revoked</returns>
        Task<int> RevokeAllUserTokensAsync(int userId);

        /// <summary>
        /// Initiate forgot password process by sending OTP to user's email
        /// </summary>
        /// <param name="forgotPasswordDto">Employee ID</param>
        /// <returns>Response indicating success and masked email</returns>
        Task<ForgotPasswordResponseDto> ForgotPasswordAsync(ForgotPasswordDto forgotPasswordDto);

        /// <summary>
        /// Reset password after OTP verification
        /// </summary>
        /// <param name="resetPasswordDto">Reset password request with OTP and new password</param>
        /// <returns>Response indicating success</returns>
        Task<ForgotPasswordResponseDto> ResetPasswordAsync(ResetPasswordDto resetPasswordDto);
    }
}
