using SLBFE.HRM.API.Application.DTOs.Response;

namespace SLBFE.HRM.API.Application.Services.Interfaces
{
    /// <summary>
    /// Title service interface
    /// </summary>
    public interface ITitleService
    {
        /// <summary>
        /// Get all titles
        /// </summary>
        Task<IEnumerable<TitleDto>> GetAllTitlesAsync();
    }
}
