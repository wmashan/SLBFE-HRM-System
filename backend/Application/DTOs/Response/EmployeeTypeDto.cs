namespace SLBFE.HRM.API.Application.DTOs.Response
{
    /// <summary>
    /// Employee Type DTO for API responses
    /// </summary>
    public class EmployeeTypeDto
    {
        public int EmployeeTypeId { get; set; }
        public string TypeName { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}
