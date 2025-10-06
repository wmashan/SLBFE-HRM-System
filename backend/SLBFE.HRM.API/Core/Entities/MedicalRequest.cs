using SLBFE.HRM.API.Core.Enums;

namespace SLBFE.HRM.API.Core.Entities
{
    /// <summary>
    /// Medical request entity for employee medical reimbursement applications
    /// Form No: HR/F/07
    /// </summary>
    public class MedicalRequest : BaseEntity
    {
        /// <summary>
        /// Employee ID who is applying for medical reimbursement
        /// </summary>
        public int EmployeeId { get; set; }

        /// <summary>
        /// Employee Number
        /// </summary>
        public string EmployeeNumber { get; set; } = string.Empty;

        /// <summary>
        /// Division
        /// </summary>
        public string Division { get; set; } = string.Empty;

        /// <summary>
        /// Applicant Name
        /// </summary>
        public string ApplicantName { get; set; } = string.Empty;

        /// <summary>
        /// Marital Status - Married or Unmarried
        /// </summary>
        public string MaritalStatus { get; set; } = string.Empty;

        /// <summary>
        /// Request number (auto-generated unique identifier)
        /// </summary>
        public string RequestNumber { get; set; } = string.Empty;

        /// <summary>
        /// Type of medical request
        /// </summary>
        public MedicalRequestType RequestType { get; set; }

        // Patient Information
        /// <summary>
        /// Name of those who received treatment
        /// </summary>
        public string PatientName { get; set; } = string.Empty;

        /// <summary>
        /// Family relationship to the applicant (Self, Spouse, Child, Parent, Other)
        /// </summary>
        public string RelationshipToApplicant { get; set; } = string.Empty;

        /// <summary>
        /// Patient's age
        /// </summary>
        public int PatientAge { get; set; }

        // Medical Treatment Details
        /// <summary>
        /// Hospital/Pharmacy/Clinic where treatment was received
        /// </summary>
        public string MedicalProvider { get; set; } = string.Empty;

        /// <summary>
        /// Name of the doctor who prescribed the treatment
        /// </summary>
        public string DoctorName { get; set; } = string.Empty;

        /// <summary>
        /// What illness were you treated for?
        /// </summary>
        public string Diagnosis { get; set; } = string.Empty;

        /// <summary>
        /// Date of treatment received
        /// </summary>
        public DateTime TreatmentDate { get; set; }

        /// <summary>
        /// Duration of treatment received
        /// </summary>
        public string? TreatmentDuration { get; set; }

        // Financial Details
        /// <summary>
        /// Requested amount
        /// </summary>
        public decimal RequestedAmount { get; set; }

        /// <summary>
        /// Claimed amount
        /// </summary>
        public decimal ClaimedAmount { get; set; }

        /// <summary>
        /// Available amount (calculated from remaining balance)
        /// </summary>
        public decimal AvailableAmount { get; set; }

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

        /// <summary>
        /// Additional description
        /// </summary>
        public string? Description { get; set; }
    }
}
