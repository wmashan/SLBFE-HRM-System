using SLBFE.HRM.API.Core.Entities;
using SLBFE.HRM.API.Core.Enums;

namespace SLBFE.HRM.API.Core.Interfaces
{
    /// <summary>
    /// Repository interface for medical requests
    /// </summary>
    public interface IMedicalRepository
    {
        /// <summary>
        /// Get medical request by ID
        /// </summary>
        Task<MedicalRequest?> GetByIdAsync(int id);

        /// <summary>
        /// Get medical request by request number
        /// </summary>
        Task<MedicalRequest?> GetByRequestNumberAsync(string requestNumber);

        /// <summary>
        /// Get all medical requests for an employee
        /// </summary>
        Task<IEnumerable<MedicalRequest>> GetByEmployeeIdAsync(int employeeId);

        /// <summary>
        /// Get medical requests for an employee by year
        /// </summary>
        Task<IEnumerable<MedicalRequest>> GetByEmployeeIdAndYearAsync(int employeeId, int year);

        /// <summary>
        /// Get medical requests by status
        /// </summary>
        Task<IEnumerable<MedicalRequest>> GetByStatusAsync(MedicalRequestStatus status);

        /// <summary>
        /// Get all medical requests with filters
        /// </summary>
        Task<IEnumerable<MedicalRequest>> GetAllAsync(
            int? employeeId = null,
            MedicalRequestStatus? status = null,
            MedicalRequestType? requestType = null,
            DateTime? fromDate = null,
            DateTime? toDate = null);

        /// <summary>
        /// Add new medical request
        /// </summary>
        Task<MedicalRequest> AddAsync(MedicalRequest medicalRequest);

        /// <summary>
        /// Update existing medical request
        /// </summary>
        Task<MedicalRequest> UpdateAsync(MedicalRequest medicalRequest);

        /// <summary>
        /// Delete medical request
        /// </summary>
        Task<bool> DeleteAsync(int id);

        /// <summary>
        /// Get total claimed amount for an employee in a specific year
        /// </summary>
        Task<decimal> GetTotalClaimedAmountByYearAsync(int employeeId, int year);

        /// <summary>
        /// Get total approved amount for an employee in a specific year
        /// </summary>
        Task<decimal> GetTotalApprovedAmountByYearAsync(int employeeId, int year);

        /// <summary>
        /// Get count of pending requests for an employee
        /// </summary>
        Task<int> GetPendingRequestsCountAsync(int employeeId);

        /// <summary>
        /// Generate unique request number
        /// </summary>
        Task<string> GenerateRequestNumberAsync();
    }
}
