 using Microsoft.EntityFrameworkCore;
using SLBFE.HRM.API.Core.Entities;

namespace SLBFE.HRM.API.Infrastructure.Data.Context
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
        public DbSet<Employee> Employees { get; set; }
        // public DbSet<SalaryRecord> SalaryRecords { get; set; }
        // public DbSet<RetirementRecord> RetirementRecords { get; set; }
        // public DbSet<Application> Applications { get; set; }
        
        public DbSet<MedicalRequest> MedicalRequests { get; set; }

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

            // Configure MedicalRequest entity
            modelBuilder.Entity<MedicalRequest>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.HasIndex(e => e.RequestNumber).IsUnique();
                entity.Property(e => e.RequestNumber).IsRequired().HasMaxLength(50);
                entity.Property(e => e.EmployeeNumber).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Division).IsRequired().HasMaxLength(100);
                entity.Property(e => e.ApplicantName).IsRequired().HasMaxLength(200);
                entity.Property(e => e.MaritalStatus).IsRequired().HasMaxLength(20);
                entity.Property(e => e.PatientName).IsRequired().HasMaxLength(200);
                entity.Property(e => e.RelationshipToApplicant).IsRequired().HasMaxLength(50);
                entity.Property(e => e.MedicalProvider).IsRequired().HasMaxLength(200);
                entity.Property(e => e.DoctorName).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Diagnosis).IsRequired().HasMaxLength(500);
                entity.Property(e => e.TreatmentDuration).HasMaxLength(100);
                entity.Property(e => e.Description).HasMaxLength(1000);
                entity.Property(e => e.RequestedAmount).HasPrecision(18, 2);
                entity.Property(e => e.ClaimedAmount).HasPrecision(18, 2);
                entity.Property(e => e.AvailableAmount).HasPrecision(18, 2);
                entity.Property(e => e.ApprovedAmount).HasPrecision(18, 2);
                entity.HasIndex(e => e.EmployeeId);
                entity.HasIndex(e => e.Status);
                entity.HasIndex(e => e.SubmittedDate);
            });

            // Configure Employee entity
            modelBuilder.Entity<Employee>(entity =>
            {
                entity.HasKey(e => e.Id);
                
                // Unique constraints
                entity.HasIndex(e => e.EmployeeNumber).IsUnique();
                entity.HasIndex(e => e.NIC).IsUnique();
                entity.HasIndex(e => e.EmailAddress).IsUnique();
                
                // Configure decimal precision for financial fields
                entity.Property(e => e.BasicSalary).HasPrecision(18, 2);
                
                // Configure self-referencing relationship for reporting manager
                entity.HasOne(e => e.ReportingManager)
                    .WithMany(e => e.Subordinates)
                    .HasForeignKey(e => e.ReportingManagerId)
                    .OnDelete(DeleteBehavior.Restrict);
                
                // Configure relationship with MedicalRequests
                entity.HasMany(e => e.MedicalRequests)
                    .WithOne()
                    .HasForeignKey(mr => mr.EmployeeId)
                    .OnDelete(DeleteBehavior.Cascade);
                    
                // Configure indexes for performance
                entity.HasIndex(e => e.FullName);
                entity.HasIndex(e => e.Division);
                entity.HasIndex(e => e.Designation);
                entity.HasIndex(e => e.Status);
                entity.HasIndex(e => e.TypeOfEmployment);
                entity.HasIndex(e => e.Department);
            });

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
