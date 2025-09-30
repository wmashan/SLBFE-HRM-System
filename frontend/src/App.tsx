import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import UserAccountCreation from './pages/UserAccountCreation';
import LoginPage from './pages/LoginPage';
import HRManagerDashboard from './pages/HRManagerDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminUserManagement from './pages/AdminUserManagement';
import RoleManagement from './pages/admin/RoleManagement';
import BackupRestore from './pages/admin/BackupRestore';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/create-account" element={<UserAccountCreation />} />
          <Route path="/login" element={<LoginPage />} />
          <Route 
            path="/hr-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['hr', 'senior_hr_manager']}>
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
            path="/admin/backup" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <BackupRestore />
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