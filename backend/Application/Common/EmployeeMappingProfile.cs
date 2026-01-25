using AutoMapper;
using SLBFE.HRM.API.Application.DTOs.Request;
using SLBFE.HRM.API.Application.DTOs.Response;
using SLBFE.HRM.API.Core.Entities;

namespace SLBFE.HRM.API.Application.Common
{
    /// <summary>
    /// AutoMapper profile for Employee mappings
    /// </summary>
    public class EmployeeMappingProfile : Profile
    {
        public EmployeeMappingProfile()
        {
            // Employee to EmployeeDto mapping
            CreateMap<Employee, EmployeeDto>();

            // Employee to EmployeeWithCredentialsDto mapping
            CreateMap<Employee, EmployeeWithCredentialsDto>()
                .IncludeBase<Employee, EmployeeDto>()
                .ForMember(dest => dest.Username, opt => opt.Ignore())
                .ForMember(dest => dest.Password, opt => opt.Ignore());

            // Employee to EmployeeSummaryDto mapping
            CreateMap<Employee, EmployeeSummaryDto>()
                .ForMember(dest => dest.JoinDate, opt => opt.MapFrom(src => GetEarliestJoinDate(src)));

            // CreateEmployeeDto to Employee mapping
            CreateMap<CreateEmployeeDto, Employee>()
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore());

            // UpdateEmployeeDto to Employee mapping
            CreateMap<UpdateEmployeeDto, Employee>()
                .ForMember(dest => dest.EmployeeId, opt => opt.Ignore()) // Employee number should not be updatable
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForAllMembers(opt => opt.Condition((src, dest, sourceMember) => sourceMember != null));
        }

        /// <summary>
        /// Helper method to get the earliest join date from all possible join dates
        /// </summary>
        private static DateTime? GetEarliestJoinDate(Employee employee)
        {
            var dates = new List<DateTime?> { employee.PermanentDate, employee.JoinDateContract, employee.JoinDateCasual }
                .Where(d => d.HasValue)
                .Select(d => d!.Value)
                .ToList();

            return dates.Any() ? dates.Min() : null;
        }
    }
}