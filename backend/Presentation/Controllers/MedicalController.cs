using Microsoft.AspNetCore.Mvc;
using SLBFE.HRM.API.Application.DTOs.Request;
using SLBFE.HRM.API.Application.Services.Interfaces;
using SLBFE.HRM.API.Presentation.Controllers;

namespace SLBFE.HRM.API.Presentation.Controllers
{
    /// <summary>
    /// Controller for medical request operations
    /// </summary>
    [Route("api/[controller]")]
    public class MedicalController : BaseApiController
    {
        private readonly IMedicalService _medicalService;

        public MedicalController(IMedicalService medicalService)
        {
            _medicalService = medicalService;
        }

        /// <summary>
        /// Get medical request by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var medicalRequest = await _medicalService.GetByIdAsync(id);
            if (medicalRequest == null)
                return NotFoundResponse("Medical request not found");

            return SuccessResponse(medicalRequest);
        }

        /// <summary>
        /// Get medical request by request number
        /// </summary>
        [HttpGet("request/{requestNumber}")]
        public async Task<IActionResult> GetByRequestNumber(string requestNumber)
        {
            var medicalRequest = await _medicalService.GetByRequestNumberAsync(requestNumber);
            if (medicalRequest == null)
                return NotFoundResponse("Medical request not found");

            return SuccessResponse(medicalRequest);
        }

        /// <summary>
        /// Get all medical requests for an employee
        /// </summary>
        [HttpGet("employee/{employeeId}")]
        public async Task<IActionResult> GetEmployeeMedicalRequests(int employeeId)
        {
            var medicalRequests = await _medicalService.GetEmployeeMedicalRequestsAsync(employeeId);
            return SuccessResponse(medicalRequests);
        }

        /// <summary>
        /// Get medical balance for an employee
        /// </summary>
        [HttpGet("employee/{employeeId}/balance")]
        public async Task<IActionResult> GetMedicalBalance(int employeeId, [FromQuery] int? year = null)
        {
            var balance = await _medicalService.GetMedicalBalanceAsync(employeeId, year);
            return SuccessResponse(balance);
        }

        /// <summary>
        /// Get all medical requests with filters
        /// </summary>
        [HttpPost("search")]
        public async Task<IActionResult> GetAllMedicalRequests([FromBody] MedicalRequestFilterDto filter)
        {
            var medicalRequests = await _medicalService.GetAllMedicalRequestsAsync(filter);
            return SuccessResponse(medicalRequests);
        }

        /// <summary>
        /// Create new medical request
        /// </summary>
        [HttpPost("employee/{employeeId}")]
        public async Task<IActionResult> CreateMedicalRequest(int employeeId, [FromBody] CreateMedicalRequestDto dto)
        {
            if (!ModelState.IsValid)
                return ErrorResponse("Invalid request data", ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList());

            try
            {
                var medicalRequest = await _medicalService.CreateMedicalRequestAsync(employeeId, dto);
                return SuccessResponse(medicalRequest, "Medical request created successfully");
            }
            catch (Exception ex)
            {
                return ErrorResponse(ex.Message);
            }
        }

        /// <summary>
        /// Update medical request status (Approve/Reject)
        /// </summary>
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateRequestStatus(int id, [FromBody] UpdateMedicalRequestStatusDto dto, [FromQuery] int approverId = 1)
        {
            if (!ModelState.IsValid)
                return ErrorResponse("Invalid request data", ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList());

            try
            {
                var medicalRequest = await _medicalService.UpdateRequestStatusAsync(id, approverId, dto);
                return SuccessResponse(medicalRequest, "Medical request status updated successfully");
            }
            catch (Exception ex)
            {
                return ErrorResponse(ex.Message);
            }
        }

        /// <summary>
        /// Mark medical request as paid
        /// </summary>
        [HttpPut("{id}/paid")]
        public async Task<IActionResult> MarkAsPaid(int id, [FromBody] MarkAsPaidDto dto)
        {
            if (!ModelState.IsValid)
                return ErrorResponse("Invalid request data", ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .ToList());

            try
            {
                var medicalRequest = await _medicalService.MarkAsPaidAsync(id, dto);
                return SuccessResponse(medicalRequest, "Medical request marked as paid successfully");
            }
            catch (Exception ex)
            {
                return ErrorResponse(ex.Message);
            }
        }

        /// <summary>
        /// Delete medical request
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _medicalService.DeleteMedicalRequestAsync(id);
            if (!result)
                return NotFoundResponse("Medical request not found");

            return SuccessResponse(true, "Medical request deleted successfully");
        }

        /// <summary>
        /// Get medical statistics for admin/HR dashboard
        /// </summary>
        [HttpGet("statistics")]
        public async Task<IActionResult> GetStatistics([FromQuery] int? year = null)
        {
            var statistics = await _medicalService.GetMedicalStatisticsAsync(year);
            return SuccessResponse(statistics);
        }
    }
}
