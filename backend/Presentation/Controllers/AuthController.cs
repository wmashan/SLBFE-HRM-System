using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SLBFE.HRM.API.Application.Services.Interfaces;
using SLBFE.HRM.API.Application.DTOs.Request;

namespace SLBFE.HRM.API.Presentation.Controllers
{
    /// <summary>
    /// Authentication controller
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        /// <summary>
        /// User login endpoint
        /// </summary>
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var loginResponse = await _authService.LoginAsync(loginDto);

                if (loginResponse == null)
                {
                    return Unauthorized(new { message = "Invalid username or password" });
                }

                return Ok(loginResponse);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login");
                return StatusCode(500, new { message = "An error occurred during login" });
            }
        }
    }
}
