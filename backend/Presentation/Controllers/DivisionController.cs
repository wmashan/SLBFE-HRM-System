using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SLBFE.HRM.API.Application.Services.Interfaces;

namespace SLBFE.HRM.API.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DivisionController : ControllerBase
    {
        private readonly IDivisionService _divisionService;
        private readonly ILogger<DivisionController> _logger;

        public DivisionController(IDivisionService divisionService, ILogger<DivisionController> logger)
        {
            _divisionService = divisionService;
            _logger = logger;
        }

        /// <summary>
        /// Get all divisions
        /// </summary>
        [HttpGet]
        [AllowAnonymous] // Allow public access for user account creation form
        public async Task<IActionResult> GetAllDivisions()
        {
            try
            {
                var divisions = await _divisionService.GetAllDivisionsAsync();
                return Ok(divisions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching divisions");
                return StatusCode(500, "An error occurred while fetching divisions");
            }
        }
    }
}
