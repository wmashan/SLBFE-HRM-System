using AutoMapper;
using SLBFE.HRM.API.Application.DTOs.Request;
using SLBFE.HRM.API.Application.DTOs.Response;
using SLBFE.HRM.API.Core.Entities;
using SLBFE.HRM.API.Core.Enums;

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
            CreateMap<Employee, EmployeeDto>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
                .ForMember(dest => dest.EmploymentStatus, opt => opt.MapFrom(src => src.EmploymentStatus.ToString()))
                .ForMember(dest => dest.ReportingManagerName, opt => opt.MapFrom(src => src.ReportingManager != null ? src.ReportingManager.FullName : null));

            // Employee to EmployeeSummaryDto mapping
            CreateMap<Employee, EmployeeSummaryDto>()
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()))
                .ForMember(dest => dest.TypeOfEmployment, opt => opt.MapFrom(src => src.TypeOfEmployment))
                .ForMember(dest => dest.JoinDate, opt => opt.MapFrom(src => GetEarliestJoinDate(src)));

            // CreateEmployeeDto to Employee mapping
            CreateMap<CreateEmployeeDto, Employee>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => EmployeeStatus.Active))
                .ForMember(dest => dest.EmploymentStatus, opt => opt.MapFrom(src => EmploymentStatus.Active))
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.UpdatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.IsDeleted, opt => opt.MapFrom(src => false))
                .ForMember(dest => dest.ReportingManager, opt => opt.Ignore())
                .ForMember(dest => dest.Subordinates, opt => opt.Ignore())
                .ForMember(dest => dest.MedicalRequests, opt => opt.Ignore());

            // UpdateEmployeeDto to Employee mapping
            CreateMap<UpdateEmployeeDto, Employee>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.EmployeeNumber, opt => opt.Ignore()) // Employee number should not be updatable
                .ForMember(dest => dest.Status, opt => opt.Ignore()) // Status should be updated through dedicated endpoint
                .ForMember(dest => dest.EmploymentStatus, opt => opt.Ignore()) // Employment status should be updated through dedicated endpoint
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedBy, opt => opt.Ignore())
                .ForMember(dest => dest.IsDeleted, opt => opt.Ignore())
                .ForMember(dest => dest.ReportingManager, opt => opt.Ignore())
                .ForMember(dest => dest.Subordinates, opt => opt.Ignore())
                .ForMember(dest => dest.MedicalRequests, opt => opt.Ignore())
                .ForAllMembers(opt => opt.Condition((src, dest, sourceMember) => sourceMember != null));
        }

        /// <summary>
        /// Helper method to get the earliest join date from all possible join dates
        /// </summary>
        private static DateTime? GetEarliestJoinDate(Employee employee)
        {
            var dates = new List<DateTime?> { employee.DateOfPermanent, employee.JoinDateContract, employee.JoinDateCasual }
                .Where(d => d.HasValue)
                .Select(d => d!.Value)
                .ToList();

            return dates.Any() ? dates.Min() : null;
        }
    }
}