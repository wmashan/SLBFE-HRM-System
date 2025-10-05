# Backend Restructuring - Migration Guide

## What Changed?

The backend has been restructured from a flat folder structure to a **Clean Architecture** layered approach.

### Old Structure → New Structure

| Old Location | New Location | Purpose |
|--------------|--------------|---------|
| `Data/ApplicationDbContext.cs` | `Infrastructure/Data/Context/ApplicationDbContext.cs` | Database context |
| `Middleware/*.cs` | `Presentation/Middleware/*.cs` | HTTP middleware |
| `Models/` (empty) | `Core/Entities/` | Domain entities |
| `DTOs/` (empty) | `Application/DTOs/Request/` & `Response/` | Data transfer objects |
| `Services/` (empty) | `Application/Services/` | Business logic services |
| `Controllers/` (empty) | `Presentation/Controllers/` | API controllers |

## New Folder Structure

```
SLBFE.HRM.API/
│
├── Core/                              # Domain Layer - No dependencies
│   ├── Entities/                      # Domain models
│   │   └── BaseEntity.cs              # Base entity with audit fields
│   ├── Interfaces/                    # Repository & service contracts
│   │   └── IRepository.cs             # Generic repository interface
│   ├── Enums/                         # Enumerations
│   │   └── Enums.cs                   # UserRole, ApplicationStatus, etc.
│   ├── Exceptions/                    # Custom exceptions
│   │   └── CustomExceptions.cs        # NotFoundException, etc.
│   ├── Constants/                     # Application constants
│   │   └── AppConstants.cs            # Roles, policies, defaults
│   └── README.md                      # Layer documentation
│
├── Application/                       # Application Layer - Depends on Core
│   ├── DTOs/
│   │   ├── Request/                   # Request DTOs
│   │   │   └── CommonRequestDtos.cs   # Login, pagination requests
│   │   └── Response/                  # Response DTOs
│   │       └── CommonResponseDtos.cs  # Auth, user, API responses
│   ├── Services/
│   │   ├── Interfaces/                # Service contracts
│   │   └── Implementation/            # Service implementations
│   ├── Validators/                    # FluentValidation validators
│   │   └── CommonValidators.cs        # Request validation rules
│   ├── Mappings/                      # AutoMapper profiles
│   ├── Common/                        # Shared utilities
│   │   └── Result.cs                  # Result & pagination wrappers
│   └── README.md                      # Layer documentation
│
├── Infrastructure/                    # Infrastructure Layer
│   ├── Data/
│   │   ├── Context/                   # DbContext
│   │   │   └── ApplicationDbContext.cs
│   │   ├── Configurations/            # EF entity configurations
│   │   └── Migrations/                # Database migrations
│   ├── Repositories/                  # Repository implementations
│   │   ├── Repository.cs              # Generic repository
│   │   └── UnitOfWork.cs              # Unit of Work pattern
│   ├── Services/                      # Infrastructure services
│   ├── Configuration/                 # DI setup
│   │   └── DependencyInjection.cs     # Service registration
│   ├── Identity/                      # ASP.NET Identity
│   └── README.md                      # Layer documentation
│
├── Presentation/                      # Presentation Layer (API)
│   ├── Controllers/                   # API controllers
│   │   └── BaseApiController.cs       # Base controller
│   ├── Middleware/                    # Custom middleware
│   │   ├── ExceptionHandlingMiddleware.cs
│   │   └── RequestLoggingMiddleware.cs
│   ├── Filters/                       # Action filters
│   │   └── ValidateModelStateAttribute.cs
│   ├── Extensions/                    # Service extensions
│   │   └── ServiceExtensions.cs       # DI & middleware setup
│   ├── ActionFilters/                 # Controller filters
│   └── README.md                      # Layer documentation
│
├── Logs/                              # Application logs
├── Program.cs                         # Application entry point (updated)
├── appsettings.json                   # Configuration
├── ARCHITECTURE.md                    # Architecture documentation
└── SLBFE.HRM.API.csproj              # Project file (updated)
```

## Key Benefits

### 1. **Separation of Concerns**
Each layer has a single, well-defined responsibility:
- **Core**: Pure business logic and domain models
- **Application**: Use cases and business workflows
- **Infrastructure**: Data access and external services
- **Presentation**: HTTP/API concerns

### 2. **Testability**
- Easy to unit test each layer independently
- Mock dependencies using interfaces
- Core layer has no external dependencies

### 3. **Maintainability**
- Changes in one layer don't affect others
- Clear boundaries between layers
- Easy to locate and modify code

### 4. **Scalability**
- Add new features without breaking existing code
- Easy to swap implementations (e.g., different database)
- Supports microservices migration

### 5. **Industry Standard**
- Follows Clean Architecture principles
- Aligns with Domain-Driven Design (DDD)
- Recognized pattern in .NET community

## How to Use the New Structure

### Step 1: Create Domain Entities
```csharp
// Core/Entities/Employee.cs
namespace SLBFE.HRM.API.Core.Entities
{
    public class Employee : BaseEntity
    {
        public string EmployeeNumber { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public EmploymentStatus Status { get; set; }
    }
}
```

### Step 2: Define Repository Interface
```csharp
// Core/Interfaces/IEmployeeRepository.cs
namespace SLBFE.HRM.API.Core.Interfaces
{
    public interface IEmployeeRepository : IRepository<Employee>
    {
        Task<Employee?> GetByEmployeeNumberAsync(string employeeNumber);
        Task<IEnumerable<Employee>> GetActiveEmployeesAsync();
    }
}
```

### Step 3: Implement Repository
```csharp
// Infrastructure/Repositories/EmployeeRepository.cs
namespace SLBFE.HRM.API.Infrastructure.Repositories
{
    public class EmployeeRepository : Repository<Employee>, IEmployeeRepository
    {
        public EmployeeRepository(ApplicationDbContext context) : base(context) { }
        
        public async Task<Employee?> GetByEmployeeNumberAsync(string employeeNumber)
        {
            return await _dbSet.FirstOrDefaultAsync(e => e.EmployeeNumber == employeeNumber);
        }
        
        public async Task<IEnumerable<Employee>> GetActiveEmployeesAsync()
        {
            return await _dbSet.Where(e => e.Status == EmploymentStatus.Active).ToListAsync();
        }
    }
}
```

### Step 4: Create DTOs
```csharp
// Application/DTOs/Response/EmployeeResponseDto.cs
namespace SLBFE.HRM.API.Application.DTOs.Response
{
    public class EmployeeResponseDto : BaseResponseDto
    {
        public string EmployeeNumber { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Status { get; set; }
    }
}
```

### Step 5: Create Service
```csharp
// Application/Services/Implementation/EmployeeService.cs
namespace SLBFE.HRM.API.Application.Services.Implementation
{
    public class EmployeeService : IEmployeeService
    {
        private readonly IEmployeeRepository _repository;
        
        public EmployeeService(IEmployeeRepository repository)
        {
            _repository = repository;
        }
        
        public async Task<Result<EmployeeResponseDto>> GetEmployeeAsync(int id)
        {
            var employee = await _repository.GetByIdAsync(id);
            if (employee == null)
                return Result<EmployeeResponseDto>.FailureResult("Employee not found");
                
            var dto = new EmployeeResponseDto
            {
                Id = employee.Id,
                EmployeeNumber = employee.EmployeeNumber,
                FullName = $"{employee.FirstName} {employee.LastName}",
                Email = employee.Email,
                Status = employee.Status.ToString()
            };
            
            return Result<EmployeeResponseDto>.SuccessResult(dto);
        }
    }
}
```

### Step 6: Create Controller
```csharp
// Presentation/Controllers/EmployeesController.cs
namespace SLBFE.HRM.API.Presentation.Controllers
{
    [Authorize]
    public class EmployeesController : BaseApiController
    {
        private readonly IEmployeeService _employeeService;
        
        public EmployeesController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }
        
        [HttpGet("{id}")]
        public async Task<IActionResult> GetEmployee(int id)
        {
            var result = await _employeeService.GetEmployeeAsync(id);
            
            if (!result.Success)
                return NotFoundResponse(result.Message);
                
            return SuccessResponse(result.Data);
        }
    }
}
```

### Step 7: Register Services
```csharp
// Program.cs or Infrastructure/Configuration/DependencyInjection.cs
services.AddScoped<IEmployeeRepository, EmployeeRepository>();
services.AddScoped<IEmployeeService, EmployeeService>();
```

## File Naming Conventions

- **Entities**: Singular noun (e.g., `Employee.cs`, `SalaryRecord.cs`)
- **Interfaces**: Prefix with 'I' (e.g., `IEmployeeRepository.cs`, `IEmployeeService.cs`)
- **DTOs**: Suffix with purpose (e.g., `EmployeeResponseDto.cs`, `CreateEmployeeRequestDto.cs`)
- **Controllers**: Plural noun + Controller (e.g., `EmployeesController.cs`)
- **Services**: Noun + Service (e.g., `EmployeeService.cs`, `AuthService.cs`)
- **Validators**: DTO name + Validator (e.g., `CreateEmployeeRequestValidator.cs`)

## Namespace Conventions

All namespaces follow the pattern: `SLBFE.HRM.API.{Layer}.{Folder}.{SubFolder}`

Examples:
- `SLBFE.HRM.API.Core.Entities`
- `SLBFE.HRM.API.Application.Services.Implementation`
- `SLBFE.HRM.API.Infrastructure.Repositories`
- `SLBFE.HRM.API.Presentation.Controllers`

## Testing the Structure

Build the project to ensure everything compiles:

```bash
cd backend/SLBFE.HRM.API
dotnet build
```

If there are any errors, they are likely related to namespace changes in existing files.

## Next Steps

1. **Create your domain entities** in `Core/Entities/`
2. **Define repository interfaces** in `Core/Interfaces/`
3. **Update DbContext** to include DbSets for your entities
4. **Create EF configurations** in `Infrastructure/Data/Configurations/`
5. **Implement repositories** in `Infrastructure/Repositories/`
6. **Create DTOs** for requests and responses
7. **Build services** with business logic
8. **Add controllers** for API endpoints
9. **Write validators** for request DTOs
10. **Create AutoMapper profiles** for entity-DTO mapping

## Resources

- [Clean Architecture Guide](ARCHITECTURE.md) - Detailed architecture documentation
- [Core Layer README](Core/README.md) - Core layer guidelines
- [Application Layer README](Application/README.md) - Application layer guidelines
- [Infrastructure Layer README](Infrastructure/README.md) - Infrastructure layer guidelines
- [Presentation Layer README](Presentation/README.md) - Presentation layer guidelines

## Questions or Issues?

Refer to the `ARCHITECTURE.md` file for detailed information about the architecture and design patterns used.
