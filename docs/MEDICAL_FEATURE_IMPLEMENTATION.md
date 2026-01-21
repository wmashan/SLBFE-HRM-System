# Medical Reimbursement Feature - Implementation Guide

## Overview
This document describes the implementation of the Medical Reimbursement feature for the SLBFE HRM System. This feature allows employees to apply for medical reimbursements, view their medical balance, and track the status of their medical requests.

## Features Implemented

### Employee Features
1. **View Medical Balance**
   - Annual medical allowance (LKR 50,000)
   - Total claimed amount
   - Total approved amount
   - Total paid amount
   - Pending amount
   - Remaining balance
   - Request statistics (pending, approved, rejected)

2. **Apply for Medical Reimbursement**
   - Select medical request type (Hospitalization, Outpatient, Prescription, Surgery, Dental, Optical, Laboratory, Imaging, Other)
   - Enter treatment date and medical provider
   - Provide diagnosis and detailed description
   - Specify claimed amount
   - Upload supporting documents (medical bills, prescriptions, reports)

3. **View Medical Request History**
   - All previous medical requests with detailed information
   - Request status (Pending, Under Review, Approved, Rejected, Paid)
   - Approval/rejection comments
   - Payment information

### Admin/HR Features
1. **Review Medical Requests**
   - View all medical requests from employees
   - Approve or reject requests
   - Adjust approved amount if needed
   - Add comments for employees

2. **Process Payments**
   - Mark approved requests as paid
   - Record payment reference and date

3. **View Statistics**
   - Total requests and amounts
   - Breakdown by request type
   - Year-wise analysis

## Backend Implementation

### 1. Entities

**MedicalRequest Entity** (`Core/Entities/MedicalRequest.cs`)
```csharp
- Id: int
- EmployeeId: int
- RequestNumber: string (unique, auto-generated)
- RequestType: MedicalRequestType enum
- TreatmentDate: DateTime
- MedicalProvider: string
- Diagnosis: string
- Description: string
- ClaimedAmount: decimal
- ApprovedAmount: decimal?
- Status: MedicalRequestStatus enum
- Attachments: string (comma-separated file paths)
- SubmittedDate: DateTime
- ApprovedBy: int?
- ReviewedDate: DateTime?
- ApproverComments: string?
- PaymentDate: DateTime?
- PaymentReference: string?
- RejectionReason: string?
```

### 2. Enums

**MedicalRequestStatus** (`Core/Enums/Enums.cs`)
- Pending
- UnderReview
- Approved
- Rejected
- Paid

**MedicalRequestType** (`Core/Enums/Enums.cs`)
- Hospitalization
- OutpatientTreatment
- Prescription
- Surgery
- DentalTreatment
- OpticalTreatment
- Laboratory
- Imaging
- Other

### 3. DTOs

**Request DTOs** (`Application/DTOs/Request/MedicalRequestDtos.cs`)
- `CreateMedicalRequestDto`: For creating new medical requests
- `UpdateMedicalRequestStatusDto`: For approving/rejecting requests
- `MarkAsPaidDto`: For marking requests as paid
- `MedicalRequestFilterDto`: For filtering and searching requests

**Response DTOs** (`Application/DTOs/Response/MedicalResponseDtos.cs`)
- `MedicalRequestDto`: Medical request data
- `MedicalBalanceDto`: Medical balance summary
- `MedicalStatisticsDto`: Statistics for admin dashboard

### 4. Repository

**IMedicalRepository** (`Core/Interfaces/IMedicalRepository.cs`)
- CRUD operations for medical requests
- Query methods with filters
- Balance calculation methods
- Request number generation

**MedicalRepository** (`Infrastructure/Repositories/MedicalRepository.cs`)
- Implementation of IMedicalRepository
- Entity Framework Core integration

### 5. Service Layer

**IMedicalService** (`Application/Services/Interfaces/IMedicalService.cs`)
- Business logic interface

**MedicalService** (`Application/Services/Implementation/MedicalService.cs`)
- Medical request validation
- Balance checking before creating requests
- Status update logic
- Statistics calculation

### 6. Controller

**MedicalController** (`Presentation/Controllers/MedicalController.cs`)

**Endpoints:**
- `GET /api/medical/{id}` - Get medical request by ID
- `GET /api/medical/request/{requestNumber}` - Get by request number
- `GET /api/medical/employee/{employeeId}` - Get all requests for employee
- `GET /api/medical/employee/{employeeId}/balance` - Get medical balance
- `POST /api/medical/search` - Search with filters
- `POST /api/medical/employee/{employeeId}` - Create new request
- `PUT /api/medical/{id}/status` - Update request status
- `PUT /api/medical/{id}/paid` - Mark as paid
- `DELETE /api/medical/{id}` - Delete request
- `GET /api/medical/statistics` - Get statistics

### 7. Database Configuration

**ApplicationDbContext** (`Infrastructure/Data/Context/ApplicationDbContext.cs`)
- MedicalRequests DbSet added
- Entity configuration with proper indexes and constraints
- Decimal precision for amounts (18, 2)
- Unique index on RequestNumber

## Frontend Implementation

### 1. Component Structure

**MedicalManagement Component** (`frontend/src/pages/employee/MedicalManagement.tsx`)

**Features:**
- Two main tabs: Overview and Request History
- Medical balance dashboard with visual progress bars
- Request submission modal
- Detailed request history view
- Status indicators with color coding
- Document attachment support

**UI Elements:**
- Balance summary cards showing:
  - Annual allowance
  - Total claimed
  - Approved amount
  - Remaining balance
- Request statistics cards
- Detailed balance breakdown table
- Progress bar showing utilization
- Recent requests table
- Full history with expandable details

### 2. Integration

**EmployeeDashboard** (`frontend/src/pages/EmployeeDashboard.tsx`)
- Added "Medical" tab to sidebar navigation
- Imported and rendered MedicalManagement component
- Added Heart icon for visual identification

## Configuration

### Medical Allowance
The annual medical allowance is currently set to **LKR 50,000** per employee. This is configured in:
- `MedicalService.cs`: `ANNUAL_MEDICAL_ALLOWANCE = 50000.00m`

To change this amount, update the constant in the service class.

## Business Rules

1. **Balance Validation**: Claimed amount cannot exceed remaining balance
2. **Request Number**: Auto-generated in format: MED{YEAR}{MONTH}{SEQUENCE}
   - Example: MED20241001, MED20241002, etc.
3. **Approval**: Only HR Manager or Admin can approve/reject requests
4. **Payment**: Only approved requests can be marked as paid
5. **Documents**: Supporting documents are required for all medical requests
6. **Timeframe**: Claims should be submitted within 30 days of treatment
7. **Pre-approval**: Treatments exceeding LKR 25,000 require pre-approval

## Data Validation

### Frontend Validation
- Required fields validation
- Date validation (treatment date cannot be in future)
- Amount validation (must be positive, within limits)
- File type validation (PDF, JPG, PNG, DOC, DOCX)
- File size validation (10MB per file)

### Backend Validation
- Model validation using Data Annotations
- Business rule validation in service layer
- Balance checking before request creation
- Status transition validation

## Next Steps

### To Complete the Implementation:

1. **Database Migration**
   ```bash
   cd backend/SLBFE.HRM.API
   dotnet ef migrations add AddMedicalRequestsTable
   dotnet ef database update
   ```

2. **Register Services in Program.cs**
   ```csharp
   builder.Services.AddScoped<IMedicalRepository, MedicalRepository>();
   builder.Services.AddScoped<IMedicalService, MedicalService>();
   ```

3. **API Integration in Frontend**
   - Create API service methods in `frontend/src/services/api.ts`
   - Replace sample data with actual API calls
   - Implement file upload functionality
   - Add error handling and loading states

4. **Authentication & Authorization**
   - Add authentication middleware to controller
   - Implement role-based access control
   - Secure endpoints for HR/Admin only actions

5. **File Upload**
   - Implement file upload endpoint
   - Configure file storage (local or cloud)
   - Add file download functionality

6. **Notifications**
   - Send email notifications on status changes
   - Add in-app notifications
   - SMS notifications for important updates

7. **Reporting**
   - Generate medical expense reports
   - Export functionality (PDF, Excel)
   - Year-end summaries

## Testing Recommendations

1. **Unit Tests**
   - Service layer business logic
   - Repository methods
   - Validation logic

2. **Integration Tests**
   - API endpoints
   - Database operations
   - File upload/download

3. **UI Tests**
   - Component rendering
   - Form validation
   - User interactions

## Security Considerations

1. **Data Access**: Employees should only access their own medical requests
2. **File Security**: Uploaded documents should be scanned for viruses
3. **HIPAA Compliance**: Medical data should be encrypted and access logged
4. **Audit Trail**: Track all changes to medical requests
5. **Role-Based Access**: Implement proper authorization checks

## Performance Optimization

1. **Indexing**: Add indexes on frequently queried columns (EmployeeId, Status, SubmittedDate)
2. **Pagination**: Implement pagination for request lists
3. **Caching**: Cache balance calculations and statistics
4. **Lazy Loading**: Load attachments on demand

## Maintenance

### Regular Tasks
- Archive old medical requests (older than 7 years)
- Clean up orphaned attachment files
- Review and update medical allowance annually
- Monitor usage patterns and adjust policies

### Monitoring
- Track request processing times
- Monitor approval rates
- Alert on unusual patterns (high rejection rates, large claims)

## Support Documentation

### For Employees
- How to apply for medical reimbursement
- Required documents checklist
- Policy guidelines and limits
- FAQs

### For HR/Admins
- Approval workflow guide
- Payment processing steps
- Reporting and analytics guide
- Troubleshooting guide

---

**Implementation Date**: October 5, 2024  
**Version**: 1.0  
**Author**: Development Team
