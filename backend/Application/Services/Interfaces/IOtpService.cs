using SLBFE.HRM.API.Application.DTOs.Request;
using SLBFE.HRM.API.Application.DTOs.Response;

namespace SLBFE.HRM.API.Application.Services.Interfaces
{
    /// <summary>
    /// OTP service interface
    /// </summary>
    public interface IOtpService
    {
        /// <summary>
        /// Generate OTP for user registration
        /// </summary>
        Task<OtpGenerateResponseDto> GenerateOtpAsync(OtpGenerateRequestDto request);

        /// <summary>
        /// Verify OTP
        /// </summary>
        Task<OtpVerifyResponseDto> VerifyOtpAsync(OtpVerifyRequestDto request);
    }
}
