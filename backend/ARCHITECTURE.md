# Backend Architecture Guide

## Overview
The SLBFE HRM System backend follows **Clean Architecture** principles with a clear separation of concerns across multiple layers.

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│         (Controllers, Middleware, Filters, API)              │
├─────────────────────────────────────────────────────────────┤
│                    Application Layer                         │
│        (Services, DTOs, Validators, Mappings)               │
├─────────────────────────────────────────────────────────────┤
│                   Infrastructure Layer                       │
│  (Data Access, Repositories, External Services, Identity)   │
├─────────────────────────────────────────────────────────────┤
│                        Core Layer                            │
│         (Entities, Interfaces, Enums, Exceptions)           │
└─────────────────────────────────────────────────────────────┘
```

## Layer Dependencies

- **Presentation** depends on → Application
- **Application** depends on → Core
- **Infrastructure** depends on → Core, Application
- **Core** depends on → Nothing (pure domain)

## Folder Structure

```
SLBFE.HRM.API/
├── Core/                           # Domain Layer (no dependencies)
│   ├── Entities/                   # Domain entities
│   ├── Interfaces/                 # Repository & service interfaces
│   ├── Enums/                      # Enumerations
│   ├── Exceptions/                 # Custom exceptions
│   └── Constants/                  # Application constants
│
├── Application/                    # Application Layer
│   ├── DTOs/
│   │   ├── Request/               # Request DTOs
│   │   └── Response/              # Response DTOs
│   ├── Services/
│   │   ├── Interfaces/            # Service contracts
│   │   └── Implementation/        # Service implementations
│   ├── Validators/                # FluentValidation validators
│   ├── Mappings/                  # AutoMapper profiles
│   └── Common/                    # Shared utilities
│
├── Infrastructure/                 # Infrastructure Layer
│   ├── Data/
│   │   ├── Context/               # DbContext
│   │   ├── Configurations/        # EF entity configurations
│   │   └── Migrations/            # Database migrations
│   ├── Repositories/              # Repository implementations
│   ├── Services/                  # Infrastructure services (email, storage)
│   ├── Configuration/             # DI setup, seeding
│   └── Identity/                  # ASP.NET Identity setup
│
├── Presentation/                   # Presentation Layer (API)
│   ├── Controllers/               # API controllers
│   ├── Middleware/                # Custom middleware
│   ├── Filters/                   # Action filters
│   ├── Extensions/                # Service extensions
│   └── ActionFilters/             # Controller filters
│
├── Logs/                          # Application logs
├── Program.cs                     # Application entry point
├── appsettings.json              # Configuration
└── SLBFE.HRM.API.csproj          # Project file
```

## Design Patterns Used

### 1. Repository Pattern
- Abstracts data access logic
- Interfaces in `Core/Interfaces`
- Implementations in `Infrastructure/Repositories`

### 2. Service Pattern
- Business logic encapsulation
- Interfaces in `Application/Services/Interfaces`
- Implementations in `Application/Services/Implementation`

### 3. Dependency Injection
- Constructor injection throughout
- Services registered in `Program.cs`

### 4. CQRS (Optional)
- Can be implemented by separating read/write operations
- Commands vs Queries

### 5. Unit of Work
- Coordinates multiple repositories
- Transaction management

## Best Practices

### Entity Design
```csharp
// Core/Entities/Employee.cs
public class Employee
{
    public int Id { get; set; }
    public string EmployeeNumber { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
```

### Repository Interface
```csharp
// Core/Interfaces/IRepository.cs
public interface IRepository<T> where T : class
{
    Task<T?> GetByIdAsync(int id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<T> AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(T entity);
}
```

### Service Implementation
```csharp
// Application/Services/Implementation/EmployeeService.cs
public class EmployeeService : IEmployeeService
{
    private readonly IRepository<Employee> _repository;
    private readonly IMapper _mapper;
    
    public EmployeeService(IRepository<Employee> repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }
    
    public async Task<EmployeeResponseDto> GetEmployeeAsync(int id)
    {
        var employee = await _repository.GetByIdAsync(id);
        return _mapper.Map<EmployeeResponseDto>(employee);
    }
}
```

### Controller Design
```csharp
// Presentation/Controllers/EmployeesController.cs
[ApiController]
[Route("api/[controller]")]
public class EmployeesController : ControllerBase
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
        return Ok(result);
    }
}
```

## Migration from Old Structure

### Old → New Mapping
- `Data/` → `Infrastructure/Data/Context/`
- `Models/` → `Core/Entities/`
- `DTOs/` → `Application/DTOs/`
- `Services/` → `Application/Services/`
- `Controllers/` → `Presentation/Controllers/`
- `Middleware/` → `Presentation/Middleware/`

## Next Steps

1. **Create Domain Entities** in `Core/Entities/`
2. **Define Repository Interfaces** in `Core/Interfaces/`
3. **Implement Repositories** in `Infrastructure/Repositories/`
4. **Create DTOs** in `Application/DTOs/`
5. **Build Services** in `Application/Services/`
6. **Add Controllers** in `Presentation/Controllers/`
7. **Configure DI** in `Program.cs`

## Testing Strategy

```
Tests/
├── Core.Tests/              # Domain logic tests
├── Application.Tests/       # Service tests
├── Infrastructure.Tests/    # Repository tests
└── Integration.Tests/       # End-to-end tests
```

## Benefits of This Architecture

✅ **Separation of Concerns**: Each layer has a clear responsibility  
✅ **Testability**: Easy to unit test each layer independently  
✅ **Maintainability**: Changes in one layer don't affect others  
✅ **Scalability**: Easy to add new features without breaking existing code  
✅ **Flexibility**: Can swap implementations (e.g., different database)  
✅ **Industry Standard**: Follows widely accepted patterns  

## References

- [Clean Architecture by Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Microsoft .NET Architecture Guidelines](https://learn.microsoft.com/en-us/dotnet/architecture/)
