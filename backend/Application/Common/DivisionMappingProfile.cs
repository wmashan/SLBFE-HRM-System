using AutoMapper;
using SLBFE.HRM.API.Application.DTOs.Response;
using SLBFE.HRM.API.Core.Entities;

namespace SLBFE.HRM.API.Application.Common
{
    /// <summary>
    /// AutoMapper profile for Division mappings
    /// </summary>
    public class DivisionMappingProfile : Profile
    {
        public DivisionMappingProfile()
        {
            CreateMap<Division, DivisionDto>();
        }
    }
}
