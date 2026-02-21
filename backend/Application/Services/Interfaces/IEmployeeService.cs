using SLBFE.HRM.API.Application.DTOs.Request;
using SLBFE.HRM.API.Application.DTOs.Response;

namespace SLBFE.HRM.API.Application.Services.Interfaces
{
    /// <summary>
    /// Employee service interface for employee management operations
    /// </summary>
    public interface IEmployeeService
    {
        /// <summary>
        /// Get all employees with optional filtering
        /// </summary>
        Task<IEnumerable<EmployeeSummaryDto>> GetEmployeesAsync(EmployeeSearchDto searchDto);

        /// <summary>
        /// Get employee by EmployeeId
        /// </summary>
        Task<EmployeeDto?> GetEmployeeByIdAsync(string employeeId);

        /// <summary>
        /// Get employee by employee number
        /// </summary>
        Task<EmployeeDto?> GetEmployeeByEmployeeNumberAsync(string employeeNumber);

        /// <summary>
        /// Get employee by email address
        /// </summary>
        Task<EmployeeDto?> GetEmployeeByEmailAsync(string email);

        /// <summary>
        /// Create new employee
        /// </summary>
        Task<EmployeeDto> CreateEmployeeAsync(CreateEmployeeDto createEmployeeDto);

        /// <summary>
        /// Create new employee and return with generated login credentials
        /// </summary>
        Task<EmployeeWithCredentialsDto> CreateEmployeeWithCredentialsAsync(CreateEmployeeDto createEmployeeDto);

        /// <summary>
        /// Update existing employee
        /// </summary>
        Task<EmployeeDto> UpdateEmployeeAsync(string employeeId, UpdateEmployeeDto updateEmployeeDto);

        /// <summary>
        /// Delete employee
        /// </summary>
        Task<bool> DeleteEmployeeAsync(string employeeId);

        /// <summary>
        /// Check if employee number exists
        /// </summary>
        Task<bool> EmployeeNumberExistsAsync(string employeeNumber);

        /// <summary>
        /// Check if NIC exists
        /// </summary>
        Task<bool> NICExistsAsync(string nic);

        /// <summary>
        /// Check if email exists
        /// </summary>
        Task<bool> EmailExistsAsync(string email);

        /// <summary>
        /// Get total employee count
        /// </summary>
        Task<int> GetEmployeeCountAsync();

        /// <summary>
        /// Get employees by division
        /// </summary>
        Task<IEnumerable<EmployeeSummaryDto>> GetEmployeesByDivisionAsync(int divisionId);

        /// <summary>
        /// Get employees by designation
        /// </summary>
        Task<IEnumerable<EmployeeSummaryDto>> GetEmployeesByDesignationAsync(string designation);

        /// <summary>
        /// Get pending employee applications
        /// </summary>
        Task<IEnumerable<EmployeeSummaryDto>> GetPendingApplicationsAsync();

        /// <summary>
        /// Get all employee applications with status
        /// </summary>
        Task<IEnumerable<EmployeeSummaryDto>> GetAllApplicationsAsync();

        /// <summary>
        /// Review employee application (Approve or Reject)
        /// </summary>
        Task<EmployeeDto> ReviewEmployeeApplicationAsync(string employeeId, ReviewEmployeeApplicationDto reviewDto, string reviewerId);
    }
}
