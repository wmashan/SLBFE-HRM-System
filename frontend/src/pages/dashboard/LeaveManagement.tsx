import React, { useState } from 'react';
import {
  Calendar,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Download,
  X,
  User,
  CalendarDays,
  MessageSquare,
  FileText,
  TrendingUp,
  Users,
  CheckCheck,
  Ban
} from 'lucide-react';

interface LeaveRequest {
  leaveRequestId: number;
  employeeId: string;
  employeeName: string;
  department: string;
  leaveTypeId: number;
  leaveTypeName: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string;
  approvedBy?: number;
  approverName?: string;
  remarks?: string;
  email?: string;
  phoneNumber?: string;
  leaveBalance?: number;
}

interface LeaveBalance {
  employeeId: string;
  employeeName: string;
  leaveType: string;
  allocated: number;
  used: number;
  pending: number;
  available: number;
}

const LeaveManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'requests' | 'balances' | 'quotas'>('requests');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Pending' | 'Approved' | 'Rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [actionRemarks, setActionRemarks] = useState('');

  // Mock data for leave requests
  const [leaveRequests] = useState<LeaveRequest[]>([
    {
      leaveRequestId: 1,
      employeeId: 'EMP001',
      employeeName: 'Ashan Wickramanayaka',
      department: 'IT Department',
      leaveTypeId: 1,
      leaveTypeName: 'Annual Leave',
      startDate: '2026-02-10',
      endDate: '2026-02-14',
      totalDays: 5,
      reason: 'Family vacation planned for several months',
      status: 'Pending',
      appliedDate: '2026-01-20',
      email: 'ashan@slbfe.lk',
      phoneNumber: '+94 77 123 4567',
      leaveBalance: 15
    },
    {
      leaveRequestId: 2,
      employeeId: 'EMP002',
      employeeName: 'Nimal Perera',
      department: 'HR Department',
      leaveTypeId: 2,
      leaveTypeName: 'Sick Leave',
      startDate: '2026-01-25',
      endDate: '2026-01-27',
      totalDays: 3,
      reason: 'Medical checkup and recovery from fever',
      status: 'Pending',
      appliedDate: '2026-01-24',
      email: 'nimal@slbfe.lk',
      phoneNumber: '+94 77 234 5678',
      leaveBalance: 12
    },
    {
      leaveRequestId: 3,
      employeeId: 'EMP003',
      employeeName: 'Kasun Silva',
      department: 'Finance Department',
      leaveTypeId: 1,
      leaveTypeName: 'Annual Leave',
      startDate: '2026-01-15',
      endDate: '2026-01-17',
      totalDays: 3,
      reason: 'Attending a family wedding',
      status: 'Approved',
      appliedDate: '2026-01-05',
      approvedBy: 101,
      approverName: 'HR Manager',
      remarks: 'Approved as per policy',
      email: 'kasun@slbfe.lk',
      phoneNumber: '+94 77 345 6789',
      leaveBalance: 11
    },
    {
      leaveRequestId: 4,
      employeeId: 'EMP004',
      employeeName: 'Chamari Fernando',
      department: 'Administration',
      leaveTypeId: 3,
      leaveTypeName: 'Casual Leave',
      startDate: '2026-02-01',
      endDate: '2026-02-02',
      totalDays: 2,
      reason: 'Personal work',
      status: 'Approved',
      appliedDate: '2026-01-22',
      approvedBy: 101,
      approverName: 'HR Manager',
      remarks: 'Leave granted',
      email: 'chamari@slbfe.lk',
      phoneNumber: '+94 77 456 7890',
      leaveBalance: 5
    },
    {
      leaveRequestId: 5,
      employeeId: 'EMP005',
      employeeName: 'Ruwan Jayasinghe',
      department: 'IT Department',
      leaveTypeId: 1,
      leaveTypeName: 'Annual Leave',
      startDate: '2026-03-15',
      endDate: '2026-03-25',
      totalDays: 11,
      reason: 'Extended holiday abroad',
      status: 'Rejected',
      appliedDate: '2026-01-18',
      approvedBy: 101,
      approverName: 'HR Manager',
      remarks: 'Cannot grant leave during peak project phase. Please reschedule.',
      email: 'ruwan@slbfe.lk',
      phoneNumber: '+94 77 567 8901',
      leaveBalance: 14
    },
    {
      leaveRequestId: 6,
      employeeId: 'EMP006',
      employeeName: 'Sanduni Rajapaksa',
      department: 'HR Department',
      leaveTypeId: 4,
      leaveTypeName: 'Maternity Leave',
      startDate: '2026-02-15',
      endDate: '2026-05-15',
      totalDays: 90,
      reason: 'Maternity leave',
      status: 'Pending',
      appliedDate: '2026-01-10',
      email: 'sanduni@slbfe.lk',
      phoneNumber: '+94 77 678 9012',
      leaveBalance: 90
    },
    {
      leaveRequestId: 7,
      employeeId: 'EMP007',
      employeeName: 'Thilina Kumara',
      department: 'Operations',
      leaveTypeId: 2,
      leaveTypeName: 'Sick Leave',
      startDate: '2026-01-28',
      endDate: '2026-01-28',
      totalDays: 1,
      reason: 'Mild fever and headache',
      status: 'Pending',
      appliedDate: '2026-01-27',
      email: 'thilina@slbfe.lk',
      phoneNumber: '+94 77 789 0123',
      leaveBalance: 10
    }
  ]);

  // Mock data for leave balances
  const [leaveBalances] = useState<LeaveBalance[]>([
    {
      employeeId: 'EMP001',
      employeeName: 'Ashan Wickramanayaka',
      leaveType: 'Annual Leave',
      allocated: 21,
      used: 6,
      pending: 5,
      available: 10
    },
    {
      employeeId: 'EMP001',
      employeeName: 'Ashan Wickramanayaka',
      leaveType: 'Sick Leave',
      allocated: 14,
      used: 2,
      pending: 0,
      available: 12
    },
    {
      employeeId: 'EMP002',
      employeeName: 'Nimal Perera',
      leaveType: 'Annual Leave',
      allocated: 21,
      used: 8,
      pending: 0,
      available: 13
    },
    {
      employeeId: 'EMP002',
      employeeName: 'Nimal Perera',
      leaveType: 'Sick Leave',
      allocated: 14,
      used: 2,
      pending: 3,
      available: 9
    },
    {
      employeeId: 'EMP003',
      employeeName: 'Kasun Silva',
      leaveType: 'Annual Leave',
      allocated: 21,
      used: 10,
      pending: 0,
      available: 11
    },
    {
      employeeId: 'EMP004',
      employeeName: 'Chamari Fernando',
      leaveType: 'Casual Leave',
      allocated: 7,
      used: 2,
      pending: 0,
      available: 5
    }
  ]);

  // Mock data for leave quotas/types
  const leaveQuotas = [
    {
      leaveTypeId: 1,
      typeName: 'Annual Leave',
      defaultAllocation: 21,
      description: 'Yearly vacation leave',
      color: 'blue'
    },
    {
      leaveTypeId: 2,
      typeName: 'Sick Leave',
      defaultAllocation: 14,
      description: 'Medical and health-related leave',
      color: 'red'
    },
    {
      leaveTypeId: 3,
      typeName: 'Casual Leave',
      defaultAllocation: 7,
      description: 'Short-term personal leave',
      color: 'green'
    },
    {
      leaveTypeId: 4,
      typeName: 'Maternity Leave',
      defaultAllocation: 90,
      description: 'Maternity leave for female employees',
      color: 'purple'
    }
  ];

  // Filter requests
  const filteredRequests = leaveRequests.filter(request => {
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesSearch = request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.leaveTypeName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Statistics
  const stats = {
    total: leaveRequests.length,
    pending: leaveRequests.filter(r => r.status === 'Pending').length,
    approved: leaveRequests.filter(r => r.status === 'Approved').length,
    rejected: leaveRequests.filter(r => r.status === 'Rejected').length
  };

  const handleViewDetails = (request: LeaveRequest) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleAction = (request: LeaveRequest, type: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setActionType(type);
    setActionRemarks('');
    setShowDetailsModal(false);
    setShowActionModal(true);
  };

  const handleSubmitAction = () => {
    if (!selectedRequest) return;
    
    // In a real app, this would call an API
    console.log('Action:', actionType);
    console.log('Request ID:', selectedRequest.leaveRequestId);
    console.log('Remarks:', actionRemarks);
    
    alert(`Leave request ${actionType === 'approve' ? 'approved' : 'rejected'} successfully!`);
    setShowActionModal(false);
    setActionRemarks('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'Approved': return <CheckCircle className="w-4 h-4" />;
      case 'Rejected': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Leave Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage employee leave requests, track balances, and configure quotas
          </p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
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
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.approved}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{stats.rejected}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b">
          <div className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'requests'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Leave Requests
            </button>
            <button
              onClick={() => setActiveTab('balances')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'balances'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Employee Balances
            </button>
            <button
              onClick={() => setActiveTab('quotas')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'quotas'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Leave Quotas
            </button>
          </div>
        </div>

        {/* Leave Requests Tab */}
        {activeTab === 'requests' && (
          <div className="p-6">
            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by employee name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full md:w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Requests Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Request ID</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Employee</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Leave Type</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Duration</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Days</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Applied Date</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-gray-500">
                        No leave requests found
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((request) => (
                      <tr key={request.leaveRequestId} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <span className="font-medium text-gray-900">#{request.leaveRequestId}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{request.employeeName}</p>
                            <p className="text-sm text-gray-500">{request.employeeId}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-700">{request.leaveTypeName}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            <p className="text-gray-900">{request.startDate}</p>
                            <p className="text-gray-500">to {request.endDate}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-medium text-gray-900">{request.totalDays}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-700">{request.appliedDate}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                            {getStatusIcon(request.status)}
                            <span>{request.status}</span>
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewDetails(request)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {request.status === 'Pending' && (
                              <>
                                <button
                                  onClick={() => handleAction(request, 'approve')}
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Approve"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleAction(request, 'reject')}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Reject"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
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

        {/* Employee Balances Tab */}
        {activeTab === 'balances' && (
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Employee Leave Balances</h3>
              <p className="text-sm text-gray-600">Track leave allocations, usage, and availability for all employees</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Employee</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Leave Type</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Allocated</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Used</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Pending</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Available</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Usage %</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveBalances.map((balance, index) => {
                    const usagePercent = Math.round((balance.used / balance.allocated) * 100);
                    return (
                      <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-gray-900">{balance.employeeName}</p>
                            <p className="text-sm text-gray-500">{balance.employeeId}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-700">{balance.leaveType}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-medium text-gray-900">{balance.allocated}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-medium text-blue-600">{balance.used}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-medium text-yellow-600">{balance.pending}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-medium text-green-600">{balance.available}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                              <div
                                className={`h-2 rounded-full ${
                                  usagePercent > 80 ? 'bg-red-500' : usagePercent > 50 ? 'bg-yellow-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${usagePercent}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{usagePercent}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Leave Quotas Tab */}
        {activeTab === 'quotas' && (
          <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Leave Type Quotas</h3>
                <p className="text-sm text-gray-600">Configure default leave allocations for different leave types</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Add Leave Type
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {leaveQuotas.map((quota) => (
                <div key={quota.leaveTypeId} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 bg-${quota.color}-100 rounded-lg flex items-center justify-center`}>
                        <Calendar className={`w-6 h-6 text-${quota.color}-600`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{quota.typeName}</h4>
                        <p className="text-sm text-gray-500">{quota.description}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Default Allocation</span>
                      <span className="text-2xl font-bold text-gray-900">{quota.defaultAllocation} days</span>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      Edit
                    </button>
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      View History
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Leave Request Details</h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium border ${getStatusColor(selectedRequest.status)}`}>
                  {getStatusIcon(selectedRequest.status)}
                  <span>{selectedRequest.status}</span>
                </span>
                <span className="text-sm text-gray-500">Request #{selectedRequest.leaveRequestId}</span>
              </div>

              {/* Employee Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Employee Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium text-gray-900">{selectedRequest.employeeName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Employee ID</p>
                    <p className="font-medium text-gray-900">{selectedRequest.employeeId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="font-medium text-gray-900">{selectedRequest.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Leave Balance</p>
                    <p className="font-medium text-green-600">{selectedRequest.leaveBalance} days</p>
                  </div>
                </div>
              </div>

              {/* Leave Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  Leave Details
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Leave Type</p>
                    <p className="font-medium text-gray-900">{selectedRequest.leaveTypeName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Days</p>
                    <p className="font-medium text-gray-900">{selectedRequest.totalDays} days</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Start Date</p>
                    <p className="font-medium text-gray-900">{selectedRequest.startDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">End Date</p>
                    <p className="font-medium text-gray-900">{selectedRequest.endDate}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Applied Date</p>
                    <p className="font-medium text-gray-900">{selectedRequest.appliedDate}</p>
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Reason for Leave
                </h4>
                <p className="text-gray-700">{selectedRequest.reason}</p>
              </div>

              {/* Approval Information (if approved or rejected) */}
              {(selectedRequest.status === 'Approved' || selectedRequest.status === 'Rejected') && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Approval Information</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Reviewed By</p>
                      <p className="font-medium text-gray-900">{selectedRequest.approverName || 'N/A'}</p>
                    </div>
                    {selectedRequest.remarks && (
                      <div>
                        <p className="text-sm text-gray-600">Remarks</p>
                        <p className="text-gray-700">{selectedRequest.remarks}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {selectedRequest.status === 'Pending' && (
                <div className="flex space-x-3 pt-4 border-t">
                  <button
                    onClick={() => handleAction(selectedRequest, 'approve')}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleAction(selectedRequest, 'reject')}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                    <span>Reject</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Modal (Approve/Reject) */}
      {showActionModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-lg">
              <h3 className="text-xl font-semibold text-gray-900">
                {actionType === 'approve' ? 'Approve' : 'Reject'} Leave Request
              </h3>
              <button
                onClick={() => setShowActionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Employee</p>
                <p className="font-medium text-gray-900">{selectedRequest.employeeName}</p>
                <p className="text-sm text-gray-500 mt-1">{selectedRequest.employeeId}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Leave Period</p>
                <p className="font-medium text-gray-900">
                  {selectedRequest.startDate} to {selectedRequest.endDate}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedRequest.totalDays} days • {selectedRequest.leaveTypeName}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {actionType === 'approve' ? 'Approval' : 'Rejection'} Remarks
                  {actionType === 'reject' && <span className="text-red-500"> *</span>}
                </label>
                <textarea
                  value={actionRemarks}
                  onChange={(e) => setActionRemarks(e.target.value)}
                  rows={4}
                  placeholder={
                    actionType === 'approve'
                      ? 'Add any comments or conditions for approval (optional)'
                      : 'Please provide a reason for rejection (required)'
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowActionModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitAction}
                  disabled={actionType === 'reject' && !actionRemarks.trim()}
                  className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                    actionType === 'approve'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-red-600 hover:bg-red-700 text-white'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Confirm {actionType === 'approve' ? 'Approval' : 'Rejection'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;
