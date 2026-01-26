using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SLBFE.HRM.API.Application.Services.Interfaces;

namespace SLBFE.HRM.API.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GradeController : ControllerBase
    {
        private readonly IGradeService _gradeService;
        private readonly ILogger<GradeController> _logger;

        public GradeController(IGradeService gradeService, ILogger<GradeController> logger)
        {
            _gradeService = gradeService;
            _logger = logger;
        }

        /// <summary>
        /// Get all grades
        /// </summary>
        [HttpGet]
        [AllowAnonymous] // Allow public access for user account creation form
        public async Task<IActionResult> GetAllGrades()
        {
            try
            {
                var grades = await _gradeService.GetAllGradesAsync();
                return Ok(grades);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching grades");
                return StatusCode(500, "An error occurred while fetching grades");
            }
        }
    }
}
