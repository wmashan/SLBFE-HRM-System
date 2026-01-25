using AutoMapper;
using SLBFE.HRM.API.Application.DTOs.Response;
using SLBFE.HRM.API.Core.Entities;

namespace SLBFE.HRM.API.Application.Common
{
    /// <summary>
    /// AutoMapper profile for Grade mappings
    /// </summary>
    public class GradeMappingProfile : Profile
    {
        public GradeMappingProfile()
        {
            CreateMap<Grade, GradeDto>();
        }
    }
}
