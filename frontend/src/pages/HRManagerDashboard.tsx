import { useState } from 'react';
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
  RotateCcw
} from 'lucide-react';

// Import dashboard page components
import Overview from './dashboard/Overview';
import Applications from './Applications';
import Employees from './dashboard/Employees';
import StaffLeave from './StaffLeave';
import Transfer from './Transfer';
import Recruitment from './dashboard/Recruitment';
import Schedule from './dashboard/Schedule';
import SettingsPage from './dashboard/Settings';

const HRManagerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('userRole');
    navigate('/');
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
                  <p className="text-sm text-gray-600">HR Manager Dashboard</p>
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
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-sm">HM</span>
                </div>
                <span className="text-sm font-medium text-gray-700">HR Manager</span>
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
          {activeTab === 'transfer' && <Transfer />}
          {activeTab === 'recruitment' && <Recruitment />}
          {activeTab === 'schedule' && <Schedule />}
          {activeTab === 'settings' && <SettingsPage />}
        </div>
      </div>
    </div>
  );
};

export default HRManagerDashboard;