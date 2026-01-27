import React, { useState } from 'react';
import {
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Plus,
  X,
  User,
  Calendar,
  FileText,
  Clock,
  Shield,
  Ban,
  AlertCircle,
  CheckCircle,
  Download,
  Edit,
  Trash2,
  Lock,
  Upload,
  TrendingUp,
  Users as UsersIcon
} from 'lucide-react';

interface DisciplinaryAction {
  disciplinaryId: number;
  employeeId: string;
  employeeName: string;
  department: string;
  actionTypeId: number;
  actionTypeName: string;
  incidentDate: string;
  loggedDate: string;
  issuedBy: number;
  issuedByName: string;
  description: string;
  status: 'Active' | 'Resolved' | 'Archived';
  documentId?: number;
  documentName?: string;
  email?: string;
  phoneNumber?: string;
  severity?: 'Low' | 'Medium' | 'High' | 'Critical';
}

interface DisciplinaryType {
  typeId: number;
  typeName: string;
  description: string;
  color: string;
  icon: string;
}

const DisciplinaryActions: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'actions' | 'statistics' | 'types'>('actions');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<DisciplinaryAction | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Form state for adding new action
  const [newAction, setNewAction] = useState({
    employeeId: '',
    actionTypeId: 1,
    incidentDate: '',
    description: '',
    severity: 'Medium' as 'Low' | 'Medium' | 'High' | 'Critical'
  });

  // Mock data for disciplinary types
  const disciplinaryTypes: DisciplinaryType[] = [
    {
      typeId: 1,
      typeName: 'Verbal Warning',
      description: 'Informal warning for minor infractions',
      color: 'yellow',
      icon: 'message'
    },
    {
      typeId: 2,
      typeName: 'Written Warning',
      description: 'Formal written warning for policy violations',
      color: 'orange',
      icon: 'file'
    },
    {
      typeId: 3,
      typeName: 'Suspension',
      description: 'Temporary suspension from duties',
      color: 'red',
      icon: 'ban'
    },
    {
      typeId: 4,
      typeName: 'Termination',
      description: 'Employment termination due to serious violations',
      color: 'red',
      icon: 'x'
    },
    {
      typeId: 5,
      typeName: 'Inquiry',
      description: 'Formal investigation into alleged misconduct',
      color: 'blue',
      icon: 'search'
    }
  ];

  // Mock data for disciplinary actions
  const [disciplinaryActions] = useState<DisciplinaryAction[]>([
    {
      disciplinaryId: 1,
      employeeId: 'EMP005',
      employeeName: 'Ruwan Jayasinghe',
      department: 'IT Department',
      actionTypeId: 1,
      actionTypeName: 'Verbal Warning',
      incidentDate: '2026-01-15',
      loggedDate: '2026-01-15 10:30:00',
      issuedBy: 101,
      issuedByName: 'HR Manager',
      description: 'Employee was consistently late to work (3 times in one week). Counseled on importance of punctuality and company policies regarding attendance.',
      status: 'Active',
      email: 'ruwan@slbfe.lk',
      phoneNumber: '+94 77 567 8901',
      severity: 'Low'
    },
    {
      disciplinaryId: 2,
      employeeId: 'EMP008',
      employeeName: 'Priya Gunasekara',
      department: 'Finance Department',
      actionTypeId: 2,
      actionTypeName: 'Written Warning',
      incidentDate: '2026-01-10',
      loggedDate: '2026-01-12 14:15:00',
      issuedBy: 101,
      issuedByName: 'HR Manager',
      description: 'Failure to follow established financial procedures and unauthorized approval of expense claims exceeding personal authority limit. Written warning issued with mandatory retraining on financial policies.',
      status: 'Active',
      documentId: 1001,
      documentName: 'Written_Warning_EMP008_20260112.pdf',
      email: 'priya@slbfe.lk',
      phoneNumber: '+94 77 890 1234',
      severity: 'Medium'
    },
    {
      disciplinaryId: 3,
      employeeId: 'EMP012',
      employeeName: 'Lasith Fernando',
      department: 'Operations',
      actionTypeId: 3,
      actionTypeName: 'Suspension',
      incidentDate: '2025-12-20',
      loggedDate: '2025-12-21 09:00:00',
      issuedBy: 102,
      issuedByName: 'HR Officer - Disciplinary',
      description: 'Serious violation of workplace safety protocols leading to potential hazard. Employee suspended for 5 days without pay pending full investigation. Mandatory safety training required before return to work.',
      status: 'Resolved',
      documentId: 1002,
      documentName: 'Suspension_Letter_EMP012_20251221.pdf',
      email: 'lasith@slbfe.lk',
      phoneNumber: '+94 77 901 2345',
      severity: 'High'
    },
    {
      disciplinaryId: 4,
      employeeId: 'EMP015',
      employeeName: 'Nadeeka Wijesinghe',
      department: 'HR Department',
      actionTypeId: 5,
      actionTypeName: 'Inquiry',
      incidentDate: '2026-01-20',
      loggedDate: '2026-01-22 11:00:00',
      issuedBy: 101,
      issuedByName: 'HR Manager',
      description: 'Formal inquiry initiated following allegations of inappropriate conduct and harassment in the workplace. Investigation committee formed. Employee on administrative duty pending inquiry outcome.',
      status: 'Active',
      email: 'nadeeka@slbfe.lk',
      phoneNumber: '+94 77 012 3456',
      severity: 'High'
    },
    {
      disciplinaryId: 5,
      employeeId: 'EMP018',
      employeeName: 'Nuwan Rajapaksa',
      department: 'Administration',
      actionTypeId: 4,
      actionTypeName: 'Termination',
      incidentDate: '2025-11-30',
      loggedDate: '2025-12-05 16:00:00',
      issuedBy: 102,
      issuedByName: 'HR Officer - Disciplinary',
      description: 'Employment terminated due to gross misconduct and breach of trust. Employee found guilty of theft of company property and falsification of records after full disciplinary inquiry. Termination effective immediately with loss of benefits.',
      status: 'Archived',
      documentId: 1003,
      documentName: 'Termination_Letter_EMP018_20251205.pdf',
      email: 'nuwan@slbfe.lk',
      phoneNumber: '+94 77 123 4567',
      severity: 'Critical'
    },
    {
      disciplinaryId: 6,
      employeeId: 'EMP003',
      employeeName: 'Kasun Silva',
      department: 'Finance Department',
      actionTypeId: 1,
      actionTypeName: 'Verbal Warning',
      incidentDate: '2026-01-25',
      loggedDate: '2026-01-25 15:30:00',
      issuedBy: 101,
      issuedByName: 'HR Manager',
      description: 'Informal counseling provided regarding unprofessional communication with colleagues via email. Reminded of code of conduct and professional communication standards.',
      status: 'Active',
      email: 'kasun@slbfe.lk',
      phoneNumber: '+94 77 345 6789',
      severity: 'Low'
    },
    {
      disciplinaryId: 7,
      employeeId: 'EMP010',
      employeeName: 'Dilini Perera',
      department: 'IT Department',
      actionTypeId: 2,
      actionTypeName: 'Written Warning',
      incidentDate: '2026-01-05',
      loggedDate: '2026-01-08 10:00:00',
      issuedBy: 102,
      issuedByName: 'HR Officer - Disciplinary',
      description: 'Repeated failure to meet project deadlines and deliverables despite multiple verbal warnings. Written warning issued with performance improvement plan. Progress to be reviewed monthly.',
      status: 'Active',
      documentId: 1004,
      documentName: 'Written_Warning_EMP010_20260108.pdf',
      email: 'dilini@slbfe.lk',
      phoneNumber: '+94 77 234 5678',
      severity: 'Medium'
    },
    {
      disciplinaryId: 8,
      employeeId: 'EMP020',
      employeeName: 'Kavinda Dissanayake',
      department: 'Operations',
      actionTypeId: 5,
      actionTypeName: 'Inquiry',
      incidentDate: '2026-01-18',
      loggedDate: '2026-01-19 09:30:00',
      issuedBy: 101,
      issuedByName: 'HR Manager',
      description: 'Investigation commenced regarding allegations of misuse of company resources and unauthorized access to confidential information. Preliminary findings suggest policy violations. Full inquiry in progress.',
      status: 'Active',
      email: 'kavinda@slbfe.lk',
      phoneNumber: '+94 77 456 7890',
      severity: 'High'
    }
  ]);

  // Filter actions
  const filteredActions = disciplinaryActions.filter(action => {
    const matchesType = filterType === 'all' || action.actionTypeId === parseInt(filterType);
    const matchesStatus = filterStatus === 'all' || action.status === filterStatus;
    const matchesSearch = 
      action.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.actionTypeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  // Statistics
  const stats = {
    total: disciplinaryActions.length,
    active: disciplinaryActions.filter(a => a.status === 'Active').length,
    resolved: disciplinaryActions.filter(a => a.status === 'Resolved').length,
    byType: disciplinaryTypes.map(type => ({
      type: type.typeName,
      count: disciplinaryActions.filter(a => a.actionTypeId === type.typeId).length
    }))
  };

  const handleViewDetails = (action: DisciplinaryAction) => {
    setSelectedAction(action);
    setShowDetailsModal(true);
  };

  const handleAddNew = () => {
    setNewAction({
      employeeId: '',
      actionTypeId: 1,
      incidentDate: '',
      description: '',
      severity: 'Medium'
    });
    setShowAddModal(true);
  };

  const handleSubmitNew = () => {
    // In a real app, this would call an API
    console.log('New disciplinary action:', newAction);
    alert('Disciplinary action logged successfully!');
    setShowAddModal(false);
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'Low': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'Resolved': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActionTypeColor = (typeName: string) => {
    switch (typeName) {
      case 'Verbal Warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Written Warning': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Suspension': return 'bg-red-100 text-red-800 border-red-200';
      case 'Termination': return 'bg-red-200 text-red-900 border-red-300';
      case 'Inquiry': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Disciplinary Actions</h2>
          <p className="text-sm text-gray-600 mt-1">
            Log and manage employee disciplinary actions and maintain permanent digital records
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleAddNew}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Log Action</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Actions</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Cases</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.active}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Resolved</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{stats.resolved}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">
                {disciplinaryActions.filter(a => a.loggedDate.startsWith('2026-01')).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b">
          <div className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('actions')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'actions'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Disciplinary Actions
            </button>
            <button
              onClick={() => setActiveTab('statistics')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'statistics'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Statistics & Trends
            </button>
            <button
              onClick={() => setActiveTab('types')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'types'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Action Types
            </button>
          </div>
        </div>

        {/* Disciplinary Actions Tab */}
        {activeTab === 'actions' && (
          <div className="p-6">
            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  {disciplinaryTypes.map(type => (
                    <option key={type.typeId} value={type.typeId}>{type.typeName}</option>
                  ))}
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by employee, type, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full md:w-96 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Security Notice */}
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
              <Lock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 text-sm">Secure & Confidential Records</h4>
                <p className="text-sm text-blue-700 mt-1">
                  All disciplinary actions are permanently stored with encryption and access logging. 
                  These records are confidential and protected under employment law and company policy.
                </p>
              </div>
            </div>

            {/* Actions Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Employee</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Action Type</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Incident Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Severity</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Issued By</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredActions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-gray-500">
                        No disciplinary actions found
                      </td>
                    </tr>
                  ) : (
                    filteredActions.map((action) => (
                      <tr key={action.disciplinaryId} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <span className="font-medium text-gray-900">#{action.disciplinaryId}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{action.employeeName}</p>
                            <p className="text-sm text-gray-500">{action.employeeId} • {action.department}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getActionTypeColor(action.actionTypeName)}`}>
                            {action.actionTypeName}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            <p className="text-gray-900">{action.incidentDate}</p>
                            <p className="text-gray-500">Logged: {action.loggedDate.split(' ')[0]}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(action.severity)}`}>
                            {action.severity}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(action.status)}`}>
                            {action.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-700">{action.issuedByName}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewDetails(action)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {action.documentId && (
                              <button
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Download Document"
                              >
                                <Download className="w-4 h-4" />
                              </button>
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
        )}

        {/* Statistics Tab */}
        {activeTab === 'statistics' && (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Disciplinary Action Statistics</h3>
              <p className="text-sm text-gray-600">Overview of disciplinary actions by type and trends</p>
            </div>

            {/* Actions by Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white border rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                  Actions by Type
                </h4>
                <div className="space-y-4">
                  {stats.byType.map((item, index) => {
                    const percentage = stats.total > 0 ? Math.round((item.count / stats.total) * 100) : 0;
                    return (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">{item.type}</span>
                          <span className="text-sm font-semibold text-gray-900">{item.count} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white border rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <UsersIcon className="w-5 h-5 mr-2 text-blue-600" />
                  Status Overview
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Active Cases</p>
                        <p className="text-xl font-bold text-green-600">{stats.active}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Resolved Cases</p>
                        <p className="text-xl font-bold text-blue-600">{stats.resolved}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Recent Activity</h4>
              <div className="space-y-3">
                {disciplinaryActions.slice(0, 5).map((action) => (
                  <div key={action.disciplinaryId} className="flex items-center justify-between py-3 border-b last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        action.status === 'Active' ? 'bg-green-500' : 
                        action.status === 'Resolved' ? 'bg-blue-500' : 'bg-gray-400'
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{action.actionTypeName} - {action.employeeName}</p>
                        <p className="text-xs text-gray-500">{action.incidentDate}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(action.status)}`}>
                      {action.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Types Tab */}
        {activeTab === 'types' && (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Disciplinary Action Types</h3>
              <p className="text-sm text-gray-600">Standard disciplinary action categories and their descriptions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {disciplinaryTypes.map((type) => {
                const count = stats.byType.find(s => s.type === type.typeName)?.count || 0;
                return (
                  <div key={type.typeId} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 bg-${type.color}-100 rounded-lg flex items-center justify-center`}>
                        <AlertTriangle className={`w-6 h-6 text-${type.color}-600`} />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium bg-${type.color}-100 text-${type.color}-800`}>
                        {count} cases
                      </span>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-2">{type.typeName}</h4>
                    <p className="text-sm text-gray-600 mb-4">{type.description}</p>
                    
                    <div className="pt-4 border-t">
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        View All {type.typeName} →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedAction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Disciplinary Action Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Badges */}
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium border ${getActionTypeColor(selectedAction.actionTypeName)}`}>
                  {selectedAction.actionTypeName}
                </span>
                <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium border ${getSeverityColor(selectedAction.severity)}`}>
                  Severity: {selectedAction.severity}
                </span>
                <span className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium border ${getStatusColor(selectedAction.status)}`}>
                  {selectedAction.status}
                </span>
              </div>

              {/* Employee Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Employee Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Employee Name</p>
                    <p className="font-medium text-gray-900">{selectedAction.employeeName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Employee ID</p>
                    <p className="font-medium text-gray-900">{selectedAction.employeeId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="font-medium text-gray-900">{selectedAction.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contact</p>
                    <p className="font-medium text-gray-900">{selectedAction.phoneNumber}</p>
                  </div>
                </div>
              </div>

              {/* Incident Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Incident Details
                </h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Incident Date</p>
                    <p className="font-medium text-gray-900">{selectedAction.incidentDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Logged Date</p>
                    <p className="font-medium text-gray-900">{selectedAction.loggedDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Issued By</p>
                    <p className="font-medium text-gray-900">{selectedAction.issuedByName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Status</p>
                    <p className="font-medium text-gray-900">{selectedAction.status}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Description & Details
                </h4>
                <p className="text-gray-700 leading-relaxed">{selectedAction.description}</p>
              </div>

              {/* Document Information */}
              {selectedAction.documentId && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                    <Shield className="w-4 h-4 mr-2" />
                    Attached Documentation
                  </h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900">{selectedAction.documentName}</p>
                        <p className="text-sm text-blue-700">Official disciplinary letter</p>
                      </div>
                    </div>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Security Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
                <Lock className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-yellow-900 text-sm">Confidential Record</h4>
                  <p className="text-sm text-yellow-800 mt-1">
                    This is a confidential employee record. Access and modifications are logged for compliance and audit purposes.
                  </p>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3 border-t">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              {selectedAction.status === 'Active' && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Update Status
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add New Action Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Log New Disciplinary Action</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-900 text-sm">Important Notice</h4>
                  <p className="text-sm text-red-800 mt-1">
                    All disciplinary actions are permanent records. Ensure all information is accurate and complete before submission.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newAction.employeeId}
                  onChange={(e) => setNewAction({ ...newAction, employeeId: e.target.value })}
                  placeholder="e.g., EMP001"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={newAction.actionTypeId}
                  onChange={(e) => setNewAction({ ...newAction, actionTypeId: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {disciplinaryTypes.map(type => (
                    <option key={type.typeId} value={type.typeId}>{type.typeName}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Incident Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={newAction.incidentDate}
                  onChange={(e) => setNewAction({ ...newAction, incidentDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Severity Level <span className="text-red-500">*</span>
                </label>
                <select
                  value={newAction.severity}
                  onChange={(e) => setNewAction({ ...newAction, severity: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newAction.description}
                  onChange={(e) => setNewAction({ ...newAction, description: e.target.value })}
                  rows={6}
                  placeholder="Provide detailed description of the incident, actions taken, and any relevant context..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Supporting Document (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX (Max 10MB)</p>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3 border-t">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitNew}
                disabled={!newAction.employeeId || !newAction.incidentDate || !newAction.description}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Log Disciplinary Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisciplinaryActions;
