using SLBFE.HRM.API.Application.DTOs.Request;
using SLBFE.HRM.API.Application.DTOs.Response;

namespace SLBFE.HRM.API.Application.Services.Interfaces
{
    /// <summary>
    /// Authentication service interface
    /// </summary>
    public interface IAuthService
    {
        /// <summary>
        /// Authenticate user and return user information
        /// </summary>
        Task<LoginResponseDto?> LoginAsync(LoginDto loginDto);
    }
}
