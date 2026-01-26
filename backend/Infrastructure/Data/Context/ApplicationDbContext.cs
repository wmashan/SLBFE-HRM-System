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
        public DbSet<User> Users { get; set; }
        public DbSet<Title> Titles { get; set; }
        public DbSet<Division> Divisions { get; set; }
        public DbSet<Grade> Grades { get; set; }
        public DbSet<EmployeeType> EmployeeTypes { get; set; }
        public DbSet<OtpRecord> OtpRecords { get; set; }
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
                // Primary key is EmployeeId (string)
                entity.HasKey(e => e.EmployeeId);
                
                // Unique constraints
                entity.HasIndex(e => e.Nic).IsUnique();
                entity.HasIndex(e => e.Email).IsUnique();
                    
                // Configure indexes for performance as per schema
                entity.HasIndex(e => e.FullName);
                entity.HasIndex(e => e.DivisionId);
                entity.HasIndex(e => e.DesignationId);
                entity.HasIndex(e => e.EmployeeTypeId);
                entity.HasIndex(e => e.TitleId);
                entity.HasIndex(e => e.GradeId);
                entity.HasIndex(e => e.CivilStatusId);
                entity.HasIndex(e => e.PermanentTownId);

                // Configure foreign keys to match database
                entity.HasOne<Title>()
                    .WithMany()
                    .HasForeignKey(e => e.TitleId)
                    .HasConstraintName("FK_Employees_Titles")
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne<Division>()
                    .WithMany()
                    .HasForeignKey(e => e.DivisionId)
                    .HasConstraintName("FK_Employees_Division")
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne<Grade>()
                    .WithMany()
                    .HasForeignKey(e => e.GradeId)
                    .HasConstraintName("FK_Employees_Grade")
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure Division entity - Map to existing Division table (singular)
            modelBuilder.Entity<Division>(entity =>
            {
                entity.ToTable("Division"); // Explicitly map to Division table (not Divisions)
                entity.HasKey(e => e.DivisionId);
                entity.HasIndex(e => e.Description).IsUnique();
            });

            // Configure Title entity - Map to existing Titles table (plural)
            modelBuilder.Entity<Title>(entity =>
            {
                entity.ToTable("Titles"); // Explicitly map to Titles table (not Title)
                entity.HasKey(e => e.TitleId);
                entity.HasIndex(e => e.Description).IsUnique();
            });

            // Configure Grade entity - Map to existing Grade table (singular)
            modelBuilder.Entity<Grade>(entity =>
            {
                entity.ToTable("Grade"); // Explicitly map to Grade table
                entity.HasKey(e => e.GradeId);
            });

            // Configure EmployeeType entity - Map to existing EmployeeType table (singular)
            modelBuilder.Entity<EmployeeType>(entity =>
            {
                entity.ToTable("EmployeeType"); // Explicitly map to EmployeeType table (not EmployeeTypes)
                entity.HasKey(e => e.EmployeeTypeId);
                entity.HasIndex(e => e.TypeName).IsUnique();
            });

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("Users");
                entity.HasKey(e => e.UserId);
                
                // Unique constraints
                entity.HasIndex(e => e.EmployeeId).IsUnique();
                entity.HasIndex(e => e.UserName).IsUnique();
                
                // Configure properties
                entity.Property(e => e.CreatedAt).HasDefaultValueSql("getdate()");
                entity.Property(e => e.UpdatedAt).HasDefaultValueSql("getdate()");
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
