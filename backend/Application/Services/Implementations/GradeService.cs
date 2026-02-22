using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SLBFE.HRM.API.Application.DTOs.Response;
using SLBFE.HRM.API.Application.Services.Interfaces;
using SLBFE.HRM.API.Infrastructure.Data.Context;

namespace SLBFE.HRM.API.Application.Services.Implementations
{
    /// <summary>
    /// Grade service implementation
    /// </summary>
    public class GradeService : IGradeService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public GradeService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<GradeDto>> GetAllGradesAsync()
        {
            var grades = await _context.Grades
                .OrderBy(g => g.GradeId)
                .ToListAsync();

            return _mapper.Map<IEnumerable<GradeDto>>(grades);
        }
    }
}
