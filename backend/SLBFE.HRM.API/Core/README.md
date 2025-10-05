# Core Layer

The **Core Layer** contains the domain entities and business logic of the application. This layer has **no dependencies** on other layers.

## Structure

### Entities
Contains all domain entities (models) that represent the core business objects.
- User
- Employee
- SalaryRecord
- StaffLoan
- RetirementRecord
- DisciplinaryAction
- Application
- etc.

### Interfaces
Contains all repository and service interfaces that define contracts for the application.
- `IRepository<T>`
- `IAuthService`
- `IEmployeeService`
- etc.

### Enums
Contains all enumeration types used across the application.
- UserRole
- ApplicationStatus
- LeaveType
- etc.

### Exceptions
Contains custom exception classes for domain-specific errors.
- `NotFoundException`
- `BusinessRuleViolationException`
- `UnauthorizedAccessException`
- etc.

### Constants
Contains application-wide constants.
- System settings
- Default values
- Error messages
- etc.

## Principles
- **No external dependencies**: This layer should not reference any other project layers
- **Pure business logic**: Only domain logic, no infrastructure concerns
- **Framework agnostic**: No framework-specific code
