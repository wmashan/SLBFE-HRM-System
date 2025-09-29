import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Filter, 
  Search, 
  Plus, 
  Eye, 
  Download,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  User
} from 'lucide-react';

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  position: string;
  department: string;
  branch: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
  emergencyContact?: string;
  coveringEmployee?: string;
  documents?: string[];
}

interface LeaveBalance {
  employeeId: string;
  annual: number;
  sick: number;
  casual: number;
  maternity: number;
  paternity: number;
  study: number;
  unpaid: number;
}

interface LeaveStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  totalDaysRequested: number;
  averageProcessingTime: number;
}

const StaffLeave: React.FC = () => {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<LeaveRequest[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [stats, setStats] = useState<LeaveStats>({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    totalDaysRequested: 0,
    averageProcessingTime: 0
  });

  // Filter states
  const [filters, setFilters] = useState({
    status: 'All',
    leaveType: 'All',
    department: 'All',
    branch: 'All',
    dateRange: {
      start: '',
      end: ''
    },
    searchTerm: ''
  });

  const [showFilters, setShowFilters] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'balance'>('list');

  // Sample data
  const sampleLeaveRequests: LeaveRequest[] = [
    {
      id: 'LR001',
      employeeId: 'EMP001',
      employeeName: 'John Doe',
      employeeNumber: 'HR001',
      position: 'Senior Manager',
      department: 'Human Resources',
      branch: 'Head Office',
      leaveType: 'Annual',
      startDate: '2025-10-15',
      endDate: '2025-10-20',
      days: 6,
      reason: 'Family vacation to Maldives',
      status: 'Pending',
      appliedDate: '2025-09-25',
      emergencyContact: '+94771234567',
      coveringEmployee: 'Jane Smith'
    },
    {
      id: 'LR002',
      employeeId: 'EMP002',
      employeeName: 'Sarah Wilson',
      employeeNumber: 'IT002',
      position: 'Software Developer',
      department: 'IT',
      branch: 'Colombo Branch',
      leaveType: 'Medical',
      startDate: '2025-09-28',
      endDate: '2025-09-30',
      days: 3,
      reason: 'Medical treatment - Doctor appointment and recovery',
      status: 'Approved',
      appliedDate: '2025-09-27',
      approvedBy: 'Manager IT',
      approvedDate: '2025-09-27',
      emergencyContact: '+94777654321'
    },
    {
      id: 'LR003',
      employeeId: 'EMP003',
      employeeName: 'Michael Brown',
      employeeNumber: 'FN003',
      position: 'Accountant',
      department: 'Finance',
      branch: 'Kandy Branch',
      leaveType: 'Casual',
      startDate: '2025-10-01',
      endDate: '2025-10-01',
      days: 1,
      reason: 'Personal family matters',
      status: 'Rejected',
      appliedDate: '2025-09-20',
      rejectionReason: 'Month-end closing activities require your presence',
      emergencyContact: '+94712345678'
    },
    {
      id: 'LR004',
      employeeId: 'EMP004',
      employeeName: 'Emily Davis',
      employeeNumber: 'HR004',
      position: 'HR Assistant',
      department: 'Human Resources',
      branch: 'Head Office',
      leaveType: 'Maternity',
      startDate: '2025-11-01',
      endDate: '2026-02-01',
      days: 92,
      reason: 'Maternity leave',
      status: 'Approved',
      appliedDate: '2025-09-15',
      approvedBy: 'HR Manager',
      approvedDate: '2025-09-16',
      emergencyContact: '+94765432109'
    },
    {
      id: 'LR005',
      employeeId: 'EMP005',
      employeeName: 'David Johnson',
      employeeNumber: 'MK005',
      position: 'Marketing Executive',
      department: 'Marketing',
      branch: 'Galle Branch',
      leaveType: 'Annual',
      startDate: '2025-10-10',
      endDate: '2025-10-14',
      days: 5,
      reason: 'Wedding anniversary celebration',
      status: 'Pending',
      appliedDate: '2025-09-28',
      emergencyContact: '+94712456789',
      coveringEmployee: 'Lisa Anderson'
    },
    {
      id: 'LR006',
      employeeId: 'EMP006',
      employeeName: 'Rachel Green',
      employeeNumber: 'IT006',
      position: 'UI/UX Designer',
      department: 'IT',
      branch: 'Colombo Branch',
      leaveType: 'Medical',
      startDate: '2025-10-02',
      endDate: '2025-10-04',
      days: 3,
      reason: 'Surgery and post-operative care',
      status: 'Pending',
      appliedDate: '2025-09-29',
      emergencyContact: '+94771987654',
      coveringEmployee: 'Tom Wilson'
    },
    {
      id: 'LR007',
      employeeId: 'EMP007',
      employeeName: 'James Wilson',
      employeeNumber: 'OP007',
      position: 'Operations Manager',
      department: 'Operations',
      branch: 'Head Office',
      leaveType: 'Casual',
      startDate: '2025-10-05',
      endDate: '2025-10-05',
      days: 1,
      reason: 'Child school event',
      status: 'Pending',
      appliedDate: '2025-09-26',
      emergencyContact: '+94765987432'
    },
    {
      id: 'LR008',
      employeeId: 'EMP008',
      employeeName: 'Lisa Anderson',
      employeeNumber: 'MK008',
      position: 'Marketing Assistant',
      department: 'Marketing',
      branch: 'Kandy Branch',
      leaveType: 'No Pay',
      startDate: '2025-10-12',
      endDate: '2025-10-19',
      days: 8,
      reason: 'Extended personal travel - no leave balance available',
      status: 'Pending',
      appliedDate: '2025-09-22',
      emergencyContact: '+94777456123'
    },
    {
      id: 'LR009',
      employeeId: 'EMP009',
      employeeName: 'Robert Clark',
      employeeNumber: 'FN009',
      position: 'Finance Officer',
      department: 'Finance',
      branch: 'Head Office',
      leaveType: 'Medical',
      startDate: '2025-09-30',
      endDate: '2025-10-02',
      days: 3,
      reason: 'Emergency medical treatment',
      status: 'Approved',
      appliedDate: '2025-09-29',
      approvedBy: 'Finance Manager',
      approvedDate: '2025-09-29',
      emergencyContact: '+94712789456'
    },
    {
      id: 'LR010',
      employeeId: 'EMP010',
      employeeName: 'Monica Taylor',
      employeeNumber: 'HR010',
      position: 'HR Coordinator',
      department: 'Human Resources',
      branch: 'Galle Branch',
      leaveType: 'Annual',
      startDate: '2025-11-15',
      endDate: '2025-11-22',
      days: 8,
      reason: 'Family reunion and vacation',
      status: 'Approved',
      appliedDate: '2025-09-20',
      approvedBy: 'HR Manager',
      approvedDate: '2025-09-21',
      emergencyContact: '+94765123789'
    },
    {
      id: 'LR011',
      employeeId: 'EMP011',
      employeeName: 'Kevin Martinez',
      employeeNumber: 'IT011',
      position: 'System Administrator',
      department: 'IT',
      branch: 'Head Office',
      leaveType: 'No Pay',
      startDate: '2025-10-25',
      endDate: '2025-10-27',
      days: 3,
      reason: 'Personal emergency - exceeded leave quota',
      status: 'Pending',
      appliedDate: '2025-09-24',
      emergencyContact: '+94771654321'
    },
    {
      id: 'LR012',
      employeeId: 'EMP012',
      employeeName: 'Amanda White',
      employeeNumber: 'OP012',
      position: 'Operations Coordinator',
      department: 'Operations',
      branch: 'Colombo Branch',
      leaveType: 'Casual',
      startDate: '2025-10-08',
      endDate: '2025-10-09',
      days: 2,
      reason: 'Home repairs and maintenance',
      status: 'Approved',
      appliedDate: '2025-09-23',
      approvedBy: 'Operations Manager',
      approvedDate: '2025-09-24',
      emergencyContact: '+94712654987'
    }
  ];

  const sampleLeaveBalances: LeaveBalance[] = [
    { employeeId: 'EMP001', annual: 18, sick: 10, casual: 5, maternity: 0, paternity: 0, study: 3, unpaid: 0 },
    { employeeId: 'EMP002', annual: 22, sick: 8, casual: 7, maternity: 0, paternity: 0, study: 0, unpaid: 0 },
    { employeeId: 'EMP003', annual: 15, sick: 12, casual: 3, maternity: 0, paternity: 2, study: 0, unpaid: 0 },
    { employeeId: 'EMP004', annual: 20, sick: 7, casual: 6, maternity: 92, paternity: 0, study: 0, unpaid: 0 },
    { employeeId: 'EMP005', annual: 25, sick: 14, casual: 8, maternity: 0, paternity: 0, study: 2, unpaid: 0 },
    { employeeId: 'EMP006', annual: 16, sick: 9, casual: 4, maternity: 0, paternity: 0, study: 0, unpaid: 0 },
    { employeeId: 'EMP007', annual: 21, sick: 11, casual: 6, maternity: 0, paternity: 7, study: 0, unpaid: 0 },
    { employeeId: 'EMP008', annual: 0, sick: 2, casual: 1, maternity: 0, paternity: 0, study: 0, unpaid: 8 },
    { employeeId: 'EMP009', annual: 19, sick: 6, casual: 5, maternity: 0, paternity: 0, study: 4, unpaid: 0 },
    { employeeId: 'EMP010', annual: 12, sick: 15, casual: 7, maternity: 0, paternity: 0, study: 0, unpaid: 0 },
    { employeeId: 'EMP011', annual: 2, sick: 8, casual: 3, maternity: 0, paternity: 0, study: 0, unpaid: 3 },
    { employeeId: 'EMP012', annual: 17, sick: 13, casual: 4, maternity: 0, paternity: 0, study: 1, unpaid: 0 }
  ];

  const leaveTypes = ['Annual', 'Sick', 'Casual', 'Medical', 'Maternity', 'Paternity', 'Study', 'No Pay'];
  const departments = ['Human Resources', 'IT', 'Finance', 'Marketing', 'Operations'];
  const branches = ['Head Office', 'Colombo Branch', 'Kandy Branch', 'Galle Branch'];

  useEffect(() => {
    setLeaveRequests(sampleLeaveRequests);
    setLeaveBalances(sampleLeaveBalances);
    
    // Calculate stats
    const totalRequests = sampleLeaveRequests.length;
    const pendingRequests = sampleLeaveRequests.filter(req => req.status === 'Pending').length;
    const approvedRequests = sampleLeaveRequests.filter(req => req.status === 'Approved').length;
    const rejectedRequests = sampleLeaveRequests.filter(req => req.status === 'Rejected').length;
    const totalDaysRequested = sampleLeaveRequests.reduce((sum, req) => sum + req.days, 0);
    
    setStats({
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      totalDaysRequested,
      averageProcessingTime: 2.5
    });
  }, []);

  useEffect(() => {
    let filtered = [...leaveRequests];

    // Apply filters
    if (filters.status !== 'All') {
      filtered = filtered.filter(req => req.status === filters.status);
    }
    if (filters.leaveType !== 'All') {
      filtered = filtered.filter(req => req.leaveType === filters.leaveType);
    }
    if (filters.department !== 'All') {
      filtered = filtered.filter(req => req.department === filters.department);
    }
    if (filters.branch !== 'All') {
      filtered = filtered.filter(req => req.branch === filters.branch);
    }
    if (filters.dateRange.start) {
      filtered = filtered.filter(req => req.appliedDate >= filters.dateRange.start);
    }
    if (filters.dateRange.end) {
      filtered = filtered.filter(req => req.appliedDate <= filters.dateRange.end);
    }
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(req =>
        req.employeeName.toLowerCase().includes(searchLower) ||
        req.employeeNumber.toLowerCase().includes(searchLower) ||
        req.id.toLowerCase().includes(searchLower)
      );
    }

    setFilteredRequests(filtered);
  }, [leaveRequests, filters]);

  const handleApproveRequest = (requestId: string) => {
    const currentDate = new Date().toISOString().split('T')[0];
    setLeaveRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { 
            ...req, 
            status: 'Approved' as const, 
            approvedBy: 'HR Manager', 
            approvedDate: currentDate 
          }
        : req
    ));
    
    // Update stats
    setStats(prev => ({
      ...prev,
      pendingRequests: prev.pendingRequests - 1,
      approvedRequests: prev.approvedRequests + 1
    }));
    
    setSelectedRequest(null);
    setShowRequestDetails(false);
    
    // Show success notification
    alert(`Leave request ${requestId} has been approved successfully!`);
  };

  const handleRejectRequest = (requestId: string) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }
    
    setLeaveRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: 'Rejected' as const, rejectionReason }
        : req
    ));
    
    // Update stats
    setStats(prev => ({
      ...prev,
      pendingRequests: prev.pendingRequests - 1,
      rejectedRequests: prev.rejectedRequests + 1
    }));
    
    setSelectedRequest(null);
    setShowRequestDetails(false);
    setRejectionReason('');
    
    // Show success notification
    alert(`Leave request ${requestId} has been rejected with reason: "${rejectionReason}"`);
  };

  const handleQuickApprove = (requestId: string, requestName: string) => {
    const confirmed = window.confirm(`Are you sure you want to approve the leave request for ${requestName}?`);
    if (confirmed) {
      handleApproveRequest(requestId);
    }
  };

  const handleQuickReject = (request: LeaveRequest) => {
    const reason = window.prompt(`Enter rejection reason for ${request.employeeName}'s leave request:`);
    if (reason && reason.trim()) {
      setRejectionReason(reason);
      
      setLeaveRequests(prev => prev.map(req => 
        req.id === request.id 
          ? { ...req, status: 'Rejected' as const, rejectionReason: reason }
          : req
      ));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        pendingRequests: prev.pendingRequests - 1,
        rejectedRequests: prev.rejectedRequests + 1
      }));
      
      alert(`Leave request ${request.id} has been rejected with reason: "${reason}"`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'text-green-600 bg-green-100';
      case 'Rejected': return 'text-red-600 bg-red-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'Annual': return 'text-blue-600 bg-blue-100';
      case 'Sick': return 'text-red-600 bg-red-100';
      case 'Medical': return 'text-red-700 bg-red-200';
      case 'Casual': return 'text-green-600 bg-green-100';
      case 'Maternity': return 'text-pink-600 bg-pink-100';
      case 'Paternity': return 'text-purple-600 bg-purple-100';
      case 'Study': return 'text-indigo-600 bg-indigo-100';
      case 'No Pay': return 'text-orange-600 bg-orange-100';
      case 'Unpaid': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const clearFilters = () => {
    setFilters({
      status: 'All',
      leaveType: 'All',
      department: 'All',
      branch: 'All',
      dateRange: { start: '', end: '' },
      searchTerm: ''
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.status !== 'All') count++;
    if (filters.leaveType !== 'All') count++;
    if (filters.department !== 'All') count++;
    if (filters.branch !== 'All') count++;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    if (filters.searchTerm) count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Staff Leave Management</h1>
          <p className="text-gray-600">Manage employee leave requests, approvals, and balances</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRequests}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingRequests}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approvedRequests}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Days</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalDaysRequested}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                List View
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 rounded-md ${viewMode === 'calendar' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                Calendar View
              </button>
              <button
                onClick={() => setViewMode('balance')}
                className={`px-4 py-2 rounded-md ${viewMode === 'balance' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                Leave Balance
              </button>
            </div>
            <div className="flex space-x-2">
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                <Plus className="h-4 w-4" />
                <span>New Request</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                  {getActiveFilterCount() > 0 && (
                    <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                      {getActiveFilterCount()}
                    </span>
                  )}
                  {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, employee number, or request ID..."
                    value={filters.searchTerm}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-80 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              {getActiveFilterCount() > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>

          {showFilters && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                  <select
                    value={filters.leaveType}
                    onChange={(e) => setFilters(prev => ({ ...prev, leaveType: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="All">All Types</option>
                    {leaveTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    value={filters.department}
                    onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="All">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                  <select
                    value={filters.branch}
                    onChange={(e) => setFilters(prev => ({ ...prev, branch: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="All">All Branches</option>
                    {branches.map(branch => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                  <input
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      dateRange: { ...prev.dateRange, start: e.target.value }
                    }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                  <input
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) => setFilters(prev => ({ 
                      ...prev, 
                      dateRange: { ...prev.dateRange, end: e.target.value }
                    }))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Content based on view mode */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  Leave Requests ({filteredRequests.length})
                </h2>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Leave Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{request.employeeName}</div>
                            <div className="text-sm text-gray-500">{request.employeeNumber}</div>
                            <div className="text-xs text-gray-400">{request.position}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLeaveTypeColor(request.leaveType)}`}>
                            {request.leaveType}
                          </span>
                          <div className="text-sm text-gray-900 mt-1">ID: {request.id}</div>
                          <div className="text-xs text-gray-500">Applied: {request.appliedDate}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {request.startDate} to {request.endDate}
                        </div>
                        <div className="text-xs text-gray-500">{request.days} days</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowRequestDetails(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {request.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => handleQuickApprove(request.id, request.employeeName)}
                                className="text-green-600 hover:text-green-900"
                                title="Quick Approve"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleQuickReject(request)}
                                className="text-red-600 hover:text-red-900"
                                title="Quick Reject"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredRequests.length === 0 && (
              <div className="text-center py-12">
                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No leave requests found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {getActiveFilterCount() > 0 ? 'Try adjusting your filters' : 'No leave requests have been submitted yet.'}
                </p>
              </div>
            )}
          </div>
        )}

        {viewMode === 'calendar' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Leave Calendar</h2>
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Calendar View</h3>
              <p className="mt-1 text-sm text-gray-500">Calendar integration will be implemented here</p>
            </div>
          </div>
        )}

        {viewMode === 'balance' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Leave Balance Summary</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Annual
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sick
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Casual
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Maternity
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Study
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Available
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {leaveBalances.map((balance) => {
                    const employee = sampleLeaveRequests.find(req => req.employeeId === balance.employeeId);
                    const totalAvailable = balance.annual + balance.sick + balance.casual + balance.maternity + balance.study;
                    
                    return (
                      <tr key={balance.employeeId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                <User className="h-5 w-5 text-gray-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{employee?.employeeName || 'Unknown'}</div>
                              <div className="text-sm text-gray-500">{employee?.employeeNumber || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-sm font-medium text-blue-600">{balance.annual}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-sm font-medium text-red-600">{balance.sick}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-sm font-medium text-green-600">{balance.casual}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-sm font-medium text-pink-600">{balance.maternity}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-sm font-medium text-indigo-600">{balance.study}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-sm font-bold text-gray-900">{totalAvailable}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Request Details Modal */}
        {showRequestDetails && selectedRequest && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium text-gray-900">Leave Request Details</h3>
                  <button
                    onClick={() => {
                      setShowRequestDetails(false);
                      setSelectedRequest(null);
                      setRejectionReason('');
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Employee Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Employee Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Name:</span> {selectedRequest.employeeName}</div>
                      <div><span className="font-medium">Employee ID:</span> {selectedRequest.employeeNumber}</div>
                      <div><span className="font-medium">Position:</span> {selectedRequest.position}</div>
                      <div><span className="font-medium">Department:</span> {selectedRequest.department}</div>
                      <div><span className="font-medium">Branch:</span> {selectedRequest.branch}</div>
                    </div>
                  </div>

                  {/* Leave Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Leave Information
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Request ID:</span> {selectedRequest.id}</div>
                      <div><span className="font-medium">Leave Type:</span> 
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLeaveTypeColor(selectedRequest.leaveType)}`}>
                          {selectedRequest.leaveType}
                        </span>
                      </div>
                      <div><span className="font-medium">Duration:</span> {selectedRequest.days} days</div>
                      <div><span className="font-medium">From:</span> {selectedRequest.startDate}</div>
                      <div><span className="font-medium">To:</span> {selectedRequest.endDate}</div>
                      <div><span className="font-medium">Applied Date:</span> {selectedRequest.appliedDate}</div>
                    </div>
                  </div>

                  {/* Reason & Additional Info */}
                  <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-3">Additional Information</h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="font-medium">Reason:</span>
                        <p className="mt-1 text-gray-700">{selectedRequest.reason}</p>
                      </div>
                      {selectedRequest.emergencyContact && (
                        <div><span className="font-medium">Emergency Contact:</span> {selectedRequest.emergencyContact}</div>
                      )}
                      {selectedRequest.coveringEmployee && (
                        <div><span className="font-medium">Covering Employee:</span> {selectedRequest.coveringEmployee}</div>
                      )}
                      <div><span className="font-medium">Status:</span> 
                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                          {selectedRequest.status}
                        </span>
                      </div>
                      {selectedRequest.approvedBy && (
                        <div><span className="font-medium">Approved By:</span> {selectedRequest.approvedBy} on {selectedRequest.approvedDate}</div>
                      )}
                      {selectedRequest.rejectionReason && (
                        <div>
                          <span className="font-medium">Rejection Reason:</span>
                          <p className="mt-1 text-red-600">{selectedRequest.rejectionReason}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {selectedRequest.status === 'Pending' && (
                  <div className="mt-6 border-t pt-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 mr-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rejection Reason (if rejecting)
                        </label>
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          rows={3}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter reason for rejection..."
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleApproveRequest(selectedRequest.id)}
                          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleRejectRequest(selectedRequest.id)}
                          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffLeave;