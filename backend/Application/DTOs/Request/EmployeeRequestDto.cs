using System.ComponentModel.DataAnnotations;

namespace SLBFE.HRM.API.Application.DTOs.Request
{
    /// <summary>
    /// Create Employee Request DTO
    /// </summary>
    public class CreateEmployeeDto
    {
        #region Basic Information
        [MaxLength(20)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string NameWithInitials { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string NIC { get; set; } = string.Empty;

        [Required]
        public DateTime DateOfBirth { get; set; }

        [Required]
        [MaxLength(100)]
        public string Division { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Designation { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Grade { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        public string CivilStatus { get; set; } = string.Empty;
        #endregion

        #region Address Information
        [Required]
        [MaxLength(200)]
        public string PermanentAddressLine1 { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? PermanentAddressLine2 { get; set; }

        [Required]
        [MaxLength(100)]
        public string PermanentTown { get; set; } = string.Empty;

        [MaxLength(200)]
        public string? TemporaryAddressLine1 { get; set; }

        [MaxLength(200)]
        public string? TemporaryAddressLine2 { get; set; }

        [MaxLength(100)]
        public string? TemporaryTown { get; set; }
        #endregion

        #region Contact Information
        [Required]
        [MaxLength(20)]
        [Phone]
        public string MobileNumber { get; set; } = string.Empty;

        [MaxLength(20)]
        [Phone]
        public string? PhoneNumber { get; set; }

        [Required]
        [MaxLength(100)]
        [EmailAddress]
        public string EmailAddress { get; set; } = string.Empty;
        #endregion

        #region Educational Background
        public string? GCEOLDetails { get; set; }
        public string? GCEALDetails { get; set; }
        public string? HigherStudiesDetails { get; set; }
        #endregion

        #region Employment Details
        [Required]
        [MaxLength(50)]
        public string TypeOfEmployment { get; set; } = string.Empty;

        public DateTime? DateOfPermanent { get; set; }
        public DateTime? JoinDateContract { get; set; }
        public DateTime? JoinDateCasual { get; set; }

        /// <summary>
        /// Employee Number - Auto-generated if not provided
        /// </summary>
        [MaxLength(50)]
        public string? EmployeeNumber { get; set; }
        #endregion

        #region Additional Information
        [MaxLength(10)]
        public string? Gender { get; set; }

        [MaxLength(50)]
        public string? Nationality { get; set; }

        [MaxLength(5)]
        public string? BloodGroup { get; set; }

        [MaxLength(100)]
        public string? Department { get; set; }

        public int? ReportingManagerId { get; set; }

        [Range(0, 9999999.99)]
        public decimal? BasicSalary { get; set; }

        public string? Notes { get; set; }
        #endregion
    }

    /// <summary>
    /// Update Employee Request DTO
    /// </summary>
    public class UpdateEmployeeDto
    {
        #region Basic Information
        [MaxLength(20)]
        public string? Title { get; set; }

        [MaxLength(200)]
        public string? FullName { get; set; }

        [MaxLength(100)]
        public string? NameWithInitials { get; set; }

        [MaxLength(100)]
        public string? FirstName { get; set; }

        [MaxLength(100)]
        public string? LastName { get; set; }

        [MaxLength(20)]
        public string? NIC { get; set; }

        public DateTime? DateOfBirth { get; set; }

        [MaxLength(100)]
        public string? Division { get; set; }

        [MaxLength(100)]
        public string? Designation { get; set; }

        [MaxLength(50)]
        public string? Grade { get; set; }

        [MaxLength(20)]
        public string? CivilStatus { get; set; }
        #endregion

        #region Address Information
        [MaxLength(200)]
        public string? PermanentAddressLine1 { get; set; }

        [MaxLength(200)]
        public string? PermanentAddressLine2 { get; set; }

        [MaxLength(100)]
        public string? PermanentTown { get; set; }

        [MaxLength(200)]
        public string? TemporaryAddressLine1 { get; set; }

        [MaxLength(200)]
        public string? TemporaryAddressLine2 { get; set; }

        [MaxLength(100)]
        public string? TemporaryTown { get; set; }
        #endregion

        #region Contact Information
        [MaxLength(20)]
        [Phone]
        public string? MobileNumber { get; set; }

        [MaxLength(20)]
        [Phone]
        public string? PhoneNumber { get; set; }

        [MaxLength(100)]
        [EmailAddress]
        public string? EmailAddress { get; set; }
        #endregion

        #region Educational Background
        public string? GCEOLDetails { get; set; }
        public string? GCEALDetails { get; set; }
        public string? HigherStudiesDetails { get; set; }
        #endregion

        #region Employment Details
        [MaxLength(50)]
        public string? TypeOfEmployment { get; set; }

        public DateTime? DateOfPermanent { get; set; }
        public DateTime? JoinDateContract { get; set; }
        public DateTime? JoinDateCasual { get; set; }
        #endregion

        #region Additional Information
        [MaxLength(10)]
        public string? Gender { get; set; }

        [MaxLength(50)]
        public string? Nationality { get; set; }

        [MaxLength(5)]
        public string? BloodGroup { get; set; }

        [MaxLength(100)]
        public string? Department { get; set; }

        public int? ReportingManagerId { get; set; }

        [Range(0, 9999999.99)]
        public decimal? BasicSalary { get; set; }

        public string? Notes { get; set; }
        #endregion
    }

    /// <summary>
    /// Employee search and filter DTO
    /// </summary>
    public class EmployeeSearchDto
    {
        public string? EmployeeNumber { get; set; }
        public string? FullName { get; set; }
        public string? Division { get; set; }
        public string? Designation { get; set; }
        public string? Department { get; set; }
        public string? TypeOfEmployment { get; set; }
        public string? Status { get; set; }
        public int? ReportingManagerId { get; set; }
        public DateTime? JoinDateFrom { get; set; }
        public DateTime? JoinDateTo { get; set; }
        public int? PageNumber { get; set; } = 1;
        public int? PageSize { get; set; } = 10;
        public string? SortBy { get; set; } = "FullName";
        public bool? SortDescending { get; set; } = false;
    }
}