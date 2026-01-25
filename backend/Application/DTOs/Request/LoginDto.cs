using System.ComponentModel.DataAnnotations;

namespace SLBFE.HRM.API.Application.DTOs.Request
{
    /// <summary>
    /// Login request DTO
    /// </summary>
    public class LoginDto
    {
        [Required]
        [MaxLength(50)]
        public string UserName { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }
}
