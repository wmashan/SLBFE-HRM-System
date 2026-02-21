# User Account Creation and Application Review Workflow

## Overview
This document describes the complete implementation of the user account creation flow with application review process for the SLBFE HRM System.

## Workflow Summary

### 1. Employee Application Submission
1. Employee fills out the account creation form through UserAccountCreation page
2. Upon successful submission:
   - Employee record is created in the database
   - User account is created with **Status = "Pending"**
   - Login credentials are generated and displayed to the employee
   - Employee is redirected to success page with credentials

### 2. HR Manager Review Dashboard
1. HR Manager logs in and navigates to Applications tab
2. Applications page dynamically loads all pending applications from the database
3. Statistics are displayed:
   - Total Applications
   - Pending Review
   - Approved
   - Rejected

### 3. Application Review Process
1. HR Manager clicks "Review" button on an application
2. Redirected to ApplicationReview page showing complete employee details
3. HR Manager can:
   - View all employee information (personal, address, employment details)
   - Add optional review comments
   - **Approve** - Sets User.Status to "Active"
   - **Reject** - Sets User.Status to "Rejected"
4. After submission, redirected back to HR dashboard

## Backend Implementation

### Database Schema
**Users Table:**
- UserId (PK)
- EmployeeId (FK to Employee table)
- PasswordHash
- RoleID
- **Status** (NVARCHAR(20)) - "Pending", "Active", or "Rejected"

### DTOs Created/Updated

#### ReviewEmployeeApplicationDto.cs
```csharp
public class ReviewEmployeeApplicationDto
{
    [Required]
    public string Status { get; set; } // "Approved" or "Rejected"
    public string? ReviewComments { get; set; }
}
```

#### EmployeeSearchDto.cs
- Added `Status` filter field
- Changed default `SortBy` to "CreatedAt"
- Changed default `SortDescending` to true

#### EmployeeSummaryDto.cs
- Added `Status` field (sourced from Users table)

### Service Methods

#### GetPendingApplicationsAsync()
**Location:** `Backend/Application/Services/Implementations/EmployeeService.cs`

**Purpose:** Retrieves all employee applications with Status = "Pending"

**Implementation:**
```csharp
public async Task<IEnumerable<EmployeeSummaryDto>> GetPendingApplicationsAsync()
{
    var pendingApplications = await _context.Employees
        .Join(_context.Users,
            e => e.EmployeeId,
            u => u.EmployeeId,
            (e, u) => new { Employee = e, User = u })
        .Where(x => x.User.Status == "Pending")
        .Select(x => new EmployeeSummaryDto
        {
            EmployeeId = x.Employee.EmployeeId,
            FullName = x.Employee.FullName,
            NameInitials = x.Employee.NameInitials,
            Email = x.Employee.Email,
            Contact1 = x.Employee.Contact1,
            DesignationId = x.Employee.DesignationId,
            DivisionId = x.Employee.DivisionId,
            EmployeeTypeId = x.Employee.EmployeeTypeId,
            CreatedAt = x.Employee.CreatedAt,
            ProfilePictureUrl = x.Employee.ProfilePictureUrl,
            Status = x.User.Status
        })
        .OrderByDescending(x => x.CreatedAt)
        .ToListAsync();

    return pendingApplications;
}
```

#### ReviewEmployeeApplicationAsync()
**Location:** `Backend/Application/Services/Implementations/EmployeeService.cs`

**Purpose:** Approves or rejects an employee application

**Implementation:**
```csharp
public async Task<bool> ReviewEmployeeApplicationAsync(string employeeId, ReviewEmployeeApplicationDto reviewDto)
{
    // Find employee
    var employee = await _context.Employees
        .FirstOrDefaultAsync(e => e.EmployeeId == employeeId);
    
    if (employee == null)
        return false;

    // Find associated user
    var user = await _context.Users
        .FirstOrDefaultAsync(u => u.EmployeeId == employeeId);
    
    if (user == null)
        return false;

    // Check if already processed
    if (user.Status != "Pending")
        return false;

    // Update status based on review decision
    user.Status = reviewDto.Status == "Approved" ? "Active" : "Rejected";
    
    await _context.SaveChangesAsync();
    return true;
}
```

### Controller Endpoints

#### GET /api/Employee/pending-applications
**Authorization:** Requires "admin", "senior_hr_manager", or "hr" role

**Response:**
```json
[
  {
    "employeeId": "EMP0001",
    "fullName": "John Doe",
    "nameInitials": "J.D.",
    "email": "john.doe@example.com",
    "contact1": "0771234567",
    "designationId": "DES001",
    "divisionId": 1,
    "employeeTypeId": 1,
    "createdAt": "2025-01-28T10:30:00",
    "profilePictureUrl": null,
    "status": "Pending"
  }
]
```

#### POST /api/Employee/{employeeId}/review
**Authorization:** Requires "admin", "senior_hr_manager", or "hr" role

**Request Body:**
```json
{
  "status": "Approved",
  "reviewComments": "All documents verified and approved"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Application reviewed successfully"
}
```

## Frontend Implementation

### Pages Modified/Created

#### Applications.tsx (Updated)
**Location:** `frontend/src/pages/dashboard/Applications.tsx`

**Changes:**
- Removed hardcoded applications array
- Added dynamic data loading via `employeeService.getPendingApplications()`
- Added loading and error states
- Added search and filter functionality
- Statistics calculated dynamically from API data
- "Review" button navigates to `/applications/{employeeId}/review`

**Key Features:**
- Real-time statistics (Total, Pending, Approved, Rejected)
- Search by name, email, or employee ID
- Filter by status
- Loading spinner during data fetch
- Empty state when no applications found

#### ApplicationReview.tsx (New)
**Location:** `frontend/src/pages/dashboard/ApplicationReview.tsx`

**Purpose:** Single-page application review interface with simplified approve/reject actions

**Features:**
- Displays complete employee profile with avatar
- Shows all personal information
- Shows address information
- Shows employment details
- Optional review comments textarea
- Single **Approve** button (green) - sets Status to "Active"
- Single **Reject** button (red) - sets Status to "Rejected"
- Confirmation modal before final submission
- Cancel button returns to HR dashboard
- Success/error feedback

**UI Sections:**
1. **Header** - Back button and employee ID
2. **Profile Card** - Avatar, name, email, phone, DOB
3. **Personal Information** - NIC, passport, gender, application date
4. **Address Information** - Permanent and current addresses
5. **Employment Details** - Designation, division, employee type
6. **Review Comments** - Optional textarea
7. **Action Buttons** - Cancel, Reject, Approve

### Routing
**App.tsx Updated with:**
```typescript
<Route 
  path="/applications/:employeeId/review" 
  element={
    <ProtectedRoute allowedRoles={['admin', 'hr', 'senior_hr_manager']}>
      <ApplicationReview />
    </ProtectedRoute>
  } 
/>
```

### API Service Methods Added

#### getPendingApplications()
**Location:** `frontend/src/services/api.ts`

```typescript
async getPendingApplications(): Promise<ApiResponse<any[]>> {
  return this.request<any[]>('/Employee/pending-applications');
}
```

#### getEmployeeByEmployeeId()
**Location:** `frontend/src/services/api.ts`

```typescript
async getEmployeeByEmployeeId(employeeId: string): Promise<ApiResponse<any>> {
  return this.request<any>(`/Employee/${employeeId}`);
}
```

#### reviewApplication()
**Location:** `frontend/src/services/api.ts`

```typescript
async reviewApplication(
  employeeId: string, 
  reviewData: { status: string; reviewComments?: string }
): Promise<ApiResponse<any>> {
  return this.request<any>(`/Employee/${employeeId}/review`, {
    method: 'POST',
    body: JSON.stringify(reviewData),
  });
}
```

### employeeService Exports
```typescript
export const employeeService = {
  getEmployees: (params?: any) => apiService.getEmployees(params),
  getEmployee: (id: number) => apiService.getEmployee(id),
  getEmployeeByEmployeeId: (employeeId: string) => apiService.getEmployeeByEmployeeId(employeeId),
  createEmployee: (data: EmployeeCreateRequest) => apiService.createEmployee(data),
  updateEmployee: (id: number, data: Partial<Employee>) => apiService.updateEmployee(id, data),
  deleteEmployee: (id: number) => apiService.deleteEmployee(id),
  searchEmployees: (params?: any) => apiService.searchEmployees(params),
  checkEmployeeUnique: (field: string, value: string) => apiService.checkEmployeeUnique(field, value),
  getPendingApplications: () => apiService.getPendingApplications(),
  reviewApplication: (employeeId: string, reviewData: { status: string; reviewComments?: string }) => 
    apiService.reviewApplication(employeeId, reviewData),
};
```

## User Flow

### Employee Perspective
1. Navigate to account creation page
2. Fill out multi-step registration form
3. Submit application
4. Receive auto-generated login credentials
5. Wait for HR approval
6. Once approved (Status = "Active"), can log in to the system

### HR Manager Perspective
1. Log in to HR dashboard
2. Click "Applications" tab
3. View dashboard statistics and list of pending applications
4. Click "Review" on an application
5. Review all employee information
6. Optionally add comments
7. Click "Approve" to activate the account or "Reject" to deny
8. Confirm decision in modal
9. Return to applications dashboard

## Security & Authorization

### Required Roles
- **Applications List:** admin, senior_hr_manager, hr
- **Review Application:** admin, senior_hr_manager, hr

### Protected Routes
- All routes require valid JWT token
- Role-based access control enforced via `ProtectedRoute` component
- Backend endpoints use `[Authorize(Roles = "admin,senior_hr_manager,hr")]`

## Status Values

| Status | Meaning | Set By |
|--------|---------|--------|
| Pending | Application submitted, awaiting review | System (on creation) |
| Active | Application approved, can log in | HR Manager (Approve) |
| Rejected | Application denied | HR Manager (Reject) |

## Key Design Decisions

1. **Single Approval Action:** Simplified from section-wise approval to single approve/reject as per requirements
2. **Users Table Status:** Status tracking is in Users table (not Employee table) to represent account activation state
3. **Dynamic Loading:** All application data loaded from API, no hardcoded values
4. **Confirmation Modal:** Double-check before approving/rejecting to prevent accidental actions
5. **Navigation Pattern:** Review page is separate route for deep linking and better UX

## Testing Checklist

- [ ] Employee can submit account creation form
- [ ] Login credentials are displayed after submission
- [ ] New application appears in HR Manager's Applications tab with "Pending" status
- [ ] Statistics update correctly after new application
- [ ] Search functionality works (name, email, employee ID)
- [ ] Filter by status works correctly
- [ ] Review button navigates to ApplicationReview page
- [ ] All employee information displays correctly on review page
- [ ] Approve button sets Status to "Active"
- [ ] Reject button sets Status to "Rejected"
- [ ] Confirmation modal shows before final action
- [ ] Success message displays after approval/rejection
- [ ] User redirected back to applications dashboard after review
- [ ] Approved user can log in successfully
- [ ] Rejected user cannot log in
- [ ] Review comments are optional and don't block submission
- [ ] Only authorized roles can access applications and review pages

## Files Modified

### Backend
- `Backend/Application/DTOs/Request/EmployeeRequestDto.cs` - Added ReviewEmployeeApplicationDto
- `Backend/Application/DTOs/Response/EmployeeDto.cs` - Added Status to EmployeeSummaryDto
- `Backend/Application/Services/Interfaces/IEmployeeService.cs` - Added GetPendingApplicationsAsync, ReviewEmployeeApplicationAsync
- `Backend/Application/Services/Implementations/EmployeeService.cs` - Implemented new methods
- `Backend/Presentation/Controllers/EmployeeController.cs` - Added pending-applications and review endpoints

### Frontend
- `frontend/src/App.tsx` - Added ApplicationReview route
- `frontend/src/pages/dashboard/Applications.tsx` - Complete rewrite for dynamic loading
- `frontend/src/pages/dashboard/ApplicationReview.tsx` - New component
- `frontend/src/services/api.ts` - Added getPendingApplications, getEmployeeByEmployeeId, reviewApplication methods

## Future Enhancements

1. Email notifications to employee when application is approved/rejected
2. Audit trail for who approved/rejected applications
3. Ability to view review comments in application history
4. Bulk approval functionality
5. Advanced filtering (by date range, designation, etc.)
6. Export applications to Excel/PDF
7. Application status tracking page for employees
