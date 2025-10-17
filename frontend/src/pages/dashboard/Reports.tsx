import { useState } from 'react';
import { 
  BarChart3, 
  FileText, 
  Download, 
  Calendar,
  Users,
  TrendingUp,
  Filter,
  Search,
  RefreshCw,
  Eye,
  Trash2,
  Heart,
  DollarSign,
  GraduationCap,
  UserMinus,
  Shield,
  Plane
} from 'lucide-react';
import EmployeeReports from '../../components/EmployeeReports';
import SimpleChart from '../../components/SimpleChart';

const Reports = () => {
  const [showEmployeeReports, setShowEmployeeReports] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for quick insights charts
  const quickInsightsData = {
    departmentDistribution: {
      labels: ['IT Services', 'Human Resources', 'Finance', 'Marketing', 'Operations', 'Administration'],
      data: [35, 12, 18, 22, 28, 15]
    },
    employmentTypes: {
      labels: ['Permanent', 'Contract', 'Casual', 'Probation'],
      data: [85, 25, 18, 12]
    },
    medicalClaims: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      data: [15, 22, 18, 28, 25, 32]
    },
    salaryGrades: {
      labels: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'],
      data: [12, 28, 35, 22, 18]
    },
    leaveUtilization: {
      labels: ['Annual', 'Sick', 'Casual', 'Medical', 'Maternity'],
      data: [65, 42, 38, 15, 8]
    },
    trainingCompletion: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      data: [78, 85, 92, 88]
    }
  };

  // Quick insights charts
  const quickInsightCharts = [
    {
      id: 'dept_distribution',
      title: 'Employee Distribution by Department',
      type: 'pie' as const,
      data: {
        labels: quickInsightsData.departmentDistribution.labels,
        datasets: [{
          data: quickInsightsData.departmentDistribution.data,
          backgroundColor: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#6B7280']
        }]
      }
    },
    {
      id: 'employment_types',
      title: 'Employment Type Distribution',
      type: 'doughnut' as const,
      data: {
        labels: quickInsightsData.employmentTypes.labels,
        datasets: [{
          data: quickInsightsData.employmentTypes.data,
          backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6']
        }]
      }
    },
    {
      id: 'medical_claims_trend',
      title: 'Monthly Medical Claims Trend',
      type: 'bar' as const,
      data: {
        labels: quickInsightsData.medicalClaims.labels,
        datasets: [{
          label: 'Medical Claims',
          data: quickInsightsData.medicalClaims.data,
          backgroundColor: '#EF4444'
        }]
      }
    },
    {
      id: 'training_progress',
      title: 'Quarterly Training Completion %',
      type: 'line' as const,
      data: {
        labels: quickInsightsData.trainingCompletion.labels,
        datasets: [{
          label: 'Completion Rate',
          data: quickInsightsData.trainingCompletion.data,
          backgroundColor: '#10B981'
        }]
      }
    }
  ];

  // Sample recent reports data
  const recentReports = [
    {
      id: 1,
      name: 'Employee Summary Report',
      type: 'employee_summary',
      generatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      records: 156,
      downloadUrl: '#',
      size: '2.3 MB'
    },
    {
      id: 2,
      name: 'Medical Claims Analysis',
      type: 'medical_claims_report',
      generatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      records: 89,
      downloadUrl: '#',
      size: '1.8 MB'
    },
    {
      id: 3,
      name: 'Salary Management Report',
      type: 'salary_report',
      generatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      records: 156,
      downloadUrl: '#',
      size: '3.1 MB'
    },
    {
      id: 4,
      name: 'Training Completion Report',
      type: 'training_report',
      generatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      records: 234,
      downloadUrl: '#',
      size: '1.9 MB'
    },
    {
      id: 5,
      name: 'Leave Utilization Report',
      type: 'leave_report',
      generatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      records: 567,
      downloadUrl: '#',
      size: '2.7 MB'
    }
  ];

  // Comprehensive report categories based on system data
  const reportCategories = [
    {
      id: 'employee-reports',
      name: 'Employee Management',
      description: 'Employee analytics, demographics, and workforce insights',
      icon: Users,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      iconBg: 'bg-blue-100',
      action: () => setShowEmployeeReports(true),
      reportCount: 12,
      reports: [
        'Employee Summary Report',
        'Demographics Analysis',
        'Department-wise Employee Report',
        'Service Tenure Analysis',
        'Employee Directory',
        'New Joiners Report',
        'Employee Birthday List',
        'Promotion Analysis',
        'Employment Type Analysis',
        'Branch-wise Distribution',
        'Education & Qualifications',
        'Emergency Contacts Report'
      ]
    },
    {
      id: 'medical-reports',
      name: 'Medical Claims',
      description: 'Medical claims analysis, utilization, and financial reports',
      icon: Heart,
      color: 'bg-red-50 text-red-700 border-red-200',
      iconBg: 'bg-red-100',
      action: () => console.log('Medical reports coming soon'),
      reportCount: 8,
      reports: [
        'Medical Claims Summary',
        'Claims by Department',
        'Medical Utilization Report',
        'Pending Claims Report',
        'Medical Expense Analysis',
        'Claims Approval Trends',
        'Medical Balance Report',
        'Hospital-wise Claims'
      ]
    },
    {
      id: 'salary-reports',
      name: 'Salary & Payroll',
      description: 'Salary analysis, payroll summaries, and compensation reports',
      icon: DollarSign,
      color: 'bg-green-50 text-green-700 border-green-200',
      iconBg: 'bg-green-100',
      action: () => console.log('Salary reports coming soon'),
      reportCount: 10,
      reports: [
        'Salary Summary Report',
        'Payroll Analysis',
        'Salary Grade Distribution',
        'Increment History Report',
        'Overtime Analysis',
        'Bonus Distribution',
        'Salary Comparison Report',
        'Cost Center Analysis',
        'Compensation Trends',
        'Deduction Summary'
      ]
    },
    {
      id: 'leave-reports',
      name: 'Leave & Attendance',
      description: 'Leave utilization, attendance patterns, and absence analysis',
      icon: Calendar,
      color: 'bg-purple-50 text-purple-700 border-purple-200',
      iconBg: 'bg-purple-100',
      action: () => console.log('Leave reports coming soon'),
      reportCount: 9,
      reports: [
        'Leave Utilization Report',
        'Attendance Summary',
        'Leave Balance Report',
        'Absenteeism Analysis',
        'Leave Trends by Department',
        'Holiday Calendar Report',
        'Sick Leave Patterns',
        'Annual Leave Planning',
        'Leave Approval Report'
      ]
    },
    {
      id: 'retirement-reports',
      name: 'Retirement Management',
      description: 'Retirement planning, pension analysis, and benefit reports',
      icon: UserMinus,
      color: 'bg-orange-50 text-orange-700 border-orange-200',
      iconBg: 'bg-orange-100',
      action: () => console.log('Retirement reports coming soon'),
      reportCount: 7,
      reports: [
        'Upcoming Retirements',
        'Retirement Benefits Summary',
        'Pension Calculations',
        'Service Award Report',
        'Retirement Notifications',
        'Gratuity Analysis',
        'Exit Interview Summary'
      ]
    },
    {
      id: 'training-reports',
      name: 'Training & Development',
      description: 'Training analytics, completion rates, and skill development',
      icon: GraduationCap,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      iconBg: 'bg-indigo-100',
      action: () => console.log('Training reports coming soon'),
      reportCount: 8,
      reports: [
        'Training Completion Report',
        'Skill Gap Analysis',
        'Training ROI Analysis',
        'Certification Tracking',
        'Training Calendar Report',
        'Employee Development Plans',
        'Training Budget Analysis',
        'Training Feedback Summary'
      ]
    },
    {
      id: 'transfer-reports',
      name: 'Transfer & Mobility',
      description: 'Transfer analysis, mobility patterns, and relocation reports',
      icon: Plane,
      color: 'bg-teal-50 text-teal-700 border-teal-200',
      iconBg: 'bg-teal-100',
      action: () => console.log('Transfer reports coming soon'),
      reportCount: 5,
      reports: [
        'Transfer Request Report',
        'Inter-branch Mobility',
        'Transfer Approval Trends',
        'Relocation Cost Analysis',
        'Department Transfer Patterns'
      ]
    },
    {
      id: 'performance-reports',
      name: 'Performance & Analytics',
      description: 'Performance metrics, KPI analysis, and productivity reports',
      icon: TrendingUp,
      color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      iconBg: 'bg-yellow-100',
      action: () => console.log('Performance reports coming soon'),
      reportCount: 9,
      reports: [
        'Performance Review Summary',
        'KPI Dashboard Report',
        'Goal Achievement Analysis',
        'Productivity Metrics',
        'Performance Trends',
        'Top Performers Report',
        'Performance Improvement Plans',
        'Competency Analysis',
        'Performance Distribution'
      ]
    },
    {
      id: 'compliance-reports',
      name: 'Compliance & Audit',
      description: 'Regulatory compliance, audit trails, and governance reports',
      icon: Shield,
      color: 'bg-gray-50 text-gray-700 border-gray-200',
      iconBg: 'bg-gray-100',
      action: () => console.log('Compliance reports coming soon'),
      reportCount: 6,
      reports: [
        'Audit Trail Report',
        'Compliance Dashboard',
        'Policy Adherence Report',
        'Risk Assessment Summary',
        'Document Compliance',
        'Regulatory Filing Report'
      ]
    }
  ];

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 24 * 60) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / (24 * 60));
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="w-8 h-8 mr-3 text-blue-600" />
            Reports & Analytics
          </h1>
          <p className="text-gray-600 mt-1">
            Generate comprehensive reports and analyze organizational data
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Quick Insights Charts */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
          Quick Insights
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {quickInsightCharts.map((chart) => (
            <div key={chart.id} className="bg-gray-50 rounded-lg p-4">
              <SimpleChart chart={chart} />
            </div>
          ))}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">248</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">42</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Downloads</p>
              <p className="text-2xl font-bold text-gray-900">1,247</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">18</p>
            </div>
          </div>
        </div>
      </div>

      {/* Report Categories */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Reports by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                className={`rounded-lg border-2 ${category.color} transition-all hover:shadow-md`}
              >
                <div className="p-4 border-b border-current border-opacity-20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 ${category.iconBg} rounded-lg flex items-center justify-center mr-3`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-xs opacity-75">{category.reportCount} reports</p>
                      </div>
                    </div>
                    <button 
                      onClick={category.action}
                      className="px-3 py-1 text-xs font-medium bg-white bg-opacity-50 rounded hover:bg-opacity-75 transition-colors"
                    >
                      Generate
                    </button>
                  </div>
                  <p className="text-sm mt-2 opacity-75">
                    {category.description}
                  </p>
                </div>
                <div className="p-3">
                  <div className="space-y-1">
                    {category.reports.slice(0, 4).map((report, idx) => (
                      <div key={idx} className="text-xs flex items-center">
                        <div className="w-1.5 h-1.5 bg-current opacity-60 rounded-full mr-2"></div>
                        {report}
                      </div>
                    ))}
                    {category.reports.length > 4 && (
                      <div className="text-xs opacity-60 mt-2">
                        +{category.reports.length - 4} more reports...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md transition-colors">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Generated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Records
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 text-gray-400 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{report.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {report.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatTimeAgo(report.generatedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.records.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.size}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-800">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{' '}
              <span className="font-medium">248</span> reports
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-3 py-1 text-sm border rounded hover:bg-gray-100">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Reports Modal */}
      <EmployeeReports
        isOpen={showEmployeeReports}
        onClose={() => setShowEmployeeReports(false)}
        currentFilters={{}}
      />
    </div>
  );
};

export default Reports;