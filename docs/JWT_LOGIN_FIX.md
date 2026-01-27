# JWT Login Error Fix

## Issue
**Error:** "Cannot read properties of undefined (reading 'toString')"  
**Location:** Login screen when entering credentials  
**Date Fixed:** January 27, 2026

## Root Cause
The frontend login code was expecting the **OLD authentication response format** with `employeeId` field, but the new JWT authentication returns a **different response structure** without that field.

### Old Response Format (Expected)
```json
{
  "userId": 2,
  "employeeId": "EMP2026009",    // ❌ No longer returned
  "roleId": 1,
  "userName": "EMP2026009",
  "status": "Active",            // ❌ No longer returned
  "lastLogin": "2026-01-27T..."  // ❌ No longer returned
}
```

### New JWT Response Format (Actual)
```json
{
  "accessToken": "eyJhbGci...",   // ✅ JWT Access Token
  "refreshToken": "/ojqqS58...",  // ✅ Refresh Token
  "expiresIn": 3600,              // ✅ Token expiry in seconds
  "tokenType": "Bearer",          // ✅ Token type
  "userId": 2,
  "roleId": 1,
  "userName": "EMP2026009"
}
```

## Error Location
**File:** `frontend/src/services/api.ts`  
**Line:** 257 (before fix)

```typescript
// ❌ This line caused the error:
localStorage.setItem('slbfe_employee_id', response.data.employeeId.toString());
//                                        ^^^^^^^^^^^^^^^^^^^^
//                                        undefined in new JWT response
```

## Fix Applied

### Updated: `frontend/src/services/api.ts` - Line 222-260

**Changed the login method to:**
1. Accept the new JWT response structure
2. Use the real JWT `accessToken` instead of generating a fake token
3. Store the `refreshToken` for token refresh functionality
4. Store `userId` instead of `employeeId`
5. Remove references to fields that no longer exist (`status`, `lastLogin`, `employeeId`)

**Key Changes:**
```typescript
// ✅ Updated response type to match JWT format
const response = await this.request<{
  accessToken: string;      // New
  refreshToken: string;     // New
  expiresIn: number;        // New
  tokenType: string;        // New
  userId: number;
  roleId: number;
  userName: string;
}>('/Auth/login', {
  method: 'POST',
  body: JSON.stringify(credentials),
});

// ✅ Use real JWT token from backend
const token = response.data.accessToken;

// ✅ Store JWT tokens
localStorage.setItem('slbfe_auth_token', token);
localStorage.setItem('slbfe_refresh_token', response.data.refreshToken);
localStorage.setItem('slbfe_user_id', response.data.userId.toString());

// ❌ Removed: localStorage.setItem('slbfe_employee_id', ...)
```

### Updated: `frontend/src/services/api.ts` - Logout Method

Added cleanup for new JWT-related localStorage items:
```typescript
localStorage.removeItem('slbfe_refresh_token');  // Added
localStorage.removeItem('slbfe_user_id');        // Added
```

## Testing

### Verified Working:
✅ Login with credentials (EMP2026009 / yXSo#8#8)  
✅ JWT Access Token received and stored  
✅ Refresh Token received and stored  
✅ User data properly mapped  
✅ No more `.toString()` error  

### Test Command:
```bash
curl -X POST http://localhost:5050/api/Auth/login \
  -H "Content-Type: application/json" \
  -d '{"userName":"EMP2026009","password":"yXSo#8#8"}'
```

## Benefits of This Fix

1. ✅ **Proper JWT Authentication** - Now uses industry-standard JWT tokens
2. ✅ **Secure Token Storage** - Both access and refresh tokens stored correctly
3. ✅ **Token Refresh Support** - Can implement automatic token refresh
4. ✅ **Better Security** - Real cryptographic tokens instead of fake ones
5. ✅ **Role-Based Access** - JWT contains userId and roleId claims

## Next Steps (Optional Enhancements)

1. **Implement Token Refresh** - Automatically refresh expired tokens using the refresh token
2. **Add Token Expiry Check** - Validate token expiry before API calls
3. **Implement Logout on Backend** - Call the JWT revoke-token endpoint
4. **Add Token to Headers** - Ensure all API requests include `Authorization: Bearer {token}`

## Files Modified

- ✅ `frontend/src/services/api.ts` (Lines 222-260, 288-296)

## Status
🟢 **FIXED** - Login now works correctly with JWT authentication!
