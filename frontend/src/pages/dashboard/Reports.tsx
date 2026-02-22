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
  RefreshCw,
  Award,
  Stethoscope,
  Pill,
  Activity,
  Calculator,
  CreditCard,
  PiggyBank,
  Bell
} from 'lucide-react';
import SimpleChart from '../../components/SimpleChart';

const Reports = () => {
  const [showEmployeeReports, setShowEmployeeReports] = useState(false);
  const [showMedicalReports, setShowMedicalReports] = useState(false);
  const [showSalaryReports, setShowSalaryReports] = useState(false);
  const [showRetirementReports, setShowRetirementReports] = useState(false);
  const [showTrainingReports, setShowTrainingReports] = useState(false);
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

  // Detailed Salary & Payroll reports with sample data
  const salaryReports = [
    {
      id: 'salary-summary',
      name: 'Salary Summary Report',
      description: 'Comprehensive overview of salary distribution across the organization',
      icon: FileText,
      estimatedTime: '2-3 minutes',
      recordCount: 156,
      sampleData: {
        headers: ['Employee ID', 'Full Name', 'Department', 'Position', 'Basic Salary (LKR)', 'Allowances (LKR)', 'Total Salary (LKR)'],
        rows: [
          ['EMP001', 'Amara Jayasuriya', 'IT Services', 'Senior Developer', '120,000', '35,000', '155,000'],
          ['EMP002', 'Buddhika Silva', 'Finance', 'Finance Manager', '150,000', '45,000', '195,000'],
          ['EMP003', 'Chathurika Fernando', 'HR', 'HR Manager', '140,000', '42,000', '182,000'],
          ['EMP004', 'Dilani Wickramasinghe', 'Marketing', 'Marketing Executive', '85,000', '25,000', '110,000'],
          ['EMP005', 'Eshan Perera', 'Operations', 'Operations Coordinator', '75,000', '22,500', '97,500']
        ]
      }
    },
    {
      id: 'payroll-analysis',
      name: 'Payroll Analysis Report',
      description: 'Monthly payroll breakdown with deductions and net pay calculations',
      icon: Calculator,
      estimatedTime: '3-4 minutes',
      recordCount: 156,
      sampleData: {
        headers: ['Employee', 'Gross Pay (LKR)', 'EPF (8%)', 'Income Tax', 'Other Deductions', 'Net Pay (LKR)'],
        rows: [
          ['Amara Jayasuriya', '155,000', '12,400', '15,500', '2,500', '124,600'],
          ['Buddhika Silva', '195,000', '15,600', '25,350', '3,000', '151,050'],
          ['Chathurika Fernando', '182,000', '14,560', '22,100', '2,800', '142,540'],
          ['Dilani Wickramasinghe', '110,000', '8,800', '8,250', '1,500', '91,450'],
          ['Eshan Perera', '97,500', '7,800', '5,850', '1,200', '82,650']
        ]
      }
    },
    {
      id: 'salary-grade-distribution',
      name: 'Salary Grade Distribution',
      description: 'Analysis of salary grades and bands across departments',
      icon: TrendingUp,
      estimatedTime: '1-2 minutes',
      recordCount: 12,
      sampleData: {
        headers: ['Salary Grade', 'Range (LKR)', 'Employee Count', 'Percentage', 'Avg Salary (LKR)', 'Department Distribution'],
        rows: [
          ['Executive Level', '300K - 600K', '8', '5.1%', '425,000', 'Management: 8'],
          ['Senior Level', '200K - 300K', '23', '14.7%', '250,000', 'IT: 8, Finance: 6, HR: 5, Others: 4'],
          ['Mid Level', '150K - 200K', '45', '28.8%', '175,000', 'IT: 15, Marketing: 12, Operations: 10, Others: 8'],
          ['Junior Level', '100K - 150K', '52', '33.3%', '125,000', 'Operations: 18, Marketing: 15, IT: 12, Others: 7'],
          ['Entry Level', '75K - 100K', '28', '17.9%', '87,500', 'Admin: 12, Operations: 8, Others: 8']
        ]
      }
    },
    {
      id: 'increment-history',
      name: 'Increment History Report',
      description: 'Historical salary increments and promotion-based increases',
      icon: TrendingUp,
      estimatedTime: '2 minutes',
      recordCount: 89,
      sampleData: {
        headers: ['Employee', 'Previous Salary', 'New Salary', 'Increment %', 'Increment Type', 'Effective Date'],
        rows: [
          ['Amara Jayasuriya', '140,000', '155,000', '10.7%', 'Annual Increment', '2024-01-01'],
          ['Buddhika Silva', '175,000', '195,000', '11.4%', 'Promotion', '2024-07-01'],
          ['Chathurika Fernando', '165,000', '182,000', '10.3%', 'Annual Increment', '2024-01-01'],
          ['Gayan Rathnayake', '95,000', '110,000', '15.8%', 'Promotion', '2024-06-01'],
          ['Hasini Mendis', '85,000', '97,500', '14.7%', 'Performance Increment', '2024-04-01']
        ]
      }
    },
    {
      id: 'overtime-analysis',
      name: 'Overtime Analysis Report',
      description: 'Overtime hours and payments analysis across departments',
      icon: Clock,
      estimatedTime: '1-2 minutes',
      recordCount: 67,
      sampleData: {
        headers: ['Employee', 'Department', 'Regular Hours', 'OT Hours', 'OT Rate (LKR)', 'OT Payment (LKR)'],
        rows: [
          ['Ishara Bandara', 'IT Services', '160', '25', '1,250', '31,250'],
          ['Janith Kumara', 'Operations', '160', '18', '950', '17,100'],
          ['Kasun Wijesinghe', 'Finance', '160', '12', '1,100', '13,200'],
          ['Lahiru Jayawardena', 'IT Services', '160', '22', '1,200', '26,400'],
          ['Maria Fernando', 'HR', '160', '8', '1,150', '9,200']
        ]
      }
    },
    {
      id: 'bonus-distribution',
      name: 'Bonus Distribution Report',
      description: 'Performance bonuses and incentive payments analysis',
      icon: PiggyBank,
      estimatedTime: '1-2 minutes',
      recordCount: 134,
      sampleData: {
        headers: ['Employee', 'Department', 'Performance Rating', 'Bonus Type', 'Bonus Amount (LKR)', 'Payment Date'],
        rows: [
          ['Nimal Silva', 'Finance', 'Excellent', 'Annual Bonus', '45,000', '2024-03-15'],
          ['Oshadha Rajapaksa', 'IT Services', 'Outstanding', 'Project Bonus', '25,000', '2024-08-10'],
          ['Priya Senanayake', 'Marketing', 'Very Good', 'Sales Target Bonus', '35,000', '2024-09-20'],
          ['Qasim Hassan', 'Operations', 'Excellent', 'Annual Bonus', '30,000', '2024-03-15'],
          ['Rashini de Silva', 'HR', 'Very Good', 'Retention Bonus', '20,000', '2024-06-01']
        ]
      }
    },
    {
      id: 'salary-comparison',
      name: 'Salary Comparison Report',
      description: 'Market comparison and internal equity analysis',
      icon: BarChart3,
      estimatedTime: '2-3 minutes',
      recordCount: 156,
      sampleData: {
        headers: ['Position', 'Internal Avg (LKR)', 'Market Rate (LKR)', 'Variance %', 'Min Salary', 'Max Salary'],
        rows: [
          ['Senior Software Engineer', '185,000', '195,000', '-5.1%', '160,000', '220,000'],
          ['Finance Manager', '245,000', '235,000', '+4.3%', '220,000', '280,000'],
          ['HR Manager', '225,000', '215,000', '+4.7%', '200,000', '250,000'],
          ['Marketing Executive', '135,000', '140,000', '-3.6%', '120,000', '160,000'],
          ['Operations Manager', '210,000', '205,000', '+2.4%', '190,000', '230,000']
        ]
      }
    },
    {
      id: 'cost-center-analysis',
      name: 'Cost Center Analysis',
      description: 'Department-wise salary costs and budget utilization',
      icon: Building,
      estimatedTime: '2 minutes',
      recordCount: 8,
      sampleData: {
        headers: ['Department', 'Budget (LKR)', 'Actual Cost (LKR)', 'Utilization %', 'Headcount', 'Avg Cost per Employee'],
        rows: [
          ['IT Services', '9,500,000', '8,925,000', '94.0%', '45', '198,333'],
          ['Finance', '4,200,000', '4,150,000', '98.8%', '25', '166,000'],
          ['Human Resources', '3,600,000', '3,510,000', '97.5%', '18', '195,000'],
          ['Marketing', '5,100,000', '4,845,000', '95.0%', '32', '151,406'],
          ['Operations', '5,800,000', '5,510,000', '95.0%', '36', '153,056']
        ]
      }
    },
    {
      id: 'compensation-trends',
      name: 'Compensation Trends Report',
      description: 'Historical compensation trends and forecasting',
      icon: TrendingUp,
      estimatedTime: '2-3 minutes',
      recordCount: 24,
      sampleData: {
        headers: ['Period', 'Avg Salary (LKR)', 'Growth %', 'New Hires Avg', 'Promotion Impact', 'Market Adjustment'],
        rows: [
          ['Q4 2024', '128,500', '+8.2%', '95,000', '+12%', '+3%'],
          ['Q3 2024', '118,750', '+6.5%', '90,000', '+8%', '+2%'],
          ['Q2 2024', '111,500', '+5.8%', '85,000', '+6%', '+2%'],
          ['Q1 2024', '105,400', '+7.2%', '82,000', '+10%', '+4%'],
          ['Q4 2023', '98,300', '+6.8%', '78,000', '+8%', '+3%']
        ]
      }
    },
    {
      id: 'tax-deduction-summary',
      name: 'Tax & Deduction Summary',
      description: 'Comprehensive tax calculations and statutory deductions',
      icon: CreditCard,
      estimatedTime: '2-3 minutes',
      recordCount: 156,
      sampleData: {
        headers: ['Employee', 'Gross Salary', 'Income Tax', 'EPF Employee', 'ETF', 'Total Deductions', 'Net Salary'],
        rows: [
          ['Sunil Bandara', '185,000', '22,200', '14,800', '555', '37,555', '147,445'],
          ['Thilak Rathnayake', '165,000', '18,150', '13,200', '495', '31,845', '133,155'],
          ['Upul Chandana', '145,000', '14,500', '11,600', '435', '26,535', '118,465'],
          ['Vindya Perera', '125,000', '10,625', '10,000', '375', '21,000', '104,000'],
          ['Wasantha Kumara', '105,000', '7,350', '8,400', '315', '16,065', '88,935']
        ]
      }
    }
  ];

  // Detailed Retirement Management reports with sample data
  const retirementReports = [
    {
      id: 'upcoming-retirements',
      name: 'Upcoming Retirements Report',
      description: 'Employees approaching retirement age with detailed timeline',
      icon: Clock,
      estimatedTime: '1-2 minutes',
      recordCount: 23,
      sampleData: {
        headers: ['Employee ID', 'Full Name', 'Current Age', 'Retirement Date', 'Months Until Retirement', 'Years of Service', 'Department'],
        rows: [
          ['EMP087', 'Wimal Perera', '59.2', '2025-08-15', '10', '34.5', 'Finance'],
          ['EMP023', 'Kamala Wickramasinghe', '58.8', '2025-12-20', '14', '31.2', 'Administration'],
          ['EMP156', 'Sunil Rathnayake', '59.5', '2025-06-10', '8', '37.8', 'Operations'],
          ['EMP034', 'Indrani Fernando', '58.3', '2026-03-25', '17', '29.1', 'HR'],
          ['EMP098', 'Chandana Silva', '59.1', '2025-09-30', '11', '33.6', 'IT Services']
        ]
      }
    },
    {
      id: 'retirement-benefits-summary',
      name: 'Retirement Benefits Summary',
      description: 'Comprehensive overview of retirement benefits and entitlements',
      icon: PiggyBank,
      estimatedTime: '2-3 minutes',
      recordCount: 156,
      sampleData: {
        headers: ['Employee', 'Years of Service', 'Final Salary (LKR)', 'Gratuity (LKR)', 'EPF Balance (LKR)', 'Pension (LKR/Month)', 'Total Benefits'],
        rows: [
          ['Wimal Perera', '34.5', '285,000', '4,927,500', '12,450,000', '142,500', '17,520,000'],
          ['Kamala Wickramasinghe', '31.2', '245,000', '3,822,000', '9,280,000', '122,500', '13,224,500'],
          ['Sunil Rathnayake', '37.8', '320,000', '6,048,000', '15,680,000', '160,000', '21,888,000'],
          ['Indrani Fernando', '29.1', '225,000', '3,271,250', '8,520,000', '112,500', '11,903,750'],
          ['Chandana Silva', '33.6', '265,000', '4,452,000', '11,950,000', '132,500', '16,534,500']
        ]
      }
    },
    {
      id: 'pension-calculations',
      name: 'Pension Calculations Report',
      description: 'Detailed pension calculations based on service years and final salary',
      icon: Calculator,
      estimatedTime: '2 minutes',
      recordCount: 89,
      sampleData: {
        headers: ['Employee', 'Service Years', 'Pensionable Salary', 'Pension Rate %', 'Monthly Pension (LKR)', 'Annual Pension (LKR)', 'Status'],
        rows: [
          ['Wimal Perera', '34.5', '285,000', '50%', '142,500', '1,710,000', 'Calculated'],
          ['Kamala Wickramasinghe', '31.2', '245,000', '50%', '122,500', '1,470,000', 'Calculated'],
          ['Sunil Rathnayake', '37.8', '320,000', '50%', '160,000', '1,920,000', 'Calculated'],
          ['Indrani Fernando', '29.1', '225,000', '50%', '112,500', '1,350,000', 'Pending Review'],
          ['Chandana Silva', '33.6', '265,000', '50%', '132,500', '1,590,000', 'Calculated']
        ]
      }
    },
    {
      id: 'service-award-report',
      name: 'Service Award Report',
      description: 'Long service awards and recognition for retiring employees',
      icon: Award,
      estimatedTime: '1 minute',
      recordCount: 67,
      sampleData: {
        headers: ['Employee', 'Years of Service', 'Award Category', 'Award Value (LKR)', 'Presentation Date', 'Status', 'Special Recognition'],
        rows: [
          ['Wimal Perera', '34.5', 'Long Service Gold', '150,000', '2025-07-15', 'Scheduled', 'Excellence in Finance'],
          ['Sunil Rathnayake', '37.8', 'Distinguished Service', '200,000', '2025-05-10', 'Scheduled', 'Outstanding Leadership'],
          ['Kamala Wickramasinghe', '31.2', 'Long Service Silver', '100,000', '2025-11-20', 'Pending', 'Dedicated Service'],
          ['Chandana Silva', '33.6', 'Long Service Gold', '150,000', '2025-08-30', 'Scheduled', 'Innovation in IT'],
          ['Indrani Fernando', '29.1', 'Long Service Silver', '100,000', '2026-02-25', 'Pending', 'HR Excellence']
        ]
      }
    },
    {
      id: 'retirement-notifications',
      name: 'Retirement Notifications Report',
      description: 'Communication timeline and notification status for retiring employees',
      icon: Bell,
      estimatedTime: '1-2 minutes',
      recordCount: 45,
      sampleData: {
        headers: ['Employee', 'Retirement Date', '12-Month Notice', '6-Month Notice', '3-Month Notice', '1-Month Notice', 'Documentation Status'],
        rows: [
          ['Wimal Perera', '2025-08-15', 'Sent (Aug 2024)', 'Sent (Feb 2025)', 'Pending (May 2025)', 'Pending', 'In Progress'],
          ['Kamala Wickramasinghe', '2025-12-20', 'Sent (Dec 2024)', 'Pending (Jun 2025)', 'Pending', 'Pending', 'Not Started'],
          ['Sunil Rathnayake', '2025-06-10', 'Sent (Jun 2024)', 'Sent (Dec 2024)', 'Sent (Mar 2025)', 'Pending', 'Complete'],
          ['Chandana Silva', '2025-09-30', 'Sent (Sep 2024)', 'Pending (Mar 2025)', 'Pending', 'Pending', 'In Progress'],
          ['Indrani Fernando', '2026-03-25', 'Pending (Mar 2025)', 'Pending', 'Pending', 'Pending', 'Not Started']
        ]
      }
    },
    {
      id: 'gratuity-analysis',
      name: 'Gratuity Analysis Report',
      description: 'Gratuity calculations and payment analysis for retiring employees',
      icon: CreditCard,
      estimatedTime: '2-3 minutes',
      recordCount: 78,
      sampleData: {
        headers: ['Employee', 'Service Years', 'Last Drawn Salary', 'Gratuity Formula', 'Calculated Gratuity (LKR)', 'Tax Deduction (10%)', 'Net Gratuity'],
        rows: [
          ['Wimal Perera', '34.5', '285,000', '14.5 x Last Salary', '4,132,500', '413,250', '3,719,250'],
          ['Kamala Wickramasinghe', '31.2', '245,000', '14.5 x Last Salary', '3,552,500', '355,250', '3,197,250'],
          ['Sunil Rathnayake', '37.8', '320,000', '14.5 x Last Salary', '4,640,000', '464,000', '4,176,000'],
          ['Indrani Fernando', '29.1', '225,000', '14.5 x Last Salary', '3,262,500', '326,250', '2,936,250'],
          ['Chandana Silva', '33.6', '265,000', '14.5 x Last Salary', '3,842,500', '384,250', '3,458,250']
        ]
      }
    },
    {
      id: 'exit-interview-summary',
      name: 'Exit Interview Summary Report',
      description: 'Summary of exit interviews and feedback from retiring employees',
      icon: FileText,
      estimatedTime: '2 minutes',
      recordCount: 34,
      sampleData: {
        headers: ['Employee', 'Interview Date', 'Overall Satisfaction', 'Key Feedback Areas', 'Recommendations', 'Interviewer', 'Follow-up Required'],
        rows: [
          ['Rohan Gunawardena', '2024-09-15', 'Very Satisfied', 'Work-Life Balance, Benefits', 'Improve IT Infrastructure', 'HR Manager', 'No'],
          ['Sujatha Mendis', '2024-08-20', 'Satisfied', 'Career Development', 'More Training Programs', 'Department Head', 'Yes'],
          ['Arjuna Wickrama', '2024-10-05', 'Very Satisfied', 'Team Collaboration', 'Continue Team Building', 'HR Assistant', 'No'],
          ['Kumari Bandara', '2024-07-30', 'Satisfied', 'Communication, Processes', 'Digital Transformation', 'HR Manager', 'Yes'],
          ['Nimal Jayasuriya', '2024-09-25', 'Very Satisfied', 'Leadership, Culture', 'Maintain Company Values', 'Department Head', 'No']
        ]
      }
    }
  ];

  // Detailed Training & Development reports with sample data
  const trainingReports = [
    {
      id: 'training-completion-report',
      name: 'Training Completion Report',
      description: 'Comprehensive overview of training completion rates and progress',
      icon: BookOpen,
      estimatedTime: '2-3 minutes',
      recordCount: 245,
      sampleData: {
        headers: ['Employee', 'Department', 'Training Program', 'Start Date', 'Completion Date', 'Status', 'Score (%)'],
        rows: [
          ['Amara Jayasuriya', 'IT Services', 'Advanced React Development', '2024-09-01', '2024-10-15', 'Completed', '92%'],
          ['Buddhika Silva', 'Finance', 'Financial Management Certification', '2024-08-15', '2024-10-20', 'Completed', '87%'],
          ['Chathurika Fernando', 'HR', 'Leadership Development Program', '2024-09-10', 'In Progress', 'Active', '78%'],
          ['Dilani Wickramasinghe', 'Marketing', 'Digital Marketing Mastery', '2024-10-01', '2024-11-30', 'Active', '65%'],
          ['Eshan Perera', 'Operations', 'Six Sigma Green Belt', '2024-07-20', '2024-09-30', 'Completed', '94%']
        ]
      }
    },
    {
      id: 'skill-gap-analysis',
      name: 'Skill Gap Analysis Report',
      description: 'Analysis of current skills vs required skills across the organization',
      icon: TrendingUp,
      estimatedTime: '3-4 minutes',
      recordCount: 156,
      sampleData: {
        headers: ['Department', 'Required Skill', 'Current Level', 'Target Level', 'Gap Score', 'Employees Affected', 'Training Needed'],
        rows: [
          ['IT Services', 'Cloud Computing', '6.2/10', '8.5/10', '2.3', '35', 'AWS/Azure Certification'],
          ['Finance', 'Data Analytics', '5.8/10', '8.0/10', '2.2', '18', 'Power BI Training'],
          ['Marketing', 'Social Media Marketing', '7.1/10', '9.0/10', '1.9', '22', 'Advanced Social Media Course'],
          ['HR', 'Performance Management', '6.8/10', '8.5/10', '1.7', '12', 'HR Analytics Training'],
          ['Operations', 'Process Improvement', '6.5/10', '8.0/10', '1.5', '28', 'Lean Six Sigma Training']
        ]
      }
    },
    {
      id: 'training-roi-analysis',
      name: 'Training ROI Analysis Report',
      description: 'Return on investment analysis for training programs and initiatives',
      icon: Calculator,
      estimatedTime: '2-3 minutes',
      recordCount: 34,
      sampleData: {
        headers: ['Training Program', 'Investment (LKR)', 'Participants', 'Productivity Gain (%)', 'Cost Savings (LKR)', 'ROI (%)', 'Status'],
        rows: [
          ['Leadership Development Program', '850,000', '25', '18%', '1,200,000', '141%', 'Completed'],
          ['Advanced Excel Training', '320,000', '45', '15%', '480,000', '150%', 'Completed'],
          ['Customer Service Excellence', '560,000', '32', '22%', '890,000', '159%', 'Completed'],
          ['Digital Marketing Certification', '720,000', '18', '25%', '1,100,000', '153%', 'Ongoing'],
          ['Six Sigma Green Belt', '980,000', '15', '30%', '1,450,000', '148%', 'Completed']
        ]
      }
    },
    {
      id: 'certification-tracking',
      name: 'Certification Tracking Report',
      description: 'Tracking of professional certifications and their expiry dates',
      icon: Award,
      estimatedTime: '1-2 minutes',
      recordCount: 89,
      sampleData: {
        headers: ['Employee', 'Certification', 'Issuing Body', 'Issue Date', 'Expiry Date', 'Days Until Expiry', 'Status'],
        rows: [
          ['Amara Jayasuriya', 'AWS Solutions Architect', 'Amazon Web Services', '2023-05-15', '2026-05-15', '573', 'Valid'],
          ['Buddhika Silva', 'CPA Sri Lanka', 'CA Sri Lanka', '2022-08-20', '2025-08-20', '307', 'Valid'],
          ['Chathurika Fernando', 'SHRM-CP', 'SHRM', '2023-03-10', '2026-03-10', '507', 'Valid'],
          ['Dilani Wickramasinghe', 'Google Ads Certified', 'Google', '2024-06-01', '2025-06-01', '227', 'Valid'],
          ['Eshan Perera', 'Six Sigma Black Belt', 'ASQ', '2023-09-15', '2026-09-15', '696', 'Valid']
        ]
      }
    },
    {
      id: 'training-calendar-report',
      name: 'Training Calendar Report',
      description: 'Scheduled training sessions and capacity planning overview',
      icon: Calendar,
      estimatedTime: '1-2 minutes',
      recordCount: 67,
      sampleData: {
        headers: ['Training Program', 'Start Date', 'End Date', 'Duration (Days)', 'Capacity', 'Enrolled', 'Instructor', 'Venue'],
        rows: [
          ['Project Management Fundamentals', '2024-11-15', '2024-11-17', '3', '25', '23', 'Dr. Perera', 'Training Room A'],
          ['Data Analytics with Python', '2024-11-20', '2024-12-05', '12', '20', '18', 'Prof. Silva', 'IT Lab'],
          ['Effective Communication Skills', '2024-11-25', '2024-11-26', '2', '30', '28', 'Ms. Fernando', 'Conference Hall'],
          ['Financial Planning & Analysis', '2024-12-02', '2024-12-06', '5', '15', '14', 'Mr. Bandara', 'Training Room B'],
          ['Leadership Excellence Program', '2024-12-10', '2024-12-20', '8', '20', '19', 'Dr. Rathnayake', 'Executive Center']
        ]
      }
    },
    {
      id: 'employee-development-plans',
      name: 'Employee Development Plans Report',
      description: 'Individual development plans and career progression tracking',
      icon: Users,
      estimatedTime: '2-3 minutes',
      recordCount: 156,
      sampleData: {
        headers: ['Employee', 'Current Role', 'Target Role', 'Development Areas', 'Training Required', 'Timeline', 'Progress (%)'],
        rows: [
          ['Amara Jayasuriya', 'Senior Developer', 'Tech Lead', 'Leadership, Architecture', 'Leadership Program, System Design', '12 months', '65%'],
          ['Buddhika Silva', 'Finance Officer', 'Finance Manager', 'Team Management, Strategy', 'MBA, Leadership Course', '18 months', '45%'],
          ['Chathurika Fernando', 'HR Executive', 'HR Manager', 'Policy Development, Analytics', 'HR Analytics, Change Management', '15 months', '70%'],
          ['Dilani Wickramasinghe', 'Marketing Executive', 'Marketing Manager', 'Digital Strategy, Team Lead', 'Digital Marketing, Leadership', '14 months', '55%'],
          ['Eshan Perera', 'Operations Coordinator', 'Operations Manager', 'Process Optimization, Leadership', 'Six Sigma, Management Training', '16 months', '60%']
        ]
      }
    },
    {
      id: 'training-budget-analysis',
      name: 'Training Budget Analysis Report',
      description: 'Training budget utilization and cost analysis by department',
      icon: PiggyBank,
      estimatedTime: '2 minutes',
      recordCount: 8,
      sampleData: {
        headers: ['Department', 'Annual Budget (LKR)', 'Spent (LKR)', 'Utilization (%)', 'Remaining (LKR)', 'Training Hours', 'Cost per Hour'],
        rows: [
          ['IT Services', '2,500,000', '2,250,000', '90%', '250,000', '1,250', '1,800'],
          ['Finance', '1,200,000', '980,000', '82%', '220,000', '480', '2,042'],
          ['Human Resources', '800,000', '720,000', '90%', '80,000', '360', '2,000'],
          ['Marketing', '1,500,000', '1,275,000', '85%', '225,000', '650', '1,962'],
          ['Operations', '1,800,000', '1,530,000', '85%', '270,000', '780', '1,962']
        ]
      }
    },
    {
      id: 'training-feedback-summary',
      name: 'Training Feedback Summary Report',
      description: 'Training effectiveness and participant feedback analysis',
      icon: FileText,
      estimatedTime: '2-3 minutes',
      recordCount: 178,
      sampleData: {
        headers: ['Training Program', 'Participants', 'Avg Rating (1-5)', 'Content Quality', 'Instructor Rating', 'Recommendations', 'Completion Rate'],
        rows: [
          ['Leadership Development Program', '25', '4.6', '4.7', '4.8', '96%', '92%'],
          ['Advanced Excel Training', '45', '4.3', '4.2', '4.5', '89%', '98%'],
          ['Customer Service Excellence', '32', '4.5', '4.4', '4.6', '94%', '94%'],
          ['Digital Marketing Certification', '18', '4.4', '4.3', '4.5', '92%', '89%'],
          ['Six Sigma Green Belt', '15', '4.7', '4.8', '4.9', '98%', '87%']
        ]
      }
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
      action: () => setShowSalaryReports(true),
      reportCount: salaryReports.length,
      reports: salaryReports.map(report => report.name)
    },
    {
      id: 'retirement-reports',
      name: 'Retirement Management',
      description: 'Retirement planning, pension analysis, and benefit reports',
      icon: UserMinus,
      color: 'bg-orange-50 text-orange-700 border-orange-200',
      iconBg: 'bg-orange-100',
      action: () => setShowRetirementReports(true),
      reportCount: retirementReports.length,
      reports: retirementReports.map(report => report.name)
    },
    {
      id: 'training-reports',
      name: 'Training & Development',
      description: 'Training analytics, completion rates, and skill development',
      icon: GraduationCap,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      iconBg: 'bg-indigo-100',
      action: () => setShowTrainingReports(true),
      reportCount: trainingReports.length,
      reports: trainingReports.map(report => report.name)
    },
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
      
      {/* Salary & Payroll Reports Modal */}
      {showSalaryReports && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b bg-green-50">
              <div className="flex items-center">
                <DollarSign className="w-6 h-6 text-green-600 mr-3" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Salary & Payroll Reports</h3>
                  <p className="text-sm text-gray-600">Generate comprehensive salary analysis and payroll reports</p>
                </div>
              </div>
              <button
                onClick={() => setShowSalaryReports(false)}
                className="p-2 hover:bg-green-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {salaryReports.map((report) => (
                  <div key={report.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <report.icon className="w-5 h-5 text-green-600 mr-2" />
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
                        className="flex-1 px-3 py-2 text-xs bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors flex items-center justify-center"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Preview
                      </button>
                      <button className="flex-1 px-3 py-2 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center">
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
                    Generate Monthly Payroll
                  </button>
                  <button className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors">
                    Schedule Annual Salary Review
                  </button>
                  <button className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors">
                    Export to Finance System
                  </button>
                  <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                    Send to Tax Consultant
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Retirement Management Reports Modal */}
      {showRetirementReports && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b bg-orange-50">
              <div className="flex items-center">
                <UserMinus className="w-6 h-6 text-orange-600 mr-3" />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Retirement Management Reports</h3>
                  <p className="text-sm text-gray-600">Generate comprehensive retirement planning and benefit reports</p>
                </div>
              </div>
              <button
                onClick={() => setShowRetirementReports(false)}
                className="p-2 hover:bg-orange-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {retirementReports.map((report) => (
                  <div key={report.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <report.icon className="w-5 h-5 text-orange-600 mr-2" />
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
                        className="flex-1 px-3 py-2 text-xs bg-orange-50 text-orange-600 rounded hover:bg-orange-100 transition-colors flex items-center justify-center"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Preview
                      </button>
                      <button className="flex-1 px-3 py-2 text-xs bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors flex items-center justify-center">
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
                  <button className="px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors">
                    Generate Retirement Calendar
                  </button>
                  <button className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors">
                    Schedule Retirement Interviews
                  </button>
                  <button className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors">
                    Export to Pension Fund
                  </button>
                  <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                    Send Benefit Statements
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Training & Development Reports Modal */}
      {showTrainingReports && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden m-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                  <GraduationCap className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Training & Development Reports</h3>
                  <p className="text-sm text-gray-600">Training analytics, completion rates, and skill development</p>
                </div>
              </div>
              <button
                onClick={() => setShowTrainingReports(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {trainingReports.map((report) => (
                  <div key={report.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <report.icon className="w-5 h-5 text-indigo-600 mr-2" />
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
                        className="flex-1 px-3 py-2 text-xs bg-indigo-50 text-indigo-600 rounded hover:bg-indigo-100 transition-colors flex items-center justify-center"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Preview
                      </button>
                      <button className="flex-1 px-3 py-2 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors flex items-center justify-center">
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
                  <button className="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors">
                    Generate Training Calendar
                  </button>
                  <button className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors">
                    Schedule Skills Assessment
                  </button>
                  <button className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors">
                    Export Development Plans
                  </button>
                  <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
                    Training ROI Dashboard
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