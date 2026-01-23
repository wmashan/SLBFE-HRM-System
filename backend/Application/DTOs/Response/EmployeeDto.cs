using SLBFE.HRM.API.Core.Enums;
using System.ComponentModel.DataAnnotations;

namespace SLBFE.HRM.API.Application.DTOs.Response
{
    /// <summary>
    /// Employee Response DTO for API responses
    /// </summary>
    public class EmployeeDto
    {
        public int Id { get; set; }
        
        #region Basic Information
        public string Title { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string NameWithInitials { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string NIC { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string Division { get; set; } = string.Empty;
        public string Designation { get; set; } = string.Empty;
        public string Grade { get; set; } = string.Empty;
        public string CivilStatus { get; set; } = string.Empty;
        #endregion

        #region Address Information
        public string PermanentAddressLine1 { get; set; } = string.Empty;
        public string? PermanentAddressLine2 { get; set; }
        public string PermanentTown { get; set; } = string.Empty;
        public string? TemporaryAddressLine1 { get; set; }
        public string? TemporaryAddressLine2 { get; set; }
        public string? TemporaryTown { get; set; }
        #endregion

        #region Contact Information
        public string MobileNumber { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public string EmailAddress { get; set; } = string.Empty;
        #endregion

        #region Educational Background
        public string? GCEOLDetails { get; set; }
        public string? GCEALDetails { get; set; }
        public string? HigherStudiesDetails { get; set; }
        #endregion

        #region Employment Details
        public string TypeOfEmployment { get; set; } = string.Empty;
        public string EmploymentStatus { get; set; } = string.Empty;
        public DateTime? DateOfPermanent { get; set; }
        public DateTime? JoinDateContract { get; set; }
        public DateTime? JoinDateCasual { get; set; }
        public string EmployeeNumber { get; set; } = string.Empty;
        #endregion

        #region Additional Information
        public string? Gender { get; set; }
        public string? Nationality { get; set; }
        public string? BloodGroup { get; set; }
        public string? ProfilePicture { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? Department { get; set; }
        public int? ReportingManagerId { get; set; }
        public string? ReportingManagerName { get; set; }
        public decimal? BasicSalary { get; set; }
        public string? Notes { get; set; }
        #endregion

        #region Audit Information
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public string? UpdatedBy { get; set; }
        #endregion
    }

    /// <summary>
    /// Employee Summary DTO for lists and summaries
    /// </summary>
    public class EmployeeSummaryDto
    {
        public int Id { get; set; }
        public string EmployeeNumber { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string NameWithInitials { get; set; } = string.Empty;
        public string Designation { get; set; } = string.Empty;
        public string Division { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string EmailAddress { get; set; } = string.Empty;
        public string MobileNumber { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string TypeOfEmployment { get; set; } = string.Empty;
        public DateTime? JoinDate { get; set; }
    }
}