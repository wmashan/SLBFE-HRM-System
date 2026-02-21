# Fix: Dynamic Applications Count in HR Dashboard

## Issue
The HR Manager Dashboard was showing a hardcoded "23" badge in the Applications menu item instead of fetching the real count from the database.

## Root Cause
Two issues were identified:
1. **Dashboard Badge**: HRManagerDashboard.tsx had hardcoded `newApplications: 23` in dashboardStats
2. **Filter Limitation**: Applications.tsx was calling `getPendingApplications()` which only returns pending applications, but the component had filters for "All Status", "Pending", "Active", and "Rejected"

## Solution Implemented

### Backend Changes

#### 1. New Service Method
**File**: `backend/Application/Services/Implementations/EmployeeService.cs`

Added `GetAllApplicationsAsync()` method:
```csharp
public async Task<IEnumerable<EmployeeSummaryDto>> GetAllApplicationsAsync()
{
    var allApplications = await (from e in _context.Employees
                                 join u in _context.Users on e.EmployeeId equals u.EmployeeId
                                 orderby e.CreatedAt descending
                                 select new
                                 {
                                     Employee = e,
                                     UserStatus = u.Status
                                 }).ToListAsync();

    var result = allApplications.Select(app =>
    {
        var dto = _mapper.Map<EmployeeSummaryDto>(app.Employee);
        dto.Status = app.UserStatus;
        return dto;
    });

    return result;
}
```

This method returns ALL employee applications (Pending, Active, Rejected) with their status from the Users table.

#### 2. Interface Update
**File**: `backend/Application/Services/Interfaces/IEmployeeService.cs`

Added method signature:
```csharp
Task<IEnumerable<EmployeeSummaryDto>> GetAllApplicationsAsync();
```

#### 3. New Controller Endpoint
**File**: `backend/Presentation/Controllers/EmployeeController.cs`

Added endpoint:
```csharp
[HttpGet("all-applications")]
[Authorize(Roles = "admin,senior_hr_manager,hr")]
public async Task<ActionResult<IEnumerable<EmployeeSummaryDto>>> GetAllApplications()
{
    try
    {
        var applications = await _employeeService.GetAllApplicationsAsync();
        return Ok(applications);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error getting all applications");
        return StatusCode(500, "An error occurred while retrieving all applications");
    }
}
```

**Endpoint**: `GET /api/Employee/all-applications`
**Authorization**: admin, senior_hr_manager, hr roles

### Frontend Changes

#### 1. API Service Enhancement
**File**: `frontend/src/services/api.ts`

Added new method:
```typescript
async getAllApplications(): Promise<ApiResponse<any[]>> {
  return this.request<any[]>('/Employee/all-applications');
}
```

Exported in employeeService:
```typescript
export const employeeService = {
  // ... existing methods
  getAllApplications: () => apiService.getAllApplications(),
  // ... other methods
};
```

#### 2. HR Dashboard Dynamic Count
**File**: `frontend/src/pages/HRManagerDashboard.tsx`

**Added import:**
```typescript
import { employeeService } from '../services/api';
```

**Added state:**
```typescript
const [pendingApplicationsCount, setPendingApplicationsCount] = useState<number>(0);
```

**Added fetch function:**
```typescript
const fetchPendingApplicationsCount = async () => {
  try {
    const response = await employeeService.getPendingApplications();
    if (response.success && response.data) {
      setPendingApplicationsCount(response.data.length);
    }
  } catch (error) {
    console.error('Failed to fetch pending applications count:', error);
  }
};
```

**Updated useEffect:**
```typescript
useEffect(() => {
  loadUserData();
  fetchPendingApplicationsCount();
}, []);
```

**Updated dashboardStats:**
```typescript
const dashboardStats = {
  newApplications: pendingApplicationsCount  // Dynamic value instead of hardcoded 23
};
```

#### 3. Applications Page Filter Support
**File**: `frontend/src/pages/dashboard/Applications.tsx`

Changed from:
```typescript
const response = await employeeService.getPendingApplications();
```

To:
```typescript
const response = await employeeService.getAllApplications();
```

Now the filter dropdown works correctly:
- **All Status**: Shows all applications
- **Pending**: Shows only pending applications
- **Active**: Shows only approved applications
- **Rejected**: Shows only rejected applications

## API Endpoints Summary

| Endpoint | Purpose | Returns |
|----------|---------|---------|
| `GET /api/Employee/pending-applications` | Get only pending applications | Pending applications only |
| `GET /api/Employee/all-applications` | Get all applications with status | All applications (Pending, Active, Rejected) |

## Testing

### 1. Test Dashboard Badge
1. Log in as HR Manager
2. Check Applications menu item in sidebar
3. ✅ Should show actual count of pending applications from database
4. Submit a new application
5. Refresh HR Dashboard
6. ✅ Badge count should increment

### 2. Test Applications Filter
1. Navigate to Applications tab
2. Check statistics cards
3. ✅ Should show accurate counts (Total, Pending, Approved, Rejected)
4. Select filter "All Status"
5. ✅ Should show all applications
6. Select filter "Pending"
7. ✅ Should show only pending applications
8. Select filter "Active"
9. ✅ Should show only approved applications
10. Select filter "Rejected"
11. ✅ Should show only rejected applications

### 3. Test Search with Filters
1. Search for an employee name
2. Apply different status filters
3. ✅ Should show matching results based on both search and filter

## Build Status
- ✅ Backend: Build succeeded (0 errors)
- ✅ Frontend: No TypeScript errors in modified files

## Benefits
1. **Real-time Data**: Dashboard always shows current pending applications count
2. **Better Filtering**: Applications page can filter by all statuses
3. **Accurate Statistics**: Stats cards reflect actual database state
4. **No Hardcoded Data**: All values dynamic from API
5. **Better UX**: Users see accurate information at all times

## Files Modified

### Backend
- `backend/Application/Services/Interfaces/IEmployeeService.cs`
- `backend/Application/Services/Implementations/EmployeeService.cs`
- `backend/Presentation/Controllers/EmployeeController.cs`

### Frontend
- `frontend/src/services/api.ts`
- `frontend/src/pages/HRManagerDashboard.tsx`
- `frontend/src/pages/dashboard/Applications.tsx`

## Impact
- ✅ No breaking changes
- ✅ Backward compatible (existing pending-applications endpoint still works)
- ✅ Improved functionality and accuracy
- ✅ Better user experience

## Next Steps
1. Clear browser cache if needed
2. Restart backend API server
3. Restart frontend dev server
4. Test the workflow end-to-end
5. Verify in production environment
