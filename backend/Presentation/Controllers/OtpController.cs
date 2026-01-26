using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SLBFE.HRM.API.Application.DTOs.Request;
using SLBFE.HRM.API.Application.Services.Interfaces;

namespace SLBFE.HRM.API.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OtpController : ControllerBase
    {
        private readonly IOtpService _otpService;
        private readonly ILogger<OtpController> _logger;

        public OtpController(IOtpService otpService, ILogger<OtpController> logger)
        {
            _otpService = otpService;
            _logger = logger;
        }

        /// <summary>
        /// Generate OTP for user registration
        /// </summary>
        [HttpPost("generate")]
        [AllowAnonymous]
        public async Task<IActionResult> GenerateOtp([FromBody] OtpGenerateRequestDto request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Email))
                {
                    return BadRequest(new { success = false, message = "Email is required" });
                }

                var result = await _otpService.GenerateOtpAsync(request);
                
                if (result.Success)
                {
                    return Ok(result);
                }

                return BadRequest(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating OTP");
                return StatusCode(500, new { success = false, message = "An error occurred while generating OTP" });
            }
        }

        /// <summary>
        /// Verify OTP
        /// </summary>
        [HttpPost("verify")]
        [AllowAnonymous]
        public async Task<IActionResult> VerifyOtp([FromBody] OtpVerifyRequestDto request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Otp))
                {
                    return BadRequest(new { success = false, message = "Email and OTP are required" });
                }

                var result = await _otpService.VerifyOtpAsync(request);
                
                if (result.Success)
                {
                    return Ok(result);
                }

                return BadRequest(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error verifying OTP");
                return StatusCode(500, new { success = false, message = "An error occurred while verifying OTP" });
            }
        }
    }
}
