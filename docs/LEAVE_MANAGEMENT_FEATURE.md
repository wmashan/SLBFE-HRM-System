# Leave Management Feature - Quick Reference

## Overview
The Leave Management feature provides HR Managers with comprehensive tools to manage employee leave requests, track leave balances, and configure leave quotas. This implementation includes a modern, user-friendly interface with dummy data for demonstration purposes.

## Feature Location
**Dashboard:** HR Manager Dashboard → Leave Requests

## Components Created

### Main Component
- **File:** `frontend/src/pages/dashboard/LeaveManagement.tsx`
- **Purpose:** Complete leave management interface for HR Managers

## Features Implemented

### 1. Leave Requests Management
- **View All Requests:** Display all leave requests in a tabular format
- **Filter by Status:** Filter requests by Pending, Approved, or Rejected status
- **Search Functionality:** Search by employee name, ID, or leave type
- **Detailed View:** View complete details of each leave request
- **Approve/Reject:** Take action on pending requests with remarks
- **Statistics Dashboard:** Real-time stats showing total, pending, approved, and rejected requests

### 2. Employee Leave Balances
- **Balance Tracking:** View allocated, used, pending, and available leave days
- **Multiple Leave Types:** Track different leave types per employee
- **Usage Percentage:** Visual progress bars showing leave usage
- **Color-Coded Indicators:** 
  - Green: <50% usage
  - Yellow: 50-80% usage
  - Red: >80% usage

### 3. Leave Quotas Management
- **Leave Type Configuration:** View and manage different leave types
- **Default Allocations:** Configure default leave allocations per type
- **Leave Types Included:**
  - Annual Leave: 21 days
  - Sick Leave: 14 days
  - Casual Leave: 7 days
  - Maternity Leave: 90 days

## Database Schema Reference

### LeaveRequest Table
```sql
CREATE TABLE [dbo].[LeaveRequest] (
    [LeaveRequestId] INT            IDENTITY (1, 1) NOT NULL,
    [EmployeeId]     NVARCHAR (50)  NOT NULL,
    [LeaveTypeId]    INT            NOT NULL,
    [StartDate]      DATE           NOT NULL,
    [EndDate]        DATE           NOT NULL,
    [TotalDays]      DECIMAL (4, 1) NOT NULL,
    [Reason]         NVARCHAR (500) NULL,
    [Status]         NVARCHAR (20)  DEFAULT ('Pending') NOT NULL,
    [AppliedDate]    DATETIME       DEFAULT (getdate()) NOT NULL,
    [ApprovedBy]     INT            NULL,
    [Remarks]        NVARCHAR (500) NULL,
    CONSTRAINT [PK_LeaveRequestId] PRIMARY KEY CLUSTERED ([LeaveRequestId] ASC),
    CONSTRAINT [FK_Leave_Type] FOREIGN KEY ([LeaveTypeId]) REFERENCES [dbo].[LeaveType] ([LeaveTypeId]),
    CONSTRAINT [FK_LeaveRequest_Employees] FOREIGN KEY ([EmployeeId]) REFERENCES [dbo].[Employees] ([EmployeeId])
);
```

### LeaveType Table
```sql
CREATE TABLE [dbo].[LeaveType] (
    [LeaveTypeId]       INT           IDENTITY (1, 1) NOT NULL,
    [TypeName]          NVARCHAR (50) NOT NULL,
    [DefaultAllocation] INT           DEFAULT ((0)) NULL,
    PRIMARY KEY CLUSTERED ([LeaveTypeId] ASC),
    UNIQUE NONCLUSTERED ([TypeName] ASC)
);
```

## Dummy Data Provided

### Sample Leave Requests (7 entries)
1. **Ashan Wickramanayaka** - Annual Leave (Pending)
   - 5 days: Feb 10-14, 2026
   - Reason: Family vacation

2. **Nimal Perera** - Sick Leave (Pending)
   - 3 days: Jan 25-27, 2026
   - Reason: Medical checkup

3. **Kasun Silva** - Annual Leave (Approved)
   - 3 days: Jan 15-17, 2026
   - Reason: Family wedding

4. **Chamari Fernando** - Casual Leave (Approved)
   - 2 days: Feb 1-2, 2026
   - Reason: Personal work

5. **Ruwan Jayasinghe** - Annual Leave (Rejected)
   - 11 days: Mar 15-25, 2026
   - Rejection: Peak project phase

6. **Sanduni Rajapaksa** - Maternity Leave (Pending)
   - 90 days: Feb 15 - May 15, 2026

7. **Thilina Kumara** - Sick Leave (Pending)
   - 1 day: Jan 28, 2026
   - Reason: Fever

### Sample Leave Balances (6 entries)
- Multiple employees with different leave types
- Shows allocated, used, pending, and available days
- Includes usage percentage tracking

## User Interface Features

### Statistics Cards
- **Total Requests:** Shows total number of leave requests
- **Pending:** Displays pending requests requiring action
- **Approved:** Shows approved requests count
- **Rejected:** Displays rejected requests count

### Tabbed Interface
1. **Leave Requests Tab:**
   - Comprehensive table view
   - Status filters
   - Search functionality
   - Quick actions (View, Approve, Reject)

2. **Employee Balances Tab:**
   - Leave balance tracking
   - Usage visualization
   - Multiple leave types per employee

3. **Leave Quotas Tab:**
   - Leave type configuration
   - Default allocation management
   - Visual cards for each leave type

### Modals
1. **Details Modal:**
   - Complete leave request information
   - Employee details
   - Leave duration and reason
   - Approval/rejection history
   - Quick action buttons

2. **Action Modal (Approve/Reject):**
   - Employee summary
   - Leave period overview
   - Remarks input field
   - Confirmation buttons

## Color Coding

### Status Colors
- **Pending:** Yellow (bg-yellow-100)
- **Approved:** Green (bg-green-100)
- **Rejected:** Red (bg-red-100)

### Leave Type Colors
- **Annual Leave:** Blue
- **Sick Leave:** Red
- **Casual Leave:** Green
- **Maternity Leave:** Purple

## Integration Points

### HR Manager Dashboard
- Added to navigation menu with Calendar icon
- Feature ID: `leave_management`
- Permission-based access control
- Located between "Medical Claims" and "Transfer" sections

### Modified Files
1. **HRManagerDashboard.tsx**
   - Added Calendar icon import
   - Added LeaveManagement component import
   - Added navigation item for Leave Requests
   - Added leave_management to user permissions
   - Added component rendering logic

2. **LeaveManagement.tsx** (New)
   - Complete leave management interface
   - Three-tab layout
   - Modal components for details and actions

## Future Backend Integration

### API Endpoints Needed
```typescript
// Leave Requests
GET    /api/leave-requests              // Get all leave requests
GET    /api/leave-requests/:id          // Get specific request
POST   /api/leave-requests              // Create new request
PUT    /api/leave-requests/:id/approve  // Approve request
PUT    /api/leave-requests/:id/reject   // Reject request

// Leave Balances
GET    /api/leave-balances/:employeeId  // Get employee leave balance
GET    /api/leave-balances              // Get all balances

// Leave Types/Quotas
GET    /api/leave-types                 // Get all leave types
POST   /api/leave-types                 // Create new leave type
PUT    /api/leave-types/:id             // Update leave type
DELETE /api/leave-types/:id             // Delete leave type
```

### Data Models
```typescript
interface LeaveRequest {
  leaveRequestId: number;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveTypeId: number;
  leaveTypeName: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string;
  approvedBy?: number;
  approverName?: string;
  remarks?: string;
}

interface LeaveBalance {
  employeeId: string;
  employeeName: string;
  leaveType: string;
  allocated: number;
  used: number;
  pending: number;
  available: number;
}
```

## Testing the Feature

### Access Steps
1. Login as HR Manager
2. Navigate to HR Manager Dashboard
3. Click on "Leave Requests" in the sidebar
4. Explore the three tabs:
   - Leave Requests
   - Employee Balances
   - Leave Quotas

### Test Actions
- Filter requests by status
- Search for specific employees
- View request details
- Simulate approval/rejection (shows alert)
- View employee leave balances
- Explore leave type quotas

## Styling
- **Framework:** Tailwind CSS
- **Icons:** Lucide React
- **Design:** Modern, clean, and responsive
- **Theme:** Blue primary color scheme
- **Layout:** Card-based with shadow effects

## Responsive Design
- Mobile-friendly layout
- Responsive grid system
- Collapsible tables on smaller screens
- Touch-friendly buttons and modals

## Next Steps for Production

1. **Backend Integration:**
   - Connect to actual API endpoints
   - Implement real-time data fetching
   - Add error handling and loading states

2. **Authentication:**
   - Verify HR Manager permissions
   - Add user-specific data filtering
   - Implement approval workflow

3. **Notifications:**
   - Email notifications for status changes
   - In-app notifications for pending requests
   - SMS alerts for urgent matters

4. **Reporting:**
   - Export functionality to PDF/Excel
   - Custom date range filtering
   - Department-wise reports

5. **Enhancements:**
   - Leave calendar view
   - Conflict detection (multiple leaves on same dates)
   - Auto-calculation of leave days
   - Public holiday integration
   - Leave carry-forward rules

## Notes
- All data is currently dummy/mock data for demonstration
- Actions (Approve/Reject) show alerts instead of API calls
- Real backend integration required for production use
- Component follows existing project patterns and styling conventions

## Support
For questions or issues related to this feature, refer to:
- Project documentation in `/docs`
- Backend API documentation (when available)
- Component source code in `frontend/src/pages/dashboard/LeaveManagement.tsx`
