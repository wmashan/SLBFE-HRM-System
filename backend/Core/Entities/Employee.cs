using System.ComponentModel.DataAnnotations;

namespace SLBFE.HRM.API.Core.Entities
{
    /// <summary>
    /// Employee entity with comprehensive personal, educational and employment information
    /// </summary>
    public class Employee
    {
        #region Primary Key
        /// <summary>
        /// Employee Number (unique identifier) - Primary Key
        /// </summary>
        [Key]
        [Required]
        [MaxLength(50)]
        public string EmployeeId { get; set; } = string.Empty;
        #endregion

        #region Basic Information
        /// <summary>
        /// Employee Title (Mr., Mrs., Ms., Dr., Prof., etc.) - Foreign Key to Titles table
        /// </summary>
        [Required]
        public int TitleId { get; set; }

        /// <summary>
        /// Full Name of the employee
        /// </summary>
        [Required]
        [MaxLength(200)]
        public string FullName { get; set; } = string.Empty;

        /// <summary>
        /// Name with Initials (e.g., J.A. Perera)
        /// </summary>
        [Required]
        [MaxLength(100)]
        public string NameInitials { get; set; } = string.Empty;

        /// <summary>
        /// First Name
        /// </summary>
        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;

        /// <summary>
        /// Last Name
        /// </summary>
        [Required]
        [MaxLength(100)]
        public string LastName { get; set; } = string.Empty;

        /// <summary>
        /// National Identity Card Number
        /// </summary>
        [Required]
        [MaxLength(20)]
        public string Nic { get; set; } = string.Empty;

        /// <summary>
        /// Date of Birth
        /// </summary>
        public DateTime BirthDate { get; set; }

        /// <summary>
        /// Employee Division - Foreign Key to Division table
        /// </summary>
        [Required]
        public int DivisionId { get; set; }

        /// <summary>
        /// Employee Designation/Position
        /// </summary>
        [Required]
        [MaxLength(100)]
        public string DesignationId { get; set; } = string.Empty;

        /// <summary>
        /// Employee Grade
        /// </summary>
        [Required]
        [MaxLength(50)]
        public string GradeId { get; set; } = string.Empty;

        /// <summary>
        /// Civil Status (Single, Married, Divorced, Widowed)
        /// </summary>
        [Required]
        [MaxLength(20)]
        public string CivilStatusId { get; set; } = string.Empty;
        #endregion

        #region Address Information
        /// <summary>
        /// Permanent Address Line 1
        /// </summary>
        [Required]
        [MaxLength(200)]
        public string PermanentAddressL1 { get; set; } = string.Empty;

        /// <summary>
        /// Permanent Address Line 2
        /// </summary>
        [MaxLength(200)]
        public string? PermanentAddressL2 { get; set; }

        /// <summary>
        /// Permanent Address Town
        /// </summary>
        [Required]
        [MaxLength(100)]
        public string PermanentTownId { get; set; } = string.Empty;

        /// <summary>
        /// Temporary Address Line 1
        /// </summary>
        [MaxLength(200)]
        public string? TemporaryAddressL1 { get; set; }

        /// <summary>
        /// Temporary Address Line 2
        /// </summary>
        [MaxLength(200)]
        public string? TemporaryAddressL2 { get; set; }

        /// <summary>
        /// Temporary Address Town
        /// </summary>
        [MaxLength(100)]
        public string? TemporaryTownId { get; set; }
        #endregion

        #region Contact Information
        /// <summary>
        /// Personal Mobile Number
        /// </summary>
        [Required]
        [MaxLength(20)]
        public string Contact1 { get; set; } = string.Empty;

        /// <summary>
        /// Official Phone Number
        /// </summary>
        [MaxLength(20)]
        public string? Contact2 { get; set; }

        /// <summary>
        /// Email Address
        /// </summary>
        [Required]
        [MaxLength(100)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        #endregion

        #region Educational Background
        /// <summary>
        /// GCE O/L Examination Details
        /// JSON string to store subject details, results, year, etc.
        /// </summary>
        public string? OL { get; set; }

        /// <summary>
        /// GCE A/L Examination Details
        /// JSON string to store subject details, results, year, etc.
        /// </summary>
        public string? AL { get; set; }

        /// <summary>
        /// Higher Studies Details
        /// JSON string to store degree details, institution, year, etc.
        /// </summary>
        public string? HigherStudies { get; set; }
        #endregion

        #region Employment Details
        /// <summary>
        /// Type of Employment (Permanent, Contract, Casual) - Foreign Key to EmployeeType table
        /// </summary>
        [Required]
        public int EmployeeTypeId { get; set; }

        /// <summary>
        /// Date when employee became permanent
        /// </summary>
        public DateTime? PermanentDate { get; set; }

        /// <summary>
        /// Join Date for Contract employees
        /// </summary>
        public DateTime? JoinDateContract { get; set; }

        /// <summary>
        /// Join Date for Casual employees
        /// </summary>
        public DateTime? JoinDateCasual { get; set; }

        /// <summary>
        /// Profile Picture URL
        /// </summary>
        [MaxLength(500)]
        public string? ProfilePictureUrl { get; set; }
        #endregion

        #region Audit Fields
        /// <summary>
        /// Record creation timestamp
        /// </summary>
        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Record last update timestamp
        /// </summary>
        public DateTime? UpdatedAt { get; set; }
        #endregion
    }
}