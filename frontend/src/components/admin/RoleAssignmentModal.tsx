// Role Assignment Modal Component for Admin

import React, { useState } from 'react';
import { X, UserCheck, AlertCircle, Users } from 'lucide-react';
import { AdminUserView, UserRole } from '../../types';

interface RoleAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: AdminUserView[];
  onAssignRole: (userIds: string[], newRole: UserRole, reason?: string) => Promise<void>;
}

const RoleAssignmentModal: React.FC<RoleAssignmentModalProps> = ({
  isOpen,
  onClose,
  users,
  onAssignRole
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('employee');
  const [reason, setReason] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [error, setError] = useState('');

  const availableRoles: { value: UserRole; label: string; description: string }[] = [
    { 
      value: 'employee', 
      label: 'Employee', 
      description: 'Standard employee access with basic functionality' 
    },
    { 
      value: 'hr', 
      label: 'HR Manager', 
      description: 'Human Resources management with employee administration rights' 
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (users.length === 0) {
      setError('No users selected for role assignment');
      return;
    }

    if (!reason.trim()) {
      setError('Please provide a reason for the role change');
      return;
    }

    try {
      setIsAssigning(true);
      const userIds = users.map(user => user.id);
      await onAssignRole(userIds, selectedRole, reason.trim());
      
      // Reset form
      setSelectedRole('employee');
      setReason('');
      onClose();
    } catch (error) {
      console.error('Role assignment failed:', error);
      setError('Failed to assign role. Please try again.');
    } finally {
      setIsAssigning(false);
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'hr':
        return 'text-blue-600 bg-blue-100';
      case 'branch_manager':
      case 'program_manager':
        return 'text-green-600 bg-green-100';
      case 'training_coordinator':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <UserCheck className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Assign User Role</h2>
              <p className="text-sm text-gray-600">
                Change role for {users.length} selected user{users.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Selected Users */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Selected Users</h3>
          <div className="max-h-32 overflow-y-auto">
            <div className="space-y-2">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                      <span className="text-xs font-medium text-gray-700">
                        {user.fullName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                    Current: {user.role.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select New Role
            </label>
            <div className="space-y-3">
              {availableRoles.map((role) => (
                <div key={role.value} className="flex items-start">
                  <input
                    type="radio"
                    id={role.value}
                    name="role"
                    value={role.value}
                    checked={selectedRole === role.value}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="mt-1 mr-3 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={role.value} className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{role.label}</p>
                        <p className="text-xs text-gray-500 mt-1">{role.description}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(role.value)}`}>
                        {role.label}
                      </span>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Reason for Change */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Role Change *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Please provide a detailed reason for this role change..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              This information will be logged for audit purposes
            </p>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div className="ml-3">
                <h4 className="text-sm font-medium text-yellow-800">Important Notice</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Changing user roles will immediately affect their system access and permissions. 
                  Users may need to log out and log back in for changes to take effect. This action 
                  will be logged and audited.
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isAssigning}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAssigning || !reason.trim()}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isAssigning && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              )}
              <Users className="w-4 h-4 mr-2" />
              Assign Role{users.length > 1 ? 's' : ''}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleAssignmentModal;