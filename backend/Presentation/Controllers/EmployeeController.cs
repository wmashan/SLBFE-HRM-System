using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using SLBFE.HRM.API.Application.Services.Interfaces;
using SLBFE.HRM.API.Application.DTOs.Request;
using SLBFE.HRM.API.Application.DTOs.Response;
using SLBFE.HRM.API.Core.Enums;

namespace SLBFE.HRM.API.Presentation.Controllers
{
    /// <summary>
    /// Employee management controller
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;
        private readonly ILogger<EmployeeController> _logger;

        public EmployeeController(IEmployeeService employeeService, ILogger<EmployeeController> logger)
        {
            _employeeService = employeeService;
            _logger = logger;
        }

        /// <summary>
        /// Get all employees with optional filtering and pagination
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmployeeSummaryDto>>> GetEmployees([FromQuery] EmployeeSearchDto searchDto)
        {
            try
            {
                var employees = await _employeeService.GetEmployeesAsync(searchDto);
                return Ok(employees);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting employees");
                return StatusCode(500, "An error occurred while retrieving employees");
            }
        }

        /// <summary>
        /// Get employee by ID
        /// </summary>
        [HttpGet("{id:int}")]
        public async Task<ActionResult<EmployeeDto>> GetEmployeeById(int id)
        {
            try
            {
                var employee = await _employeeService.GetEmployeeByIdAsync(id);
                if (employee == null)
                    return NotFound($"Employee with ID {id} not found");

                return Ok(employee);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting employee by ID: {Id}", id);
                return StatusCode(500, "An error occurred while retrieving the employee");
            }
        }

        /// <summary>
        /// Get employee by employee number
        /// </summary>
        [HttpGet("by-employee-number/{employeeNumber}")]
        public async Task<ActionResult<EmployeeDto>> GetEmployeeByEmployeeNumber(string employeeNumber)
        {
            try
            {
                var employee = await _employeeService.GetEmployeeByEmployeeNumberAsync(employeeNumber);
                if (employee == null)
                    return NotFound($"Employee with number {employeeNumber} not found");

                return Ok(employee);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting employee by number: {EmployeeNumber}", employeeNumber);
                return StatusCode(500, "An error occurred while retrieving the employee");
            }
        }

        /// <summary>
        /// Get employee by email
        /// </summary>
        [HttpGet("by-email/{email}")]
        public async Task<ActionResult<EmployeeDto>> GetEmployeeByEmail(string email)
        {
            try
            {
                var employee = await _employeeService.GetEmployeeByEmailAsync(email);
                if (employee == null)
                    return NotFound($"Employee with email {email} not found");

                return Ok(employee);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting employee by email: {Email}", email);
                return StatusCode(500, "An error occurred while retrieving the employee");
            }
        }

        /// <summary>
        /// Create new employee
        /// </summary>
        [HttpPost]
        [AllowAnonymous] // Allow anonymous access for user registration
        public async Task<ActionResult<EmployeeDto>> CreateEmployee([FromBody] CreateEmployeeDto createEmployeeDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var employee = await _employeeService.CreateEmployeeAsync(createEmployeeDto);
                return CreatedAtAction(nameof(GetEmployeeById), new { id = employee.Id }, employee);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating employee");
                return StatusCode(500, "An error occurred while creating the employee");
            }
        }

        /// <summary>
        /// Update existing employee
        /// </summary>
        [HttpPut("{id:int}")]
        [Authorize(Roles = "admin,senior_hr_manager,hr")]
        public async Task<ActionResult<EmployeeDto>> UpdateEmployee(int id, [FromBody] UpdateEmployeeDto updateEmployeeDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var employee = await _employeeService.UpdateEmployeeAsync(id, updateEmployeeDto);
                return Ok(employee);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating employee with ID: {Id}", id);
                return StatusCode(500, "An error occurred while updating the employee");
            }
        }

        /// <summary>
        /// Delete employee (soft delete)
        /// </summary>
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "admin,senior_hr_manager")]
        public async Task<ActionResult> DeleteEmployee(int id)
        {
            try
            {
                var result = await _employeeService.DeleteEmployeeAsync(id);
                if (!result)
                    return NotFound($"Employee with ID {id} not found");

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting employee with ID: {Id}", id);
                return StatusCode(500, "An error occurred while deleting the employee");
            }
        }

        /// <summary>
        /// Check if employee number exists
        /// </summary>
        [HttpGet("check-employee-number/{employeeNumber}")]
        public async Task<ActionResult<bool>> CheckEmployeeNumberExists(string employeeNumber)
        {
            try
            {
                var exists = await _employeeService.EmployeeNumberExistsAsync(employeeNumber);
                return Ok(exists);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking employee number: {EmployeeNumber}", employeeNumber);
                return StatusCode(500, "An error occurred while checking the employee number");
            }
        }

        /// <summary>
        /// Check if NIC exists
        /// </summary>
        [HttpGet("check-nic/{nic}")]
        public async Task<ActionResult<bool>> CheckNICExists(string nic)
        {
            try
            {
                var exists = await _employeeService.NICExistsAsync(nic);
                return Ok(exists);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking NIC: {NIC}", nic);
                return StatusCode(500, "An error occurred while checking the NIC");
            }
        }

        /// <summary>
        /// Check if email exists
        /// </summary>
        [HttpGet("check-email/{email}")]
        public async Task<ActionResult<bool>> CheckEmailExists(string email)
        {
            try
            {
                var exists = await _employeeService.EmailExistsAsync(email);
                return Ok(exists);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking email: {Email}", email);
                return StatusCode(500, "An error occurred while checking the email");
            }
        }

        /// <summary>
        /// Get subordinates of a manager
        /// </summary>
        [HttpGet("{managerId:int}/subordinates")]
        public async Task<ActionResult<IEnumerable<EmployeeSummaryDto>>> GetSubordinates(int managerId)
        {
            try
            {
                var subordinates = await _employeeService.GetSubordinatesAsync(managerId);
                return Ok(subordinates);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting subordinates for manager ID: {ManagerId}", managerId);
                return StatusCode(500, "An error occurred while retrieving subordinates");
            }
        }

        /// <summary>
        /// Get total employee count
        /// </summary>
        [HttpGet("count")]
        public async Task<ActionResult<int>> GetEmployeeCount()
        {
            try
            {
                var count = await _employeeService.GetEmployeeCountAsync();
                return Ok(count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting employee count");
                return StatusCode(500, "An error occurred while getting employee count");
            }
        }

        /// <summary>
        /// Get employees by division
        /// </summary>
        [HttpGet("by-division/{division}")]
        public async Task<ActionResult<IEnumerable<EmployeeSummaryDto>>> GetEmployeesByDivision(string division)
        {
            try
            {
                var employees = await _employeeService.GetEmployeesByDivisionAsync(division);
                return Ok(employees);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting employees by division: {Division}", division);
                return StatusCode(500, "An error occurred while retrieving employees");
            }
        }

        /// <summary>
        /// Get employees by designation
        /// </summary>
        [HttpGet("by-designation/{designation}")]
        public async Task<ActionResult<IEnumerable<EmployeeSummaryDto>>> GetEmployeesByDesignation(string designation)
        {
            try
            {
                var employees = await _employeeService.GetEmployeesByDesignationAsync(designation);
                return Ok(employees);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting employees by designation: {Designation}", designation);
                return StatusCode(500, "An error occurred while retrieving employees");
            }
        }

        /// <summary>
        /// Update employee status
        /// </summary>
        [HttpPatch("{id:int}/status")]
        [Authorize(Roles = "admin,senior_hr_manager,hr")]
        public async Task<ActionResult> UpdateEmployeeStatus(int id, [FromBody] EmployeeStatus status)
        {
            try
            {
                var result = await _employeeService.UpdateEmployeeStatusAsync(id, status);
                if (!result)
                    return NotFound($"Employee with ID {id} not found");

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating employee status for ID: {Id}", id);
                return StatusCode(500, "An error occurred while updating employee status");
            }
        }
    }
}