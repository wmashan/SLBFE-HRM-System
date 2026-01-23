# Presentation Layer (API)

The **Presentation Layer** contains the API controllers, middleware, filters, and other web-specific concerns.

## Structure

### Controllers
Contains all API controllers organized by feature/domain.
- `AuthController`
- `EmployeesController`
- `SalaryController`
- `LoansController`
- `ApplicationsController`
- etc.

### Middleware
Contains custom middleware components.
- `ExceptionHandlingMiddleware` - Global exception handling
- `RequestLoggingMiddleware` - Request/response logging
- `AuthenticationMiddleware` - Custom authentication logic
- etc.

### Filters
Contains action filters for cross-cutting concerns.
- Authorization filters
- Validation filters
- Caching filters
- etc.

### Extensions
Contains extension methods for service registration and configuration.
- `ServiceCollectionExtensions`
- `ApplicationBuilderExtensions`
- etc.

### ActionFilters
Contains custom action filters for controller actions.
- `ValidateModelStateAttribute`
- `CacheAttribute`
- etc.

## Principles
- **HTTP concerns only**: Handles HTTP requests/responses
- **Thin controllers**: Controllers should be thin, delegating to services
- **API contracts**: Defines the public API interface
- **Dependency injection**: Injects application services
