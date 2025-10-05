using SLBFE.HRM.API.Core.Enums;

namespace SLBFE.HRM.API.Core.Entities
{
    /// <summary>
    /// Medical request entity for employee medical reimbursement applications
    /// </summary>
    public class MedicalRequest : BaseEntity
    {
        /// <summary>
        /// Employee ID who is applying for medical reimbursement
        /// </summary>
        public int EmployeeId { get; set; }

        /// <summary>
        /// Request number (auto-generated unique identifier)
        /// </summary>
        public string RequestNumber { get; set; } = string.Empty;

        /// <summary>
        /// Type of medical request
        /// </summary>
        public MedicalRequestType RequestType { get; set; }

        /// <summary>
        /// Date of medical treatment
        /// </summary>
        public DateTime TreatmentDate { get; set; }

        /// <summary>
        /// Hospital/Clinic/Provider name
        /// </summary>
        public string MedicalProvider { get; set; } = string.Empty;

        /// <summary>
        /// Diagnosis or reason for treatment
        /// </summary>
        public string Diagnosis { get; set; } = string.Empty;

        /// <summary>
        /// Detailed description of the medical request
        /// </summary>
        public string Description { get; set; } = string.Empty;

        /// <summary>
        /// Total amount claimed for reimbursement
        /// </summary>
        public decimal ClaimedAmount { get; set; }

        /// <summary>
        /// Amount approved for reimbursement (may be less than claimed)
        /// </summary>
        public decimal? ApprovedAmount { get; set; }

        /// <summary>
        /// Status of the medical request
        /// </summary>
        public MedicalRequestStatus Status { get; set; } = MedicalRequestStatus.Pending;

        /// <summary>
        /// Supporting document file paths (comma-separated)
        /// </summary>
        public string? Attachments { get; set; }

        /// <summary>
        /// Date when the request was submitted
        /// </summary>
        public DateTime SubmittedDate { get; set; }

        /// <summary>
        /// ID of the approver (HR Manager or Admin)
        /// </summary>
        public int? ApprovedBy { get; set; }

        /// <summary>
        /// Date when the request was reviewed/approved/rejected
        /// </summary>
        public DateTime? ReviewedDate { get; set; }

        /// <summary>
        /// Comments from the approver
        /// </summary>
        public string? ApproverComments { get; set; }

        /// <summary>
        /// Date when payment was made
        /// </summary>
        public DateTime? PaymentDate { get; set; }

        /// <summary>
        /// Payment reference number
        /// </summary>
        public string? PaymentReference { get; set; }

        /// <summary>
        /// Rejection reason if rejected
        /// </summary>
        public string? RejectionReason { get; set; }
    }
}
