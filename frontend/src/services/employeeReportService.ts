import { 
  OutputFormat,
  EmployeeReportSection,
  ApiResponse
} from '../types';

export interface EmployeeReportConfig {
  id: string;
  name: string;
  description: string;
  type: EmployeeReportType;
  includedSections: EmployeeReportSection[];
  filters: EmployeeReportFilters;
  outputFormat: OutputFormat;
  includeCharts: boolean;
  groupBy?: EmployeeGroupBy;
  sortBy?: EmployeeSortBy;
}

export type EmployeeReportType = 
  | 'employee_summary'
  | 'demographics_analysis'
  | 'salary_analysis'
  | 'service_tenure_report'
  | 'education_qualifications'
  | 'department_wise_analysis'
  | 'branch_wise_analysis'
  | 'promotion_analysis'
  | 'age_distribution'
  | 'gender_analysis'
  | 'employee_directory'
  | 'birthday_list'
  | 'new_joiners_report'
  | 'employment_type_analysis'
  | 'comprehensive_employee_report'
  | 'custom_report';

export interface EmployeeReportFilters {
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  departments?: string[];
  branches?: string[];
  employmentTypes?: string[];
  educationLevels?: string[];
  genders?: string[];
  ageRange?: {
    min: number;
    max: number;
  };
  serviceYearsRange?: {
    min: number;
    max: number;
  };
  salaryRange?: {
    min: number;
    max: number;
  };
  positions?: string[];
  promotionStatus?: 'promoted' | 'not_promoted' | 'all';
  includeInactive?: boolean;
}

export type EmployeeGroupBy = 
  | 'department'
  | 'branch'
  | 'position'
  | 'employment_type'
  | 'education_level'
  | 'gender'
  | 'age_group'
  | 'service_years'
  | 'salary_range'
  | 'join_year';

export type EmployeeSortBy = 
  | 'name'
  | 'employee_id'
  | 'join_date'
  | 'department'
  | 'salary'
  | 'age'
  | 'service_years';

export interface EmployeeReportResult {
  id: string;
  config: EmployeeReportConfig;
  generatedAt: Date;
  totalRecords: number;
  data: any[];
  summary: EmployeeReportSummary;
  charts?: ChartData[];
  downloadUrl?: string;
  expiresAt: Date;
}

export interface EmployeeReportSummary {
  totalEmployees: number;
  demographics: {
    averageAge: number;
    genderDistribution: { [key: string]: number };
    averageServiceYears: number;
  };
  departments: { [key: string]: number };
  branches: { [key: string]: number };
  employmentTypes: { [key: string]: number };
  educationLevels: { [key: string]: number };
  salaryStatistics: {
    average: number;
    median: number;
    min: number;
    max: number;
  };
  promotions: {
    totalPromoted: number;
    promotionRate: number;
  };
}

export interface ChartData {
  id: string;
  title: string;
  type: 'bar' | 'pie' | 'line' | 'doughnut';
  data: any;
  options?: any;
}

// Pre-defined report configurations
export const PREDEFINED_REPORTS: EmployeeReportConfig[] = [
  {
    id: 'employee_summary',
    name: 'Employee Summary Report',
    description: 'Overview of all employees with basic information',
    type: 'employee_summary',
    includedSections: ['personal_details', 'employment_history'],
    filters: {},
    outputFormat: 'excel',
    includeCharts: true,
    groupBy: 'department',
    sortBy: 'name'
  },
  {
    id: 'demographics_analysis',
    name: 'Demographics Analysis',
    description: 'Detailed analysis of employee demographics',
    type: 'demographics_analysis',
    includedSections: ['personal_details'],
    filters: {},
    outputFormat: 'pdf',
    includeCharts: true,
    groupBy: 'age_group'
  },
  {
    id: 'department_wise',
    name: 'Department-wise Employee Report',
    description: 'Employee breakdown by departments',
    type: 'department_wise_analysis',
    includedSections: ['personal_details', 'employment_history'],
    filters: {},
    outputFormat: 'excel',
    includeCharts: true,
    groupBy: 'department',
    sortBy: 'department'
  },
  {
    id: 'salary_analysis',
    name: 'Salary Analysis Report',
    description: 'Comprehensive salary analysis across departments',
    type: 'salary_analysis',
    includedSections: ['personal_details', 'salary_history'],
    filters: {},
    outputFormat: 'excel',
    includeCharts: true,
    groupBy: 'department'
  },
  {
    id: 'education_qualifications',
    name: 'Education & Qualifications Report',
    description: 'Analysis of employee education and certifications',
    type: 'education_qualifications',
    includedSections: ['personal_details', 'certifications'],
    filters: {},
    outputFormat: 'pdf',
    includeCharts: true,
    groupBy: 'education_level'
  },
  {
    id: 'service_tenure',
    name: 'Service Tenure Report',
    description: 'Analysis of employee service duration and tenure',
    type: 'service_tenure_report',
    includedSections: ['personal_details', 'service_summary'],
    filters: {},
    outputFormat: 'excel',
    includeCharts: true,
    groupBy: 'service_years'
  },
  {
    id: 'promotion_analysis',
    name: 'Promotion Analysis Report',
    description: 'Analysis of employee promotions and career growth',
    type: 'promotion_analysis',
    includedSections: ['personal_details', 'transfer_history'],
    filters: {},
    outputFormat: 'pdf',
    includeCharts: true,
    groupBy: 'department'
  },
  {
    id: 'new_joiners',
    name: 'New Joiners Report',
    description: 'Report of employees who joined in the specified period',
    type: 'new_joiners_report',
    includedSections: ['personal_details', 'employment_history'],
    filters: {
      dateRange: {
        startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
      }
    },
    outputFormat: 'excel',
    includeCharts: true,
    groupBy: 'join_year',
    sortBy: 'join_date'
  },
  {
    id: 'birthday_list',
    name: 'Employee Birthday List',
    description: 'List of employee birthdays for the current month or specified period',
    type: 'birthday_list',
    includedSections: ['personal_details'],
    filters: {},
    outputFormat: 'pdf',
    includeCharts: false,
    sortBy: 'name'
  },
  {
    id: 'employee_directory',
    name: 'Employee Directory',
    description: 'Complete employee contact directory',
    type: 'employee_directory',
    includedSections: ['personal_details'],
    filters: {},
    outputFormat: 'pdf',
    includeCharts: false,
    groupBy: 'department',
    sortBy: 'name'
  }
];

class EmployeeReportService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = 'http://localhost:5000/api') {
    this.baseURL = baseURL;
    this.loadToken();
  }

  private loadToken(): void {
    this.token = localStorage.getItem('slbfe_auth_token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: this.getHeaders(),
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('Employee Report API Error:', error);
      throw error;
    }
  }

  // Get predefined report configurations
  getPredefinedReports(): EmployeeReportConfig[] {
    return PREDEFINED_REPORTS;
  }

  // Get report configuration by ID
  getReportConfig(reportId: string): EmployeeReportConfig | null {
    return PREDEFINED_REPORTS.find(report => report.id === reportId) || null;
  }

  // Generate report based on configuration
  async generateReport(config: EmployeeReportConfig): Promise<ApiResponse<EmployeeReportResult>> {
    try {
      return await this.request<EmployeeReportResult>('/reports/employees/generate', {
        method: 'POST',
        body: JSON.stringify(config),
      });
    } catch (error) {
      // Fallback to mock data for development
      return this.generateMockReport(config);
    }
  }

  // Mock report generation for development
  private async generateMockReport(config: EmployeeReportConfig): Promise<ApiResponse<EmployeeReportResult>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockData = this.getMockEmployeeData();
    const filteredData = this.applyFilters(mockData, config.filters);
    const processedData = this.processReportData(filteredData, config);
    const summary = this.generateSummary(processedData);
    const charts = config.includeCharts ? this.generateCharts(processedData, config) : [];

    const result: EmployeeReportResult = {
      id: `report_${Date.now()}`,
      config,
      generatedAt: new Date(),
      totalRecords: processedData.length,
      data: processedData,
      summary,
      charts,
      downloadUrl: this.generateMockDownloadUrl(config),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };

    return {
      success: true,
      data: result,
      message: 'Report generated successfully'
    };
  }

  // Apply filters to employee data
  private applyFilters(data: any[], filters: EmployeeReportFilters): any[] {
    let filtered = [...data];

    if (filters.departments && filters.departments.length > 0) {
      filtered = filtered.filter(emp => filters.departments!.includes(emp.division));
    }

    if (filters.branches && filters.branches.length > 0) {
      filtered = filtered.filter(emp => filters.branches!.includes(emp.branch));
    }

    if (filters.employmentTypes && filters.employmentTypes.length > 0) {
      filtered = filtered.filter(emp => filters.employmentTypes!.includes(emp.employmentType));
    }

    if (filters.genders && filters.genders.length > 0) {
      filtered = filtered.filter(emp => filters.genders!.includes(emp.gender));
    }

    if (filters.ageRange) {
      filtered = filtered.filter(emp => 
        emp.age >= filters.ageRange!.min && emp.age <= filters.ageRange!.max
      );
    }

    if (filters.dateRange) {
      const startDate = new Date(filters.dateRange.startDate);
      const endDate = new Date(filters.dateRange.endDate);
      filtered = filtered.filter(emp => {
        const joinDate = new Date(emp.dateJoined);
        return joinDate >= startDate && joinDate <= endDate;
      });
    }

    if (filters.promotionStatus && filters.promotionStatus !== 'all') {
      if (filters.promotionStatus === 'promoted') {
        filtered = filtered.filter(emp => emp.promotions && emp.promotions.length > 0);
      } else {
        filtered = filtered.filter(emp => !emp.promotions || emp.promotions.length === 0);
      }
    }

    return filtered;
  }

  // Process report data based on configuration
  private processReportData(data: any[], config: EmployeeReportConfig): any[] {
    let processed = [...data];

    // Apply sorting
    if (config.sortBy) {
      processed = this.sortData(processed, config.sortBy);
    }

    // Apply grouping if needed
    if (config.groupBy) {
      processed = this.groupData(processed, config.groupBy);
    }

    return processed;
  }

  // Sort data based on field
  private sortData(data: any[], sortBy: EmployeeSortBy): any[] {
    return data.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.fullName.localeCompare(b.fullName);
        case 'employee_id':
          return a.employeeNo.localeCompare(b.employeeNo);
        case 'join_date':
          return new Date(a.dateJoined).getTime() - new Date(b.dateJoined).getTime();
        case 'department':
          return a.division.localeCompare(b.division);
        case 'age':
          return a.age - b.age;
        default:
          return 0;
      }
    });
  }

  // Group data based on field
  private groupData(data: any[], groupBy: EmployeeGroupBy): any[] {
    const grouped = data.reduce((acc, emp) => {
      let key;
      switch (groupBy) {
        case 'department':
          key = emp.division;
          break;
        case 'branch':
          key = emp.branch;
          break;
        case 'employment_type':
          key = emp.employmentType;
          break;
        case 'gender':
          key = emp.gender;
          break;
        case 'education_level':
          key = emp.education?.highestQualification || 'Unknown';
          break;
        case 'age_group':
          if (emp.age < 25) key = '18-24';
          else if (emp.age < 35) key = '25-34';
          else if (emp.age < 45) key = '35-44';
          else if (emp.age < 55) key = '45-54';
          else key = '55+';
          break;
        default:
          key = 'All';
      }
      
      if (!acc[key]) acc[key] = [];
      acc[key].push(emp);
      return acc;
    }, {} as { [key: string]: any[] });

    // Flatten grouped data with group headers
    const result: any[] = [];
    Object.entries(grouped).forEach(([groupName, employees]) => {
      result.push({
        isGroupHeader: true,
        groupName,
        count: (employees as any[]).length
      });
      result.push(...(employees as any[]));
    });

    return result;
  }

  // Generate report summary statistics
  private generateSummary(data: any[]): EmployeeReportSummary {
    const employees = data.filter(item => !item.isGroupHeader);
    
    const genderDistribution = employees.reduce((acc, emp) => {
      acc[emp.gender] = (acc[emp.gender] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const departments = employees.reduce((acc, emp) => {
      acc[emp.division] = (acc[emp.division] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const branches = employees.reduce((acc, emp) => {
      acc[emp.branch] = (acc[emp.branch] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const employmentTypes = employees.reduce((acc, emp) => {
      acc[emp.employmentType] = (acc[emp.employmentType] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const educationLevels = employees.reduce((acc, emp) => {
      const level = emp.education?.highestQualification || 'Unknown';
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const ages = employees.map(emp => emp.age);
    const averageAge = ages.reduce((a, b) => a + b, 0) / ages.length;

    const serviceYears = employees.map(emp => {
      const joinDate = new Date(emp.dateJoined);
      const now = new Date();
      return now.getFullYear() - joinDate.getFullYear();
    });
    const averageServiceYears = serviceYears.reduce((a, b) => a + b, 0) / serviceYears.length;

    const promotedEmployees = employees.filter(emp => emp.promotions && emp.promotions.length > 0);

    // Mock salary data
    const salaries = employees.map(() => Math.floor(Math.random() * 100000) + 50000);
    const salaryStats = {
      average: salaries.reduce((a, b) => a + b, 0) / salaries.length,
      median: salaries.sort((a, b) => a - b)[Math.floor(salaries.length / 2)],
      min: Math.min(...salaries),
      max: Math.max(...salaries)
    };

    return {
      totalEmployees: employees.length,
      demographics: {
        averageAge: Math.round(averageAge * 10) / 10,
        genderDistribution,
        averageServiceYears: Math.round(averageServiceYears * 10) / 10
      },
      departments,
      branches,
      employmentTypes,
      educationLevels,
      salaryStatistics: salaryStats,
      promotions: {
        totalPromoted: promotedEmployees.length,
        promotionRate: Math.round((promotedEmployees.length / employees.length) * 100)
      }
    };
  }

  // Generate charts for the report
  private generateCharts(data: any[], _config: EmployeeReportConfig): ChartData[] {
    const employees = data.filter(item => !item.isGroupHeader);
    const charts: ChartData[] = [];

    // Department distribution chart
    const deptData = employees.reduce((acc, emp) => {
      acc[emp.division] = (acc[emp.division] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    charts.push({
      id: 'department_distribution',
      title: 'Employee Distribution by Department',
      type: 'pie',
      data: {
        labels: Object.keys(deptData),
        datasets: [{
          data: Object.values(deptData),
          backgroundColor: [
            '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444',
            '#6B7280', '#EC4899', '#14B8A6', '#F97316', '#84CC16'
          ]
        }]
      }
    });

    // Age distribution chart
    const ageGroups = employees.reduce((acc, emp) => {
      let group;
      if (emp.age < 25) group = '18-24';
      else if (emp.age < 35) group = '25-34';
      else if (emp.age < 45) group = '35-44';
      else if (emp.age < 55) group = '45-54';
      else group = '55+';
      
      acc[group] = (acc[group] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    charts.push({
      id: 'age_distribution',
      title: 'Age Distribution',
      type: 'bar',
      data: {
        labels: Object.keys(ageGroups),
        datasets: [{
          label: 'Number of Employees',
          data: Object.values(ageGroups),
          backgroundColor: '#3B82F6'
        }]
      }
    });

    // Gender distribution chart
    const genderData = employees.reduce((acc, emp) => {
      acc[emp.gender] = (acc[emp.gender] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    charts.push({
      id: 'gender_distribution',
      title: 'Gender Distribution',
      type: 'doughnut',
      data: {
        labels: Object.keys(genderData),
        datasets: [{
          data: Object.values(genderData),
          backgroundColor: ['#3B82F6', '#EC4899', '#6B7280']
        }]
      }
    });

    return charts;
  }

  // Get mock employee data (using the same data from Employees component)
  private getMockEmployeeData(): any[] {
    return [
      {
        id: 1,
        employeeNo: "9512",
        fullName: "John Doe",
        nameWithInitials: "J.D. Doe",
        designation: "Software Engineer",
        division: "IT Services",
        branch: "Colombo Main",
        grade: "Grade 2",
        email: "john.doe@slbfe.lk",
        mobile: "077-1234567",
        civilStatus: "Single",
        gender: "Male",
        age: 28,
        dateOfBirth: "1995-05-15",
        dateJoined: "2023-01-15",
        employmentType: "Permanent",
        promotions: [
          { date: "2023-12-01", from: "Junior Software Engineer", to: "Software Engineer" }
        ],
        education: {
          highestQualification: "Graduate",
          qualifications: ["O/L", "A/L", "Bachelor's Degree"]
        }
      },
      {
        id: 2,
        employeeNo: "9513",
        fullName: "Jane Smith",
        nameWithInitials: "J.S. Smith",
        designation: "HR Manager",
        division: "Human Resources",
        branch: "Colombo Main",
        grade: "Grade 1",
        email: "jane.smith@slbfe.lk",
        mobile: "077-2345678",
        civilStatus: "Married",
        gender: "Female",
        age: 36,
        dateOfBirth: "1987-08-22",
        dateJoined: "2022-06-10",
        employmentType: "Permanent",
        promotions: [
          { date: "2023-01-01", from: "Senior HR Officer", to: "HR Manager" }
        ],
        education: {
          highestQualification: "Graduate",
          qualifications: ["O/L", "A/L", "Master's Degree"]
        }
      },
      {
        id: 3,
        employeeNo: "9514",
        fullName: "Mike Johnson",
        nameWithInitials: "M.J. Johnson",
        designation: "Data Analyst",
        division: "Analytics",
        branch: "Kandy Branch",
        grade: "Grade 2",
        email: "mike.johnson@slbfe.lk",
        mobile: "077-3456789",
        civilStatus: "Single",
        gender: "Male",
        age: 31,
        dateOfBirth: "1992-12-10",
        dateJoined: "2023-03-20",
        employmentType: "Contract",
        promotions: [],
        education: {
          highestQualification: "Diploma",
          qualifications: ["O/L", "A/L", "Diploma"]
        }
      },
      {
        id: 4,
        employeeNo: "9515",
        fullName: "Sarah Wilson",
        nameWithInitials: "S.W. Wilson",
        designation: "Marketing Manager",
        division: "Marketing",
        branch: "Galle Branch",
        grade: "Grade 1",
        email: "sarah.wilson@slbfe.lk",
        mobile: "077-4567890",
        civilStatus: "Married",
        gender: "Female",
        age: 38,
        dateOfBirth: "1985-11-05",
        dateJoined: "2021-11-05",
        employmentType: "Permanent",
        promotions: [
          { date: "2022-11-01", from: "Marketing Officer", to: "Marketing Manager" }
        ],
        education: {
          highestQualification: "Graduate",
          qualifications: ["O/L", "A/L", "Bachelor's Degree", "Professional Certificate"]
        }
      },
      {
        id: 5,
        employeeNo: "9516",
        fullName: "Tom Brown",
        nameWithInitials: "T.B. Brown",
        designation: "Finance Officer",
        division: "Finance",
        branch: "Matara Branch",
        grade: "Grade 2",
        email: "tom.brown@slbfe.lk",
        mobile: "077-5678901",
        civilStatus: "Single",
        gender: "Male",
        age: 26,
        dateOfBirth: "1997-08-12",
        dateJoined: "2023-08-12",
        employmentType: "Casual",
        promotions: [],
        education: {
          highestQualification: "Certificate",
          qualifications: ["O/L", "A/L", "Certificate"]
        }
      },
      {
        id: 6,
        employeeNo: "9517",
        fullName: "Emily Davis",
        nameWithInitials: "E.D. Davis",
        designation: "Senior Developer",
        division: "IT Services",
        branch: "Colombo Main",
        grade: "Grade 1",
        email: "emily.davis@slbfe.lk",
        mobile: "077-6789012",
        civilStatus: "Married",
        gender: "Female",
        age: 35,
        dateOfBirth: "1988-03-18",
        dateJoined: "2020-03-18",
        employmentType: "Permanent",
        promotions: [
          { date: "2021-03-01", from: "Developer", to: "Senior Developer" }
        ],
        education: {
          highestQualification: "Graduate",
          qualifications: ["O/L", "A/L", "Bachelor's Degree"]
        }
      },
      {
        id: 7,
        employeeNo: "9518",
        fullName: "Alex Turner",
        nameWithInitials: "A.T. Turner",
        designation: "Administrative Assistant",
        division: "Administration",
        branch: "Colombo Main",
        grade: "Grade 3",
        email: "alex.turner@slbfe.lk",
        mobile: "077-7890123",
        civilStatus: "Single",
        gender: "Male",
        age: 23,
        dateOfBirth: "2000-07-25",
        dateJoined: "2024-01-10",
        employmentType: "Contract",
        promotions: [],
        education: {
          highestQualification: "A/L",
          qualifications: ["O/L", "A/L"]
        }
      },
      {
        id: 8,
        employeeNo: "9519",
        fullName: "Maria Garcia",
        nameWithInitials: "M.G. Garcia",
        designation: "Quality Assurance Manager",
        division: "Quality Assurance",
        branch: "Kandy Branch",
        grade: "Grade 1",
        email: "maria.garcia@slbfe.lk",
        mobile: "077-8901234",
        civilStatus: "Married",
        gender: "Female",
        age: 40,
        dateOfBirth: "1983-09-12",
        dateJoined: "2019-09-12",
        employmentType: "Permanent",
        promotions: [
          { date: "2020-09-01", from: "QA Officer", to: "QA Manager" }
        ],
        education: {
          highestQualification: "Graduate",
          qualifications: ["O/L", "A/L", "Bachelor's Degree", "Master's Degree"]
        }
      }
    ];
  }

  // Generate mock download URL
  private generateMockDownloadUrl(config: EmployeeReportConfig): string {
    const timestamp = Date.now();
    const extension = config.outputFormat === 'pdf' ? 'pdf' : 'xlsx';
    return `/api/reports/download/${config.id}_${timestamp}.${extension}`;
  }

  // Get report history
  async getReportHistory(params?: {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<EmployeeReportResult[]>> {
    try {
      const queryString = params ? new URLSearchParams(params as any).toString() : '';
      return await this.request<EmployeeReportResult[]>(`/reports/employees/history${queryString ? `?${queryString}` : ''}`);
    } catch (error) {
      // Return mock data for development
      return {
        success: true,
        data: this.getMockReportHistory(),
        message: 'Report history retrieved'
      };
    }
  }

  // Generate mock report history data
  private getMockReportHistory(): EmployeeReportResult[] {
    const now = new Date();
    const baseData = this.getMockEmployeeData();
    
    const generateBaseSummary = (data: any[], customData?: any) => ({
      totalEmployees: data.length,
      demographics: {
        averageAge: 31.5,
        genderDistribution: { "Male": 4, "Female": 4 },
        averageServiceYears: 2.8
      },
      departments: {
        "IT Services": 2,
        "Human Resources": 1,
        "Analytics": 1,
        "Marketing": 1,
        "Finance": 1,
        "Administration": 1,
        "Quality Assurance": 1
      },
      branches: {
        "Colombo Main": 4,
        "Kandy Branch": 2,
        "Galle Branch": 1,
        "Matara Branch": 1
      },
      employmentTypes: {
        "Permanent": 5,
        "Contract": 2,
        "Casual": 1
      },
      educationLevels: {
        "Graduate": 5,
        "Diploma": 1,
        "Certificate": 1,
        "A/L": 1
      },
      salaryStatistics: {
        average: 75000,
        median: 72000,
        min: 45000,
        max: 120000
      },
      promotions: {
        totalPromoted: 4,
        promotionRate: 50
      },
      ...customData
    });

    const mockReports: EmployeeReportResult[] = [
      // Employee Summary Report - Most Recent
      {
        id: 'report_employee_summary_' + (Date.now() - 1000000),
        config: PREDEFINED_REPORTS.find(r => r.id === 'employee_summary')!,
        generatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
        totalRecords: 8,
        data: baseData,
        summary: generateBaseSummary(baseData),
        charts: [
          {
            id: 'department_distribution',
            title: 'Employee Distribution by Department',
            type: 'pie',
            data: {
              labels: ["IT Services", "Human Resources", "Analytics", "Marketing", "Finance", "Administration", "Quality Assurance"],
              datasets: [{
                data: [2, 1, 1, 1, 1, 1, 1],
                backgroundColor: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#6B7280', '#EC4899']
              }]
            }
          }
        ],
        downloadUrl: '/api/reports/download/employee_summary_latest.xlsx',
        expiresAt: new Date(now.getTime() + 22 * 60 * 60 * 1000)
      },

      // Demographics Analysis - 1 day ago
      {
        id: 'report_demographics_' + (Date.now() - 2000000),
        config: PREDEFINED_REPORTS.find(r => r.id === 'demographics_analysis')!,
        generatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        totalRecords: 8,
        data: this.generateDemographicsData(baseData),
        summary: generateBaseSummary(baseData),
        charts: [
          {
            id: 'age_distribution',
            title: 'Age Distribution',
            type: 'bar',
            data: {
              labels: ['18-24', '25-34', '35-44', '45-54'],
              datasets: [{
                label: 'Number of Employees',
                data: [1, 4, 2, 1],
                backgroundColor: '#3B82F6'
              }]
            }
          }
        ],
        downloadUrl: '/api/reports/download/demographics_analysis_2025-10-16.pdf',
        expiresAt: new Date(now.getTime() + 23 * 60 * 60 * 1000)
      },

      // Salary Analysis - 2 days ago  
      {
        id: 'report_salary_' + (Date.now() - 3000000),
        config: PREDEFINED_REPORTS.find(r => r.id === 'salary_analysis')!,
        generatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        totalRecords: 8,
        data: this.generateSalaryAnalysisData(baseData),
        summary: generateBaseSummary(baseData, {
          salaryStatistics: {
            average: 82500,
            median: 78000,
            min: 45000,
            max: 150000
          }
        }),
        charts: [
          {
            id: 'salary_distribution',
            title: 'Salary Distribution by Department',
            type: 'bar',
            data: {
              labels: ["IT Services", "HR", "Marketing", "Finance", "QA"],
              datasets: [{
                label: 'Average Salary',
                data: [95000, 75000, 85000, 80000, 70000],
                backgroundColor: '#10B981'
              }]
            }
          }
        ],
        downloadUrl: '/api/reports/download/salary_analysis_2025-10-15.xlsx',
        expiresAt: new Date(now.getTime() + 22 * 60 * 60 * 1000)
      },

      // Department-wise Report - 3 days ago
      {
        id: 'report_department_' + (Date.now() - 4000000),
        config: PREDEFINED_REPORTS.find(r => r.id === 'department_wise')!,
        generatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
        totalRecords: 8,
        data: this.generateDepartmentWiseData(baseData),
        summary: generateBaseSummary(baseData),
        charts: [
          {
            id: 'department_breakdown',
            title: 'Department-wise Employee Count',
            type: 'doughnut',
            data: {
              labels: ["IT Services", "HR", "Analytics", "Marketing", "Finance", "Admin", "QA"],
              datasets: [{
                data: [2, 1, 1, 1, 1, 1, 1],
                backgroundColor: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#6B7280', '#EC4899']
              }]
            }
          }
        ],
        downloadUrl: '/api/reports/download/department_wise_2025-10-14.xlsx',
        expiresAt: new Date(now.getTime() + 21 * 60 * 60 * 1000)
      },

      // Education & Qualifications - 5 days ago
      {
        id: 'report_education_' + (Date.now() - 5000000),
        config: PREDEFINED_REPORTS.find(r => r.id === 'education_qualifications')!,
        generatedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        totalRecords: 8,
        data: this.generateEducationData(baseData),
        summary: generateBaseSummary(baseData),
        charts: [
          {
            id: 'education_levels',
            title: 'Education Level Distribution',
            type: 'pie',
            data: {
              labels: ['Graduate', 'Diploma', 'Certificate', 'A/L'],
              datasets: [{
                data: [5, 1, 1, 1],
                backgroundColor: ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444']
              }]
            }
          }
        ],
        downloadUrl: '/api/reports/download/education_qualifications_2025-10-12.pdf',
        expiresAt: new Date(now.getTime() + 19 * 60 * 60 * 1000)
      },

      // Service Tenure Report - 6 days ago
      {
        id: 'report_tenure_' + (Date.now() - 6000000),
        config: PREDEFINED_REPORTS.find(r => r.id === 'service_tenure')!,
        generatedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
        totalRecords: 8,
        data: this.generateServiceTenureData(baseData),
        summary: generateBaseSummary(baseData, {
          demographics: {
            averageAge: 31.5,
            genderDistribution: { "Male": 4, "Female": 4 },
            averageServiceYears: 3.2
          }
        }),
        charts: [
          {
            id: 'service_years',
            title: 'Service Years Distribution',
            type: 'bar',
            data: {
              labels: ['0-1 years', '1-3 years', '3-5 years', '5+ years'],
              datasets: [{
                label: 'Employees',
                data: [2, 3, 2, 1],
                backgroundColor: '#EC4899'
              }]
            }
          }
        ],
        downloadUrl: '/api/reports/download/service_tenure_2025-10-11.xlsx',
        expiresAt: new Date(now.getTime() + 18 * 60 * 60 * 1000)
      },

      // Promotion Analysis - 1 week ago
      {
        id: 'report_promotion_' + (Date.now() - 7000000),
        config: PREDEFINED_REPORTS.find(r => r.id === 'promotion_analysis')!,
        generatedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        totalRecords: 8,
        data: this.generatePromotionAnalysisData(baseData),
        summary: generateBaseSummary(baseData, {
          promotions: {
            totalPromoted: 4,
            promotionRate: 50
          }
        }),
        charts: [
          {
            id: 'promotion_trends',
            title: 'Promotion Rate by Department',
            type: 'bar',
            data: {
              labels: ['IT Services', 'HR', 'Marketing', 'Finance'],
              datasets: [{
                label: 'Promotion Rate (%)',
                data: [75, 60, 40, 50],
                backgroundColor: '#F59E0B'
              }]
            }
          }
        ],
        downloadUrl: '/api/reports/download/promotion_analysis_2025-10-10.pdf',
        expiresAt: new Date(now.getTime() + 17 * 60 * 60 * 1000)
      },

      // New Joiners - 10 days ago
      {
        id: 'report_newjoiners_' + (Date.now() - 8000000),
        config: PREDEFINED_REPORTS.find(r => r.id === 'new_joiners')!,
        generatedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        totalRecords: 3,
        data: this.generateNewJoinersData(baseData),
        summary: generateBaseSummary(baseData.slice(0, 3), {
          totalEmployees: 3,
          demographics: {
            averageAge: 26.3,
            genderDistribution: { "Male": 2, "Female": 1 },
            averageServiceYears: 0.8
          }
        }),
        charts: [
          {
            id: 'new_joiners_timeline',
            title: 'New Joiners Timeline (2025)',
            type: 'line',
            data: {
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
              datasets: [{
                label: 'New Hires',
                data: [1, 0, 1, 0, 0, 0, 0, 1, 0, 2],
                borderColor: '#10B981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)'
              }]
            }
          }
        ],
        downloadUrl: '/api/reports/download/new_joiners_2025-10-07.xlsx',
        expiresAt: new Date(now.getTime() + 14 * 60 * 60 * 1000)
      },

      // Birthday List - 12 days ago  
      {
        id: 'report_birthday_' + (Date.now() - 9000000),
        config: PREDEFINED_REPORTS.find(r => r.id === 'birthday_list')!,
        generatedAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000),
        totalRecords: 2,
        data: this.generateBirthdayListData(baseData),
        summary: generateBaseSummary(baseData.slice(0, 2), {
          totalEmployees: 2
        }),
        charts: [],
        downloadUrl: '/api/reports/download/birthday_list_october_2025.pdf',
        expiresAt: new Date(now.getTime() + 12 * 60 * 60 * 1000)
      },

      // Employee Directory - 2 weeks ago
      {
        id: 'report_directory_' + (Date.now() - 10000000),
        config: PREDEFINED_REPORTS.find(r => r.id === 'employee_directory')!,
        generatedAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
        totalRecords: 8,
        data: this.generateEmployeeDirectoryData(baseData),
        summary: generateBaseSummary(baseData),
        charts: [],
        downloadUrl: '/api/reports/download/employee_directory_2025-10-03.pdf',
        expiresAt: new Date(now.getTime() + 10 * 60 * 60 * 1000)
      }
    ];

    return mockReports.sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime());
  }

  // Delete report
  async deleteReport(reportId: string): Promise<ApiResponse<null>> {
    try {
      return await this.request<null>(`/reports/employees/${reportId}`, {
        method: 'DELETE'
      });
    } catch (error) {
      return {
        success: true,
        data: null,
        message: 'Report deleted successfully'
      };
    }
  }

  // Download report
  async downloadReport(reportId: string): Promise<Response> {
    try {
      const response = await fetch(`${this.baseURL}/reports/employees/${reportId}/download`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });
      return response;
    } catch (error) {
      // Generate and download a mock report file
      return this.generateMockReportFile(reportId);
    }
  }

  // Generate sample report for specific report type
  async generateSampleReport(reportType: string): Promise<Response> {
    const report = PREDEFINED_REPORTS.find((r: EmployeeReportConfig) => r.id === reportType);
    if (!report) {
      throw new Error('Report type not found');
    }

    const mockData = this.generateSpecificMockData(reportType);
    const mockReport: EmployeeReportResult = {
      id: `${reportType}_sample_${Date.now()}`,
      config: report,
      generatedAt: new Date(),
      totalRecords: mockData.length,
      data: mockData,
      summary: this.generateSummary(mockData),
      charts: report.includeCharts ? this.generateCharts(mockData, report) : [],
      downloadUrl: '',
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    };

    if (report.outputFormat === 'pdf') {
      return this.generatePDFReport(mockReport);
    } else {
      return this.generateExcelReport(mockReport);
    }
  }

  // Generate specific mock data based on report type
  private generateSpecificMockData(reportType: string): any[] {
    const baseData = this.getMockEmployeeData();
    
    switch (reportType) {
      case 'demographics_analysis':
        return this.generateDemographicsData(baseData);
      
      case 'department_wise':
        return this.generateDepartmentWiseData(baseData);
      
      case 'salary_analysis':
        return this.generateSalaryAnalysisData(baseData);
      
      case 'education_qualifications':
        return this.generateEducationData(baseData);
      
      case 'service_tenure':
        return this.generateServiceTenureData(baseData);
      
      case 'promotion_analysis':
        return this.generatePromotionAnalysisData(baseData);
      
      case 'new_joiners':
        return this.generateNewJoinersData(baseData);
      
      case 'birthday_list':
        return this.generateBirthdayListData(baseData);
      
      case 'employee_directory':
        return this.generateEmployeeDirectoryData(baseData);
      
      case 'employee_summary':
      default:
        return baseData;
    }
  }

  // Generate demographics-specific data
  private generateDemographicsData(baseData: any[]): any[] {
    return baseData.map(emp => ({
      ...emp,
      ageGroup: emp.age < 25 ? '18-24' : emp.age < 35 ? '25-34' : emp.age < 45 ? '35-44' : emp.age < 55 ? '45-54' : '55+',
      serviceYears: Math.floor((new Date().getTime() - new Date(emp.dateJoined).getTime()) / (365 * 24 * 60 * 60 * 1000)),
      nationality: 'Sri Lankan',
      religion: ['Buddhism', 'Christianity', 'Islam', 'Hinduism'][Math.floor(Math.random() * 4)],
      ethnicity: ['Sinhala', 'Tamil', 'Muslim', 'Burgher'][Math.floor(Math.random() * 4)]
    }));
  }

  // Generate department-wise data with additional metrics
  private generateDepartmentWiseData(baseData: any[]): any[] {
    return baseData.map(emp => ({
      ...emp,
      departmentBudget: Math.floor(Math.random() * 2000000) + 500000,
      departmentHead: emp.division === 'IT Services' ? 'Jane Tech' : 'John Manager',
      teamSize: Math.floor(Math.random() * 15) + 5,
      avgSalary: Math.floor(Math.random() * 50000) + 60000
    }));
  }

  // Generate salary analysis data
  private generateSalaryAnalysisData(baseData: any[]): any[] {
    return baseData.map(emp => ({
      ...emp,
      basicSalary: Math.floor(Math.random() * 60000) + 40000,
      allowances: Math.floor(Math.random() * 20000) + 5000,
      overtime: Math.floor(Math.random() * 15000),
      bonuses: Math.floor(Math.random() * 25000),
      totalSalary: 0,
      lastIncrement: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      incrementPercentage: Math.floor(Math.random() * 15) + 5
    })).map(emp => ({
      ...emp,
      totalSalary: emp.basicSalary + emp.allowances + emp.overtime + emp.bonuses
    }));
  }

  // Generate education and qualifications data
  private generateEducationData(baseData: any[]): any[] {
    const universities = ['University of Colombo', 'University of Peradeniya', 'University of Moratuwa', 'SLIIT', 'NSBM'];
    const degrees = ['Computer Science', 'Business Administration', 'Engineering', 'Human Resources', 'Finance'];
    const certifications = ['PMP', 'CISSP', 'CPA', 'SHRM-CP', 'AWS Certified'];

    return baseData.map(emp => ({
      ...emp,
      university: universities[Math.floor(Math.random() * universities.length)],
      degree: degrees[Math.floor(Math.random() * degrees.length)],
      graduationYear: 2015 + Math.floor(Math.random() * 10),
      gpa: (3.0 + Math.random() * 1.0).toFixed(2),
      certifications: Array.from({length: Math.floor(Math.random() * 3)}, () => 
        certifications[Math.floor(Math.random() * certifications.length)]
      ),
      trainingHours: Math.floor(Math.random() * 100) + 20,
      lastTraining: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
    }));
  }

  // Generate service tenure data
  private generateServiceTenureData(baseData: any[]): any[] {
    return baseData.map(emp => {
      const joinDate = new Date(emp.dateJoined);
      const now = new Date();
      const serviceYears = now.getFullYear() - joinDate.getFullYear();
      const serviceMonths = ((now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 30.44));

      return {
        ...emp,
        serviceYears,
        serviceMonths: Math.floor(serviceMonths),
        serviceDays: Math.floor((now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24)),
        probationEndDate: new Date(joinDate.getTime() + (6 * 30 * 24 * 60 * 60 * 1000)),
        contractEndDate: emp.employmentType === 'Contract' ? new Date(joinDate.getTime() + (2 * 365 * 24 * 60 * 60 * 1000)) : null,
        leaveBalance: Math.floor(Math.random() * 20) + 5,
        sickLeaveBalance: Math.floor(Math.random() * 10) + 2
      };
    });
  }

  // Generate promotion analysis data
  private generatePromotionAnalysisData(baseData: any[]): any[] {
    return baseData.map(emp => ({
      ...emp,
      promotionEligible: Math.random() > 0.4,
      lastPromotionDate: emp.promotions?.length > 0 ? emp.promotions[emp.promotions.length - 1].date : null,
      nextPromotionDue: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      performanceRating: ['Excellent', 'Good', 'Satisfactory', 'Needs Improvement'][Math.floor(Math.random() * 4)],
      promotionScore: Math.floor(Math.random() * 40) + 60,
      careerPath: ['Technical Track', 'Management Track', 'Specialist Track'][Math.floor(Math.random() * 3)]
    }));
  }

  // Generate new joiners data (last 12 months)
  private generateNewJoinersData(baseData: any[]): any[] {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    
    return baseData.filter(emp => new Date(emp.dateJoined) >= oneYearAgo).map(emp => ({
      ...emp,
      onboardingStatus: ['Completed', 'In Progress', 'Pending'][Math.floor(Math.random() * 3)],
      mentor: 'Senior ' + emp.designation,
      probationReview: new Date(new Date(emp.dateJoined).getTime() + (3 * 30 * 24 * 60 * 60 * 1000)),
      initialTrainingCompleted: Math.random() > 0.3,
      documentationStatus: 'Complete',
      firstDayExperience: ['Excellent', 'Good', 'Average'][Math.floor(Math.random() * 3)]
    }));
  }

  // Generate birthday list data (current month and upcoming)
  private generateBirthdayListData(baseData: any[]): any[] {
    const currentMonth = new Date().getMonth();
    const nextMonth = (currentMonth + 1) % 12;
    
    return baseData.map(emp => {
      const birthDate = new Date(emp.dateOfBirth);
      const isCurrentMonth = birthDate.getMonth() === currentMonth;
      const isNextMonth = birthDate.getMonth() === nextMonth;
      
      return {
        ...emp,
        birthdayThisMonth: isCurrentMonth,
        birthdayNextMonth: isNextMonth,
        age: emp.age,
        zodiacSign: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'][Math.floor(Math.random() * 12)],
        daysUntilBirthday: Math.floor(Math.random() * 31) + 1,
        celebrationPreference: ['Office Party', 'Gift', 'Card Only', 'No Celebration'][Math.floor(Math.random() * 4)]
      };
    }).filter(emp => emp.birthdayThisMonth || emp.birthdayNextMonth);
  }

  // Generate employee directory data
  private generateEmployeeDirectoryData(baseData: any[]): any[] {
    return baseData.map(emp => ({
      ...emp,
      extension: '100' + emp.id,
      officeLocation: emp.branch + ' - Floor ' + (Math.floor(Math.random() * 5) + 1),
      manager: emp.designation.includes('Manager') ? 'CEO' : 'Department Manager',
      emergencyContact: 'Emergency Contact ' + emp.id,
      emergencyPhone: '071-' + Math.floor(Math.random() * 9000000 + 1000000),
      workSchedule: ['9:00 AM - 5:00 PM', '8:30 AM - 4:30 PM', '10:00 AM - 6:00 PM'][Math.floor(Math.random() * 3)],
      skills: ['Communication', 'Leadership', 'Technical', 'Analytical'][Math.floor(Math.random() * 4)],
      languages: ['English', 'Sinhala', 'Tamil'].filter(() => Math.random() > 0.3)
    }));
  }

  // Generate mock report file for download
  private async generateMockReportFile(reportId: string): Promise<Response> {
    const reportHistory = this.getMockReportHistory();
    const report = reportHistory.find(r => r.id === reportId) || reportHistory[0];
    
    if (report.config.outputFormat === 'pdf') {
      return this.generatePDFReport(report);
    } else {
      return this.generateExcelReport(report);
    }
  }

  // Generate PDF report content (as HTML for better readability)
  private async generatePDFReport(report: EmployeeReportResult): Promise<Response> {
    const htmlContent = this.generateHTMLContent(report);
    const blob = new Blob([htmlContent], { 
      type: 'text/html;charset=utf-8'
    });
    
    // Clean filename - remove special characters and extra spaces
    const cleanName = report.config.name.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `${cleanName}_${dateStr}.html`;
    
    return new Response(blob, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });
  }

  // Generate HTML content for better readability
  private generateHTMLContent(report: EmployeeReportResult): string {
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${report.config.name} - SLBFE HRM System</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; color: #333; }
        .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 30px; }
        .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
        .summary-card { background: #f8fafc; padding: 15px; border-radius: 6px; border-left: 4px solid #2563eb; }
        .summary-label { font-size: 12px; color: #64748b; text-transform: uppercase; margin-bottom: 5px; }
        .summary-value { font-size: 24px; font-weight: bold; color: #1e293b; }
        .section { margin: 30px 0; padding: 20px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; }
        .section-title { color: #1e293b; font-size: 18px; font-weight: bold; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid #e2e8f0; }
        .employee-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .employee-table th, .employee-table td { padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        .employee-table th { background: #f1f5f9; font-weight: bold; color: #475569; }
        .employee-table tr:hover { background: #f8fafc; }
        .breakdown-list { list-style: none; padding: 0; }
        .breakdown-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; margin: 5px 0; background: #f8fafc; border-radius: 4px; }
        .breakdown-name { font-weight: 500; }
        .breakdown-count { background: #2563eb; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 12px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>SLBFE HRM SYSTEM</h1>
        <h2>${report.config.name}</h2>
        <p>${report.config.description}</p>
        <p>Generated: ${date} at ${time} | Total Records: ${report.totalRecords}</p>
    </div>
    <div class="summary-grid">
        <div class="summary-card">
            <div class="summary-label">Total Employees</div>
            <div class="summary-value">${report.summary.totalEmployees}</div>
        </div>
        <div class="summary-card">
            <div class="summary-label">Average Age</div>
            <div class="summary-value">${report.summary.demographics.averageAge} years</div>
        </div>
        <div class="summary-card">
            <div class="summary-label">Average Service</div>
            <div class="summary-value">${report.summary.demographics.averageServiceYears} years</div>
        </div>
        <div class="summary-card">
            <div class="summary-label">Promotion Rate</div>
            <div class="summary-value">${report.summary.promotions.promotionRate}%</div>
        </div>
    </div>
    <div class="section">
        <h3 class="section-title">Department Analysis</h3>
        <ul class="breakdown-list">`;

    Object.entries(report.summary.departments).forEach(([dept, count]) => {
      const percentage = ((count as number / report.summary.totalEmployees) * 100).toFixed(1);
      html += `
            <li class="breakdown-item">
                <span class="breakdown-name">${dept}</span>
                <div>
                    <span class="breakdown-count">${count}</span>
                    <span style="margin-left: 8px; color: #64748b;">(${percentage}%)</span>
                </div>
            </li>`;
    });

    html += `
        </ul>
    </div>
    <div class="section">
        <h3 class="section-title">Employee Details</h3>
        <table class="employee-table">
            <thead>
                <tr><th>Employee No</th><th>Full Name</th><th>Position</th><th>Department</th><th>Age</th><th>Gender</th></tr>
            </thead>
            <tbody>`;

    const employees = report.data.filter((item: any) => !item.isGroupHeader);
    employees.forEach((emp: any) => {
      html += `<tr><td>${emp.employeeNo}</td><td>${emp.fullName}</td><td>${emp.designation}</td><td>${emp.division}</td><td>${emp.age}</td><td>${emp.gender}</td></tr>`;
    });

    html += `
            </tbody>
        </table>
    </div>
    <div class="footer">
        <p>Generated by SLBFE HRM System | Report ID: ${report.id} | ${date} at ${time}</p>
    </div>
</body>
</html>`;

    return html;
  }

  // Generate Excel report content
  private async generateExcelReport(report: EmployeeReportResult): Promise<Response> {
    const csvContent = this.generateCSVContent(report);
    const blob = new Blob([csvContent], { 
      type: 'text/csv;charset=utf-8;'
    });
    
    // Clean filename - remove special characters and extra spaces
    const cleanName = report.config.name.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `${cleanName}_${dateStr}.csv`;
    
    return new Response(blob, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });
  }

  // Generate PDF content (simplified HTML-to-text format)
  private generatePDFContent(report: EmployeeReportResult): string {
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    
    let content = `
SLBFE HRM SYSTEM - ${report.config.name.toUpperCase()}
${'='.repeat(50)}

Report: ${report.config.name}
Description: ${report.config.description}
Generated: ${date} at ${time}
Total Records: ${report.totalRecords}
Report Type: ${report.config.type}

EXECUTIVE SUMMARY
================

Total Employees: ${report.summary.totalEmployees}
Average Age: ${report.summary.demographics.averageAge} years
Average Service Years: ${report.summary.demographics.averageServiceYears} years
Promotion Rate: ${report.summary.promotions.promotionRate}%
`;

    // Add specific content based on report type
    switch (report.config.type) {
      case 'demographics_analysis':
        content += this.generateDemographicsContent(report);
        break;
      case 'salary_analysis':
        content += this.generateSalaryContent(report);
        break;
      case 'education_qualifications':
        content += this.generateEducationContent(report);
        break;
      case 'service_tenure_report':
        content += this.generateTenureContent(report);
        break;
      case 'promotion_analysis':
        content += this.generatePromotionContent(report);
        break;
      case 'birthday_list':
        content += this.generateBirthdayContent(report);
        break;
      case 'employee_directory':
        content += this.generateDirectoryContent(report);
        break;
      case 'new_joiners_report':
        content += this.generateNewJoinersContent(report);
        break;
      default:
        content += this.generateGeneralContent(report);
    }

    content += `

REPORT FOOTER
============

This report was generated automatically by the SLBFE HRM System.
For questions or support, please contact the HR Department.

Generated on: ${date} at ${time}
Report ID: ${report.id}
Total Pages: 1
`;

    return content;
  }

  // Generate demographics-specific content
  private generateDemographicsContent(report: EmployeeReportResult): string {
    let content = `
DEMOGRAPHICS ANALYSIS
====================

Age Group Distribution:
`;
    const ageGroups = report.data.filter((item: any) => !item.isGroupHeader).reduce((acc: any, emp: any) => {
      acc[emp.ageGroup || 'Unknown'] = (acc[emp.ageGroup || 'Unknown'] || 0) + 1;
      return acc;
    }, {});

    Object.entries(ageGroups).forEach(([group, count]) => {
      const percentage = ((count as number / report.summary.totalEmployees) * 100).toFixed(1);
      content += `- ${group}: ${count} employees (${percentage}%)\n`;
    });

    content += `
Gender Distribution:
`;
    Object.entries(report.summary.demographics.genderDistribution).forEach(([gender, count]) => {
      const percentage = ((count as number / report.summary.totalEmployees) * 100).toFixed(1);
      content += `- ${gender}: ${count} (${percentage}%)\n`;
    });

    return content;
  }

  // Generate salary-specific content
  private generateSalaryContent(report: EmployeeReportResult): string {
    return `
SALARY ANALYSIS
==============

Salary Statistics:
- Average Salary: LKR ${report.summary.salaryStatistics.average.toLocaleString()}
- Median Salary: LKR ${report.summary.salaryStatistics.median.toLocaleString()}
- Minimum Salary: LKR ${report.summary.salaryStatistics.min.toLocaleString()}
- Maximum Salary: LKR ${report.summary.salaryStatistics.max.toLocaleString()}

Department-wise Salary Breakdown:
${Object.entries(report.summary.departments).map(([dept, count]) => 
  `- ${dept}: ${count} employees (Avg: LKR ${(Math.random() * 50000 + 60000).toFixed(0)})`
).join('\n')}

Salary Ranges:
- Below LKR 50,000: ${Math.floor(Math.random() * 2)} employees
- LKR 50,000 - 75,000: ${Math.floor(Math.random() * 4) + 2} employees  
- LKR 75,000 - 100,000: ${Math.floor(Math.random() * 3) + 1} employees
- Above LKR 100,000: ${Math.floor(Math.random() * 2) + 1} employees
`;
  }

  // Generate education-specific content
  private generateEducationContent(report: EmployeeReportResult): string {
    return `
EDUCATION & QUALIFICATIONS ANALYSIS
==================================

Education Level Distribution:
${Object.entries(report.summary.educationLevels).map(([level, count]) => {
  const percentage = ((count as number / report.summary.totalEmployees) * 100).toFixed(1);
  return `- ${level}: ${count} employees (${percentage}%)`;
}).join('\n')}

Professional Certifications:
- PMP Certified: ${Math.floor(Math.random() * 3)} employees
- AWS Certified: ${Math.floor(Math.random() * 2)} employees  
- Microsoft Certified: ${Math.floor(Math.random() * 3)} employees
- SHRM Certified: ${Math.floor(Math.random() * 2)} employees

Training Hours (Last Year):
- Average Training Hours: ${Math.floor(Math.random() * 50) + 20} hours per employee
- Total Training Budget: LKR ${(Math.random() * 500000 + 200000).toFixed(0)}
`;
  }

  // Generate tenure-specific content  
  private generateTenureContent(report: EmployeeReportResult): string {
    return `
SERVICE TENURE ANALYSIS
======================

Service Years Distribution:
- 0-1 years: ${Math.floor(Math.random() * 3) + 1} employees
- 1-3 years: ${Math.floor(Math.random() * 3) + 2} employees
- 3-5 years: ${Math.floor(Math.random() * 2) + 1} employees  
- 5+ years: ${Math.floor(Math.random() * 2)} employees

Employee Retention Metrics:
- Annual Turnover Rate: ${Math.floor(Math.random() * 15) + 5}%
- Average Tenure: ${report.summary.demographics.averageServiceYears} years
- Retention Rate (2+ years): ${Math.floor(Math.random() * 20) + 70}%

Leave Balance Summary:
- Average Annual Leave: ${Math.floor(Math.random() * 10) + 15} days
- Average Sick Leave: ${Math.floor(Math.random() * 5) + 5} days
`;
  }

  // Generate promotion-specific content
  private generatePromotionContent(report: EmployeeReportResult): string {
    return `
PROMOTION ANALYSIS
=================

Promotion Statistics:
- Total Promoted (Last 2 Years): ${report.summary.promotions.totalPromoted} employees
- Promotion Rate: ${report.summary.promotions.promotionRate}%
- Average Time to Promotion: ${Math.floor(Math.random() * 18) + 18} months

Department-wise Promotion Rates:
${Object.entries(report.summary.departments).map(([dept, count]) => 
  `- ${dept}: ${Math.floor(Math.random() * 40) + 30}% promotion rate`
).join('\n')}

Career Development:
- Employees Eligible for Promotion: ${Math.floor(Math.random() * 4) + 2}
- Performance Rating Distribution:
  * Excellent: ${Math.floor(Math.random() * 3) + 1} employees
  * Good: ${Math.floor(Math.random() * 4) + 2} employees  
  * Satisfactory: ${Math.floor(Math.random() * 2) + 1} employees
`;
  }

  // Generate birthday-specific content
  private generateBirthdayContent(report: EmployeeReportResult): string {
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    return `
EMPLOYEE BIRTHDAY LIST - ${currentMonth.toUpperCase()} 2025
==========================================

Upcoming Birthdays This Month:
${report.data.filter((emp: any) => !emp.isGroupHeader && emp.birthdayThisMonth).map((emp: any, index: number) => 
  `${index + 1}. ${emp.fullName} - ${new Date(emp.dateOfBirth).toLocaleDateString()} (Age: ${emp.age})`
).join('\n') || 'No birthdays this month'}

Next Month Birthdays:
${report.data.filter((emp: any) => !emp.isGroupHeader && emp.birthdayNextMonth).map((emp: any, index: number) => 
  `${index + 1}. ${emp.fullName} - ${new Date(emp.dateOfBirth).toLocaleDateString()} (Age: ${emp.age})`
).join('\n') || 'No birthdays next month'}

Birthday Celebration Preferences:
- Office Party: ${Math.floor(Math.random() * 3)} employees
- Gift Only: ${Math.floor(Math.random() * 2)} employees
- Card Only: ${Math.floor(Math.random() * 2)} employees
- No Celebration: ${Math.floor(Math.random() * 1)} employees
`;
  }

  // Generate directory-specific content
  private generateDirectoryContent(report: EmployeeReportResult): string {
    return `
EMPLOYEE DIRECTORY
=================

Contact Information:
${report.data.filter((emp: any) => !emp.isGroupHeader).map((emp: any, index: number) => 
  `${index + 1}. ${emp.fullName}
   Position: ${emp.designation}
   Department: ${emp.division}
   Email: ${emp.email}
   Mobile: ${emp.mobile}
   Extension: ${emp.extension || 'N/A'}
   Office: ${emp.officeLocation || emp.branch}
   Manager: ${emp.manager || 'N/A'}
`).join('\n')}

Emergency Contacts Available: ${report.data.filter((emp: any) => emp.emergencyContact).length} employees
Work Schedule Variations: ${Math.floor(Math.random() * 3) + 1} different schedules
`;
  }

  // Generate new joiners content
  private generateNewJoinersContent(report: EmployeeReportResult): string {
    return `
NEW JOINERS REPORT (LAST 12 MONTHS)
==================================

Recent Hires:
${report.data.filter((emp: any) => !emp.isGroupHeader).map((emp: any, index: number) => 
  `${index + 1}. ${emp.fullName}
   Position: ${emp.designation}
   Department: ${emp.division}
   Join Date: ${emp.dateJoined}
   Onboarding Status: ${emp.onboardingStatus || 'Completed'}
   Probation Review: ${emp.probationReview ? new Date(emp.probationReview).toLocaleDateString() : 'N/A'}
`).join('\n')}

Onboarding Statistics:
- Completed Onboarding: ${Math.floor(Math.random() * 2) + 1} employees
- In Progress: ${Math.floor(Math.random() * 1)} employees
- Average Onboarding Time: ${Math.floor(Math.random() * 10) + 5} days
- First Day Experience Rating: ${(Math.random() * 2 + 3).toFixed(1)}/5.0
`;
  }

  // Generate general content
  private generateGeneralContent(report: EmployeeReportResult): string {
    return `
DEPARTMENT ANALYSIS
==================

${Object.entries(report.summary.departments).map(([dept, count]) => {
  const percentage = ((count as number / report.summary.totalEmployees) * 100).toFixed(1);
  return `- ${dept}: ${count} employees (${percentage}%)`;
}).join('\n')}

BRANCH DISTRIBUTION
==================

${Object.entries(report.summary.branches).map(([branch, count]) => {
  const percentage = ((count as number / report.summary.totalEmployees) * 100).toFixed(1);
  return `- ${branch}: ${count} employees (${percentage}%)`;
}).join('\n')}

EMPLOYMENT TYPE ANALYSIS
=======================

${Object.entries(report.summary.employmentTypes).map(([type, count]) => {
  const percentage = ((count as number / report.summary.totalEmployees) * 100).toFixed(1);
  return `- ${type}: ${count} employees (${percentage}%)`;
}).join('\n')}

DETAILED EMPLOYEE DATA
=====================

${report.data.filter((item: any) => !item.isGroupHeader).map((emp: any, index: number) => 
  `${index + 1}. ${emp.fullName} (${emp.employeeNo})
   Position: ${emp.designation}
   Department: ${emp.division}
   Branch: ${emp.branch}
   Employment Type: ${emp.employmentType}
   Age: ${emp.age} years
   Gender: ${emp.gender}
   Join Date: ${emp.dateJoined}
   Education: ${emp.education?.highestQualification || 'N/A'}
   Promotions: ${emp.promotions?.length || 0}
   Email: ${emp.email}
   Mobile: ${emp.mobile}`
).join('\n\n')}
`;
  }

  // Generate CSV content
  private generateCSVContent(report: EmployeeReportResult): string {
    const employees = report.data.filter((item: any) => !item.isGroupHeader);
    
    let csv = 'Employee No,Full Name,Designation,Department,Branch,Employment Type,Age,Gender,Civil Status,Join Date,Education Level,Promotions Count,Email,Mobile\n';
    
    employees.forEach((emp: any) => {
      const row = [
        emp.employeeNo,
        `"${emp.fullName}"`,
        `"${emp.designation}"`,
        `"${emp.division}"`,
        `"${emp.branch}"`,
        emp.employmentType,
        emp.age,
        emp.gender,
        emp.civilStatus,
        emp.dateJoined,
        emp.education?.highestQualification || 'N/A',
        emp.promotions?.length || 0,
        emp.email,
        emp.mobile
      ].join(',');
      
      csv += row + '\n';
    });

    // Add summary section
    csv += '\n\nSUMMARY STATISTICS\n';
    csv += 'Metric,Value\n';
    csv += `Total Employees,${report.summary.totalEmployees}\n`;
    csv += `Average Age,${report.summary.demographics.averageAge} years\n`;
    csv += `Average Service Years,${report.summary.demographics.averageServiceYears} years\n`;
    csv += `Promotion Rate,${report.summary.promotions.promotionRate}%\n`;
    
    csv += '\nDEPARTMENT BREAKDOWN\n';
    csv += 'Department,Employee Count,Percentage\n';
    Object.entries(report.summary.departments).forEach(([dept, count]) => {
      const percentage = ((count as number / report.summary.totalEmployees) * 100).toFixed(1);
      csv += `"${dept}",${count},${percentage}%\n`;
    });

    csv += '\nGENDER DISTRIBUTION\n';
    csv += 'Gender,Count,Percentage\n';
    Object.entries(report.summary.demographics.genderDistribution).forEach(([gender, count]) => {
      const percentage = ((count as number / report.summary.totalEmployees) * 100).toFixed(1);
      csv += `${gender},${count},${percentage}%\n`;
    });

    return csv;
  }
}

// Create and export service instance
export const employeeReportService = new EmployeeReportService();
export default employeeReportService;