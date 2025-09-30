// Advanced Reports Management Page (Senior HR Manager Only)

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Download,
  Calendar,
  Clock,
  FileText,
  TrendingUp,
  Users,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Settings,
  Play,
  MoreHorizontal,
  PieChart,
  Activity,
  Target,
  Database
} from 'lucide-react';
import { Button, Modal } from '../components/ui';
import { EmployeeReportModal } from '../components/features/reports/EmployeeReportModal';
import { ReportConfig, ReportGeneration, ReportAnalytics, ReportType, ReportCategory, ReportStatus } from '../types';

const Reports: React.FC = () => {
  const [reports, setReports] = useState<ReportConfig[]>([]);
  const [generations, setGenerations] = useState<ReportGeneration[]>([]);
  const [analytics, setAnalytics] = useState<ReportAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ReportCategory | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<ReportType | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'reports' | 'generations' | 'analytics' | 'templates'>('reports');
  const [selectedReport, setSelectedReport] = useState<ReportConfig | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showEmployeeReportModal, setShowEmployeeReportModal] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    setTimeout(() => {
      const mockReports: ReportConfig[] = [
        {
          id: 'RPT001',
          name: 'Employee Performance Summary',
          type: 'employee_summary',
          category: 'hr_analytics',
          description: 'Comprehensive overview of employee performance metrics, attendance, and productivity indicators',
          parameters: [
            { name: 'dateRange', label: 'Date Range', type: 'daterange', required: true },
            { name: 'department', label: 'Department', type: 'multiselect', required: false, options: [
              { value: 'operations', label: 'Operations' },
              { value: 'training', label: 'Training' },
              { value: 'placement', label: 'Placement' }
            ]},
            { name: 'includeInactive', label: 'Include Inactive Employees', type: 'boolean', required: false, defaultValue: false }
          ],
          outputFormats: ['pdf', 'excel', 'csv'],
          accessLevel: 'senior_hr_manager',
          isActive: true,
          createdBy: 'Sarah Williams',
          createdAt: new Date('2024-08-15'),
          updatedAt: new Date('2024-09-20')
        },
        {
          id: 'RPT002',
          name: 'Salary Analysis & Trends',
          type: 'salary_analysis',
          category: 'financial',
          description: 'Detailed analysis of salary distributions, increments, and compensation trends across departments',
          parameters: [
            { name: 'fiscalYear', label: 'Fiscal Year', type: 'select', required: true, options: [
              { value: '2024', label: '2024' },
              { value: '2023', label: '2023' }
            ]},
            { name: 'includeAllowances', label: 'Include Allowances', type: 'boolean', required: false, defaultValue: true },
            { name: 'comparisonYear', label: 'Comparison Year', type: 'select', required: false }
          ],
          schedule: {
            frequency: 'monthly',
            dayOfMonth: 1,
            time: '09:00',
            timezone: 'Asia/Colombo',
            recipients: ['finance@slbfe.com', 'hr@slbfe.com'],
            isActive: true
          },
          outputFormats: ['pdf', 'excel', 'chart'],
          accessLevel: 'senior_hr_manager',
          isActive: true,
          createdBy: 'Sarah Williams',
          createdAt: new Date('2024-07-10'),
          updatedAt: new Date('2024-09-25')
        },
        {
          id: 'RPT003',
          name: 'Disciplinary Actions Report',
          type: 'disciplinary_summary',
          category: 'compliance',
          description: 'Summary of all disciplinary actions, trends, and compliance metrics for audit purposes',
          parameters: [
            { name: 'dateRange', label: 'Date Range', type: 'daterange', required: true },
            { name: 'severity', label: 'Severity Level', type: 'multiselect', required: false },
            { name: 'includeResolved', label: 'Include Resolved Cases', type: 'boolean', required: false, defaultValue: true }
          ],
          outputFormats: ['pdf', 'excel'],
          accessLevel: 'senior_hr_manager',
          isActive: true,
          createdBy: 'Sarah Williams',
          createdAt: new Date('2024-09-01'),
          updatedAt: new Date('2024-09-28')
        },
        {
          id: 'RPT004',
          name: 'Recruitment Metrics Dashboard',
          type: 'recruitment_metrics',
          category: 'operational',
          description: 'Key recruitment metrics including time-to-hire, source effectiveness, and candidate pipeline analysis',
          parameters: [
            { name: 'quarter', label: 'Quarter', type: 'select', required: true },
            { name: 'positions', label: 'Positions', type: 'multiselect', required: false },
            { name: 'includeRejected', label: 'Include Rejected Candidates', type: 'boolean', required: false }
          ],
          schedule: {
            frequency: 'weekly',
            dayOfWeek: 1,
            time: '08:00',
            timezone: 'Asia/Colombo',
            recipients: ['recruitment@slbfe.com'],
            isActive: true
          },
          outputFormats: ['pdf', 'chart', 'json'],
          accessLevel: 'senior_hr_manager',
          isActive: true,
          createdBy: 'Sarah Williams',
          createdAt: new Date('2024-08-20'),
          updatedAt: new Date('2024-09-15')
        },
        {
          id: 'RPT005',
          name: 'Retirement Forecast Analysis',
          type: 'retirement_forecast',
          category: 'strategic',
          description: 'Predictive analysis of upcoming retirements and succession planning requirements',
          parameters: [
            { name: 'forecastPeriod', label: 'Forecast Period (Years)', type: 'number', required: true, defaultValue: 5 },
            { name: 'departments', label: 'Departments', type: 'multiselect', required: false },
            { name: 'includeOptional', label: 'Include Optional Retirements', type: 'boolean', required: false }
          ],
          outputFormats: ['pdf', 'excel', 'chart'],
          accessLevel: 'senior_hr_manager',
          isActive: true,
          createdBy: 'Sarah Williams',
          createdAt: new Date('2024-06-30'),
          updatedAt: new Date('2024-09-10')
        },
        {
          id: 'RPT006',
          name: 'Comprehensive Employee Report',
          type: 'comprehensive_employee_report',
          category: 'hr_analytics',
          description: 'Generate detailed individual employee reports including personal details, service history, transfer records, disciplinary actions, performance reviews, salary history, and all available employee data',
          parameters: [
            { name: 'employeeId', label: 'Employee', type: 'select', required: true, options: [
              { value: 'EMP001', label: 'John Doe (EMP001)' },
              { value: 'EMP002', label: 'Jane Smith (EMP002)' },
              { value: 'EMP003', label: 'Mike Johnson (EMP003)' }
            ]},
            { name: 'includeConfidential', label: 'Include Confidential Information', type: 'boolean', required: false, defaultValue: true },
            { name: 'includeSalaryDetails', label: 'Include Salary Details', type: 'boolean', required: false, defaultValue: true },
            { name: 'includePerformanceHistory', label: 'Include Performance History', type: 'boolean', required: false, defaultValue: true },
            { name: 'includeDisciplinaryHistory', label: 'Include Disciplinary History', type: 'boolean', required: false, defaultValue: true }
          ],
          outputFormats: ['pdf', 'excel', 'csv'],
          accessLevel: 'senior_hr_manager',
          isActive: true,
          createdBy: 'Sarah Williams',
          createdAt: new Date('2024-09-30'),
          updatedAt: new Date('2024-09-30')
        }
      ];

      const mockGenerations: ReportGeneration[] = [
        {
          id: 'GEN001',
          configId: 'RPT001',
          reportName: 'Employee Performance Summary',
          parameters: { dateRange: '2024-07-01 to 2024-09-30', department: 'all' },
          status: 'completed',
          format: 'pdf',
          startTime: new Date('2024-09-30T10:30:00'),
          endTime: new Date('2024-09-30T10:33:00'),
          fileUrl: '/downloads/employee-performance-q3-2024.pdf',
          fileSize: 2.4,
          generatedBy: 'Sarah Williams',
          scheduledRun: false
        },
        {
          id: 'GEN002',
          configId: 'RPT002',
          reportName: 'Salary Analysis & Trends',
          parameters: { fiscalYear: '2024', includeAllowances: true },
          status: 'processing',
          format: 'excel',
          progress: 65,
          startTime: new Date('2024-09-30T11:00:00'),
          generatedBy: 'Sarah Williams',
          scheduledRun: true
        },
        {
          id: 'GEN003',
          configId: 'RPT004',
          reportName: 'Recruitment Metrics Dashboard',
          parameters: { quarter: 'Q3-2024', includeRejected: false },
          status: 'failed',
          format: 'chart',
          startTime: new Date('2024-09-30T09:15:00'),
          endTime: new Date('2024-09-30T09:18:00'),
          error: 'Database connection timeout',
          generatedBy: 'System Scheduler',
          scheduledRun: true
        }
      ];

      const mockAnalytics: ReportAnalytics = {
        totalReportsGenerated: 156,
        mostPopularReports: [
          { reportId: 'RPT001', name: 'Employee Performance Summary', count: 28 },
          { reportId: 'RPT002', name: 'Salary Analysis & Trends', count: 24 },
          { reportId: 'RPT004', name: 'Recruitment Metrics Dashboard', count: 19 }
        ],
        reportsGeneratedToday: 3,
        reportsGeneratedThisWeek: 12,
        reportsGeneratedThisMonth: 45,
        averageGenerationTime: 2.8,
        failureRate: 5.2,
        storageUsed: 1.2,
        scheduledReportsActive: 8
      };

      setReports(mockReports);
      setGenerations(mockGenerations);
      setAnalytics(mockAnalytics);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusIcon = (status: ReportStatus) => {
    switch (status) {
      case 'queued':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'processing':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'cancelled':
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: ReportCategory) => {
    switch (category) {
      case 'hr_analytics':
        return 'bg-blue-100 text-blue-800';
      case 'financial':
        return 'bg-green-100 text-green-800';
      case 'compliance':
        return 'bg-red-100 text-red-800';
      case 'operational':
        return 'bg-orange-100 text-orange-800';
      case 'strategic':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: ReportType) => {
    switch (type) {
      case 'employee_summary':
        return <Users className="w-5 h-5" />;
      case 'comprehensive_employee_report':
        return <Database className="w-5 h-5" />;
      case 'salary_analysis':
        return <DollarSign className="w-5 h-5" />;
      case 'disciplinary_summary':
        return <AlertTriangle className="w-5 h-5" />;
      case 'recruitment_metrics':
        return <Target className="w-5 h-5" />;
      case 'retirement_forecast':
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || report.category === categoryFilter;
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const handleCreateReport = () => {
    setShowCreateModal(true);
  };

  const handleEmployeeReportGenerated = () => {
    // Refresh generations list
    // This would normally fetch updated data from the API
    console.log('Employee report generated successfully!');
  };

  const handleViewDetails = (report: ReportConfig) => {
    setSelectedReport(report);
    setShowDetailsModal(true);
  };

  const handleGenerateReport = (report: ReportConfig) => {
    // Check if it's the Employee Report (RPT006) - open Employee Report Modal
    if (report.id === 'RPT006' || report.name === 'Comprehensive Employee Report') {
      setShowEmployeeReportModal(true);
    } else {
      // For all other reports, use the regular generate modal
      setSelectedReport(report);
      setShowGenerateModal(true);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Advanced Reports</h1>
            <p className="text-sm text-gray-600">Generate and manage comprehensive HR analytics and reports</p>
          </div>
        </div>
        <Button onClick={handleCreateReport} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Report
        </Button>
      </div>

      {/* Analytics Overview */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalReportsGenerated}</p>
                <p className="text-xs text-green-600">+{analytics.reportsGeneratedThisMonth} this month</p>
              </div>
              <FileText className="w-8 h-8 text-indigo-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Generated Today</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.reportsGeneratedToday}</p>
                <p className="text-xs text-blue-600">{analytics.reportsGeneratedThisWeek} this week</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Generation Time</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.averageGenerationTime}m</p>
                <p className="text-xs text-orange-600">{analytics.failureRate}% failure rate</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Storage Used</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.storageUsed}GB</p>
                <p className="text-xs text-purple-600">{analytics.scheduledReportsActive} scheduled</p>
              </div>
              <Database className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'reports', label: 'Reports', icon: FileText },
              { key: 'generations', label: 'Generations', icon: RefreshCw },
              { key: 'analytics', label: 'Analytics', icon: BarChart3 },
              { key: 'templates', label: 'Templates', icon: Settings }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'reports' && (
            <div>
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search reports..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as ReportCategory | 'all')}
                >
                  <option value="all">All Categories</option>
                  <option value="hr_analytics">HR Analytics</option>
                  <option value="financial">Financial</option>
                  <option value="compliance">Compliance</option>
                  <option value="operational">Operational</option>
                  <option value="strategic">Strategic</option>
                </select>
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as ReportType | 'all')}
                >
                  <option value="all">All Types</option>
                  <option value="employee_summary">Employee Summary</option>
                  <option value="comprehensive_employee_report">Comprehensive Employee Report</option>
                  <option value="salary_analysis">Salary Analysis</option>
                  <option value="disciplinary_summary">Disciplinary Summary</option>
                  <option value="recruitment_metrics">Recruitment Metrics</option>
                  <option value="retirement_forecast">Retirement Forecast</option>
                </select>
                <Button variant="ghost" className="flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Advanced Filters
                </Button>
              </div>

              {/* Reports Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReports.map((report) => (
                  <div key={report.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                          {getTypeIcon(report.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{report.name}</h3>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(report.category)}`}>
                            {report.category.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{report.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>Formats: {report.outputFormats.join(', ')}</span>
                      {report.schedule && (
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          Scheduled
                        </span>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewDetails(report)}
                        className="flex-1"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Details
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleGenerateReport(report)}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Generate
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {filteredReports.length === 0 && (
                <div className="text-center py-12">
                  <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm || categoryFilter !== 'all' || typeFilter !== 'all'
                      ? 'Try adjusting your search or filter criteria.'
                      : 'Get started by creating your first report.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'generations' && (
            <div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Report
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Generated
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {generations.map((generation) => (
                      <tr key={generation.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{generation.reportName}</div>
                            <div className="text-sm text-gray-500">
                              {generation.scheduledRun ? 'Scheduled' : 'Manual'} • {generation.format.toUpperCase()}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(generation.status)}
                            <span className="text-sm capitalize">{generation.status}</span>
                            {generation.progress && (
                              <span className="text-xs text-gray-500">({generation.progress}%)</span>
                            )}
                          </div>
                          {generation.error && (
                            <div className="text-xs text-red-500 mt-1">{generation.error}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>{generation.startTime.toLocaleDateString()}</div>
                          <div>{generation.startTime.toLocaleTimeString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {generation.fileSize ? `${generation.fileSize} MB` : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            {generation.status === 'completed' && (
                              <button className="text-indigo-600 hover:text-indigo-900">
                                <Download className="w-4 h-4" />
                              </button>
                            )}
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
            </div>
          )}

          {(activeTab === 'analytics' || activeTab === 'templates') && (
            <div className="text-center py-12">
              <PieChart className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {activeTab === 'analytics' ? 'Advanced Analytics' : 'Report Templates'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeTab === 'analytics' 
                  ? 'Detailed analytics dashboard coming soon.'
                  : 'Custom report templates and builders coming soon.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Report"
        size="xl"
      >
        <div className="p-4">
          <p className="text-gray-600">Report builder interface will be implemented here.</p>
          <div className="mt-4 flex justify-end space-x-2">
            <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              Create Report
            </Button>
          </div>
        </div>
      </Modal>

      {/* Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title="Report Details"
        size="xl"
      >
        <div className="p-4">
          {selectedReport && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">{selectedReport.name}</h3>
                <p className="text-gray-600">{selectedReport.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <p className="text-sm text-gray-900 capitalize">{selectedReport.category.replace('_', ' ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Type</label>
                  <p className="text-sm text-gray-900 capitalize">{selectedReport.type.replace('_', ' ')}</p>
                </div>
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

      {/* Generate Modal */}
      <Modal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        title="Generate Report"
        size="lg"
      >
        <div className="p-4">
          {selectedReport && (
            <div>
              <h3 className="text-lg font-medium mb-4">{selectedReport.name}</h3>
              <p className="text-gray-600 mb-4">Configure parameters and generate this report.</p>
              
              <div className="space-y-4">
                {selectedReport.parameters.map((param) => (
                  <div key={param.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {param.label}
                      {param.required && <span className="text-red-500">*</span>}
                    </label>
                    {param.type === 'select' && (
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500">
                        {param.options?.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                    {param.type === 'boolean' && (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          defaultChecked={param.defaultValue}
                        />
                        <span className="ml-2 text-sm text-gray-600">{param.label}</span>
                      </div>
                    )}
                    {(param.type === 'date' || param.type === 'daterange') && (
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                      />
                    )}
                  </div>
                ))}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Output Format</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500">
                    {selectedReport.outputFormats.map((format) => (
                      <option key={format} value={format}>
                        {format.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
          <div className="mt-6 flex justify-end space-x-2">
            <Button variant="ghost" onClick={() => setShowGenerateModal(false)}>
              Cancel
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Play className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>
      </Modal>

      {/* Employee Report Modal */}
      <EmployeeReportModal
        isOpen={showEmployeeReportModal}
        onClose={() => setShowEmployeeReportModal(false)}
        onReportGenerated={handleEmployeeReportGenerated}
      />
    </div>
  );
};

export default Reports;