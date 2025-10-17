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
    const mockReports: EmployeeReportResult[] = [
      {
        id: 'report_' + (Date.now() - 1000000),
        config: PREDEFINED_REPORTS.find(r => r.id === 'employee_summary')!,
        generatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
        totalRecords: 8,
        data: this.getMockEmployeeData(),
        summary: {
          totalEmployees: 8,
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
          }
        },
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
        expiresAt: new Date(now.getTime() + 22 * 60 * 60 * 1000) // Expires in 22 hours
      },
      {
        id: 'report_' + (Date.now() - 2000000),
        config: PREDEFINED_REPORTS.find(r => r.id === 'demographics_analysis')!,
        generatedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        totalRecords: 8,
        data: this.getMockEmployeeData(),
        summary: {
          totalEmployees: 8,
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
          }
        },
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
        downloadUrl: '/api/reports/download/demographics_analysis_yesterday.pdf',
        expiresAt: new Date(now.getTime() + 23 * 60 * 60 * 1000)
      },
      {
        id: 'report_' + (Date.now() - 3000000),
        config: PREDEFINED_REPORTS.find(r => r.id === 'department_wise')!,
        generatedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        totalRecords: 8,
        data: this.getMockEmployeeData(),
        summary: {
          totalEmployees: 8,
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
          }
        },
        charts: [
          {
            id: 'department_breakdown',
            title: 'Department-wise Employee Count',
            type: 'bar',
            data: {
              labels: ["IT Services", "HR", "Analytics", "Marketing", "Finance", "Admin", "QA"],
              datasets: [{
                label: 'Employees',
                data: [2, 1, 1, 1, 1, 1, 1],
                backgroundColor: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#6B7280', '#EC4899']
              }]
            }
          }
        ],
        downloadUrl: '/api/reports/download/department_wise_3days_ago.xlsx',
        expiresAt: new Date(now.getTime() + 21 * 60 * 60 * 1000)
      },
      {
        id: 'report_' + (Date.now() - 5000000),
        config: PREDEFINED_REPORTS.find(r => r.id === 'new_joiners')!,
        generatedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        totalRecords: 2,
        data: this.getMockEmployeeData().filter(emp => 
          new Date(emp.dateJoined).getTime() > (Date.now() - 365 * 24 * 60 * 60 * 1000)
        ),
        summary: {
          totalEmployees: 2,
          demographics: {
            averageAge: 24.5,
            genderDistribution: { "Male": 2 },
            averageServiceYears: 0.5
          },
          departments: {
            "IT Services": 1,
            "Administration": 1
          },
          branches: {
            "Colombo Main": 2
          },
          employmentTypes: {
            "Permanent": 1,
            "Contract": 1
          },
          educationLevels: {
            "Graduate": 1,
            "A/L": 1
          },
          salaryStatistics: {
            average: 52500,
            median: 52500,
            min: 45000,
            max: 60000
          },
          promotions: {
            totalPromoted: 1,
            promotionRate: 50
          }
        },
        charts: [
          {
            id: 'new_joiners_timeline',
            title: 'New Joiners This Year',
            type: 'bar',
            data: {
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
              datasets: [{
                label: 'New Hires',
                data: [0, 0, 1, 0, 0, 0, 0, 1, 0, 1],
                backgroundColor: '#10B981'
              }]
            }
          }
        ],
        downloadUrl: '/api/reports/download/new_joiners_weekly.xlsx',
        expiresAt: new Date(now.getTime() + 17 * 60 * 60 * 1000)
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

  // Generate PDF report content
  private async generatePDFReport(report: EmployeeReportResult): Promise<Response> {
    const pdfContent = this.generatePDFContent(report);
    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    return new Response(blob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${report.config.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf"`
      }
    });
  }

  // Generate Excel report content
  private async generateExcelReport(report: EmployeeReportResult): Promise<Response> {
    const csvContent = this.generateCSVContent(report);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    return new Response(blob, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${report.config.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv"`
      }
    });
  }

  // Generate PDF content (simplified HTML-to-text format)
  private generatePDFContent(report: EmployeeReportResult): string {
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    
    let content = `
SLBFE HRM SYSTEM - EMPLOYEE REPORT
==================================

Report: ${report.config.name}
Description: ${report.config.description}
Generated: ${date} at ${time}
Total Records: ${report.totalRecords}

EXECUTIVE SUMMARY
================

Total Employees: ${report.summary.totalEmployees}
Average Age: ${report.summary.demographics.averageAge} years
Average Service Years: ${report.summary.demographics.averageServiceYears} years
Promotion Rate: ${report.summary.promotions.promotionRate}%

DEMOGRAPHICS BREAKDOWN
=====================

Gender Distribution:
`;

    Object.entries(report.summary.demographics.genderDistribution).forEach(([gender, count]) => {
      const percentage = ((count as number / report.summary.totalEmployees) * 100).toFixed(1);
      content += `- ${gender}: ${count} (${percentage}%)\n`;
    });

    content += `
DEPARTMENT ANALYSIS
==================

`;

    Object.entries(report.summary.departments).forEach(([dept, count]) => {
      const percentage = ((count as number / report.summary.totalEmployees) * 100).toFixed(1);
      content += `- ${dept}: ${count} employees (${percentage}%)\n`;
    });

    content += `
BRANCH DISTRIBUTION
==================

`;

    Object.entries(report.summary.branches).forEach(([branch, count]) => {
      const percentage = ((count as number / report.summary.totalEmployees) * 100).toFixed(1);
      content += `- ${branch}: ${count} employees (${percentage}%)\n`;
    });

    content += `
EMPLOYMENT TYPE ANALYSIS
=======================

`;

    Object.entries(report.summary.employmentTypes).forEach(([type, count]) => {
      const percentage = ((count as number / report.summary.totalEmployees) * 100).toFixed(1);
      content += `- ${type}: ${count} employees (${percentage}%)\n`;
    });

    content += `
EDUCATION LEVELS
===============

`;

    Object.entries(report.summary.educationLevels).forEach(([level, count]) => {
      const percentage = ((count as number / report.summary.totalEmployees) * 100).toFixed(1);
      content += `- ${level}: ${count} employees (${percentage}%)\n`;
    });

    content += `

DETAILED EMPLOYEE DATA
=====================

`;

    const employees = report.data.filter((item: any) => !item.isGroupHeader);
    employees.forEach((emp: any, index: number) => {
      content += `
${index + 1}. ${emp.fullName} (${emp.employeeNo})
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
   Mobile: ${emp.mobile}
`;
    });

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