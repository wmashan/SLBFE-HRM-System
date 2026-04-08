using System.ComponentModel.DataAnnotations;

namespace SLBFE.HRM.API.Application.DTOs.Request
{
    /// <summary>
    /// DTO for forgot password request
    /// </summary>
    public class ForgotPasswordDto
    {
        [Required(ErrorMessage = "Employee ID is required")]
        public string EmployeeId { get; set; } = string.Empty;
    }
}
