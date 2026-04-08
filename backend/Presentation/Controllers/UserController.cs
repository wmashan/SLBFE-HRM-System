using Microsoft.AspNetCore.Mvc;
using SLBFE.HRM.API.Application.DTOs.Request;
using SLBFE.HRM.API.Application.Services.Interfaces;

namespace SLBFE.HRM.API.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<UserController> _logger;

        public UserController(IUserService userService, ILogger<UserController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        /// <summary>
        /// Get all users
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _userService.GetAllUsersAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving users");
                return StatusCode(500, new { message = "An error occurred while retrieving users" });
            }
        }

        /// <summary>
        /// Update user role
        /// </summary>
        [HttpPut("{userId}/role")]
        public async Task<IActionResult> UpdateUserRole(int userId, [FromBody] UpdateUserRoleDto updateRoleDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var success = await _userService.UpdateUserRoleAsync(userId, updateRoleDto);

                if (!success)
                {
                    return NotFound(new { message = "User not found or invalid role ID" });
                }

                return Ok(new { message = "User role updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating role for user {userId}");
                return StatusCode(500, new { message = "An error occurred while updating user role" });
            }
        }
    }
}
