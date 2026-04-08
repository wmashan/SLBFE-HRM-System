using AutoMapper;
using SLBFE.HRM.API.Application.DTOs.Response;
using SLBFE.HRM.API.Core.Entities;

namespace SLBFE.HRM.API.Application.Common
{
    public class EmployeeTypeMappingProfile : Profile
    {
        public EmployeeTypeMappingProfile()
        {
            CreateMap<EmployeeType, EmployeeTypeDto>();
        }
    }
}
