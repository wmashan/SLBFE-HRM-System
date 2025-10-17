import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  FileText, 
  Settings, 
  LogOut,
  Bell,
  TrendingUp,
  RotateCcw,
  DollarSign,
  UserMinus,
  Heart,
  GraduationCap,
  UserCheck
} from 'lucide-react';
import { HRFeature } from '../types';

// Import dashboard page components
import Overview from './dashboard/Overview';
import Applications from './Applications';
import MedicalManagement from './dashboard/MedicalManagement';
import Employees from './dashboard/Employees';
import Transfer from './Transfer';
import SettingsPage from './dashboard/Settings';
import SalaryManagement from './SalaryManagement';
import RetirementManagement from './RetirementManagement';
import TrainingManagement from './TrainingManagement';

const HRManagerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [userInfo, setUserInfo] = useState({
    fullName: 'HR Manager',
    role: 'hr',
    initials: 'HM'
  });
  const [userPermissions, setUserPermissions] = useState<HRFeature[]>([]);

  // Define navigation items with their corresponding features
  const navigationItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: TrendingUp,
      feature: 'overview' as HRFeature,
      alwaysVisible: true // Overview is always visible
    },
    {
      id: 'employees',
      label: 'Employees',
      icon: Users,
      feature: 'employees' as HRFeature
    },
    {
      id: 'medical',
      label: 'Medical Claims',
      icon: Heart,
      feature: 'medical_claims' as HRFeature
    },
    {
      id: 'transfer',
      label: 'Transfer',
      icon: RotateCcw,
      feature: 'transfer' as HRFeature
    },
    {
      id: 'retirement',
      label: 'Retirement Management',
      icon: UserMinus,
      feature: 'retirement' as HRFeature
    },
    {
      id: 'applications',
      label: 'Applications',
      icon: FileText,
      feature: 'recruitment' as HRFeature
    },
    {
      id: 'salary',
      label: 'Salary Management',
      icon: DollarSign,
      feature: 'payroll' as HRFeature
    },
    {
      id: 'training',
      label: 'Training',
      icon: GraduationCap,
      feature: 'training' as HRFeature
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      feature: 'settings' as HRFeature,
      alwaysVisible: true // Settings is always visible
    }
  ];

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {      
      // Get user data from localStorage
      const userData = localStorage.getItem('slbfe_user_data');
      if (userData) {
        const user = JSON.parse(userData);
        setUserInfo({
          fullName: user.fullName || 'HR Manager',
          role: user.role,
          initials: user.fullName ? user.fullName.split(' ').map((n: string) => n[0]).join('') : 'HM'
        });

        // TODO: Replace with actual API call to get user permissions
        // For now, simulate different user permissions based on stored data
        const mockPermissions = getUserPermissions(user.id || user.email);
        setUserPermissions(mockPermissions);
        
        // Set default active tab to first visible tab
        const visibleTabs = navigationItems.filter(item => 
          item.alwaysVisible || mockPermissions.includes(item.feature)
        );
        if (visibleTabs.length > 0) {
          setActiveTab(visibleTabs[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
      // Default permissions if loading fails
      setUserPermissions(['overview', 'settings']);
    }
  };

  // Mock function to simulate different user permissions
  // In a real app, this would come from the task assignment API
  const getUserPermissions = (userId: string): HRFeature[] => {
    // Simulate different HR officers with different permissions
    const userPermissionMap: Record<string, HRFeature[]> = {
      'medical@slbfe.com': ['overview', 'medical_claims', 'documents', 'settings'],
      'transfer@slbfe.com': ['overview', 'transfer', 'settings'],
      'retirement@slbfe.com': ['overview', 'retirement', 'settings'],
      'recruitment@slbfe.com': ['overview', 'employees', 'recruitment', 'settings'],
      'training@slbfe.com': ['overview', 'training', 'settings'],
      'payroll@slbfe.com': ['overview', 'payroll', 'settings'],
    };

    // Default to general HR permissions if user not found
    return userPermissionMap[userId] || [
      'overview', 'employees', 'medical_claims', 'transfer', 'retirement', 
      'recruitment', 'training', 'payroll', 'documents', 'settings'
    ];
  };

  const hasPermission = (feature: HRFeature): boolean => {
    return userPermissions.includes(feature);
  };

  const getVisibleNavigationItems = () => {
    return navigationItems.filter(item => 
      item.alwaysVisible || hasPermission(item.feature)
    );
  };

  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('userRole');
    localStorage.removeItem('slbfe_auth_token');
    localStorage.removeItem('slbfe_user_data');
    navigate('/');
  };

  // Get display text based on role
  const getDashboardTitle = () => {
    return 'HR Manager Dashboard';
  };

  const getUserRoleDisplay = () => {
    return 'HR Manager';
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
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100">
                  <span className="font-medium text-sm text-blue-600">{userInfo.initials}</span>
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
              {getVisibleNavigationItems().map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                      activeTab === item.id 
                        ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 mr-3" />
                    {item.label}
                    {item.id === 'applications' && (
                      <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                        {dashboardStats.newApplications}
                      </span>
                    )}
                  </button>
                );
              })}
              
              {/* Show message if user has limited permissions */}
              {getVisibleNavigationItems().length <= 2 && (
                <div className="mt-6 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-600 text-center">
                    Your access is limited to specific features based on your assigned tasks.
                  </p>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Render active tab content based on permissions */}
          {activeTab === 'overview' && <Overview />}
          {activeTab === 'applications' && hasPermission('recruitment') && <Applications />}
          {activeTab === 'employees' && hasPermission('employees') && <Employees />}
          {activeTab === 'medical' && hasPermission('medical_claims') && <MedicalManagement />}
          {activeTab === 'transfer' && hasPermission('transfer') && <Transfer />}
          {activeTab === 'salary' && hasPermission('payroll') && <SalaryManagement />}
          {activeTab === 'retirement' && hasPermission('retirement') && <RetirementManagement />}
          {activeTab === 'training' && hasPermission('training') && <TrainingManagement />}
          {activeTab === 'settings' && <SettingsPage />}
          
          {/* Show access denied message if user tries to access unauthorized content */}
          {(
            (activeTab === 'applications' && !hasPermission('recruitment')) ||
            (activeTab === 'employees' && !hasPermission('employees')) ||
            (activeTab === 'medical' && !hasPermission('medical_claims')) ||
            (activeTab === 'transfer' && !hasPermission('transfer')) ||
            (activeTab === 'salary' && !hasPermission('payroll')) ||
            (activeTab === 'retirement' && !hasPermission('retirement')) ||
            (activeTab === 'training' && !hasPermission('training'))
          ) && (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <UserCheck className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Access Denied</h3>
                <p className="text-red-600 mb-4">
                  You don't have permission to access this feature. Please contact your administrator 
                  if you believe you should have access to this section.
                </p>
                <button
                  onClick={() => setActiveTab('overview')}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Return to Overview
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HRManagerDashboard;