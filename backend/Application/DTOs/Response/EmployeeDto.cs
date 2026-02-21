using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SLBFE.HRM.API.Application.DTOs.Response
{
    /// <summary>
    /// Employee Response DTO for API responses
    /// </summary>
    public class EmployeeDto
    {
        #region Primary Key
        public string EmployeeId { get; set; } = string.Empty;
        #endregion
        
        #region Basic Information
        public int TitleId { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string NameInitials { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Nic { get; set; } = string.Empty;
        public DateTime BirthDate { get; set; }
        public int DivisionId { get; set; }
        public string DesignationId { get; set; } = string.Empty;
        public string GradeId { get; set; } = string.Empty;
        public string CivilStatusId { get; set; } = string.Empty;
        #endregion

        #region Address Information
        public string PermanentAddressL1 { get; set; } = string.Empty;
        public string? PermanentAddressL2 { get; set; }
        public string PermanentTownId { get; set; } = string.Empty;
        public string? TemporaryAddressL1 { get; set; }
        public string? TemporaryAddressL2 { get; set; }
        public string? TemporaryTownId { get; set; }
        #endregion

        #region Contact Information
        public string Contact1 { get; set; } = string.Empty;
        public string? Contact2 { get; set; }
        public string Email { get; set; } = string.Empty;
        #endregion

        #region Educational Background
        public string? OL { get; set; }
        public string? AL { get; set; }
        public string? HigherStudies { get; set; }
        #endregion

        #region Employment Details
        public int EmployeeTypeId { get; set; }
        public DateTime? PermanentDate { get; set; }
        public DateTime? JoinDateContract { get; set; }
        public DateTime? JoinDateCasual { get; set; }

        /// <summary>
        /// Profile Picture URL
        /// </summary>
        public string? ProfilePictureUrl { get; set; }
        #endregion

        #region Audit Information
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        #endregion
    }

    /// <summary>
    /// Employee Summary DTO for lists and summaries
    /// </summary>
    public class EmployeeSummaryDto
    {
        public string EmployeeId { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string NameInitials { get; set; } = string.Empty;
        public string DesignationId { get; set; } = string.Empty;
        public int DivisionId { get; set; }
        public string Email { get; set; } = string.Empty;
        public string Contact1 { get; set; } = string.Empty;
        public int EmployeeTypeId { get; set; }
        public DateTime? JoinDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? ProfilePictureUrl { get; set; }
        public string? Status { get; set; }  // User status from Users table
    }

    /// <summary>
    /// Employee with generated login credentials (returned only during registration)
    /// </summary>
    public class EmployeeWithCredentialsDto : EmployeeDto
    {
        /// <summary>
        /// Username for login (same as EmployeeId)
        /// </summary>
        [JsonPropertyName("username")]
        public string Username { get; set; } = string.Empty;

        /// <summary>
        /// Generated password (only returned once during creation)
        /// </summary>
        [JsonPropertyName("password")]
        public string Password { get; set; } = string.Empty;
    }
}
