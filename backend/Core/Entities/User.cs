using System.ComponentModel.DataAnnotations;

namespace SLBFE.HRM.API.Core.Entities
{
    /// <summary>
    /// User entity for authentication and authorization
    /// </summary>
    public class User
    {
        /// <summary>
        /// User ID - Primary Key
        /// </summary>
        [Key]
        public int UserId { get; set; }

        /// <summary>
        /// Employee ID - Foreign Key to Employees table
        /// </summary>
        [Required]
        [MaxLength(50)]
        public string EmployeeId { get; set; } = string.Empty;

        /// <summary>
        /// Role ID - Foreign Key to Roles table
        /// </summary>
        [Required]
        public int RoleID { get; set; }

        /// <summary>
        /// Username for login
        /// </summary>
        [Required]
        [MaxLength(50)]
        public string UserName { get; set; } = string.Empty;

        /// <summary>
        /// Hashed password
        /// </summary>
        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        /// <summary>
        /// User status (Active, Inactive, etc.)
        /// </summary>
        [MaxLength(20)]
        public string? Status { get; set; }

        /// <summary>
        /// Last login timestamp
        /// </summary>
        public DateTime? LastLogin { get; set; }

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
