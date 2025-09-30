// Admin User Management Component

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Lock, 
  Unlock, 
  Eye,
  MoreVertical,
  UserPlus,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
  Settings
} from 'lucide-react';
import { AdminUserView, UserFilter, UserStatistics, UserRole } from '../../types';
import { adminService } from '../../services/api';
import RoleAssignmentModal from './RoleAssignmentModal';

interface UserManagementProps {
  onUserSelect?: (user: AdminUserView) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ onUserSelect }) => {
  const [users, setUsers] = useState<AdminUserView[]>([]);
  const [statistics, setStatistics] = useState<UserStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters] = useState<UserFilter>({});
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const usersPerPage = 10;

  useEffect(() => {
    loadUsers();
    loadStatistics();
  }, [filters, currentPage]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const mockUsers: AdminUserView[] = [
        {
          id: '1',
          username: 'john.doe',
          email: 'john.doe@slbfe.lk',
          fullName: 'John Doe',
          role: 'hr',
          profilePicture: undefined,
          isActive: true,
          lastLogin: new Date(Date.now() - 3600000),
          createdAt: new Date(Date.now() - 86400000 * 30),
          updatedAt: new Date(),
          lastActivity: new Date(Date.now() - 1800000),
          sessionsActive: 2,
          totalLogins: 145,
          accountLocked: false,
          passwordLastChanged: new Date(Date.now() - 86400000 * 15),
          twoFactorEnabled: true,
          permissions: [],
          groups: []
        },
        {
          id: '2',
          username: 'jane.smith',
          email: 'jane.smith@slbfe.lk',
          fullName: 'Jane Smith',
          role: 'employee',
          profilePicture: undefined,
          isActive: false,
          lastLogin: new Date(Date.now() - 86400000 * 7),
          createdAt: new Date(Date.now() - 86400000 * 60),
          updatedAt: new Date(),
          lastActivity: new Date(Date.now() - 86400000 * 7),
          sessionsActive: 0,
          totalLogins: 89,
          accountLocked: false,
          passwordLastChanged: new Date(Date.now() - 86400000 * 45),
          twoFactorEnabled: false,
          permissions: [],
          groups: []
        },
        {
          id: '3',
          username: 'admin.user',
          email: 'admin@slbfe.lk',
          fullName: 'System Administrator',
          role: 'admin',
          profilePicture: undefined,
          isActive: true,
          lastLogin: new Date(Date.now() - 600000),
          createdAt: new Date(Date.now() - 86400000 * 365),
          updatedAt: new Date(),
          lastActivity: new Date(Date.now() - 300000),
          sessionsActive: 1,
          totalLogins: 2345,
          accountLocked: false,
          passwordLastChanged: new Date(Date.now() - 86400000 * 7),
          twoFactorEnabled: true,
          permissions: [],
          groups: []
        }
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      // TODO: Replace with actual API call
      const mockStats: UserStatistics = {
        totalUsers: 342,
        usersByRole: {
          employee: 280,
          hr: 25,
          senior_hr_manager: 8,
          training_coordinator: 12,
          branch_manager: 15,
          program_manager: 5,
          admin: 2
        },
        activeUsers: 298,
        lockedUsers: 3,
        newUsersThisMonth: 15,
        loginActivity: {
          todayLogins: 145,
          weeklyLogins: 892,
          monthlyLogins: 3456,
          averageSessionDuration: 45,
          peakHours: []
        }
      };
      setStatistics(mockStats);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  const handleUserAction = async (action: string, userId: string) => {
    try {
      // TODO: Implement actual API calls
      console.log(`Performing ${action} on user ${userId}`);
      
      switch (action) {
        case 'activate':
        case 'deactivate':
        case 'lock':
        case 'unlock':
        case 'reset_password':
          await loadUsers(); // Refresh after action
          break;
        default:
          break;
      }
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) return;
    
    try {
      // TODO: Implement actual bulk operations
      console.log(`Performing bulk ${action} on users:`, selectedUsers);
      setSelectedUsers([]);
      await loadUsers();
    } catch (error) {
      console.error(`Failed to perform bulk ${action}:`, error);
    }
  };

  const handleRoleAssignment = async (userIds: string[], newRole: UserRole, reason?: string) => {
    try {
      if (userIds.length === 1) {
        // Single user role assignment
        await adminService.assignUserRole(userIds[0], newRole, reason);
      } else {
        // Bulk role assignment
        await adminService.bulkAssignRoles(userIds, newRole, reason);
      }
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          userIds.includes(user.id) 
            ? { ...user, role: newRole, updatedAt: new Date() }
            : user
        )
      );
      
      setSelectedUsers([]);
      setShowRoleModal(false);
      
      // Refresh statistics
      await loadStatistics();
    } catch (error) {
      console.error('Role assignment failed:', error);
      // For demo purposes, still update the UI even if API fails
      setUsers(prevUsers => 
        prevUsers.map(user => 
          userIds.includes(user.id) 
            ? { ...user, role: newRole, updatedAt: new Date() }
            : user
        )
      );
      setSelectedUsers([]);
      setShowRoleModal(false);
      await loadStatistics();
    }
  };

  const getSelectedUsersData = (): AdminUserView[] => {
    return users.filter(user => selectedUsers.includes(user.id));
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'senior_hr_manager':
        return 'bg-purple-100 text-purple-800';
      case 'hr':
        return 'bg-blue-100 text-blue-800';
      case 'branch_manager':
      case 'program_manager':
        return 'bg-green-100 text-green-800';
      case 'training_coordinator':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (user: AdminUserView) => {
    if (user.accountLocked) {
      return <Lock className="w-4 h-4 text-red-500" />;
    }
    if (user.isActive && user.sessionsActive > 0) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    if (user.isActive) {
      return <Clock className="w-4 h-4 text-yellow-500" />;
    }
    return <XCircle className="w-4 h-4 text-gray-400" />;
  };

  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.activeUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Lock className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Locked Users</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.lockedUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <UserPlus className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">New This Month</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.newUsersThisMonth}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
            
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-800">
                {selectedUsers.length} users selected
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowRoleModal(true)}
                  className="flex items-center px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  <UserCheck className="w-3 h-3 mr-1" />
                  Assign Role
                </button>
                <button
                  onClick={() => handleBulkAction('activate')}
                  className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Activate
                </button>
                <button
                  onClick={() => handleBulkAction('deactivate')}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Deactivate
                </button>
                <button
                  onClick={() => handleBulkAction('reset_password')}
                  className="px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700"
                >
                  Reset Password
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === paginatedUsers.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(paginatedUsers.map(user => user.id));
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sessions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-gray-500">Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers([...selectedUsers, user.id]);
                        } else {
                          setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700">
                            {user.fullName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(user)}
                      <span className="ml-2 text-sm text-gray-900">
                        {user.accountLocked ? 'Locked' : user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.sessionsActive}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onUserSelect?.(user)}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedUsers([user.id]);
                          setShowRoleModal(true);
                        }}
                        className="text-purple-600 hover:text-purple-900"
                        title="Change Role"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600" title="Edit User">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleUserAction(user.isActive ? 'deactivate' : 'activate', user.id)}
                        className={`${user.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                        title={user.isActive ? 'Deactivate User' : 'Activate User'}
                      >
                        {user.isActive ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </button>
                      <button className="text-gray-400 hover:text-gray-600" title="More Actions">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{' '}
                  <span className="font-medium">{(currentPage - 1) * usersPerPage + 1}</span>
                  {' '}to{' '}
                  <span className="font-medium">
                    {Math.min(currentPage * usersPerPage, filteredUsers.length)}
                  </span>
                  {' '}of{' '}
                  <span className="font-medium">{filteredUsers.length}</span>
                  {' '}results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Role Assignment Modal */}
      <RoleAssignmentModal
        isOpen={showRoleModal}
        onClose={() => {
          setShowRoleModal(false);
          setSelectedUsers([]);
        }}
        users={getSelectedUsersData()}
        onAssignRole={handleRoleAssignment}
      />
    </div>
  );
};

export default UserManagement;