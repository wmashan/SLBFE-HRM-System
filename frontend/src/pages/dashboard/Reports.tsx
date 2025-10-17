import { useState } from 'react';
import { 
  BarChart3, 
  FileText, 
  Users, 
  Heart, 
  DollarSign, 
  Calendar, 
  TrendingUp,
  Download,
  Search,
  Filter,
  Eye,
  Trash2,
  Building,
  BookOpen,
  Shield,
  UserCheck,
  X,
  FileBarChart,
  Clock,
  UserMinus,
  GraduationCap,
  Plane,
  RefreshCw,
  Award,
  Stethoscope,
  Pill,
  Activity
} from 'lucide-react';
import SimpleChart from '../../components/SimpleChart';

const Reports = () => {
  const [showEmployeeReports, setShowEmployeeReports] = useState(false);
  const [showMedicalReports, setShowMedicalReports] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewReport, setPreviewReport] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

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

  // Detailed Employee Management reports with sample data
  const employeeReports = [
    {
      id: 'emp-summary',
      name: 'Employee Summary Report',
      description: 'Comprehensive overview of all employees with key metrics',
      icon: FileBarChart,
      estimatedTime: '2-3 minutes',
      recordCount: 156,
      sampleData: {
        headers: ['Employee ID', 'Full Name', 'Department', 'Position', 'Join Date', 'Status'],
        rows: [
          ['EMP001', 'John Silva', 'IT Services', 'Senior Developer', '2022-01-15', 'Active'],
          ['EMP002', 'Maria Fernando', 'Human Resources', 'HR Manager', '2021-03-10', 'Active'],
          ['EMP003', 'Kasun Perera', 'Finance', 'Accountant', '2023-06-20', 'Active'],
          ['EMP004', 'Dilani Wickramasinghe', 'Marketing', 'Marketing Executive', '2022-09-05', 'Active'],
          ['EMP005', 'Thilak Rathnayake', 'Operations', 'Operations Manager', '2020-11-12', 'Active']
        ]
      }
    },
    {
      id: 'emp-demographics',
      name: 'Demographics Analysis',
      description: 'Age distribution, gender analysis, and demographic insights',
      icon: Users,
      estimatedTime: '1-2 minutes',
      recordCount: 156,
      sampleData: {
        headers: ['Age Group', 'Male', 'Female', 'Total', 'Percentage'],
        rows: [
          ['20-25', '12', '8', '20', '12.8%'],
          ['26-30', '25', '18', '43', '27.6%'],
          ['31-35', '22', '15', '37', '23.7%'],
          ['36-40', '18', '12', '30', '19.2%'],
          ['40+', '16', '10', '26', '16.7%']
        ]
      }
    },
    {
      id: 'dept-wise',
      name: 'Department-wise Employee Report',
      description: 'Employee distribution across departments with headcount analysis',
      icon: Building,
      estimatedTime: '2 minutes',
      recordCount: 6,
      sampleData: {
        headers: ['Department', 'Total Employees', 'Full-time', 'Contract', 'Manager', 'Avg Tenure'],
        rows: [
          ['IT Services', '45', '40', '5', 'Sunil Bandara', '2.3 years'],
          ['Human Resources', '18', '16', '2', 'Maria Fernando', '3.1 years'],
          ['Finance', '25', '23', '2', 'Nimal Silva', '2.8 years'],
          ['Marketing', '32', '28', '4', 'Priya Jayawardena', '1.9 years'],
          ['Operations', '36', '34', '2', 'Thilak Rathnayake', '3.5 years']
        ]
      }
    },
    {
      id: 'service-tenure',
      name: 'Service Tenure Analysis',
      description: 'Employee service length analysis and retention insights',
      icon: Clock,
      estimatedTime: '1-2 minutes',
      recordCount: 156,
      sampleData: {
        headers: ['Tenure Range', 'Count', 'Percentage', 'Department Distribution', 'Retention Rate'],
        rows: [
          ['0-1 year', '42', '26.9%', 'IT: 15, Marketing: 12, Others: 15', '85%'],
          ['1-2 years', '48', '30.8%', 'Operations: 18, Finance: 12, Others: 18', '92%'],
          ['2-3 years', '35', '22.4%', 'HR: 10, IT: 12, Others: 13', '88%'],
          ['3-5 years', '23', '14.7%', 'Finance: 8, Operations: 7, Others: 8', '95%'],
          ['5+ years', '8', '5.1%', 'Mixed across all departments', '98%']
        ]
      }
    },
    {
      id: 'new-joiners',
      name: 'New Joiners Report',
      description: 'Recent hires and onboarding status tracking',
      icon: UserCheck,
      estimatedTime: '1 minute',
      recordCount: 23,
      sampleData: {
        headers: ['Employee Name', 'Join Date', 'Department', 'Position', 'Onboarding Status', 'Mentor'],
        rows: [
          ['Amara Jayasuriya', '2024-10-01', 'IT Services', 'Software Engineer', 'In Progress', 'John Silva'],
          ['Rukshan Fernando', '2024-10-05', 'Marketing', 'Digital Marketer', 'Completed', 'Priya Jayawardena'],
          ['Nishadi Perera', '2024-10-10', 'Finance', 'Junior Accountant', 'In Progress', 'Nimal Silva'],
          ['Chathurika Silva', '2024-10-12', 'HR', 'HR Assistant', 'Pending', 'Maria Fernando'],
          ['Danuka Wijesinghe', '2024-10-15', 'Operations', 'Operations Executive', 'In Progress', 'Thilak Rathnayake']
        ]
      }
    },
    {
      id: 'employee-directory',
      name: 'Employee Directory',
      description: 'Complete employee contact information and organizational structure',
      icon: BookOpen,
      estimatedTime: '3-4 minutes',
      recordCount: 156,
      sampleData: {
        headers: ['Employee ID', 'Name', 'Position', 'Department', 'Email', 'Phone', 'Location'],
        rows: [
          ['EMP001', 'John Silva', 'Senior Developer', 'IT Services', 'john.silva@slbfe.lk', '+94 77 123 4567', 'Colombo'],
          ['EMP002', 'Maria Fernando', 'HR Manager', 'Human Resources', 'maria.fernando@slbfe.lk', '+94 71 234 5678', 'Colombo'],
          ['EMP003', 'Kasun Perera', 'Accountant', 'Finance', 'kasun.perera@slbfe.lk', '+94 76 345 6789', 'Colombo'],
          ['EMP004', 'Dilani Wickramasinghe', 'Marketing Executive', 'Marketing', 'dilani.w@slbfe.lk', '+94 75 456 7890', 'Gampaha'],
          ['EMP005', 'Thilak Rathnayake', 'Operations Manager', 'Operations', 'thilak.r@slbfe.lk', '+94 78 567 8901', 'Kandy']
        ]
      }
    },
    {
      id: 'employment-types',
      name: 'Employment Type Analysis',
      description: 'Analysis of full-time, contract, and temporary employees',
      icon: Award,
      estimatedTime: '1 minute',
      recordCount: 156,
      sampleData: {
        headers: ['Employment Type', 'Count', 'Percentage', 'Avg Salary Range', 'Benefits Eligible'],
        rows: [
          ['Full-time Permanent', '132', '84.6%', 'LKR 50K - 200K', 'Yes'],
          ['Contract', '19', '12.2%', 'LKR 40K - 150K', 'Partial'],
          ['Part-time', '3', '1.9%', 'LKR 25K - 60K', 'Limited'],
          ['Internship', '2', '1.3%', 'LKR 15K - 25K', 'No']
        ]
      }
    }
  ];

  // Detailed Medical Claims reports with sample data
  const medicalReports = [
    {
      id: 'medical-claims-summary',
      name: 'Medical Claims Summary',
      description: 'Comprehensive overview of all medical claims with key statistics',
      icon: FileText,
      estimatedTime: '2-3 minutes',
      recordCount: 342,
      sampleData: {
        headers: ['Claim ID', 'Employee Name', 'Claim Type', 'Amount (LKR)', 'Status', 'Date Submitted', 'Hospital/Clinic'],
        rows: [
          ['MC001', 'Amara Jayasuriya', 'Specialist Consultation', '15,000', 'Approved', '2024-10-10', 'Asiri Hospital Colombo'],
          ['MC002', 'Buddhika Silva', 'Emergency Care', '125,000', 'Processing', '2024-10-08', 'Nawaloka Hospital Nugegoda'],
          ['MC003', 'Chathurika Fernando', 'Dental Treatment', '8,500', 'Approved', '2024-10-05', 'Dental Hospital Maharagama'],
          ['MC004', 'Dilani Wickramasinghe', 'Eye Surgery', '45,000', 'Pending', '2024-10-12', 'Lanka Hospitals Eye Centre'],
          ['MC005', 'Eshan Perera', 'Pharmacy Bills', '3,200', 'Approved', '2024-10-15', 'OSUSALA - State Pharmaceuticals']
        ]
      }
    },
    {
      id: 'claims-by-department',
      name: 'Claims by Department',
      description: 'Medical claims analysis grouped by employee departments',
      icon: Building,
      estimatedTime: '1-2 minutes',
      recordCount: 6,
      sampleData: {
        headers: ['Department', 'Total Claims', 'Total Amount (LKR)', 'Avg Claim (LKR)', 'Approved Claims', 'Approval Rate'],
        rows: [
          ['IT Services', '89', '2,450,000', '27,528', '82', '92.1%'],
          ['Human Resources', '34', '845,000', '24,853', '31', '91.2%'],
          ['Finance', '45', '1,125,000', '25,000', '42', '93.3%'],
          ['Marketing', '67', '1,678,000', '25,045', '61', '91.0%'],
          ['Operations', '78', '1,890,000', '24,231', '71', '91.0%'],
          ['Administration', '29', '687,500', '23,707', '26', '89.7%']
        ]
      }
    },
    {
      id: 'medical-utilization',
      name: 'Medical Utilization Report',
      description: 'Analysis of medical service utilization patterns and trends',
      icon: Activity,
      estimatedTime: '2 minutes',
      recordCount: 12,
      sampleData: {
        headers: ['Service Type', 'Total Visits', 'Total Cost (LKR)', 'Avg Cost per Visit', 'Most Used Month', 'Growth Rate'],
        rows: [
          ['General Physician', '156', '1,245,000', '7,981', 'September', '+12%'],
          ['Cardiologist', '89', '1,780,000', '20,000', 'October', '+8%'],
          ['Dental Treatment', '67', '536,000', '8,000', 'August', '+15%'],
          ['Ophthalmologist', '34', '408,000', '12,000', 'September', '+5%'],
          ['Laboratory & Radiology', '234', '702,000', '3,000', 'October', '+18%'],
          ['Prescription Medicines', '445', '890,000', '2,000', 'September', '+22%'],
          ['Physiotherapy', '23', '345,000', '15,000', 'August', '+25%']
        ]
      }
    },
    {
      id: 'pending-claims',
      name: 'Pending Claims Report',
      description: 'Claims awaiting approval with aging analysis',
      icon: Clock,
      estimatedTime: '1 minute',
      recordCount: 47,
      sampleData: {
        headers: ['Claim ID', 'Employee', 'Department', 'Amount (LKR)', 'Days Pending', 'Priority', 'Assigned To'],
        rows: [
          ['MC156', 'Amara Jayasuriya', 'IT Services', '45,000', '12', 'High', 'Dr. Perera'],
          ['MC142', 'Rukshan Fernando', 'Marketing', '8,500', '8', 'Medium', 'Dr. Silva'],
          ['MC139', 'Nishadi Perera', 'Finance', '15,000', '6', 'Medium', 'Dr. Fernando'],
          ['MC167', 'Chathurika Silva', 'HR', '25,000', '15', 'High', 'Dr. Bandara'],
          ['MC178', 'Danuka Wijesinghe', 'Operations', '12,500', '4', 'Low', 'Dr. Rathnayake']
        ]
      }
    },
    {
      id: 'medical-expense-analysis',
      name: 'Medical Expense Analysis',
      description: 'Cost analysis and budget utilization for medical benefits',
      icon: DollarSign,
      estimatedTime: '2-3 minutes',
      recordCount: 24,
      sampleData: {
        headers: ['Month', 'Budget (LKR)', 'Actual Spend (LKR)', 'Utilization %', 'Savings (LKR)', 'Top Expense Category'],
        rows: [
          ['January 2024', '500,000', '425,000', '85%', '75,000', 'Specialist Consultations'],
          ['February 2024', '500,000', '478,000', '95.6%', '22,000', 'Inpatient Care'],
          ['March 2024', '500,000', '445,000', '89%', '55,000', 'Laboratory Tests'],
          ['April 2024', '500,000', '512,000', '102.4%', '-12,000', 'Emergency Care'],
          ['May 2024', '500,000', '467,000', '93.4%', '33,000', 'Pharmacy']
        ]
      }
    },
    {
      id: 'claims-approval-trends',
      name: 'Claims Approval Trends',
      description: 'Analysis of claim approval patterns and processing efficiency',
      icon: Shield,
      estimatedTime: '1-2 minutes',
      recordCount: 18,
      sampleData: {
        headers: ['Period', 'Total Claims', 'Approved', 'Rejected', 'Approval Rate', 'Avg Processing Days', 'Auto-Approved'],
        rows: [
          ['Oct 2024 W1', '45', '41', '4', '91.1%', '3.2', '28'],
          ['Oct 2024 W2', '52', '48', '4', '92.3%', '2.8', '32'],
          ['Sep 2024 W4', '38', '35', '3', '92.1%', '3.5', '24'],
          ['Sep 2024 W3', '41', '37', '4', '90.2%', '4.1', '22'],
          ['Sep 2024 W2', '49', '46', '3', '93.9%', '2.9', '31']
        ]
      }
    },
    {
      id: 'medical-balance-report',
      name: 'Medical Balance Report',
      description: 'Employee medical allowance balances and usage tracking',
      icon: Pill,
      estimatedTime: '2 minutes',
      recordCount: 156,
      sampleData: {
        headers: ['Employee ID', 'Name', 'Annual Allowance', 'Used Amount', 'Balance', 'Usage %', 'Last Claim Date'],
        rows: [
          ['EMP001', 'John Silva', '100,000', '67,500', '32,500', '67.5%', '2024-10-10'],
          ['EMP002', 'Maria Fernando', '100,000', '45,000', '55,000', '45%', '2024-09-22'],
          ['EMP003', 'Kasun Perera', '80,000', '23,500', '56,500', '29.4%', '2024-10-05'],
          ['EMP004', 'Dilani Wickramasinghe', '100,000', '78,200', '21,800', '78.2%', '2024-10-12'],
          ['EMP005', 'Thilak Rathnayake', '120,000', '89,300', '30,700', '74.4%', '2024-10-15']
        ]
      }
    },
    {
      id: 'hospital-wise-claims',
      name: 'Hospital-wise Claims Analysis',
      description: 'Claims distribution and cost analysis by healthcare providers',
      icon: Stethoscope,
      estimatedTime: '1-2 minutes',
      recordCount: 28,
      sampleData: {
        headers: ['Healthcare Provider', 'Total Claims', 'Total Amount (LKR)', 'Avg Claim (LKR)', 'Most Common Service', 'Rating'],
        rows: [
          ['Asiri Hospital Colombo', '67', '1,675,000', '25,000', 'Specialist Consultations', '4.2/5'],
          ['Nawaloka Hospital Nugegoda', '54', '1,890,000', '35,000', 'Inpatient Care', '4.5/5'],
          ['Lanka Hospitals Colombo', '43', '860,000', '20,000', 'Laboratory Tests', '4.1/5'],
          ['Durdans Hospital', '38', '1,140,000', '30,000', 'Surgical Procedures', '4.3/5'],
          ['National Hospital Colombo', '52', '780,000', '15,000', 'General Medicine', '4.0/5'],
          ['Apollo Hospital Colombo', '29', '1,160,000', '40,000', 'Emergency Care', '4.4/5']
        ]
      }
    }
  ];

  // Sample data generators for realistic previews
  const generateEmployeeId = (index: number) => `EMP${(index + 1).toString().padStart(3, '0')}`;
  
  const sriLankanNames = [
    'Amara Jayasuriya', 'Buddhika Silva', 'Chathurika Fernando', 'Dilani Wickramasinghe', 
    'Eshan Perera', 'Fathima Nazir', 'Gayan Rathnayake', 'Hasini Mendis', 'Ishara Bandara',
    'Janith Kumara', 'Kasun Wijesinghe', 'Lahiru Jayawardena', 'Maria Fernando', 'Nimal Silva',
    'Oshadha Rajapaksa', 'Priya Senanayake', 'Qasim Hassan', 'Rashini de Silva', 'Sunil Bandara',
    'Thilak Rathnayake', 'Upul Chandana', 'Vindya Perera', 'Wasantha Kumara', 'Ximena Rodrigo'
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
      reportCount: employeeReports.length,
      reports: employeeReports.map(report => report.name)
    },
    {
      id: 'medical-reports',
      name: 'Medical Claims',
      description: 'Medical claims analysis, utilization, and financial reports',
      icon: Heart,
      color: 'bg-red-50 text-red-700 border-red-200',
      iconBg: 'bg-red-100',
      action: () => setShowMedicalReports(true),
      reportCount: medicalReports.length,
      reports: medicalReports.map(report => report.name)
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

  const handlePreviewReport = (report: any) => {
    setPreviewReport(report);
    setShowPreview(true);
  };

  const PreviewModal = () => {
    if (!previewReport || !showPreview) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b bg-gray-50">
            <div className="flex items-center">
              <previewReport.icon className="w-5 h-5 text-blue-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{previewReport.name}</h3>
                <p className="text-sm text-gray-600">{previewReport.description}</p>
              </div>
            </div>
            <button
              onClick={() => setShowPreview(false)}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-6">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>Est. time: {previewReport.estimatedTime}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <FileText className="w-4 h-4 mr-1" />
                  <span>{previewReport.recordCount} records</span>
                </div>
              </div>
              <div className="flex space-x-3">
                <button className="px-4 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                  <Eye className="w-4 h-4 mr-2 inline" />
                  Preview Full Report
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Download className="w-4 h-4 mr-2 inline" />
                  Download Report
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Sample Data Preview</h4>
              <div className="bg-white rounded border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {previewReport.sampleData.headers.map((header: string, index: number) => (
                          <th key={index} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {previewReport.sampleData.rows.map((row: string[], rowIndex: number) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                          {row.map((cell: string, cellIndex: number) => (
                            <td key={cellIndex} className="px-4 py-3 whitespace-nowrap text-gray-900 border-b">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Showing sample data (first 5 rows). Full report contains {previewReport.recordCount} records.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
      {showEmployeeReports && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b bg-blue-50">
              <div className="flex items-center">
                <Users className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Employee Management Reports</h3>
                  <p className="text-sm text-gray-600">Generate comprehensive employee analytics and reports</p>
                </div>
              </div>
              <button
                onClick={() => setShowEmployeeReports(false)}
                className="p-2 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {employeeReports.map((report) => (
                  <div key={report.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <report.icon className="w-5 h-5 text-blue-600 mr-2" />
                        <h4 className="font-medium text-gray-900">{report.name}</h4>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{report.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{report.estimatedTime}</span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="w-3 h-3 mr-1" />
                        <span>{report.recordCount} records</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePreviewReport(report)}
                        className="flex-1 px-3 py-2 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors flex items-center justify-center"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Preview
                      </button>
                      <button className="flex-1 px-3 py-2 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center">
                        <Download className="w-3 h-3 mr-1" />
                        Generate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Quick Actions</h4>
                <div className="flex flex-wrap gap-2">
                  <button className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors">
                    Generate All Reports
                  </button>
                  <button className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors">
                    Schedule Monthly Reports
                  </button>
                  <button className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors">
                    Export to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Medical Reports Modal */}
      {showMedicalReports && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b bg-red-50">
              <div className="flex items-center">
                <Heart className="w-6 h-6 text-red-600 mr-3" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Medical Claims Reports</h3>
                  <p className="text-sm text-gray-600">Generate comprehensive medical claims analytics and reports</p>
                </div>
              </div>
              <button
                onClick={() => setShowMedicalReports(false)}
                className="p-2 hover:bg-red-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {medicalReports.map((report) => (
                  <div key={report.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <report.icon className="w-5 h-5 text-red-600 mr-2" />
                        <h4 className="font-medium text-gray-900">{report.name}</h4>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{report.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{report.estimatedTime}</span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="w-3 h-3 mr-1" />
                        <span>{report.recordCount} records</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handlePreviewReport(report)}
                        className="flex-1 px-3 py-2 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors flex items-center justify-center"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Preview
                      </button>
                      <button className="flex-1 px-3 py-2 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center justify-center">
                        <Download className="w-3 h-3 mr-1" />
                        Generate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Quick Actions</h4>
                <div className="flex flex-wrap gap-2">
                  <button className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors">
                    Generate All Medical Reports
                  </button>
                  <button className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors">
                    Schedule Monthly Claims Report
                  </button>
                  <button className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors">
                    Export to Finance Dashboard
                  </button>
                  <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                    Send to Insurance Provider
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Report Preview Modal */}
      <PreviewModal />
    </div>
  );
};

export default Reports;