# 🔐 JWT Authentication with Refresh Tokens

## Overview

Enterprise-grade JWT authentication system with refresh token support for the SLBFE HRM System. Implements industry-standard security practices including token rotation, revocation, and cryptographically secure token generation.

---

## ⚡ Quick Start

### 1. Apply Database Changes
```bash
cd backend
dotnet ef database update
```

### 2. Generate JWT Secret Key
```bash
cd scripts
./generate-jwt-secret-key.sh  # macOS/Linux
# or
.\Generate-JwtSecretKey.ps1   # Windows
```

### 3. Update Database with Secret Key
```sql
UPDATE SystemSettings
SET SettingValue = 'your-generated-key-here'
WHERE SettingKey = 'JWT_Secret_Key';
```

### 4. Test with Postman
1. Import `postman/JWT-Authentication.postman_collection.json`
2. Set `baseUrl` variable to your API URL
3. Run "1. Login" request
4. Other requests will use saved tokens automatically

---

## 📋 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | ❌ | Login and get tokens |
| POST | `/api/auth/refresh-token` | ❌ | Refresh access token |
| POST | `/api/auth/revoke-token` | ✅ | Logout (single device) |
| POST | `/api/auth/revoke-all-tokens` | ✅ | Logout all devices |

---

## 🔑 Example Usage

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"userName":"admin","password":"password"}'
```

**Response:**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "random-base64-string",
  "expiresIn": 3600,
  "tokenType": "Bearer",
  "userId": 1,
  "roleId": 1,
  "userName": "admin"
}
```

### Use Access Token
```bash
curl -X GET http://localhost:5000/api/employees \
  -H "Authorization: Bearer eyJhbGc..."
```

### Refresh Token
```bash
curl -X POST http://localhost:5000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "accessToken": "eyJhbGc...",
    "refreshToken": "random-base64-string"
  }'
```

---

## 🛡️ Security Features

### Access Token (JWT)
- ✅ HMAC-SHA256 algorithm
- ✅ 60-minute expiry (configurable)
- ✅ Contains: UserId, RoleID, JTI, IAT
- ✅ Stateless verification

### Refresh Token
- ✅ Cryptographically secure 64-byte random
- ✅ 7-day expiry
- ✅ Single-use with automatic rotation
- ✅ Revocation support
- ✅ Database-backed validation

### Additional Security
- ✅ BCrypt password hashing
- ✅ User status validation
- ✅ Token expiry checking
- ✅ Comprehensive audit logging
- ✅ Cascade deletion support

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [**Implementation Guide**](./JWT_AUTHENTICATION_IMPLEMENTATION.md) | Complete technical documentation (25+ pages) |
| [**Quick Reference**](./JWT_AUTHENTICATION_QUICK_REFERENCE.md) | Code examples and quick start |
| [**Setup Guide**](./JWT_AUTHENTICATION_SETUP.md) | Step-by-step setup instructions |
| [**Summary**](./JWT_AUTHENTICATION_SUMMARY.md) | High-level overview |

---

## 🗄️ Database Schema

### UserRefreshTokens
```sql
[Id]        INT (PK, IDENTITY)
[UserId]    INT (FK -> Users.UserId)
[Token]     NVARCHAR(MAX)
[ExpiresAt] DATETIME2
[CreatedAt] DATETIME2 (DEFAULT: SYSUTCDATETIME())
[RevokedAt] DATETIME2 (NULL if active)
```

### SystemSettings
```sql
[Id]           INT (PK, IDENTITY)
[SettingKey]   NVARCHAR(100) (UNIQUE)
[SettingValue] NVARCHAR(MAX)
[Description]  NVARCHAR(500)
[CreatedAt]    DATETIME2
[UpdatedAt]    DATETIME2
```

**Required Settings:**
- `JWT_Secret_Key` - Secret for signing tokens (min 32 chars)
- `JWT_Expiry_Minutes` - Token expiry in minutes (default: 60)

---

## 🧪 Testing

### Postman Collection
Import `postman/JWT-Authentication.postman_collection.json`:
- ✅ Automated token management
- ✅ Test assertions
- ✅ Console logging
- ✅ 4 pre-configured requests

### Manual Testing
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"userName":"user","password":"pass"}'

# Save the accessToken and refreshToken from response

# Test protected endpoint
curl -X GET http://localhost:5000/api/employees \
  -H "Authorization: Bearer {accessToken}"

# Refresh token
curl -X POST http://localhost:5000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"accessToken":"{old}","refreshToken":"{old}"}'

# Logout
curl -X POST http://localhost:5000/api/auth/revoke-token \
  -H "Authorization: Bearer {accessToken}" \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"{token}"}'
```

---

## 🔧 Configuration

### JWT Settings (Database)
```sql
-- Update secret key
UPDATE SystemSettings
SET SettingValue = 'your-32-character-secret-key'
WHERE SettingKey = 'JWT_Secret_Key';

-- Update expiry time (minutes)
UPDATE SystemSettings
SET SettingValue = '120'  -- 2 hours
WHERE SettingKey = 'JWT_Expiry_Minutes';
```

### Application Configuration
Ensure `Program.cs` has JWT authentication:
```csharp
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => { /* configuration */ });

// In middleware pipeline
app.UseAuthentication();
app.UseAuthorization();
```

---

## 🧹 Maintenance

### Cleanup Expired Tokens
```sql
-- Manual cleanup
EXEC CleanupExpiredRefreshTokens;

-- Schedule daily with SQL Server Agent or Hangfire
```

### Monitor Active Tokens
```sql
-- View active tokens
SELECT * FROM vw_ActiveRefreshTokens
WHERE Status = 'Active';

-- Tokens expiring soon
SELECT * FROM vw_ActiveRefreshTokens
WHERE HoursUntilExpiry < 24;

-- User session count
SELECT UserName, COUNT(*) as ActiveSessions
FROM vw_ActiveRefreshTokens
WHERE Status = 'Active'
GROUP BY UserName;
```

---

## 📦 Project Structure

```
backend/
├── Application/
│   ├── DTOs/
│   │   ├── Request/
│   │   │   └── RefreshTokenDto.cs
│   │   └── Response/
│   │       └── TokenResponseDto.cs
│   └── Services/
│       ├── Implementations/
│       │   └── AuthService.cs
│       └── Interfaces/
│           └── IAuthService.cs
├── Core/
│   └── Entities/
│       ├── SystemSettings.cs
│       └── UserRefreshToken.cs
├── Infrastructure/
│   └── Data/
│       └── Context/
│           └── ApplicationDbContext.cs
├── Migrations/
│   └── *_AddJwtAuthenticationSupport.cs
└── Presentation/
    └── Controllers/
        └── AuthController.cs

database-scripts/
└── JWT-Authentication-Setup.sql

docs/
├── JWT_AUTHENTICATION_IMPLEMENTATION.md
├── JWT_AUTHENTICATION_QUICK_REFERENCE.md
├── JWT_AUTHENTICATION_SETUP.md
├── JWT_AUTHENTICATION_SUMMARY.md
└── JWT_AUTHENTICATION_README.md (this file)

postman/
└── JWT-Authentication.postman_collection.json

scripts/
├── Generate-JwtSecretKey.ps1
└── generate-jwt-secret-key.sh
```

---

## ⚠️ Production Checklist

Before deploying to production:

- [ ] Replace default JWT_Secret_Key
- [ ] Enable HTTPS
- [ ] Configure CORS
- [ ] Implement rate limiting
- [ ] Set up token cleanup job
- [ ] Configure logging
- [ ] Test all authentication flows
- [ ] Use Azure Key Vault for secrets
- [ ] Set appropriate token expiry times
- [ ] Document emergency procedures

---

## 🐛 Troubleshooting

### "JWT configuration is missing"
```sql
-- Check if settings exist
SELECT * FROM SystemSettings
WHERE SettingKey IN ('JWT_Secret_Key', 'JWT_Expiry_Minutes');

-- If missing, run setup script
```

### "Unauthorized" errors
- Check Authorization header: `Bearer {token}`
- Verify token not expired
- Confirm secret key matches

### Refresh token fails
- Token may be expired (> 7 days)
- Token may be revoked
- User must login again

---

## 📊 Architecture Diagram

```
Client → Login → AuthService → Database
                    ↓
                Generate JWT + Refresh Token
                    ↓
                Return Both Tokens
                    ↓
Client stores tokens

Client → API Request (with JWT) → Validate → Response

JWT expired?
    ↓
Client → Refresh Token Endpoint → Validate Refresh Token
                                        ↓
                                Generate New Tokens
                                        ↓
                                Revoke Old Refresh Token
                                        ↓
                                Return New Tokens
```

---

## 🎯 Key Features

✅ **Industry Standard Security** - HMAC-SHA256, BCrypt, secure random  
✅ **Complete Token Management** - Generation, refresh, revocation  
✅ **Multi-Device Support** - Revoke single or all tokens  
✅ **Automatic Rotation** - Single-use refresh tokens  
✅ **Comprehensive Logging** - All auth events tracked  
✅ **Performance Optimized** - Indexed queries, async operations  
✅ **Production Ready** - Complete documentation and testing tools  

---

## 📞 Support

For questions or issues:
1. Check the [Implementation Guide](./JWT_AUTHENTICATION_IMPLEMENTATION.md)
2. Review [Quick Reference](./JWT_AUTHENTICATION_QUICK_REFERENCE.md) for examples
3. Check application logs in `backend/Logs/`
4. Contact the development team

---

## 🚀 Next Steps

1. ✅ Apply database migration
2. ✅ Generate and set JWT secret key
3. ✅ Test with Postman
4. ✅ Integrate with frontend
5. ✅ Schedule token cleanup
6. ✅ Deploy to production

---

**Version**: 1.0.0  
**Last Updated**: January 27, 2026  
**Status**: Production Ready ✅

**Remember**: Keep your JWT secret key secure! 🔐
