import { useState } from 'react';
import { 
  CreditCard, 
  Search, 
  Download, 
  Edit3, 
  DollarSign, 
  Clock,
  Eye,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Calculator,
  TrendingUp,
  X
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';

interface StaffLoan {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  loanType: 'personal' | 'medical' | 'education' | 'housing' | 'emergency' | 'vehicle';
  loanAmount: number;
  approvedAmount?: number;
  interestRate: number;
  repaymentPeriod: number; // in months
  monthlyInstallment: number;
  applicationDate: string;
  approvalDate?: string;
  disbursementDate?: string;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed' | 'active' | 'completed' | 'defaulted';
  approvedBy?: string;
  remainingBalance: number;
  totalPaid: number;
  nextPaymentDate?: string;
  guarantor1?: string;
  guarantor2?: string;
  purpose: string;
  documents: string[];
  comments?: string;
}

interface LoanRepayment {
  id: string;
  loanId: string;
  employeeId: string;
  paymentDate: string;
  amount: number;
  principalAmount: number;
  interestAmount: number;
  remainingBalance: number;
  paymentMethod: 'salary_deduction' | 'cash' | 'bank_transfer' | 'cheque';
  status: 'scheduled' | 'paid' | 'overdue' | 'partial';
  receiptNumber?: string;
}

interface LoanApplication {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  requestedAmount: number;
  loanType: string;
  purpose: string;
  guarantor1: string;
  guarantor2: string;
  submissionDate: string;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected';
  reviewedBy?: string;
  comments?: string;
}

const StaffLoanManagement = () => {
  const [activeTab, setActiveTab] = useState<'active_loans' | 'applications' | 'repayments' | 'reports'>('active_loans');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [isLoanDetailsModalOpen, setIsLoanDetailsModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<StaffLoan | null>(null);
  
  // Mock data - in real app, this would come from API
  const [staffLoans] = useState<StaffLoan[]>([
    {
      id: 'L001',
      employeeId: 'EMP001',
      employeeName: 'John Smith',
      department: 'Engineering',
      position: 'Senior Engineer',
      loanType: 'personal',
      loanAmount: 500000,
      approvedAmount: 500000,
      interestRate: 8.5,
      repaymentPeriod: 24,
      monthlyInstallment: 23500,
      applicationDate: '2024-01-15',
      approvalDate: '2024-01-22',
      disbursementDate: '2024-02-01',
      status: 'active',
      approvedBy: 'HR Manager',
      remainingBalance: 420000,
      totalPaid: 80000,
      nextPaymentDate: '2024-11-01',
      guarantor1: 'Jane Doe (EMP002)',
      guarantor2: 'Mike Johnson (EMP003)',
      purpose: 'Home renovation and family medical expenses',
      documents: ['Application Form', 'Salary Certificate', 'Bank Statement', 'Guarantor Forms'],
      comments: 'Approved based on excellent service record and stable employment'
    },
    {
      id: 'L002',
      employeeId: 'EMP005',
      employeeName: 'Sarah Wilson',
      department: 'HR',
      position: 'HR Officer',
      loanType: 'education',
      loanAmount: 300000,
      approvedAmount: 250000,
      interestRate: 6.0,
      repaymentPeriod: 36,
      monthlyInstallment: 7800,
      applicationDate: '2024-03-10',
      approvalDate: '2024-03-18',
      disbursementDate: '2024-04-01',
      status: 'active',
      approvedBy: 'Finance Manager',
      remainingBalance: 180000,
      totalPaid: 70000,
      nextPaymentDate: '2024-10-31',
      guarantor1: 'Robert Brown (EMP007)',
      guarantor2: 'Lisa Garcia (EMP008)',
      purpose: 'Masters degree in Human Resource Management',
      documents: ['Application Form', 'University Admission Letter', 'Fee Structure', 'Guarantor Forms'],
      comments: 'Educational loan approved to support professional development'
    },
    {
      id: 'L003',
      employeeId: 'EMP012',
      employeeName: 'David Chen',
      department: 'Finance',
      position: 'Accountant',
      loanType: 'medical',
      loanAmount: 150000,
      approvedAmount: 150000,
      interestRate: 5.0,
      repaymentPeriod: 18,
      monthlyInstallment: 9200,
      applicationDate: '2024-06-05',
      approvalDate: '2024-06-08',
      disbursementDate: '2024-06-15',
      status: 'active',
      approvedBy: 'HR Director',
      remainingBalance: 95000,
      totalPaid: 55000,
      nextPaymentDate: '2024-11-15',
      guarantor1: 'Alice Wong (EMP015)',
      guarantor2: 'Tom Lee (EMP018)',
      purpose: 'Emergency medical treatment for family member',
      documents: ['Application Form', 'Medical Reports', 'Hospital Bills', 'Guarantor Forms'],
      comments: 'Emergency medical loan approved on humanitarian grounds'
    },
    {
      id: 'L004',
      employeeId: 'EMP020',
      employeeName: 'Maria Rodriguez',
      department: 'Operations',
      position: 'Team Leader',
      loanType: 'vehicle',
      loanAmount: 800000,
      approvedAmount: 700000,
      interestRate: 10.0,
      repaymentPeriod: 60,
      monthlyInstallment: 14900,
      applicationDate: '2024-07-20',
      approvalDate: '2024-08-05',
      status: 'approved',
      approvedBy: 'General Manager',
      remainingBalance: 700000,
      totalPaid: 0,
      guarantor1: 'Carlos Santos (EMP025)',
      guarantor2: 'Ana Martinez (EMP030)',
      purpose: 'Purchase of vehicle for daily commuting',
      documents: ['Application Form', 'Vehicle Quotation', 'Insurance Quote', 'Guarantor Forms'],
      comments: 'Vehicle loan approved, awaiting disbursement'
    }
  ]);

  const [loanApplications] = useState<LoanApplication[]>([
    {
      id: 'LA001',
      employeeId: 'EMP045',
      employeeName: 'Jennifer Taylor',
      department: 'Marketing',
      requestedAmount: 400000,
      loanType: 'personal',
      purpose: 'House down payment and wedding expenses',
      guarantor1: 'Mark Stevens (EMP050)',
      guarantor2: 'Linda Johnson (EMP052)',
      submissionDate: '2024-09-25',
      status: 'under_review',
      comments: 'Application under review by loan committee'
    },
    {
      id: 'LA002',
      employeeId: 'EMP055',
      employeeName: 'Ahmed Hassan',
      department: 'IT',
      requestedAmount: 200000,
      loanType: 'education',
      purpose: 'Professional certification courses',
      guarantor1: 'Priya Sharma (EMP060)',
      guarantor2: 'James Wilson (EMP065)',
      submissionDate: '2024-09-28',
      status: 'submitted',
      comments: 'New application awaiting initial review'
    }
  ]);

  const [loanRepayments] = useState<LoanRepayment[]>([
    {
      id: 'R001',
      loanId: 'L001',
      employeeId: 'EMP001',
      paymentDate: '2024-10-01',
      amount: 23500,
      principalAmount: 20000,
      interestAmount: 3500,
      remainingBalance: 420000,
      paymentMethod: 'salary_deduction',
      status: 'paid',
      receiptNumber: 'REC001'
    },
    {
      id: 'R002',
      loanId: 'L002',
      employeeId: 'EMP005',
      paymentDate: '2024-10-01',
      amount: 7800,
      principalAmount: 6600,
      interestAmount: 1200,
      remainingBalance: 180000,
      paymentMethod: 'salary_deduction',
      status: 'paid',
      receiptNumber: 'REC002'
    }
  ]);

  const departments = ['All', 'Engineering', 'HR', 'Finance', 'Marketing', 'Operations', 'IT'];
  const loanStatuses = ['All', 'pending', 'approved', 'active', 'completed', 'rejected'];

  // Filter loans based on search criteria
  const filteredLoans = staffLoans.filter(loan => {
    const matchesSearch = loan.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === '' || selectedDepartment === 'All' || 
                             loan.department === selectedDepartment;
    const matchesStatus = selectedStatus === '' || selectedStatus === 'All' || 
                         loan.status === selectedStatus;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Calculate statistics
  const calculateStats = () => {
    const totalLoans = staffLoans.length;
    const activeLoans = staffLoans.filter(loan => loan.status === 'active').length;
    const pendingApplications = loanApplications.filter(app => app.status === 'submitted' || app.status === 'under_review').length;
    const totalDisbursed = staffLoans.reduce((sum, loan) => {
      return sum + (loan.approvedAmount || 0);
    }, 0);
    const totalOutstanding = staffLoans
      .filter(loan => loan.status === 'active')
      .reduce((sum, loan) => sum + loan.remainingBalance, 0);
    const overduePayments = staffLoans.filter(loan => {
      if (loan.status !== 'active' || !loan.nextPaymentDate) return false;
      return new Date(loan.nextPaymentDate) < new Date();
    }).length;
    
    return {
      totalLoans,
      activeLoans,
      pendingApplications,
      totalDisbursed,
      totalOutstanding,
      overduePayments
    };
  };

  const stats = calculateStats();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
      case 'defaulted':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'disbursed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLoanTypeColor = (type: string) => {
    switch (type) {
      case 'personal':
        return 'bg-blue-100 text-blue-800';
      case 'medical':
        return 'bg-red-100 text-red-800';
      case 'education':
        return 'bg-green-100 text-green-800';
      case 'housing':
        return 'bg-purple-100 text-purple-800';
      case 'vehicle':
        return 'bg-orange-100 text-orange-800';
      case 'emergency':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewLoanDetails = (loan: StaffLoan) => {
    setSelectedLoan(loan);
    setIsLoanDetailsModalOpen(true);
  };

  const handleApproveLoan = (loanId: string) => {
    // In real app, this would call API
    console.log('Approving loan:', loanId);
  };

  const handleRejectLoan = (loanId: string) => {
    // In real app, this would call API
    console.log('Rejecting loan:', loanId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Loan Management</h1>
          <p className="text-gray-600 mt-1">Manage employee loan applications, approvals, and repayments</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" size="md">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="primary" size="md" onClick={() => setIsApplicationModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Loan Application
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Loans</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalLoans}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Loans</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeLoans}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Applications</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
            </div>
            <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Disbursed</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(stats.totalDisbursed)}</p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Outstanding</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(stats.totalOutstanding)}</p>
            </div>
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calculator className="w-4 h-4 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{stats.overduePayments}</p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'active_loans', label: 'Active Loans', count: stats.activeLoans },
            { id: 'applications', label: 'Loan Applications', count: stats.pendingApplications },
            { id: 'repayments', label: 'Repayment Tracking', count: null },
            { id: 'reports', label: 'Reports & Analytics', count: null }
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
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search loans..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
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
          <div>
            <select
              value={selectedStatus}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {loanStatuses.map((status) => (
                <option key={status} value={status === 'All' ? '' : status}>
                  {status === 'All' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Button variant="secondary" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow">
        {activeTab === 'active_loans' && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loan Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount & Terms
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Repayment Status
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
                {filteredLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{loan.employeeName}</div>
                        <div className="text-sm text-gray-500">{loan.employeeId} • {loan.department}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">Loan #{loan.id}</div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLoanTypeColor(loan.loanType)}`}>
                          {loan.loanType.charAt(0).toUpperCase() + loan.loanType.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>Amount: {formatCurrency(loan.approvedAmount || loan.loanAmount)}</div>
                        <div className="text-gray-500">Monthly: {formatCurrency(loan.monthlyInstallment)}</div>
                        <div className="text-gray-500">Rate: {loan.interestRate}%</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>Paid: {formatCurrency(loan.totalPaid)}</div>
                        <div className="text-gray-500">Balance: {formatCurrency(loan.remainingBalance)}</div>
                        {loan.nextPaymentDate && (
                          <div className={`text-xs ${new Date(loan.nextPaymentDate) < new Date() ? 'text-red-600' : 'text-gray-500'}`}>
                            Next: {new Date(loan.nextPaymentDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(loan.status)}`}>
                        {loan.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewLoanDetails(loan)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900"
                          title="Edit Loan"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="p-6">
            <div className="space-y-4">
              {loanApplications.map((application) => (
                <div key={application.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{application.employeeName}</h3>
                      <p className="text-sm text-gray-600">{application.department} • {application.employeeId}</p>
                      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Amount:</span>
                          <p className="font-medium">{formatCurrency(application.requestedAmount)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Type:</span>
                          <p className="font-medium capitalize">{application.loanType}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Submitted:</span>
                          <p className="font-medium">{new Date(application.submissionDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Status:</span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.status)}`}>
                            {application.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm text-gray-700"><strong>Purpose:</strong> {application.purpose}</p>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <p><strong>Guarantors:</strong> {application.guarantor1}, {application.guarantor2}</p>
                      </div>
                      {application.comments && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-md">
                          <p className="text-sm text-gray-700">{application.comments}</p>
                        </div>
                      )}
                    </div>
                    {application.status === 'under_review' && (
                      <div className="flex space-x-2 ml-4">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleApproveLoan(application.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          variant="error"
                          size="sm"
                          onClick={() => handleRejectLoan(application.id)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
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

        {activeTab === 'repayments' && (
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loan ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loanRepayments.map((repayment) => {
                    const loan = staffLoans.find(l => l.id === repayment.loanId);
                    return (
                      <tr key={repayment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {repayment.loanId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{loan?.employeeName}</div>
                          <div className="text-sm text-gray-500">{repayment.employeeId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(repayment.paymentDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div>Total: {formatCurrency(repayment.amount)}</div>
                            <div className="text-gray-500">Principal: {formatCurrency(repayment.principalAmount)}</div>
                            <div className="text-gray-500">Interest: {formatCurrency(repayment.interestAmount)}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {repayment.paymentMethod.replace('_', ' ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(repayment.status)}`}>
                            {repayment.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Loan Portfolio Report</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Comprehensive loan portfolio analysis
                </p>
                <div className="mt-6">
                  <Button variant="primary">Generate Report</Button>
                </div>
              </div>
              
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <Calculator className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Repayment Analytics</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Track repayment patterns and defaults
                </p>
                <div className="mt-6">
                  <Button variant="primary">View Analytics</Button>
                </div>
              </div>

              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Interest Income Report</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Track interest income and projections
                </p>
                <div className="mt-6">
                  <Button variant="primary">Generate Report</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loan Details Modal */}
      <Modal
        isOpen={isLoanDetailsModalOpen}
        onClose={() => setIsLoanDetailsModalOpen(false)}
        title={selectedLoan ? `Loan Details - ${selectedLoan.id}` : "Loan Details"}
        size="xl"
      >
        {selectedLoan && (
          <div className="space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Quick Access Info */}
            <div className="text-xs text-gray-500 text-center pb-2 border-b border-gray-100">
              Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs">Esc</kbd> or click the X button to close
            </div>
            
            {/* Header Section */}
            <div className="bg-gray-50 rounded-lg p-4 sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedLoan.employeeName} - Loan #{selectedLoan.id}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedLoan.position} • {selectedLoan.department}
                  </p>
                  <p className="text-sm text-gray-500">Employee ID: {selectedLoan.employeeId}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedLoan.status)}`}>
                    {selectedLoan.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <button
                    onClick={() => setIsLoanDetailsModalOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                    title="Close Details"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Loan Information */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3 border-b pb-2">Loan Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Loan Type</label>
                  <span className={`inline-flex px-2 py-1 text-sm font-semibold rounded-full mt-1 ${getLoanTypeColor(selectedLoan.loanType)}`}>
                    {selectedLoan.loanType.charAt(0).toUpperCase() + selectedLoan.loanType.slice(1)}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Application Date</label>
                  <p className="text-sm text-gray-900 mt-1">{new Date(selectedLoan.applicationDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Requested Amount</label>
                  <p className="text-sm text-gray-900 mt-1">{formatCurrency(selectedLoan.loanAmount)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Approved Amount</label>
                  <p className="text-sm text-gray-900 mt-1 font-medium">{formatCurrency(selectedLoan.approvedAmount || selectedLoan.loanAmount)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Interest Rate</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedLoan.interestRate}% per annum</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Repayment Period</label>
                  <p className="text-sm text-gray-900 mt-1">{selectedLoan.repaymentPeriod} months</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Monthly Installment</label>
                  <p className="text-sm text-gray-900 mt-1 font-semibold">{formatCurrency(selectedLoan.monthlyInstallment)}</p>
                </div>
                {selectedLoan.approvedBy && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Approved By</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedLoan.approvedBy}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Purpose */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3 border-b pb-2">Loan Purpose</h4>
              <p className="text-sm text-gray-700">{selectedLoan.purpose}</p>
            </div>

            {/* Guarantors */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3 border-b pb-2">Guarantors</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedLoan.guarantor1 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Primary Guarantor</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedLoan.guarantor1}</p>
                  </div>
                )}
                {selectedLoan.guarantor2 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Secondary Guarantor</label>
                    <p className="text-sm text-gray-900 mt-1">{selectedLoan.guarantor2}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Repayment Status */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3 border-b pb-2">Repayment Status</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Total Paid</label>
                  <p className="text-sm text-green-600 mt-1 font-semibold">{formatCurrency(selectedLoan.totalPaid)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Remaining Balance</label>
                  <p className="text-sm text-red-600 mt-1 font-semibold">{formatCurrency(selectedLoan.remainingBalance)}</p>
                </div>
                {selectedLoan.nextPaymentDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Next Payment Due</label>
                    <p className={`text-sm mt-1 font-medium ${new Date(selectedLoan.nextPaymentDate) < new Date() ? 'text-red-600' : 'text-gray-900'}`}>
                      {new Date(selectedLoan.nextPaymentDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Documents */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3 border-b pb-2">Documents Submitted</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {selectedLoan.documents.map((doc, index) => (
                  <div key={index} className="flex items-center p-2 bg-gray-50 rounded">
                    <FileText className="w-4 h-4 text-gray-600 mr-2" />
                    <span className="text-sm text-gray-700">{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments */}
            {selectedLoan.comments && (
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3 border-b pb-2">Comments</h4>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-700">{selectedLoan.comments}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t">
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" size="sm">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Loan
                </Button>
                <Button variant="secondary" size="sm">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Statement
                </Button>
                <Button variant="secondary" size="sm">
                  <Calculator className="w-4 h-4 mr-2" />
                  Payment Schedule
                </Button>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => setIsLoanDetailsModalOpen(false)}
                  className="flex items-center"
                >
                  <X className="w-4 h-4 mr-2" />
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* New Loan Application Modal */}
      <Modal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        title="New Loan Application"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Employee</label>
              <select className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="">Select Employee</option>
                <option value="EMP001">John Smith - EMP001</option>
                <option value="EMP002">Sarah Wilson - EMP002</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Loan Type</label>
              <select className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md">
                <option value="">Select Type</option>
                <option value="personal">Personal</option>
                <option value="medical">Medical</option>
                <option value="education">Education</option>
                <option value="housing">Housing</option>
                <option value="vehicle">Vehicle</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Requested Amount</label>
              <Input type="number" placeholder="Enter amount" className="mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Repayment Period (months)</label>
              <Input type="number" placeholder="Enter months" className="mt-1" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Purpose</label>
            <textarea
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
              placeholder="Describe the purpose of the loan..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Primary Guarantor</label>
              <Input placeholder="Name and Employee ID" className="mt-1" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Secondary Guarantor</label>
              <Input placeholder="Name and Employee ID" className="mt-1" />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsApplicationModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary">
              Submit Application
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StaffLoanManagement;