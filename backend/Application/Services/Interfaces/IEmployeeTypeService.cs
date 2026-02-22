using SLBFE.HRM.API.Application.DTOs.Response;

namespace SLBFE.HRM.API.Application.Services.Interfaces
{
    /// <summary>
    /// Employee Type service interface
    /// </summary>
    public interface IEmployeeTypeService
    {
        /// <summary>
        /// Get all employee types
        /// </summary>
        Task<IEnumerable<EmployeeTypeDto>> GetAllEmployeeTypesAsync();
    }
}
