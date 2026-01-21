# Special Training Programs Feature

## Overview
This feature allows HR Managers to create and manage special training programs that are triggered by specific business requirements, separate from regular training programs.

## Implementation Date
December 2024

## Feature Description

### Purpose
Special training programs are created for mandatory or critical training needs that arise from:
1. **Divisional Manager Requests** - Specific training requested by divisional managers for their teams
2. **Sectional Manager Requests** - Training requested by sectional managers for their sections
3. **Increment Form Requirements** - Mandatory training for employees who failed to receive increments
4. **Performance Improvement** - Training assigned for employees requiring performance enhancement

### Key Components

#### 1. Add Training Program Modal
Location: `/frontend/src/pages/TrainingManagement.tsx`

**Features:**
- **Program Type Selection**
  - Regular Training: Standard employee development programs
  - Special Training: Request-based or mandatory programs
  
- **Special Request Types** (shown only for Special Training):
  - Divisional Request
  - Sectional Request
  - Increment Form Requirement
  - Performance Improvement

- **Request Details Section** (Special Training only):
  - Requested By (Manager name or Employee ID)
  - Requesting Department/Division
  - Request Reason (detailed explanation)
  - Target Employee IDs (comma-separated for targeted training)
  - Special alert for Increment Form Requirements

- **Program Information Section**:
  - Program Name
  - Category (Management, Technical, Marketing, Soft Skills, Compliance, Safety, Performance Improvement)
  - Duration
  - Instructor
  - Description

- **Schedule & Logistics Section**:
  - Start Date & End Date
  - Location (physical or online)
  - Capacity
  - Status (Upcoming, Ongoing, Completed, Cancelled)

#### 2. Calendar Integration

**Special Training Section:**
- Displays all special training programs separately
- Orange-themed UI for visual distinction
- Shows special badges and request type labels
- Includes requester information
- Dedicated section at the top of calendar list view

**Regular Training Section:**
- Standard training programs display
- Blue-themed UI
- Below special training section

**Visual Indicators:**
- Special programs: Orange border and "Special" badge
- Request type displayed as uppercase label
- Requester name prominently shown

### User Interface

#### Program Type Selection Card
```
┌─────────────────────────────────────────────────┐
│ Program Type *                                   │
│                                                  │
│ ○ Regular Training                              │
│   Standard training programs for general        │
│   employee development                          │
│                                                  │
│ ● Special Training                       SPECIAL│
│   Training based on special requests or         │
│   mandatory requirements                        │
└─────────────────────────────────────────────────┘
```

#### Special Request Type Options
```
┌─────────────────────────────────────────────────┐
│ Special Request Type *                           │
│                                                  │
│ ○ Divisional Request                            │
│   Requested by relevant divisional manager      │
│                                                  │
│ ● Sectional Request                             │
│   Requested by relevant sectional manager       │
│                                                  │
│ ○ Increment Form Requirement                    │
│   Training required if increment was not issued │
│                                                  │
│ ○ Performance Improvement                       │
│   Training for performance enhancement          │
└─────────────────────────────────────────────────┘
```

#### Calendar Special Training Display
```
┌──────────────────────────────────────────────────┐
│ 🔔 Special Training Programs - 2024         (3) │
│ Manager requests, increment requirements, and   │
│ performance improvement programs                │
├──────────────────────────────────────────────────┤
│ │ Customer Service Training  SPECIAL │INCREMENT │
│ │ 📅 Jan 15 - Jan 22, 2024                      │
│ │ 👥 Requested by: John Smith                   │
│ │ 📍 Training Room A                            │
│ │ ⏱️  2 weeks                                   │
│ │                                         ✎  🗑 │
├──────────────────────────────────────────────────┤
│ (More special training programs...)             │
└──────────────────────────────────────────────────┘
```

### Data Structure

#### TrainingProgram Interface Extensions
```typescript
interface TrainingProgram {
  // ... existing fields
  programType?: 'regular' | 'special';
  requestType?: 'divisional_request' | 'increment_form' | 'sectional_request' | 'performance_improvement';
  requestedBy?: string;
  requestingDepartment?: string;
  requestReason?: string;
  employeeIds?: string[];
  isSpecialTraining?: boolean;
}
```

#### CalendarEvent Interface Extensions
```typescript
interface CalendarEvent {
  // ... existing fields
  title?: string;
  duration?: string;
  description?: string;
  programType?: 'regular' | 'special';
  requestType?: 'divisional_request' | 'increment_form' | 'sectional_request' | 'performance_improvement';
  requestedBy?: string;
  isSpecialTraining?: boolean;
}
```

### Workflow

#### Creating a Special Training Program

1. **HR Manager clicks "Add Training Program"**
   - Modal opens with program type selection

2. **Select "Special Training"**
   - Special request type options appear
   - Request details section appears

3. **Choose Request Type**
   - Divisional Request
   - Sectional Request
   - Increment Form Requirement (shows special alert)
   - Performance Improvement

4. **Fill Request Details**
   - Enter requesting manager name/ID
   - Specify department or division
   - Provide detailed reason for training
   - Optional: List specific employee IDs for targeted training

5. **Complete Program Information**
   - Program name
   - Category selection
   - Duration
   - Instructor assignment
   - Optional description

6. **Set Schedule & Logistics**
   - Start and end dates
   - Location (room or online)
   - Capacity
   - Status

7. **Submit**
   - Program created
   - Automatically added to annual calendar
   - Appears in "Special Training" section with orange highlighting
   - Notification badge shows in calendar

### Business Rules

1. **Increment Form Special Case:**
   - When request type is "Increment Form Requirement"
   - System shows warning: "This training is mandatory for employees who were denied increment"
   - Employee IDs should be specified
   - HR should reference the increment cycle details

2. **Request Tracking:**
   - All special requests must have a requesting manager
   - Department/Division must be specified
   - Reason is mandatory

3. **Calendar Organization:**
   - Special training appears in separate section (top)
   - Regular training appears below
   - Both filtered by selected year
   - Special programs have orange visual theme
   - Regular programs have blue visual theme

4. **Employee Targeting:**
   - Can specify individual employees (comma-separated IDs)
   - Can leave empty to target entire department
   - Useful for increment form failures (specific employees)

### Icons Used
- `AlertCircle` - Special training section header
- `FileText` - Request details section
- `Calendar` - Date information
- `Users` - Requester information
- `MapPin` - Location
- `Clock` - Duration
- `Edit` - Edit button
- `Trash2` - Delete button
- `BookOpen` - Program information
- `CheckCircle` - Confirmation message
- `Save` - Create program button
- `X` - Cancel button

### Color Scheme
- **Special Training**: Orange (`orange-600`, `orange-50`, `orange-200`)
- **Regular Training**: Blue (`blue-600`, `blue-50`, `blue-200`)
- **Increment Form Alert**: Yellow (`yellow-50`, `yellow-200`, `yellow-600`, `yellow-800`)

### Future Enhancements

1. **API Integration:**
   - POST endpoint for creating special training programs
   - GET endpoint with filtering by program type
   - PUT endpoint for editing special programs
   - DELETE endpoint with authorization checks

2. **Notifications:**
   - Email notification to requesting manager when program created
   - Notification to employees when assigned to special training
   - Reminder notifications before training starts

3. **Reporting:**
   - Special training completion rates
   - Increment form training effectiveness
   - Manager request analytics
   - Department-wise special training statistics

4. **Approval Workflow:**
   - Senior management approval for special training budgets
   - Multi-level approval for increment form training
   - Automatic approval for certain request types

5. **Integration with Increment System:**
   - Automatic trigger when increment denied
   - Link to increment form records
   - Track training completion before next increment cycle

6. **Employee Portal:**
   - Employees can view assigned special training
   - Self-enroll in department-wide special programs
   - Track completion status

### Testing Checklist

- [ ] Program type selection (Regular vs Special)
- [ ] Request type selection (all 4 types)
- [ ] Conditional field visibility
- [ ] Increment form special alert display
- [ ] Form validation
- [ ] Special training calendar section rendering
- [ ] Regular training calendar section rendering
- [ ] Event counts accuracy
- [ ] Visual badges and labels
- [ ] Edit functionality
- [ ] Delete confirmation
- [ ] Empty state messages
- [ ] Mobile responsiveness
- [ ] Calendar year filtering
- [ ] Request details display
- [ ] Icon rendering

### Related Files
- `/frontend/src/pages/TrainingManagement.tsx` - Main implementation
- `/frontend/src/components/ui/Modal.tsx` - Modal component with scroll
- `/frontend/src/pages/HRManagerDashboard.tsx` - Parent component with routing

### Documentation References
- `TRAINING_CALENDAR_FEATURE.md` - Annual training calendar feature
- `CALENDAR_FORM_IMPROVEMENTS.md` - Form responsiveness improvements
- `MEDICAL_FEATURE_IMPLEMENTATION.md` - Similar feature pattern
- `IMPLEMENTATION_SUMMARY.md` - Overall system documentation

---

**Implementation Status:** ✅ Complete (UI Implementation)
**API Integration:** ⏳ Pending
**Testing:** ⏳ Pending
**Deployment:** ⏳ Pending
