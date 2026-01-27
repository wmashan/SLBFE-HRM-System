# JWT Authentication with Refresh Tokens - Implementation Guide

## Overview
This document describes the secure JWT authentication implementation with refresh token support for the SLBFE HRM System.

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Database Schema](#database-schema)
3. [Security Features](#security-features)
4. [API Endpoints](#api-endpoints)
5. [Configuration](#configuration)
6. [Usage Examples](#usage-examples)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

### Authentication Flow

```
┌──────────┐                  ┌──────────┐                  ┌──────────┐
│  Client  │                  │   API    │                  │ Database │
└────┬─────┘                  └────┬─────┘                  └────┬─────┘
     │                             │                             │
     │  1. POST /api/auth/login    │                             │
     ├────────────────────────────>│                             │
     │    { username, password }   │                             │
     │                             │  2. Validate User           │
     │                             ├────────────────────────────>│
     │                             │                             │
     │                             │  3. User Record             │
     │                             │<────────────────────────────┤
     │                             │                             │
     │                             │  4. Generate JWT            │
     │                             │  5. Generate Refresh Token  │
     │                             │                             │
     │                             │  6. Store Refresh Token     │
     │                             ├────────────────────────────>│
     │                             │                             │
     │  7. Return Tokens           │                             │
     │<────────────────────────────┤                             │
     │  { accessToken,             │                             │
     │    refreshToken,            │                             │
     │    expiresIn }              │                             │
     │                             │                             │
```

### Token Refresh Flow

```
┌──────────┐                  ┌──────────┐                  ┌──────────┐
│  Client  │                  │   API    │                  │ Database │
└────┬─────┘                  └────┬─────┘                  └────┬─────┘
     │                             │                             │
     │  1. POST /api/auth/         │                             │
     │     refresh-token           │                             │
     ├────────────────────────────>│                             │
     │  { accessToken,             │                             │
     │    refreshToken }           │                             │
     │                             │  2. Validate Refresh Token  │
     │                             ├────────────────────────────>│
     │                             │                             │
     │                             │  3. Token Record            │
     │                             │<────────────────────────────┤
     │                             │                             │
     │                             │  4. Verify Token Active     │
     │                             │  5. Extract User Claims     │
     │                             │  6. Generate New Tokens     │
     │                             │                             │
     │                             │  7. Revoke Old Token        │
     │                             │  8. Store New Token         │
     │                             ├────────────────────────────>│
     │                             │                             │
     │  9. Return New Tokens       │                             │
     │<────────────────────────────┤                             │
     │                             │                             │
```

---

## Database Schema

### 1. Users Table
```sql
[dbo].[Users]
├── UserId          INT (PK)
├── EmployeeId      NVARCHAR(50)
├── RoleID          INT
├── UserName        NVARCHAR(50)
├── PasswordHash    NVARCHAR(MAX)
├── Status          NVARCHAR(20)
├── LastLogin       DATETIME2
├── CreatedAt       DATETIME2
└── UpdatedAt       DATETIME2
```

### 2. UserRefreshTokens Table
```sql
[dbo].[UserRefreshTokens]
├── Id              INT (PK, IDENTITY)
├── UserId          INT (FK -> Users.UserId)
├── Token           NVARCHAR(MAX)
├── ExpiresAt       DATETIME2
├── CreatedAt       DATETIME2 (DEFAULT: SYSUTCDATETIME())
└── RevokedAt       DATETIME2 (NULL if active)

Indexes:
- IX_UserRefreshTokens_UserId
- IX_UserRefreshTokens_ExpiresAt

Foreign Keys:
- FK_UserRefreshTokens_Users (CASCADE DELETE)
```

### 3. SystemSettings Table
```sql
[dbo].[SystemSettings]
├── Id              INT (PK, IDENTITY)
├── SettingKey      NVARCHAR(100) (UNIQUE)
├── SettingValue    NVARCHAR(MAX)
├── Description     NVARCHAR(500)
├── CreatedAt       DATETIME2
└── UpdatedAt       DATETIME2

Required Settings:
- JWT_Secret_Key: Secret key for signing JWT tokens (min 32 chars)
- JWT_Expiry_Minutes: Token expiry time in minutes (default: 60)
```

---

## Security Features

### 1. JWT Access Token
- **Algorithm**: HMAC-SHA256 (HS256)
- **Expiry**: Configurable (default 60 minutes)
- **Claims**:
  - `NameIdentifier`: User ID
  - `Role`: Role ID
  - `Jti`: Unique token ID (GUID)
  - `Iat`: Issued at timestamp

### 2. Refresh Token
- **Generation**: Cryptographically secure random 64-byte string
- **Encoding**: Base64
- **Expiry**: 7 days
- **Storage**: Hashed in database
- **Single-use**: Old token revoked when refreshed

### 3. Security Best Practices Implemented
✅ Secure random token generation using `RandomNumberGenerator`  
✅ Token revocation support (logout functionality)  
✅ Cascade deletion (tokens deleted when user deleted)  
✅ Token expiry validation  
✅ Single-use refresh tokens (rotation)  
✅ BCrypt password hashing  
✅ User status validation (Active check)  
✅ Claims-based authorization  
✅ HTTPS recommended for production  

---

## API Endpoints

### 1. Login
**Endpoint**: `POST /api/auth/login`

**Request**:
```json
{
  "userName": "admin",
  "password": "SecurePassword123"
}
```

**Success Response** (200 OK):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "base64-encoded-random-string",
  "expiresIn": 3600,
  "tokenType": "Bearer",
  "userId": 1,
  "roleId": 1,
  "userName": "admin"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid model state
- `401 Unauthorized`: Invalid credentials or inactive user
- `500 Internal Server Error`: Server error

---

### 2. Refresh Token
**Endpoint**: `POST /api/auth/refresh-token`

**Request**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "base64-encoded-refresh-token"
}
```

**Success Response** (200 OK):
```json
{
  "accessToken": "new-jwt-token",
  "refreshToken": "new-refresh-token",
  "expiresIn": 3600,
  "tokenType": "Bearer",
  "userId": 1,
  "roleId": 1,
  "userName": "admin"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid model state
- `401 Unauthorized`: Invalid or expired refresh token
- `500 Internal Server Error`: Server error

---

### 3. Revoke Token (Logout)
**Endpoint**: `POST /api/auth/revoke-token`  
**Authorization**: Required (Bearer Token)

**Request**:
```json
{
  "refreshToken": "base64-encoded-refresh-token"
}
```

**Success Response** (200 OK):
```json
{
  "message": "Token revoked successfully"
}
```

**Error Responses**:
- `400 Bad Request`: Missing refresh token
- `401 Unauthorized`: Not authenticated
- `404 Not Found`: Token not found
- `500 Internal Server Error`: Server error

---

### 4. Revoke All Tokens (Logout from all devices)
**Endpoint**: `POST /api/auth/revoke-all-tokens`  
**Authorization**: Required (Bearer Token)

**Success Response** (200 OK):
```json
{
  "message": "Successfully revoked 3 token(s)",
  "revokedCount": 3
}
```

**Error Responses**:
- `401 Unauthorized`: Not authenticated or invalid token
- `500 Internal Server Error`: Server error

---

## Configuration

### 1. Database Setup

Run the SQL script to create tables and seed data:
```bash
sqlcmd -S your-server -d your-database -i database-scripts/JWT-Authentication-Setup.sql
```

### 2. Update JWT Secret Key

**CRITICAL**: Replace the default secret key with a strong random key:

```sql
UPDATE [dbo].[SystemSettings]
SET [SettingValue] = 'Your-Strong-32-Character-Secret-Key-Here-12345678'
WHERE [SettingKey] = 'JWT_Secret_Key';
```

**Generate a strong key** (PowerShell):
```powershell
# Generate a 32-character random string
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

**Or use C#**:
```csharp
var key = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
```

### 3. Configure Token Expiry

Update the JWT expiry time (in minutes):
```sql
UPDATE [dbo].[SystemSettings]
SET [SettingValue] = '120' -- 2 hours
WHERE [SettingKey] = 'JWT_Expiry_Minutes';
```

### 4. Program.cs Configuration

Ensure JWT authentication is configured in `Program.cs`:

```csharp
// Add JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var key = Encoding.UTF8.GetBytes(jwtSettings["SecretKey"] ?? "default-key");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = "SLBFE-HRM-System",
        ValidAudience = "SLBFE-HRM-Users",
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ClockSkew = TimeSpan.Zero
    };
});

// Add authorization
builder.Services.AddAuthorization();

// In middleware pipeline
app.UseAuthentication();
app.UseAuthorization();
```

---

## Usage Examples

### Frontend Integration (JavaScript/TypeScript)

#### 1. Login
```typescript
async function login(username: string, password: string) {
  const response = await fetch('https://api.yourapp.com/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userName: username, password: password }),
  });

  if (response.ok) {
    const data = await response.json();
    // Store tokens securely
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  } else {
    throw new Error('Login failed');
  }
}
```

#### 2. API Request with JWT
```typescript
async function makeAuthenticatedRequest(url: string) {
  const accessToken = localStorage.getItem('accessToken');
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 401) {
    // Token expired, refresh it
    const newToken = await refreshAccessToken();
    if (newToken) {
      // Retry request with new token
      return makeAuthenticatedRequest(url);
    }
  }

  return response.json();
}
```

#### 3. Refresh Token
```typescript
async function refreshAccessToken() {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  const response = await fetch('https://api.yourapp.com/api/auth/refresh-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      accessToken: accessToken,
      refreshToken: refreshToken,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.accessToken;
  } else {
    // Refresh failed, redirect to login
    localStorage.clear();
    window.location.href = '/login';
    return null;
  }
}
```

#### 4. Logout
```typescript
async function logout() {
  const refreshToken = localStorage.getItem('refreshToken');
  const accessToken = localStorage.getItem('accessToken');

  await fetch('https://api.yourapp.com/api/auth/revoke-token', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken: refreshToken }),
  });

  // Clear local storage
  localStorage.clear();
  window.location.href = '/login';
}
```

---

## Best Practices

### 1. Token Storage
✅ **Do**:
- Use `httpOnly` cookies for refresh tokens in production
- Use secure storage mechanisms (iOS Keychain, Android Keystore)
- Clear tokens on logout

❌ **Don't**:
- Store tokens in plain cookies without `httpOnly` flag
- Store refresh tokens in localStorage for high-security applications
- Log tokens in console or error messages

### 2. Token Lifecycle
- Access tokens: Short-lived (15-60 minutes)
- Refresh tokens: Longer-lived (7-30 days)
- Implement token rotation (revoke old refresh token when refreshing)

### 3. Security Considerations
- Always use HTTPS in production
- Implement rate limiting on authentication endpoints
- Monitor for unusual token refresh patterns
- Log authentication events
- Implement account lockout after failed attempts
- Use strong secret keys (minimum 32 characters)

### 4. Database Maintenance
Run periodic cleanup of expired tokens:
```sql
-- Schedule this to run daily
EXEC [dbo].[CleanupExpiredRefreshTokens];
```

Or use SQL Server Agent Job or Hangfire.

### 5. Monitoring
Monitor the active refresh tokens view:
```sql
-- Check active tokens
SELECT * FROM [dbo].[vw_ActiveRefreshTokens]
WHERE [Status] = 'Active';

-- Check tokens expiring soon
SELECT * FROM [dbo].[vw_ActiveRefreshTokens]
WHERE [HoursUntilExpiry] < 24;
```

---

## Troubleshooting

### Issue 1: "JWT configuration is missing"
**Cause**: JWT_Secret_Key not found in SystemSettings table

**Solution**:
```sql
INSERT INTO [dbo].[SystemSettings] ([SettingKey], [SettingValue], [Description])
VALUES ('JWT_Secret_Key', 'Your-32-Character-Secret-Key', 'JWT Secret Key');
```

---

### Issue 2: "Invalid or expired refresh token"
**Causes**:
- Refresh token expired (> 7 days old)
- Refresh token revoked
- Token doesn't exist in database

**Solution**:
- User must login again
- Check token expiry: `SELECT * FROM UserRefreshTokens WHERE Token = 'token-value'`

---

### Issue 3: Token signature validation fails
**Cause**: JWT_Secret_Key mismatch or changed

**Solution**:
- Ensure the secret key in SystemSettings matches the key used to generate tokens
- All active tokens become invalid if key changes
- Users must login again

---

### Issue 4: Unauthorized (401) on protected endpoints
**Cause**: 
- Access token expired
- Token not included in Authorization header
- Invalid token format

**Solution**:
```typescript
// Correct format
headers: {
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
}
```

---

## Testing

### Using Postman

1. **Login**:
   ```
   POST http://localhost:5000/api/auth/login
   Body (JSON):
   {
     "userName": "testuser",
     "password": "password123"
   }
   ```

2. **Use Access Token**:
   - Copy the `accessToken` from response
   - Add to Authorization header: `Bearer {accessToken}`

3. **Refresh Token**:
   ```
   POST http://localhost:5000/api/auth/refresh-token
   Body (JSON):
   {
     "accessToken": "...",
     "refreshToken": "..."
   }
   ```

4. **Revoke Token**:
   ```
   POST http://localhost:5000/api/auth/revoke-token
   Headers: Authorization: Bearer {accessToken}
   Body (JSON):
   {
     "refreshToken": "..."
   }
   ```

---

## Production Checklist

- [ ] Replace default JWT_Secret_Key with strong random key
- [ ] Configure appropriate token expiry times
- [ ] Enable HTTPS
- [ ] Implement rate limiting
- [ ] Set up token cleanup job
- [ ] Configure logging and monitoring
- [ ] Test token refresh flow
- [ ] Test token revocation
- [ ] Implement CORS properly
- [ ] Use secure cookie storage for refresh tokens (httpOnly, secure, sameSite)
- [ ] Set up Azure Key Vault for secret management
- [ ] Configure appropriate CORS policies
- [ ] Test logout from all devices functionality

---

## Support and Maintenance

### Scheduled Tasks
Create a scheduled task to cleanup expired tokens:

**Option 1: SQL Server Agent Job**
```sql
-- Run daily at 2 AM
EXEC [dbo].[CleanupExpiredRefreshTokens];
```

**Option 2: Hangfire (Recommended for .NET)**
```csharp
RecurringJob.AddOrUpdate(
    "cleanup-expired-tokens",
    () => CleanupExpiredTokensAsync(),
    Cron.Daily(2)); // 2 AM daily
```

---

## Changelog

### Version 1.0 (January 27, 2026)
- Initial implementation
- JWT access token generation
- Refresh token support
- Token revocation (logout)
- Revoke all tokens (logout from all devices)
- Database schema and migrations
- Comprehensive documentation

---

## License
Internal use only - SLBFE HRM System

---

## Contact
For questions or issues, contact the development team.
