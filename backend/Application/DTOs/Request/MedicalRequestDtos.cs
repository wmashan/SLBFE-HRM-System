using SLBFE.HRM.API.Core.Enums;
using System.ComponentModel.DataAnnotations;

namespace SLBFE.HRM.API.Application.DTOs.Request
{
    /// <summary>
    /// DTO for creating a new medical request - Form No: HR/F/07
    /// </summary>
    public class CreateMedicalRequestDto
    {
        // Employee Information
        [Required(ErrorMessage = "Employee number is required")]
        public string EmployeeNumber { get; set; } = string.Empty;

        [Required(ErrorMessage = "Division is required")]
        [StringLength(100, ErrorMessage = "Division cannot exceed 100 characters")]
        public string Division { get; set; } = string.Empty;

        [Required(ErrorMessage = "Applicant name is required")]
        [StringLength(200, ErrorMessage = "Applicant name cannot exceed 200 characters")]
        public string ApplicantName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Marital status is required")]
        [RegularExpression("^(Married|Unmarried)$", ErrorMessage = "Marital status must be Married or Unmarried")]
        public string MaritalStatus { get; set; } = string.Empty;

        // Patient Information
        [Required(ErrorMessage = "Patient name is required")]
        [StringLength(200, ErrorMessage = "Patient name cannot exceed 200 characters")]
        public string PatientName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Relationship to applicant is required")]
        [RegularExpression("^(Self|Spouse|Child|Parent|Other)$", ErrorMessage = "Invalid relationship")]
        public string RelationshipToApplicant { get; set; } = string.Empty;

        [Required(ErrorMessage = "Patient age is required")]
        [Range(0, 120, ErrorMessage = "Age must be between 0 and 120")]
        public int PatientAge { get; set; }

        // Medical Treatment Details
        [Required(ErrorMessage = "Hospital/Pharmacy/Clinic name is required")]
        [StringLength(200, ErrorMessage = "Medical provider name cannot exceed 200 characters")]
        public string MedicalProvider { get; set; } = string.Empty;

        [Required(ErrorMessage = "Doctor name is required")]
        [StringLength(200, ErrorMessage = "Doctor name cannot exceed 200 characters")]
        public string DoctorName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Diagnosis is required")]
        [StringLength(500, ErrorMessage = "Diagnosis cannot exceed 500 characters")]
        public string Diagnosis { get; set; } = string.Empty;

        [Required(ErrorMessage = "Treatment date is required")]
        public DateTime TreatmentDate { get; set; }

        [StringLength(100, ErrorMessage = "Treatment duration cannot exceed 100 characters")]
        public string? TreatmentDuration { get; set; }

        // Financial Details
        [Required(ErrorMessage = "Requested amount is required")]
        [Range(0.01, 1000000, ErrorMessage = "Requested amount must be greater than 0 and less than 1,000,000")]
        public decimal RequestedAmount { get; set; }

        [Required(ErrorMessage = "Claimed amount is required")]
        [Range(0.01, 1000000, ErrorMessage = "Claimed amount must be greater than 0 and less than 1,000,000")]
        public decimal ClaimedAmount { get; set; }

        public decimal AvailableAmount { get; set; }

        /// <summary>
        /// Request type - can be inferred or set explicitly
        /// </summary>
        public MedicalRequestType RequestType { get; set; } = MedicalRequestType.OutpatientTreatment;

        /// <summary>
        /// List of attachment file paths
        /// </summary>
        public List<string>? Attachments { get; set; }

        [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
        public string? Description { get; set; }
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
