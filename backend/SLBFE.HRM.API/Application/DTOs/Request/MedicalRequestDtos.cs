using SLBFE.HRM.API.Core.Enums;
using System.ComponentModel.DataAnnotations;

namespace SLBFE.HRM.API.Application.DTOs.Request
{
    /// <summary>
    /// DTO for creating a new medical request
    /// </summary>
    public class CreateMedicalRequestDto
    {
        // Employee Information
        [Required(ErrorMessage = "Employee number is required")]
        public string EmployeeNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "Employee full name is required")]
        public string EmployeeFullName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Employee address is required")]
        public string EmployeeAddress { get; set; } = string.Empty;

        // Person in Respect of Whom Claim is Made
        [Required(ErrorMessage = "Patient name is required")]
        [StringLength(200, ErrorMessage = "Patient name cannot exceed 200 characters")]
        public string PatientName { get; set; } = string.Empty;

        public DateTime? PatientDateOfBirth { get; set; }

        [Required(ErrorMessage = "Patient sex is required")]
        [RegularExpression("^(M|F)$", ErrorMessage = "Sex must be M or F")]
        public string PatientSex { get; set; } = string.Empty;

        // General Hospital Information
        [Required(ErrorMessage = "Hospital name is required")]
        [StringLength(200, ErrorMessage = "Hospital name cannot exceed 200 characters")]
        public string MedicalProvider { get; set; } = string.Empty;

        [Required(ErrorMessage = "Government hospital status is required")]
        public bool IsGovernmentHospital { get; set; }

        // Period of Hospitalization
        public DateTime? HospitalizationFromDate { get; set; }
        
        public DateTime? HospitalizationToDate { get; set; }

        // Hospitalization Charges and Details
        [Required(ErrorMessage = "Charges breakdown is required")]
        [StringLength(2000, ErrorMessage = "Charges breakdown cannot exceed 2000 characters")]
        public string ChargesBreakdown { get; set; } = string.Empty;

        [Required(ErrorMessage = "Request type is required")]
        public MedicalRequestType RequestType { get; set; }

        [Required(ErrorMessage = "Treatment date is required")]
        public DateTime TreatmentDate { get; set; }

        [StringLength(500, ErrorMessage = "Diagnosis cannot exceed 500 characters")]
        public string? Diagnosis { get; set; }

        [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
        public string? Description { get; set; }

        [Required(ErrorMessage = "Claimed amount is required")]
        [Range(0.01, 1000000, ErrorMessage = "Claimed amount must be greater than 0 and less than 1,000,000")]
        public decimal ClaimedAmount { get; set; }

        /// <summary>
        /// List of attachment file paths
        /// </summary>
        public List<string>? Attachments { get; set; }
    }

    /// <summary>
    /// DTO for updating medical request status by HR/Admin
    /// </summary>
    public class UpdateMedicalRequestStatusDto
    {
        [Required(ErrorMessage = "Status is required")]
        public MedicalRequestStatus Status { get; set; }

        [Range(0, 1000000, ErrorMessage = "Approved amount must be between 0 and 1,000,000")]
        public decimal? ApprovedAmount { get; set; }

        [StringLength(500, ErrorMessage = "Comments cannot exceed 500 characters")]
        public string? ApproverComments { get; set; }

        [StringLength(500, ErrorMessage = "Rejection reason cannot exceed 500 characters")]
        public string? RejectionReason { get; set; }
    }

    /// <summary>
    /// DTO for marking medical request as paid
    /// </summary>
    public class MarkAsPaidDto
    {
        [Required(ErrorMessage = "Payment date is required")]
        public DateTime PaymentDate { get; set; }

        [Required(ErrorMessage = "Payment reference is required")]
        [StringLength(100, ErrorMessage = "Payment reference cannot exceed 100 characters")]
        public string PaymentReference { get; set; } = string.Empty;
    }

    /// <summary>
    /// DTO for filtering medical requests
    /// </summary>
    public class MedicalRequestFilterDto : PaginationRequestDto
    {
        public int? EmployeeId { get; set; }
        public MedicalRequestStatus? Status { get; set; }
        public MedicalRequestType? RequestType { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }
}
