# Annual Training Calendar Feature

## Overview
The Annual Training Calendar feature allows HR Managers to create, view, modify, and manage all training events throughout the year in a comprehensive calendar interface.

## Features Implemented

### 1. **Annual Calendar Tab**
- New dedicated tab in Training Management section
- Accessible from HR Manager Dashboard → Training → Annual Calendar

### 2. **Calendar Views**
- **List View** (Fully Functional): Detailed list of all training events with complete information
- **Month View** (Placeholder): Visual monthly calendar grid (ready for implementation)
- **Week View** (Placeholder): Visual weekly calendar view (ready for implementation)

### 3. **Calendar Event Management**

#### Create New Events
- Click "Add Event" button to open event creation modal
- Comprehensive form including:
  - Program Name
  - Category (Management, Technical, Marketing, Soft Skills, Compliance, Safety)
  - Instructor name
  - Start and End dates
  - Start and End times
  - Location (physical or online)
  - Capacity
  - Cost
  - Color tag for visual identification
  - Target Audience
  - Prerequisites
  - Learning Objectives (comma-separated)
  - Training Materials (comma-separated)
  - Additional Notes

#### Edit Existing Events
- Click edit icon on any event
- Pre-populated form with existing event data
- Update any field and save changes

#### Delete Events
- Click delete icon on any event
- Confirmation dialog to prevent accidental deletion
- Removes event from calendar

### 4. **Event Details Display**

Each event in List View shows:
- **Header**: Program name, category badge, color indicator
- **Schedule Information**:
  - Duration (start to end date)
  - Daily time (start to end time)
  - Instructor name
  - Location
- **Capacity Management**:
  - Current enrollment vs total capacity
  - Visual progress bar
  - Cost information
  - Target audience
- **Learning Information**:
  - Complete list of learning objectives
  - Prerequisites
  - Required materials
- **Special Notes**: Highlighted section for important information

### 5. **Filtering & Navigation**
- **Year Selection**: Dropdown to select year (2024, 2025, 2026)
- **Month Selection**: Dropdown to filter by specific month
- **View Toggle**: Switch between Month, Week, and List views
- **Search & Filter**: (Can be extended from existing search functionality)

### 6. **Quick Statistics**
Dashboard for selected year showing:
- Total events scheduled
- Total capacity across all events
- Total enrolled participants
- Total budget allocation

### 7. **Sample Training Events**
Pre-populated with 5 sample events:
1. **Leadership Development Program** (3 months, Management)
2. **Digital Marketing Fundamentals** (6 weeks, Marketing)
3. **Advanced Excel for Business** (4 weeks, Technical)
4. **Effective Communication Skills** (3 days, Soft Skills)
5. **Project Management Essentials** (2 months, Management)

## Technical Implementation

### Data Structure
```typescript
interface CalendarEvent {
  id: string;
  programId: string;
  programName: string;
  category: string;
  instructor: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  capacity: number;
  enrolled: number;
  cost: number;
  objectives: string[];
  prerequisites: string;
  targetAudience: string;
  materials: string[];
  notes: string;
  color: string;
}
```

### State Management
- `calendarEvents`: Array of all training events
- `selectedEvent`: Currently selected event for editing
- `calendarView`: Current view mode (month/week/list)
- `selectedMonth`: Selected month for filtering
- `selectedYear`: Selected year for filtering
- `isCalendarEventModalOpen`: Modal visibility state

### Key Functions
- Event filtering by year
- Event sorting by start date
- Event creation/editing through modal
- Event deletion with confirmation
- Dynamic statistics calculation

## User Workflow

### Creating a Training Event
1. Navigate to Training Management → Annual Calendar
2. Click "Add Event" button
3. Fill in all required fields (marked with *)
4. Optionally add objectives, materials, and notes
5. Click "Create Event" to save

### Modifying an Event
1. Locate the event in List View
2. Click the edit (pencil) icon
3. Update desired fields
4. Click "Update Event" to save changes

### Viewing Calendar
1. Select desired year from dropdown
2. Select desired month (optional)
3. Choose preferred view (List recommended for detailed view)
4. Scroll through events to see all details

### Planning Annual Training
1. View quick statistics to see total capacity and budget
2. Review all scheduled events in List View
3. Identify gaps in training schedule
4. Add new events to fill gaps
5. Export calendar (button available, functionality pending)

## Color Coding
Events are color-coded for easy visual identification:
- Blue (#3B82F6): Default/Management
- Green (#10B981): Marketing
- Purple (#8B5CF6): Technical
- Orange (#F59E0B): Soft Skills
- Red (#EF4444): Project Management

## Future Enhancements (Ready for Implementation)

1. **Visual Calendar Grid**
   - Month view with drag-and-drop
   - Week view with time slots
   - Event popover on hover

2. **Advanced Filtering**
   - Filter by category
   - Filter by instructor
   - Filter by location
   - Filter by enrollment status

3. **Bulk Operations**
   - Import events from CSV/Excel
   - Export calendar to various formats
   - Duplicate events
   - Bulk delete

4. **Notifications**
   - Automatic reminders for upcoming events
   - Notification when capacity is reached
   - Alert for conflicting schedules

5. **Integration**
   - Link to enrollment system
   - Sync with employee schedules
   - Integration with email system
   - Calendar export (iCal, Google Calendar)

6. **Reporting**
   - Training calendar report
   - Utilization rates
   - Budget tracking
   - Historical analysis

7. **Validation**
   - Prevent date conflicts
   - Instructor availability check
   - Room/location booking
   - Budget limit warnings

## API Integration Points (Ready for Backend)

### Endpoints Needed
- `GET /api/training/calendar/events?year={year}` - Get all events
- `POST /api/training/calendar/events` - Create new event
- `PUT /api/training/calendar/events/{id}` - Update event
- `DELETE /api/training/calendar/events/{id}` - Delete event
- `GET /api/training/calendar/stats?year={year}` - Get statistics

### Form Submission
Currently shows alert placeholder. Ready to connect to:
```typescript
const handleSaveEvent = async (eventData) => {
  if (selectedEvent) {
    await api.put(`/training/calendar/events/${selectedEvent.id}`, eventData);
  } else {
    await api.post('/training/calendar/events', eventData);
  }
};
```

## Benefits for HR Manager

1. **Centralized Planning**: All training events in one place
2. **Complete Information**: Every detail accessible from calendar
3. **Easy Modification**: Quick edit capability for schedule changes
4. **Budget Tracking**: See total training budget at a glance
5. **Capacity Management**: Monitor enrollment vs capacity
6. **Professional Planning**: Present comprehensive annual training plan
7. **Resource Allocation**: Optimize instructor and facility usage
8. **Compliance**: Ensure all mandatory training is scheduled

## Files Modified

- `/frontend/src/pages/TrainingManagement.tsx` - Added calendar feature (1,391 lines total)
  - Added CalendarEvent interface
  - Added calendar state management
  - Added Annual Calendar tab
  - Added calendar views (List, Month, Week)
  - Added event creation/edit modal
  - Added event deletion functionality
  - Added statistics dashboard

## Dependencies

All existing dependencies, no new packages required:
- `lucide-react` - Icons (Calendar, CalendarDays, Clock, etc.)
- React hooks - useState, useMemo
- Existing Button, Input, Modal components

## Status

✅ **Fully Functional** - List View
⏳ **Placeholder** - Month/Week Visual Views
🔄 **Ready for API Integration**
📋 **Ready for Enhancement**

---

**Created**: October 11, 2025
**Feature**: Annual Training Calendar
**Module**: Training Management
**User Role**: HR Manager
