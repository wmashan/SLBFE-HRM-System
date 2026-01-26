using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SLBFE.HRM.API.Application.DTOs.Request;
using SLBFE.HRM.API.Application.DTOs.Response;
using SLBFE.HRM.API.Application.Services.Interfaces;
using SLBFE.HRM.API.Core.Entities;
using SLBFE.HRM.API.Infrastructure.Data.Context;

namespace SLBFE.HRM.API.Application.Services.Implementations
{
    /// <summary>
    /// OTP service implementation
    /// </summary>
    public class OtpService : IOtpService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<OtpService> _logger;

        public OtpService(ApplicationDbContext context, ILogger<OtpService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<OtpGenerateResponseDto> GenerateOtpAsync(OtpGenerateRequestDto request)
        {
            try
            {
                // Generate 6-digit OTP
                var random = new Random();
                var otp = random.Next(100000, 999999).ToString();

                var expiresAt = DateTime.UtcNow.AddMinutes(10); // OTP valid for 10 minutes

                // Delete any existing OTPs for this email
                var existingOtps = await _context.Set<OtpRecord>()
                    .Where(o => o.Email == request.Email && !o.IsUsed)
                    .ToListAsync();

                _context.Set<OtpRecord>().RemoveRange(existingOtps);

                // Store OTP in database
                var otpRecord = new OtpRecord
                {
                    Email = request.Email,
                    Otp = otp,
                    CreatedAt = DateTime.UtcNow,
                    ExpiresAt = expiresAt,
                    IsUsed = false,
                    Purpose = request.Purpose
                };

                _context.Set<OtpRecord>().Add(otpRecord);
                await _context.SaveChangesAsync();

                // Log OTP to console (for development purposes)
                _logger.LogInformation("===========================================");
                _logger.LogInformation($"OTP Generated for {request.Email}");
                _logger.LogInformation($"OTP Code: {otp}");
                _logger.LogInformation($"Valid until: {expiresAt.ToLocalTime():yyyy-MM-dd HH:mm:ss}");
                _logger.LogInformation("===========================================");

                // Also print to console directly
                Console.WriteLine("\n===========================================");
                Console.WriteLine($"OTP Generated for {request.Email}");
                Console.WriteLine($"OTP Code: {otp}");
                Console.WriteLine($"Phone: {request.PhoneNumber}");
                Console.WriteLine($"Valid until: {expiresAt.ToLocalTime():yyyy-MM-dd HH:mm:ss}");
                Console.WriteLine("===========================================\n");

                return new OtpGenerateResponseDto
                {
                    Success = true,
                    Message = $"OTP sent successfully to {request.Email}",
                    ExpiresAt = expiresAt
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating OTP");
                return new OtpGenerateResponseDto
                {
                    Success = false,
                    Message = "Failed to generate OTP. Please try again."
                };
            }
        }

        public async Task<OtpVerifyResponseDto> VerifyOtpAsync(OtpVerifyRequestDto request)
        {
            try
            {
                var otpRecord = await _context.Set<OtpRecord>()
                    .Where(o => o.Email == request.Email && o.Otp == request.Otp && !o.IsUsed)
                    .OrderByDescending(o => o.CreatedAt)
                    .FirstOrDefaultAsync();

                if (otpRecord == null)
                {
                    return new OtpVerifyResponseDto
                    {
                        Success = false,
                        Message = "Invalid OTP. Please check and try again."
                    };
                }

                if (otpRecord.ExpiresAt < DateTime.UtcNow)
                {
                    return new OtpVerifyResponseDto
                    {
                        Success = false,
                        Message = "OTP has expired. Please request a new one."
                    };
                }

                // Mark OTP as used
                otpRecord.IsUsed = true;
                await _context.SaveChangesAsync();

                _logger.LogInformation($"OTP verified successfully for {request.Email}");

                return new OtpVerifyResponseDto
                {
                    Success = true,
                    Message = "OTP verified successfully!"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error verifying OTP");
                return new OtpVerifyResponseDto
                {
                    Success = false,
                    Message = "Failed to verify OTP. Please try again."
                };
            }
        }
    }
}
