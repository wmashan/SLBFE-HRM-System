namespace SLBFE.HRM.API.Application.DTOs.Response
{
    /// <summary>
    /// Response DTO for forgot password request
    /// </summary>
    public class ForgotPasswordResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? Email { get; set; }
    }
}
