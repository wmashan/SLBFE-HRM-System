using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SLBFE.HRM.API.Application.DTOs.Response;
using SLBFE.HRM.API.Application.Services.Interfaces;
using SLBFE.HRM.API.Infrastructure.Data.Context;

namespace SLBFE.HRM.API.Application.Services.Implementations
{
    /// <summary>
    /// Division service implementation
    /// </summary>
    public class DivisionService : IDivisionService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public DivisionService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<DivisionDto>> GetAllDivisionsAsync()
        {
            var divisions = await _context.Divisions
                .OrderBy(d => d.Description)
                .ToListAsync();

            return _mapper.Map<IEnumerable<DivisionDto>>(divisions);
        }
    }
}
