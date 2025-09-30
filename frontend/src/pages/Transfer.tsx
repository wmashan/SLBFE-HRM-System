import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Building, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Filter, 
  Search, 
  Plus, 
  Eye, 
  Download,
  ChevronDown,
  ChevronUp,
  User,
  ArrowRight,
  FileText
} from 'lucide-react';

interface TransferRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeNumber: string;
  currentPosition: string;
  currentDepartment: string;
  currentBranch: string;
  requestedPosition: string;
  requestedDepartment: string;
  requestedBranch: string;
  transferType: 'Internal' | 'Branch' | 'Department' | 'Position' | 'Promotion';
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'In Review' | 'Completed';
  requestDate: string;
  proposedDate: string;
  actualDate?: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  impactAssessment: string;
  requiresTraining: boolean;
  budgetImpact: number;
  managerApproval?: boolean;
  hrApproval?: boolean;
  financeApproval?: boolean;
  documents?: string[];
}

interface TransferStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  completedTransfers: number;
  averageProcessingTime: number;
  departmentChanges: number;
  branchChanges: number;
}

const Transfer: React.FC = () => {
  const [transferRequests, setTransferRequests] = useState<TransferRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<TransferRequest[]>([]);
  const [stats, setStats] = useState<TransferStats>({
    totalRequests: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    completedTransfers: 0,
    averageProcessingTime: 0,
    departmentChanges: 0,
    branchChanges: 0
  });

  // Filter states
  const [filters, setFilters] = useState({
    status: 'All',
    transferType: 'All',
    department: 'All',
    branch: 'All',
    priority: 'All',
    dateRange: {
      start: '',
      end: ''
    },
    searchTerm: ''
  });

  const [showFilters, setShowFilters] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<TransferRequest | null>(null);
  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'timeline' | 'analytics'>('list');

  // Sample transfer requests data
  const sampleTransferRequests: TransferRequest[] = [
    {
      id: 'TR001',
      employeeId: 'EMP001',
      employeeName: 'Sarah Johnson',
      employeeNumber: 'HR001',
      currentPosition: 'HR Assistant',
      currentDepartment: 'Human Resources',
      currentBranch: 'Head Office',
      requestedPosition: 'HR Coordinator',
      requestedDepartment: 'Human Resources',
      requestedBranch: 'Regional Office',
      transferType: 'Promotion',
      reason: 'Career advancement opportunity and better work-life balance',
      status: 'Pending',
      requestDate: '2024-01-15',
      proposedDate: '2024-03-01',
      priority: 'Medium',
      impactAssessment: 'Minimal impact on current team, replacement needed',
      requiresTraining: true,
      budgetImpact: 5000,
      managerApproval: true,
      hrApproval: false,
      financeApproval: false,
      documents: ['Performance Review', 'Training Certificate']
    },
    {
      id: 'TR002',
      employeeId: 'EMP002',
      employeeName: 'Michael Chen',
      employeeNumber: 'IT001',
      currentPosition: 'Software Developer',
      currentDepartment: 'IT',
      currentBranch: 'Head Office',
      requestedPosition: 'Software Developer',
      requestedDepartment: 'IT',
      requestedBranch: 'Branch A',
      transferType: 'Branch',
      reason: 'Personal relocation due to family circumstances',
      status: 'Approved',
      requestDate: '2024-01-10',
      proposedDate: '2024-02-15',
      actualDate: '2024-02-15',
      approvedBy: 'HR Manager',
      approvedDate: '2024-01-25',
      priority: 'High',
      impactAssessment: 'No impact on productivity, same role at different location',
      requiresTraining: false,
      budgetImpact: 2000,
      managerApproval: true,
      hrApproval: true,
      financeApproval: true,
      documents: ['Relocation Request', 'Manager Recommendation']
    },
    {
      id: 'TR003',
      employeeId: 'EMP003',
      employeeName: 'Emily Rodriguez',
      employeeNumber: 'FN001',
      currentPosition: 'Accountant',
      currentDepartment: 'Finance',
      currentBranch: 'Branch B',
      requestedPosition: 'Senior Accountant',
      requestedDepartment: 'Finance',
      requestedBranch: 'Head Office',
      transferType: 'Promotion',
      reason: 'Seeking growth opportunities and specialized training',
      status: 'In Review',
      requestDate: '2024-01-20',
      proposedDate: '2024-04-01',
      priority: 'Medium',
      impactAssessment: 'Requires replacement at current position, high performer',
      requiresTraining: true,
      budgetImpact: 8000,
      managerApproval: true,
      hrApproval: false,
      financeApproval: false,
      documents: ['Skills Assessment', 'Performance Reviews']
    },
    {
      id: 'TR004',
      employeeId: 'EMP004',
      employeeName: 'David Kumar',
      employeeNumber: 'MK001',
      currentPosition: 'Marketing Specialist',
      currentDepartment: 'Marketing',
      currentBranch: 'Regional Office',
      requestedPosition: 'Marketing Specialist',
      requestedDepartment: 'Sales',
      requestedBranch: 'Regional Office',
      transferType: 'Department',
      reason: 'Interest in sales-focused marketing and cross-functional experience',
      status: 'Rejected',
      requestDate: '2024-01-05',
      proposedDate: '2024-02-20',
      approvedBy: 'Department Head',
      approvedDate: '2024-01-18',
      rejectionReason: 'Current project commitments require completion, insufficient sales experience',
      priority: 'Low',
      impactAssessment: 'Would impact ongoing marketing campaigns',
      requiresTraining: true,
      budgetImpact: 3000,
      managerApproval: false,
      hrApproval: false,
      financeApproval: false,
      documents: ['Transfer Request Form']
    },
    {
      id: 'TR005',
      employeeId: 'EMP005',
      employeeName: 'Lisa Wong',
      employeeNumber: 'OP001',
      currentPosition: 'Operations Coordinator',
      currentDepartment: 'Operations',
      currentBranch: 'Branch C',
      requestedPosition: 'Operations Manager',
      requestedDepartment: 'Operations',
      requestedBranch: 'Head Office',
      transferType: 'Promotion',
      reason: 'Ready for management responsibilities and strategic oversight',
      status: 'Completed',
      requestDate: '2023-12-01',
      proposedDate: '2024-01-15',
      actualDate: '2024-01-15',
      approvedBy: 'Regional Manager',
      approvedDate: '2023-12-20',
      priority: 'High',
      impactAssessment: 'Strong candidate with proven leadership skills',
      requiresTraining: true,
      budgetImpact: 12000,
      managerApproval: true,
      hrApproval: true,
      financeApproval: true,
      documents: ['Leadership Assessment', 'Management Training Certificate', 'Performance History']
    },
    {
      id: 'TR006',
      employeeId: 'EMP006',
      employeeName: 'James Wilson',
      employeeNumber: 'CS001',
      currentPosition: 'Customer Service Rep',
      currentDepartment: 'Customer Service',
      currentBranch: 'Branch A',
      requestedPosition: 'Customer Service Rep',
      requestedDepartment: 'Customer Service',
      requestedBranch: 'Branch D',
      transferType: 'Branch',
      reason: 'Spouse relocation for job opportunity',
      status: 'Pending',
      requestDate: '2024-01-25',
      proposedDate: '2024-03-15',
      priority: 'High',
      impactAssessment: 'Experienced employee, valuable retention',
      requiresTraining: false,
      budgetImpact: 1500,
      managerApproval: true,
      hrApproval: false,
      financeApproval: false,
      documents: ['Spouse Employment Letter', 'Transfer Request']
    },
    {
      id: 'TR007',
      employeeId: 'EMP007',
      employeeName: 'Amanda Taylor',
      employeeNumber: 'QA001',
      currentPosition: 'Quality Analyst',
      currentDepartment: 'Quality Assurance',
      currentBranch: 'Regional Office',
      requestedPosition: 'QA Team Lead',
      requestedDepartment: 'Quality Assurance',
      requestedBranch: 'Head Office',
      transferType: 'Promotion',
      reason: 'Leadership experience and process improvement expertise',
      status: 'In Review',
      requestDate: '2024-01-30',
      proposedDate: '2024-04-15',
      priority: 'Medium',
      impactAssessment: 'Strong technical skills, good leadership potential',
      requiresTraining: true,
      budgetImpact: 7500,
      managerApproval: true,
      hrApproval: false,
      financeApproval: false,
      documents: ['Process Improvement Reports', 'Team Feedback', 'Training Records']
    },
    {
      id: 'TR008',
      employeeId: 'EMP008',
      employeeName: 'Robert Brown',
      employeeNumber: 'SC001',
      currentPosition: 'Security Officer',
      currentDepartment: 'Security',
      currentBranch: 'Head Office',
      requestedPosition: 'Security Supervisor',
      requestedDepartment: 'Security',
      requestedBranch: 'Regional Office',
      transferType: 'Promotion',
      reason: 'Seeking supervisory role and regional experience',
      status: 'Approved',
      requestDate: '2024-01-12',
      proposedDate: '2024-02-28',
      approvedBy: 'Security Manager',
      approvedDate: '2024-01-28',
      priority: 'Medium',
      impactAssessment: 'Excellent security record, natural leader',
      requiresTraining: true,
      budgetImpact: 6000,
      managerApproval: true,
      hrApproval: true,
      financeApproval: true,
      documents: ['Security Clearance', 'Supervisory Training Certificate']
    }
  ];

  // Transfer types and their colors
  const transferTypes = ['All', 'Internal', 'Branch', 'Department', 'Position', 'Promotion'];
  const statusTypes = ['All', 'Pending', 'In Review', 'Approved', 'Rejected', 'Completed'];
  const priorityTypes = ['All', 'Low', 'Medium', 'High', 'Urgent'];
  const departments = ['All', 'Human Resources', 'IT', 'Finance', 'Marketing', 'Operations', 'Customer Service', 'Quality Assurance', 'Security'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'In Review': return 'bg-blue-100 text-blue-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransferTypeColor = (type: string) => {
    switch (type) {
      case 'Promotion': return 'bg-purple-100 text-purple-800';
      case 'Branch': return 'bg-blue-100 text-blue-800';
      case 'Department': return 'bg-indigo-100 text-indigo-800';
      case 'Position': return 'bg-teal-100 text-teal-800';
      case 'Internal': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Initialize data
  useEffect(() => {
    setTransferRequests(sampleTransferRequests);
    setFilteredRequests(sampleTransferRequests);
    calculateStats(sampleTransferRequests);
  }, []);

  // Calculate statistics
  const calculateStats = (requests: TransferRequest[]) => {
    const stats = {
      totalRequests: requests.length,
      pendingRequests: requests.filter(r => r.status === 'Pending').length,
      approvedRequests: requests.filter(r => r.status === 'Approved').length,
      rejectedRequests: requests.filter(r => r.status === 'Rejected').length,
      completedTransfers: requests.filter(r => r.status === 'Completed').length,
      averageProcessingTime: 15, // placeholder
      departmentChanges: requests.filter(r => r.transferType === 'Department').length,
      branchChanges: requests.filter(r => r.transferType === 'Branch').length
    };
    setStats(stats);
  };

  // Filter requests
  useEffect(() => {
    let filtered = transferRequests;

    if (filters.status !== 'All') {
      filtered = filtered.filter(request => request.status === filters.status);
    }

    if (filters.transferType !== 'All') {
      filtered = filtered.filter(request => request.transferType === filters.transferType);
    }

    if (filters.department !== 'All') {
      filtered = filtered.filter(request => 
        request.currentDepartment === filters.department || request.requestedDepartment === filters.department
      );
    }

    if (filters.branch !== 'All') {
      filtered = filtered.filter(request => 
        request.currentBranch === filters.branch || request.requestedBranch === filters.branch
      );
    }

    if (filters.priority !== 'All') {
      filtered = filtered.filter(request => request.priority === filters.priority);
    }

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(request =>
        request.employeeName.toLowerCase().includes(searchLower) ||
        request.employeeNumber.toLowerCase().includes(searchLower) ||
        request.currentPosition.toLowerCase().includes(searchLower) ||
        request.requestedPosition.toLowerCase().includes(searchLower) ||
        request.reason.toLowerCase().includes(searchLower)
      );
    }

    if (filters.dateRange.start && filters.dateRange.end) {
      filtered = filtered.filter(request => {
        const requestDate = new Date(request.requestDate);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        return requestDate >= startDate && requestDate <= endDate;
      });
    }

    setFilteredRequests(filtered);
    calculateStats(filtered);
  }, [filters, transferRequests]);

  const handleApproveRequest = (requestId: string) => {
    const confirmed = window.confirm('Are you sure you want to approve this transfer request?');
    if (confirmed) {
      setTransferRequests(prev => prev.map(request =>
        request.id === requestId
          ? { 
              ...request, 
              status: 'Approved' as const, 
              approvedBy: 'HR Manager', 
              approvedDate: new Date().toISOString().split('T')[0],
              hrApproval: true
            }
          : request
      ));
      
      // Show success notification
      alert('Transfer request approved successfully!');
    }
  };

  const handleRejectRequest = (requestId: string, reason: string) => {
    if (!reason.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to reject this transfer request?');
    if (confirmed) {
      setTransferRequests(prev => prev.map(request =>
        request.id === requestId
          ? { 
              ...request, 
              status: 'Rejected' as const, 
              approvedBy: 'HR Manager', 
              approvedDate: new Date().toISOString().split('T')[0],
              rejectionReason: reason
            }
          : request
      ));
      
      setRejectionReason('');
      setSelectedRequest(null);
      setShowRequestDetails(false);
      
      // Show success notification
      alert('Transfer request rejected successfully!');
    }
  };

  const handleQuickApprove = (requestId: string) => {
    handleApproveRequest(requestId);
  };

  const handleQuickReject = (requestId: string) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason && reason.trim()) {
      handleRejectRequest(requestId, reason.trim());
    }
  };

  const openRequestDetails = (request: TransferRequest) => {
    setSelectedRequest(request);
    setShowRequestDetails(true);
    setRejectionReason('');
  };

  const closeRequestDetails = () => {
    setShowRequestDetails(false);
    setSelectedRequest(null);
    setRejectionReason('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transfer Management</h1>
          <p className="text-gray-600 mt-1">Manage employee transfer requests and approvals</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>New Transfer</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRequests}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <span>All transfer requests</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendingRequests}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <span>Awaiting approval</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approvedRequests}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <span>Successfully approved</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedTransfers}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <Building className="w-6 h-6 text-gray-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <span>Transfers completed</span>
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex justify-between items-center">
        <div className="flex bg-white rounded-lg shadow-sm border">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              viewMode === 'list' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-4 py-2 text-sm font-medium ${
              viewMode === 'timeline' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Timeline
          </button>
          <button
            onClick={() => setViewMode('analytics')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              viewMode === 'analytics' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Analytics
          </button>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 bg-white px-4 py-2 rounded-lg border hover:bg-gray-50"
        >
          <Filter className="w-4 h-4" />
          <span>Filters</span>
          {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow border p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                {statusTypes.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Transfer Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Transfer Type</label>
              <select
                value={filters.transferType}
                onChange={(e) => setFilters({ ...filters, transferType: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                {transferTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Department Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select
                value={filters.department}
                onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
              <select
                value={filters.priority}
                onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                {priorityTypes.map(priority => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                  placeholder="Search transfers..."
                  className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => setFilters({ 
                  ...filters, 
                  dateRange: { ...filters.dateRange, start: e.target.value }
                })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => setFilters({ 
                  ...filters, 
                  dateRange: { ...filters.dateRange, end: e.target.value }
                })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Reset Filters */}
            <div className="flex items-end">
              <button
                onClick={() => setFilters({
                  status: 'All',
                  transferType: 'All',
                  department: 'All',
                  branch: 'All',
                  priority: 'All',
                  dateRange: { start: '', end: '' },
                  searchTerm: ''
                })}
                className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 text-sm"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Transfer Requests ({filteredRequests.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current → Requested
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request Date
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
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{request.employeeName}</div>
                          <div className="text-sm text-gray-500">{request.employeeNumber}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center space-x-2">
                          <span>{request.currentPosition}</span>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{request.requestedPosition}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-500 mt-1">
                          <span>{request.currentDepartment} ({request.currentBranch})</span>
                          <ArrowRight className="w-3 h-3" />
                          <span>{request.requestedDepartment} ({request.requestedBranch})</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTransferTypeColor(request.transferType)}`}>
                        {request.transferType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                        {request.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(request.requestDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => openRequestDetails(request)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-md hover:bg-blue-100"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {request.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleQuickApprove(request.id)}
                            className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded-md hover:bg-green-100"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleQuickReject(request.id)}
                            className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md hover:bg-red-100"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transfer requests found</h3>
              <p className="text-gray-600">Try adjusting your filters or search criteria.</p>
            </div>
          )}
        </div>
      )}

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Transfer Timeline</h3>
          <div className="space-y-6">
            {filteredRequests.map((request, index) => (
              <div key={request.id} className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div className={`w-4 h-4 rounded-full ${
                    request.status === 'Completed' ? 'bg-green-500' :
                    request.status === 'Approved' ? 'bg-blue-500' :
                    request.status === 'Rejected' ? 'bg-red-500' :
                    'bg-yellow-500'
                  }`}></div>
                  {index < filteredRequests.length - 1 && (
                    <div className="w-0.5 h-16 bg-gray-200 mt-2"></div>
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-medium text-gray-900">{request.employeeName}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getTransferTypeColor(request.transferType)}`}>
                      {request.transferType}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">
                    {request.currentPosition} → {request.requestedPosition}
                  </p>
                  <p className="text-sm text-gray-500">
                    Requested: {new Date(request.requestDate).toLocaleDateString()} | 
                    Proposed: {new Date(request.proposedDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-700 mt-2">{request.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics View */}
      {viewMode === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Transfer Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Department Changes</span>
                <span className="font-medium">{stats.departmentChanges}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Branch Changes</span>
                <span className="font-medium">{stats.branchChanges}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average Processing Time</span>
                <span className="font-medium">{stats.averageProcessingTime} days</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Transfer Types Distribution</h3>
            <div className="space-y-3">
              {transferTypes.slice(1).map(type => {
                const count = transferRequests.filter(r => r.transferType === type).length;
                const percentage = transferRequests.length > 0 ? (count / transferRequests.length * 100).toFixed(1) : '0';
                return (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-gray-600">{type}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Request Details Modal */}
      {showRequestDetails && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Transfer Request Details</h3>
              <button
                onClick={closeRequestDetails}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Employee Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Employee Information</h4>
                  <div className="space-y-2">
                    <div><span className="text-gray-600">Name:</span> <span className="font-medium">{selectedRequest.employeeName}</span></div>
                    <div><span className="text-gray-600">Employee ID:</span> <span className="font-medium">{selectedRequest.employeeNumber}</span></div>
                    <div><span className="text-gray-600">Current Position:</span> <span className="font-medium">{selectedRequest.currentPosition}</span></div>
                    <div><span className="text-gray-600">Department:</span> <span className="font-medium">{selectedRequest.currentDepartment}</span></div>
                    <div><span className="text-gray-600">Branch:</span> <span className="font-medium">{selectedRequest.currentBranch}</span></div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Requested Transfer</h4>
                  <div className="space-y-2">
                    <div><span className="text-gray-600">Position:</span> <span className="font-medium">{selectedRequest.requestedPosition}</span></div>
                    <div><span className="text-gray-600">Department:</span> <span className="font-medium">{selectedRequest.requestedDepartment}</span></div>
                    <div><span className="text-gray-600">Branch:</span> <span className="font-medium">{selectedRequest.requestedBranch}</span></div>
                    <div><span className="text-gray-600">Transfer Type:</span> 
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getTransferTypeColor(selectedRequest.transferType)}`}>
                        {selectedRequest.transferType}
                      </span>
                    </div>
                    <div><span className="text-gray-600">Priority:</span> 
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getPriorityColor(selectedRequest.priority)}`}>
                        {selectedRequest.priority}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Request Details */}
              <div className="bg-white border rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Transfer Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div><span className="text-gray-600">Request Date:</span> <span className="font-medium">{new Date(selectedRequest.requestDate).toLocaleDateString()}</span></div>
                  <div><span className="text-gray-600">Proposed Date:</span> <span className="font-medium">{new Date(selectedRequest.proposedDate).toLocaleDateString()}</span></div>
                  <div><span className="text-gray-600">Budget Impact:</span> <span className="font-medium">${selectedRequest.budgetImpact.toLocaleString()}</span></div>
                  <div><span className="text-gray-600">Training Required:</span> <span className="font-medium">{selectedRequest.requiresTraining ? 'Yes' : 'No'}</span></div>
                </div>
                <div className="mb-4">
                  <span className="text-gray-600">Reason:</span>
                  <p className="mt-1 text-gray-900">{selectedRequest.reason}</p>
                </div>
                <div>
                  <span className="text-gray-600">Impact Assessment:</span>
                  <p className="mt-1 text-gray-900">{selectedRequest.impactAssessment}</p>
                </div>
              </div>

              {/* Approval Status */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Approval Status</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    {selectedRequest.managerApproval ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Clock className="w-5 h-5 text-yellow-500" />
                    )}
                    <span className="text-sm">Manager Approval</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedRequest.hrApproval ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Clock className="w-5 h-5 text-yellow-500" />
                    )}
                    <span className="text-sm">HR Approval</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedRequest.financeApproval ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Clock className="w-5 h-5 text-yellow-500" />
                    )}
                    <span className="text-sm">Finance Approval</span>
                  </div>
                </div>
              </div>

              {/* Documents */}
              {selectedRequest.documents && selectedRequest.documents.length > 0 && (
                <div className="bg-white border rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Supporting Documents</h4>
                  <ul className="space-y-2">
                    {selectedRequest.documents.map((doc, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              {selectedRequest.status === 'Pending' && (
                <div className="flex flex-col space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rejection Reason (if rejecting)
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Provide reason for rejection..."
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => handleRejectRequest(selectedRequest.id, rejectionReason)}
                      className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject Transfer</span>
                    </button>
                    <button
                      onClick={() => handleApproveRequest(selectedRequest.id)}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve Transfer</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Status Information */}
              {selectedRequest.status !== 'Pending' && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Status Information</h4>
                  <div className="space-y-1">
                    <div><span className="text-gray-600">Status:</span> 
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedRequest.status)}`}>
                        {selectedRequest.status}
                      </span>
                    </div>
                    {selectedRequest.approvedBy && (
                      <div><span className="text-gray-600">Processed by:</span> <span className="font-medium">{selectedRequest.approvedBy}</span></div>
                    )}
                    {selectedRequest.approvedDate && (
                      <div><span className="text-gray-600">Date:</span> <span className="font-medium">{new Date(selectedRequest.approvedDate).toLocaleDateString()}</span></div>
                    )}
                    {selectedRequest.rejectionReason && (
                      <div><span className="text-gray-600">Rejection Reason:</span> <p className="mt-1 text-gray-900">{selectedRequest.rejectionReason}</p></div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transfer;