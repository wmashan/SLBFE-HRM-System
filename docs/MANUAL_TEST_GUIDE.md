# Quick Test Guide - Application Review Feature

## Prerequisites
1. Backend API running on configured port
2. Frontend dev server running  
3. Database with Users table Status column

## Step-by-Step Test

### 1️⃣ Create Test Application (2 minutes)

**Navigate to:** `http://localhost:5173/create-account`

**Fill and submit:**
- Personal details (Full name, NIC, DOB, etc.)
- Contact information (Email, Phone)
- Address details
- Employment information

**Expected Result:**
✅ Success page displays generated username/password
✅ Application saved with Status = "Pending" in Users table

**Save these credentials for later testing!**

---

### 2️⃣ Login as HR Manager (30 seconds)

**Navigate to:** `http://localhost:5173/login`

**Use HR credentials:**
- Email: `[your_hr_email]`
- Password: `[your_hr_password]`

**Expected Result:**
✅ Redirected to HR Dashboard

---

### 3️⃣ View Applications List (1 minute)

**Action:** Click **"Applications"** tab in sidebar

**Verify:**
- ✅ Statistics cards show counts (Total, Pending, Approved, Rejected)
- ✅ Your test application appears in the table
- ✅ Application shows "Pending" status badge (yellow)
- ✅ Application date matches submission time
- ✅ Search box and filter dropdown present
- ✅ "Review" button visible on each row

**Test Search:**
- Type employee name → List filters correctly
- Type email → List filters correctly  
- Clear search → Full list returns

**Test Filter:**
- Select "Pending" → Shows only pending
- Select "All Status" → Shows all

---

### 4️⃣ Review Application (2 minutes)

**Action:** Click **"Review"** button on test application

**Expected Result:**
✅ Navigated to `/applications/[employeeId]/review`

**Verify Page Displays:**
- ✅ Back button (returns to applications)
- ✅ Employee profile section with avatar placeholder
- ✅ Personal Information (NIC, passport, gender, DOB)
- ✅ Address Information (permanent & current)
- ✅ Employment Details (designation, division, employee type)
- ✅ Review Comments textarea (optional)
- ✅ Three buttons: Cancel (gray), Reject (red), Approve (green)

---

### 5️⃣ Test Approval Flow (2 minutes)

**Test Approve:**
1. (Optional) Add comment: "Documents verified"
2. Click **"Approve Application"** (green button)
3. Confirmation modal appears
4. Click **"Confirm"**

**Expected Result:**
✅ Loading indicator during submission
✅ Success message displayed
✅ Redirected to HR Dashboard
✅ In Applications tab, status now shows "Active" (green badge)
✅ Statistics updated (Pending -1, Approved +1)

**Verify in Database:**
```sql
SELECT Status FROM Users WHERE EmployeeId = '[your_test_employee_id]'
-- Should return: Active
```

---

### 6️⃣ Test Employee Login (1 minute)

**Action:** Logout from HR account

**Navigate to:** `http://localhost:5173/login`

**Use saved employee credentials from Step 1**

**Expected Result:**
✅ Login succeeds!
✅ Redirected to Employee Dashboard
✅ Employee can access their features

---

### 7️⃣ Test Rejection Flow (3 minutes)

**Create another test application** (Step 1)

**Login as HR again** (Step 2)

**Navigate to Applications** → Click **Review** on new application

**Test Reject:**
1. Add comment: "Incomplete documentation"
2. Click **"Reject Application"** (red button)
3. Confirmation modal appears
4. Click **"Confirm"**

**Expected Result:**
✅ Success message displayed
✅ Redirected to HR Dashboard
✅ Status shows "Rejected" (red badge)
✅ Statistics updated (Pending -1, Rejected +1)

**Try to login with rejected employee credentials:**
❌ Login should fail
❌ Error message: "Invalid credentials" or "Account not active"

---

### 8️⃣ Test Edge Cases (2 minutes)

**Test Cancel Button:**
- Open review page
- Click "Cancel"
- ✅ Returns to HR Dashboard without changes

**Test Back Button:**
- Open review page
- Click "Back to Applications"
- ✅ Returns to applications list

**Test Loading State:**
- Open applications tab
- Check for loading spinner while data loads
- ✅ Shows "Loading applications..."

**Test Empty State:**
- Filter for a status with no records
- ✅ Shows "No applications found" message

**Test Search No Results:**
- Search for non-existent name
- ✅ Shows "No applications found"

---

## API Testing with Postman/Curl

### Get Pending Applications
```bash
curl -X GET "http://localhost:5000/api/Employee/pending-applications" \
  -H "Authorization: Bearer YOUR_HR_TOKEN"
```

**Expected:** JSON array of pending applications

### Review Application (Approve)
```bash
curl -X POST "http://localhost:5000/api/Employee/EMP0001/review" \
  -H "Authorization: Bearer YOUR_HR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Approved",
    "reviewComments": "All documents verified"
  }'
```

**Expected:** `{ "success": true, "message": "..." }`

### Review Application (Reject)
```bash
curl -X POST "http://localhost:5000/api/Employee/EMP0002/review" \
  -H "Authorization: Bearer YOUR_HR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Rejected",
    "reviewComments": "Incomplete documentation"
  }'
```

---

## Success Criteria Checklist

### Functional Requirements
- [x] Employee can submit application
- [x] Application appears with "Pending" status
- [x] HR can view applications list dynamically
- [x] Statistics display correctly
- [x] Search functionality works
- [x] Filter by status works
- [x] HR can review complete application details
- [x] Single approve/reject action (not section-wise)
- [x] Confirmation modal prevents accidents
- [x] Approve sets Status to "Active"
- [x] Reject sets Status to "Rejected"
- [x] Approved users can login
- [x] Rejected users cannot login
- [x] Review comments are optional

### UI/UX Requirements
- [x] Loading states display properly
- [x] Empty states show helpful messages
- [x] Status badges are color-coded (yellow/green/red)
- [x] Navigation is intuitive
- [x] Buttons have clear labels and colors
- [x] Responsive design works on mobile

### Security Requirements
- [x] Endpoints require authentication
- [x] Role-based access control enforced
- [x] Only admin/hr/senior_hr_manager can access

---

## Known Issues to Check

1. **Date-fns dependency** - If date formatting fails, install:
   ```bash
   cd frontend && npm install date-fns
   ```

2. **CORS errors** - Ensure backend allows frontend origin

3. **Token expiration** - Re-login if 401 errors occur

4. **Database connection** - Verify connection string

---

## Troubleshooting

### Applications not loading?
- Check browser console for API errors
- Verify backend is running: `http://localhost:5000/api/Employee/pending-applications`
- Check authentication token in localStorage

### Review not working?
- Verify employeeId in URL is correct
- Check that User.Status is "Pending" in database
- Review backend logs for errors

### Login fails after approval?
- Verify User.Status = "Active" in database
- Check PasswordHash exists
- Verify RoleID is assigned

---

## Database Queries for Verification

### Check all application statuses:
```sql
SELECT 
    e.EmployeeId,
    e.FullName,
    e.Email,
    u.Status,
    e.CreatedAt
FROM Employees e
INNER JOIN Users u ON e.EmployeeId = u.EmployeeId
ORDER BY e.CreatedAt DESC;
```

### Count by status:
```sql
SELECT 
    u.Status,
    COUNT(*) as Count
FROM Users u
GROUP BY u.Status;
```

### Reset application status (for testing):
```sql
UPDATE Users 
SET Status = 'Pending' 
WHERE EmployeeId = 'EMP0001';
```

---

## Test Report Template

**Test Date:** _______________  
**Tester:** _______________  
**Environment:** Dev / Staging / Production

| Test Case | Status | Notes |
|-----------|--------|-------|
| Create application | ⬜ Pass / ⬜ Fail | |
| View applications list | ⬜ Pass / ⬜ Fail | |
| Search applications | ⬜ Pass / ⬜ Fail | |
| Filter by status | ⬜ Pass / ⬜ Fail | |
| Review application | ⬜ Pass / ⬜ Fail | |
| Approve application | ⬜ Pass / ⬜ Fail | |
| Reject application | ⬜ Pass / ⬜ Fail | |
| Approved user login | ⬜ Pass / ⬜ Fail | |
| Rejected user login | ⬜ Pass / ⬜ Fail | |
| Statistics accuracy | ⬜ Pass / ⬜ Fail | |

**Issues Found:**

**Screenshots Attached:** Y / N

---

## Demo Script (5 minutes)

> **Scenario:** HR Manager reviewing new employee application

1. **[Demo]** Show new employee application submitted
2. **[Navigate]** HR Manager logs in → Applications tab
3. **[Show]** Pending application in list with statistics
4. **[Action]** Click Review button
5. **[Show]** Complete employee profile displayed
6. **[Action]** Add comment: "Verified all documents"
7. **[Action]** Click Approve → Confirm
8. **[Show]** Status changes to Active
9. **[Demo]** Employee can now login successfully

---

**Total Test Time:** ~15 minutes for complete workflow
**Recommended Test Frequency:** On every deployment
**Test Environment:** Dev, Staging before Production
