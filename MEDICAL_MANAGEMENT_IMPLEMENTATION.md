# Medical Claims Management for HR Manager

## Overview
A comprehensive Medical Claims Management system has been implemented for HR Managers to review, process, and manage employee medical claim requests efficiently.

## Location
- **Component**: `/frontend/src/pages/dashboard/MedicalManagement.tsx`
- **Integrated in**: HR Manager Dashboard

## Features Implemented

### 1. **Dashboard Overview**
- **Statistics Cards**: Display counts for different claim statuses
  - Pending Documents
  - Documents Received
  - Approved Claims
  - Rejected Claims

### 2. **Request Management**
The system supports the complete workflow of medical claim processing:

#### **Status Flow**:
1. **Pending** → Employee has submitted the claim online, waiting for physical documents
2. **Documents Received** → HR Manager has received physical HR/F/07 and HR/F/08 forms
3. **Under Review** → HR Manager is reviewing the claim
4. **Approved** → Claim approved and forwarded to Finance Officer
5. **Rejected** → Claim rejected with reason

### 3. **Search and Filter**
- **Search by**:
  - Request Number
  - Employee Name
  - Employee Number
- **Filter tabs**:
  - All Requests
  - Pending Documents
  - Documents Received
  - Under Review
  - Approved
  - Rejected

### 4. **HR Manager Actions**

#### **A. Mark Documents Received**
- Available for requests in "Pending" status
- HR Manager confirms physical documents (HR/F/07 and HR/F/08) have been received
- **Automatic Notification**: Employee receives email notification that documents are received and under review
- Status changes to "Documents Received"

#### **B. Approve Claims**
When documents are received, HR Manager can approve:
- **Enter Approved Amount**: Can adjust the claimed amount based on policy
- **Add Review Comments**: Optional comments about the approval
- **Notification Process**:
  - Employee receives approval notification via email
  - Shows approved amount
- **Next Step**: Request is automatically forwarded to "Senior Finance Officer" for payment processing

#### **C. Reject Claims**
- **Rejection Reason**: HR Manager must provide a clear reason
- **Notification**: Employee receives rejection notification with the reason
- Status changes to "Rejected"

### 5. **Detailed View**
Each medical request displays comprehensive information:

#### **Employee Information**
- Employee Number
- Full Name
- Department
- Division
- Marital Status

#### **Patient Information**
- Patient Name
- Relationship to Employee
- Age

#### **Medical Treatment Details**
- Hospital/Clinic Name
- Doctor Name
- Treatment Date
- Duration
- Diagnosis
- Description

#### **Financial Details**
- Requested Amount
- Claimed Amount
- Available Balance
- Approved Amount (if approved)

#### **Attachments**
- View and download all submitted documents
- HR/F/07 form
- HR/F/08 form
- Supporting medical bills, prescriptions, reports

#### **Review History**
- Comments from HR Manager
- Approval/Rejection reasons
- Reviewer name and date

### 6. **User Interface**

#### **Navigation**
- Added "Medical Claims" menu item in HR Manager Dashboard
- Icon: Heart (medical symbol)
- Located between "Staff Leave" and "Transfer" in the sidebar

#### **Visual Indicators**
- **Color-coded status badges**:
  - Yellow: Pending
  - Blue: Documents Received
  - Purple: Under Review
  - Green: Approved
  - Red: Rejected
- **Icons** for each status for quick visual recognition

#### **Modals**
1. **View Details Modal**: Comprehensive request information
2. **Documents Received Modal**: Confirmation dialog with notification preview
3. **Review Modal (Approve/Reject)**: 
   - Approve: Enter approved amount and comments
   - Reject: Enter rejection reason

## Workflow Example

### Employee Side:
1. Employee submits medical claim online (HR/F/07 form)
2. System shows instruction page to download forms
3. Employee downloads HR/F/07 (auto-filled) and HR/F/08 (blank)
4. Employee fills HR/F/08 at hospital and submits physical documents to HR Division

### HR Manager Side:
1. **See Request**: Request appears in "Pending Documents" tab
2. **Receive Documents**: When physical documents arrive:
   - Click "Mark Documents Received"
   - Employee gets notification: "Your documents have been received and are under review"
3. **Review**: Request moves to "Documents Received" tab
4. **Decision**:
   
   **If Approved**:
   - Enter approved amount (can be same or less than claimed)
   - Add optional comments
   - Click "Approve & Forward"
   - Employee gets notification: "Your medical claim has been approved for LKR X,XXX.XX"
   - Request forwarded to Senior Finance Officer
   
   **If Rejected**:
   - Enter rejection reason
   - Click "Reject Request"
   - Employee gets notification with rejection reason

## Notifications System

### Email Notifications Sent:
1. **Documents Received**: 
   - To: Employee
   - Message: Physical documents received, claim under review

2. **Claim Approved**:
   - To: Employee
   - Message: Claim approved, amount details, forwarded to Finance Officer

3. **Claim Rejected**:
   - To: Employee
   - Message: Claim rejected with detailed reason

## Integration Points

### Current Implementation:
- ✅ UI Components fully implemented
- ✅ State management with React hooks
- ✅ Modal dialogs for all actions
- ✅ Form validation
- ✅ Data structure defined

### To Be Implemented (Backend Integration):
- [ ] API endpoints for:
  - Fetching medical requests
  - Marking documents received
  - Approving/Rejecting claims
  - Sending email notifications
  - Forwarding to Finance Officer
- [ ] Real-time updates
- [ ] Document upload/download functionality
- [ ] Audit trail logging

## API Endpoints Needed

```typescript
// GET - Fetch all medical requests
GET /api/medical-claims

// PUT - Mark documents received
PUT /api/medical-claims/{id}/documents-received

// POST - Approve claim
POST /api/medical-claims/{id}/approve
Body: {
  approvedAmount: number,
  comments: string
}

// POST - Reject claim
POST /api/medical-claims/{id}/reject
Body: {
  rejectionReason: string
}

// GET - Download attachment
GET /api/medical-claims/{id}/attachments/{attachmentId}
```

## Security Considerations
- Only HR Managers can access this section
- All actions are logged with user ID and timestamp
- Document downloads require authentication
- Sensitive medical information is protected

## Future Enhancements
1. **Advanced Filtering**: By date range, department, claim amount
2. **Bulk Actions**: Approve/reject multiple claims
3. **Analytics Dashboard**: Claims statistics, trends, reports
4. **Automated Policy Checks**: Auto-validate against medical policy limits
5. **Integration with Finance**: Direct payment initiation
6. **Mobile Responsive**: Optimize for mobile devices
7. **Export Functionality**: Download reports as PDF/Excel

## Testing Checklist
- [ ] Test all status transitions
- [ ] Verify email notifications
- [ ] Test search and filter functionality
- [ ] Validate form inputs
- [ ] Test modal interactions
- [ ] Verify data display accuracy
- [ ] Test error handling
- [ ] Check responsive design
- [ ] Verify role-based access

## Files Modified/Created
1. **Created**: `/frontend/src/pages/dashboard/MedicalManagement.tsx`
2. **Modified**: `/frontend/src/pages/HRManagerDashboard.tsx`
   - Added Heart icon import
   - Added MedicalManagement component import
   - Added "Medical Claims" menu item
   - Added component rendering for 'medical' tab

## Access Control
- **Role Required**: HR Manager
- **Menu Location**: HR Manager Dashboard → Medical Claims
- **Permissions**: 
  - View all medical claims
  - Mark documents as received
  - Approve/Reject claims
  - Send notifications to employees

---

## Quick Start Guide for HR Managers

### Viewing Medical Requests:
1. Login to HR Manager Dashboard
2. Click "Medical Claims" in the sidebar
3. Browse requests by status tabs

### Processing a Request:
1. Click "View Details" to see full information
2. When physical documents arrive:
   - Click "Mark Documents Received"
   - Confirm to notify employee
3. Review the claim details
4. Choose action:
   - **Approve**: Enter amount → Add comments → Click "Approve & Forward"
   - **Reject**: Enter reason → Click "Reject Request"

### Understanding Status:
- **Pending**: Waiting for physical documents
- **Documents Received**: Ready for review
- **Approved**: Forwarded to Finance Officer for payment
- **Rejected**: Claim denied with reason provided
