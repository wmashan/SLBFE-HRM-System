using System.ComponentModel.DataAnnotations;

namespace SLBFE.HRM.API.Core.Entities
{
    /// <summary>
    /// OTP Record entity for temporary storage
    /// </summary>
    public class OtpRecord
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(6)]
        public string Otp { get; set; } = string.Empty;

        [Required]
        public DateTime CreatedAt { get; set; }

        [Required]
        public DateTime ExpiresAt { get; set; }

        public bool IsUsed { get; set; }

        [MaxLength(50)]
        public string Purpose { get; set; } = string.Empty;
    }
}
