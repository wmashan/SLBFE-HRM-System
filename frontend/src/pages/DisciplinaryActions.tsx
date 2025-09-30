// Disciplinary Actions Management Page (Senior HR Manager Only)

import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  FileText, 
  Calendar,
  User,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  MoreHorizontal
} from 'lucide-react';
import { Button, Modal } from '../components/ui';
import { DisciplinaryAction, DisciplinaryStats, DisciplinaryActionType, DisciplinarySeverity, DisciplinaryStatus } from '../types';

const DisciplinaryActions: React.FC = () => {
  const [disciplinaryActions, setDisciplinaryActions] = useState<DisciplinaryAction[]>([]);
  const [stats, setStats] = useState<DisciplinaryStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<DisciplinaryStatus | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<DisciplinarySeverity | 'all'>('all');
  const [selectedAction, setSelectedAction] = useState<DisciplinaryAction | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const mockActions: DisciplinaryAction[] = [
        {
          id: 'DA001',
          employeeId: 'EMP001',
          employeeName: 'John Smith',
          department: 'Operations',
          position: 'Senior Clerk',
          branch: 'Colombo Main',
          actionType: 'written_warning',
          severity: 'moderate',
          incidentDate: '2024-09-15',
          reportedDate: '2024-09-16',
          reportedBy: 'Manager - Operations',
          description: 'Repeated tardiness affecting team productivity',
          investigationDetails: 'Investigation revealed pattern of late arrivals over 2 weeks',
          actionTaken: 'Written warning issued with improvement plan',
          startDate: '2024-09-20',
          followUpRequired: true,
          followUpDate: '2024-10-20',
          status: 'implemented',
          approvedBy: 'Sarah Williams',
          approvalDate: '2024-09-18',
          employeeResponse: 'Employee acknowledged and committed to improvement',
          appealSubmitted: false,
          finalDecision: 'Warning stands with 30-day review period',
          impactOnRecord: 'temporary',
          createdBy: 'Sarah Williams',
          createdAt: new Date('2024-09-16'),
          updatedAt: new Date('2024-09-20')
        },
        {
          id: 'DA002',
          employeeId: 'EMP002',
          employeeName: 'Maria Garcia',
          department: 'Training',
          position: 'Training Coordinator',
          branch: 'Gampaha',
          actionType: 'suspension',
          severity: 'major',
          incidentDate: '2024-09-10',
          reportedDate: '2024-09-11',
          reportedBy: 'Branch Manager - Gampaha',
          description: 'Inappropriate conduct during training session',
          investigationDetails: 'Multiple witness statements confirmed misconduct',
          witnessStatements: ['Statement from trainee A', 'Statement from colleague B'],
          actionTaken: '3-day suspension without pay',
          startDate: '2024-09-25',
          endDate: '2024-09-27',
          followUpRequired: true,
          followUpDate: '2024-10-15',
          status: 'completed',
          approvedBy: 'Sarah Williams',
          approvalDate: '2024-09-22',
          employeeResponse: 'Employee disputes the allegations',
          appealSubmitted: true,
          appealDate: '2024-09-28',
          appealOutcome: 'Appeal denied after review',
          finalDecision: 'Suspension upheld with mandatory training',
          impactOnRecord: 'permanent',
          createdBy: 'Sarah Williams',
          createdAt: new Date('2024-09-11'),
          updatedAt: new Date('2024-10-01')
        },
        {
          id: 'DA003',
          employeeId: 'EMP003',
          employeeName: 'Ahmed Hassan',
          department: 'Placement',
          position: 'Placement Officer',
          branch: 'Kandy',
          actionType: 'counseling',
          severity: 'minor',
          incidentDate: '2024-09-20',
          reportedDate: '2024-09-21',
          reportedBy: 'HR Assistant - Kandy',
          description: 'Poor customer service attitude reported by clients',
          investigationDetails: 'Client feedback and observation reports reviewed',
          actionTaken: 'Mandatory customer service training and counseling',
          startDate: '2024-09-25',
          followUpRequired: true,
          followUpDate: '2024-11-01',
          status: 'investigation',
          employeeResponse: 'Employee willing to participate in training',
          appealSubmitted: false,
          finalDecision: 'Pending completion of training program',
          impactOnRecord: 'none',
          createdBy: 'Sarah Williams',
          createdAt: new Date('2024-09-21'),
          updatedAt: new Date('2024-09-25')
        }
      ];

      const mockStats: DisciplinaryStats = {
        totalActions: 23,
        pendingInvestigation: 3,
        activeWarnings: 8,
        suspensionsThisYear: 2,
        terminationsThisYear: 1,
        appealsInProgress: 1,
        actionsByType: {
          verbal_warning: 6,
          written_warning: 8,
          final_warning: 3,
          suspension: 2,
          demotion: 1,
          salary_reduction: 0,
          termination: 1,
          counseling: 5,
          training_mandatory: 4,
          transfer: 2
        },
        actionsBySeverity: {
          minor: 10,
          moderate: 8,
          major: 4,
          severe: 1
        }
      };

      setDisciplinaryActions(mockActions);
      setStats(mockStats);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusIcon = (status: DisciplinaryStatus) => {
    switch (status) {
      case 'investigation':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'pending_approval':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'implemented':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'under_appeal':
        return <AlertTriangle className="w-4 h-4 text-purple-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'dismissed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: DisciplinarySeverity) => {
    switch (severity) {
      case 'minor':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'major':
        return 'bg-orange-100 text-orange-800';
      case 'severe':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionTypeLabel = (actionType: DisciplinaryActionType) => {
    const labels: Record<DisciplinaryActionType, string> = {
      verbal_warning: 'Verbal Warning',
      written_warning: 'Written Warning',
      final_warning: 'Final Warning',
      suspension: 'Suspension',
      demotion: 'Demotion',
      salary_reduction: 'Salary Reduction',
      termination: 'Termination',
      counseling: 'Counseling',
      training_mandatory: 'Mandatory Training',
      transfer: 'Transfer'
    };
    return labels[actionType] || actionType;
  };

  const filteredActions = disciplinaryActions.filter(action => {
    const matchesSearch = action.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         action.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         action.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || action.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || action.severity === severityFilter;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const handleCreateAction = () => {
    setShowCreateModal(true);
  };

  const handleViewDetails = (action: DisciplinaryAction) => {
    setSelectedAction(action);
    setShowDetailsModal(true);
  };

  const handleEditAction = (action: DisciplinaryAction) => {
    setSelectedAction(action);
    setShowEditModal(true);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Disciplinary Actions</h1>
            <p className="text-sm text-gray-600">Manage employee disciplinary cases and actions</p>
          </div>
        </div>
        <Button onClick={handleCreateAction} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" />
          New Action
        </Button>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Actions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalActions}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingInvestigation}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Warnings</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.activeWarnings}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Suspensions</p>
                <p className="text-2xl font-bold text-red-600">{stats.suspensionsThisYear}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Terminations</p>
                <p className="text-2xl font-bold text-red-800">{stats.terminationsThisYear}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Appeals</p>
                <p className="text-2xl font-bold text-purple-600">{stats.appealsInProgress}</p>
              </div>
              <Shield className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees, departments..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as DisciplinaryStatus | 'all')}
          >
            <option value="all">All Status</option>
            <option value="investigation">Investigation</option>
            <option value="pending_approval">Pending Approval</option>
            <option value="approved">Approved</option>
            <option value="implemented">Implemented</option>
            <option value="under_appeal">Under Appeal</option>
            <option value="completed">Completed</option>
            <option value="dismissed">Dismissed</option>
          </select>
          <select
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as DisciplinarySeverity | 'all')}
          >
            <option value="all">All Severity</option>
            <option value="minor">Minor</option>
            <option value="moderate">Moderate</option>
            <option value="major">Major</option>
            <option value="severe">Severe</option>
          </select>
          <div className="flex space-x-2">
            <Button variant="ghost" className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="ghost" className="flex-1">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Actions Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Case ID / Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Incident Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Follow-up
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredActions.map((action) => (
                <tr key={action.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                          <User className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{action.id}</div>
                          <div className="text-sm text-gray-900">{action.employeeName}</div>
                          <div className="text-sm text-gray-500">{action.department} • {action.branch}</div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{getActionTypeLabel(action.actionType)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(action.severity)}`}>
                      {action.severity.charAt(0).toUpperCase() + action.severity.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(action.status)}
                      <span className="text-sm text-gray-900 capitalize">
                        {action.status.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(action.incidentDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {action.followUpRequired && action.followUpDate ? (
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-orange-500" />
                        {new Date(action.followUpDate).toLocaleDateString()}
                      </div>
                    ) : (
                      <span className="text-gray-400">None</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewDetails(action)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditAction(action)}
                        className="text-purple-600 hover:text-purple-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredActions.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No disciplinary actions found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' || severityFilter !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'Get started by creating a new disciplinary action.'}
            </p>
            {searchTerm === '' && statusFilter === 'all' && severityFilter === 'all' && (
              <div className="mt-6">
                <Button onClick={handleCreateAction} className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  New Action
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Create Modal Placeholder */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Disciplinary Action"
        size="xl"
      >
        <div className="p-4">
          <p className="text-gray-600">Create disciplinary action form will be implemented here.</p>
          <div className="mt-4 flex justify-end space-x-2">
            <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700">
              Create Action
            </Button>
          </div>
        </div>
      </Modal>

      {/* Details Modal Placeholder */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Disciplinary Action Details"
        size="xl"
      >
        <div className="p-4">
          {selectedAction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Case ID</label>
                  <p className="text-sm text-gray-900">{selectedAction.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Employee</label>
                  <p className="text-sm text-gray-900">{selectedAction.employeeName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Department</label>
                  <p className="text-sm text-gray-900">{selectedAction.department}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Action Type</label>
                  <p className="text-sm text-gray-900">{getActionTypeLabel(selectedAction.actionType)}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Description</label>
                <p className="text-sm text-gray-900 mt-1">{selectedAction.description}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Action Taken</label>
                <p className="text-sm text-gray-900 mt-1">{selectedAction.actionTaken}</p>
              </div>
            </div>
          )}
          <div className="mt-6 flex justify-end">
            <Button variant="ghost" onClick={() => setShowDetailsModal(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal Placeholder */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Disciplinary Action"
        size="xl"
      >
        <div className="p-4">
          <p className="text-gray-600">Edit disciplinary action form will be implemented here.</p>
          <div className="mt-4 flex justify-end space-x-2">
            <Button variant="ghost" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700">
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DisciplinaryActions;