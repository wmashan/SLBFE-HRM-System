using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SLBFE.HRM.API.Application.Services.Interfaces;

namespace SLBFE.HRM.API.Presentation.Controllers
{
    /// <summary>
    /// Upload controller for handling file uploads
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class UploadController : ControllerBase
    {
        private readonly IFileUploadService _fileUploadService;
        private readonly ILogger<UploadController> _logger;

        public UploadController(IFileUploadService fileUploadService, ILogger<UploadController> logger)
        {
            _fileUploadService = fileUploadService;
            _logger = logger;
        }

        /// <summary>
        /// Upload a profile picture
        /// </summary>
        /// <param name="file">The image file to upload</param>
        /// <param name="employeeId">Optional employee ID for naming</param>
        /// <returns>The URL of the uploaded file</returns>
        [HttpPost("profile")]
        [AllowAnonymous] // Allow anonymous for user registration
        public async Task<IActionResult> UploadProfilePicture([FromForm] IFormFile file, [FromForm] string? employeeId = null)
        {
            try
            {
                if (file == null)
                {
                    return BadRequest(new { success = false, message = "No file was provided." });
                }

                // Validate the file
                if (!_fileUploadService.ValidateImageFile(file, out string errorMessage))
                {
                    return BadRequest(new { success = false, message = errorMessage });
                }

                // Upload the file
                var fileUrl = await _fileUploadService.UploadProfilePictureAsync(file, employeeId);

                return Ok(new 
                { 
                    success = true, 
                    message = "Profile picture uploaded successfully",
                    data = new { url = fileUrl }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading profile picture");
                return StatusCode(500, new 
                { 
                    success = false, 
                    message = "An error occurred while uploading the profile picture" 
                });
            }
        }

        /// <summary>
        /// Delete an uploaded file
        /// </summary>
        /// <param name="fileUrl">The relative URL of the file to delete</param>
        /// <returns>Success status</returns>
        [HttpDelete]
        [Authorize(Roles = "SystemAdmin,HR Manager")]
        public async Task<IActionResult> DeleteFile([FromQuery] string fileUrl)
        {
            try
            {
                if (string.IsNullOrEmpty(fileUrl))
                {
                    return BadRequest(new { success = false, message = "File URL is required." });
                }

                var result = await _fileUploadService.DeleteFileAsync(fileUrl);

                if (result)
                {
                    return Ok(new 
                    { 
                        success = true, 
                        message = "File deleted successfully" 
                    });
                }
                else
                {
                    return NotFound(new 
                    { 
                        success = false, 
                        message = "File not found" 
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting file");
                return StatusCode(500, new 
                { 
                    success = false, 
                    message = "An error occurred while deleting the file" 
                });
            }
        }
    }
}
