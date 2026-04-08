using System.ComponentModel.DataAnnotations;

namespace SLBFE.HRM.API.Application.DTOs.Request
{
    /// <summary>
    /// DTO for password reset request
    /// </summary>
    public class ResetPasswordDto
    {
        [Required(ErrorMessage = "Employee ID is required")]
        public string EmployeeId { get; set; } = string.Empty;

        [Required(ErrorMessage = "OTP is required")]
        [StringLength(6, MinimumLength = 6, ErrorMessage = "OTP must be 6 digits")]
        public string Otp { get; set; } = string.Empty;

        [Required(ErrorMessage = "New password is required")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters long")]
        public string NewPassword { get; set; } = string.Empty;

        [Required(ErrorMessage = "Confirm password is required")]
        [Compare("NewPassword", ErrorMessage = "Passwords do not match")]
        public string ConfirmPassword { get; set; } = string.Empty;
    }
}
