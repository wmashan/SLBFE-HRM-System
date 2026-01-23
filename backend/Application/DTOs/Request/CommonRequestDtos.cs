namespace SLBFE.HRM.API.Application.DTOs.Request
{
    /// <summary>
    /// Base request DTO with common validation properties
    /// </summary>
    public abstract class BaseRequestDto
    {
        // Add common request properties if needed
    }

    /// <summary>
    /// Login request DTO
    /// </summary>
    public class LoginRequestDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public bool RememberMe { get; set; }
    }

    /// <summary>
    /// Pagination request DTO
    /// </summary>
    public class PaginationRequestDto
    {
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
        public string? SearchTerm { get; set; }
        public string? SortBy { get; set; }
        public bool SortDescending { get; set; }
    }
}
