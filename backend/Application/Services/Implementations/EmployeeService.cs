using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SLBFE.HRM.API.Application.DTOs.Request;
using SLBFE.HRM.API.Application.DTOs.Response;
using SLBFE.HRM.API.Application.Services.Interfaces;
using SLBFE.HRM.API.Core.Entities;
using SLBFE.HRM.API.Core.Enums;
using SLBFE.HRM.API.Infrastructure.Data.Context;

namespace SLBFE.HRM.API.Application.Services.Implementations
{
    /// <summary>
    /// Employee service implementation
    /// </summary>
    public class EmployeeService : IEmployeeService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public EmployeeService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<EmployeeSummaryDto>> GetEmployeesAsync(EmployeeSearchDto searchDto)
        {
            var query = _context.Employees
                .Where(e => !e.IsDeleted)
                .Include(e => e.ReportingManager)
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(searchDto.EmployeeNumber))
            {
                query = query.Where(e => e.EmployeeNumber.Contains(searchDto.EmployeeNumber));
            }

            if (!string.IsNullOrEmpty(searchDto.FullName))
            {
                query = query.Where(e => e.FullName.Contains(searchDto.FullName));
            }

            if (!string.IsNullOrEmpty(searchDto.Division))
            {
                query = query.Where(e => e.Division == searchDto.Division);
            }

            if (!string.IsNullOrEmpty(searchDto.Designation))
            {
                query = query.Where(e => e.Designation.Contains(searchDto.Designation));
            }

            if (!string.IsNullOrEmpty(searchDto.Department))
            {
                query = query.Where(e => e.Department == searchDto.Department);
            }

            if (!string.IsNullOrEmpty(searchDto.TypeOfEmployment))
            {
                query = query.Where(e => e.TypeOfEmployment == searchDto.TypeOfEmployment);
            }

            if (!string.IsNullOrEmpty(searchDto.Status))
            {
                if (Enum.TryParse<EmployeeStatus>(searchDto.Status, out var status))
                {
                    query = query.Where(e => e.Status == status);
                }
            }

            if (searchDto.ReportingManagerId.HasValue)
            {
                query = query.Where(e => e.ReportingManagerId == searchDto.ReportingManagerId);
            }

            if (searchDto.JoinDateFrom.HasValue)
            {
                query = query.Where(e => 
                    (e.JoinDateContract.HasValue && e.JoinDateContract >= searchDto.JoinDateFrom) ||
                    (e.JoinDateCasual.HasValue && e.JoinDateCasual >= searchDto.JoinDateFrom) ||
                    (e.DateOfPermanent.HasValue && e.DateOfPermanent >= searchDto.JoinDateFrom));
            }

            if (searchDto.JoinDateTo.HasValue)
            {
                query = query.Where(e => 
                    (e.JoinDateContract.HasValue && e.JoinDateContract <= searchDto.JoinDateTo) ||
                    (e.JoinDateCasual.HasValue && e.JoinDateCasual <= searchDto.JoinDateTo) ||
                    (e.DateOfPermanent.HasValue && e.DateOfPermanent <= searchDto.JoinDateTo));
            }

            // Apply sorting
            query = searchDto.SortBy?.ToLower() switch
            {
                "employeenumber" => searchDto.SortDescending == true ? query.OrderByDescending(e => e.EmployeeNumber) : query.OrderBy(e => e.EmployeeNumber),
                "division" => searchDto.SortDescending == true ? query.OrderByDescending(e => e.Division) : query.OrderBy(e => e.Division),
                "designation" => searchDto.SortDescending == true ? query.OrderByDescending(e => e.Designation) : query.OrderBy(e => e.Designation),
                "createdat" => searchDto.SortDescending == true ? query.OrderByDescending(e => e.CreatedAt) : query.OrderBy(e => e.CreatedAt),
                _ => searchDto.SortDescending == true ? query.OrderByDescending(e => e.FullName) : query.OrderBy(e => e.FullName)
            };

            // Apply pagination
            if (searchDto.PageNumber.HasValue && searchDto.PageSize.HasValue)
            {
                var skip = (searchDto.PageNumber.Value - 1) * searchDto.PageSize.Value;
                query = query.Skip(skip).Take(searchDto.PageSize.Value);
            }

            var employees = await query.ToListAsync();
            return _mapper.Map<IEnumerable<EmployeeSummaryDto>>(employees);
        }

        public async Task<EmployeeDto?> GetEmployeeByIdAsync(int id)
        {
            var employee = await _context.Employees
                .Where(e => e.Id == id && !e.IsDeleted)
                .Include(e => e.ReportingManager)
                .FirstOrDefaultAsync();

            return employee != null ? _mapper.Map<EmployeeDto>(employee) : null;
        }

        public async Task<EmployeeDto?> GetEmployeeByEmployeeNumberAsync(string employeeNumber)
        {
            var employee = await _context.Employees
                .Where(e => e.EmployeeNumber == employeeNumber && !e.IsDeleted)
                .Include(e => e.ReportingManager)
                .FirstOrDefaultAsync();

            return employee != null ? _mapper.Map<EmployeeDto>(employee) : null;
        }

        public async Task<EmployeeDto?> GetEmployeeByEmailAsync(string email)
        {
            var employee = await _context.Employees
                .Where(e => e.EmailAddress == email && !e.IsDeleted)
                .Include(e => e.ReportingManager)
                .FirstOrDefaultAsync();

            return employee != null ? _mapper.Map<EmployeeDto>(employee) : null;
        }

        public async Task<EmployeeDto> CreateEmployeeAsync(CreateEmployeeDto createEmployeeDto)
        {
            // Auto-generate employee number if not provided
            if (string.IsNullOrEmpty(createEmployeeDto.EmployeeNumber))
            {
                createEmployeeDto.EmployeeNumber = await GenerateEmployeeNumberAsync();
            }

            // Validate unique constraints
            if (await EmployeeNumberExistsAsync(createEmployeeDto.EmployeeNumber))
                throw new InvalidOperationException("Employee number already exists.");

            if (await NICExistsAsync(createEmployeeDto.NIC))
                throw new InvalidOperationException("NIC already exists.");

            if (await EmailExistsAsync(createEmployeeDto.EmailAddress))
                throw new InvalidOperationException("Email address already exists.");

            var employee = _mapper.Map<Employee>(createEmployeeDto);
            employee.Status = EmployeeStatus.Active;
            employee.EmploymentStatus = EmploymentStatus.Active;
            employee.CreatedAt = DateTime.UtcNow;

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            return _mapper.Map<EmployeeDto>(employee);
        }

        public async Task<EmployeeDto> UpdateEmployeeAsync(int id, UpdateEmployeeDto updateEmployeeDto)
        {
            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.Id == id && !e.IsDeleted);

            if (employee == null)
                throw new InvalidOperationException("Employee not found.");

            // Check unique constraints if values are being changed
            if (!string.IsNullOrEmpty(updateEmployeeDto.NIC) && 
                updateEmployeeDto.NIC != employee.NIC && 
                await NICExistsAsync(updateEmployeeDto.NIC))
            {
                throw new InvalidOperationException("NIC already exists.");
            }

            if (!string.IsNullOrEmpty(updateEmployeeDto.EmailAddress) && 
                updateEmployeeDto.EmailAddress != employee.EmailAddress && 
                await EmailExistsAsync(updateEmployeeDto.EmailAddress))
            {
                throw new InvalidOperationException("Email address already exists.");
            }

            // Map non-null properties from DTO to entity
            _mapper.Map(updateEmployeeDto, employee);
            employee.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return _mapper.Map<EmployeeDto>(employee);
        }

        public async Task<bool> DeleteEmployeeAsync(int id)
        {
            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.Id == id && !e.IsDeleted);

            if (employee == null)
                return false;

            employee.IsDeleted = true;
            employee.Status = EmployeeStatus.Terminated;
            employee.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> EmployeeNumberExistsAsync(string employeeNumber)
        {
            return await _context.Employees
                .AnyAsync(e => e.EmployeeNumber == employeeNumber && !e.IsDeleted);
        }

        public async Task<bool> NICExistsAsync(string nic)
        {
            return await _context.Employees
                .AnyAsync(e => e.NIC == nic && !e.IsDeleted);
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _context.Employees
                .AnyAsync(e => e.EmailAddress == email && !e.IsDeleted);
        }

        public async Task<IEnumerable<EmployeeSummaryDto>> GetSubordinatesAsync(int managerId)
        {
            var employees = await _context.Employees
                .Where(e => e.ReportingManagerId == managerId && !e.IsDeleted)
                .Include(e => e.ReportingManager)
                .OrderBy(e => e.FullName)
                .ToListAsync();

            return _mapper.Map<IEnumerable<EmployeeSummaryDto>>(employees);
        }

        public async Task<int> GetEmployeeCountAsync()
        {
            return await _context.Employees
                .CountAsync(e => !e.IsDeleted && e.Status == EmployeeStatus.Active);
        }

        public async Task<IEnumerable<EmployeeSummaryDto>> GetEmployeesByDivisionAsync(string division)
        {
            var employees = await _context.Employees
                .Where(e => e.Division == division && !e.IsDeleted)
                .Include(e => e.ReportingManager)
                .OrderBy(e => e.FullName)
                .ToListAsync();

            return _mapper.Map<IEnumerable<EmployeeSummaryDto>>(employees);
        }

        public async Task<IEnumerable<EmployeeSummaryDto>> GetEmployeesByDesignationAsync(string designation)
        {
            var employees = await _context.Employees
                .Where(e => e.Designation == designation && !e.IsDeleted)
                .Include(e => e.ReportingManager)
                .OrderBy(e => e.FullName)
                .ToListAsync();

            return _mapper.Map<IEnumerable<EmployeeSummaryDto>>(employees);
        }

        public async Task<bool> UpdateEmployeeStatusAsync(int id, EmployeeStatus status)
        {
            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.Id == id && !e.IsDeleted);

            if (employee == null)
                return false;

            employee.Status = status;
            employee.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return true;
        }

        /// <summary>
        /// Generates a unique employee number in format EMP{YYYY}{SequentialNumber}
        /// Example: EMP2026001, EMP2026002, etc.
        /// </summary>
        private async Task<string> GenerateEmployeeNumberAsync()
        {
            var currentYear = DateTime.Now.Year;
            var prefix = $"EMP{currentYear}";

            // Find the last employee number for current year
            var lastEmployee = await _context.Employees
                .Where(e => e.EmployeeNumber.StartsWith(prefix))
                .OrderByDescending(e => e.EmployeeNumber)
                .FirstOrDefaultAsync();

            int nextSequence = 1;
            if (lastEmployee != null)
            {
                var lastNumberStr = lastEmployee.EmployeeNumber.Replace(prefix, "");
                if (int.TryParse(lastNumberStr, out var lastNumber))
                {
                    nextSequence = lastNumber + 1;
                }
            }

            return $"{prefix}{nextSequence:D3}"; // Format: EMP2026001
        }
    }
}