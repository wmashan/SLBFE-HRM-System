# Application Review Quick Start Guide

## Quick Test Instructions

### Step 1: Create a Test Application
1. Navigate to `/create-account`
2. Fill out the employee registration form
3. Complete all required fields
4. Submit the application
5. **Save the generated credentials** (Username and Password)
6. Note the Employee ID (e.g., EMP0001)

### Step 2: Log in as HR Manager
1. Navigate to `/login`
2. Log in with HR Manager credentials
3. You should land on the HR Dashboard

### Step 3: View Pending Applications
1. Click on the **Applications** tab in the sidebar
2. You should see:
   - Statistics cards (Total, Pending, Approved, Rejected)
   - A table listing all pending applications
   - The test application you just created

### Step 4: Review the Application
1. Find your test application in the list
2. Click the **Review** button
3. You'll be taken to the ApplicationReview page showing:
   - Employee profile with avatar
   - Personal information (NIC, passport, gender, etc.)
   - Address information
   - Employment details

### Step 5: Approve or Reject
1. (Optional) Add review comments in the textarea
2. Click either:
   - **Approve Application** (green button) - Sets status to "Active"
   - **Reject Application** (red button) - Sets status to "Rejected"
3. Confirm your action in the modal popup
4. You'll be redirected back to the HR dashboard

### Step 6: Verify Status Change
1. Go back to the Applications tab
2. The statistics should update
3. Filter by status to see:
   - **Pending** - New unreviewed applications
   - **Active** - Approved applications
   - **Rejected** - Denied applications

### Step 7: Test Login (If Approved)
1. Log out from HR Manager account
2. Try logging in with the employee credentials from Step 1
3. **If Approved:** Login should succeed
4. **If Rejected:** Login should fail with appropriate error

## API Endpoints Reference

### Get Pending Applications
```bash
GET /api/Employee/pending-applications
Authorization: Bearer <token>
```

### Get Employee Details
```bash
GET /api/Employee/{employeeId}
Authorization: Bearer <token>
```

### Review Application
```bash
POST /api/Employee/{employeeId}/review
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Approved",  // or "Rejected"
  "reviewComments": "Optional comments here"
}
```

## Testing with Postman

### 1. Login as HR Manager
```json
POST /api/Auth/login
Content-Type: application/json

{
  "email": "hr@example.com",
  "password": "your_password"
}
```
**Save the token from response**

### 2. Get Pending Applications
```json
GET /api/Employee/pending-applications
Authorization: Bearer <your_token>
```

### 3. Review Application
```json
POST /api/Employee/EMP0001/review
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "status": "Approved",
  "reviewComments": "All documents verified"
}
```

## Troubleshooting

### Issue: Applications not showing in dashboard
**Check:**
1. User status in database is "Pending"
2. Employee has associated User record
3. HR Manager has correct role permissions
4. Backend API is running
5. Check browser console for API errors

### Issue: Review button not working
**Check:**
1. ApplicationReview route is correctly configured in App.tsx
2. ProtectedRoute allows the user's role
3. Employee ID is valid
4. Network tab shows successful navigation

### Issue: Approve/Reject not working
**Check:**
1. Backend endpoint is accessible
2. Request body format is correct
3. User has authorization token
4. Check backend logs for errors
5. Verify User.Status is "Pending" before review

### Issue: Cannot log in after approval
**Check:**
1. User.Status is "Active" in database
2. Password hash is correct
3. RoleID is assigned
4. JWT authentication is working
5. Check auth service logs

## Database Verification Queries

### Check User Status
```sql
SELECT u.UserId, u.EmployeeId, u.Status, e.FullName, e.Email
FROM Users u
JOIN Employees e ON u.EmployeeId = e.EmployeeId
WHERE u.Status = 'Pending';
```

### Check Approved Users
```sql
SELECT u.UserId, u.EmployeeId, u.Status, e.FullName, e.Email
FROM Users u
JOIN Employees e ON u.EmployeeId = e.EmployeeId
WHERE u.Status = 'Active';
```

### Check Rejected Users
```sql
SELECT u.UserId, u.EmployeeId, u.Status, e.FullName, e.Email
FROM Users u
JOIN Employees e ON u.EmployeeId = e.EmployeeId
WHERE u.Status = 'Rejected';
```

### Update Status Manually (if needed)
```sql
UPDATE Users
SET Status = 'Active'  -- or 'Pending' or 'Rejected'
WHERE EmployeeId = 'EMP0001';
```

## Expected Status Flow

```
Employee Submits Application
        ↓
Status = "Pending"
        ↓
HR Manager Reviews
        ↓
    ┌───────┴───────┐
    ↓               ↓
Approve          Reject
    ↓               ↓
Status =        Status =
"Active"       "Rejected"
    ↓               ↓
Can Login    Cannot Login
```

## Feature Checklist

✅ Employee can create account
✅ Credentials are generated and shown
✅ Application appears in HR dashboard
✅ Statistics display correctly
✅ Search functionality works
✅ Filter by status works
✅ Review page shows complete details
✅ Approve button activates account
✅ Reject button denies account
✅ Confirmation modal prevents accidents
✅ Navigation flows correctly
✅ Authorization enforced
✅ Approved users can log in
✅ Rejected users cannot log in

## Common Test Scenarios

### Scenario 1: Happy Path
1. Employee submits → Status = Pending
2. HR reviews → Approves
3. Status = Active
4. Employee logs in successfully

### Scenario 2: Rejection Path
1. Employee submits → Status = Pending
2. HR reviews → Rejects with comment
3. Status = Rejected
4. Employee cannot log in

### Scenario 3: Multiple Applications
1. Create 5 test applications
2. Approve 2, Reject 2, Leave 1 Pending
3. Verify statistics:
   - Total: 5
   - Pending: 1
   - Approved: 2
   - Rejected: 2
4. Test filters for each status

### Scenario 4: Search Functionality
1. Create applications with different names
2. Search by name → Should filter correctly
3. Search by email → Should filter correctly
4. Search by employee ID → Should filter correctly

## Success Criteria

✅ All applications load dynamically from database
✅ No hardcoded data in Applications page
✅ Single approve/reject action (not section-wise)
✅ Status stored in Users table
✅ Proper authorization on all endpoints
✅ User-friendly confirmation before actions
✅ Clear feedback after approval/rejection
✅ Seamless navigation flow
✅ Responsive and modern UI
✅ Error handling for edge cases

## Next Steps After Testing

1. Test with real SLBFE data
2. Verify email notifications (if implemented)
3. Performance test with 100+ applications
4. Security audit of endpoints
5. User acceptance testing with HR staff
6. Deploy to staging environment
7. Create user training materials
