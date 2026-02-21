using System.ComponentModel.DataAnnotations;

namespace SLBFE.HRM.API.Application.DTOs.Request
{
    /// <summary>
    /// Create Employee Request DTO
    /// </summary>
    public class CreateEmployeeDto
    {
        #region Basic Information
        [Required]
        public int TitleId { get; set; }

        [Required]
        [MaxLength(200)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string NameInitials { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string Nic { get; set; } = string.Empty;

        [Required]
        public DateTime BirthDate { get; set; }

        [Required]
        public int DivisionId { get; set; }

        [Required]
        [MaxLength(100)]
        public string DesignationId { get; set; } = string.Empty;

        [MaxLength(50)]
        public string GradeId { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string CivilStatusId { get; set; } = string.Empty;
        #endregion

        #region Address Information
        [Required]
        [MaxLength(200)]
        public string PermanentAddressL1 { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? PermanentAddressL2 { get; set; }

        [Required]
        [MaxLength(100)]
        public string PermanentTownId { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? TemporaryAddressL1 { get; set; }

        [MaxLength(200)]
        public string? TemporaryAddressL2 { get; set; }

        [MaxLength(100)]
        public string? TemporaryTownId { get; set; }
        #endregion

        #region Contact Information
        [Required]
        [MaxLength(20)]
        [Phone]
        public string Contact1 { get; set; } = string.Empty;

        [MaxLength(20)]
        [Phone]
        public string? Contact2 { get; set; }

        [Required]
        [MaxLength(100)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        #endregion

        #region Educational Background
        public string? OL { get; set; }
        public string? AL { get; set; }
        public string? HigherStudies { get; set; }
        #endregion

        #region Employment Details
        [Required]
        public int EmployeeTypeId { get; set; }

        public DateTime? PermanentDate { get; set; }
        public DateTime? JoinDateContract { get; set; }
        public DateTime? JoinDateCasual { get; set; }

        /// <summary>
        /// Employee Number - Auto-generated if not provided
        /// </summary>
        [MaxLength(50)]
        public string? EmployeeId { get; set; }

        /// <summary>
        /// Profile Picture URL
        /// </summary>
        [MaxLength(500)]
        public string? ProfilePictureUrl { get; set; }
        #endregion
    }

    /// <summary>
    /// Update Employee Request DTO
    /// </summary>
    public class UpdateEmployeeDto
    {
        #region Basic Information
        public int? TitleId { get; set; }

        [MaxLength(200)]
        public string? FullName { get; set; }

        [MaxLength(100)]
        public string? NameInitials { get; set; }

        [MaxLength(100)]
        public string? FirstName { get; set; }

        [MaxLength(100)]
        public string? LastName { get; set; }

        [MaxLength(20)]
        public string? Nic { get; set; }

        public DateTime? BirthDate { get; set; }

        public int? DivisionId { get; set; }

        [MaxLength(100)]
        public string? DesignationId { get; set; }

        [MaxLength(50)]
        public string? GradeId { get; set; }

        [MaxLength(20)]
        public string? CivilStatusId { get; set; }
        #endregion

        #region Address Information
        [MaxLength(200)]
        public string? PermanentAddressL1 { get; set; }

        [MaxLength(200)]
        public string? PermanentAddressL2 { get; set; }

        [MaxLength(100)]
        public string? PermanentTownId { get; set; }

        [MaxLength(200)]
        public string? TemporaryAddressL1 { get; set; }

        [MaxLength(200)]
        public string? TemporaryAddressL2 { get; set; }

        [MaxLength(100)]
        public string? TemporaryTownId { get; set; }
        #endregion

        #region Contact Information
        [MaxLength(20)]
        [Phone]
        public string? Contact1 { get; set; }

        [MaxLength(20)]
        [Phone]
        public string? Contact2 { get; set; }

        [MaxLength(100)]
        [EmailAddress]
        public string? Email { get; set; }
        #endregion

        #region Educational Background
        public string? OL { get; set; }
        public string? AL { get; set; }
        public string? HigherStudies { get; set; }
        #endregion

        #region Employment Details
        public int? EmployeeTypeId { get; set; }

        public DateTime? PermanentDate { get; set; }
        public DateTime? JoinDateContract { get; set; }
        public DateTime? JoinDateCasual { get; set; }

        /// <summary>
        /// Profile Picture URL
        /// </summary>
        [MaxLength(500)]
        public string? ProfilePictureUrl { get; set; }
        #endregion
    }

    /// <summary>
    /// Employee search and filter DTO
    /// </summary>
    public class EmployeeSearchDto
    {
        public string? EmployeeId { get; set; }
        public string? FullName { get; set; }
        public int? DivisionId { get; set; }
        public string? DesignationId { get; set; }
        public int? EmployeeTypeId { get; set; }
        public DateTime? JoinDateFrom { get; set; }
        public DateTime? JoinDateTo { get; set; }
        public int? PageNumber { get; set; } = 1;
        public int? PageSize { get; set; } = 10;
        public string? SortBy { get; set; } = "CreatedAt";
        public string? Status { get; set; }
        public bool? SortDescending { get; set; } = true;
    }
    /// <summary>
    /// Review Employee Application Request DTO
    /// </summary>
    public class ReviewEmployeeApplicationDto
    {
        [Required]
        [MaxLength(20)]
        public string Status { get; set; } = string.Empty; // "Approved" or "Rejected"

        [MaxLength(500)]
        public string? ReviewComments { get; set; }
    }
}
