# Infrastructure Layer

The **Infrastructure Layer** contains implementations of external concerns like data access, file systems, email services, etc.

## Structure

### Data
#### Context
Contains the Entity Framework Core DbContext.
- `ApplicationDbContext`

#### Configurations
Contains Entity Framework entity configurations (Fluent API).
- `UserConfiguration`
- `EmployeeConfiguration`
- etc.

#### Migrations
Contains EF Core database migrations.

### Repositories
Contains concrete implementations of repository interfaces defined in Core layer.
- `EmployeeRepository`
- `SalaryRepository`
- `LoanRepository`
- etc.

### Services
Contains implementations of infrastructure services.
- Email service
- File storage service
- SMS service
- External API integrations
- etc.

### Configuration
Contains setup and configuration for infrastructure concerns.
- Dependency injection setup
- Database seeding
- etc.

### Identity
Contains ASP.NET Core Identity configuration and customizations.
- User store
- Role store
- Custom identity validators
- etc.

## Principles
- **External concerns**: Handles all external dependencies and I/O
- **Implements Core interfaces**: Provides concrete implementations
- **Data access**: All database operations happen here
- **Third-party integrations**: External services, APIs, etc.
