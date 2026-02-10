.using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SLBFE.HRM.API.Core.Entities
{
    /// <summary>
    /// System settings entity for storing application configuration
    /// </summary>
    [Table("SystemSettings")]
    public class SystemSettings
    {
        /// <summary>
        /// Setting ID - Primary Key
        /// </summary>
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// Setting key (e.g., JWT_Secret_Key, JWT_Expiry_Minutes)
        /// </summary>
        [Required]
        [MaxLength(100)]
        public string SettingKey { get; set; } = string.Empty;

        /// <summary>
        /// Setting value
        /// </summary>
        [Required]
        public string SettingValue { get; set; } = string.Empty;

        /// <summary>
        /// Setting description
        /// </summary>
        [MaxLength(500)]
        public string? Description { get; set; }

        /// <summary>
        /// Record creation timestamp
        /// </summary>
        [Required]
        public DateTime CreatedAt { get; set; }

        /// <summary>
        /// Record last update timestamp
        /// </summary>
        [Required]
        public DateTime UpdatedAt { get; set; }
    }
}
