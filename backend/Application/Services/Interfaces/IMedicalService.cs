using SLBFE.HRM.API.Application.DTOs.Request;
using SLBFE.HRM.API.Application.DTOs.Response;
using SLBFE.HRM.API.Core.Enums;

namespace SLBFE.HRM.API.Application.Services.Interfaces
{
    /// <summary>
    /// Service interface for medical request operations
    /// </summary>
    public interface IMedicalService
    {
        /// <summary>
        /// Get medical request by ID
        /// </summary>
        Task<MedicalRequestDto?> GetByIdAsync(int id);

        /// <summary>
        /// Get medical request by request number
        /// </summary>
        Task<MedicalRequestDto?> GetByRequestNumberAsync(string requestNumber);

        /// <summary>
        /// Get all medical requests for an employee
        /// </summary>
        Task<IEnumerable<MedicalRequestDto>> GetEmployeeMedicalRequestsAsync(int employeeId);

        /// <summary>
        /// Get medical balance for an employee
        /// </summary>
        Task<MedicalBalanceDto> GetMedicalBalanceAsync(int employeeId, int? year = null);

        /// <summary>
        /// Get all medical requests with filters
        /// </summary>
        Task<IEnumerable<MedicalRequestDto>> GetAllMedicalRequestsAsync(MedicalRequestFilterDto filter);

        /// <summary>
        /// Create new medical request
        /// </summary>
        Task<MedicalRequestDto> CreateMedicalRequestAsync(int employeeId, CreateMedicalRequestDto dto);

        /// <summary>
        /// Update medical request status
        /// </summary>
        Task<MedicalRequestDto> UpdateRequestStatusAsync(int id, int approverId, UpdateMedicalRequestStatusDto dto);

        /// <summary>
        /// Mark medical request as paid
        /// </summary>
        Task<MedicalRequestDto> MarkAsPaidAsync(int id, MarkAsPaidDto dto);

        /// <summary>
        /// Delete medical request
        /// </summary>
        Task<bool> DeleteMedicalRequestAsync(int id);

        /// <summary>
        /// Get medical statistics (for admin/HR dashboard)
        /// </summary>
        Task<MedicalStatisticsDto> GetMedicalStatisticsAsync(int? year = null);
    }
}
