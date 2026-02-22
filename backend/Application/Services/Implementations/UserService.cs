using Microsoft.EntityFrameworkCore;
using SLBFE.HRM.API.Application.DTOs.Request;
using SLBFE.HRM.API.Application.DTOs.Response;
using SLBFE.HRM.API.Application.Services.Interfaces;
using SLBFE.HRM.API.Infrastructure.Data.Context;

namespace SLBFE.HRM.API.Application.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<UserService> _logger;

        public UserService(ApplicationDbContext context, ILogger<UserService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            try
            {
                var users = await _context.Users
                    .OrderBy(u => u.UserName)
                    .Select(u => new UserDto
                    {
                        UserId = u.UserId,
                        UserName = u.UserName,
                        RoleId = u.RoleID,
                        RoleName = GetRoleName(u.RoleID),
                        Status = u.Status ?? "Active",
                        LastLogin = u.LastLogin,
                        UpdatedAt = u.UpdatedAt
                    })
                    .ToListAsync();

                return users;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving users");
                throw;
            }
        }

        public async Task<bool> UpdateUserRoleAsync(int userId, UpdateUserRoleDto updateRoleDto)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                
                if (user == null)
                {
                    _logger.LogWarning($"User with ID {userId} not found");
                    return false;
                }

                // Validate role ID
                if (updateRoleDto.RoleId < 1 || updateRoleDto.RoleId > 3)
                {
                    _logger.LogWarning($"Invalid role ID: {updateRoleDto.RoleId}");
                    return false;
                }

                user.RoleID = updateRoleDto.RoleId;
                user.UpdatedAt = DateTime.Now;

                await _context.SaveChangesAsync();

                _logger.LogInformation($"Updated role for user {user.UserName} to {GetRoleName(updateRoleDto.RoleId)}");
                
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating role for user {userId}");
                throw;
            }
        }

        private static string GetRoleName(int roleId)
        {
            return roleId switch
            {
                1 => "Admin",
                2 => "HR Manager",
                3 => "Employee",
                _ => "Unknown"
            };
        }
    }
}
