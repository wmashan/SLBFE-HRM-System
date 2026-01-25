using Microsoft.AspNetCore.Mvc;
using SLBFE.HRM.API.Application.Services.Interfaces;

namespace SLBFE.HRM.API.Presentation.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TitleController : ControllerBase
    {
        private readonly ITitleService _titleService;
        private readonly ILogger<TitleController> _logger;

        public TitleController(ITitleService titleService, ILogger<TitleController> logger)
        {
            _titleService = titleService;
            _logger = logger;
        }

        /// <summary>
        /// Get all titles
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAllTitles()
        {
            try
            {
                var titles = await _titleService.GetAllTitlesAsync();
                return Ok(titles);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching titles");
                return StatusCode(500, "An error occurred while fetching titles");
            }
        }
    }
}
