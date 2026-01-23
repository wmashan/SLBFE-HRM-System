using SLBFE.HRM.API.Application.DTOs.Request;
using SLBFE.HRM.API.Application.DTOs.Response;
using SLBFE.HRM.API.Core.Entities;

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
        /// Get employee by ID
        /// </summary>
        Task<EmployeeDto?> GetEmployeeByIdAsync(int id);

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
        /// Update existing employee
        /// </summary>
        Task<EmployeeDto> UpdateEmployeeAsync(int id, UpdateEmployeeDto updateEmployeeDto);

        /// <summary>
        /// Soft delete employee
        /// </summary>
        Task<bool> DeleteEmployeeAsync(int id);

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
        /// Get employees by reporting manager
        /// </summary>
        Task<IEnumerable<EmployeeSummaryDto>> GetSubordinatesAsync(int managerId);

        /// <summary>
        /// Get total employee count
        /// </summary>
        Task<int> GetEmployeeCountAsync();

        /// <summary>
        /// Get employees by division
        /// </summary>
        Task<IEnumerable<EmployeeSummaryDto>> GetEmployeesByDivisionAsync(string division);

        /// <summary>
        /// Get employees by designation
        /// </summary>
        Task<IEnumerable<EmployeeSummaryDto>> GetEmployeesByDesignationAsync(string designation);

        /// <summary>
        /// Update employee status
        /// </summary>
        Task<bool> UpdateEmployeeStatusAsync(int id, Core.Enums.EmployeeStatus status);
    }
}