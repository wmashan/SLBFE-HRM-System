# Task Assignment Feature Documentation

## Overview

The Task Assignment feature allows administrators to assign specific features and responsibilities to HR managers, creating role-based access control within the HR system. This enables fine-grained control over what each HR officer can access based on their assigned tasks.

## Features

### 🎯 **Task-Based Access Control**
- Assign specific HR features to individual users
- Pre-defined task types for common HR roles
- Custom permission configurations
- Real-time permission enforcement

### 👥 **HR Role Types**
- **Medical Officer**: Medical claims processing and health-related HR matters
- **Transfer Officer**: Employee transfers and relocations
- **Retirement Officer**: Retirement processes and benefits
- **Recruitment Officer**: Hiring and recruitment processes
- **Training Coordinator**: Training programs and development
- **Payroll Officer**: Payroll and compensation management
- **General HR**: Broad HR responsibilities with extensive access
- **Custom Assignment**: Tailored permissions for specific needs

### 🔐 **Available Features**
- **Overview**: Dashboard and statistics (always accessible)
- **Employee Management**: Manage employee records
- **Medical Claims**: Process medical claims and health matters
- **Transfer Management**: Handle employee transfers
- **Retirement Management**: Manage retirement processes
- **Leave Management**: Process leave requests
- **Attendance Tracking**: Monitor employee attendance
- **Recruitment**: Manage hiring processes
- **Training Programs**: Coordinate training and development
- **Performance Management**: Handle performance reviews
- **Payroll Management**: Process payroll and compensation
- **Reports & Analytics**: Generate reports and analytics
- **Document Management**: Access HR documents
- **Settings**: User settings and preferences (always accessible)

## How It Works

### 1. **Administrator Assignment**
1. Admin navigates to **Task Assignment** in the admin dashboard
2. Clicks **"New Assignment"** to create a task assignment
3. Selects an HR user from the available users
4. Chooses a task type (Medical Officer, Transfer Officer, etc.)
5. Configures specific features the user should access
6. Saves the assignment

### 2. **HR User Experience**
1. HR user logs into the system
2. System retrieves their assigned permissions
3. Dashboard shows only authorized features in the sidebar
4. Unauthorized sections display access denied messages
5. User sees a simplified interface focused on their responsibilities

### 3. **Permission Enforcement**
- **Sidebar Navigation**: Only shows permitted features
- **Content Access**: Unauthorized content shows access denied
- **API Calls**: Backend enforces permissions (when implemented)
- **Route Protection**: Prevents direct URL access to unauthorized features

## Example Use Cases

### 🏥 **Medical Claims Officer**
**Assigned Features**: Overview, Medical Claims, Documents, Settings

**Experience**:
```
✅ Can access: Dashboard overview, Medical claims processing, Document management
❌ Cannot access: Employee transfers, Retirement management, Payroll
```

### ✈️ **Transfer Officer**
**Assigned Features**: Overview, Transfer, Settings

**Experience**:
```
✅ Can access: Dashboard overview, Transfer management, Basic settings
❌ Cannot access: Medical claims, Recruitment, Training programs
```

### 🎯 **Recruitment Officer**
**Assigned Features**: Overview, Employees, Recruitment, Settings

**Experience**:
```
✅ Can access: Employee management, Recruitment processes, Applications
❌ Cannot access: Medical claims, Payroll, Retirement management
```

## Implementation Details

### Frontend Components

#### 1. **TaskAssignment Component**
- **Location**: `frontend/src/pages/admin/TaskAssignment.tsx`
- **Features**: 
  - View all task assignments
  - Create/edit/delete assignments
  - Filter by task type and user
  - Real-time permission preview

#### 2. **Updated HR Dashboard**
- **Location**: `frontend/src/pages/HRManagerDashboard.tsx`
- **Features**:
  - Permission-based navigation
  - Dynamic sidebar generation
  - Access control enforcement
  - User-friendly error messages

### Types and Interfaces

#### 1. **HRFeature Type**
```typescript
type HRFeature = 
  | 'overview' | 'employees' | 'medical_claims' | 'retirement' 
  | 'transfer' | 'leave_management' | 'attendance' | 'recruitment' 
  | 'training' | 'performance' | 'payroll' | 'reports' 
  | 'documents' | 'settings';
```

#### 2. **TaskAssignmentType**
```typescript
type TaskAssignmentType = 
  | 'medical_officer' | 'transfer_officer' | 'retirement_officer'
  | 'recruitment_officer' | 'training_coordinator' | 'payroll_officer'
  | 'general_hr' | 'custom';
```

#### 3. **HRTaskAssignment Interface**
```typescript
interface HRTaskAssignment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  taskType: TaskAssignmentType;
  taskDescription: string;
  assignedFeatures: HRFeature[];
  isActive: boolean;
  assignedBy: string;
  assignedDate: Date;
  lastModified: Date;
  notes?: string;
}
```

### API Endpoints

#### Task Assignment Management
- `GET /admin/task-assignments` - List all assignments
- `POST /admin/task-assignments` - Create new assignment
- `PUT /admin/task-assignments/{id}` - Update assignment
- `DELETE /admin/task-assignments/{id}` - Delete assignment
- `POST /admin/task-assignments/{id}/toggle` - Toggle assignment status

#### User and Permission Management
- `GET /admin/hr-users` - Get available HR users
- `GET /admin/users/{userId}/permissions` - Get user permissions
- `GET /admin/task-templates` - Get task templates
- `GET /admin/feature-permissions` - Get available features

## Configuration Examples

### Medical Officer Assignment
```json
{
  "taskType": "medical_officer",
  "assignedFeatures": ["overview", "medical_claims", "documents", "settings"],
  "taskDescription": "Medical Claims Processing Officer"
}
```

### Transfer Officer Assignment
```json
{
  "taskType": "transfer_officer", 
  "assignedFeatures": ["overview", "transfer", "settings"],
  "taskDescription": "Employee Transfer Coordinator"
}
```

### Custom Assignment
```json
{
  "taskType": "custom",
  "assignedFeatures": ["overview", "employees", "recruitment", "training", "settings"],
  "taskDescription": "HR Coordinator - Recruitment & Training"
}
```

## Security Considerations

### ✅ **Implemented**
- Frontend permission checking
- UI-based access control
- Route-level protection
- User-friendly error handling

### 🔄 **To Be Implemented**
- Backend API permission validation
- Database-stored permissions
- Session-based permission caching
- Audit logging for permission changes

## Benefits

### 🎯 **For Organizations**
- **Improved Security**: Restrict access to sensitive HR data
- **Compliance**: Meet data protection requirements
- **Operational Efficiency**: Users see only relevant features
- **Reduced Errors**: Limited access reduces accidental changes

### 👤 **For HR Users**
- **Simplified Interface**: Clean, focused user experience
- **Faster Navigation**: Quick access to relevant features
- **Reduced Confusion**: Clear scope of responsibilities
- **Better Productivity**: Less time spent navigating unused features

### 🔧 **For Administrators**
- **Centralized Control**: Manage all user permissions from one place
- **Flexible Assignment**: Easy to modify permissions as roles change
- **Clear Oversight**: View all assignments and their status
- **Audit Trail**: Track who has access to what features

## Future Enhancements

### 🚀 **Planned Features**
1. **Assignment Templates**: Pre-configured permission sets
2. **Bulk Assignment**: Assign permissions to multiple users
3. **Time-based Permissions**: Temporary access grants
4. **Approval Workflow**: Require approval for permission changes
5. **Advanced Reporting**: Permission usage analytics
6. **Integration**: Connect with external identity providers

## Troubleshooting

### Common Issues

#### ❓ **User Can't See Expected Features**
- Check if task assignment is active
- Verify assigned features include the expected ones
- Ensure user is logged in with correct account

#### ❓ **Access Denied Messages**
- Normal behavior for unauthorized features
- Direct users to contact administrator
- Check if assignment needs updating

#### ❓ **Navigation Not Updating**
- User may need to logout and login again
- Clear browser cache if permissions were recently changed
- Verify assignment was saved correctly

## Support

For questions or issues with the Task Assignment feature:

1. **Check Documentation**: Review this guide thoroughly
2. **Verify Configuration**: Ensure assignments are properly configured
3. **Test with Different Users**: Verify behavior across different roles
4. **Contact Development Team**: For technical issues or feature requests

---

*This feature enables precise control over HR system access, ensuring each user has the right level of access for their responsibilities while maintaining system security and operational efficiency.*