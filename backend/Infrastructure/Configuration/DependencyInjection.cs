using Microsoft.Extensions.DependencyInjection;
using SLBFE.HRM.API.Core.Interfaces;
using SLBFE.HRM.API.Infrastructure.Repositories;

namespace SLBFE.HRM.API.Infrastructure.Configuration
{
    /// <summary>
    /// Dependency injection configuration for Infrastructure layer
    /// </summary>
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services)
        {
            // Register repositories
            services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            // Register infrastructure services
            // services.AddScoped<IEmailService, EmailService>();
            // services.AddScoped<IFileStorageService, FileStorageService>();
            // services.AddScoped<ISmsService, SmsService>();

            return services;
        }
    }
}
