# Role Management Implementation Guide

## Overview
This document describes the implementation of the Role Management section in the Admin dashboard, which allows administrators to view and manage user roles dynamically from the database.

## Features Implemented

### 1. Dynamic User Loading
- Users are loaded from the `Users` table in the database
- No more hardcoded user data
- Real-time data from the backend API

### 2. User Information Display
The following information is displayed for each user:
- **Username**: from `UserName` column
- **Current Role**: from `RoleId` column (mapped to role names)
  - RoleId 1 → "Admin"
  - RoleId 2 → "HR Manager"
  - RoleId 3 → "Employee"
- **Status**: from `Status` column
- **Last Login**: from `LastLogin` column
- **Updated At**: from `UpdatedAt` column

### 3. Role Change Functionality
- **Change Role** button for each user
- Dropdown shows only available roles (excludes current role)
- Updates the `RoleId` in the Users table
- Automatically updates `UpdatedAt` timestamp
- Refreshes the user list after successful update

## Backend Implementation

### Database Schema
The implementation uses the existing `Users` table structure:

```sql
Users Table:
- UserId (PK, Identity)
- EmployeeId (NVARCHAR(50))
- RoleID (INT) - 1=Admin, 2=HR Manager, 3=Employee
- UserName (NVARCHAR(50), Unique)
- PasswordHash (NVARCHAR(MAX))
- Status (NVARCHAR(20))
- LastLogin (DATETIME)
- CreatedAt (DATETIME)
- UpdatedAt (DATETIME)
```

### API Endpoints

#### 1. Get All Users
```http
GET /api/User
```

**Response:**
```json
[
  {
    "userId": 1,
    "userName": "EMP001",
    "roleId": 3,
    "roleName": "Employee",
    "status": "Active",
    "lastLogin": "2026-01-25T10:30:00",
    "updatedAt": "2026-01-25T15:45:00"
  }
]
```

#### 2. Update User Role
```http
PUT /api/User/{userId}/role
Content-Type: application/json

{
  "roleId": 2
}
```

**Response:**
```json
{
  "message": "User role updated successfully"
}
```

### Backend Files Created/Modified

1. **Application/DTOs/Request/UpdateUserRoleDto.cs** (NEW)
   ```csharp
   public class UpdateUserRoleDto
   {
       public int RoleId { get; set; }
   }
   ```

2. **Application/DTOs/Response/CommonResponseDtos.cs** (MODIFIED)
   - Enhanced `UserDto` class with role management fields:
     - UserId, UserName, RoleId, RoleName, Status, LastLogin, UpdatedAt

3. **Application/Services/Interfaces/IUserService.cs** (NEW)
   - `GetAllUsersAsync()` - Retrieve all users
   - `UpdateUserRoleAsync(userId, updateRoleDto)` - Update user role

4. **Application/Services/Implementations/UserService.cs** (NEW)
   - Implements user retrieval with role name mapping
   - Implements role update with validation
   - Updates `UpdatedAt` timestamp automatically

5. **Presentation/Controllers/UserController.cs** (NEW)
   - `GET /api/User` endpoint
   - `PUT /api/User/{userId}/role` endpoint

6. **Program.cs** (MODIFIED)
   - Registered `IUserService` and `UserService` in DI container

## Frontend Implementation

### Files Modified

1. **frontend/src/pages/admin/RoleManagement.tsx** (MODIFIED)
   - Replaced hardcoded user data with API call
   - Added dynamic user loading from `/api/User` endpoint
   - Implemented role update functionality calling `/api/User/{userId}/role`
   - Added Admin role to role definitions
   - Maps backend RoleId to frontend role strings

### Key Components

#### User Loading
```typescript
const loadUsers = async () => {
  const response = await fetch('http://localhost:5000/api/User');
  const data = await response.json();
  
  const mappedUsers = data.map((user: any) => ({
    role: user.roleId === 1 ? 'admin' : user.roleId === 2 ? 'hr' : 'employee',
    // ... other mappings
  }));
  
  setUsers(mappedUsers);
};
```

#### Role Update
```typescript
const handleRoleAssignment = async (userIds: string[], newRole: UserRole) => {
  const roleId = newRole === 'admin' ? 1 : newRole === 'hr' ? 2 : 3;
  
  for (const userId of userIds) {
    await fetch(`http://localhost:5000/api/User/${userId}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roleId })
    });
  }
  
  await loadUsers(); // Refresh
};
```

### Role Definitions

| Role ID | Role Name   | Color Badge      | Permissions                                      |
|---------|-------------|------------------|--------------------------------------------------|
| 1       | Admin       | Purple (bg-purple-100) | Manage all users, Configure system, Access all reports, Assign roles |
| 2       | HR Manager  | Blue (bg-blue-100)     | Manage employees, Access HR reports, Process applications |
| 3       | Employee    | Green (bg-green-100)   | View own profile, Submit applications, View documents |

## How It Works

### 1. Viewing Users
1. Admin navigates to Role Management page
2. Frontend calls `GET /api/User`
3. Backend queries Users table and returns all users with role names
4. Frontend displays users in a table with current roles

### 2. Changing a User's Role
1. Admin clicks "Change Role" button for a user
2. Dropdown shows available roles (excluding current role)
3. Admin selects new role from dropdown
4. Frontend calls `PUT /api/User/{userId}/role` with new RoleId
5. Backend:
   - Validates RoleId (must be 1, 2, or 3)
   - Updates user's RoleID field
   - Updates UpdatedAt timestamp
   - Saves changes to database
6. Frontend refreshes user list to show updated role
7. Success message displayed to admin

### 3. Role Statistics
The page displays real-time counts:
- Total Admins (RoleId = 1)
- Total HR Managers (RoleId = 2)
- Total Employees (RoleId = 3)

## Testing the Implementation

### 1. Access Role Management
1. Login as Admin
2. Navigate to Admin Dashboard
3. Click "Role Management" button
4. Verify users are loaded from database

### 2. View User Information
- Check that usernames match database UserName column
- Verify role names match RoleId mappings
- Confirm UpdatedAt timestamps display correctly
- Check Last Login dates (if any)

### 3. Change User Role
1. Click "Change Role" button for a user
2. Verify dropdown shows only other roles (not current)
3. Select a new role
4. Verify success message appears
5. Check that user's role badge updates
6. Verify database:
   ```sql
   SELECT UserId, UserName, RoleID, UpdatedAt 
   FROM Users 
   WHERE UserName = 'EMP001'
   ```

### 4. Verify Database Updates
After role change, confirm:
- RoleID is updated to new value
- UpdatedAt is set to current timestamp
- No other fields are modified

## Security Considerations

1. **Authorization**: Only admins should access this page (implement route guards)
2. **Validation**: Backend validates RoleId is between 1-3
3. **Audit Trail**: UpdatedAt timestamp tracks when roles were last modified
4. **Consider adding**: 
   - Role change history table
   - Reason field for role changes
   - Email notifications on role changes

## Error Handling

### Frontend
- Loading state while fetching users
- Error message if API call fails
- Disables "Change Role" button during update
- Alert on update failure

### Backend
- Returns 404 if user not found
- Returns 400 if RoleId invalid
- Returns 500 on database errors
- Logs all operations and errors

## Future Enhancements

1. **Audit Log**: Track who changed roles and when
2. **Bulk Role Updates**: Select multiple users and change roles at once
3. **Role Permissions Editor**: Configure custom permissions per role
4. **Search and Filter**: Filter users by role, status, or search by username
5. **Pagination**: Handle large numbers of users efficiently
6. **Email Notifications**: Notify users when their role changes
7. **Role History**: View previous roles and change dates
8. **Confirmation Dialog**: Require confirmation before changing roles
9. **Undo Functionality**: Ability to revert recent role changes

## Troubleshooting

### Users not loading
- Check backend is running on port 5000
- Verify database connection string
- Check browser console for errors
- Verify API endpoint: `http://localhost:5000/api/User`

### Role update fails
- Check user exists in database
- Verify RoleId is 1, 2, or 3
- Check network tab for API response
- Verify database permissions

### Incorrect role names displayed
- Verify RoleId values in database match mapping (1=Admin, 2=HR Manager, 3=Employee)
- Check `GetRoleName()` method in UserService.cs

## API Testing with curl

### Get all users:
```bash
curl -X GET http://localhost:5000/api/User
```

### Update user role:
```bash
curl -X PUT http://localhost:5000/api/User/1/role \
  -H "Content-Type: application/json" \
  -d '{"roleId": 2}'
```

## Conclusion

The Role Management feature is now fully implemented with:
- ✅ Dynamic user loading from database
- ✅ Real-time role display with color-coded badges
- ✅ Dropdown-based role updates
- ✅ Automatic database updates
- ✅ UpdatedAt timestamp tracking
- ✅ Role statistics dashboard
- ✅ Error handling and loading states

Administrators can now efficiently manage user roles through an intuitive interface that directly updates the database.
