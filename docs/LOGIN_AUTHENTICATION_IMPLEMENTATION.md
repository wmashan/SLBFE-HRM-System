# Login Authentication Implementation

## Overview
This document describes the complete authentication system implementation for the SLBFE HRM System, including credential generation during employee registration and role-based login functionality.

## Features Implemented

### 1. Employee Registration with Credential Generation
When a new employee is created through the registration form, the system automatically generates login credentials:

- **Username**: System-generated `EmployeeId` (e.g., "EMP001")
- **Password**: Secure randomly generated 8-character password
  - 2 uppercase letters
  - 2 lowercase letters
  - 2 digits
  - 2 special characters (!@#$%^&*)

### 2. User Record Storage
Credentials are stored in the `Users` table with the following structure:

```sql
Users Table:
- UserId (PK, Identity)
- EmployeeId (FK, Unique)
- RoleID (1=Admin, 2=HR Manager, 3=Employee)
- UserName (Unique, same as EmployeeId)
- PasswordHash (BCrypt encrypted)
- Status (Active/Inactive)
- LastLogin
- CreatedAt
- UpdatedAt
```

### 3. Password Security
- Passwords are hashed using **BCrypt** algorithm before storage
- Plain-text password is only shown once on the registration success page
- Copy-to-clipboard functionality for easy credential capture

### 4. Login Functionality
The login system authenticates users against the Users table:

- **Endpoint**: `POST /api/Auth/login`
- **Request Body**:
  ```json
  {
    "username": "EMP001",
    "password": "user-password"
  }
  ```
- **Response**:
  ```json
  {
    "userId": 1,
    "employeeId": 1,
    "roleId": 3,
    "userName": "EMP001",
    "status": "Active",
    "lastLogin": "2025-01-25T10:30:00"
  }
  ```

### 5. Role-Based Dashboard Redirection
After successful login, users are redirected based on their `RoleId`:

| RoleId | Role Name   | Dashboard Route         |
|--------|-------------|------------------------|
| 1      | Admin       | `/admin-dashboard`     |
| 2      | HR Manager  | `/hr-dashboard`        |
| 3      | Employee    | `/employee-dashboard`  |

## Backend Implementation

### Files Modified/Created

1. **Backend/Core/Entities/User.cs** (NEW)
   - Entity class matching Users table schema
   - Properties: UserId, EmployeeId, RoleID, UserName, PasswordHash, Status, LastLogin, CreatedAt, UpdatedAt

2. **Backend/Application/DTOs/Request/LoginDto.cs** (NEW)
   ```csharp
   public class LoginDto
   {
       public required string Username { get; set; }
       public required string Password { get; set; }
   }
   ```

3. **Backend/Application/DTOs/Response/LoginResponseDto.cs** (NEW)
   ```csharp
   public class LoginResponseDto
   {
       public int UserId { get; set; }
       public int EmployeeId { get; set; }
       public int RoleId { get; set; }
       public required string UserName { get; set; }
       public required string Status { get; set; }
       public DateTime LastLogin { get; set; }
   }
   ```

4. **Backend/Application/Services/Interfaces/IAuthService.cs** (NEW)
   - Interface defining `LoginAsync(LoginDto loginDto)` method

5. **Backend/Application/Services/Implementations/AuthService.cs** (NEW)
   - Implements authentication logic
   - Password verification using BCrypt
   - User status validation
   - LastLogin timestamp update

6. **Backend/Presentation/Controllers/AuthController.cs** (NEW)
   - `POST /api/Auth/login` endpoint
   - Returns `LoginResponseDto` on success

7. **Backend/Application/Services/Implementations/EmployeeService.cs** (MODIFIED)
   - Added `CreateEmployeeWithCredentialsAsync` method
   - Password generation: `GenerateSecurePassword()`
   - User record creation with BCrypt hashing

8. **Backend/Infrastructure/Data/Context/ApplicationDbContext.cs** (MODIFIED)
   - Added `DbSet<User> Users`
   - Entity configuration for User table

9. **Backend/Program.cs** (MODIFIED)
   - Registered `IAuthService` and `AuthService` in DI container

## Frontend Implementation

### Files Modified

1. **frontend/src/services/api.ts** (MODIFIED)
   - Updated `login()` method to call `/api/Auth/login`
   - Added `mapRoleIdToRole()` helper function
   - Maps backend RoleId to frontend role strings
   - Stores user data and token in localStorage

2. **frontend/src/pages/UserAccountCreation.tsx** (MODIFIED)
   - Added credentials display section on success page
   - Copy-to-clipboard functionality for username and password
   - Warning message to save credentials securely

3. **frontend/src/contexts/AuthContext.tsx** (EXISTING)
   - Already implements `getDashboardPath()` for role-based routing
   - No changes needed - works with updated API service

## Testing the Implementation

### 1. Create a New Employee
1. Navigate to **User Account Creation** page
2. Fill in all required employee details
3. Submit the form
4. After successful creation, note the displayed:
   - **Username** (e.g., "EMP001")
   - **Password** (e.g., "Ab12@#Cd")

### 2. Test Login
1. Navigate to **Login** page
2. Enter the username and password from step 1
3. Click **Login**
4. Verify you're redirected to the correct dashboard based on role:
   - Employee (RoleId=3) → Employee Dashboard
   - HR Manager (RoleId=2) → HR Dashboard
   - Admin (RoleId=1) → Admin Dashboard

### 3. Verify Database Records
Check that records were created in:
- **Employees** table (employee record)
- **Users** table (credentials with BCrypt hashed password)

## Security Notes

1. **Password Hashing**: All passwords are hashed using BCrypt with a default work factor
2. **One-Time Display**: Plain-text password is only shown once on registration success
3. **Password Strength**: Generated passwords meet complexity requirements
4. **Status Check**: Login validates user status is "Active"
5. **Token Storage**: Authentication token stored in localStorage (consider HttpOnly cookies for production)

## Future Enhancements

1. **JWT Tokens**: Implement proper JWT token generation on backend
2. **Refresh Tokens**: Add token refresh mechanism
3. **Password Reset**: Implement password reset functionality
4. **MFA**: Add multi-factor authentication
5. **Session Management**: Track and manage active user sessions
6. **Account Lockout**: Implement account lockout after failed login attempts
7. **Password Expiry**: Force periodic password changes
8. **Audit Logging**: Log all authentication attempts

## Database Schema

### Users Table
```sql
CREATE TABLE Users (
    UserId INT PRIMARY KEY IDENTITY(1,1),
    EmployeeId INT UNIQUE NOT NULL,
    RoleID INT NOT NULL,
    UserName NVARCHAR(50) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    Status NVARCHAR(20) NOT NULL,
    LastLogin DATETIME2,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETDATE(),
    CONSTRAINT FK_Users_Employees FOREIGN KEY (EmployeeId) REFERENCES Employees(EmployeeId)
);
```

## API Endpoints

### Authentication
- `POST /api/Auth/login` - User login with username/password

### Employee Management
- `POST /api/Employee` - Create employee with credentials generation

## Dependencies

### Backend
- **BCrypt.Net-Next** (v4.0.3) - Password hashing
- **Entity Framework Core** - Database access
- **AutoMapper** - DTO mapping

### Frontend
- **React** - UI framework
- **TypeScript** - Type safety
- **React Router** - Navigation and routing

## Troubleshooting

### Issue: Login fails with valid credentials
- Check that the User record exists in the database
- Verify password is correctly hashed in PasswordHash column
- Check that Status is "Active"
- Verify backend API is running on port 5000

### Issue: Credentials not showing after registration
- Check browser console for errors
- Verify AutoMapper configuration includes EmployeeWithCredentialsDto
- Check that JsonPropertyName attributes are present on DTO properties

### Issue: Wrong dashboard after login
- Verify RoleId is correctly set in Users table (1=Admin, 2=HR, 3=Employee)
- Check frontend role mapping in `mapRoleIdToRole()` function
- Verify `getDashboardPath()` logic in AuthContext

## Conclusion

The authentication system is now fully functional with:
- ✅ Automatic credential generation during employee registration
- ✅ Secure password storage with BCrypt hashing
- ✅ Role-based login authentication
- ✅ Dashboard redirection based on user role
- ✅ User-friendly credential display and copy functionality

Users can now register employees, receive login credentials, and authenticate into the system with role-appropriate access.
