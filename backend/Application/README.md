# Application Layer

The **Application Layer** contains application-specific business logic, DTOs, and service implementations.

## Structure

### DTOs (Data Transfer Objects)
#### Request
Contains DTOs for incoming requests from the API.
- `LoginRequestDto`
- `CreateEmployeeRequestDto`
- `UpdateSalaryRequestDto`
- etc.

#### Response
Contains DTOs for API responses.
- `AuthResponseDto`
- `EmployeeResponseDto`
- `SalaryRecordResponseDto`
- etc.

### Services
#### Interfaces
Service contracts that define application-level operations.

#### Implementation
Concrete implementations of service interfaces containing business logic.
- `AuthService`
- `EmployeeService`
- `SalaryService`
- `LoanService`
- etc.

### Validators
Contains FluentValidation validators for request DTOs.
- `LoginRequestValidator`
- `CreateEmployeeValidator`
- etc.

### Mappings
Contains AutoMapper profiles for object mapping.
- `EntityToDtoMappingProfile`
- `DtoToEntityMappingProfile`

### Common
Contains shared application-level utilities and helpers.
- Result wrappers
- Pagination helpers
- etc.

## Principles
- **Depends on Core layer only**: Can reference Core, but not Infrastructure or Presentation
- **Business orchestration**: Coordinates domain objects to perform use cases
- **DTO mapping**: Translates between domain entities and DTOs
