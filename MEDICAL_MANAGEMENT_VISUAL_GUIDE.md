# Medical Claims Management - Visual Flow Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    HR Manager Dashboard                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Sidebar Navigation                                       │  │
│  │  • Overview                                               │  │
│  │  • Applications                                           │  │
│  │  • Employees                                              │  │
│  │  • Staff Leave                                            │  │
│  │  ► Medical Claims  ← NEW                                 │  │
│  │  • Transfer                                               │  │
│  │  • Salary Management                                      │  │
│  │  • Retirement Management                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Medical Claims Workflow

```
┌──────────────────────────────────────────────────────────────────────┐
│                        EMPLOYEE SUBMITS CLAIM                        │
│                    (Online Form HR/F/07 Filled)                      │
└────────────────────────────────┬─────────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────────┐
│                     STATUS: PENDING DOCUMENTS                        │
│  Employee downloads HR/F/07 & HR/F/08                                │
│  Fills HR/F/08 at hospital                                           │
│  Submits physical documents to HR Division                           │
└────────────────────────────────┬─────────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────────┐
│              HR MANAGER: MARK DOCUMENTS RECEIVED                     │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │ ✓ Click "Mark Documents Received"                          │     │
│  │ ✓ System sends notification to employee:                   │     │
│  │   "Your documents have been received and are under review" │     │
│  └────────────────────────────────────────────────────────────┘     │
└────────────────────────────────┬─────────────────────────────────────┘
                                 │
                                 ▼
┌──────────────────────────────────────────────────────────────────────┐
│                   STATUS: DOCUMENTS RECEIVED                         │
│                   (Ready for HR Manager Review)                      │
└────────────────────────────────┬─────────────────────────────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 │                               │
                 ▼                               ▼
┌─────────────────────────────┐   ┌─────────────────────────────────┐
│      APPROVE CLAIM          │   │       REJECT CLAIM              │
│  ┌───────────────────────┐  │   │  ┌───────────────────────────┐  │
│  │ • Enter approved amt  │  │   │  │ • Enter rejection reason  │  │
│  │ • Add comments        │  │   │  │ • Provide clear details   │  │
│  │ • Click Approve       │  │   │  │ • Click Reject            │  │
│  └───────────────────────┘  │   │  └───────────────────────────┘  │
└──────────┬──────────────────┘   └──────────┬──────────────────────┘
           │                                  │
           ▼                                  ▼
┌──────────────────────────┐      ┌──────────────────────────────┐
│  EMPLOYEE NOTIFICATION   │      │   EMPLOYEE NOTIFICATION      │
│  ✓ Claim Approved        │      │   ✗ Claim Rejected           │
│  ✓ Amount: LKR X,XXX.XX  │      │   ✗ Reason: [detailed text]  │
│  ✓ Forwarded to Finance  │      │                              │
└──────────┬───────────────┘      └──────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────────────┐
│              FORWARDED TO SENIOR FINANCE OFFICER                 │
│                   (For Payment Processing)                       │
└──────────────────────────────────────────────────────────────────┘
```

## User Interface Components

### Main Dashboard View
```
┌─────────────────────────────────────────────────────────────────────┐
│ Medical Claims Management                         [Export Report]  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────┐│
│  │ Pending Docs │  │   Documents  │  │   Approved   │  │ Rejected││
│  │      12      │  │   Received   │  │      45      │  │    3    ││
│  │              │  │      8       │  │              │  │         ││
│  └──────────────┘  └──────────────┘  └──────────────┘  └─────────┘│
│                                                                     │
│  ┌─────────────────────────────────────────────────┐  [Filter]    │
│  │ 🔍 Search by request, employee name, number...  │              │
│  └─────────────────────────────────────────────────┘              │
│                                                                     │
│  [All] [Pending] [Documents Received] [Under Review] [Approved]   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ 💙 Outpatient Treatment          [Pending - Awaiting Docs]  │  │
│  │    Request #: MED20251001                                    │  │
│  │    👤 John Doe (E2024001)                                    │  │
│  │    📅 Sep 25, 2025  |  💰 LKR 15,000.00                      │  │
│  │    🏥 Asiri Central Hospital - Dengue Fever                  │  │
│  │    [View Details]  [Mark Documents Received]                 │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ 💙 Prescription                [Documents Received]          │  │
│  │    Request #: MED20251002                                    │  │
│  │    👤 Sarah Wilson (E2024012)                                │  │
│  │    📅 Aug 15, 2025  |  💰 LKR 8,500.00                       │  │
│  │    🏥 Durdans Hospital - Hypertension                        │  │
│  │    [View Details]  [Approve]  [Reject]                       │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### View Details Modal
```
┌──────────────────────────────────────────────────────────────┐
│ Medical Request Details                              [X]     │
│ Request #: MED20251001                                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ ⚠️ Current Status: Pending - Awaiting Documents             │
│                                                              │
│ ┌──────────────────────────────────────────────────────┐    │
│ │ 👤 EMPLOYEE INFORMATION                               │    │
│ │ • Employee Number: E2024001                           │    │
│ │ • Full Name: John Doe                                 │    │
│ │ • Department: IT Department                           │    │
│ │ • Division: Information Technology                    │    │
│ └──────────────────────────────────────────────────────┘    │
│                                                              │
│ ┌──────────────────────────────────────────────────────┐    │
│ │ 👨‍⚕️ PATIENT INFORMATION                               │    │
│ │ • Patient Name: Jane Doe                              │    │
│ │ • Relationship: Spouse                                │    │
│ │ • Age: 32 years                                       │    │
│ └──────────────────────────────────────────────────────┘    │
│                                                              │
│ ┌──────────────────────────────────────────────────────┐    │
│ │ 🏥 MEDICAL TREATMENT DETAILS                          │    │
│ │ • Hospital: Asiri Central Hospital                    │    │
│ │ • Doctor: Dr. Silva                                   │    │
│ │ • Treatment Date: Sep 25, 2025                        │    │
│ │ • Duration: 3 days                                    │    │
│ │ • Diagnosis: Dengue Fever                             │    │
│ │ • Description: Emergency outpatient treatment...      │    │
│ └──────────────────────────────────────────────────────┘    │
│                                                              │
│ ┌──────────────────────────────────────────────────────┐    │
│ │ 💰 FINANCIAL DETAILS                                  │    │
│ │ Requested: LKR 15,000.00                              │    │
│ │ Claimed: LKR 15,000.00                                │    │
│ │ Available: LKR 35,000.00                              │    │
│ └──────────────────────────────────────────────────────┘    │
│                                                              │
│ ┌──────────────────────────────────────────────────────┐    │
│ │ 📎 ATTACHMENTS                                        │    │
│ │ [📄 medical-bill-sep-2024.pdf] [⬇]                   │    │
│ │ [📄 lab-report.pdf] [⬇]                              │    │
│ └──────────────────────────────────────────────────────┘    │
│                                                              │
│                        [Close]                               │
└──────────────────────────────────────────────────────────────┘
```

### Approve Modal
```
┌─────────────────────────────────────────────────────┐
│ Approve Medical Request                      [X]    │
├─────────────────────────────────────────────────────┤
│                                                     │
│ 📋 REQUEST SUMMARY                                  │
│ Request: MED20251002                                │
│ Employee: Sarah Wilson                              │
│ Claimed: LKR 8,500.00                              │
│                                                     │
│ 💰 Approved Amount (LKR) *                         │
│ ┌───────────────────────────────────────────┐      │
│ │ 8500.00                                   │      │
│ └───────────────────────────────────────────┘      │
│ Maximum claimable: LKR 8,500.00                    │
│                                                     │
│ 📝 Review Comments                                 │
│ ┌───────────────────────────────────────────┐      │
│ │ Approved as per medical policy.           │      │
│ │ All documents verified.                   │      │
│ │                                           │      │
│ └───────────────────────────────────────────┘      │
│                                                     │
│ ℹ️ NEXT STEP                                       │
│ After approval, this request will be forwarded     │
│ to the Senior Finance Officer for payment          │
│ processing. Employee will be notified via email.   │
│                                                     │
│ [Cancel]              [✓ Approve & Forward]        │
└─────────────────────────────────────────────────────┘
```

### Reject Modal
```
┌─────────────────────────────────────────────────────┐
│ Reject Medical Request                       [X]    │
├─────────────────────────────────────────────────────┤
│                                                     │
│ 📋 REQUEST SUMMARY                                  │
│ Request: MED20251003                                │
│ Employee: Mike Johnson                              │
│ Claimed: LKR 12,000.00                             │
│                                                     │
│ 📝 Rejection Reason *                              │
│ ┌───────────────────────────────────────────┐      │
│ │ Treatment does not fall under covered     │      │
│ │ medical expenses as per HR policy         │      │
│ │ section 4.2. Dental cosmetic procedures   │      │
│ │ are excluded from medical allowance.      │      │
│ └───────────────────────────────────────────┘      │
│                                                     │
│ ⚠️ EMPLOYEE NOTIFICATION                           │
│ The employee will be notified via email about      │
│ the rejection with the reason you provide above.   │
│                                                     │
│ [Cancel]              [✗ Reject Request]           │
└─────────────────────────────────────────────────────┘
```

## Status Badge Colors

```
┌────────────────────────────────────────┐
│ Pending Documents    [  Yellow  ]     │
│ Documents Received   [  Blue    ]     │
│ Under Review         [  Purple  ]     │
│ Approved            [  Green   ]     │
│ Rejected            [  Red     ]     │
└────────────────────────────────────────┘
```

## Action Buttons by Status

```
STATUS: Pending
Actions: [View Details] [Mark Documents Received]

STATUS: Documents Received  
Actions: [View Details] [Approve] [Reject]

STATUS: Approved
Actions: [View Details]

STATUS: Rejected
Actions: [View Details]
```

## Notification Flow

```
┌───────────────────────────────────────────────────────────┐
│              NOTIFICATION TRIGGERS                         │
├───────────────────────────────────────────────────────────┤
│                                                           │
│ 1. DOCUMENTS RECEIVED                                     │
│    ├─ Trigger: HR clicks "Mark Documents Received"       │
│    ├─ To: Employee                                        │
│    └─ Message: "Your medical claim documents have been   │
│                 received and are under review"            │
│                                                           │
│ 2. CLAIM APPROVED                                         │
│    ├─ Trigger: HR clicks "Approve & Forward"             │
│    ├─ To: Employee                                        │
│    └─ Message: "Your medical claim has been approved     │
│                 for LKR X,XXX.XX and forwarded to         │
│                 Finance Officer for payment"              │
│                                                           │
│ 3. CLAIM REJECTED                                         │
│    ├─ Trigger: HR clicks "Reject Request"                │
│    ├─ To: Employee                                        │
│    └─ Message: "Your medical claim has been rejected.    │
│                 Reason: [detailed reason]"                │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

## Data Structure

```typescript
interface MedicalRequest {
  // Basic Info
  id: number;
  requestNumber: string;
  status: 'Pending' | 'DocumentsReceived' | 'UnderReview' | 
          'Approved' | 'Rejected' | 'ForwardedToOfficer';
  
  // Employee Info
  employeeNumber: string;
  employeeName: string;
  department: string;
  division: string;
  
  // Patient Info
  patientName: string;
  relationshipToApplicant: string;
  patientAge: number;
  
  // Medical Details
  hospitalName: string;
  doctorName: string;
  treatmentDate: string;
  diagnosis: string;
  description: string;
  
  // Financial
  requestedAmount: number;
  claimedAmount: number;
  availableAmount: number;
  approvedAmount?: number;
  
  // Status Tracking
  documentsReceived: boolean;
  documentsReceivedDate?: string;
  reviewedBy?: string;
  reviewedDate?: string;
  reviewComments?: string;
  rejectionReason?: string;
  forwardedTo?: string;
  forwardedDate?: string;
  
  // Attachments
  attachments: string[];
}
```

## Security & Access Control

```
┌────────────────────────────────────────────┐
│         ROLE-BASED ACCESS                  │
├────────────────────────────────────────────┤
│                                            │
│ HR Manager                                 │
│ ✓ View all medical claims                 │
│ ✓ Mark documents received                 │
│ ✓ Approve/Reject claims                   │
│ ✓ Send notifications                      │
│ ✓ View employee medical balance           │
│ ✓ Export reports                          │
│ ✓ Advanced analytics                      │
│ ✓ Policy configuration                    │
│                                            │
│ Employee                                   │
│ ✓ Submit claim requests                   │
│ ✓ View own claims only                    │
│ ✓ Download forms                          │
│ ✓ Receive notifications                   │
│                                            │
└────────────────────────────────────────────┘
```

## Performance Considerations

```
┌─────────────────────────────────────────┐
│      OPTIMIZATION STRATEGIES            │
├─────────────────────────────────────────┤
│                                         │
│ • Pagination for large lists           │
│ • Lazy loading of attachments          │
│ • Cached employee data                 │
│ • Indexed database queries             │
│ • Compressed file downloads            │
│ • Real-time updates via WebSocket      │
│                                         │
└─────────────────────────────────────────┘
```
