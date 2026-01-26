namespace SLBFE.HRM.API.Application.DTOs.Response
{
    /// <summary>
    /// DTO for OTP generation response
    /// </summary>
    public class OtpGenerateResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
    }

    /// <summary>
    /// DTO for OTP verification response
    /// </summary>
    public class OtpVerifyResponseDto
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
