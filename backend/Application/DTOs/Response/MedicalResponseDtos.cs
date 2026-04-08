using SLBFE.HRM.API.Core.Enums;

namespace SLBFE.HRM.API.Application.DTOs.Response
{
    /// <summary>
    /// Medical request response DTO
    /// </summary>
    public class MedicalRequestDto : BaseResponseDto
    {
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public string EmployeeNumber { get; set; } = string.Empty;
        public string RequestNumber { get; set; } = string.Empty;
        public MedicalRequestType RequestType { get; set; }
        public string RequestTypeName { get; set; } = string.Empty;
        public DateTime TreatmentDate { get; set; }
        public string MedicalProvider { get; set; } = string.Empty;
        public string Diagnosis { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal ClaimedAmount { get; set; }
        public decimal? ApprovedAmount { get; set; }
        public MedicalRequestStatus Status { get; set; }
        public string StatusName { get; set; } = string.Empty;
        public List<string> Attachments { get; set; } = new();
        public DateTime SubmittedDate { get; set; }
        public int? ApprovedBy { get; set; }
        public string? ApproverName { get; set; }
        public DateTime? ReviewedDate { get; set; }
        public string? ApproverComments { get; set; }
        public DateTime? PaymentDate { get; set; }
        public string? PaymentReference { get; set; }
        public string? RejectionReason { get; set; }
    }

    /// <summary>
    /// Medical balance summary DTO
    /// </summary>
    public class MedicalBalanceDto
    {
        /// <summary>
        /// Annual medical allowance allocated to employee
        /// </summary>
        public decimal AnnualAllowance { get; set; }

        /// <summary>
        /// Total amount claimed so far this year
        /// </summary>
        public decimal TotalClaimed { get; set; }

        /// <summary>
        /// Total amount approved so far this year
        /// </summary>
        public decimal TotalApproved { get; set; }

        /// <summary>
        /// Total amount paid so far this year
        /// </summary>
        public decimal TotalPaid { get; set; }

        /// <summary>
        /// Amount pending approval
        /// </summary>
        public decimal PendingAmount { get; set; }

        /// <summary>
        /// Remaining balance available for claims
        /// </summary>
        public decimal RemainingBalance { get; set; }

        /// <summary>
        /// Current year
        /// </summary>
        public int Year { get; set; }

        /// <summary>
        /// Number of pending requests
        /// </summary>
        public int PendingRequests { get; set; }

        /// <summary>
        /// Number of approved requests
        /// </summary>
        public int ApprovedRequests { get; set; }

        /// <summary>
        /// Number of rejected requests
        /// </summary>
        public int RejectedRequests { get; set; }

        /// <summary>
        /// Total number of requests this year
        /// </summary>
        public int TotalRequests { get; set; }
    }

    /// <summary>
    /// Medical statistics DTO for admin/HR dashboard
    /// </summary>
    public class MedicalStatisticsDto
    {
        public int TotalRequests { get; set; }
        public int PendingRequests { get; set; }
        public int ApprovedRequests { get; set; }
        public int RejectedRequests { get; set; }
        public decimal TotalClaimedAmount { get; set; }
        public decimal TotalApprovedAmount { get; set; }
        public decimal TotalPaidAmount { get; set; }
        public Dictionary<string, int> RequestsByType { get; set; } = new();
        public Dictionary<string, decimal> AmountByType { get; set; } = new();
    }
}
