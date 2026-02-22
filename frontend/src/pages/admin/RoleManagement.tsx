// Role Management Page for Admin

import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  Filter, 
  Search, 
  Clock,
  Shield,
  ChevronDown
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
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const roleDefinitions = [
    {
      role: 'admin' as UserRole,
      name: 'Admin',
      description: 'System administrator with full access and control',
      permissions: ['Manage all users', 'Configure system', 'Access all reports', 'Assign roles'],
      color: 'bg-purple-100 text-purple-800',
      count: 0
    },
    {
      role: 'hr' as UserRole,
      name: 'HR Manager',
      description: 'Human Resources management with employee administration rights',
      permissions: ['Manage employees', 'Access HR reports', 'Process applications'],
      color: 'bg-blue-100 text-blue-800',
      count: 0
    },
    {
      role: 'employee' as UserRole,
      name: 'Employee',
      description: 'Standard employee access with basic functionality',
      permissions: ['View own profile', 'Submit applications', 'View documents'],
      color: 'bg-green-100 text-green-800',
      count: 0
    }
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (openDropdownId && !target.closest('.relative')) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdownId]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/User');
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      
      // Map backend data to AdminUserView format
      const mappedUsers: AdminUserView[] = data.map((user: any) => ({
        id: user.userId.toString(),
        username: user.userName,
        email: user.email || `${user.userName}@slbfe.lk`,
        fullName: user.fullName || user.userName,
        role: user.roleId === 1 ? 'admin' : user.roleId === 2 ? 'hr' : 'employee',
        profilePicture: undefined,
        isActive: user.status === 'Active',
        lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
        createdAt: new Date(),
        updatedAt: new Date(user.updatedAt),
        lastActivity: user.lastLogin ? new Date(user.lastLogin) : undefined,
        sessionsActive: 0,
        totalLogins: 0,
        accountLocked: false,
        passwordLastChanged: new Date(),
        twoFactorEnabled: false,
        permissions: [],
        groups: []
      }));
      
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleAssignment = async (userIds: string[], newRole: UserRole, reason?: string) => {
    try {
      // Map role string to roleId number
      const roleId = newRole === 'admin' ? 1 : newRole === 'hr' ? 2 : 3;
      
      // Update each user's role
      for (const userId of userIds) {
        const response = await fetch(`http://localhost:5001/api/User/${userId}/role`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ roleId }),
        });

        if (!response.ok) {
          throw new Error(`Failed to update role for user ${userId}`);
        }
      }
      
      // Reload users to get updated data
      await loadUsers();
      
      setSelectedUsers([]);
      setShowRoleModal(false);
    } catch (error) {
      console.error('Role assignment failed:', error);
      alert('Failed to update role. Please try again.');
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
                        <div className="relative inline-block">
                          <button
                            onClick={() => setOpenDropdownId(openDropdownId === user.id ? null : user.id)}
                            disabled={updatingUserId === user.id}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {updatingUserId === user.id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                                Updating...
                              </>
                            ) : (
                              <>
                                Change Role
                                <ChevronDown className="ml-2 h-4 w-4" />
                              </>
                            )}
                          </button>

                          {/* Dropdown Menu */}
                          {openDropdownId === user.id && (
                            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                              <div className="py-1" role="menu">
                                {roleDefinitions
                                  .filter(role => role.role !== user.role)
                                  .map((role) => (
                                    <button
                                      key={role.role}
                                      onClick={async () => {
                                        setOpenDropdownId(null);
                                        setUpdatingUserId(user.id);
                                        try {
                                          const roleId = role.role === 'admin' ? 1 : role.role === 'hr' ? 2 : 3;
                                          const response = await fetch(`http://localhost:5001/api/User/${user.id}/role`, {
                                            method: 'PUT',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ roleId }),
                                          });
                                          if (!response.ok) throw new Error('Failed to update role');
                                          await loadUsers();
                                          alert('Role updated successfully!');
                                        } catch (error) {
                                          console.error('Role update failed:', error);
                                          alert('Failed to update role. Please try again.');
                                        } finally {
                                          setUpdatingUserId(null);
                                        }
                                      }}
                                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                      role="menuitem"
                                    >
                                      {role.name}
                                    </button>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
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