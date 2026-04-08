using Microsoft.AspNetCore.Mvc;
using SLBFE.HRM.API.Application.DTOs.Response;

namespace SLBFE.HRM.API.Presentation.Controllers
{
    /// <summary>
    /// Base API controller with common functionality
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public abstract class BaseApiController : ControllerBase
    {
        /// <summary>
        /// Returns a success response with data
        /// </summary>
        protected IActionResult SuccessResponse<T>(T data, string message = "Success")
        {
            var response = new ApiResponse<T>
            {
                Success = true,
                Message = message,
                Data = data
            };
            return Ok(response);
        }

        /// <summary>
        /// Returns an error response
        /// </summary>
        protected IActionResult ErrorResponse(string message, List<string>? errors = null, int statusCode = 400)
        {
            var response = new ApiResponse<object>
            {
                Success = false,
                Message = message,
                Errors = errors ?? new List<string>()
            };
            return StatusCode(statusCode, response);
        }

        /// <summary>
        /// Returns a not found response
        /// </summary>
        protected IActionResult NotFoundResponse(string message = "Resource not found")
        {
            return ErrorResponse(message, null, 404);
        }

        /// <summary>
        /// Returns an unauthorized response
        /// </summary>
        protected IActionResult UnauthorizedResponse(string message = "Unauthorized access")
        {
            return ErrorResponse(message, null, 401);
        }
    }
}
