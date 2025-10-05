using SLBFE.HRM.API.Core.Enums;
using System.ComponentModel.DataAnnotations;

namespace SLBFE.HRM.API.Application.DTOs.Request
{
    /// <summary>
    /// DTO for creating a new medical request
    /// </summary>
    public class CreateMedicalRequestDto
    {
        [Required(ErrorMessage = "Request type is required")]
        public MedicalRequestType RequestType { get; set; }

        [Required(ErrorMessage = "Treatment date is required")]
        public DateTime TreatmentDate { get; set; }

        [Required(ErrorMessage = "Medical provider is required")]
        [StringLength(200, ErrorMessage = "Medical provider name cannot exceed 200 characters")]
        public string MedicalProvider { get; set; } = string.Empty;

        [Required(ErrorMessage = "Diagnosis is required")]
        [StringLength(500, ErrorMessage = "Diagnosis cannot exceed 500 characters")]
        public string Diagnosis { get; set; } = string.Empty;

        [Required(ErrorMessage = "Description is required")]
        [StringLength(1000, ErrorMessage = "Description cannot exceed 1000 characters")]
        public string Description { get; set; } = string.Empty;

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
