using SLBFE.HRM.API.Application.DTOs.Request;
using SLBFE.HRM.API.Application.DTOs.Response;
using SLBFE.HRM.API.Application.Services.Interfaces;
using SLBFE.HRM.API.Core.Entities;
using SLBFE.HRM.API.Core.Enums;
using SLBFE.HRM.API.Core.Exceptions;
using SLBFE.HRM.API.Core.Interfaces;

namespace SLBFE.HRM.API.Application.Services.Implementation
{
    /// <summary>
    /// Service implementation for medical request operations
    /// </summary>
    public class MedicalService : IMedicalService
    {
        private readonly IMedicalRepository _medicalRepository;
        private const decimal ANNUAL_MEDICAL_ALLOWANCE = 50000.00m; // LKR 50,000 per year

        public MedicalService(IMedicalRepository medicalRepository)
        {
            _medicalRepository = medicalRepository;
        }

        public async Task<MedicalRequestDto?> GetByIdAsync(int id)
        {
            var medicalRequest = await _medicalRepository.GetByIdAsync(id);
            return medicalRequest == null ? null : MapToDto(medicalRequest);
        }

        public async Task<MedicalRequestDto?> GetByRequestNumberAsync(string requestNumber)
        {
            var medicalRequest = await _medicalRepository.GetByRequestNumberAsync(requestNumber);
            return medicalRequest == null ? null : MapToDto(medicalRequest);
        }

        public async Task<IEnumerable<MedicalRequestDto>> GetEmployeeMedicalRequestsAsync(int employeeId)
        {
            var medicalRequests = await _medicalRepository.GetByEmployeeIdAsync(employeeId);
            return medicalRequests.Select(MapToDto);
        }

        public async Task<MedicalBalanceDto> GetMedicalBalanceAsync(int employeeId, int? year = null)
        {
            var currentYear = year ?? DateTime.UtcNow.Year;
            var requests = await _medicalRepository.GetByEmployeeIdAndYearAsync(employeeId, currentYear);

            var totalClaimed = requests.Sum(r => r.ClaimedAmount);
            var totalApproved = requests
                .Where(r => r.Status == MedicalRequestStatus.Approved || r.Status == MedicalRequestStatus.Paid)
                .Sum(r => r.ApprovedAmount ?? 0);
            var totalPaid = requests
                .Where(r => r.Status == MedicalRequestStatus.Paid)
                .Sum(r => r.ApprovedAmount ?? 0);
            var pendingAmount = requests
                .Where(r => r.Status == MedicalRequestStatus.Pending || r.Status == MedicalRequestStatus.UnderReview)
                .Sum(r => r.ClaimedAmount);

            var pendingCount = requests.Count(r => r.Status == MedicalRequestStatus.Pending || r.Status == MedicalRequestStatus.UnderReview);
            var approvedCount = requests.Count(r => r.Status == MedicalRequestStatus.Approved || r.Status == MedicalRequestStatus.Paid);
            var rejectedCount = requests.Count(r => r.Status == MedicalRequestStatus.Rejected);

            return new MedicalBalanceDto
            {
                AnnualAllowance = ANNUAL_MEDICAL_ALLOWANCE,
                TotalClaimed = totalClaimed,
                TotalApproved = totalApproved,
                TotalPaid = totalPaid,
                PendingAmount = pendingAmount,
                RemainingBalance = ANNUAL_MEDICAL_ALLOWANCE - totalApproved - pendingAmount,
                Year = currentYear,
                PendingRequests = pendingCount,
                ApprovedRequests = approvedCount,
                RejectedRequests = rejectedCount,
                TotalRequests = requests.Count()
            };
        }

        public async Task<IEnumerable<MedicalRequestDto>> GetAllMedicalRequestsAsync(MedicalRequestFilterDto filter)
        {
            var medicalRequests = await _medicalRepository.GetAllAsync(
                filter.EmployeeId,
                filter.Status,
                filter.RequestType,
                filter.FromDate,
                filter.ToDate);

            return medicalRequests.Select(MapToDto);
        }

        public async Task<MedicalRequestDto> CreateMedicalRequestAsync(int employeeId, CreateMedicalRequestDto dto)
        {
            // Validate that claimed amount doesn't exceed remaining balance
            var balance = await GetMedicalBalanceAsync(employeeId);
            if (dto.ClaimedAmount > balance.RemainingBalance)
            {
                throw new BusinessException(
                    $"Claimed amount (LKR {dto.ClaimedAmount:N2}) exceeds remaining balance (LKR {balance.RemainingBalance:N2})");
            }

            // Generate request number
            var requestNumber = await _medicalRepository.GenerateRequestNumberAsync();

            var medicalRequest = new MedicalRequest
            {
                EmployeeId = employeeId,
                RequestNumber = requestNumber,
                RequestType = dto.RequestType,
                TreatmentDate = dto.TreatmentDate,
                MedicalProvider = dto.MedicalProvider,
                Diagnosis = dto.Diagnosis,
                Description = dto.Description,
                ClaimedAmount = dto.ClaimedAmount,
                Status = MedicalRequestStatus.Pending,
                Attachments = dto.Attachments != null ? string.Join(",", dto.Attachments) : null,
                SubmittedDate = DateTime.UtcNow
            };

            var created = await _medicalRepository.AddAsync(medicalRequest);
            return MapToDto(created);
        }

        public async Task<MedicalRequestDto> UpdateRequestStatusAsync(int id, int approverId, UpdateMedicalRequestStatusDto dto)
        {
            var medicalRequest = await _medicalRepository.GetByIdAsync(id);
            if (medicalRequest == null)
                throw new NotFoundException($"Medical request with ID {id} not found");

            medicalRequest.Status = dto.Status;
            medicalRequest.ApprovedBy = approverId;
            medicalRequest.ReviewedDate = DateTime.UtcNow;
            medicalRequest.ApproverComments = dto.ApproverComments;

            if (dto.Status == MedicalRequestStatus.Approved)
            {
                medicalRequest.ApprovedAmount = dto.ApprovedAmount ?? medicalRequest.ClaimedAmount;
            }
            else if (dto.Status == MedicalRequestStatus.Rejected)
            {
                medicalRequest.RejectionReason = dto.RejectionReason;
                medicalRequest.ApprovedAmount = 0;
            }

            var updated = await _medicalRepository.UpdateAsync(medicalRequest);
            return MapToDto(updated);
        }

        public async Task<MedicalRequestDto> MarkAsPaidAsync(int id, MarkAsPaidDto dto)
        {
            var medicalRequest = await _medicalRepository.GetByIdAsync(id);
            if (medicalRequest == null)
                throw new NotFoundException($"Medical request with ID {id} not found");

            if (medicalRequest.Status != MedicalRequestStatus.Approved)
                throw new BusinessException("Only approved requests can be marked as paid");

            medicalRequest.Status = MedicalRequestStatus.Paid;
            medicalRequest.PaymentDate = dto.PaymentDate;
            medicalRequest.PaymentReference = dto.PaymentReference;

            var updated = await _medicalRepository.UpdateAsync(medicalRequest);
            return MapToDto(updated);
        }

        public async Task<bool> DeleteMedicalRequestAsync(int id)
        {
            return await _medicalRepository.DeleteAsync(id);
        }

        public async Task<MedicalStatisticsDto> GetMedicalStatisticsAsync(int? year = null)
        {
            var currentYear = year ?? DateTime.UtcNow.Year;
            var allRequests = await _medicalRepository.GetAllAsync(
                fromDate: new DateTime(currentYear, 1, 1),
                toDate: new DateTime(currentYear, 12, 31));

            var requestsList = allRequests.ToList();

            var statistics = new MedicalStatisticsDto
            {
                TotalRequests = requestsList.Count,
                PendingRequests = requestsList.Count(r => r.Status == MedicalRequestStatus.Pending || r.Status == MedicalRequestStatus.UnderReview),
                ApprovedRequests = requestsList.Count(r => r.Status == MedicalRequestStatus.Approved || r.Status == MedicalRequestStatus.Paid),
                RejectedRequests = requestsList.Count(r => r.Status == MedicalRequestStatus.Rejected),
                TotalClaimedAmount = requestsList.Sum(r => r.ClaimedAmount),
                TotalApprovedAmount = requestsList.Where(r => r.ApprovedAmount.HasValue).Sum(r => r.ApprovedAmount!.Value),
                TotalPaidAmount = requestsList.Where(r => r.Status == MedicalRequestStatus.Paid && r.ApprovedAmount.HasValue).Sum(r => r.ApprovedAmount!.Value)
            };

            // Group by request type
            foreach (MedicalRequestType type in Enum.GetValues(typeof(MedicalRequestType)))
            {
                var typeRequests = requestsList.Where(r => r.RequestType == type).ToList();
                if (typeRequests.Any())
                {
                    statistics.RequestsByType[type.ToString()] = typeRequests.Count;
                    statistics.AmountByType[type.ToString()] = typeRequests.Sum(r => r.ApprovedAmount ?? 0);
                }
            }

            return statistics;
        }

        private MedicalRequestDto MapToDto(MedicalRequest entity)
        {
            return new MedicalRequestDto
            {
                Id = entity.Id,
                EmployeeId = entity.EmployeeId,
                EmployeeName = string.Empty, // Will be populated by joining with Employee table
                EmployeeNumber = string.Empty, // Will be populated by joining with Employee table
                RequestNumber = entity.RequestNumber,
                RequestType = entity.RequestType,
                RequestTypeName = entity.RequestType.ToString(),
                TreatmentDate = entity.TreatmentDate,
                MedicalProvider = entity.MedicalProvider,
                Diagnosis = entity.Diagnosis,
                Description = entity.Description,
                ClaimedAmount = entity.ClaimedAmount,
                ApprovedAmount = entity.ApprovedAmount,
                Status = entity.Status,
                StatusName = entity.Status.ToString(),
                Attachments = string.IsNullOrEmpty(entity.Attachments) 
                    ? new List<string>() 
                    : entity.Attachments.Split(',').ToList(),
                SubmittedDate = entity.SubmittedDate,
                ApprovedBy = entity.ApprovedBy,
                ApproverName = null, // Will be populated by joining with User table
                ReviewedDate = entity.ReviewedDate,
                ApproverComments = entity.ApproverComments,
                PaymentDate = entity.PaymentDate,
                PaymentReference = entity.PaymentReference,
                RejectionReason = entity.RejectionReason,
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt
            };
        }
    }
}
