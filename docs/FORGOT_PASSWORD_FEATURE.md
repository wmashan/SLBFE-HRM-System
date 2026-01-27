# Forgot Password Feature Documentation

## Overview
Complete password recovery system allowing users to reset their password securely using Employee ID and OTP verification sent to their registered email address.

## Feature Flow

### 1. **Forgot Password Request**
- User clicks "Forgot Password" link on login page
- Enters their Employee ID
- System validates Employee ID and retrieves associated email
- OTP (6-digit code) is generated and printed to terminal/console
- OTP is stored in database with 10-minute expiration
- User sees masked email address (e.g., `jo***@example.com`)

### 2. **OTP Verification**
- User enters 6-digit OTP received
- System validates:
  - OTP exists and matches
  - OTP hasn't expired (10 minutes)
  - OTP hasn't been used previously
- On successful verification, user proceeds to password reset

### 3. **Password Reset**
- User creates new password (minimum 6 characters)
- Password strength indicator shows real-time feedback
- User confirms new password
- System validates:
  - Password meets minimum requirements
  - Passwords match
  - OTP is still valid
- Password is hashed using BCrypt and stored in database
- User redirected to login with success message

## Technical Implementation

### Backend Components

#### **1. DTOs (Data Transfer Objects)**

**ForgotPasswordDto.cs**
```csharp
public class ForgotPasswordDto
{
    [Required]
    public string EmployeeId { get; set; }
}
```

**ResetPasswordDto.cs**
```csharp
public class ResetPasswordDto
{
    [Required]
    public string EmployeeId { get; set; }
    
    [Required]
    [StringLength(6, MinimumLength = 6)]
    public string Otp { get; set; }
    
    [Required]
    [MinLength(6)]
    public string NewPassword { get; set; }
    
    [Required]
    [Compare("NewPassword")]
    public string ConfirmPassword { get; set; }
}
```

**ForgotPasswordResponseDto.cs**
```csharp
public class ForgotPasswordResponseDto
{
    public bool Success { get; set; }
    public string Message { get; set; }
    public string? Email { get; set; } // Masked email
}
```

#### **2. API Endpoints**

**POST /api/Auth/forgot-password**
- Request Body: `{ "employeeId": "EMP001" }`
- Response:
```json
{
  "success": true,
  "message": "OTP has been sent to your registered email address",
  "email": "jo***@example.com"
}
```

**POST /api/Auth/reset-password**
- Request Body:
```json
{
  "employeeId": "EMP001",
  "otp": "123456",
  "newPassword": "NewPassword123",
  "confirmPassword": "NewPassword123"
}
```
- Response:
```json
{
  "success": true,
  "message": "Password has been reset successfully. You can now login with your new password."
}
```

#### **3. Database Tables Used**

**Users Table**
```sql
[UserId]       INT            IDENTITY (1, 1) NOT NULL,
[EmployeeId]   NVARCHAR (50)  NOT NULL,
[RoleID]       INT            NOT NULL,
[UserName]     NVARCHAR (50)  NOT NULL,
[PasswordHash] NVARCHAR (MAX) NOT NULL,  -- Updated during password reset
[Status]       NVARCHAR (20)  NULL,
[UpdatedAt]    DATETIME       DEFAULT (getdate()) NOT NULL
```

**OtpRecords Table** (Existing)
```sql
[Id]        INT            IDENTITY (1, 1) NOT NULL,
[Email]     NVARCHAR (100) NOT NULL,
[Otp]       NVARCHAR (6)   NOT NULL,
[CreatedAt] DATETIME       NOT NULL,
[ExpiresAt] DATETIME       NOT NULL,  -- 10 minutes from creation
[IsUsed]    BIT            DEFAULT 0,
[Purpose]   NVARCHAR (50)  -- Set to 'PASSWORD_RESET'
```

**Employees Table**
```sql
[EmployeeId]   NVARCHAR (50)  NOT NULL,
[EmailAddress] NVARCHAR (100) -- Used to send OTP
```

### Frontend Components

#### **1. ForgotPassword.tsx**
- **Route**: `/forgot-password`
- **Features**:
  - Employee ID input field
  - Form validation
  - Loading state
  - Error handling
  - Info message about OTP email
- **Navigation**: Login → Forgot Password → Verify OTP

#### **2. VerifyOTP.tsx**
- **Route**: `/verify-otp`
- **Features**:
  - 6-digit OTP input boxes
  - Auto-focus next input on entry
  - Paste support (entire OTP)
  - Backspace navigation
  - Timer display (10 minutes)
  - Resend OTP option
- **State Management**: Receives `employeeId` and `email` from navigation state
- **Navigation**: Forgot Password → Verify OTP → Reset Password

#### **3. ResetPassword.tsx**
- **Route**: `/reset-password`
- **Features**:
  - New password input with show/hide toggle
  - Confirm password input with show/hide toggle
  - Password strength indicator (Weak/Medium/Strong)
  - Real-time password match validation
  - Visual feedback with color-coded strength bar
  - Password requirements display
- **State Management**: Receives `employeeId` and `otp` from navigation state
- **Navigation**: Verify OTP → Reset Password → Login (with success message)

#### **4. LoginPage.tsx (Updated)**
- Added "Forgot Password" button navigation
- Success message display after password reset
- Improved user feedback

### Security Features

1. **OTP Security**
   - 6-digit random OTP
   - 10-minute expiration
   - One-time use only (marked as used after verification)
   - Deleted old OTPs before generating new one
   - Purpose-specific (`PASSWORD_RESET`)

2. **Password Security**
   - Minimum 6 characters required
   - BCrypt hashing with salt
   - Password strength indicator
   - Confirmation required
   - Server-side validation

3. **Email Masking**
   - Email addresses masked in responses (e.g., `jo***@example.com`)
   - Protects user privacy

4. **Validation**
   - Employee ID validation
   - Email existence check
   - OTP format validation (6 digits)
   - Password match validation
   - Expiration checks

### Console Output

#### OTP Generation
```
===========================================
PASSWORD RESET OTP
Employee ID: EMP001
Email: john.doe@example.com
OTP Code: 123456
Valid until: 2026-01-27 14:30:45
===========================================
```

#### Password Reset Success
```
===========================================
PASSWORD RESET SUCCESSFUL
Employee ID: EMP001
Username: johndoe
Reset at: 2026-01-27 14:35:22
===========================================
```

## User Experience Flow

1. **User forgets password** → Clicks "Forgot Password" on login
2. **Enters Employee ID** → System sends OTP to registered email
3. **Checks terminal/console** → Gets OTP code (for development)
4. **Enters 6-digit OTP** → System verifies OTP validity
5. **Creates new password** → Sees strength indicator
6. **Confirms password** → System validates and updates
7. **Redirected to login** → Sees success message
8. **Logs in** → Uses new password

## Error Handling

### Forgot Password Errors
- "Employee ID not found in the system"
- "Email address not found for this employee"
- "An error occurred. Please try again later."

### OTP Verification Errors
- "Invalid OTP. Please check and try again."
- "OTP has expired. Please request a new one."

### Password Reset Errors
- "Password must be at least 6 characters long"
- "Passwords do not match"
- "Invalid OTP. Please check and try again."
- "OTP has expired. Please request a new one."

## Testing

### Test Scenario 1: Complete Flow
1. Navigate to login page
2. Click "Forgot Password"
3. Enter valid Employee ID
4. Check console for OTP
5. Enter OTP
6. Create new password
7. Confirm password
8. Login with new password

### Test Scenario 2: Invalid Employee ID
1. Enter non-existent Employee ID
2. Verify error message displayed

### Test Scenario 3: Expired OTP
1. Generate OTP
2. Wait 10+ minutes
3. Try to verify
4. Verify expiration message

### Test Scenario 4: Password Mismatch
1. Complete OTP verification
2. Enter different passwords
3. Verify validation error

## Future Enhancements

1. **Email Integration**
   - Replace console output with actual email sending
   - Use SMTP service (SendGrid, AWS SES, etc.)
   - Email templates with branding

2. **Rate Limiting**
   - Limit OTP generation attempts
   - Prevent brute force attacks
   - Lock account after multiple failed attempts

3. **SMS OTP Option**
   - Alternative to email OTP
   - Phone number verification
   - SMS gateway integration

4. **Audit Logging**
   - Log all password reset attempts
   - Track successful/failed resets
   - Security monitoring

5. **Password Policy**
   - Configurable password requirements
   - Password history (prevent reuse)
   - Force password change on first login

## API Testing with Postman

### 1. Forgot Password
```
POST http://localhost:5062/api/Auth/forgot-password
Content-Type: application/json

{
  "employeeId": "EMP001"
}
```

### 2. Reset Password
```
POST http://localhost:5062/api/Auth/reset-password
Content-Type: application/json

{
  "employeeId": "EMP001",
  "otp": "123456",
  "newPassword": "NewPassword123",
  "confirmPassword": "NewPassword123"
}
```

## Files Modified/Created

### Backend Files
- ✅ `backend/Application/DTOs/Request/ForgotPasswordDto.cs` (NEW)
- ✅ `backend/Application/DTOs/Request/ResetPasswordDto.cs` (NEW)
- ✅ `backend/Application/DTOs/Response/ForgotPasswordResponseDto.cs` (NEW)
- ✅ `backend/Application/Services/Interfaces/IAuthService.cs` (MODIFIED)
- ✅ `backend/Application/Services/Implementations/AuthService.cs` (MODIFIED)
- ✅ `backend/Presentation/Controllers/AuthController.cs` (MODIFIED)

### Frontend Files
- ✅ `frontend/src/pages/ForgotPassword.tsx` (NEW)
- ✅ `frontend/src/pages/VerifyOTP.tsx` (NEW)
- ✅ `frontend/src/pages/ResetPassword.tsx` (NEW)
- ✅ `frontend/src/pages/LoginPage.tsx` (MODIFIED)
- ✅ `frontend/src/App.tsx` (MODIFIED)

## Summary

The Forgot Password feature provides a secure, user-friendly way for employees to recover their accounts. The implementation follows industry best practices with OTP-based verification, BCrypt password hashing, and proper validation at every step. For development purposes, OTPs are printed to the console, making testing easy without requiring email infrastructure.
