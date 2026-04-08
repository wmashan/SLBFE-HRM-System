namespace SLBFE.HRM.API.Application.DTOs.Response
{
    /// <summary>
    /// Login response DTO
    /// </summary>
    public class LoginResponseDto
    {
        public int UserId { get; set; }
        public string EmployeeId { get; set; } = string.Empty;
        public int RoleId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime? LastLogin { get; set; }
    }
}
