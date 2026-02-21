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
        [HttpGet("{employeeId}")]
        public async Task<ActionResult<EmployeeDto>> GetEmployeeById(string employeeId)
        {
            try
            {
                var employee = await _employeeService.GetEmployeeByIdAsync(employeeId);
                if (employee == null)
                    return NotFound($"Employee with ID {employeeId} not found");

                return Ok(employee);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting employee by ID: {EmployeeId}", employeeId);
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
        public async Task<ActionResult<EmployeeWithCredentialsDto>> CreateEmployee([FromBody] CreateEmployeeDto createEmployeeDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var employeeWithCredentials = await _employeeService.CreateEmployeeWithCredentialsAsync(createEmployeeDto);
                return CreatedAtAction(nameof(GetEmployeeById), new { employeeId = employeeWithCredentials.EmployeeId }, employeeWithCredentials);
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
        [HttpPut("{employeeId}")]
        [Authorize(Roles = "admin,senior_hr_manager,hr")]
        public async Task<ActionResult<EmployeeDto>> UpdateEmployee(string employeeId, [FromBody] UpdateEmployeeDto updateEmployeeDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var employee = await _employeeService.UpdateEmployeeAsync(employeeId, updateEmployeeDto);
                return Ok(employee);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating employee with ID: {EmployeeId}", employeeId);
                return StatusCode(500, "An error occurred while updating the employee");
            }
        }

        /// <summary>
        /// Delete employee (soft delete)
        /// </summary>
        [HttpDelete("{employeeId}")]
        [Authorize(Roles = "admin,senior_hr_manager")]
        public async Task<ActionResult> DeleteEmployee(string employeeId)
        {
            try
            {
                var result = await _employeeService.DeleteEmployeeAsync(employeeId);
                if (!result)
                    return NotFound($"Employee with ID {employeeId} not found");

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting employee with ID: {EmployeeId}", employeeId);
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
        [HttpGet("by-division/{divisionId}")]
        public async Task<ActionResult<IEnumerable<EmployeeSummaryDto>>> GetEmployeesByDivision(int divisionId)
        {
            try
            {
                var employees = await _employeeService.GetEmployeesByDivisionAsync(divisionId);
                return Ok(employees);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting employees by division: {DivisionId}", divisionId);
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
        /// Get pending employee applications
        /// </summary>
        [HttpGet("pending-applications")]
        [Authorize(Roles = "admin,senior_hr_manager,hr")]
        public async Task<ActionResult<IEnumerable<EmployeeSummaryDto>>> GetPendingApplications()
        {
            try
            {
                var applications = await _employeeService.GetPendingApplicationsAsync();
                return Ok(applications);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting pending applications");
                return StatusCode(500, "An error occurred while retrieving pending applications");
            }
        }

        /// <summary>
        /// Get all employee applications with status
        /// </summary>
        [HttpGet("all-applications")]
        [Authorize(Roles = "admin,senior_hr_manager,hr")]
        public async Task<ActionResult<IEnumerable<EmployeeSummaryDto>>> GetAllApplications()
        {
            try
            {
                var applications = await _employeeService.GetAllApplicationsAsync();
                return Ok(applications);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all applications");
                return StatusCode(500, "An error occurred while retrieving all applications");
            }
        }

        /// <summary>
        /// Review employee application (Approve or Reject)
        /// </summary>
        [HttpPost("{employeeId}/review")]
        [Authorize(Roles = "admin,senior_hr_manager,hr")]
        public async Task<ActionResult<EmployeeDto>> ReviewApplication(string employeeId, [FromBody] ReviewEmployeeApplicationDto reviewDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Get reviewer ID from claims
                var reviewerId = User.FindFirst("EmployeeId")?.Value ?? User.Identity?.Name ?? "System";

                var employee = await _employeeService.ReviewEmployeeApplicationAsync(employeeId, reviewDto, reviewerId);
                return Ok(employee);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error reviewing application: {EmployeeId}", employeeId);
                return StatusCode(500, "An error occurred while reviewing the application");
            }
        }

    }
}
