using SLBFE.HRM.API.Application.DTOs.Response;

namespace SLBFE.HRM.API.Application.Services.Interfaces
{
    /// <summary>
    /// Grade service interface
    /// </summary>
    public interface IGradeService
    {
        /// <summary>
        /// Get all grades
        /// </summary>
        Task<IEnumerable<GradeDto>> GetAllGradesAsync();
    }
}
