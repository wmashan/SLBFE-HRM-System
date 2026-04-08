import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import UserAccountCreation from './pages/UserAccountCreation';
import LoginPage from './pages/LoginPage';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOTP from './pages/VerifyOTP';
import ResetPassword from './pages/ResetPassword';
import HRManagerDashboard from './pages/HRManagerDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminUserManagement from './pages/AdminUserManagement';
import RoleManagement from './pages/admin/RoleManagement';
import BackupRestore from './pages/admin/BackupRestore';
import SystemDocumentManagement from './pages/admin/SystemDocumentManagement';
import TaskAssignment from './pages/admin/TaskAssignment';
import TrainingFeedbackForm from './pages/TrainingFeedbackForm';
import ApplicationReview from './pages/dashboard/ApplicationReview';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/create-account" element={<UserAccountCreation />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Public Training Feedback Form - No authentication required */}
          <Route path="/training-feedback/:programId" element={<TrainingFeedbackForm />} />
          
          <Route 
            path="/hr-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['hr']}>
                <HRManagerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employee-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['employee']}>
                <EmployeeDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUserManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/roles" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <RoleManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/task-assignment" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <TaskAssignment />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/backup" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <BackupRestore />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/documents" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <SystemDocumentManagement />
              </ProtectedRoute>
            } 
          />
          {/* Application Review Route */}
          <Route 
            path="/applications/:employeeId/review" 
            element={
              <ProtectedRoute allowedRoles={['admin', 'hr', 'senior_hr_manager']}>
                <ApplicationReview />
              </ProtectedRoute>
            } 
          />
          {/* Default dashboard route for backward compatibility */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <HRManagerDashboard />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;