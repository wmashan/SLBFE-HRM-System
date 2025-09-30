import { useState, useMemo } from 'react';
import { 
  Calendar, 
  Search, 
  Download, 
  Edit3, 
  Clock,
  Eye,
  Plus,
  Bell,
  AlertCircle,
  CheckCircle,
  UserMinus,
  FileText,
  Calculator
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';

interface RetirementRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  dateOfBirth: string;
  joinDate: string;
  currentAge: number;
  yearsOfService: number;
  retirementEligibilityDate: string;
  plannedRetirementDate?: string;
  retirementType: 'mandatory' | 'voluntary' | 'early' | 'medical';
  status: 'active' | 'pre_retirement' | 'retired' | 'extended';
  pensionEligible: boolean;
  currentSalary: number;
  estimatedPension?: number;
  lastWorkingDay?: string;
  notificationSent: boolean;
  handoverStatus?: 'not_started' | 'in_progress' | 'completed';
}

interface RetirementBenefit {
  id: string;
  employeeId: string;
  benefitType: 'pension' | 'gratuity' | 'leave_encashment' | 'medical' | 'other';
  amount: number;
  eligibilityDate: string;
  status: 'eligible' | 'not_eligible' | 'processed' | 'pending';
  description: string;
}

interface RetirementPlanning {
  id: string;
  employeeId: string;
  plannedRetirementDate: string;
  handoverPlan: string;
  replacementIdentified: boolean;
  replacementEmployeeId?: string;
  knowledgeTransferPlan: string;
  exitInterviewScheduled: boolean;
  benefitsProcessed: boolean;
  status: 'planning' | 'in_progress' | 'completed';
  notes?: string;
}

const RetirementManagement = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'planning' | 'benefits' | 'reports'>('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPlanningModalOpen, setIsPlanningModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<RetirementRecord | null>(null);
  
  // Mock data - in real app, this would come from API
  const [retirementRecords] = useState<RetirementRecord[]>([
    {
      id: '1',
      employeeId: 'EMP001',
      employeeName: 'Robert Johnson',
      department: 'Engineering',
      position: 'Senior Engineer',
      dateOfBirth: '1965-03-15',
      joinDate: '1990-06-01',
      currentAge: 60,
      yearsOfService: 35,
      retirementEligibilityDate: '2025-03-15',
      plannedRetirementDate: '2025-12-31',
      retirementType: 'voluntary',
      status: 'pre_retirement',
      pensionEligible: true,
      currentSalary: 150000,
      estimatedPension: 90000,
      notificationSent: true,
      handoverStatus: 'in_progress'
    },
    {
      id: '2',
      employeeId: 'EMP002',
      employeeName: 'Margaret Smith',
      department: 'HR',
      position: 'HR Director',
      dateOfBirth: '1964-08-22',
      joinDate: '1988-03-15',
      currentAge: 61,
      yearsOfService: 37,
      retirementEligibilityDate: '2024-08-22',
      plannedRetirementDate: '2026-03-31',
      retirementType: 'mandatory',
      status: 'pre_retirement',
      pensionEligible: true,
      currentSalary: 180000,
      estimatedPension: 126000,
      notificationSent: true,
      handoverStatus: 'not_started'
    },
    {
      id: '3',
      employeeId: 'EMP003',
      employeeName: 'David Wilson',
      department: 'Finance',
      position: 'Chief Financial Officer',
      dateOfBirth: '1963-12-10',
      joinDate: '1985-09-01',
      currentAge: 62,
      yearsOfService: 40,
      retirementEligibilityDate: '2023-12-10',
      plannedRetirementDate: '2025-06-30',
      retirementType: 'voluntary',
      status: 'pre_retirement',
      pensionEligible: true,
      currentSalary: 200000,
      estimatedPension: 150000,
      notificationSent: true,
      handoverStatus: 'completed'
    },
    {
      id: '4',
      employeeId: 'EMP004',
      employeeName: 'Patricia Davis',
      department: 'Operations',
      position: 'Operations Manager',
      dateOfBirth: '1966-05-18',
      joinDate: '1992-01-15',
      currentAge: 59,
      yearsOfService: 33,
      retirementEligibilityDate: '2026-05-18',
      retirementType: 'mandatory',
      status: 'active',
      pensionEligible: true,
      currentSalary: 135000,
      estimatedPension: 81000,
      notificationSent: false,
      handoverStatus: 'not_started'
    }
  ]);

  const [retirementBenefits] = useState<RetirementBenefit[]>([
    {
      id: '1',
      employeeId: 'EMP001',
      benefitType: 'pension',
      amount: 90000,
      eligibilityDate: '2025-03-15',
      status: 'eligible',
      description: 'Monthly pension based on 35 years of service'
    },
    {
      id: '2',
      employeeId: 'EMP001',
      benefitType: 'gratuity',
      amount: 750000,
      eligibilityDate: '2025-12-31',
      status: 'pending',
      description: 'Gratuity payment for 35 years of service'
    },
    {
      id: '3',
      employeeId: 'EMP002',
      benefitType: 'pension',
      amount: 126000,
      eligibilityDate: '2024-08-22',
      status: 'eligible',
      description: 'Monthly pension based on 37 years of service'
    }
  ]);

  const [retirementPlanning] = useState<RetirementPlanning[]>([
    {
      id: '1',
      employeeId: 'EMP001',
      plannedRetirementDate: '2025-12-31',
      handoverPlan: 'Complete knowledge transfer to junior engineers, document all ongoing projects',
      replacementIdentified: true,
      replacementEmployeeId: 'EMP105',
      knowledgeTransferPlan: '6-month structured handover program',
      exitInterviewScheduled: false,
      benefitsProcessed: false,
      status: 'in_progress',
      notes: 'Employee has expressed interest in part-time consulting post-retirement'
    },
    {
      id: '2',
      employeeId: 'EMP002',
      plannedRetirementDate: '2026-03-31',
      handoverPlan: 'Transition HR responsibilities, train replacement in policies and procedures',
      replacementIdentified: false,
      knowledgeTransferPlan: 'To be developed once replacement is identified',
      exitInterviewScheduled: false,
      benefitsProcessed: false,
      status: 'planning'
    }
  ]);

  const departments = ['All', 'Engineering', 'HR', 'Finance', 'Marketing', 'Operations'];

  // Filter records based on search and department
  const filteredRetirementRecords = retirementRecords.filter(record => {
    const matchesSearch = record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === '' || selectedDepartment === 'All' || 
                             record.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  // Get upcoming retirements (within next 2 years)
  const upcomingRetirements = useMemo(() => {
    const today = new Date();
    const twoYearsFromNow = new Date();
    twoYearsFromNow.setFullYear(today.getFullYear() + 2);
    
    return retirementRecords.filter(record => {
      const eligibilityDate = new Date(record.retirementEligibilityDate);
      return eligibilityDate <= twoYearsFromNow && record.status !== 'retired';
    });
  }, [retirementRecords]);

  // Get retirement notifications needed
  const retirementNotifications = useMemo(() => {
    const today = new Date();
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(today.getFullYear() + 1);
    
    return retirementRecords.filter(record => {
      const eligibilityDate = new Date(record.retirementEligibilityDate);
      return eligibilityDate <= oneYearFromNow && !record.notificationSent && record.status === 'active';
    });
  }, [retirementRecords]);

  const calculateStats = () => {
    const totalUpcoming = upcomingRetirements.length;
    const pendingNotifications = retirementNotifications.length;
    const inPreRetirement = retirementRecords.filter(r => r.status === 'pre_retirement').length;
    const totalRetired = retirementRecords.filter(r => r.status === 'retired').length;
    
    return {
      totalUpcoming,
      pendingNotifications,
      inPreRetirement,
      totalRetired
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
        return 'bg-blue-100 text-blue-800';
      case 'pre_retirement':
        return 'bg-yellow-100 text-yellow-800';
      case 'retired':
        return 'bg-gray-100 text-gray-800';
      case 'extended':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getHandoverStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'not_started':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysUntilRetirement = (date: string) => {
    const today = new Date();
    const retirementDate = new Date(date);
    const diffTime = retirementDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleEditRetirement = (record: RetirementRecord) => {
    setSelectedRecord(record);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Retirement Management</h1>
          <p className="text-gray-600 mt-1">Manage employee retirements, planning, and transition processes</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" size="md">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button variant="primary" size="md" onClick={() => setIsPlanningModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Retirement Plan
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Retirements</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUpcoming}</p>
              <p className="text-xs text-gray-500">Next 2 years</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Notifications</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingNotifications}</p>
              <p className="text-xs text-gray-500">Require notification</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Bell className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pre-Retirement</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inPreRetirement}</p>
              <p className="text-xs text-gray-500">Active planning</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Retired</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRetired}</p>
              <p className="text-xs text-gray-500">All time</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <UserMinus className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Notification Alert */}
      {retirementNotifications.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-amber-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">
                Retirement Notifications Required
              </h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>
                  {retirementNotifications.length} employee{retirementNotifications.length !== 1 ? 's' : ''} approaching retirement eligibility require{retirementNotifications.length === 1 ? 's' : ''} notification.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'upcoming', label: 'Upcoming Retirements', count: upcomingRetirements.length },
            { id: 'planning', label: 'Retirement Planning', count: retirementPlanning.filter(p => p.status !== 'completed').length },
            { id: 'benefits', label: 'Benefits & Pension', count: retirementBenefits.filter(b => b.status === 'pending').length },
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
        {activeTab === 'upcoming' && (
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
                    Age / Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Eligibility Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Handover Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRetirementRecords.map((record) => {
                  const daysUntil = getDaysUntilRetirement(record.retirementEligibilityDate);
                  return (
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
                        <div>{record.currentAge} years old</div>
                        <div className="text-gray-500">{record.yearsOfService} years service</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(record.retirementEligibilityDate).toLocaleDateString()}
                        </div>
                        <div className={`text-sm ${daysUntil <= 365 ? 'text-red-600' : 'text-gray-500'}`}>
                          {daysUntil > 0 ? `${Math.ceil(daysUntil / 30)} months` : 'Eligible now'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                          {record.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getHandoverStatusColor(record.handoverStatus)}`}>
                          {record.handoverStatus?.replace('_', ' ') || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditRetirement(record)}
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'planning' && (
          <div className="p-6">
            <div className="space-y-6">
              {retirementPlanning.map((plan) => {
                const employee = retirementRecords.find(r => r.employeeId === plan.employeeId);
                return (
                  <div key={plan.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{employee?.employeeName}</h3>
                        <p className="text-sm text-gray-600">{employee?.department} • {employee?.position}</p>
                        <p className="text-sm text-gray-500">Planned Retirement: {new Date(plan.plannedRetirementDate).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        plan.status === 'completed' ? 'bg-green-100 text-green-800' :
                        plan.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {plan.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Handover Plan</h4>
                        <p className="text-sm text-gray-600">{plan.handoverPlan}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Knowledge Transfer</h4>
                        <p className="text-sm text-gray-600">{plan.knowledgeTransferPlan}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center">
                        <CheckCircle className={`w-5 h-5 mr-2 ${plan.replacementIdentified ? 'text-green-500' : 'text-gray-400'}`} />
                        <span className="text-sm text-gray-700">Replacement Identified</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className={`w-5 h-5 mr-2 ${plan.exitInterviewScheduled ? 'text-green-500' : 'text-gray-400'}`} />
                        <span className="text-sm text-gray-700">Exit Interview</span>
                      </div>
                      <div className="flex items-center">
                        <CheckCircle className={`w-5 h-5 mr-2 ${plan.benefitsProcessed ? 'text-green-500' : 'text-gray-400'}`} />
                        <span className="text-sm text-gray-700">Benefits Processed</span>
                      </div>
                    </div>
                    
                    {plan.notes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-md">
                        <p className="text-sm text-gray-700">{plan.notes}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'benefits' && (
          <div className="p-6">
            <div className="space-y-6">
              {retirementBenefits.map((benefit) => {
                const employee = retirementRecords.find(r => r.employeeId === benefit.employeeId);
                return (
                  <div key={benefit.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{employee?.employeeName}</h3>
                        <p className="text-sm text-gray-600">{benefit.benefitType.replace('_', ' ').toUpperCase()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(benefit.amount)}</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(benefit.status)}`}>
                          {benefit.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{benefit.description}</p>
                    <p className="text-sm text-gray-500">Eligible from: {new Date(benefit.eligibilityDate).toLocaleDateString()}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Retirement Forecast Report</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Generate projections for upcoming retirements
                </p>
                <div className="mt-6">
                  <Button variant="primary">Generate Report</Button>
                </div>
              </div>
              
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <Calculator className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Pension Analytics</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Analyze pension costs and benefits
                </p>
                <div className="mt-6">
                  <Button variant="primary">View Analytics</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Retirement Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Retirement Details"
        size="lg"
      >
        {selectedRecord && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Planned Retirement Date</label>
                <Input
                  type="date"
                  defaultValue={selectedRecord.plannedRetirementDate}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Retirement Type</label>
                <select className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="mandatory">Mandatory</option>
                  <option value="voluntary">Voluntary</option>
                  <option value="early">Early Retirement</option>
                  <option value="medical">Medical Retirement</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md">
                  <option value="active">Active</option>
                  <option value="pre_retirement">Pre-Retirement</option>
                  <option value="retired">Retired</option>
                  <option value="extended">Extended</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Working Day</label>
                <Input
                  type="date"
                  defaultValue={selectedRecord.lastWorkingDay}
                  className="mt-1"
                />
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

      {/* Planning Modal */}
      <Modal
        isOpen={isPlanningModalOpen}
        onClose={() => setIsPlanningModalOpen(false)}
        title="Create Retirement Plan"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Employee</label>
            <select className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="">Select Employee</option>
              {retirementRecords.map((record) => (
                <option key={record.employeeId} value={record.employeeId}>
                  {record.employeeName} - {record.employeeId}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Planned Retirement Date</label>
            <Input type="date" className="mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Handover Plan</label>
            <textarea
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
              placeholder="Describe the handover plan..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Knowledge Transfer Plan</label>
            <textarea
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
              rows={3}
              placeholder="Describe the knowledge transfer process..."
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsPlanningModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary">
              Create Plan
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RetirementManagement;