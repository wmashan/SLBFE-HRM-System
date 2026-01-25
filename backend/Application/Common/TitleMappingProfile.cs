using AutoMapper;
using SLBFE.HRM.API.Application.DTOs.Response;
using SLBFE.HRM.API.Core.Entities;

namespace SLBFE.HRM.API.Application.Common
{
    /// <summary>
    /// AutoMapper profile for Title mappings
    /// </summary>
    public class TitleMappingProfile : Profile
    {
        public TitleMappingProfile()
        {
            CreateMap<Title, TitleDto>();
        }
    }
}
