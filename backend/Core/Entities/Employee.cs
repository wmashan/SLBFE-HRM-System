using SLBFE.HRM.API.Core.Enums;
using System.ComponentModel.DataAnnotations;

namespace SLBFE.HRM.API.Core.Entities
{
    /// <summary>
    /// Employee entity with comprehensive personal, educational and employment information
    /// </summary>
    public class Employee : BaseEntity
    {
        #region Basic Information
        /// <summary>
        /// Employee Title (Mr., Mrs., Ms., Dr., Prof., etc.)
        /// </summary>
        [MaxLength(20)]
        public string Title { get; set; } = string.Empty;

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
        public string NameWithInitials { get; set; } = string.Empty;

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
        public string NIC { get; set; } = string.Empty;

        /// <summary>
        /// Date of Birth
        /// </summary>
        public DateTime DateOfBirth { get; set; }

        /// <summary>
        /// Employee Division
        /// </summary>
        [Required]
        [MaxLength(100)]
        public string Division { get; set; } = string.Empty;

        /// <summary>
        /// Employee Designation/Position
        /// </summary>
        [Required]
        [MaxLength(100)]
        public string Designation { get; set; } = string.Empty;

        /// <summary>
        /// Employee Grade
        /// </summary>
        [MaxLength(50)]
        public string Grade { get; set; } = string.Empty;

        /// <summary>
        /// Civil Status (Single, Married, Divorced, Widowed)
        /// </summary>
        [Required]
        [MaxLength(20)]
        public string CivilStatus { get; set; } = string.Empty;
        #endregion

        #region Address Information
        /// <summary>
        /// Permanent Address Line 1
        /// </summary>
        [Required]
        [MaxLength(200)]
        public string PermanentAddressLine1 { get; set; } = string.Empty;

        /// <summary>
        /// Permanent Address Line 2
        /// </summary>
        [MaxLength(200)]
        public string? PermanentAddressLine2 { get; set; }

        /// <summary>
        /// Permanent Address Town
        /// </summary>
        [Required]
        [MaxLength(100)]
        public string PermanentTown { get; set; } = string.Empty;

        /// <summary>
        /// Temporary Address Line 1
        /// </summary>
        [MaxLength(200)]
        public string? TemporaryAddressLine1 { get; set; }

        /// <summary>
        /// Temporary Address Line 2
        /// </summary>
        [MaxLength(200)]
        public string? TemporaryAddressLine2 { get; set; }

        /// <summary>
        /// Temporary Address Town
        /// </summary>
        [MaxLength(100)]
        public string? TemporaryTown { get; set; }
        #endregion

        #region Contact Information
        /// <summary>
        /// Personal Mobile Number
        /// </summary>
        [Required]
        [MaxLength(20)]
        public string MobileNumber { get; set; } = string.Empty;

        /// <summary>
        /// Official Phone Number
        /// </summary>
        [MaxLength(20)]
        public string? PhoneNumber { get; set; }

        /// <summary>
        /// Email Address
        /// </summary>
        [Required]
        [MaxLength(100)]
        [EmailAddress]
        public string EmailAddress { get; set; } = string.Empty;
        #endregion

        #region Educational Background
        /// <summary>
        /// GCE O/L Examination Details
        /// JSON string to store subject details, results, year, etc.
        /// </summary>
        public string? GCEOLDetails { get; set; }

        /// <summary>
        /// GCE A/L Examination Details
        /// JSON string to store subject details, results, year, etc.
        /// </summary>
        public string? GCEALDetails { get; set; }

        /// <summary>
        /// Higher Studies Details
        /// JSON string to store degree details, institution, year, etc.
        /// </summary>
        public string? HigherStudiesDetails { get; set; }
        #endregion

        #region Employment Details
        /// <summary>
        /// Type of Employment (Permanent, Contract, Casual)
        /// </summary>
        [Required]
        [MaxLength(50)]
        public string TypeOfEmployment { get; set; } = string.Empty;

        /// <summary>
        /// Current Employment Status
        /// </summary>
        public EmploymentStatus EmploymentStatus { get; set; }

        /// <summary>
        /// Date when employee became permanent
        /// </summary>
        public DateTime? DateOfPermanent { get; set; }

        /// <summary>
        /// Join Date for Contract employees
        /// </summary>
        public DateTime? JoinDateContract { get; set; }

        /// <summary>
        /// Join Date for Casual employees
        /// </summary>
        public DateTime? JoinDateCasual { get; set; }

        /// <summary>
        /// Employee Number (unique identifier)
        /// </summary>
        [Required]
        [MaxLength(50)]
        public string EmployeeNumber { get; set; } = string.Empty;
        #endregion

        #region Additional Information
        /// <summary>
        /// Gender
        /// </summary>
        [MaxLength(10)]
        public string? Gender { get; set; }

        /// <summary>
        /// Nationality
        /// </summary>
        [MaxLength(50)]
        public string? Nationality { get; set; }

        /// <summary>
        /// Blood Group
        /// </summary>
        [MaxLength(5)]
        public string? BloodGroup { get; set; }

        /// <summary>
        /// Employee Profile Picture
        /// </summary>
        public string? ProfilePicture { get; set; }

        /// <summary>
        /// Employee Status (Active, Inactive, Terminated, etc.)
        /// </summary>
        public EmployeeStatus Status { get; set; } = EmployeeStatus.Active;

        /// <summary>
        /// Department/Branch the employee belongs to
        /// </summary>
        [MaxLength(100)]
        public string? Department { get; set; }

        /// <summary>
        /// Direct reporting manager's employee ID
        /// </summary>
        public int? ReportingManagerId { get; set; }

        /// <summary>
        /// Basic salary amount
        /// </summary>
        public decimal? BasicSalary { get; set; }

        /// <summary>
        /// Additional notes or comments
        /// </summary>
        public string? Notes { get; set; }
        #endregion

        #region Navigation Properties
        /// <summary>
        /// Navigation property for reporting manager
        /// </summary>
        public virtual Employee? ReportingManager { get; set; }

        /// <summary>
        /// Navigation property for subordinates
        /// </summary>
        public virtual ICollection<Employee> Subordinates { get; set; } = new List<Employee>();

        /// <summary>
        /// Navigation property for medical requests
        /// </summary>
        public virtual ICollection<MedicalRequest> MedicalRequests { get; set; } = new List<MedicalRequest>();
        #endregion
    }
}