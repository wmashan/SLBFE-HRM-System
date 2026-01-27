import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  FileText, 
  Bell, 
  Settings, 
  LogOut,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  MapPin,
  ArrowRight,
  AlertTriangle,
  Heart,
  Calendar
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Import employee-specific components
import EmployeeApplications from './employee/EmployeeApplications';
import EmployeeProfile from './employee/EmployeeProfileReadOnly';
import EmployeeNotifications from './employee/EmployeeNotifications';
import MedicalManagement from './employee/MedicalManagement';
import EmployeeLeaveRequest from './employee/EmployeeLeaveRequest';
import EmployeeTransferRequest from './employee/EmployeeTransferRequest';
import TransferNotificationCard from '../components/employee/TransferNotificationCard';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    // Load user information
    const userData = localStorage.getItem('slbfe_user_data');
    if (userData) {
      setUserInfo(JSON.parse(userData));
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/');
    }
  };

  const getDashboardTitle = () => {
    return 'Employee Dashboard';
  };

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Sample employee data
  const employeeData = {
    id: 'EMP001',
    employeeNo: 'E2024001',
    fullName: userInfo.fullName || 'John Doe',
    nameWithInitials: userInfo.nameWithInitials || 'J.D. Doe',
    designation: 'Software Engineer',
    division: 'IT Services',
    branch: 'Colombo Main',
    email: userInfo.email || 'john.doe@slbfe.lk',
    mobile: userInfo.mobile || '077-1234567',
    joinDate: '2024-01-15',
    status: 'Active'
  };

  // Sample application data
  const applications = [
    {
      id: 1,
      type: 'Transfer Request',
      title: 'Branch Transfer Application',
      submittedDate: '2024-09-20',
      status: 'approved',
      description: 'Request to transfer to Kandy branch for personal reasons'
    },
    {
      id: 2,
      type: 'Training Request',
      title: 'Professional Development Course',
      submittedDate: '2024-09-18',
      status: 'rejected',
      description: 'Request to attend React.js advanced training course'
    },
    {
      id: 3,
      type: 'Equipment Request',
      title: 'Laptop Upgrade Request',
      submittedDate: '2024-10-05',
      status: 'pending',
      description: 'Requesting upgrade to new development laptop for performance reasons'
    }
  ];

  // Sample notifications with transfer details
  const notifications = [
    {
      id: 1,
      title: 'Upcoming Transfer - Kandy Branch',
      message: 'Your approved transfer to Kandy Branch is scheduled for November 15, 2024. Please review transfer details and requirements.',
      date: '2024-10-01',
      type: 'warning',
      read: false,
      isTransfer: true,
      transferDetails: {
        fromBranch: 'Colombo Main Branch',
        toBranch: 'Kandy Branch',
        transferDate: '2024-11-15',
        reportingDate: '2024-11-15',
        reportingTime: '09:00 AM',
        newDesignation: 'Senior Software Engineer',
        newDepartment: 'IT Operations',
        newReportingManager: 'Mr. Kumara Wijesekara',
        newAddress: 'No. 45, Peradeniya Road, Kandy 20000',
        contactPerson: 'Ms. Nayani Silva',
        contactNumber: '+94 81 223 4567',
        contactEmail: 'nayani.silva@slbfe.lk',
        requirements: [
          'Complete handover of current projects',
          'Return all company assets to Colombo office',
          'Attend knowledge transfer sessions',
          'Complete online compliance training'
        ],
        documents: [
          'Transfer order copy',
          'New office location map',
          'Accommodation assistance guide',
          'Local contact directory'
        ]
      }
    },
    {
      id: 2,
      title: 'Equipment Request Update',
      message: 'Your request for new development laptop has been received and is under review.',
      date: '2024-10-10',
      type: 'info',
      read: false
    },
    {
      id: 3,
      title: 'Training Opportunity',
      message: 'New training programs available for IT staff.',
      date: '2024-09-25',
      type: 'info',
      read: true
    },
    {
      id: 4,
      title: 'Policy Update',
      message: 'Updated company policies have been published.',
      date: '2024-09-24',
      type: 'warning',
      read: true
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <Bell className="w-5 h-5 text-yellow-500" />;
      case 'info':
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
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
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">SLBFE HRM</h1>
                  <p className="text-sm text-gray-600">{getDashboardTitle()}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <div className="relative">
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>

              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{userInfo.fullName}</p>
                  <p className="text-xs text-gray-500">Employee</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r min-h-screen">
          <nav className="p-4">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'dashboard' 
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <User className="w-5 h-5 mr-3" />
                Dashboard
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
                My Applications
                <span className="ml-auto bg-yellow-100 text-yellow-600 text-xs px-2 py-0.5 rounded-full">
                  {applications.filter(app => app.status === 'pending').length}
                </span>
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
                Medical
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
                Leave Requests
              </button>
              
              <button
                onClick={() => setActiveTab('transfer')}
                className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'transfer' 
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <MapPin className="w-5 h-5 mr-3" />
                Transfer Requests
              </button>
              
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'profile' 
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Settings className="w-5 h-5 mr-3" />
                Profile
              </button>
              
              <button
                onClick={() => setActiveTab('notifications')}
                className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                  activeTab === 'notifications' 
                    ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Bell className="w-5 h-5 mr-3" />
                Notifications
                <span className="ml-auto bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                  {notifications.filter(notif => !notif.read).length}
                </span>
              </button>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Dashboard Overview */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Welcome Section */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">Welcome back, {employeeData.fullName}!</h2>
                <p className="text-blue-100">Employee ID: {employeeData.employeeNo} | {employeeData.designation}</p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Applications</p>
                      <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {applications.filter(app => app.status === 'pending').length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Approved</p>
                      <p className="text-2xl font-bold text-green-600">
                        {applications.filter(app => app.status === 'approved').length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Notifications</p>
                      <p className="text-2xl font-bold text-red-600">
                        {notifications.filter(notif => !notif.read).length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <Bell className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Transfer Notifications */}
              {notifications.filter(notif => notif.isTransfer && !notif.read).map((transferNotif) => (
                <TransferNotificationCard 
                  key={transferNotif.id} 
                  notification={transferNotif} 
                />
              ))}

              {/* Recent Applications */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
                    <button
                      onClick={() => setActiveTab('applications')}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View All
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  {applications.length > 0 ? (
                    <div className="space-y-4">
                      {applications.slice(0, 3).map((application) => (
                        <div key={application.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{application.title}</h4>
                              {getStatusBadge(application.status)}
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{application.type}</p>
                            <p className="text-xs text-gray-500">Submitted: {application.submittedDate}</p>
                          </div>
                          <button className="ml-4 p-2 text-gray-400 hover:text-gray-600">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No applications submitted yet</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Notifications */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Notifications</h3>
                    <button
                      onClick={() => setActiveTab('notifications')}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View All
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  {notifications.length > 0 ? (
                    <div className="space-y-4">
                      {notifications.slice(0, 3).map((notification) => (
                        <div key={notification.id} className={`flex items-start space-x-3 p-4 rounded-lg ${
                          notification.read ? 'bg-gray-50' : 'bg-blue-50'
                        }`}>
                          {getNotificationIcon(notification.type)}
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{notification.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-2">{notification.date}</p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No notifications</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <EmployeeApplications applications={applications} />
          )}

          {/* Medical Management Tab */}
          {activeTab === 'medical' && (
            <MedicalManagement />
          )}

          {/* Leave Requests Tab */}
          {activeTab === 'leave' && (
            <EmployeeLeaveRequest />
          )}

          {/* Transfer Requests Tab */}
          {activeTab === 'transfer' && (
            <EmployeeTransferRequest />
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <EmployeeProfile />
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <EmployeeNotifications notifications={notifications} />
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;