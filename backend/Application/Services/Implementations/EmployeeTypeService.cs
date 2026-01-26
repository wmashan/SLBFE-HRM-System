using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SLBFE.HRM.API.Application.DTOs.Response;
using SLBFE.HRM.API.Application.Services.Interfaces;
using SLBFE.HRM.API.Infrastructure.Data.Context;

namespace SLBFE.HRM.API.Application.Services.Implementations
{
    /// <summary>
    /// Employee Type service implementation
    /// </summary>
    public class EmployeeTypeService : IEmployeeTypeService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public EmployeeTypeService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<EmployeeTypeDto>> GetAllEmployeeTypesAsync()
        {
            var employeeTypes = await _context.EmployeeTypes
                .OrderBy(et => et.TypeName)
                .ToListAsync();

            return _mapper.Map<IEnumerable<EmployeeTypeDto>>(employeeTypes);
        }
    }
}
