// Task Assignment Component for Admin Dashboard
// Allows admins to assign specific features/tasks to HR managers

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  UserCheck,
  Shield,
  Activity,
  FileText,
  Calendar,
  BarChart3,
  Heart,
  Plane,
  GraduationCap,
  CreditCard,
  User,
  X
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { 
  HRTaskAssignment, 
  HRFeature, 
  TaskAssignmentType, 
  FeaturePermission
} from '../../types';

// Assignment Modal Component
const AssignmentModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (assignment: any) => void;
  editingAssignment?: HRTaskAssignment | null;
  featurePermissions: FeaturePermission[];
  taskTypeTemplates: Record<TaskAssignmentType, { label: string; description: string }>;
}> = ({ isOpen, onClose, onSave, editingAssignment, featurePermissions, taskTypeTemplates }) => {
  const [formData, setFormData] = useState({
    userId: '',
    userName: '',
    userEmail: '',
    taskType: 'general_hr' as TaskAssignmentType,
    taskDescription: '',
    assignedFeatures: [] as HRFeature[],
    notes: ''
  });
  const [hrUsers, setHrUsers] = useState<any[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editingAssignment) {
        setFormData({
          userId: editingAssignment.userId,
          userName: editingAssignment.userName,
          userEmail: editingAssignment.userEmail,
          taskType: editingAssignment.taskType,
          taskDescription: editingAssignment.taskDescription,
          assignedFeatures: editingAssignment.assignedFeatures,
          notes: editingAssignment.notes || ''
        });
      }
      loadHRUsers();
    }
  }, [isOpen, editingAssignment]);

  const loadHRUsers = async () => {
    try {
      setLoadingUsers(true);
      // TODO: Replace with actual API call
      const mockUsers = [
        { id: 'hr001', name: 'John Medical', email: 'john.medical@slbfe.com', role: 'hr', department: 'Medical' },
        { id: 'hr002', name: 'Sarah Transfer', email: 'sarah.transfer@slbfe.com', role: 'hr', department: 'Administration' },
        { id: 'hr003', name: 'Robert Retirement', email: 'robert.retirement@slbfe.com', role: 'hr', department: 'Benefits' },
        { id: 'hr004', name: 'Lisa Recruitment', email: 'lisa.recruitment@slbfe.com', role: 'hr', department: 'Recruitment' },
        { id: 'hr005', name: 'Mike Training', email: 'mike.training@slbfe.com', role: 'hr', department: 'Training' },
        { id: 'hr006', name: 'Emma Payroll', email: 'emma.payroll@slbfe.com', role: 'hr', department: 'Payroll' },
        { id: 'hr007', name: 'David General', email: 'david.general@slbfe.com', role: 'hr', department: 'General HR' },
        { id: 'hr008', name: 'Anna Coordinator', email: 'anna.coordinator@slbfe.com', role: 'hr', department: 'HR Coordination' }
      ];
      setHrUsers(mockUsers);
    } catch (error) {
      console.error('Failed to load HR users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleTaskTypeChange = (taskType: TaskAssignmentType) => {
    setFormData(prev => {
      const defaultFeatures = featurePermissions
        .filter(perm => perm.defaultForRoles.includes(taskType))
        .map(perm => perm.feature);
      
      return {
        ...prev,
        taskType,
        assignedFeatures: defaultFeatures,
        taskDescription: taskTypeTemplates[taskType]?.description || ''
      };
    });
  };

  const handleFeatureToggle = (feature: HRFeature) => {
    setFormData(prev => ({
      ...prev,
      assignedFeatures: prev.assignedFeatures.includes(feature)
        ? prev.assignedFeatures.filter(f => f !== feature)
        : [...prev.assignedFeatures, feature]
    }));
  };

  const handleUserSelect = (user: any) => {
    setFormData(prev => ({
      ...prev,
      userId: user.id,
      userName: user.name,
      userEmail: user.email
    }));
    setUserSearchTerm(user.name);
    setShowUserDropdown(false);
  };

  const filteredUsers = hrUsers.filter(user => 
    user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userId || !formData.taskType || formData.assignedFeatures.length === 0) {
      alert('Please fill in all required fields and select at least one feature.');
      return;
    }

    const assignmentData = {
      ...formData,
      id: editingAssignment?.id || `new-${Date.now()}`,
      isActive: true,
      assignedBy: 'admin',
      assignedDate: editingAssignment?.assignedDate || new Date(),
      lastModified: new Date()
    };

    onSave(assignmentData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {editingAssignment ? 'Edit Task Assignment' : 'Create New Task Assignment'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* HR User Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select HR Manager <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search HR managers by name, email, or department..."
                  value={userSearchTerm}
                  onChange={(e) => {
                    setUserSearchTerm(e.target.value);
                    setShowUserDropdown(true);
                  }}
                  onFocus={() => setShowUserDropdown(true)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {showUserDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {loadingUsers ? (
                      <div className="p-4 text-center text-gray-500">Loading HR users...</div>
                    ) : filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <button
                          key={user.id}
                          type="button"
                          onClick={() => handleUserSelect(user)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{user.name}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {user.department}
                            </span>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">No HR users found</div>
                    )}
                  </div>
                )}
              </div>
              {formData.userName && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Selected:</strong> {formData.userName} ({formData.userEmail})
                  </p>
                </div>
              )}
            </div>

            {/* Task Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.taskType}
                onChange={(e) => handleTaskTypeChange(e.target.value as TaskAssignmentType)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {Object.entries(taskTypeTemplates).map(([type, config]) => (
                  <option key={type} value={type}>{config.label}</option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                {taskTypeTemplates[formData.taskType]?.description}
              </p>
            </div>

            {/* Task Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Description
              </label>
              <input
                type="text"
                value={formData.taskDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, taskDescription: e.target.value }))}
                placeholder="Brief description of the assigned tasks..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Feature Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Assigned Features <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4">
                {featurePermissions.map((permission) => {
                  const isRequired = ['overview'].includes(permission.feature);
                  const isChecked = formData.assignedFeatures.includes(permission.feature) || isRequired;
                  
                  return (
                    <label
                      key={permission.feature}
                      className={`flex items-start space-x-3 p-3 rounded-lg border ${
                        isChecked ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
                      } ${isRequired ? 'opacity-75' : 'hover:bg-gray-50 cursor-pointer'}`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        disabled={isRequired}
                        onChange={() => !isRequired && handleFeatureToggle(permission.feature)}
                        className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{permission.label}</p>
                        <p className="text-xs text-gray-500">{permission.description}</p>
                        {isRequired && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded mt-1 inline-block">
                            Required
                          </span>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Selected {formData.assignedFeatures.length} of {featurePermissions.length} features
              </p>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes about this assignment..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                {editingAssignment ? 'Update Assignment' : 'Create Assignment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const TaskAssignment: React.FC = () => {
  const [assignments, setAssignments] = useState<HRTaskAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTaskType, setFilterTaskType] = useState<TaskAssignmentType | 'all'>('all');
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<HRTaskAssignment | null>(null);

  // Feature permissions configuration
  const featurePermissions: FeaturePermission[] = [
    {
      feature: 'overview',
      label: 'Overview Dashboard',
      description: 'Access to main dashboard and statistics',
      icon: 'BarChart3',
      defaultForRoles: ['medical_officer', 'transfer_officer', 'retirement_officer', 'recruitment_officer', 'training_coordinator', 'payroll_officer', 'general_hr'],
    },
    {
      feature: 'employees',
      label: 'Employee Management',
      description: 'Manage employee records and information',
      icon: 'Users',
      defaultForRoles: ['general_hr', 'recruitment_officer'],
    },
    {
      feature: 'medical_claims',
      label: 'Medical Claims',
      description: 'Process and manage medical claims',
      icon: 'Heart',
      defaultForRoles: ['medical_officer'],
    },
    {
      feature: 'retirement',
      label: 'Retirement Management',
      description: 'Handle retirement processes and benefits',
      icon: 'User',
      defaultForRoles: ['retirement_officer'],
    },
    {
      feature: 'transfer',
      label: 'Transfer Management',
      description: 'Manage employee transfers and relocations',
      icon: 'Plane',
      defaultForRoles: ['transfer_officer'],
    },
    {
      feature: 'leave_management',
      label: 'Leave Management',
      description: 'Process leave requests and manage leave policies',
      icon: 'Calendar',
      defaultForRoles: ['general_hr'],
    },
    {
      feature: 'attendance',
      label: 'Attendance Tracking',
      description: 'Monitor and manage employee attendance',
      icon: 'Activity',
      defaultForRoles: ['general_hr'],
    },
    {
      feature: 'recruitment',
      label: 'Recruitment',
      description: 'Manage hiring processes and candidate applications',
      icon: 'UserCheck',
      defaultForRoles: ['recruitment_officer', 'general_hr'],
    },
    {
      feature: 'training',
      label: 'Training Programs',
      description: 'Coordinate training programs and employee development',
      icon: 'GraduationCap',
      defaultForRoles: ['training_coordinator'],
    },
    {
      feature: 'performance',
      label: 'Performance Management',
      description: 'Manage employee performance reviews and evaluations',
      icon: 'BarChart3',
      defaultForRoles: ['general_hr'],
    },
    {
      feature: 'payroll',
      label: 'Payroll Management',
      description: 'Process payroll and manage compensation',
      icon: 'CreditCard',
      defaultForRoles: ['payroll_officer'],
    },
    {
      feature: 'reports',
      label: 'Reports & Analytics',
      description: 'Generate reports and view analytics',
      icon: 'BarChart3',
      defaultForRoles: ['general_hr'],
    },
    {
      feature: 'documents',
      label: 'Document Management',
      description: 'Access and manage HR documents',
      icon: 'FileText',
      defaultForRoles: ['medical_officer', 'transfer_officer', 'retirement_officer', 'recruitment_officer', 'training_coordinator', 'payroll_officer', 'general_hr'],
    }
  ];

  // Task type templates
  const taskTypeTemplates: Record<TaskAssignmentType, { label: string; description: string }> = {
    medical_officer: {
      label: 'Medical Officer',
      description: 'Handles medical claims and health-related HR matters'
    },
    transfer_officer: {
      label: 'Transfer Officer', 
      description: 'Manages employee transfers and relocations'
    },
    retirement_officer: {
      label: 'Retirement Officer',
      description: 'Handles retirement processes and benefits'
    },
    recruitment_officer: {
      label: 'Recruitment Officer',
      description: 'Manages hiring and recruitment processes'
    },
    training_coordinator: {
      label: 'Training Coordinator',
      description: 'Coordinates training programs and development'
    },
    payroll_officer: {
      label: 'Payroll Officer',
      description: 'Manages payroll and compensation'
    },
    general_hr: {
      label: 'General HR',
      description: 'General HR responsibilities with broader access'
    },
    custom: {
      label: 'Custom Assignment',
      description: 'Custom role with specific feature assignments'
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API calls
      const mockAssignments: HRTaskAssignment[] = [
        {
          id: '1',
          userId: 'hr001',
          userName: 'John Medical',
          userEmail: 'john.medical@slbfe.com',
          taskType: 'medical_officer',
          taskDescription: 'Medical Claims Processing Officer',
          assignedFeatures: ['overview', 'medical_claims', 'documents'],
          isActive: true,
          assignedBy: 'admin',
          assignedDate: new Date('2024-01-15'),
          lastModified: new Date('2024-02-01'),
          notes: 'Responsible for all medical claim processing and health-related HR matters'
        },
        {
          id: '2',
          userId: 'hr002',
          userName: 'Sarah Transfer',
          userEmail: 'sarah.transfer@slbfe.com',
          taskType: 'transfer_officer',
          taskDescription: 'Employee Transfer Coordinator',
          assignedFeatures: ['overview', 'transfer'],
          isActive: true,
          assignedBy: 'admin',
          assignedDate: new Date('2024-01-20'),
          lastModified: new Date('2024-01-20'),
          notes: 'Handles all employee transfer requests and relocations'
        },
        {
          id: '3',
          userId: 'hr003',
          userName: 'Robert Retirement',
          userEmail: 'robert.retirement@slbfe.com',
          taskType: 'retirement_officer',
          taskDescription: 'Retirement Benefits Officer',
          assignedFeatures: ['overview', 'retirement'],
          isActive: true,
          assignedBy: 'admin',
          assignedDate: new Date('2024-01-25'),
          lastModified: new Date('2024-01-25'),
          notes: 'Manages retirement processes and benefit calculations'
        }
      ];

      setAssignments(mockAssignments);

    } catch (error) {
      console.error('Failed to load task assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFeatureIcon = (feature: HRFeature) => {
    const permission = featurePermissions.find(p => p.feature === feature);
    
    switch (permission?.icon) {
      case 'BarChart3': return BarChart3;
      case 'Users': return Users;
      case 'Heart': return Heart;
      case 'User': return User;
      case 'Plane': return Plane;
      case 'Calendar': return Calendar;
      case 'Activity': return Activity;
      case 'UserCheck': return UserCheck;
      case 'GraduationCap': return GraduationCap;
      case 'CreditCard': return CreditCard;
      case 'FileText': return FileText;

      default: return Shield;
    }
  };

  const getTaskTypeColor = (taskType: TaskAssignmentType) => {
    const colors: Record<TaskAssignmentType, string> = {
      medical_officer: 'bg-red-100 text-red-800',
      transfer_officer: 'bg-blue-100 text-blue-800',
      retirement_officer: 'bg-purple-100 text-purple-800',
      recruitment_officer: 'bg-green-100 text-green-800',
      training_coordinator: 'bg-yellow-100 text-yellow-800',
      payroll_officer: 'bg-indigo-100 text-indigo-800',
      general_hr: 'bg-gray-100 text-gray-800',
      custom: 'bg-orange-100 text-orange-800'
    };
    return colors[taskType] || 'bg-gray-100 text-gray-800';
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.taskDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterTaskType === 'all' || assignment.taskType === filterTaskType;
    return matchesSearch && matchesFilter;
  });

  const handleCreateAssignment = () => {
    setEditingAssignment(null);
    setShowAssignmentModal(true);
  };

  const handleEditAssignment = (assignment: HRTaskAssignment) => {
    setEditingAssignment(assignment);
    setShowAssignmentModal(true);
  };

  const handleDeleteAssignment = async (assignmentId: string) => {
    if (window.confirm('Are you sure you want to delete this task assignment?')) {
      // TODO: Implement delete API call
      setAssignments(prev => prev.filter(a => a.id !== assignmentId));
    }
  };

  const handleSaveAssignment = (assignmentData: any) => {
    if (editingAssignment) {
      // Update existing assignment
      setAssignments(prev => prev.map(a => 
        a.id === editingAssignment.id ? { ...assignmentData, id: editingAssignment.id } : a
      ));
    } else {
      // Add new assignment
      setAssignments(prev => [...prev, assignmentData]);
    }
    setShowAssignmentModal(false);
    setEditingAssignment(null);
  };

  const handleCloseModal = () => {
    setShowAssignmentModal(false);
    setEditingAssignment(null);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Task Assignment</h1>
            <p className="text-gray-600 mt-2">Assign specific features and tasks to HR managers</p>
          </div>
          <button
            onClick={handleCreateAssignment}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Assignment
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Assignments</p>
                <p className="text-2xl font-bold text-gray-900">{assignments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{assignments.filter(a => a.isActive).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Task Types</p>
                <p className="text-2xl font-bold text-gray-900">{new Set(assignments.map(a => a.taskType)).size}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Features Used</p>
                <p className="text-2xl font-bold text-gray-900">{new Set(assignments.flatMap(a => a.assignedFeatures)).size}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name, email, or task description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="sm:w-64">
              <select
                value={filterTaskType}
                onChange={(e) => setFilterTaskType(e.target.value as TaskAssignmentType | 'all')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Task Types</option>
                {Object.entries(taskTypeTemplates).map(([type, config]) => (
                  <option key={type} value={type}>{config.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Assignments Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Current Assignments</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Task Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Assigned Features
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Modified
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAssignments.map((assignment) => (
                  <tr key={assignment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{assignment.userName}</div>
                        <div className="text-sm text-gray-500">{assignment.userEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTaskTypeColor(assignment.taskType)}`}>
                        {taskTypeTemplates[assignment.taskType]?.label || assignment.taskType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {assignment.assignedFeatures.slice(0, 3).map((feature) => {
                          const IconComponent = getFeatureIcon(feature);
                          return (
                            <span key={feature} className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                              <IconComponent className="w-3 h-3 mr-1" />
                              {featurePermissions.find(p => p.feature === feature)?.label || feature}
                            </span>
                          );
                        })}
                        {assignment.assignedFeatures.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                            +{assignment.assignedFeatures.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        assignment.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {assignment.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {assignment.lastModified.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditAssignment(assignment)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAssignment(assignment.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAssignments.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterTaskType !== 'all' 
                  ? 'No assignments match your current filters.'
                  : 'Get started by creating your first task assignment.'}
              </p>
              {!searchTerm && filterTaskType === 'all' && (
                <button
                  onClick={handleCreateAssignment}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Assignment
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Assignment Modal */}
      {showAssignmentModal && (
        <AssignmentModal
          isOpen={showAssignmentModal}
          onClose={handleCloseModal}
          onSave={handleSaveAssignment}
          editingAssignment={editingAssignment}
          featurePermissions={featurePermissions}
          taskTypeTemplates={taskTypeTemplates}
        />
      )}
    </Layout>
  );
};

export default TaskAssignment;