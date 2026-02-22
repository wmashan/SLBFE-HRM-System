import { useState, useMemo } from 'react';
import { 
  DollarSign, 
  Search, 
  Download, 
  Edit3, 
  TrendingUp, 
  Users, 
  Calculator,
  Eye,
  Plus,
  Bell,
  Calendar,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';

interface SalaryRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  paymentDate: string;
  status: 'paid' | 'pending' | 'processing';
}

interface SalaryAdjustment {
  id: string;
  employeeId: string;
  employeeName: string;
  currentSalary: number;
  proposedSalary: number;
  adjustmentType: 'increase' | 'decrease' | 'bonus' | 'promotion';
  reason: string;
  effectiveDate: string;
  approvedBy?: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface UpcomingIncrement {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  currentSalary: number;
  incrementAmount: number;
  newSalary: number;
  incrementType: 'annual' | 'performance' | 'promotion' | 'market_adjustment';
  scheduledDate: string;
  notificationDate: string;
  isNotified: boolean;
  approvalRequired: boolean;
  status: 'scheduled' | 'approved' | 'on_hold' | 'processed';
  reason?: string;
  approvedBy?: string;
}

const SalaryManagement = () => {
  const [activeTab, setActiveTab] = useState<'salaries' | 'adjustments' | 'increments' | 'reports'>('salaries');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<SalaryRecord | null>(null);
  
  // Mock data - in real app, this would come from API
  const [salaryRecords] = useState<SalaryRecord[]>([
    {
      id: '1',
      employeeId: 'EMP001',
      employeeName: 'John Doe',
      department: 'Engineering',
      position: 'Software Engineer',
      baseSalary: 120000,
      allowances: 15000,
      deductions: 8000,
      netSalary: 127000,
      paymentDate: '2024-01-31',
      status: 'paid'
    },
    {
      id: '2',
      employeeId: 'EMP002',
      employeeName: 'Jane Smith',
      department: 'HR',
      position: 'HR Manager',
      baseSalary: 110000,
      allowances: 12000,
      deductions: 7500,
      netSalary: 114500,
      paymentDate: '2024-01-31',
      status: 'paid'
    },
    {
      id: '3',
      employeeId: 'EMP003',
      employeeName: 'Mike Johnson',
      department: 'Finance',
      position: 'Financial Analyst',
      baseSalary: 95000,
      allowances: 8000,
      deductions: 6000,
      netSalary: 97000,
      paymentDate: '2024-02-29',
      status: 'processing'
    }
  ]);

  const [adjustmentRequests, setAdjustmentRequests] = useState<SalaryAdjustment[]>([
    {
      id: '1',
      employeeId: 'EMP001',
      employeeName: 'John Doe',
      currentSalary: 120000,
      proposedSalary: 130000,
      adjustmentType: 'increase',
      reason: 'Performance-based salary increase',
      effectiveDate: '2024-03-01',
      status: 'pending'
    },
    {
      id: '2',
      employeeId: 'EMP004',
      employeeName: 'Sarah Wilson',
      currentSalary: 85000,
      proposedSalary: 100000,
      adjustmentType: 'promotion',
      reason: 'Promotion to Senior Developer',
      effectiveDate: '2024-02-15',
      status: 'approved'
    }
  ]);

  const [upcomingIncrements, setUpcomingIncrements] = useState<UpcomingIncrement[]>([
    {
      id: '1',
      employeeId: 'EMP001',
      employeeName: 'John Doe',
      department: 'Engineering',
      position: 'Software Engineer',
      currentSalary: 120000,
      incrementAmount: 12000,
      newSalary: 132000,
      incrementType: 'annual',
      scheduledDate: '2024-12-15',
      notificationDate: '2024-11-15',
      isNotified: false,
      approvalRequired: true,
      status: 'scheduled',
      reason: 'Annual salary increment'
    },
    {
      id: '2',
      employeeId: 'EMP002',
      employeeName: 'Jane Smith',
      department: 'HR',
      position: 'HR Manager',
      currentSalary: 110000,
      incrementAmount: 8000,
      newSalary: 118000,
      incrementType: 'performance',
      scheduledDate: '2024-11-01',
      notificationDate: '2024-10-01',
      isNotified: true,
      approvalRequired: true,
      status: 'approved',
      reason: 'Excellent performance review',
      approvedBy: 'HR Director'
    },
    {
      id: '3',
      employeeId: 'EMP005',
      employeeName: 'Alex Johnson',
      department: 'Finance',
      position: 'Financial Analyst',
      currentSalary: 95000,
      incrementAmount: 5000,
      newSalary: 100000,
      incrementType: 'market_adjustment',
      scheduledDate: '2024-10-30',
      notificationDate: '2024-09-30',
      isNotified: true,
      approvalRequired: false,
      status: 'scheduled',
      reason: 'Market rate adjustment'
    }
  ]);

  const departments = ['All', 'Engineering', 'HR', 'Finance', 'Marketing', 'Operations'];

  const filteredSalaryRecords = salaryRecords.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === '' || selectedDepartment === 'All' || 
                             record.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const calculateStats = () => {
    const totalSalaryBudget = salaryRecords.reduce((sum, record) => sum + record.netSalary, 0);
    const averageSalary = totalSalaryBudget / salaryRecords.length;
    const pendingPayments = salaryRecords.filter(record => record.status === 'pending').length;
    
    return {
      totalSalaryBudget,
      averageSalary,
      pendingPayments,
      totalEmployees: salaryRecords.length
    };
  };

  const stats = calculateStats();

  const handleEditSalary = (record: SalaryRecord) => {
    setSelectedRecord(record);
    setIsEditModalOpen(true);
  };

  const handleApproveAdjustment = (id: string) => {
    setAdjustmentRequests(prev => 
      prev.map(adj => adj.id === id ? { ...adj, status: 'approved' } : adj)
    );
  };

  const handleRejectAdjustment = (id: string) => {
    setAdjustmentRequests(prev => 
      prev.map(adj => adj.id === id ? { ...adj, status: 'rejected' } : adj)
    );
  };

  // Notification logic for upcoming increments
  const getUpcomingIncrementsNotifications = useMemo(() => {
    const today = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(today.getMonth() + 1);
    
    return upcomingIncrements.filter(increment => {
      const scheduledDate = new Date(increment.scheduledDate);
      return scheduledDate <= oneMonthFromNow && scheduledDate >= today && !increment.isNotified;
    });
  }, [upcomingIncrements]);

  const handleApproveIncrement = (id: string) => {
    setUpcomingIncrements(prev => 
      prev.map(inc => inc.id === id ? { ...inc, status: 'approved', approvedBy: 'HR Manager' } : inc)
    );
  };

  const handlePutOnHold = (id: string) => {
    setUpcomingIncrements(prev => 
      prev.map(inc => inc.id === id ? { ...inc, status: 'on_hold' } : inc)
    );
  };

  const handleMarkNotified = (id: string) => {
    setUpcomingIncrements(prev => 
      prev.map(inc => inc.id === id ? { ...inc, isNotified: true } : inc)
    );
  };

  const getDaysUntilIncrement = (scheduledDate: string) => {
    const today = new Date();
    const scheduled = new Date(scheduledDate);
    const diffTime = scheduled.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Salary Management</h1>
          <p className="text-gray-600 mt-1">Manage employee salaries, adjustments, and payroll</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" size="md">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button variant="primary" size="md" onClick={() => setIsAdjustmentModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Adjustment
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Salary Budget</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalSalaryBudget)}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Salary</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.averageSalary)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Payments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingPayments}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Calculator className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'salaries', label: 'Employee Salaries', count: salaryRecords.length },
            { id: 'adjustments', label: 'Salary Adjustments', count: adjustmentRequests.filter(adj => adj.status === 'pending').length },
            { id: 'increments', label: 'Upcoming Increments', count: getUpcomingIncrementsNotifications.length },
            { id: 'reports', label: 'Salary Reports', count: null }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={selectedDepartment}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept === 'All' ? '' : dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow">
        {activeTab === 'salaries' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Base Salary
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Salary
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
                {filteredSalaryRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{record.employeeName}</div>
                        <div className="text-sm text-gray-500">{record.employeeId}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{record.department}</div>
                      <div className="text-sm text-gray-500">{record.position}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(record.baseSalary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(record.netSalary)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditSalary(record)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'adjustments' && (
          <div className="p-6">
            <div className="space-y-4">
              {adjustmentRequests.map((adjustment) => (
                <div key={adjustment.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{adjustment.employeeName}</h3>
                      <p className="text-sm text-gray-600">{adjustment.reason}</p>
                      <div className="mt-2 flex items-center space-x-4 text-sm">
                        <span>Current: {formatCurrency(adjustment.currentSalary)}</span>
                        <span>→</span>
                        <span>Proposed: {formatCurrency(adjustment.proposedSalary)}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(adjustment.status)}`}>
                          {adjustment.status}
                        </span>
                      </div>
                    </div>
                    {adjustment.status === 'pending' && (
                      <div className="flex space-x-2">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleApproveAdjustment(adjustment.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="error"
                          size="sm"
                          onClick={() => handleRejectAdjustment(adjustment.id)}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'increments' && (
          <div className="p-6">
            {/* Notification Alert */}
            {getUpcomingIncrementsNotifications.length > 0 && (
              <div className="mb-6 bg-amber-50 border border-amber-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800">
                      Upcoming Increment Notifications
                    </h3>
                    <div className="mt-2 text-sm text-amber-700">
                      <p>
                        {getUpcomingIncrementsNotifications.length} employee{getUpcomingIncrementsNotifications.length !== 1 ? 's have' : ' has'} increment{getUpcomingIncrementsNotifications.length !== 1 ? 's' : ''} scheduled within the next month that require notification.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Increments List */}
            <div className="space-y-4">
              {upcomingIncrements.map((increment) => {
                const daysUntil = getDaysUntilIncrement(increment.scheduledDate);
                const isUpcoming = daysUntil <= 30 && daysUntil >= 0;
                const isOverdue = daysUntil < 0;
                
                return (
                  <div key={increment.id} className={`border rounded-lg p-6 ${
                    isOverdue ? 'border-red-200 bg-red-50' : 
                    isUpcoming && !increment.isNotified ? 'border-amber-200 bg-amber-50' : 
                    'border-gray-200 bg-white'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{increment.employeeName}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            increment.status === 'approved' ? 'bg-green-100 text-green-800' :
                            increment.status === 'on_hold' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {increment.status.replace('_', ' ')}
                          </span>
                          {isUpcoming && !increment.isNotified && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                              <Bell className="w-3 h-3 mr-1" />
                              Notify Required
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-gray-500">Department:</span>
                            <p className="font-medium">{increment.department}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Position:</span>
                            <p className="font-medium">{increment.position}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Current Salary:</span>
                            <p className="font-medium">{formatCurrency(increment.currentSalary)}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">New Salary:</span>
                            <p className="font-medium text-green-600">{formatCurrency(increment.newSalary)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">Scheduled: {new Date(increment.scheduledDate).toLocaleDateString()}</span>
                          </div>
                          <div className={`font-medium ${
                            isOverdue ? 'text-red-600' :
                            isUpcoming ? 'text-amber-600' :
                            'text-green-600'
                          }`}>
                            {isOverdue ? `${Math.abs(daysUntil)} days overdue` :
                             daysUntil === 0 ? 'Due today' :
                             daysUntil <= 30 ? `${daysUntil} days remaining` :
                             'Scheduled'}
                          </div>
                          <div className="flex items-center space-x-1">
                            <span className="text-gray-600">Increment: </span>
                            <span className="font-medium text-green-600">+{formatCurrency(increment.incrementAmount)}</span>
                          </div>
                        </div>
                        
                        {increment.reason && (
                          <p className="text-sm text-gray-600 mt-2">{increment.reason}</p>
                        )}
                      </div>
                      
                      <div className="flex flex-col space-y-2 ml-4">
                        {increment.status === 'scheduled' && increment.approvalRequired && (
                          <>
                            <Button
                              variant="success"
                              size="sm"
                              onClick={() => handleApproveIncrement(increment.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="error"
                              size="sm"
                              onClick={() => handlePutOnHold(increment.id)}
                            >
                              Put on Hold
                            </Button>
                          </>
                        )}
                        {isUpcoming && !increment.isNotified && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleMarkNotified(increment.id)}
                          >
                            <Bell className="w-4 h-4 mr-1" />
                            Mark Notified
                          </Button>
                        )}
                        {increment.status === 'approved' && (
                          <span className="text-xs text-green-600 font-medium flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Ready to Process
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {upcomingIncrements.length === 0 && (
                <div className="text-center py-12">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No Upcoming Increments</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    No salary increments are currently scheduled
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="p-6">
            <div className="text-center py-12">
              <Calculator className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Salary Reports</h3>
              <p className="mt-1 text-sm text-gray-500">
                Generate detailed salary reports and analytics
              </p>
              <div className="mt-6">
                <Button variant="primary">Generate Report</Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Salary Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Salary Details"
        size="lg"
      >
        {selectedRecord && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Base Salary</label>
                <Input
                  type="number"
                  defaultValue={selectedRecord.baseSalary}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Allowances</label>
                <Input
                  type="number"
                  defaultValue={selectedRecord.allowances}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Deductions</label>
                <Input
                  type="number"
                  defaultValue={selectedRecord.deductions}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary">
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* New Adjustment Modal */}
      <Modal
        isOpen={isAdjustmentModalOpen}
        onClose={() => setIsAdjustmentModalOpen(false)}
        title="Request Salary Adjustment"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Employee</label>
            <select className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="">Select Employee</option>
              {salaryRecords.map((record) => (
                <option key={record.employeeId} value={record.employeeId}>
                  {record.employeeName} - {record.employeeId}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Salary</label>
              <Input type="number" placeholder="Current salary" className="mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Proposed Salary</label>
              <Input type="number" placeholder="Proposed salary" className="mt-1" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Adjustment Type</label>
            <select className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="increase">Salary Increase</option>
              <option value="decrease">Salary Decrease</option>
              <option value="bonus">Bonus</option>
              <option value="promotion">Promotion</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reason</label>
            <textarea
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
              placeholder="Reason for adjustment..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Effective Date</label>
            <Input type="date" className="mt-1" />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsAdjustmentModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary">
              Submit Request
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SalaryManagement;