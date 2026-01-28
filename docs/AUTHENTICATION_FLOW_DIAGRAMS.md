# Authentication Flow Diagrams

This document provides comprehensive visual diagrams for all authentication flows in the SLBFE HRM System.

## Table of Contents
1. [Employee Registration & Credential Generation](#1-employee-registration--credential-generation)
2. [Login Authentication Flow](#2-login-authentication-flow)
3. [JWT Token Refresh Flow](#3-jwt-token-refresh-flow)
4. [Forgot Password Flow](#4-forgot-password-flow)
5. [Token Validation & Authorization Flow](#5-token-validation--authorization-flow)
6. [Logout Flow](#6-logout-flow)

---

## 1. Employee Registration & Credential Generation

When a new employee is registered, the system automatically generates login credentials.

```mermaid
sequenceDiagram
    participant Admin as Admin/HR Manager
    participant Frontend as Frontend
    participant API as Backend API
    participant DB as Database
    participant PasswordGen as Password Generator
    
    Admin->>Frontend: Fill employee registration form
    Frontend->>API: POST /api/Employees/create
    
    API->>DB: Save employee details
    DB-->>API: Employee created (EmployeeId: EMP001)
    
    API->>PasswordGen: Generate secure password
    Note over PasswordGen: 8 chars: 2 upper, 2 lower,<br/>2 digits, 2 special
    PasswordGen-->>API: Generated password
    
    API->>API: Hash password with BCrypt
    
    API->>DB: Insert into Users table
    Note over DB: UserId, EmployeeId, RoleID,<br/>UserName (=EmployeeId),<br/>PasswordHash, Status: Active
    DB-->>API: User record created
    
    API-->>Frontend: Success with credentials
    Note over Frontend: Display Username & Password<br/>(one-time only)
    Frontend-->>Admin: Show credentials with copy button
```

---

## 2. Login Authentication Flow

Main authentication flow with JWT access token and refresh token generation.

```mermaid
sequenceDiagram
    participant User as User/Employee
    participant Frontend as Frontend
    participant API as Auth Controller
    participant AuthService as Auth Service
    participant DB as Database
    participant JWT as JWT Generator
    
    User->>Frontend: Enter username & password
    Frontend->>API: POST /api/Auth/login<br/>{username, password}
    
    API->>AuthService: LoginAsync(loginDto)
    
    AuthService->>DB: Find user by username
    DB-->>AuthService: User record
    
    alt User not found
        AuthService-->>API: null
        API-->>Frontend: 401 Unauthorized
        Frontend-->>User: Invalid credentials
    else User found
        AuthService->>AuthService: Verify user status = "Active"
        
        alt User inactive
            AuthService-->>API: null
            API-->>Frontend: 401 Unauthorized
            Frontend-->>User: Account inactive
        else User active
            AuthService->>AuthService: BCrypt.Verify(password, hash)
            
            alt Invalid password
                AuthService-->>API: null
                API-->>Frontend: 401 Unauthorized
                Frontend-->>User: Invalid credentials
            else Valid password
                AuthService->>JWT: Generate JWT access token
                Note over JWT: Claims: UserId, RoleId,<br/>Username, Expiry: 60 min
                JWT-->>AuthService: Access token
                
                AuthService->>AuthService: Generate refresh token (secure random)
                Note over AuthService: Crypto random 64 bytes
                
                AuthService->>DB: Store refresh token
                Note over DB: Token, UserId, Expires (7 days),<br/>IsActive: true
                
                AuthService->>DB: Update LastLogin timestamp
                
                AuthService-->>API: TokenResponseDto
                Note over AuthService: accessToken, refreshToken,<br/>expiresIn, userId, roleId
                
                API-->>Frontend: 200 OK with tokens
                Frontend->>Frontend: Store tokens (localStorage)
                Frontend->>Frontend: Set Authorization header
                
                alt RoleId = 1
                    Frontend->>User: Redirect to /admin-dashboard
                else RoleId = 2
                    Frontend->>User: Redirect to /hr-dashboard
                else RoleId = 3
                    Frontend->>User: Redirect to /employee-dashboard
                end
            end
        end
    end
```

---

## 3. JWT Token Refresh Flow

Automatic token refresh when access token expires or is about to expire.

```mermaid
sequenceDiagram
    participant Frontend as Frontend
    participant API as Auth Controller
    participant AuthService as Auth Service
    participant DB as Database
    participant JWT as JWT Validator
    
    Frontend->>Frontend: Access token expired or expiring
    
    Frontend->>API: POST /api/Auth/refresh-token<br/>{accessToken, refreshToken}
    
    API->>AuthService: RefreshTokenAsync(dto)
    
    AuthService->>JWT: Extract claims from expired token
    Note over JWT: Don't validate expiration
    JWT-->>AuthService: UserId, RoleId, Username
    
    AuthService->>DB: Find refresh token by token string
    DB-->>AuthService: RefreshToken record
    
    alt Token not found
        AuthService-->>API: null
        API-->>Frontend: 401 Unauthorized
        Frontend->>Frontend: Redirect to login
    else Token found
        AuthService->>AuthService: Validate token
        Note over AuthService: - Is token active?<br/>- Not expired?<br/>- Not used?<br/>- Matches UserId?
        
        alt Validation failed
            AuthService-->>API: null
            API-->>Frontend: 401 Unauthorized
            Frontend->>Frontend: Redirect to login
        else Validation passed
            AuthService->>JWT: Generate new JWT access token
            Note over JWT: Claims: UserId, RoleId,<br/>Username, Expiry: 60 min
            JWT-->>AuthService: New access token
            
            AuthService->>AuthService: Generate new refresh token
            
            AuthService->>DB: Mark old token as used/revoked
            Note over DB: IsActive = false,<br/>RevokedAt = Now
            
            AuthService->>DB: Store new refresh token
            Note over DB: New token, Expires (7 days),<br/>IsActive: true
            
            AuthService-->>API: New TokenResponseDto
            API-->>Frontend: 200 OK with new tokens
            Frontend->>Frontend: Update stored tokens
            Frontend->>Frontend: Retry original request
        end
    end
```

---

## 4. Forgot Password Flow

Complete password recovery process with OTP verification.

```mermaid
sequenceDiagram
    participant User as User
    participant Frontend as Frontend
    participant API as Auth Controller
    participant AuthService as Auth Service
    participant DB as Database
    participant OTPGen as OTP Generator
    participant Console as Terminal/Console
    
    Note over User,Console: STEP 1: Request Password Reset
    
    User->>Frontend: Click "Forgot Password"
    Frontend->>User: Show forgot password form
    User->>Frontend: Enter Employee ID
    
    Frontend->>API: POST /api/Auth/forgot-password<br/>{employeeId: "EMP001"}
    
    API->>AuthService: ForgotPasswordAsync(dto)
    AuthService->>DB: Find user by EmployeeId
    
    alt User not found
        AuthService-->>API: Error response
        API-->>Frontend: 404 Not Found
        Frontend-->>User: Employee ID not found
    else User found
        AuthService->>DB: Get employee email
        DB-->>AuthService: Email address
        
        AuthService->>OTPGen: Generate 6-digit OTP
        OTPGen-->>AuthService: OTP code (e.g., 123456)
        
        AuthService->>DB: Store OTP
        Note over DB: EmployeeId, OTP,<br/>Expires: Now + 10 min,<br/>IsUsed: false
        
        AuthService->>Console: Print OTP
        Note over Console: Development: Display in terminal<br/>Production: Send via email
        
        AuthService->>AuthService: Mask email
        Note over AuthService: john@example.com<br/>→ jo***@example.com
        
        AuthService-->>API: Success with masked email
        API-->>Frontend: 200 OK {maskedEmail}
        Frontend-->>User: Show OTP verification form<br/>Email: jo***@example.com
    end
    
    Note over User,Console: STEP 2: Verify OTP & Reset Password
    
    User->>Frontend: Enter OTP and new password
    Frontend->>API: POST /api/Auth/reset-password<br/>{employeeId, otp, newPassword, confirmPassword}
    
    API->>AuthService: ResetPasswordAsync(dto)
    
    AuthService->>DB: Find OTP by EmployeeId & OTP
    
    alt OTP not found or invalid
        AuthService-->>API: Error response
        API-->>Frontend: 400 Bad Request
        Frontend-->>User: Invalid OTP
    else OTP found
        AuthService->>AuthService: Validate OTP
        Note over AuthService: - Not expired? (< 10 min)<br/>- Not used?<br/>- Matches employee?
        
        alt OTP expired
            AuthService-->>API: Error response
            API-->>Frontend: 400 Bad Request
            Frontend-->>User: OTP expired, request new one
        else OTP already used
            AuthService-->>API: Error response
            API-->>Frontend: 400 Bad Request
            Frontend-->>User: OTP already used
        else OTP valid
            AuthService->>AuthService: Validate password
            Note over AuthService: - Min 6 characters<br/>- Passwords match
            
            alt Password validation failed
                AuthService-->>API: Error response
                API-->>Frontend: 400 Bad Request
                Frontend-->>User: Password requirements not met
            else Password valid
                AuthService->>AuthService: Hash password with BCrypt
                
                AuthService->>DB: Update user password
                Note over DB: UPDATE Users<br/>SET PasswordHash = new_hash
                
                AuthService->>DB: Mark OTP as used
                Note over DB: UPDATE PasswordResetOTPs<br/>SET IsUsed = true
                
                AuthService-->>API: Success response
                API-->>Frontend: 200 OK
                Frontend-->>User: Password reset successful
                Frontend->>Frontend: Redirect to login page
            end
        end
    end
```

---

## 5. Token Validation & Authorization Flow

How the system validates JWT tokens for protected endpoints.

```mermaid
sequenceDiagram
    participant User as User
    participant Frontend as Frontend
    participant API as Protected Endpoint
    participant Middleware as JWT Middleware
    participant JWT as JWT Validator
    participant DB as Database
    
    User->>Frontend: Access protected resource
    Frontend->>Frontend: Get token from localStorage
    
    Frontend->>API: HTTP Request<br/>Header: Authorization: Bearer {token}
    
    API->>Middleware: Request intercepted
    Middleware->>Middleware: Extract token from header
    
    alt No token present
        Middleware-->>API: 401 Unauthorized
        API-->>Frontend: 401 Unauthorized
        Frontend->>Frontend: Redirect to login
    else Token present
        Middleware->>JWT: Validate token
        Note over JWT: - Valid signature?<br/>- Not expired?<br/>- Valid issuer/audience?
        
        alt Token invalid or expired
            JWT-->>Middleware: Validation failed
            Middleware-->>API: 401 Unauthorized
            API-->>Frontend: 401 Unauthorized
            Frontend->>Frontend: Try refresh token
            Note over Frontend: See Token Refresh Flow
        else Token valid
            JWT-->>Middleware: Claims extracted
            Note over JWT: UserId, RoleId, Username
            
            Middleware->>Middleware: Set HttpContext.User
            Note over Middleware: User identity & claims
            
            Middleware->>API: Continue to endpoint
            
            alt Role-based authorization required
                API->>API: Check [Authorize(Roles="Admin")]
                
                alt User has required role
                    API->>DB: Execute business logic
                    DB-->>API: Data
                    API-->>Frontend: 200 OK with data
                    Frontend-->>User: Display content
                else User lacks required role
                    API-->>Frontend: 403 Forbidden
                    Frontend-->>User: Access denied
                end
            else No role requirement
                API->>DB: Execute business logic
                DB-->>API: Data
                API-->>Frontend: 200 OK with data
                Frontend-->>User: Display content
            end
        end
    end
```

---

## 6. Logout Flow

User logout process with token revocation.

```mermaid
sequenceDiagram
    participant User as User
    participant Frontend as Frontend
    participant API as Auth Controller
    participant AuthService as Auth Service
    participant DB as Database
    
    User->>Frontend: Click logout button
    
    Frontend->>Frontend: Get refresh token from storage
    
    Frontend->>API: POST /api/Auth/logout<br/>{refreshToken}
    Note over Frontend: Include access token in header
    
    API->>AuthService: LogoutAsync(refreshToken)
    
    AuthService->>DB: Find refresh token
    
    alt Token found
        AuthService->>DB: Revoke token
        Note over DB: UPDATE UserRefreshTokens<br/>SET IsActive = false,<br/>RevokedAt = Now
        
        AuthService-->>API: Success
    else Token not found
        AuthService-->>API: Success (already invalid)
    end
    
    API-->>Frontend: 200 OK
    
    Frontend->>Frontend: Clear localStorage
    Note over Frontend: Remove: accessToken,<br/>refreshToken, user info
    
    Frontend->>Frontend: Clear auth state
    Frontend->>Frontend: Clear Authorization header
    
    Frontend->>Frontend: Redirect to login page
    Frontend-->>User: Logged out successfully
```

---

## Security Features

### 1. **Password Security**
- BCrypt hashing with salt (work factor: 12)
- Minimum 8 characters for generated passwords
- Minimum 6 characters for user-set passwords
- Secure random generation for initial passwords

### 2. **Token Security**
- JWT signed with HS256 algorithm
- Access token: 60 minutes expiry
- Refresh token: 7 days expiry
- Refresh tokens stored securely in database
- Token revocation on logout
- One-time use refresh tokens (rotated on each refresh)

### 3. **OTP Security**
- 6-digit cryptographically secure random OTP
- 10-minute expiration window
- Single-use tokens
- Stored in database with IsUsed flag

### 4. **Authentication Checks**
- User status validation (Active/Inactive)
- Password hash verification with BCrypt
- Token expiration validation
- Role-based access control (RBAC)
- Automatic token refresh before expiration

### 5. **Authorization Levels**
- **Admin (RoleId: 1)**: Full system access
- **HR Manager (RoleId: 2)**: Employee management, reports
- **Employee (RoleId: 3)**: Personal data, self-service features

---

## API Endpoints Summary

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/api/Auth/login` | POST | User login | No |
| `/api/Auth/refresh-token` | POST | Refresh access token | No* |
| `/api/Auth/logout` | POST | Revoke refresh token | Yes |
| `/api/Auth/forgot-password` | POST | Request password reset OTP | No |
| `/api/Auth/reset-password` | POST | Reset password with OTP | No |
| `/api/Employees/create` | POST | Create employee & credentials | Yes (Admin/HR) |

*Refresh token endpoint doesn't require active JWT, but needs valid refresh token

---

## Error Codes

| Code | Description | Scenario |
|------|-------------|----------|
| 200 | Success | Operation completed successfully |
| 400 | Bad Request | Invalid input data, password validation failed |
| 401 | Unauthorized | Invalid credentials, expired token, no token |
| 403 | Forbidden | Valid token but insufficient permissions |
| 404 | Not Found | User/employee not found |
| 500 | Internal Server Error | Server-side error |

---

## Frontend Token Management

### Storage
```typescript
// After successful login
localStorage.setItem('accessToken', response.accessToken);
localStorage.setItem('refreshToken', response.refreshToken);
localStorage.setItem('userId', response.userId);
localStorage.setItem('roleId', response.roleId);
```

### Request Interceptor
```typescript
// Add token to all requests
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Response Interceptor (Auto-refresh)
```typescript
// Auto-refresh on 401 errors
axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      const newToken = await refreshAccessToken();
      if (newToken) {
        error.config.headers.Authorization = `Bearer ${newToken}`;
        return axios(error.config);
      }
    }
    return Promise.reject(error);
  }
);
```

---

## Related Documentation

- [JWT Authentication Implementation](./JWT_AUTHENTICATION_IMPLEMENTATION.md) - Detailed technical implementation
- [Login Authentication Implementation](./LOGIN_AUTHENTICATION_IMPLEMENTATION.md) - Login system details
- [Forgot Password Feature](./FORGOT_PASSWORD_FEATURE.md) - Password recovery process
- [JWT Authentication Quick Reference](./JWT_AUTHENTICATION_QUICK_REFERENCE.md) - Quick API reference

---

**Last Updated**: January 28, 2026  
**Version**: 1.0
