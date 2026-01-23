using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace SLBFE.HRM.API.Infrastructure.Data.Context;

/// <summary>
/// Design-time factory for ApplicationDbContext to enable EF Core migrations
/// </summary>
public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        // Get the base path
        var basePath = Directory.GetCurrentDirectory();

        // Build configuration
        var configuration = new ConfigurationBuilder()
            .SetBasePath(basePath)
            .AddJsonFile("appsettings.json", optional: false)
            .Build();

        // Create DbContextOptionsBuilder
        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        
        // Get connection string
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        
        // Configure SQL Server
        optionsBuilder.UseSqlServer(connectionString, 
            b => b.MigrationsAssembly("SLBFE.HRM.API"));

        return new ApplicationDbContext(optionsBuilder.Options);
    }
}
