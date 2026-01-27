# JWT Authentication - Quick Reference

## 🚀 Quick Start

### 1. Database Setup
```bash
# Run the SQL script to create tables
sqlcmd -S your-server -d your-database -i database-scripts/JWT-Authentication-Setup.sql

# Or apply EF Core migration
cd backend
dotnet ef database update
```

### 2. Update Secret Key
```sql
UPDATE SystemSettings
SET SettingValue = 'YOUR-STRONG-32-CHARACTER-SECRET-KEY-HERE'
WHERE SettingKey = 'JWT_Secret_Key';
```

### 3. Test the API
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"userName":"admin","password":"password"}'

# Use the returned accessToken in subsequent requests
curl -X GET http://localhost:5000/api/employees \
  -H "Authorization: Bearer {accessToken}"
```

---

## 📋 API Endpoints Summary

| Method | Endpoint | Auth Required | Description |
|--------|----------|---------------|-------------|
| POST | `/api/auth/login` | ❌ No | Login and get tokens |
| POST | `/api/auth/refresh-token` | ❌ No | Refresh access token |
| POST | `/api/auth/revoke-token` | ✅ Yes | Logout (revoke token) |
| POST | `/api/auth/revoke-all-tokens` | ✅ Yes | Logout all devices |

---

## 🔑 Token Types

### Access Token (JWT)
- **Purpose**: Authenticate API requests
- **Lifetime**: 60 minutes (configurable)
- **Storage**: Memory or secure storage
- **Contains**: UserId, RoleID, Issued At, Expiry
- **Usage**: `Authorization: Bearer {accessToken}`

### Refresh Token
- **Purpose**: Get new access tokens
- **Lifetime**: 7 days
- **Storage**: Secure storage only
- **Format**: Base64-encoded random string
- **Usage**: Used in refresh-token endpoint

---

## 📝 Code Examples

### C# - Making Authenticated Requests

```csharp
using System.Net.Http.Headers;

public class ApiClient
{
    private readonly HttpClient _httpClient;
    private string _accessToken;
    private string _refreshToken;

    public async Task<string> LoginAsync(string username, string password)
    {
        var loginDto = new { userName = username, password = password };
        var response = await _httpClient.PostAsJsonAsync("/api/auth/login", loginDto);
        
        if (response.IsSuccessStatusCode)
        {
            var result = await response.Content.ReadFromJsonAsync<TokenResponse>();
            _accessToken = result.AccessToken;
            _refreshToken = result.RefreshToken;
            
            // Set default authorization header
            _httpClient.DefaultRequestHeaders.Authorization = 
                new AuthenticationHeaderValue("Bearer", _accessToken);
            
            return _accessToken;
        }
        
        return null;
    }

    public async Task<T> GetAsync<T>(string endpoint)
    {
        var response = await _httpClient.GetAsync(endpoint);
        
        if (response.StatusCode == HttpStatusCode.Unauthorized)
        {
            // Try to refresh token
            var refreshed = await RefreshTokenAsync();
            if (refreshed)
            {
                // Retry request
                response = await _httpClient.GetAsync(endpoint);
            }
        }
        
        return await response.Content.ReadFromJsonAsync<T>();
    }

    private async Task<bool> RefreshTokenAsync()
    {
        var refreshDto = new { accessToken = _accessToken, refreshToken = _refreshToken };
        var response = await _httpClient.PostAsJsonAsync("/api/auth/refresh-token", refreshDto);
        
        if (response.IsSuccessStatusCode)
        {
            var result = await response.Content.ReadFromJsonAsync<TokenResponse>();
            _accessToken = result.AccessToken;
            _refreshToken = result.RefreshToken;
            
            _httpClient.DefaultRequestHeaders.Authorization = 
                new AuthenticationHeaderValue("Bearer", _accessToken);
            
            return true;
        }
        
        return false;
    }
}
```

---

### JavaScript/React - Complete Auth Service

```javascript
// authService.js
class AuthService {
  constructor() {
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  async login(username, password) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: username, password: password })
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      this.setTokens(data.accessToken, data.refreshToken);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async refreshAccessToken() {
    try {
      const response = await fetch('/api/auth/refresh-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: this.accessToken,
          refreshToken: this.refreshToken
        })
      });

      if (!response.ok) {
        this.logout();
        return null;
      }

      const data = await response.json();
      this.setTokens(data.accessToken, data.refreshToken);
      return data.accessToken;
    } catch (error) {
      console.error('Refresh error:', error);
      this.logout();
      return null;
    }
  }

  async logout() {
    try {
      await fetch('/api/auth/revoke-token', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken: this.refreshToken })
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearTokens();
      window.location.href = '/login';
    }
  }

  async fetchWithAuth(url, options = {}) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${this.accessToken}`
    };

    let response = await fetch(url, options);

    // If unauthorized, try to refresh token
    if (response.status === 401) {
      const newToken = await this.refreshAccessToken();
      if (newToken) {
        options.headers['Authorization'] = `Bearer ${newToken}`;
        response = await fetch(url, options);
      }
    }

    return response;
  }

  setTokens(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  isAuthenticated() {
    return !!this.accessToken;
  }
}

export default new AuthService();
```

---

### React - Protected Route Component

```jsx
import { Navigate } from 'react-router-dom';
import authService from './authService';

function ProtectedRoute({ children }) {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
```

---

### React - Login Component

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from './authService';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await authService.login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
```

---

## 🔒 Security Checklist

### Before Production
- [ ] Replace default JWT_Secret_Key with a strong 32+ character key
- [ ] Enable HTTPS for all API endpoints
- [ ] Implement rate limiting on auth endpoints
- [ ] Set up token cleanup job (daily)
- [ ] Configure CORS properly
- [ ] Use httpOnly cookies for refresh tokens
- [ ] Implement account lockout after failed login attempts
- [ ] Set up monitoring and alerting
- [ ] Review and test token expiry times
- [ ] Store secrets in Azure Key Vault or similar

### Development
- [ ] Test login flow
- [ ] Test token refresh flow
- [ ] Test logout (single device)
- [ ] Test logout all devices
- [ ] Test expired token handling
- [ ] Test revoked token handling
- [ ] Test invalid credentials
- [ ] Test inactive user

---

## 🐛 Common Issues & Solutions

### Issue: "JWT configuration is missing"
**Solution**: Ensure JWT_Secret_Key exists in SystemSettings table
```sql
SELECT * FROM SystemSettings WHERE SettingKey = 'JWT_Secret_Key';
```

### Issue: "Unauthorized" on protected endpoints
**Solution**: Check Authorization header format
```
Correct: Authorization: Bearer eyJhbGc...
Wrong:   Authorization: eyJhbGc...
```

### Issue: Refresh token fails
**Possible causes**:
- Token expired (> 7 days)
- Token revoked
- User inactive
- Secret key changed

**Solution**: User must login again

### Issue: Token validation fails
**Check**:
1. Secret key matches in SystemSettings and configuration
2. Token not tampered with
3. Token not expired
4. Issuer and Audience match configuration

---

## 📊 Monitoring Queries

### Active Sessions
```sql
SELECT 
    u.UserName,
    COUNT(*) as ActiveTokens,
    MIN(rt.ExpiresAt) as EarliestExpiry,
    MAX(rt.ExpiresAt) as LatestExpiry
FROM UserRefreshTokens rt
INNER JOIN Users u ON rt.UserId = u.UserId
WHERE rt.RevokedAt IS NULL 
  AND rt.ExpiresAt > GETUTCDATE()
GROUP BY u.UserName
ORDER BY ActiveTokens DESC;
```

### Tokens Expiring Soon
```sql
SELECT * FROM vw_ActiveRefreshTokens
WHERE HoursUntilExpiry < 24
ORDER BY HoursUntilExpiry;
```

### Cleanup Expired Tokens
```sql
EXEC CleanupExpiredRefreshTokens;
```

### User Login History
```sql
SELECT 
    UserName,
    LastLogin,
    DATEDIFF(HOUR, LastLogin, GETUTCDATE()) as HoursSinceLogin
FROM Users
WHERE LastLogin IS NOT NULL
ORDER BY LastLogin DESC;
```

---

## 🧪 Testing with cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "admin",
    "password": "password123"
  }'
```

### Refresh Token
```bash
curl -X POST http://localhost:5000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "accessToken": "eyJhbGc...",
    "refreshToken": "base64-string..."
  }'
```

### Protected Request
```bash
curl -X GET http://localhost:5000/api/employees \
  -H "Authorization: Bearer eyJhbGc..."
```

### Logout
```bash
curl -X POST http://localhost:5000/api/auth/revoke-token \
  -H "Authorization: Bearer eyJhbGc..." \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "base64-string..."
  }'
```

---

## 📦 Required NuGet Packages

All packages are already included in your project:
- ✅ Microsoft.AspNetCore.Authentication.JwtBearer (8.0.0)
- ✅ Microsoft.EntityFrameworkCore.SqlServer (8.0.0)
- ✅ BCrypt.Net-Next (4.0.3)
- ✅ System.IdentityModel.Tokens.Jwt (included)

---

## 🔄 Token Refresh Strategy

### When to Refresh?
1. **Proactive**: Refresh before expiry (e.g., 5 minutes before)
2. **Reactive**: Refresh after receiving 401 Unauthorized

### Example: Proactive Refresh
```javascript
function shouldRefreshToken(token) {
  const payload = JSON.parse(atob(token.split('.')[1]));
  const expiry = payload.exp * 1000; // Convert to milliseconds
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  
  return expiry - now < fiveMinutes;
}

// Check before each request
if (shouldRefreshToken(accessToken)) {
  await authService.refreshAccessToken();
}
```

---

## 📞 Support

For issues or questions:
1. Check the [full documentation](./JWT_AUTHENTICATION_IMPLEMENTATION.md)
2. Review error logs in `backend/Logs/`
3. Contact the development team

---

**Last Updated**: January 27, 2026  
**Version**: 1.0
