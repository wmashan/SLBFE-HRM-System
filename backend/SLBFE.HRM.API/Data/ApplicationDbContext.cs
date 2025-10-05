using Microsoft.EntityFrameworkCore;

namespace SLBFE.HRM.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        // DbSets will be added here as models are created
        // Example:
        // public DbSet<User> Users { get; set; }
        // public DbSet<Employee> Employees { get; set; }
        // public DbSet<SalaryRecord> SalaryRecords { get; set; }
        // public DbSet<StaffLoan> StaffLoans { get; set; }
        // public DbSet<RetirementRecord> RetirementRecords { get; set; }
        // public DbSet<DisciplinaryAction> DisciplinaryActions { get; set; }
        // public DbSet<Application> Applications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure entity relationships and constraints here
            // Example:
            // modelBuilder.Entity<User>(entity =>
            // {
            //     entity.HasKey(e => e.Id);
            //     entity.HasIndex(e => e.Email).IsUnique();
            //     entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            // });

            // Configure decimal precision for financial fields
            // modelBuilder.Entity<SalaryRecord>()
            //     .Property(s => s.BaseSalary)
            //     .HasPrecision(18, 2);

            // Configure cascade delete behaviors
            // Configure indexes for performance
            // Add seed data if needed
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            // Add audit fields automatically
            var entries = ChangeTracker.Entries()
                .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified);

            foreach (var entry in entries)
            {
                if (entry.State == EntityState.Added)
                {
                    // Set CreatedAt for new entries
                    if (entry.Entity.GetType().GetProperty("CreatedAt") != null)
                    {
                        entry.Property("CreatedAt").CurrentValue = DateTime.UtcNow;
                    }
                }

                if (entry.State == EntityState.Modified)
                {
                    // Set UpdatedAt for modified entries
                    if (entry.Entity.GetType().GetProperty("UpdatedAt") != null)
                    {
                        entry.Property("UpdatedAt").CurrentValue = DateTime.UtcNow;
                    }
                }
            }

            return base.SaveChangesAsync(cancellationToken);
        }
    }
}
