namespace SLBFE.HRM.API.Application.DTOs.Request
{
    /// <summary>
    /// DTO for OTP generation request
    /// </summary>
    public class OtpGenerateRequestDto
    {
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Purpose { get; set; } = "EmployeeRegistration";
    }

    /// <summary>
    /// DTO for OTP verification request
    /// </summary>
    public class OtpVerifyRequestDto
    {
        public string Email { get; set; } = string.Empty;
        public string Otp { get; set; } = string.Empty;
    }
}
