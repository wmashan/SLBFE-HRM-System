import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  UserPlus, 
  FileText, 
  Calendar, 
  Settings, 
  LogOut,
  Bell,
  TrendingUp,
  RotateCcw,
  DollarSign,
  UserMinus,
  CreditCard,
  BarChart3,
  Heart
} from 'lucide-react';

// Import dashboard page components
import Overview from './dashboard/Overview';
import Applications from './Applications';
import MedicalManagement from './dashboard/MedicalManagement';
import Employees from './dashboard/Employees';
import StaffLeave from './StaffLeave';
import Transfer from './Transfer';
import Recruitment from './dashboard/Recruitment';
import Schedule from './dashboard/Schedule';
import SettingsPage from './dashboard/Settings';
import SalaryManagement from './SalaryManagement';
import RetirementManagement from './RetirementManagement';
import StaffLoanManagement from './StaffLoanManagement';
import Reports from './Reports';

const HRManagerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [userInfo, setUserInfo] = useState({
    fullName: 'HR Manager',
    role: 'hr',
    initials: 'HM'
  });

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('slbfe_user_data');
    if (userData) {
      const user = JSON.parse(userData);
      setUserInfo({
        fullName: user.fullName || 'HR Manager',
        role: user.role,
        initials: user.role === 'senior_hr_manager' ? 'SHR' : 'HM'
      });
    }
  }, []);

  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('userRole');
    localStorage.removeItem('slbfe_auth_token');
    localStorage.removeItem('slbfe_user_data');
    navigate('/');
  };

  // Get display text based on role
  const getDashboardTitle = () => {
    return userInfo.role === 'senior_hr_manager' ? 'Senior HR Manager Dashboard' : 'HR Manager Dashboard';
  };

  const getUserRoleDisplay = () => {
    return userInfo.role === 'senior_hr_manager' ? 'Senior HR Manager' : 'HR Manager';
  };

  // Sample data for badge display
  const dashboardStats = {
    newApplications: 23
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">SLBFE HRM</h1>
                  <p className="text-sm text-gray-600">{getDashboardTitle()}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600 hover:text-gray-900 cursor-pointer" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  userInfo.role === 'senior_hr_manager' ? 'bg-purple-100' : 'bg-blue-100'
                }`}>
                  <span className={`font-medium text-sm ${
                    userInfo.role === 'senior_hr_manager' ? 'text-purple-600' : 'text-blue-600'
                  }`}>{userInfo.initials}</span>
                </div>
                <span className="text-sm font-medium text-gray-700">{getUserRoleDisplay()}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-600 px-3 py-2 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm h-screen sticky top-0">
          <nav className="mt-6 px-3">
            <div className="space-y-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'overview' 
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <TrendingUp className="w-5 h-5 mr-3" />
                Overview
              </button>
              
              <button
                onClick={() => setActiveTab('applications')}
                className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'applications' 
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FileText className="w-5 h-5 mr-3" />
                Applications
                <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                  {dashboardStats.newApplications}
                </span>
              </button>
              
              <button
                onClick={() => setActiveTab('employees')}
                className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'employees' 
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Users className="w-5 h-5 mr-3" />
                Employees
              </button>
              
              <button
                onClick={() => setActiveTab('leave')}
                className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'leave' 
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Calendar className="w-5 h-5 mr-3" />
                Staff Leave
              </button>
              
              <button
                onClick={() => setActiveTab('medical')}
                className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'medical' 
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Heart className="w-5 h-5 mr-3" />
                Medical Claims
              </button>
              
              <button
                onClick={() => setActiveTab('transfer')}
                className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'transfer' 
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <RotateCcw className="w-5 h-5 mr-3" />
                Transfer
              </button>
              
              <button
                onClick={() => setActiveTab('salary')}
                className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'salary' 
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <DollarSign className="w-5 h-5 mr-3" />
                Salary Management
              </button>
              
              <button
                onClick={() => setActiveTab('retirement')}
                className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'retirement' 
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <UserMinus className="w-5 h-5 mr-3" />
                Retirement Management
              </button>
              
              <button
                onClick={() => setActiveTab('loans')}
                className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'loans' 
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <CreditCard className="w-5 h-5 mr-3" />
                Staff Loan Management
              </button>

              {/* Advanced Reports - Senior HR Manager Only */}
              {userInfo.role === 'senior_hr_manager' && (
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                    activeTab === 'reports' 
                      ? 'bg-indigo-100 text-indigo-700 border-r-2 border-indigo-700' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <BarChart3 className="w-5 h-5 mr-3" />
                  Advanced Reports
                  <span className="ml-auto bg-indigo-100 text-indigo-600 text-xs px-2 py-0.5 rounded-full">
                    SHR
                  </span>
                </button>
              )}
              
              <button
                onClick={() => setActiveTab('recruitment')}
                className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'recruitment' 
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <UserPlus className="w-5 h-5 mr-3" />
                Recruitment
              </button>
              
              <button
                onClick={() => setActiveTab('schedule')}
                className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'schedule' 
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Calendar className="w-5 h-5 mr-3" />
                Schedule
              </button>
              
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'settings' 
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </button>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Render active tab content */}
          {activeTab === 'overview' && <Overview />}
          {activeTab === 'applications' && <Applications />}
          {activeTab === 'employees' && <Employees />}
          {activeTab === 'leave' && <StaffLeave />}
          {activeTab === 'medical' && <MedicalManagement />}
          {activeTab === 'transfer' && <Transfer />}
          {activeTab === 'salary' && <SalaryManagement />}
          {activeTab === 'retirement' && <RetirementManagement />}
          {activeTab === 'loans' && <StaffLoanManagement />}
          {activeTab === 'reports' && userInfo.role === 'senior_hr_manager' && <Reports />}
          {activeTab === 'recruitment' && <Recruitment />}
          {activeTab === 'schedule' && <Schedule />}
          {activeTab === 'settings' && <SettingsPage />}
        </div>
      </div>
    </div>
  );
};

export default HRManagerDashboard;