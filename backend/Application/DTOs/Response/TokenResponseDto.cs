namespace SLBFE.HRM.API.Application.DTOs.Response
{
    /// <summary>
    /// DTO for token response containing access and refresh tokens
    /// </summary>
    public class TokenResponseDto
    {
        /// <summary>
        /// JWT access token
        /// </summary>
        public string AccessToken { get; set; } = string.Empty;

        /// <summary>
        /// Refresh token for obtaining new access tokens
        /// </summary>
        public string RefreshToken { get; set; } = string.Empty;

        /// <summary>
        /// Access token expiration time (in seconds from now)
        /// </summary>
        public int ExpiresIn { get; set; }

        /// <summary>
        /// Token type (usually "Bearer")
        /// </summary>
        public string TokenType { get; set; } = "Bearer";

        /// <summary>
        /// User ID
        /// </summary>
        public int UserId { get; set; }

        /// <summary>
        /// User's role ID
        /// </summary>
        public int RoleId { get; set; }

        /// <summary>
        /// Username
        /// </summary>
        public string UserName { get; set; } = string.Empty;
    }
}
