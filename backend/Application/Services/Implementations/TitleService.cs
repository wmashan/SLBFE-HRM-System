using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SLBFE.HRM.API.Application.DTOs.Response;
using SLBFE.HRM.API.Application.Services.Interfaces;
using SLBFE.HRM.API.Infrastructure.Data.Context;

namespace SLBFE.HRM.API.Application.Services.Implementations
{
    /// <summary>
    /// Title service implementation
    /// </summary>
    public class TitleService : ITitleService
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public TitleService(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<TitleDto>> GetAllTitlesAsync()
        {
            var titles = await _context.Titles
                .OrderBy(t => t.Description)
                .ToListAsync();

            return _mapper.Map<IEnumerable<TitleDto>>(titles);
        }
    }
}
