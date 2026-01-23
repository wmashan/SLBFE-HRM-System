using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using SLBFE.HRM.API.Presentation.Middleware;

namespace SLBFE.HRM.API.Presentation.Extensions
{
    /// <summary>
    /// Extension methods for configuring services
    /// </summary>
    public static class ServiceCollectionExtensions
    {
        /// <summary>
        /// Add presentation layer services
        /// </summary>
        public static IServiceCollection AddPresentationServices(this IServiceCollection services)
        {
            // Add controllers with filters
            services.AddControllers(options =>
            {
                // Add global filters here if needed
                // options.Filters.Add<ValidateModelStateAttribute>();
            });

            return services;
        }
    }

    /// <summary>
    /// Extension methods for configuring the application pipeline
    /// </summary>
    public static class ApplicationBuilderExtensions
    {
        /// <summary>
        /// Use custom middleware
        /// </summary>
        public static IApplicationBuilder UseCustomMiddleware(this IApplicationBuilder app)
        {
            app.UseMiddleware<ExceptionHandlingMiddleware>();
            app.UseMiddleware<RequestLoggingMiddleware>();
            
            return app;
        }
    }
}
