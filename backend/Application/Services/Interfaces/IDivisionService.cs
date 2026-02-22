using SLBFE.HRM.API.Application.DTOs.Response;

namespace SLBFE.HRM.API.Application.Services.Interfaces
{
    /// <summary>
    /// Division service interface
    /// </summary>
    public interface IDivisionService
    {
        /// <summary>
        /// Get all divisions
        /// </summary>
        Task<IEnumerable<DivisionDto>> GetAllDivisionsAsync();
    }
}
