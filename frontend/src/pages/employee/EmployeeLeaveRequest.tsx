import React, { useState } from 'react';
import { Calendar, Plus, X, Clock, CheckCircle, XCircle, AlertCircle, Filter, Download } from 'lucide-react';

// Types based on database structure
interface LeaveRequest {
  leaveRequestId: number;
  employeeId: string;
  leaveTypeId: number;
  leaveTypeName: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  appliedDate: string;
  approvedBy: number | null;
  approverName?: string;
  remarks: string | null;
}

interface LeaveType {
  leaveTypeId: number;
  leaveTypeName: string;
  maxDays: number;
  description: string;
}

interface LeaveBalance {
  leaveTypeId: number;
  leaveTypeName: string;
  totalEntitled: number;
  used: number;
  pending: number;
  available: number;
}

const EmployeeLeaveRequest = () => {
  const [activeTab, setActiveTab] = useState<'requests' | 'balance' | 'apply'>('requests');
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // Form state for applying leave
  const [leaveForm, setLeaveForm] = useState({
    leaveTypeId: '',
    startDate: '',
    endDate: '',
    reason: ''
  });

  // Dummy Leave Types
  const leaveTypes: LeaveType[] = [
    { leaveTypeId: 1, leaveTypeName: 'Annual Leave', maxDays: 21, description: 'Annual vacation leave' },
    { leaveTypeId: 2, leaveTypeName: 'Sick Leave', maxDays: 14, description: 'Medical leave with certificate' },
    { leaveTypeId: 3, leaveTypeName: 'Casual Leave', maxDays: 7, description: 'Short term casual leave' },
    { leaveTypeId: 4, leaveTypeName: 'Maternity Leave', maxDays: 84, description: 'Maternity leave for female employees' },
    { leaveTypeId: 5, leaveTypeName: 'Paternity Leave', maxDays: 3, description: 'Paternity leave for male employees' },
    { leaveTypeId: 6, leaveTypeName: 'No Pay Leave', maxDays: 365, description: 'Leave without pay' }
  ];

  // Dummy Leave Requests
  const [leaveRequests] = useState<LeaveRequest[]>([
    {
      leaveRequestId: 1,
      employeeId: 'EMP001',
      leaveTypeId: 1,
      leaveTypeName: 'Annual Leave',
      startDate: '2026-02-10',
      endDate: '2026-02-14',
      totalDays: 5,
      reason: 'Family vacation',
      status: 'Approved',
      appliedDate: '2026-01-20',
      approvedBy: 101,
      approverName: 'Sarah Johnson',
      remarks: 'Approved. Enjoy your vacation!'
    },
    {
      leaveRequestId: 2,
      employeeId: 'EMP001',
      leaveTypeId: 2,
      leaveTypeId: 'Sick Leave',
      startDate: '2026-01-15',
      endDate: '2026-01-17',
      totalDays: 3,
      reason: 'Flu and fever - Medical certificate attached',
      status: 'Approved',
      appliedDate: '2026-01-15',
      approvedBy: 101,
      approverName: 'Sarah Johnson',
      remarks: 'Get well soon!'
    },
    {
      leaveRequestId: 3,
      employeeId: 'EMP001',
      leaveTypeId: 3,
      leaveTypeName: 'Casual Leave',
      startDate: '2026-02-05',
      endDate: '2026-02-05',
      totalDays: 1,
      reason: 'Personal work',
      status: 'Pending',
      appliedDate: '2026-01-25',
      approvedBy: null,
      remarks: null
    },
    {
      leaveRequestId: 4,
      employeeId: 'EMP001',
      leaveTypeId: 1,
      leaveTypeName: 'Annual Leave',
      startDate: '2025-12-20',
      endDate: '2025-12-24',
      totalDays: 5,
      reason: 'Year-end holidays',
      status: 'Approved',
      appliedDate: '2025-12-01',
      approvedBy: 101,
      approverName: 'Sarah Johnson',
      remarks: 'Approved'
    },
    {
      leaveRequestId: 5,
      employeeId: 'EMP001',
      leaveTypeId: 2,
      leaveTypeName: 'Sick Leave',
      startDate: '2025-11-10',
      endDate: '2025-11-11',
      totalDays: 2,
      reason: 'Doctor appointment and medical tests',
      status: 'Rejected',
      appliedDate: '2025-11-09',
      approvedBy: 101,
      approverName: 'Sarah Johnson',
      remarks: 'Please use casual leave for appointments. Sick leave requires medical certificate.'
    }
  ]);

  // Dummy Leave Balance
  const leaveBalance: LeaveBalance[] = [
    {
      leaveTypeId: 1,
      leaveTypeName: 'Annual Leave',
      totalEntitled: 21,
      used: 10,
      pending: 0,
      available: 11
    },
    {
      leaveTypeId: 2,
      leaveTypeName: 'Sick Leave',
      totalEntitled: 14,
      used: 5,
      pending: 0,
      available: 9
    },
    {
      leaveTypeId: 3,
      leaveTypeName: 'Casual Leave',
      totalEntitled: 7,
      used: 2,
      pending: 1,
      available: 4
    },
    {
      leaveTypeId: 4,
      leaveTypeName: 'Maternity Leave',
      totalEntitled: 84,
      used: 0,
      pending: 0,
      available: 84
    },
    {
      leaveTypeId: 5,
      leaveTypeName: 'Paternity Leave',
      totalEntitled: 3,
      used: 0,
      pending: 0,
      available: 3
    }
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      'Pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Approved': 'bg-green-100 text-green-700 border-green-200',
      'Rejected': 'bg-red-100 text-red-700 border-red-200',
      'Cancelled': 'bg-gray-100 text-gray-700 border-gray-200'
    };
    
    const icons = {
      'Pending': <Clock className="w-4 h-4" />,
      'Approved': <CheckCircle className="w-4 h-4" />,
      'Rejected': <XCircle className="w-4 h-4" />,
      'Cancelled': <AlertCircle className="w-4 h-4" />
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {status}
      </span>
    );
  };

  const calculateDays = (start: string, end: string): number => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleFormChange = (field: string, value: any) => {
    setLeaveForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleApplyLeave = () => {
    console.log('Applying leave:', leaveForm);
    alert('Leave application submitted successfully!');
    setShowApplyModal(false);
    setLeaveForm({
      leaveTypeId: '',
      startDate: '',
      endDate: '',
      reason: ''
    });
  };

  const filteredRequests = selectedStatus === 'all' 
    ? leaveRequests 
    : leaveRequests.filter(req => req.status.toLowerCase() === selectedStatus.toLowerCase());

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Leave Management</h2>
            <p className="text-gray-600 mt-1">Manage your leave requests and balance</p>
          </div>
          <button
            onClick={() => setShowApplyModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Apply for Leave
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'requests'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Calendar className="w-5 h-5" />
              My Leave Requests
              <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">
                {leaveRequests.length}
              </span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('balance')}
            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === 'balance'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Leave Balance
            </div>
          </button>
        </div>

        {/* Leave Requests Tab */}
        {activeTab === 'requests' && (
          <div className="p-6">
            {/* Filters */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Filter:</span>
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Requests List */}
            <div className="space-y-4">
              {filteredRequests.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No leave requests found</p>
                </div>
              ) : (
                filteredRequests.map((request) => (
                  <div
                    key={request.leaveRequestId}
                    className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {request.leaveTypeName}
                          </h3>
                          {getStatusBadge(request.status)}
                        </div>
                        <p className="text-sm text-gray-600">
                          Request ID: #{request.leaveRequestId.toString().padStart(4, '0')}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Duration</p>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(request.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            {' '}-{' '}
                            {new Date(request.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {request.totalDays} {request.totalDays === 1 ? 'day' : 'days'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Applied Date</p>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(request.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>

                      {request.approverName && (
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Reviewed By</p>
                            <p className="text-sm font-medium text-gray-900">{request.approverName}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {request.reason && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">Reason</p>
                        <p className="text-sm text-gray-700">{request.reason}</p>
                      </div>
                    )}

                    {request.remarks && (
                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Remarks</p>
                        <p className="text-sm text-gray-700">{request.remarks}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Leave Balance Tab */}
        {activeTab === 'balance' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leaveBalance.map((balance) => (
                <div
                  key={balance.leaveTypeId}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {balance.leaveTypeName}
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Entitled</span>
                      <span className="text-lg font-bold text-gray-900">{balance.totalEntitled}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Used</span>
                      <span className="text-lg font-semibold text-red-600">-{balance.used}</span>
                    </div>
                    {balance.pending > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Pending</span>
                        <span className="text-lg font-semibold text-yellow-600">-{balance.pending}</span>
                      </div>
                    )}
                    <div className="pt-3 border-t border-blue-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Available</span>
                        <span className="text-2xl font-bold text-green-600">{balance.available}</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${(balance.used / balance.totalEntitled) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {((balance.used / balance.totalEntitled) * 100).toFixed(0)}% used
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Apply for Leave</h3>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Leave Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leave Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={leaveForm.leaveTypeId}
                  onChange={(e) => handleFormChange('leaveTypeId', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Leave Type</option>
                  {leaveTypes.map((type) => (
                    <option key={type.leaveTypeId} value={type.leaveTypeId}>
                      {type.leaveTypeName} (Max: {type.maxDays} days)
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={leaveForm.startDate}
                    onChange={(e) => handleFormChange('startDate', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={leaveForm.endDate}
                    onChange={(e) => handleFormChange('endDate', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min={leaveForm.startDate}
                    required
                  />
                </div>
              </div>

              {/* Total Days Display */}
              {leaveForm.startDate && leaveForm.endDate && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-sm text-blue-900">
                    <span className="font-semibold">Total Days:</span>{' '}
                    {calculateDays(leaveForm.startDate, leaveForm.endDate)} days
                  </p>
                </div>
              )}

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={leaveForm.reason}
                  onChange={(e) => handleFormChange('reason', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Please provide a reason for your leave request..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {leaveForm.reason.length}/500 characters
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowApplyModal(false)}
                className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyLeave}
                disabled={!leaveForm.leaveTypeId || !leaveForm.startDate || !leaveForm.endDate || !leaveForm.reason}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeLeaveRequest;
