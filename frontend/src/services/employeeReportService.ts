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
  strategicInsights?: string; // Markdown-formatted strategic analysis for department-wise reports
}

export interface ChartData {
  id: string;
  title: string;
  type: 'bar' | 'pie' | 'line' | 'doughnut' | 'scatter';
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
    name: 'Department-wise Strategic Analytics Report',
    description: 'Comprehensive departmental analysis with managerial insights, performance metrics, and predictive analytics for strategic decision-making',
    type: 'department_wise_analysis',
    includedSections: [
      'personal_details', 
      'employment_history', 
      'performance_metrics', 
      'cost_analysis', 
      'productivity_metrics',
      'retention_analytics',
      'skill_assessment',
      'succession_planning',
      'risk_analysis'
    ],
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

  constructor(baseURL: string = 'http://localhost:5001/api') {
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
    const summary = this.generateSummary(processedData, config);
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
  // Enhanced generateSummary with strategic insights
  private generateSummary(data: any[], config?: EmployeeReportConfig): EmployeeReportSummary {
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

    const baseSummary = {
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

    // Add strategic insights for department-wise reports
    if (config && config.type === 'department_wise_analysis') {
      const strategicAnalysis = this.generateDepartmentSummary(employees);
      return {
        ...baseSummary,
        strategicInsights: strategicAnalysis
      };
    }

    return baseSummary;
  }

  // Generate charts for the report
  private generateCharts(data: any[], config: EmployeeReportConfig): ChartData[] {
    const employees = data.filter(item => !item.isGroupHeader);

    switch (config.type) {
      case 'demographics_analysis':
        return this.generateDemographicsCharts(employees);
      case 'salary_analysis':
        return this.generateSalaryCharts(employees);
      case 'education_qualifications':
        return this.generateEducationCharts(employees);
      case 'service_tenure_report':
        return this.generateTenureCharts(employees);
      case 'promotion_analysis':
        return this.generatePromotionCharts(employees);
      case 'new_joiners_report':
        return this.generateNewJoinersCharts(employees);
      case 'department_wise_analysis':
        return this.generateDepartmentCharts(employees);
      default:
        return this.generateGeneralCharts(employees);
    }
  }

  // Generate demographics-specific charts
  private generateDemographicsCharts(employees: any[]): ChartData[] {
    const charts: ChartData[] = [];

    // Age distribution
    const ageGroups = employees.reduce((acc, emp) => {
      const group = emp.ageGroup || (emp.age < 25 ? '18-24' : emp.age < 35 ? '25-34' : emp.age < 45 ? '35-44' : emp.age < 55 ? '45-54' : '55+');
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
          backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
        }]
      }
    });

    // Gender distribution
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

    // Religion distribution
    const religionData = employees.reduce((acc, emp) => {
      const religion = emp.religion || 'Buddhism';
      acc[religion] = (acc[religion] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    charts.push({
      id: 'religion_distribution',
      title: 'Religion Distribution',
      type: 'pie',
      data: {
        labels: Object.keys(religionData),
        datasets: [{
          data: Object.values(religionData),
          backgroundColor: ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
        }]
      }
    });

    // Service category distribution
    const serviceCategoryData = employees.reduce((acc, emp) => {
      const category = emp.serviceCategory || 'Junior (1-3 years)';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    charts.push({
      id: 'service_category_distribution',
      title: 'Service Category Distribution',
      type: 'bar',
      data: {
        labels: Object.keys(serviceCategoryData),
        datasets: [{
          label: 'Employees',
          data: Object.values(serviceCategoryData),
          backgroundColor: '#14B8A6'
        }]
      }
    });

    return charts;
  }

  // Generate salary-specific charts
  private generateSalaryCharts(employees: any[]): ChartData[] {
    const charts: ChartData[] = [];

    // Salary distribution by department
    const deptSalaries = employees.reduce((acc, emp) => {
      if (!acc[emp.division]) acc[emp.division] = [];
      acc[emp.division].push(emp.netSalary || emp.grossSalary || 50000);
      return acc;
    }, {} as { [key: string]: number[] });

    const avgSalaryByDept = Object.entries(deptSalaries).map(([dept, salariesArray]) => {
      const salaries = salariesArray as number[];
      return {
        dept,
        avgSalary: Math.round(salaries.reduce((a: number, b: number) => a + b, 0) / salaries.length)
      };
    });

    charts.push({
      id: 'salary_by_department',
      title: 'Average Salary by Department',
      type: 'bar',
      data: {
        labels: avgSalaryByDept.map(item => item.dept),
        datasets: [{
          label: 'Average Salary (LKR)',
          data: avgSalaryByDept.map(item => item.avgSalary),
          backgroundColor: '#10B981'
        }]
      }
    });

    // Salary grades distribution
    const salaryGrades = employees.reduce((acc, emp) => {
      const grade = emp.salaryGrade || 'Mid';
      acc[grade] = (acc[grade] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    charts.push({
      id: 'salary_grades',
      title: 'Salary Grades Distribution',
      type: 'doughnut',
      data: {
        labels: Object.keys(salaryGrades),
        datasets: [{
          data: Object.values(salaryGrades),
          backgroundColor: ['#3B82F6', '#F59E0B', '#EF4444']
        }]
      }
    });

    // Basic vs Total compensation
    const compensationData = employees.map(emp => ({
      name: emp.fullName,
      basic: emp.basicSalary || 50000,
      total: emp.grossSalary || emp.netSalary || 60000
    }));

    charts.push({
      id: 'compensation_breakdown',
      title: 'Basic vs Total Compensation (Top 5)',
      type: 'bar',
      data: {
        labels: compensationData.slice(0, 5).map(emp => emp.name.split(' ')[0]),
        datasets: [
          {
            label: 'Basic Salary',
            data: compensationData.slice(0, 5).map(emp => emp.basic),
            backgroundColor: '#3B82F6'
          },
          {
            label: 'Total Compensation',
            data: compensationData.slice(0, 5).map(emp => emp.total),
            backgroundColor: '#10B981'
          }
        ]
      }
    });

    return charts;
  }

  // Generate education-specific charts
  private generateEducationCharts(employees: any[]): ChartData[] {
    const charts: ChartData[] = [];

    // Education level distribution
    const educationData = employees.reduce((acc, emp) => {
      const level = emp.education?.highestQualification || 'Graduate';
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    charts.push({
      id: 'education_levels',
      title: 'Education Level Distribution',
      type: 'pie',
      data: {
        labels: Object.keys(educationData),
        datasets: [{
          data: Object.values(educationData),
          backgroundColor: ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444']
        }]
      }
    });

    // Certifications count
    const certificationsData = employees.reduce((acc, emp) => {
      const certCount = emp.certifications?.length || 0;
      const category = certCount === 0 ? 'None' : certCount === 1 ? '1 Cert' : certCount === 2 ? '2 Certs' : '3+ Certs';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    charts.push({
      id: 'certifications_distribution',
      title: 'Professional Certifications',
      type: 'doughnut',
      data: {
        labels: Object.keys(certificationsData),
        datasets: [{
          data: Object.values(certificationsData),
          backgroundColor: ['#6B7280', '#3B82F6', '#10B981', '#F59E0B']
        }]
      }
    });

    // Training hours by department
    const deptTraining = employees.reduce((acc, emp) => {
      if (!acc[emp.division]) acc[emp.division] = [];
      acc[emp.division].push(emp.trainingHours || 40);
      return acc;
    }, {} as { [key: string]: number[] });

    const avgTrainingByDept = Object.entries(deptTraining).map(([dept, hoursArray]) => {
      const hours = hoursArray as number[];
      return {
        dept,
        avgHours: Math.round(hours.reduce((a: number, b: number) => a + b, 0) / hours.length)
      };
    });

    charts.push({
      id: 'training_by_department',
      title: 'Average Training Hours by Department',
      type: 'bar',
      data: {
        labels: avgTrainingByDept.map(item => item.dept),
        datasets: [{
          label: 'Training Hours',
          data: avgTrainingByDept.map(item => item.avgHours),
          backgroundColor: '#EC4899'
        }]
      }
    });

    return charts;
  }

  // Generate tenure-specific charts
  private generateTenureCharts(employees: any[]): ChartData[] {
    const charts: ChartData[] = [];

    // Service years distribution
    const serviceYearsData = employees.reduce((acc, emp) => {
      const years = emp.serviceYears || 2;
      const category = years < 1 ? '0-1 years' : years < 3 ? '1-3 years' : years < 5 ? '3-5 years' : '5+ years';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    charts.push({
      id: 'service_years_distribution',
      title: 'Service Years Distribution',
      type: 'bar',
      data: {
        labels: Object.keys(serviceYearsData),
        datasets: [{
          label: 'Employees',
          data: Object.values(serviceYearsData),
          backgroundColor: '#EC4899'
        }]
      }
    });

    // Leave balance by employment type
    const leaveByType = employees.reduce((acc, emp) => {
      if (!acc[emp.employmentType]) acc[emp.employmentType] = [];
      acc[emp.employmentType].push(emp.leaveBalance || 15);
      return acc;
    }, {} as { [key: string]: number[] });

    const avgLeaveByType = Object.entries(leaveByType).map(([type, balancesArray]) => {
      const balances = balancesArray as number[];
      return {
        type,
        avgLeave: Math.round(balances.reduce((a: number, b: number) => a + b, 0) / balances.length)
      };
    });

    charts.push({
      id: 'leave_by_employment_type',
      title: 'Average Leave Balance by Employment Type',
      type: 'doughnut',
      data: {
        labels: avgLeaveByType.map(item => item.type),
        datasets: [{
          data: avgLeaveByType.map(item => item.avgLeave),
          backgroundColor: ['#3B82F6', '#10B981', '#F59E0B']
        }]
      }
    });

    return charts;
  }

  // Generate promotion-specific charts
  private generatePromotionCharts(employees: any[]): ChartData[] {
    const charts: ChartData[] = [];

    // Promotion eligibility
    const eligibilityData = employees.reduce((acc, emp) => {
      const eligible = emp.promotionEligible ? 'Eligible' : 'Not Eligible';
      acc[eligible] = (acc[eligible] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    charts.push({
      id: 'promotion_eligibility',
      title: 'Promotion Eligibility',
      type: 'doughnut',
      data: {
        labels: Object.keys(eligibilityData),
        datasets: [{
          data: Object.values(eligibilityData),
          backgroundColor: ['#10B981', '#EF4444']
        }]
      }
    });

    // Performance ratings
    const performanceData = employees.reduce((acc, emp) => {
      const rating = emp.performanceRating || 'Good';
      acc[rating] = (acc[rating] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    charts.push({
      id: 'performance_ratings',
      title: 'Performance Ratings Distribution',
      type: 'bar',
      data: {
        labels: Object.keys(performanceData),
        datasets: [{
          label: 'Employees',
          data: Object.values(performanceData),
          backgroundColor: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444']
        }]
      }
    });

    return charts;
  }

  // Generate new joiners charts
  private generateNewJoinersCharts(employees: any[]): ChartData[] {
    const charts: ChartData[] = [];

    // Onboarding status
    const onboardingData = employees.reduce((acc, emp) => {
      const status = emp.onboardingStatus || 'Completed';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    charts.push({
      id: 'onboarding_status',
      title: 'Onboarding Status',
      type: 'doughnut',
      data: {
        labels: Object.keys(onboardingData),
        datasets: [{
          data: Object.values(onboardingData),
          backgroundColor: ['#10B981', '#F59E0B', '#EF4444']
        }]
      }
    });

    // Joining trends by month
    const joinTrends = employees.reduce((acc, emp) => {
      const month = new Date(emp.dateJoined).toLocaleDateString('en', { month: 'short' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    charts.push({
      id: 'joining_trends',
      title: 'New Joiners by Month',
      type: 'line',
      data: {
        labels: Object.keys(joinTrends),
        datasets: [{
          label: 'New Hires',
          data: Object.values(joinTrends),
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)'
        }]
      }
    });

    return charts;
  }

  // Generate department-specific charts
  private generateDepartmentCharts(employees: any[]): ChartData[] {
    const charts: ChartData[] = [];

    // Department distribution
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

    // Performance Rating by Department (Managerial Decision Factor)
    const deptPerformance = employees.reduce((acc, emp) => {
      if (!acc[emp.division]) {
        acc[emp.division] = { total: 0, count: 0 };
      }
      acc[emp.division].total += emp.performanceRating || 3.5;
      acc[emp.division].count += 1;
      return acc;
    }, {} as { [key: string]: { total: number, count: number } });

    const performanceData = Object.entries(deptPerformance).map(([dept, data]) => ({
      department: dept,
      avgRating: (data as { total: number, count: number }).total / (data as { total: number, count: number }).count
    }));

    charts.push({
      id: 'department_performance',
      title: 'Average Performance Rating by Department',
      type: 'bar',
      data: {
        labels: performanceData.map(d => d.department),
        datasets: [{
          label: 'Average Performance Rating',
          data: performanceData.map(d => d.avgRating),
          backgroundColor: '#10B981'
        }]
      }
    });

    // ROI Analysis by Department (Critical for Budget Allocation)
    const deptROI = employees.reduce((acc, emp) => {
      if (!acc[emp.division]) {
        acc[emp.division] = { totalROI: 0, totalCost: 0, count: 0 };
      }
      acc[emp.division].totalROI += emp.roiGenerated || 150000;
      acc[emp.division].totalCost += emp.totalCompensation || 80000;
      acc[emp.division].count += 1;
      return acc;
    }, {} as { [key: string]: { totalROI: number, totalCost: number, count: number } });

    const roiData = Object.entries(deptROI).map(([dept, data]) => ({
      department: dept,
      roiRatio: (data as { totalROI: number, totalCost: number, count: number }).totalROI / 
                (data as { totalROI: number, totalCost: number, count: number }).totalCost
    }));

    charts.push({
      id: 'department_roi_efficiency',
      title: 'ROI Efficiency by Department (Revenue/Cost Ratio)',
      type: 'bar',
      data: {
        labels: roiData.map(d => d.department),
        datasets: [{
          label: 'ROI Ratio',
          data: roiData.map(d => d.roiRatio),
          backgroundColor: '#F59E0B'
        }]
      }
    });

    // Retention Risk Analysis by Department (Critical for HR Planning)
    const deptRetention = employees.reduce((acc, emp) => {
      if (!acc[emp.division]) {
        acc[emp.division] = { 
          highRisk: 0, 
          mediumRisk: 0, 
          lowRisk: 0, 
          total: 0,
          avgRetentionProb: 0
        };
      }
      
      const flightRisk = emp.flightRisk || 'Low';
      if (flightRisk === 'High' || flightRisk === 'Very High') {
        acc[emp.division].highRisk += 1;
      } else if (flightRisk === 'Medium') {
        acc[emp.division].mediumRisk += 1;
      } else {
        acc[emp.division].lowRisk += 1;
      }
      
      acc[emp.division].avgRetentionProb += emp.retentionProbability || 75;
      acc[emp.division].total += 1;
      return acc;
    }, {} as { [key: string]: { highRisk: number, mediumRisk: number, lowRisk: number, total: number, avgRetentionProb: number } });

    const retentionData = Object.entries(deptRetention).map(([dept, data]) => {
      const typedData = data as { highRisk: number, mediumRisk: number, lowRisk: number, total: number, avgRetentionProb: number };
      return {
        department: dept,
        avgRetention: typedData.avgRetentionProb / typedData.total,
        riskDistribution: {
          high: typedData.highRisk,
          medium: typedData.mediumRisk,
          low: typedData.lowRisk
        }
      };
    });

    charts.push({
      id: 'department_retention_risk',
      title: 'Retention Probability by Department',
      type: 'bar',
      data: {
        labels: retentionData.map(d => d.department),
        datasets: [{
          label: 'Average Retention Probability (%)',
          data: retentionData.map(d => d.avgRetention),
          backgroundColor: '#8B5CF6'
        }]
      }
    });

    // Skills Gap Analysis by Department (Training Investment Priority)
    const deptSkillsGap = employees.reduce((acc, emp) => {
      if (!acc[emp.division]) {
        acc[emp.division] = { totalGap: 0, count: 0 };
      }
      acc[emp.division].totalGap += emp.criticalSkillsGap || 20;
      acc[emp.division].count += 1;
      return acc;
    }, {} as { [key: string]: { totalGap: number, count: number } });

    const skillsGapData = Object.entries(deptSkillsGap).map(([dept, data]) => ({
      department: dept,
      avgSkillsGap: (data as { totalGap: number, count: number }).totalGap / (data as { totalGap: number, count: number }).count
    }));

    charts.push({
      id: 'department_skills_gap',
      title: 'Critical Skills Gap by Department (%)',
      type: 'bar',
      data: {
        labels: skillsGapData.map(d => d.department),
        datasets: [{
          label: 'Average Skills Gap (%)',
          data: skillsGapData.map(d => d.avgSkillsGap),
          backgroundColor: '#EF4444'
        }]
      }
    });

    // Succession Planning Readiness (Leadership Pipeline Analysis)
    const deptSuccession = employees.reduce((acc, emp) => {
      if (!acc[emp.division]) {
        acc[emp.division] = { totalReadiness: 0, highPotential: 0, count: 0 };
      }
      acc[emp.division].totalReadiness += emp.promotionReadiness || 50;
      if (emp.leadershipPotential === 'High' || emp.leadershipPotential === 'Very High') {
        acc[emp.division].highPotential += 1;
      }
      acc[emp.division].count += 1;
      return acc;
    }, {} as { [key: string]: { totalReadiness: number, highPotential: number, count: number } });

    const successionData = Object.entries(deptSuccession).map(([dept, data]) => ({
      department: dept,
      avgReadiness: (data as { totalReadiness: number, highPotential: number, count: number }).totalReadiness / 
                   (data as { totalReadiness: number, highPotential: number, count: number }).count,
      potentialLeaders: (data as { totalReadiness: number, highPotential: number, count: number }).highPotential
    }));

    charts.push({
      id: 'department_succession_readiness',
      title: 'Succession Planning Readiness by Department',
      type: 'bar',
      data: {
        labels: successionData.map(d => d.department),
        datasets: [{
          label: 'Average Promotion Readiness (%)',
          data: successionData.map(d => d.avgReadiness),
          backgroundColor: '#14B8A6'
        }]
      }
    });

    // Employment type by department (Workforce Composition)
    const empTypeByDept = employees.reduce((acc, emp) => {
      if (!acc[emp.division]) acc[emp.division] = {};
      acc[emp.division][emp.employmentType] = (acc[emp.division][emp.employmentType] || 0) + 1;
      return acc;
    }, {} as { [key: string]: { [key: string]: number } });

    const deptNames = Object.keys(empTypeByDept);
    const employmentTypes = ['Permanent', 'Contract', 'Casual'];
    
    charts.push({
      id: 'employment_type_by_department',
      title: 'Employment Type Distribution by Department',
      type: 'bar',
      data: {
        labels: deptNames,
        datasets: employmentTypes.map((type, index) => ({
          label: type,
          data: deptNames.map(dept => empTypeByDept[dept]?.[type] || 0),
          backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'][index]
        }))
      }
    });

    // Productivity vs Cost Analysis (Strategic Decision Making)
    const deptProductivityCost = employees.reduce((acc, emp) => {
      if (!acc[emp.division]) {
        acc[emp.division] = { totalProductivity: 0, totalCost: 0, count: 0 };
      }
      acc[emp.division].totalProductivity += emp.productivityScore || 80;
      acc[emp.division].totalCost += (emp.totalCompensation || 80000) / 1000; // Convert to thousands
      acc[emp.division].count += 1;
      return acc;
    }, {} as { [key: string]: { totalProductivity: number, totalCost: number, count: number } });

    const productivityCostData = Object.entries(deptProductivityCost).map(([dept, data]) => ({
      department: dept,
      avgProductivity: (data as { totalProductivity: number, totalCost: number, count: number }).totalProductivity / 
                      (data as { totalProductivity: number, totalCost: number, count: number }).count,
      avgCost: (data as { totalProductivity: number, totalCost: number, count: number }).totalCost / 
               (data as { totalProductivity: number, totalCost: number, count: number }).count
    }));

    charts.push({
      id: 'department_productivity_cost',
      title: 'Productivity vs Cost Analysis by Department',
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Departments',
          data: productivityCostData.map(d => ({
            x: d.avgCost,
            y: d.avgProductivity,
            label: d.department
          })),
          backgroundColor: '#EC4899'
        }]
      }
    });

    return charts;
  }

  // Generate comprehensive department summary with managerial insights
  private generateDepartmentSummary(employees: any[]): string {
    const deptAnalysis = employees.reduce((acc, emp) => {
      if (!acc[emp.division]) {
        acc[emp.division] = {
          count: 0,
          totalSalary: 0,
          totalROI: 0,
          performanceSum: 0,
          retentionSum: 0,
          skillsGapSum: 0,
          productivitySum: 0,
          flightRiskHigh: 0,
          flightRiskMedium: 0,
          flightRiskLow: 0,
          highPotential: 0,
          promotionReady: 0,
          burnoutRisk: 0,
          permanentEmployees: 0,
          contractEmployees: 0,
          casualEmployees: 0,
          trainingInvestment: 0
        };
      }

      const dept = acc[emp.division];
      dept.count += 1;
      dept.totalSalary += emp.totalCompensation || 80000;
      dept.totalROI += emp.roiGenerated || 150000;
      dept.performanceSum += emp.performanceRating || 3.5;
      dept.retentionSum += emp.retentionProbability || 75;
      dept.skillsGapSum += emp.criticalSkillsGap || 20;
      dept.productivitySum += emp.productivityScore || 80;
      dept.trainingInvestment += emp.trainingInvestment || 15000;

      // Risk Analysis
      const flightRisk = emp.flightRisk || 'Low';
      if (flightRisk === 'High' || flightRisk === 'Very High') dept.flightRiskHigh += 1;
      else if (flightRisk === 'Medium') dept.flightRiskMedium += 1;
      else dept.flightRiskLow += 1;

      // Leadership & Succession
      if (emp.leadershipPotential === 'High' || emp.leadershipPotential === 'Very High') {
        dept.highPotential += 1;
      }
      if ((emp.promotionReadiness || 50) >= 80) {
        dept.promotionReady += 1;
      }
      if (emp.burnoutRisk === 'High' || emp.burnoutRisk === 'Medium') {
        dept.burnoutRisk += 1;
      }

      // Employment Type
      if (emp.employmentType === 'Permanent') dept.permanentEmployees += 1;
      else if (emp.employmentType === 'Contract') dept.contractEmployees += 1;
      else dept.casualEmployees += 1;

      return acc;
    }, {} as { [key: string]: any });

    let summary = `# Department-wise Strategic Analysis & Managerial Insights\n\n`;
    
    // Overall Summary
    const totalEmployees = employees.length;
    const totalSalary = Object.values(deptAnalysis).reduce((sum: number, dept: any) => sum + dept.totalSalary, 0);
    const totalROI = Object.values(deptAnalysis).reduce((sum: number, dept: any) => sum + dept.totalROI, 0);
    const avgROIRatio = totalROI / totalSalary;

    summary += `## Executive Summary\n`;
    summary += `- **Total Employees**: ${totalEmployees}\n`;
    summary += `- **Total Compensation Cost**: LKR ${(totalSalary / 1000000).toFixed(2)}M\n`;
    summary += `- **Total Revenue Generated**: LKR ${(totalROI / 1000000).toFixed(2)}M\n`;
    summary += `- **Overall ROI Ratio**: ${avgROIRatio.toFixed(2)}x\n`;
    summary += `- **Company Performance Score**: ${((totalROI / totalSalary) * 100).toFixed(1)}%\n\n`;

    // Department Analysis
    summary += `## Department-wise Analysis\n\n`;

    Object.entries(deptAnalysis).forEach(([deptName, data]: [string, any]) => {
      const avgPerformance = (data.performanceSum / data.count).toFixed(2);
      const avgRetention = (data.retentionSum / data.count).toFixed(1);
      const avgSkillsGap = (data.skillsGapSum / data.count).toFixed(1);
      const avgProductivity = (data.productivitySum / data.count).toFixed(1);
      const roiRatio = (data.totalROI / data.totalSalary).toFixed(2);
      const retentionRiskPercent = ((data.flightRiskMedium + data.flightRiskHigh) / data.count * 100).toFixed(1);
      const leadershipPipelinePercent = (data.highPotential / data.count * 100).toFixed(1);

      summary += `### ${deptName} Department\n`;
      summary += `**Workforce Composition**: ${data.count} employees (${data.permanentEmployees} Permanent, ${data.contractEmployees} Contract, ${data.casualEmployees} Casual)\n\n`;

      // Performance Metrics
      summary += `**Performance Indicators:**\n`;
      summary += `- Average Performance Rating: ${avgPerformance}/5.0\n`;
      summary += `- Average Productivity Score: ${avgProductivity}%\n`;
      summary += `- ROI Efficiency: ${roiRatio}x (LKR ${(data.totalROI/1000000).toFixed(2)}M revenue vs LKR ${(data.totalSalary/1000000).toFixed(2)}M cost)\n\n`;

      // Risk Assessment
      summary += `**Risk Assessment:**\n`;
      summary += `- Retention Risk: ${retentionRiskPercent}% (${data.flightRiskHigh} high risk, ${data.flightRiskMedium} medium risk)\n`;
      summary += `- Average Retention Probability: ${avgRetention}%\n`;
      summary += `- Skills Gap: ${avgSkillsGap}% critical skills missing\n`;
      summary += `- Burnout Risk: ${data.burnoutRisk} employees at risk\n\n`;

      // Strategic Insights
      summary += `**Strategic Insights:**\n`;
      summary += `- Leadership Pipeline: ${leadershipPipelinePercent}% high-potential leaders (${data.highPotential} employees)\n`;
      summary += `- Promotion Ready: ${data.promotionReady} employees ready for advancement\n`;
      summary += `- Training Investment: LKR ${(data.trainingInvestment/1000).toFixed(0)}K per employee\n\n`;

      // Management Recommendations
      summary += `**Management Recommendations:**\n`;
      
      if (parseFloat(roiRatio) < 2.0) {
        summary += `- ⚠️ **PRIORITY**: ROI below target (${roiRatio}x). Review resource allocation and productivity initiatives.\n`;
      } else if (parseFloat(roiRatio) > 4.0) {
        summary += `- ✅ **EXCELLENT**: High ROI efficiency (${roiRatio}x). Consider expanding this department.\n`;
      }

      if (parseFloat(retentionRiskPercent) > 30) {
        summary += `- ⚠️ **URGENT**: High retention risk (${retentionRiskPercent}%). Implement retention strategies immediately.\n`;
      }

      if (parseFloat(avgSkillsGap) > 25) {
        summary += `- 📚 **ACTION NEEDED**: Critical skills gap (${avgSkillsGap}%). Prioritize training and development.\n`;
      }

      if (data.highPotential === 0) {
        summary += `- 👥 **SUCCESSION RISK**: No high-potential leaders identified. Focus on leadership development.\n`;
      }

      if (parseFloat(avgPerformance) < 3.5) {
        summary += `- 📈 **PERFORMANCE**: Below average performance (${avgPerformance}). Review management practices and support systems.\n`;
      }

      summary += `\n---\n\n`;
    });

    // Strategic Recommendations
    summary += `## Company-wide Strategic Recommendations\n\n`;
    
    const depts = Object.entries(deptAnalysis);
    let bestROI = { name: depts[0][0], data: depts[0][1] as any };
    let worstROI = { name: depts[0][0], data: depts[0][1] as any };
    
    depts.forEach(([name, data]: [string, any]) => {
      const currentROI = data.totalROI / data.totalSalary;
      const bestCurrentROI = bestROI.data.totalROI / bestROI.data.totalSalary;
      const worstCurrentROI = worstROI.data.totalROI / worstROI.data.totalSalary;
      
      if (currentROI > bestCurrentROI) {
        bestROI = { name, data };
      }
      if (currentROI < worstCurrentROI) {
        worstROI = { name, data };
      }
    });

    summary += `### Investment Priorities\n`;
    summary += `1. **Expand High-Performing Department**: ${bestROI.name} shows highest ROI (${(bestROI.data.totalROI / bestROI.data.totalSalary).toFixed(2)}x)\n`;
    summary += `2. **Restructure Underperforming Department**: ${worstROI.name} needs attention (ROI: ${(worstROI.data.totalROI / worstROI.data.totalSalary).toFixed(2)}x)\n\n`;

    const highRetentionRiskDepts = depts.filter(([_, data]: [string, any]) => 
      ((data.flightRiskMedium + data.flightRiskHigh) / data.count) > 0.3
    );

    if (highRetentionRiskDepts.length > 0) {
      summary += `### Immediate Actions Required\n`;
      summary += `**Retention Crisis Management:**\n`;
      highRetentionRiskDepts.forEach(([name, data]: [string, any]) => {
        summary += `- ${name}: ${((data.flightRiskMedium + data.flightRiskHigh) / data.count * 100).toFixed(1)}% retention risk\n`;
      });
      summary += `\n`;
    }

    const skillsGapDepts = depts.filter(([_, data]: [string, any]) => 
      (data.skillsGapSum / data.count) > 25
    );

    if (skillsGapDepts.length > 0) {
      summary += `**Skills Development Priority:**\n`;
      skillsGapDepts.forEach(([name, data]: [string, any]) => {
        summary += `- ${name}: ${(data.skillsGapSum / data.count).toFixed(1)}% critical skills gap\n`;
      });
    }

    summary += `\n### Key Performance Indicators to Monitor\n`;
    summary += `- Monthly ROI ratio by department\n`;
    summary += `- Employee retention rates and exit interview feedback\n`;
    summary += `- Skills assessment progress and training completion rates\n`;
    summary += `- Leadership pipeline development and succession readiness\n`;
    summary += `- Employee engagement and satisfaction scores\n`;
    summary += `- Performance improvement trajectories\n\n`;

    summary += `---\n*Report generated on ${new Date().toLocaleDateString()} for strategic decision-making and workforce planning.*`;

    return summary;
  }

  // Generate general charts (fallback)
  private generateGeneralCharts(employees: any[]): ChartData[] {
    const charts: ChartData[] = [];

    // Department distribution
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

    // Gender distribution
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

  // Get comprehensive mock employee data with managerial analytics
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
        
        // Performance Metrics
        performanceRating: 4.2,
        kpiScore: 87,
        projectCompletionRate: 92,
        clientSatisfactionScore: 4.5,
        innovationScore: 3.8,
        teamCollaborationScore: 4.1,
        
        // Cost Analysis
        monthlySalary: 85000,
        totalCompensation: 102000, // Including benefits
        costPerProject: 42000,
        roiGenerated: 285000, // Revenue/value generated
        trainingInvestment: 25000,
        benefitsCost: 17000,
        
        // Productivity Metrics
        hoursWorked: 165, // Monthly
        productivityScore: 89,
        tasksCompletedOnTime: 94, // percentage
        codeQualityScore: 87,
        meetingEfficiency: 78,
        
        // Retention Analytics
        retentionProbability: 85, // percentage likelihood to stay
        satisfactionScore: 4.3,
        engagementLevel: "High",
        careerGrowthSatisfaction: 4.0,
        workLifeBalanceScore: 3.9,
        
        // Skills & Competencies
        skillLevel: "Advanced",
        criticalSkillsGap: 15, // percentage
        skillDevelopmentProgress: 82,
        certifications: ["AWS Certified", "Scrum Master"],
        skillMatrix: {
          technical: 88,
          leadership: 65,
          communication: 78,
          analytical: 85
        },
        
        // Succession Planning
        promotionReadiness: 75, // percentage
        leadershipPotential: "High",
        successorRisk: "Low", // if this person leaves
        mentoringCapability: 70,
        knowledgeTransferScore: 82,
        
        // Risk Analysis
        flightRisk: "Low",
        burnoutRisk: "Medium",
        skillObsolescenceRisk: "Low",
        disciplinaryIssues: 0,
        absenteeismRate: 2.1, // percentage
        
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
        
        // Performance Metrics
        performanceRating: 4.6,
        kpiScore: 93,
        projectCompletionRate: 96,
        clientSatisfactionScore: 4.7,
        innovationScore: 4.2,
        teamCollaborationScore: 4.8,
        
        // Cost Analysis
        monthlySalary: 125000,
        totalCompensation: 150000,
        costPerProject: 65000,
        roiGenerated: 420000,
        trainingInvestment: 35000,
        benefitsCost: 25000,
        
        // Productivity Metrics
        hoursWorked: 168,
        productivityScore: 94,
        tasksCompletedOnTime: 97,
        codeQualityScore: 0, // N/A for non-technical role
        meetingEfficiency: 89,
        
        // Retention Analytics
        retentionProbability: 92,
        satisfactionScore: 4.6,
        engagementLevel: "Very High",
        careerGrowthSatisfaction: 4.4,
        workLifeBalanceScore: 4.2,
        
        // Skills & Competencies
        skillLevel: "Expert",
        criticalSkillsGap: 8,
        skillDevelopmentProgress: 91,
        certifications: ["SHRM-CP", "PHR", "Leadership Excellence"],
        skillMatrix: {
          technical: 45,
          leadership: 95,
          communication: 92,
          analytical: 88
        },
        
        // Succession Planning
        promotionReadiness: 90,
        leadershipPotential: "Very High",
        successorRisk: "High", // Critical role
        mentoringCapability: 95,
        knowledgeTransferScore: 89,
        
        // Risk Analysis
        flightRisk: "Very Low",
        burnoutRisk: "Low",
        skillObsolescenceRisk: "Very Low",
        disciplinaryIssues: 0,
        absenteeismRate: 1.2,
        
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
        
        // Performance Metrics
        performanceRating: 3.8,
        kpiScore: 82,
        projectCompletionRate: 88,
        clientSatisfactionScore: 4.1,
        innovationScore: 4.0,
        teamCollaborationScore: 3.9,
        
        // Cost Analysis
        monthlySalary: 75000,
        totalCompensation: 85000,
        costPerProject: 38000,
        roiGenerated: 195000,
        trainingInvestment: 18000,
        benefitsCost: 10000,
        
        // Productivity Metrics
        hoursWorked: 162,
        productivityScore: 85,
        tasksCompletedOnTime: 91,
        codeQualityScore: 82,
        meetingEfficiency: 72,
        
        // Retention Analytics
        retentionProbability: 68, // Lower for contract
        satisfactionScore: 3.9,
        engagementLevel: "Medium",
        careerGrowthSatisfaction: 3.5,
        workLifeBalanceScore: 4.1,
        
        // Skills & Competencies
        skillLevel: "Intermediate",
        criticalSkillsGap: 25,
        skillDevelopmentProgress: 76,
        certifications: ["Google Analytics", "Tableau Desktop"],
        skillMatrix: {
          technical: 82,
          leadership: 45,
          communication: 68,
          analytical: 90
        },
        
        // Succession Planning
        promotionReadiness: 55,
        leadershipPotential: "Medium",
        successorRisk: "Medium",
        mentoringCapability: 45,
        knowledgeTransferScore: 68,
        
        // Risk Analysis
        flightRisk: "Medium", // Contract employee
        burnoutRisk: "Low",
        skillObsolescenceRisk: "Medium",
        disciplinaryIssues: 0,
        absenteeismRate: 3.2,
        
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
        
        // Performance Metrics
        performanceRating: 4.4,
        kpiScore: 91,
        projectCompletionRate: 94,
        clientSatisfactionScore: 4.6,
        innovationScore: 4.0,
        teamCollaborationScore: 4.5,
        
        // Cost Analysis
        monthlySalary: 95000,
        totalCompensation: 115000,
        costPerProject: 48000,
        roiGenerated: 350000,
        trainingInvestment: 18000,
        benefitsCost: 20000,
        
        // Productivity Metrics
        hoursWorked: 162,
        productivityScore: 92,
        tasksCompletedOnTime: 96,
        campaignSuccessRate: 88,
        meetingEfficiency: 85,
        
        // Retention Analytics
        retentionProbability: 92,
        satisfactionScore: 4.5,
        engagementLevel: "High",
        careerGrowthSatisfaction: 4.3,
        workLifeBalanceScore: 4.2,
        
        // Skills & Competencies
        skillLevel: "Advanced",
        criticalSkillsGap: 10,
        skillDevelopmentProgress: 88,
        certifications: ["Digital Marketing", "Google Ads", "HubSpot"],
        skillMatrix: {
          technical: 85,
          leadership: 88,
          communication: 92,
          analytical: 87
        },
        
        // Succession Planning
        promotionReadiness: 88,
        leadershipPotential: "High",
        successorRisk: "High",
        mentoringCapability: 85,
        knowledgeTransferScore: 90,
        
        // Risk Analysis
        flightRisk: "Low",
        burnoutRisk: "Low",
        skillObsolescenceRisk: "Low",
        disciplinaryIssues: 0,
        absenteeismRate: 1.8,
        
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
        
        // Performance Metrics
        performanceRating: 3.8,
        kpiScore: 82,
        projectCompletionRate: 85,
        clientSatisfactionScore: 4.2,
        innovationScore: 3.5,
        teamCollaborationScore: 3.9,
        
        // Cost Analysis
        monthlySalary: 65000,
        totalCompensation: 73000,
        costPerProject: 32000,
        roiGenerated: 180000,
        trainingInvestment: 12000,
        benefitsCost: 8000,
        
        // Productivity Metrics
        hoursWorked: 158,
        productivityScore: 84,
        tasksCompletedOnTime: 87,
        accuracyRate: 96,
        meetingEfficiency: 78,
        
        // Retention Analytics
        retentionProbability: 65, // Lower due to casual employment
        satisfactionScore: 3.8,
        engagementLevel: "Medium",
        careerGrowthSatisfaction: 3.2,
        workLifeBalanceScore: 4.0,
        
        // Skills & Competencies
        skillLevel: "Intermediate",
        criticalSkillsGap: 30,
        skillDevelopmentProgress: 72,
        certifications: ["QuickBooks", "Excel Advanced"],
        skillMatrix: {
          technical: 78,
          leadership: 35,
          communication: 65,
          analytical: 82
        },
        
        // Succession Planning
        promotionReadiness: 45,
        leadershipPotential: "Medium",
        successorRisk: "Low",
        mentoringCapability: 40,
        knowledgeTransferScore: 65,
        
        // Risk Analysis
        flightRisk: "High", // Casual employee seeking permanent position
        burnoutRisk: "Medium",
        skillObsolescenceRisk: "Medium",
        disciplinaryIssues: 0,
        absenteeismRate: 4.2,
        
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
        
        // Performance Metrics
        performanceRating: 4.7,
        kpiScore: 95,
        projectCompletionRate: 98,
        clientSatisfactionScore: 4.8,
        innovationScore: 4.5,
        teamCollaborationScore: 4.6,
        
        // Cost Analysis
        monthlySalary: 120000,
        totalCompensation: 145000,
        costPerProject: 58000,
        roiGenerated: 420000,
        trainingInvestment: 22000,
        benefitsCost: 25000,
        
        // Productivity Metrics
        hoursWorked: 170,
        productivityScore: 96,
        tasksCompletedOnTime: 98,
        codeQualityScore: 94,
        meetingEfficiency: 88,
        
        // Retention Analytics
        retentionProbability: 95,
        satisfactionScore: 4.7,
        engagementLevel: "Very High",
        careerGrowthSatisfaction: 4.5,
        workLifeBalanceScore: 4.3,
        
        // Skills & Competencies
        skillLevel: "Expert",
        criticalSkillsGap: 5,
        skillDevelopmentProgress: 92,
        certifications: ["AWS Solutions Architect", "Kubernetes", "Docker", "React"],
        skillMatrix: {
          technical: 95,
          leadership: 82,
          communication: 85,
          analytical: 92
        },
        
        // Succession Planning
        promotionReadiness: 92,
        leadershipPotential: "Very High",
        successorRisk: "Very High",
        mentoringCapability: 90,
        knowledgeTransferScore: 95,
        
        // Risk Analysis
        flightRisk: "Very Low",
        burnoutRisk: "Medium", // High performer risk
        skillObsolescenceRisk: "Very Low",
        disciplinaryIssues: 0,
        absenteeismRate: 1.2,
        
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
      summary: this.generateSummary(mockData, report),
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
    return baseData.map(emp => {
      const serviceYears = Math.floor((new Date().getTime() - new Date(emp.dateJoined).getTime()) / (365 * 24 * 60 * 60 * 1000));
      return {
        ...emp,
        ageGroup: emp.age < 25 ? '18-24' : emp.age < 35 ? '25-34' : emp.age < 45 ? '35-44' : emp.age < 55 ? '45-54' : '55+',
        serviceYears,
        serviceCategory: serviceYears < 1 ? 'New (0-1 years)' : serviceYears < 3 ? 'Junior (1-3 years)' : serviceYears < 5 ? 'Mid-level (3-5 years)' : 'Senior (5+ years)',
        nationality: 'Sri Lankan',
        religion: ['Buddhism', 'Christianity', 'Islam', 'Hinduism'][Math.floor(Math.random() * 4)],
        ethnicity: ['Sinhala', 'Tamil', 'Muslim', 'Burgher'][Math.floor(Math.random() * 4)],
        maritalStatus: emp.civilStatus,
        dependents: Math.floor(Math.random() * 4),
        emergencyContact: `Emergency Contact ${emp.id}`,
        bloodType: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'][Math.floor(Math.random() * 8)],
        transportMode: ['Own Vehicle', 'Public Transport', 'Company Transport', 'Walking'][Math.floor(Math.random() * 4)],
        workSchedule: emp.employmentType === 'Permanent' ? 'Full-time (40 hrs/week)' : emp.employmentType === 'Contract' ? 'Full-time Contract' : 'Part-time',
        medicalInsurance: emp.employmentType === 'Permanent',
        pensionEligible: emp.employmentType === 'Permanent' && serviceYears > 1
      };
    });
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
    const salaryRanges = {
      'Junior Software Engineer': { base: 45000, allowance: 8000 },
      'Software Engineer': { base: 65000, allowance: 12000 },
      'Senior Developer': { base: 85000, allowance: 15000 },
      'HR Manager': { base: 75000, allowance: 12000 },
      'Marketing Manager': { base: 70000, allowance: 11000 },
      'Data Analyst': { base: 60000, allowance: 10000 },
      'Finance Officer': { base: 55000, allowance: 9000 },
      'Administrative Assistant': { base: 35000, allowance: 5000 },
      'Quality Assurance Manager': { base: 75000, allowance: 12000 }
    };

    return baseData.map(emp => {
      const salaryInfo = salaryRanges[emp.designation as keyof typeof salaryRanges] || { base: 50000, allowance: 8000 };
      const experience = Math.floor((new Date().getTime() - new Date(emp.dateJoined).getTime()) / (365 * 24 * 60 * 60 * 1000));
      const experienceMultiplier = 1 + (experience * 0.05); // 5% per year
      
      const basicSalary = Math.floor(salaryInfo.base * experienceMultiplier);
      const housingAllowance = Math.floor(salaryInfo.allowance * experienceMultiplier);
      const transportAllowance = Math.floor(Math.random() * 8000) + 3000;
      const mealAllowance = Math.floor(Math.random() * 5000) + 2000;
      const overtime = emp.employmentType === 'Permanent' ? Math.floor(Math.random() * 15000) : 0;
      const performanceBonus = Math.floor(Math.random() * 30000);
      const totalAllowances = housingAllowance + transportAllowance + mealAllowance;
      const grossSalary = basicSalary + totalAllowances + overtime + performanceBonus;
      
      // Tax calculations
      const epfEmployee = Math.floor(basicSalary * 0.08);
      const epfEmployer = Math.floor(basicSalary * 0.12);
      const etf = Math.floor(basicSalary * 0.03);
      const incomeTax = grossSalary > 100000 ? Math.floor((grossSalary - 100000) * 0.06) : 0;
      const totalDeductions = epfEmployee + incomeTax;
      const netSalary = grossSalary - totalDeductions;

      return {
        ...emp,
        basicSalary,
        allowances: {
          housing: housingAllowance,
          transport: transportAllowance,
          meal: mealAllowance,
          total: totalAllowances
        },
        overtime,
        bonuses: {
          performance: performanceBonus,
          festival: emp.employmentType === 'Permanent' ? Math.floor(Math.random() * 15000) : 0,
          total: performanceBonus + (emp.employmentType === 'Permanent' ? Math.floor(Math.random() * 15000) : 0)
        },
        grossSalary,
        deductions: {
          epfEmployee,
          epfEmployer,
          etf,
          incomeTax,
          total: totalDeductions
        },
        netSalary,
        lastIncrement: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        incrementPercentage: Math.floor(Math.random() * 15) + 5,
        salaryGrade: basicSalary > 80000 ? 'Senior' : basicSalary > 60000 ? 'Mid' : 'Junior',
        costToCompany: grossSalary + epfEmployer + etf,
        annualSalary: grossSalary * 12
      };
    });
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

  // PDF content generation would be implemented here in the future
  // Currently all reports are generated as HTML and CSV formats

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
        emp.civilStatus || 'Single',
        emp.dateJoined,
        emp.education?.highestQualification || 'N/A',
        emp.promotions?.length || 0,
        emp.email,
        emp.mobile
      ].join(',');
      csv += row + '\n';
    });

    return csv;
  }
}

// Create and export service instance
export const employeeReportService = new EmployeeReportService();
export default employeeReportService;
