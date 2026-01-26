using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SLBFE.HRM.API.Application.DTOs.Request;
using SLBFE.HRM.API.Application.DTOs.Response;
using SLBFE.HRM.API.Application.Services.Interfaces;
using SLBFE.HRM.API.Core.Entities;
using SLBFE.HRM.API.Core.Enums;
using SLBFE.HRM.API.Infrastructure.Data.Context;
using BCrypt.Net;

namespace SLBFE.HRM.API.Application.Services.Implementations
{
    /// <summary>
    /// Employee service implementation
    /// </summary>
    public class EmployeeService : IEmployeeService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly ILogger<EmployeeService> _logger;

        public EmployeeService(ApplicationDbContext context, IMapper mapper, ILogger<EmployeeService> logger)
        {
            _context = context;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<IEnumerable<EmployeeSummaryDto>> GetEmployeesAsync(EmployeeSearchDto searchDto)
        {
            var query = _context.Employees
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(searchDto.EmployeeId))
            {
                query = query.Where(e => e.EmployeeId.Contains(searchDto.EmployeeId));
            }

            if (!string.IsNullOrEmpty(searchDto.FullName))
            {
                query = query.Where(e => e.FullName.Contains(searchDto.FullName));
            }

            if (searchDto.DivisionId.HasValue)
            {
                query = query.Where(e => e.DivisionId == searchDto.DivisionId.Value);
            }

            if (!string.IsNullOrEmpty(searchDto.DesignationId))
            {
                query = query.Where(e => e.DesignationId.Contains(searchDto.DesignationId));
            }

            if (searchDto.EmployeeTypeId.HasValue)
            {
                query = query.Where(e => e.EmployeeTypeId == searchDto.EmployeeTypeId.Value);
            }

            if (searchDto.JoinDateFrom.HasValue)
            {
                query = query.Where(e => 
                    (e.JoinDateContract.HasValue && e.JoinDateContract >= searchDto.JoinDateFrom) ||
                    (e.JoinDateCasual.HasValue && e.JoinDateCasual >= searchDto.JoinDateFrom) ||
                    (e.PermanentDate.HasValue && e.PermanentDate >= searchDto.JoinDateFrom));
            }

            if (searchDto.JoinDateTo.HasValue)
            {
                query = query.Where(e => 
                    (e.JoinDateContract.HasValue && e.JoinDateContract <= searchDto.JoinDateTo) ||
                    (e.JoinDateCasual.HasValue && e.JoinDateCasual <= searchDto.JoinDateTo) ||
                    (e.PermanentDate.HasValue && e.PermanentDate <= searchDto.JoinDateTo));
            }

            // Apply sorting
            query = searchDto.SortBy?.ToLower() switch
            {
                "employeeid" => searchDto.SortDescending == true ? query.OrderByDescending(e => e.EmployeeId) : query.OrderBy(e => e.EmployeeId),
                "divisionid" => searchDto.SortDescending == true ? query.OrderByDescending(e => e.DivisionId) : query.OrderBy(e => e.DivisionId),
                "designationid" => searchDto.SortDescending == true ? query.OrderByDescending(e => e.DesignationId) : query.OrderBy(e => e.DesignationId),
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

        public async Task<EmployeeDto?> GetEmployeeByIdAsync(string employeeId)
        {
            var employee = await _context.Employees
                .Where(e => e.EmployeeId == employeeId)
                .FirstOrDefaultAsync();

            return employee != null ? _mapper.Map<EmployeeDto>(employee) : null;
        }

        public async Task<EmployeeDto?> GetEmployeeByEmployeeNumberAsync(string employeeNumber)
        {
            var employee = await _context.Employees
                .Where(e => e.EmployeeId == employeeNumber)
                .FirstOrDefaultAsync();

            return employee != null ? _mapper.Map<EmployeeDto>(employee) : null;
        }

        public async Task<EmployeeDto?> GetEmployeeByEmailAsync(string email)
        {
            var employee = await _context.Employees
                .Where(e => e.Email == email)
                .FirstOrDefaultAsync();

            return employee != null ? _mapper.Map<EmployeeDto>(employee) : null;
        }

        public async Task<EmployeeDto> CreateEmployeeAsync(CreateEmployeeDto createEmployeeDto)
        {
            // Auto-generate employee number if not provided
            if (string.IsNullOrEmpty(createEmployeeDto.EmployeeId))
            {
                createEmployeeDto.EmployeeId = await GenerateEmployeeNumberAsync();
            }

            // Validate unique constraints
            if (await EmployeeNumberExistsAsync(createEmployeeDto.EmployeeId))
                throw new InvalidOperationException("Employee number already exists.");

            if (await NICExistsAsync(createEmployeeDto.Nic))
                throw new InvalidOperationException("NIC already exists.");

            if (await EmailExistsAsync(createEmployeeDto.Email))
                throw new InvalidOperationException("Email address already exists.");

            var employee = _mapper.Map<Employee>(createEmployeeDto);
            employee.CreatedAt = DateTime.UtcNow;

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            return _mapper.Map<EmployeeDto>(employee);
        }

        public async Task<EmployeeWithCredentialsDto> CreateEmployeeWithCredentialsAsync(CreateEmployeeDto createEmployeeDto)
        {
            // Auto-generate employee number if not provided
            if (string.IsNullOrEmpty(createEmployeeDto.EmployeeId))
            {
                createEmployeeDto.EmployeeId = await GenerateEmployeeNumberAsync();
            }

            // Validate unique constraints
            if (await EmployeeNumberExistsAsync(createEmployeeDto.EmployeeId))
                throw new InvalidOperationException("Employee number already exists.");

            if (await NICExistsAsync(createEmployeeDto.Nic))
                throw new InvalidOperationException("NIC already exists.");

            if (await EmailExistsAsync(createEmployeeDto.Email))
                throw new InvalidOperationException("Email address already exists.");

            // Generate secure password
            var generatedPassword = GenerateSecurePassword();
            _logger.LogInformation($"Generated password: {generatedPassword}");

            var employee = _mapper.Map<Employee>(createEmployeeDto);
            employee.CreatedAt = DateTime.UtcNow;

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            // Create user account with hashed password
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(generatedPassword);
            var user = new User
            {
                EmployeeId = employee.EmployeeId,
                RoleID = 3, // Default role ID
                UserName = employee.EmployeeId,
                PasswordHash = passwordHash,
                Status = "Active",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Created user account for employee {employee.EmployeeId}");

            // Map to EmployeeWithCredentialsDto and include credentials
            var employeeDto = _mapper.Map<EmployeeWithCredentialsDto>(employee);
            employeeDto.Username = employee.EmployeeId;
            employeeDto.Password = generatedPassword;

            _logger.LogInformation($"Returning credentials - Username: {employeeDto.Username}, Password: {employeeDto.Password}");

            return employeeDto;
        }

        public async Task<EmployeeDto> UpdateEmployeeAsync(string employeeId, UpdateEmployeeDto updateEmployeeDto)
        {
            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.EmployeeId == employeeId);

            if (employee == null)
                throw new InvalidOperationException("Employee not found.");

            // Check unique constraints if values are being changed
            if (!string.IsNullOrEmpty(updateEmployeeDto.Nic) && 
                updateEmployeeDto.Nic != employee.Nic && 
                await NICExistsAsync(updateEmployeeDto.Nic))
            {
                throw new InvalidOperationException("NIC already exists.");
            }

            if (!string.IsNullOrEmpty(updateEmployeeDto.Email) && 
                updateEmployeeDto.Email != employee.Email && 
                await EmailExistsAsync(updateEmployeeDto.Email))
            {
                throw new InvalidOperationException("Email address already exists.");
            }

            // Map non-null properties from DTO to entity
            _mapper.Map(updateEmployeeDto, employee);
            employee.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return _mapper.Map<EmployeeDto>(employee);
        }

        public async Task<bool> DeleteEmployeeAsync(string employeeId)
        {
            var employee = await _context.Employees
                .FirstOrDefaultAsync(e => e.EmployeeId == employeeId);

            if (employee == null)
                return false;

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> EmployeeNumberExistsAsync(string employeeNumber)
        {
            return await _context.Employees
                .AnyAsync(e => e.EmployeeId == employeeNumber);
        }

        public async Task<bool> NICExistsAsync(string nic)
        {
            return await _context.Employees
                .AnyAsync(e => e.Nic == nic);
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            return await _context.Employees
                .AnyAsync(e => e.Email == email);
        }

        public async Task<int> GetEmployeeCountAsync()
        {
            return await _context.Employees
                .CountAsync();
        }

        public async Task<IEnumerable<EmployeeSummaryDto>> GetEmployeesByDivisionAsync(int divisionId)
        {
            var employees = await _context.Employees
                .Where(e => e.DivisionId == divisionId)
                .OrderBy(e => e.FullName)
                .ToListAsync();

            return _mapper.Map<IEnumerable<EmployeeSummaryDto>>(employees);
        }

        public async Task<IEnumerable<EmployeeSummaryDto>> GetEmployeesByDesignationAsync(string designation)
        {
            var employees = await _context.Employees
                .Where(e => e.DesignationId == designation)
                .OrderBy(e => e.FullName)
                .ToListAsync();

            return _mapper.Map<IEnumerable<EmployeeSummaryDto>>(employees);
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
                .Where(e => e.EmployeeId.StartsWith(prefix))
                .OrderByDescending(e => e.EmployeeId)
                .FirstOrDefaultAsync();

            int nextSequence = 1;
            if (lastEmployee != null)
            {
                var lastNumberStr = lastEmployee.EmployeeId.Replace(prefix, "");
                if (int.TryParse(lastNumberStr, out var lastNumber))
                {
                    nextSequence = lastNumber + 1;
                }
            }

            return $"{prefix}{nextSequence:D3}"; // Format: EMP2026001
        }

        /// <summary>
        /// Generates a secure random password
        /// Format: 2 uppercase + 2 lowercase + 2 digits + 2 special chars (8 characters total)
        /// </summary>
        private string GenerateSecurePassword()
        {
            const string uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const string lowercase = "abcdefghijklmnopqrstuvwxyz";
            const string digits = "0123456789";
            const string special = "!@#$%&*";

            var random = new Random();
            var password = new char[8];

            // 2 uppercase
            password[0] = uppercase[random.Next(uppercase.Length)];
            password[1] = uppercase[random.Next(uppercase.Length)];

            // 2 lowercase
            password[2] = lowercase[random.Next(lowercase.Length)];
            password[3] = lowercase[random.Next(lowercase.Length)];

            // 2 digits
            password[4] = digits[random.Next(digits.Length)];
            password[5] = digits[random.Next(digits.Length)];

            // 2 special chars
            password[6] = special[random.Next(special.Length)];
            password[7] = special[random.Next(special.Length)];

            // Shuffle the password characters
            return new string(password.OrderBy(x => random.Next()).ToArray());
        }
    }
}