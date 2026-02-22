using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SLBFE.HRM.API.Application.Services.Interfaces;

namespace SLBFE.HRM.API.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EmployeeTypeController : ControllerBase
    {
        private readonly IEmployeeTypeService _employeeTypeService;
        private readonly ILogger<EmployeeTypeController> _logger;

        public EmployeeTypeController(IEmployeeTypeService employeeTypeService, ILogger<EmployeeTypeController> logger)
        {
            _employeeTypeService = employeeTypeService;
            _logger = logger;
        }

        /// <summary>
        /// Get all employee types
        /// </summary>
        [HttpGet]
        [AllowAnonymous] // Allow public access for user account creation form
        public async Task<IActionResult> GetAllEmployeeTypes()
        {
            try
            {
                var employeeTypes = await _employeeTypeService.GetAllEmployeeTypesAsync();
                return Ok(employeeTypes);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching employee types");
                return StatusCode(500, "An error occurred while fetching employee types");
            }
        }
    }
}
