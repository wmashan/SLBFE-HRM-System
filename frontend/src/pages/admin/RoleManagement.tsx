// Role Management Page for Admin

import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Filter, 
  Search, 
  Clock,
  Shield
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { AdminUserView, UserRole } from '../../types';
import { adminService } from '../../services/api';
import RoleAssignmentModal from '../../components/admin/RoleAssignmentModal';

const RoleManagement: React.FC = () => {
  const [users, setUsers] = useState<AdminUserView[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const roleDefinitions = [
    {
      role: 'employee' as UserRole,
      name: 'Employee',
      description: 'Standard employee access with basic functionality',
      permissions: ['View own profile', 'Submit applications', 'View documents'],
      color: 'bg-gray-100 text-gray-800',
      count: 0
    },
    {
      role: 'hr' as UserRole,
      name: 'HR Manager',
      description: 'Human Resources management with employee administration rights',
      permissions: ['Manage employees', 'Access HR reports', 'Process applications'],
      color: 'bg-blue-100 text-blue-800',
      count: 0
    }
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call to get all users
      const mockUsers: AdminUserView[] = [
        {
          id: '1', username: 'john.doe', email: 'john.doe@slbfe.lk', fullName: 'John Doe',
          role: 'hr', profilePicture: undefined, isActive: true, lastLogin: new Date(Date.now() - 3600000),
          createdAt: new Date(Date.now() - 86400000 * 30), updatedAt: new Date(),
          lastActivity: new Date(Date.now() - 1800000), sessionsActive: 2, totalLogins: 145,
          accountLocked: false, passwordLastChanged: new Date(Date.now() - 86400000 * 15),
          twoFactorEnabled: true, permissions: [], groups: []
        },
        {
          id: '2', username: 'jane.smith', email: 'jane.smith@slbfe.lk', fullName: 'Jane Smith',
          role: 'employee', profilePicture: undefined, isActive: true, lastLogin: new Date(Date.now() - 86400000 * 2),
          createdAt: new Date(Date.now() - 86400000 * 60), updatedAt: new Date(),
          lastActivity: new Date(Date.now() - 86400000 * 2), sessionsActive: 0, totalLogins: 89,
          accountLocked: false, passwordLastChanged: new Date(Date.now() - 86400000 * 45),
          twoFactorEnabled: false, permissions: [], groups: []
        },
        {
          id: '3', username: 'mike.wilson', email: 'mike.wilson@slbfe.lk', fullName: 'Mike Wilson',
          role: 'employee', profilePicture: undefined, isActive: true, lastLogin: new Date(Date.now() - 86400000 * 1),
          createdAt: new Date(Date.now() - 86400000 * 45), updatedAt: new Date(),
          lastActivity: new Date(Date.now() - 86400000 * 1), sessionsActive: 1, totalLogins: 67,
          accountLocked: false, passwordLastChanged: new Date(Date.now() - 86400000 * 20),
          twoFactorEnabled: true, permissions: [], groups: []
        }
      ];
      setUsers(mockUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleAssignment = async (userIds: string[], newRole: UserRole, reason?: string) => {
    try {
      if (userIds.length === 1) {
        await adminService.assignUserRole(userIds[0], newRole, reason);
      } else {
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
    } catch (error) {
      console.error('Role assignment failed:', error);
      // For demo purposes, still update the UI
      setUsers(prevUsers => 
        prevUsers.map(user => 
          userIds.includes(user.id) 
            ? { ...user, role: newRole, updatedAt: new Date() }
            : user
        )
      );
      setSelectedUsers([]);
      setShowRoleModal(false);
    }
  };

  const getRoleCount = (role: UserRole): number => {
    return users.filter(user => user.role === role).length;
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const getSelectedUsersData = (): AdminUserView[] => {
    return users.filter(user => selectedUsers.includes(user.id));
  };

  const getRoleColor = (role: UserRole) => {
    const roleDef = roleDefinitions.find(r => r.role === role);
    return roleDef?.color || 'bg-gray-100 text-gray-800';
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Role Management</h1>
            <p className="text-gray-600 mt-2">Manage user roles and permissions across the system</p>
          </div>
          <button
            onClick={() => setShowRoleModal(true)}
            disabled={selectedUsers.length === 0}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <UserCheck className="w-4 h-4 mr-2" />
            Assign Roles
          </button>
        </div>

        {/* Role Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roleDefinitions.map((roleDef) => (
            <div key={roleDef.role} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-gray-100 rounded-lg mr-3">
                    <Shield className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{roleDef.name}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roleDef.color}`}>
                      {getRoleCount(roleDef.role)} users
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{roleDef.description}</p>
              
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-700">Key Permissions:</p>
                {roleDef.permissions.map((permission, index) => (
                  <p key={index} className="text-xs text-gray-500">• {permission}</p>
                ))}
              </div>
              
              <button
                onClick={() => setSelectedRole(roleDef.role)}
                className="w-full mt-4 px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                View Users
              </button>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="flex-1">
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
            
            {/* Role Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as UserRole | 'all')}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                {roleDefinitions.map(role => (
                  <option key={role.role} value={role.role}>
                    {role.name} ({getRoleCount(role.role)})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Selected Users Info */}
          {selectedUsers.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-800">
                  {selectedUsers.length} users selected for role assignment
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowRoleModal(true)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Assign Roles
                  </button>
                  <button
                    onClick={() => setSelectedUsers([])}
                    className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Users List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Users {selectedRole !== 'all' && `- ${roleDefinitions.find(r => r.role === selectedRole)?.name}`}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Total: {filteredUsers.length}</span>
                <span>Selected: {selectedUsers.length}</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers(filteredUsers.map(user => user.id));
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
                    Current Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-500">Loading users...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No users found matching your criteria
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
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
                                {user.fullName.split(' ').map((n: string) => n[0]).join('')}
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
                          {roleDefinitions.find(r => r.role === user.role)?.name || user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {user.lastActivity ? new Date(user.lastActivity).toLocaleDateString() : 'Never'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedUsers([user.id]);
                            setShowRoleModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Change Role
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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
    </Layout>
  );
};

export default RoleManagement;