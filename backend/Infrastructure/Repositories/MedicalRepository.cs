using Microsoft.EntityFrameworkCore;
using SLBFE.HRM.API.Core.Entities;
using SLBFE.HRM.API.Core.Enums;
using SLBFE.HRM.API.Core.Interfaces;
using SLBFE.HRM.API.Infrastructure.Data.Context;

namespace SLBFE.HRM.API.Infrastructure.Repositories
{
    /// <summary>
    /// Repository implementation for medical requests
    /// </summary>
    public class MedicalRepository : IMedicalRepository
    {
        private readonly ApplicationDbContext _context;

        public MedicalRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<MedicalRequest?> GetByIdAsync(int id)
        {
            return await _context.MedicalRequests
                .FirstOrDefaultAsync(m => m.Id == id && !m.IsDeleted);
        }

        public async Task<MedicalRequest?> GetByRequestNumberAsync(string requestNumber)
        {
            return await _context.MedicalRequests
                .FirstOrDefaultAsync(m => m.RequestNumber == requestNumber && !m.IsDeleted);
        }

        public async Task<IEnumerable<MedicalRequest>> GetByEmployeeIdAsync(int employeeId)
        {
            return await _context.MedicalRequests
                .Where(m => m.EmployeeId == employeeId && !m.IsDeleted)
                .OrderByDescending(m => m.SubmittedDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<MedicalRequest>> GetByEmployeeIdAndYearAsync(int employeeId, int year)
        {
            return await _context.MedicalRequests
                .Where(m => m.EmployeeId == employeeId 
                    && m.SubmittedDate.Year == year 
                    && !m.IsDeleted)
                .OrderByDescending(m => m.SubmittedDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<MedicalRequest>> GetByStatusAsync(MedicalRequestStatus status)
        {
            return await _context.MedicalRequests
                .Where(m => m.Status == status && !m.IsDeleted)
                .OrderByDescending(m => m.SubmittedDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<MedicalRequest>> GetAllAsync(
            int? employeeId = null,
            MedicalRequestStatus? status = null,
            MedicalRequestType? requestType = null,
            DateTime? fromDate = null,
            DateTime? toDate = null)
        {
            var query = _context.MedicalRequests.Where(m => !m.IsDeleted);

            if (employeeId.HasValue)
                query = query.Where(m => m.EmployeeId == employeeId.Value);

            if (status.HasValue)
                query = query.Where(m => m.Status == status.Value);

            if (requestType.HasValue)
                query = query.Where(m => m.RequestType == requestType.Value);

            if (fromDate.HasValue)
                query = query.Where(m => m.SubmittedDate >= fromDate.Value);

            if (toDate.HasValue)
                query = query.Where(m => m.SubmittedDate <= toDate.Value);

            return await query.OrderByDescending(m => m.SubmittedDate).ToListAsync();
        }

        public async Task<MedicalRequest> AddAsync(MedicalRequest medicalRequest)
        {
            medicalRequest.SubmittedDate = DateTime.UtcNow;
            medicalRequest.CreatedAt = DateTime.UtcNow;
            
            await _context.MedicalRequests.AddAsync(medicalRequest);
            await _context.SaveChangesAsync();
            
            return medicalRequest;
        }

        public async Task<MedicalRequest> UpdateAsync(MedicalRequest medicalRequest)
        {
            medicalRequest.UpdatedAt = DateTime.UtcNow;
            
            _context.MedicalRequests.Update(medicalRequest);
            await _context.SaveChangesAsync();
            
            return medicalRequest;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var medicalRequest = await GetByIdAsync(id);
            if (medicalRequest == null)
                return false;

            medicalRequest.IsDeleted = true;
            medicalRequest.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<decimal> GetTotalClaimedAmountByYearAsync(int employeeId, int year)
        {
            return await _context.MedicalRequests
                .Where(m => m.EmployeeId == employeeId 
                    && m.SubmittedDate.Year == year 
                    && !m.IsDeleted)
                .SumAsync(m => m.ClaimedAmount);
        }

        public async Task<decimal> GetTotalApprovedAmountByYearAsync(int employeeId, int year)
        {
            return await _context.MedicalRequests
                .Where(m => m.EmployeeId == employeeId 
                    && m.SubmittedDate.Year == year 
                    && (m.Status == MedicalRequestStatus.Approved || m.Status == MedicalRequestStatus.Paid)
                    && !m.IsDeleted)
                .SumAsync(m => m.ApprovedAmount ?? 0);
        }

        public async Task<int> GetPendingRequestsCountAsync(int employeeId)
        {
            return await _context.MedicalRequests
                .CountAsync(m => m.EmployeeId == employeeId 
                    && m.Status == MedicalRequestStatus.Pending 
                    && !m.IsDeleted);
        }

        public async Task<string> GenerateRequestNumberAsync()
        {
            var year = DateTime.UtcNow.Year;
            var month = DateTime.UtcNow.Month;
            
            var lastRequest = await _context.MedicalRequests
                .Where(m => m.RequestNumber.StartsWith($"MED{year}{month:D2}"))
                .OrderByDescending(m => m.RequestNumber)
                .FirstOrDefaultAsync();

            int sequenceNumber = 1;
            if (lastRequest != null)
            {
                var lastSequence = lastRequest.RequestNumber.Substring(9); // Extract last 4 digits
                if (int.TryParse(lastSequence, out int lastNum))
                {
                    sequenceNumber = lastNum + 1;
                }
            }

            return $"MED{year}{month:D2}{sequenceNumber:D4}";
        }
    }
}
