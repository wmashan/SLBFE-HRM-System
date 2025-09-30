// API Service Layer for SLBFE HRM System

import { ApiResponse, User, LoginCredentials, RegisterData } from '../types';

// Salary Management Types
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

interface SalaryStats {
  totalSalaryBudget: number;
  averageSalary: number;
  pendingPayments: number;
  totalEmployees: number;
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

// Staff Loan Management Types
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

interface LoanApplication {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  requestedAmount: number;
  loanType: 'personal' | 'medical' | 'education' | 'housing' | 'emergency' | 'vehicle';
  purpose: string;
  guarantor1: string;
  guarantor2: string;
  submissionDate: string;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewDate?: string;
  comments?: string;
  documents: string[];
  monthlyIncome: number;
  existingLoans: number;
  creditScore?: number;
}

interface LoanRepayment {
  id: string;
  loanId: string;
  employeeId: string;
  employeeName: string;
  paymentDate: string;
  dueDate: string;
  amount: number;
  principalAmount: number;
  interestAmount: number;
  remainingBalance: number;
  paymentMethod: 'salary_deduction' | 'cash' | 'bank_transfer' | 'cheque';
  status: 'scheduled' | 'paid' | 'overdue' | 'partial' | 'waived';
  receiptNumber?: string;
  lateFeesApplied: number;
  notes?: string;
}

interface LoanStats {
  totalLoansCount: number;
  activeLoansCount: number;
  pendingApplicationsCount: number;
  totalDisbursedAmount: number;
  totalOutstandingAmount: number;
  overduePaymentsCount: number;
  completedLoansCount: number;
  defaultedLoansCount: number;
  avgLoanAmount: number;
  totalInterestEarned: number;
}

interface LoanEligibility {
  employeeId: string;
  maxEligibleAmount: number;
  currentDebtRatio: number;
  creditScore: number;
  isEligible: boolean;
  eligibilityReasons: string[];
  recommendedAmount?: number;
  recommendedTerm?: number;
}

interface LoanSchedule {
  loanId: string;
  paymentNumber: number;
  dueDate: string;
  principalAmount: number;
  interestAmount: number;
  totalPayment: number;
  remainingBalance: number;
  status: 'pending' | 'paid' | 'overdue';
}

// Retirement Management Types
interface RetirementRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  title: string;
  department: string;
  position: string;
  dateOfBirth: string;
  joinDate: string;
  serviceConfirmationDate?: string;
  currentAge: number;
  yearsOfService: number;
  retirementEligibilityDate: string;
  plannedRetirementDate?: string;
  actualRetirementDate?: string;
  retirementType: 'mandatory' | 'voluntary' | 'early' | 'medical';
  status: 'active' | 'pre_retirement' | 'retired' | 'extended';
  pensionEligible: boolean;
  currentSalary: number;
  estimatedPension?: number;
  lastWorkingDay?: string;
  notificationSent: boolean;
  threeMonthNotificationSent: boolean;
  handoverStatus?: 'not_started' | 'in_progress' | 'completed';
  // SLBFE specific fields
  epfNumber?: string;
  etfNumber?: string;
  serviceWithSLBFE: string; // Service duration as of specific date
  serviceAsAtDate: string; // The date as of which service is calculated
  confirmationLetterIssued: boolean;
  confirmationLetterDate?: string;
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

interface RetirementStats {
  totalUpcoming: number;
  pendingNotifications: number;
  inPreRetirement: number;
  totalRetired: number;
  upcomingThisYear: number;
  pensionLiability: number;
}

// Base API configuration
const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
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
      console.error('API Error:', error);
      throw error;
    }
  }

  // Authentication Methods
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    // Demo users for development
    const demoUsers = [
      {
        id: 'admin001',
        username: 'admin',
        email: 'admin@slbfe.com',
        fullName: 'System Administrator',
        role: 'admin' as const,
        isActive: true,
        createdAt: new Date('2022-01-01'),
        updatedAt: new Date('2024-09-30')
      },
      {
        id: 'hr001',
        username: 'hrmanager',
        email: 'hrmanager@slbfe.com',
        fullName: 'John Anderson',
        role: 'hr' as const,
        isActive: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2024-09-30')
      },
      {
        id: 'shr001',
        username: 'seniorhrmanager',
        email: 'seniorhrmanager@slbfe.com',
        fullName: 'Sarah Williams',
        role: 'senior_hr_manager' as const,
        isActive: true,
        createdAt: new Date('2022-06-15'),
        updatedAt: new Date('2024-09-30')
      },
      {
        id: 'emp001',
        username: 'employee',
        email: 'employee@slbfe.com',
        fullName: 'Mike Johnson',
        role: 'employee' as const,
        isActive: true,
        createdAt: new Date('2023-03-10'),
        updatedAt: new Date('2024-09-30')
      }
    ];

    // Check demo credentials
    const user = demoUsers.find(u => {
      if (u.username === credentials.username) {
        if (u.role === 'admin' && credentials.password === 'admin123') return true;
        if (u.role === 'hr' && credentials.password === 'hrpass123') return true;
        if (u.role === 'senior_hr_manager' && credentials.password === 'seniorhrpass123') return true;
        if (u.role === 'employee' && credentials.password === 'emp123') return true;
      }
      return false;
    });

    if (user) {
      const token = 'demo_token_' + user.id + '_' + Date.now();
      const response = {
        success: true,
        data: { user, token },
        message: 'Login successful'
      };

      this.token = token;
      localStorage.setItem('slbfe_auth_token', this.token);
      localStorage.setItem('slbfe_user_data', JSON.stringify(user));

      return response;
    }

    // Fallback to API call for production
    try {
      const response = await this.request<{ user: User; token: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (response.success && response.data) {
        this.token = response.data.token;
        localStorage.setItem('slbfe_auth_token', this.token);
        localStorage.setItem('slbfe_user_data', JSON.stringify(response.data.user));
      }

      return response;
    } catch (error) {
      return {
        success: false,
        message: 'Invalid username or password',
        error: 'Authentication failed'
      };
    }
  }

  async register(userData: RegisterData): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<ApiResponse<null>> {
    const response = await this.request<null>('/auth/logout', {
      method: 'POST',
    });

    this.token = null;
    localStorage.removeItem('slbfe_auth_token');
    localStorage.removeItem('slbfe_user_data');

    return response;
  }

  async forgotPassword(email: string): Promise<ApiResponse<null>> {
    return this.request<null>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, password: string): Promise<ApiResponse<null>> {
    return this.request<null>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  }

  // User Methods
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/users/me');
  }

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<ApiResponse<null>> {
    return this.request<null>('/users/change-password', {
      method: 'POST',
      body: JSON.stringify({ oldPassword, newPassword }),
    });
  }

  // Employee Methods
  async getEmployees(params?: {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
    branch?: string;
    status?: string;
  }): Promise<ApiResponse<User[]>> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<User[]>(`/employees${queryString ? `?${queryString}` : ''}`);
  }

  async getEmployee(id: string): Promise<ApiResponse<User>> {
    return this.request<User>(`/employees/${id}`);
  }

  async createEmployee(employeeData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>('/employees', {
      method: 'POST',
      body: JSON.stringify(employeeData),
    });
  }

  async updateEmployee(id: string, employeeData: Partial<User>): Promise<ApiResponse<User>> {
    return this.request<User>(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employeeData),
    });
  }

  async deleteEmployee(id: string): Promise<ApiResponse<null>> {
    return this.request<null>(`/employees/${id}`, {
      method: 'DELETE',
    });
  }

  // Department Methods
  async getDepartments(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/departments');
  }

  async createDepartment(departmentData: any): Promise<ApiResponse<any>> {
    return this.request<any>('/departments', {
      method: 'POST',
      body: JSON.stringify(departmentData),
    });
  }

  // Branch Methods
  async getBranches(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/branches');
  }

  async createBranch(branchData: any): Promise<ApiResponse<any>> {
    return this.request<any>('/branches', {
      method: 'POST',
      body: JSON.stringify(branchData),
    });
  }

  // File Upload
  async uploadFile(file: File, type: 'profile' | 'document'): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch(`${this.baseURL}/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });

    return response.json();
  }

  // Reports
  async getReports(type: string, params?: any): Promise<ApiResponse<any>> {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return this.request<any>(`/reports/${type}${queryString ? `?${queryString}` : ''}`);
  }

  // Dashboard Statistics
  async getDashboardStats(): Promise<ApiResponse<{
    totalEmployees: number;
    totalBranches: number;
    activeEmployees: number;
    recentHires: number;
  }>> {
    return this.request('/dashboard/stats');
  }

  // Salary Management Methods
  async getSalaryRecords(params?: {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
    status?: string;
  }): Promise<ApiResponse<SalaryRecord[]>> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<SalaryRecord[]>(`/salary/records${queryString ? `?${queryString}` : ''}`);
  }

  async getSalaryRecord(id: string): Promise<ApiResponse<SalaryRecord>> {
    return this.request<SalaryRecord>(`/salary/records/${id}`);
  }

  async updateSalaryRecord(id: string, data: Partial<SalaryRecord>): Promise<ApiResponse<SalaryRecord>> {
    return this.request<SalaryRecord>(`/salary/records/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getSalaryAdjustments(params?: {
    page?: number;
    limit?: number;
    status?: 'pending' | 'approved' | 'rejected';
  }): Promise<ApiResponse<SalaryAdjustment[]>> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<SalaryAdjustment[]>(`/salary/adjustments${queryString ? `?${queryString}` : ''}`);
  }

  async createSalaryAdjustment(data: Omit<SalaryAdjustment, 'id' | 'status'>): Promise<ApiResponse<SalaryAdjustment>> {
    return this.request<SalaryAdjustment>('/salary/adjustments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async approveSalaryAdjustment(id: string): Promise<ApiResponse<SalaryAdjustment>> {
    return this.request<SalaryAdjustment>(`/salary/adjustments/${id}/approve`, {
      method: 'POST',
    });
  }

  async rejectSalaryAdjustment(id: string, reason?: string): Promise<ApiResponse<SalaryAdjustment>> {
    return this.request<SalaryAdjustment>(`/salary/adjustments/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async getSalaryStats(): Promise<ApiResponse<SalaryStats>> {
    return this.request<SalaryStats>('/salary/stats');
  }

  async generateSalaryReport(params: {
    startDate: string;
    endDate: string;
    department?: string;
    format: 'pdf' | 'excel';
  }): Promise<ApiResponse<{ url: string }>> {
    return this.request<{ url: string }>('/salary/reports', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // Upcoming Increments Methods
  async getUpcomingIncrements(params?: {
    page?: number;
    limit?: number;
    department?: string;
    status?: 'scheduled' | 'approved' | 'on_hold' | 'processed';
    daysAhead?: number;
  }): Promise<ApiResponse<UpcomingIncrement[]>> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<UpcomingIncrement[]>(`/salary/increments${queryString ? `?${queryString}` : ''}`);
  }

  async createUpcomingIncrement(data: Omit<UpcomingIncrement, 'id'>): Promise<ApiResponse<UpcomingIncrement>> {
    return this.request<UpcomingIncrement>('/salary/increments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUpcomingIncrement(id: string, data: Partial<UpcomingIncrement>): Promise<ApiResponse<UpcomingIncrement>> {
    return this.request<UpcomingIncrement>(`/salary/increments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async approveIncrement(id: string): Promise<ApiResponse<UpcomingIncrement>> {
    return this.request<UpcomingIncrement>(`/salary/increments/${id}/approve`, {
      method: 'POST',
    });
  }

  async putIncrementOnHold(id: string, reason?: string): Promise<ApiResponse<UpcomingIncrement>> {
    return this.request<UpcomingIncrement>(`/salary/increments/${id}/hold`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async markIncrementNotified(id: string): Promise<ApiResponse<UpcomingIncrement>> {
    return this.request<UpcomingIncrement>(`/salary/increments/${id}/notify`, {
      method: 'POST',
    });
  }

  async getIncrementNotifications(): Promise<ApiResponse<UpcomingIncrement[]>> {
    return this.request<UpcomingIncrement[]>('/salary/increments/notifications');
  }

  async processIncrement(id: string): Promise<ApiResponse<UpcomingIncrement>> {
    return this.request<UpcomingIncrement>(`/salary/increments/${id}/process`, {
      method: 'POST',
    });
  }

  // Retirement Management Methods
  async getRetirementRecords(params?: {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
    status?: 'active' | 'pre_retirement' | 'retired' | 'extended';
    upcomingMonths?: number;
  }): Promise<ApiResponse<RetirementRecord[]>> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<RetirementRecord[]>(`/retirement/records${queryString ? `?${queryString}` : ''}`);
  }

  async getRetirementRecord(id: string): Promise<ApiResponse<RetirementRecord>> {
    return this.request<RetirementRecord>(`/retirement/records/${id}`);
  }

  async updateRetirementRecord(id: string, data: Partial<RetirementRecord>): Promise<ApiResponse<RetirementRecord>> {
    return this.request<RetirementRecord>(`/retirement/records/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getUpcomingRetirements(months: number = 24): Promise<ApiResponse<RetirementRecord[]>> {
    return this.request<RetirementRecord[]>(`/retirement/upcoming?months=${months}`);
  }

  async getRetirementNotifications(): Promise<ApiResponse<RetirementRecord[]>> {
    return this.request<RetirementRecord[]>('/retirement/notifications');
  }

  async sendRetirementNotification(employeeId: string): Promise<ApiResponse<null>> {
    return this.request<null>(`/retirement/notify/${employeeId}`, {
      method: 'POST',
    });
  }

  async sendThreeMonthNotification(employeeId: string): Promise<ApiResponse<null>> {
    return this.request<null>(`/retirement/notify-three-month/${employeeId}`, {
      method: 'POST',
    });
  }

  async getThreeMonthNotifications(): Promise<ApiResponse<RetirementRecord[]>> {
    return this.request<RetirementRecord[]>('/retirement/three-month-notifications');
  }

  async getRetirementBenefits(employeeId?: string): Promise<ApiResponse<RetirementBenefit[]>> {
    const endpoint = employeeId ? `/retirement/benefits?employeeId=${employeeId}` : '/retirement/benefits';
    return this.request<RetirementBenefit[]>(endpoint);
  }

  async createRetirementBenefit(data: Omit<RetirementBenefit, 'id'>): Promise<ApiResponse<RetirementBenefit>> {
    return this.request<RetirementBenefit>('/retirement/benefits', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRetirementBenefit(id: string, data: Partial<RetirementBenefit>): Promise<ApiResponse<RetirementBenefit>> {
    return this.request<RetirementBenefit>(`/retirement/benefits/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getRetirementPlanning(employeeId?: string): Promise<ApiResponse<RetirementPlanning[]>> {
    const endpoint = employeeId ? `/retirement/planning?employeeId=${employeeId}` : '/retirement/planning';
    return this.request<RetirementPlanning[]>(endpoint);
  }

  async createRetirementPlan(data: Omit<RetirementPlanning, 'id'>): Promise<ApiResponse<RetirementPlanning>> {
    return this.request<RetirementPlanning>('/retirement/planning', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRetirementPlan(id: string, data: Partial<RetirementPlanning>): Promise<ApiResponse<RetirementPlanning>> {
    return this.request<RetirementPlanning>(`/retirement/planning/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async calculatePension(employeeId: string, retirementDate: string): Promise<ApiResponse<{
    monthlyPension: number;
    lumpSum: number;
    gratuity: number;
    totalBenefits: number;
  }>> {
    return this.request(`/retirement/calculate-pension`, {
      method: 'POST',
      body: JSON.stringify({ employeeId, retirementDate }),
    });
  }

  async getRetirementStats(): Promise<ApiResponse<RetirementStats>> {
    return this.request<RetirementStats>('/retirement/stats');
  }

  async generateRetirementReport(params: {
    startDate?: string;
    endDate?: string;
    department?: string;
    reportType: 'forecast' | 'benefits' | 'planning';
    format: 'pdf' | 'excel';
  }): Promise<ApiResponse<{ url: string }>> {
    return this.request<{ url: string }>('/retirement/reports', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // Staff Loan Management Methods
  async getLoans(params?: {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
    status?: 'pending' | 'approved' | 'rejected' | 'disbursed' | 'active' | 'completed' | 'defaulted';
    loanType?: string;
  }): Promise<ApiResponse<StaffLoan[]>> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<StaffLoan[]>(`/loans${queryString ? `?${queryString}` : ''}`);
  }

  async getLoan(id: string): Promise<ApiResponse<StaffLoan>> {
    return this.request<StaffLoan>(`/loans/${id}`);
  }

  async createLoan(data: Omit<StaffLoan, 'id' | 'status' | 'remainingBalance' | 'totalPaid'>): Promise<ApiResponse<StaffLoan>> {
    return this.request<StaffLoan>('/loans', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateLoan(id: string, data: Partial<StaffLoan>): Promise<ApiResponse<StaffLoan>> {
    return this.request<StaffLoan>(`/loans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async approveLoan(id: string, approvedAmount?: number, comments?: string): Promise<ApiResponse<StaffLoan>> {
    return this.request<StaffLoan>(`/loans/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ approvedAmount, comments }),
    });
  }

  async rejectLoan(id: string, reason: string): Promise<ApiResponse<StaffLoan>> {
    return this.request<StaffLoan>(`/loans/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async disburseLoan(id: string, disbursementDate: string): Promise<ApiResponse<StaffLoan>> {
    return this.request<StaffLoan>(`/loans/${id}/disburse`, {
      method: 'POST',
      body: JSON.stringify({ disbursementDate }),
    });
  }

  async getLoanApplications(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'submitted' | 'under_review' | 'approved' | 'rejected';
  }): Promise<ApiResponse<LoanApplication[]>> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<LoanApplication[]>(`/loan-applications${queryString ? `?${queryString}` : ''}`);
  }

  async getLoanApplication(id: string): Promise<ApiResponse<LoanApplication>> {
    return this.request<LoanApplication>(`/loan-applications/${id}`);
  }

  async createLoanApplication(data: Omit<LoanApplication, 'id' | 'status' | 'submissionDate'>): Promise<ApiResponse<LoanApplication>> {
    return this.request<LoanApplication>('/loan-applications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateLoanApplication(id: string, data: Partial<LoanApplication>): Promise<ApiResponse<LoanApplication>> {
    return this.request<LoanApplication>(`/loan-applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async reviewLoanApplication(id: string, status: 'approved' | 'rejected', comments?: string): Promise<ApiResponse<LoanApplication>> {
    return this.request<LoanApplication>(`/loan-applications/${id}/review`, {
      method: 'POST',
      body: JSON.stringify({ status, comments }),
    });
  }

  async getLoanRepayments(params?: {
    page?: number;
    limit?: number;
    loanId?: string;
    employeeId?: string;
    status?: 'scheduled' | 'paid' | 'overdue' | 'partial' | 'waived';
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<LoanRepayment[]>> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<LoanRepayment[]>(`/loan-repayments${queryString ? `?${queryString}` : ''}`);
  }

  async getLoanRepayment(id: string): Promise<ApiResponse<LoanRepayment>> {
    return this.request<LoanRepayment>(`/loan-repayments/${id}`);
  }

  async recordLoanPayment(data: Omit<LoanRepayment, 'id' | 'remainingBalance'>): Promise<ApiResponse<LoanRepayment>> {
    return this.request<LoanRepayment>('/loan-repayments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateLoanPayment(id: string, data: Partial<LoanRepayment>): Promise<ApiResponse<LoanRepayment>> {
    return this.request<LoanRepayment>(`/loan-repayments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getOverduePayments(): Promise<ApiResponse<LoanRepayment[]>> {
    return this.request<LoanRepayment[]>('/loan-repayments/overdue');
  }

  async applyLateFee(repaymentId: string, feeAmount: number): Promise<ApiResponse<LoanRepayment>> {
    return this.request<LoanRepayment>(`/loan-repayments/${repaymentId}/late-fee`, {
      method: 'POST',
      body: JSON.stringify({ feeAmount }),
    });
  }

  async waivePayment(repaymentId: string, reason: string): Promise<ApiResponse<LoanRepayment>> {
    return this.request<LoanRepayment>(`/loan-repayments/${repaymentId}/waive`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async getLoanSchedule(loanId: string): Promise<ApiResponse<LoanSchedule[]>> {
    return this.request<LoanSchedule[]>(`/loans/${loanId}/schedule`);
  }

  async generateLoanSchedule(loanId: string): Promise<ApiResponse<LoanSchedule[]>> {
    return this.request<LoanSchedule[]>(`/loans/${loanId}/generate-schedule`, {
      method: 'POST',
    });
  }

  async checkLoanEligibility(employeeId: string, requestedAmount: number, loanType: string): Promise<ApiResponse<LoanEligibility>> {
    return this.request<LoanEligibility>('/loans/check-eligibility', {
      method: 'POST',
      body: JSON.stringify({ employeeId, requestedAmount, loanType }),
    });
  }

  async getLoanStats(): Promise<ApiResponse<LoanStats>> {
    return this.request<LoanStats>('/loans/stats');
  }

  async generateLoanReport(params: {
    startDate?: string;
    endDate?: string;
    department?: string;
    loanType?: string;
    status?: string;
    reportType: 'summary' | 'detailed' | 'repayment' | 'overdue';
    format: 'pdf' | 'excel';
  }): Promise<ApiResponse<{ url: string }>> {
    return this.request<{ url: string }>('/loans/reports', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async getUpcomingLoanPayments(days: number = 30): Promise<ApiResponse<LoanRepayment[]>> {
    return this.request<LoanRepayment[]>(`/loans/upcoming-payments?days=${days}`);
  }

  async sendPaymentReminder(repaymentId: string): Promise<ApiResponse<null>> {
    return this.request<null>(`/loan-repayments/${repaymentId}/remind`, {
      method: 'POST',
    });
  }

  async calculateEmi(principal: number, interestRate: number, tenure: number): Promise<ApiResponse<{
    emi: number;
    totalAmount: number;
    totalInterest: number;
  }>> {
    return this.request('/loans/calculate-emi', {
      method: 'POST',
      body: JSON.stringify({ principal, interestRate, tenure }),
    });
  }

  // Application Methods
  async getApplications(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'pending' | 'approved' | 'rejected';
  }): Promise<ApiResponse<any[]>> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<any[]>(`/applications${queryString ? `?${queryString}` : ''}`);
  }

  async getApplication(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/applications/${id}`);
  }

  async updateApplicationStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<ApiResponse<any>> {
    return this.request<any>(`/applications/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async deleteApplication(id: string): Promise<ApiResponse<null>> {
    return this.request<null>(`/applications/${id}`, {
      method: 'DELETE',
    });
  }

  async getApplicationStats(): Promise<ApiResponse<{
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    thisWeek: number;
  }>> {
    return this.request('/applications/stats');
  }

  // Disciplinary Actions Methods (Senior HR Manager Only)
  async getDisciplinaryActions(params?: {
    page?: number;
    limit?: number;
    search?: string;
    department?: string;
    status?: string;
    severity?: string;
    employeeId?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<any[]>> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<any[]>(`/disciplinary-actions${queryString ? `?${queryString}` : ''}`);
  }

  async getDisciplinaryAction(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/disciplinary-actions/${id}`);
  }

  async createDisciplinaryAction(data: any): Promise<ApiResponse<any>> {
    return this.request<any>('/disciplinary-actions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDisciplinaryAction(id: string, data: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/disciplinary-actions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDisciplinaryAction(id: string): Promise<ApiResponse<null>> {
    return this.request<null>(`/disciplinary-actions/${id}`, {
      method: 'DELETE',
    });
  }

  async approveDisciplinaryAction(id: string, comments?: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/disciplinary-actions/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ comments }),
    });
  }

  async implementDisciplinaryAction(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/disciplinary-actions/${id}/implement`, {
      method: 'POST',
    });
  }

  async submitAppeal(id: string, appealReason: string, evidenceUrls?: string[]): Promise<ApiResponse<any>> {
    return this.request<any>(`/disciplinary-actions/${id}/appeal`, {
      method: 'POST',
      body: JSON.stringify({ appealReason, evidenceUrls }),
    });
  }

  async reviewAppeal(id: string, decision: 'upheld' | 'overturned', reviewNotes?: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/disciplinary-actions/${id}/review-appeal`, {
      method: 'POST',
      body: JSON.stringify({ decision, reviewNotes }),
    });
  }

  async getDisciplinaryStats(): Promise<ApiResponse<any>> {
    return this.request<any>('/disciplinary-actions/stats');
  }

  async generateDisciplinaryReport(params: {
    startDate?: string;
    endDate?: string;
    department?: string;
    severity?: string;
    actionType?: string;
    status?: string;
    format: 'pdf' | 'excel';
  }): Promise<ApiResponse<{ url: string }>> {
    return this.request<{ url: string }>('/disciplinary-actions/reports', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async getEmployeeDisciplinaryHistory(employeeId: string): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/disciplinary-actions/employee/${employeeId}`);
  }

  async getUpcomingFollowUps(days: number = 30): Promise<ApiResponse<any[]>> {
    return this.request<any[]>(`/disciplinary-actions/follow-ups?days=${days}`);
  }

  async markFollowUpComplete(actionId: string, followUpNotes: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/disciplinary-actions/${actionId}/follow-up`, {
      method: 'POST',
      body: JSON.stringify({ followUpNotes }),
    });
  }

  // Reports Methods (Senior HR Manager Only)
  async getReportConfigs(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    type?: string;
    isActive?: boolean;
  }): Promise<ApiResponse<any[]>> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<any[]>(`/reports/configs${queryString ? `?${queryString}` : ''}`);
  }

  async getReportConfig(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/reports/configs/${id}`);
  }

  async createReportConfig(data: any): Promise<ApiResponse<any>> {
    return this.request<any>('/reports/configs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateReportConfig(id: string, data: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/reports/configs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteReportConfig(id: string): Promise<ApiResponse<null>> {
    return this.request<null>(`/reports/configs/${id}`, {
      method: 'DELETE',
    });
  }

  async generateReport(configId: string, parameters: any, format: string): Promise<ApiResponse<any>> {
    return this.request<any>('/reports/generate', {
      method: 'POST',
      body: JSON.stringify({ configId, parameters, format }),
    });
  }

  async getReportGenerations(params?: {
    page?: number;
    limit?: number;
    configId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<any[]>> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<any[]>(`/reports/generations${queryString ? `?${queryString}` : ''}`);
  }

  async getReportGeneration(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/reports/generations/${id}`);
  }

  async cancelReportGeneration(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/reports/generations/${id}/cancel`, {
      method: 'POST',
    });
  }

  async downloadReport(generationId: string): Promise<ApiResponse<{ url: string }>> {
    return this.request<{ url: string }>(`/reports/generations/${generationId}/download`);
  }

  async getReportAnalytics(): Promise<ApiResponse<any>> {
    return this.request<any>('/reports/analytics');
  }

  async getReportTemplates(category?: string): Promise<ApiResponse<any[]>> {
    const queryString = category ? `?category=${category}` : '';
    return this.request<any[]>(`/reports/templates${queryString}`);
  }

  async createReportTemplate(data: any): Promise<ApiResponse<any>> {
    return this.request<any>('/reports/templates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateReportTemplate(id: string, data: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/reports/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteReportTemplate(id: string): Promise<ApiResponse<null>> {
    return this.request<null>(`/reports/templates/${id}`, {
      method: 'DELETE',
    });
  }

  async scheduleReport(configId: string, schedule: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/reports/configs/${configId}/schedule`, {
      method: 'POST',
      body: JSON.stringify(schedule),
    });
  }

  async updateReportSchedule(configId: string, schedule: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/reports/configs/${configId}/schedule`, {
      method: 'PUT',
      body: JSON.stringify(schedule),
    });
  }

  async deleteReportSchedule(configId: string): Promise<ApiResponse<null>> {
    return this.request<null>(`/reports/configs/${configId}/schedule`, {
      method: 'DELETE',
    });
  }

  async getScheduledReports(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/reports/scheduled');
  }

  async previewReport(configId: string, parameters: any): Promise<ApiResponse<any>> {
    return this.request<any>('/reports/preview', {
      method: 'POST',
      body: JSON.stringify({ configId, parameters }),
    });
  }

  async exportReportData(configId: string, parameters: any, format: string): Promise<ApiResponse<{ url: string }>> {
    return this.request<{ url: string }>('/reports/export', {
      method: 'POST',
      body: JSON.stringify({ configId, parameters, format }),
    });
  }

  async shareReport(generationId: string, recipients: string[], message?: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/reports/generations/${generationId}/share`, {
      method: 'POST',
      body: JSON.stringify({ recipients, message }),
    });
  }

  async getReportDashboards(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/reports/dashboards');
  }

  async createReportDashboard(data: any): Promise<ApiResponse<any>> {
    return this.request<any>('/reports/dashboards', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateReportDashboard(id: string, data: any): Promise<ApiResponse<any>> {
    return this.request<any>(`/reports/dashboards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Employee Report Methods
  async generateEmployeeReport(request: any): Promise<ApiResponse<any>> {
    return this.request<any>('/reports/employee/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getEmployeeReportData(employeeId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/reports/employee/${employeeId}/data`);
  }

  async getEmployeeReportGenerations(params?: {
    employeeId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<any[]>> {
    const queryString = params ? new URLSearchParams(params as any).toString() : '';
    return this.request<any[]>(`/reports/employee/generations${queryString ? `?${queryString}` : ''}`);
  }

  async getEmployeeReportGeneration(id: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/reports/employee/generations/${id}`);
  }

  async downloadEmployeeReport(generationId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/reports/employee/generations/${generationId}/download`);
  }

  async getEmployeeReportTemplates(): Promise<ApiResponse<any[]>> {
    return this.request<any[]>('/reports/employee/templates');
  }

  async previewEmployeeReport(request: any): Promise<ApiResponse<any>> {
    return this.request<any>('/reports/employee/preview', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }
}

// Create and export API service instance
export const apiService = new ApiService();

// Export individual service functions for easier imports
export const authService = {
  login: (credentials: LoginCredentials) => apiService.login(credentials),
  register: (userData: RegisterData) => apiService.register(userData),
  logout: () => apiService.logout(),
  forgotPassword: (email: string) => apiService.forgotPassword(email),
  resetPassword: (token: string, password: string) => apiService.resetPassword(token, password),
  getCurrentUser: () => apiService.getCurrentUser(),
};

export const employeeService = {
  getEmployees: (params?: any) => apiService.getEmployees(params),
  getEmployee: (id: string) => apiService.getEmployee(id),
  createEmployee: (data: Partial<User>) => apiService.createEmployee(data),
  updateEmployee: (id: string, data: Partial<User>) => apiService.updateEmployee(id, data),
  deleteEmployee: (id: string) => apiService.deleteEmployee(id),
};

export const departmentService = {
  getDepartments: () => apiService.getDepartments(),
  createDepartment: (data: any) => apiService.createDepartment(data),
};

export const branchService = {
  getBranches: () => apiService.getBranches(),
  createBranch: (data: any) => apiService.createBranch(data),
};

export const applicationService = {
  getApplications: (params?: any) => apiService.getApplications(params),
  getApplication: (id: string) => apiService.getApplication(id),
  updateApplicationStatus: (id: string, status: 'pending' | 'approved' | 'rejected') => 
    apiService.updateApplicationStatus(id, status),
  deleteApplication: (id: string) => apiService.deleteApplication(id),
  getApplicationStats: () => apiService.getApplicationStats(),
};

export const salaryService = {
  getSalaryRecords: (params?: any) => apiService.getSalaryRecords(params),
  getSalaryRecord: (id: string) => apiService.getSalaryRecord(id),
  updateSalaryRecord: (id: string, data: Partial<SalaryRecord>) => apiService.updateSalaryRecord(id, data),
  getSalaryAdjustments: (params?: any) => apiService.getSalaryAdjustments(params),
  createSalaryAdjustment: (data: Omit<SalaryAdjustment, 'id' | 'status'>) => apiService.createSalaryAdjustment(data),
  approveSalaryAdjustment: (id: string) => apiService.approveSalaryAdjustment(id),
  rejectSalaryAdjustment: (id: string, reason?: string) => apiService.rejectSalaryAdjustment(id, reason),
  getSalaryStats: () => apiService.getSalaryStats(),
  generateSalaryReport: (params: any) => apiService.generateSalaryReport(params),
  // Upcoming Increments
  getUpcomingIncrements: (params?: any) => apiService.getUpcomingIncrements(params),
  createUpcomingIncrement: (data: Omit<UpcomingIncrement, 'id'>) => apiService.createUpcomingIncrement(data),
  updateUpcomingIncrement: (id: string, data: Partial<UpcomingIncrement>) => apiService.updateUpcomingIncrement(id, data),
  approveIncrement: (id: string) => apiService.approveIncrement(id),
  putIncrementOnHold: (id: string, reason?: string) => apiService.putIncrementOnHold(id, reason),
  markIncrementNotified: (id: string) => apiService.markIncrementNotified(id),
  getIncrementNotifications: () => apiService.getIncrementNotifications(),
  processIncrement: (id: string) => apiService.processIncrement(id),
};

export const retirementService = {
  getRetirementRecords: (params?: any) => apiService.getRetirementRecords(params),
  getRetirementRecord: (id: string) => apiService.getRetirementRecord(id),
  updateRetirementRecord: (id: string, data: Partial<RetirementRecord>) => apiService.updateRetirementRecord(id, data),
  getUpcomingRetirements: (months?: number) => apiService.getUpcomingRetirements(months),
  getRetirementNotifications: () => apiService.getRetirementNotifications(),
  sendRetirementNotification: (employeeId: string) => apiService.sendRetirementNotification(employeeId),
  sendThreeMonthNotification: (employeeId: string) => apiService.sendThreeMonthNotification(employeeId),
  getThreeMonthNotifications: () => apiService.getThreeMonthNotifications(),
  getRetirementBenefits: (employeeId?: string) => apiService.getRetirementBenefits(employeeId),
  createRetirementBenefit: (data: Omit<RetirementBenefit, 'id'>) => apiService.createRetirementBenefit(data),
  updateRetirementBenefit: (id: string, data: Partial<RetirementBenefit>) => apiService.updateRetirementBenefit(id, data),
  getRetirementPlanning: (employeeId?: string) => apiService.getRetirementPlanning(employeeId),
  createRetirementPlan: (data: Omit<RetirementPlanning, 'id'>) => apiService.createRetirementPlan(data),
  updateRetirementPlan: (id: string, data: Partial<RetirementPlanning>) => apiService.updateRetirementPlan(id, data),
  calculatePension: (employeeId: string, retirementDate: string) => apiService.calculatePension(employeeId, retirementDate),
  getRetirementStats: () => apiService.getRetirementStats(),
  generateRetirementReport: (params: any) => apiService.generateRetirementReport(params),
};

export const loanService = {
  // Loan Management
  getLoans: (params?: any) => apiService.getLoans(params),
  getLoan: (id: string) => apiService.getLoan(id),
  createLoan: (data: Omit<StaffLoan, 'id' | 'status' | 'remainingBalance' | 'totalPaid'>) => apiService.createLoan(data),
  updateLoan: (id: string, data: Partial<StaffLoan>) => apiService.updateLoan(id, data),
  approveLoan: (id: string, approvedAmount?: number, comments?: string) => apiService.approveLoan(id, approvedAmount, comments),
  rejectLoan: (id: string, reason: string) => apiService.rejectLoan(id, reason),
  disburseLoan: (id: string, disbursementDate: string) => apiService.disburseLoan(id, disbursementDate),
  
  // Loan Applications
  getLoanApplications: (params?: any) => apiService.getLoanApplications(params),
  getLoanApplication: (id: string) => apiService.getLoanApplication(id),
  createLoanApplication: (data: Omit<LoanApplication, 'id' | 'status' | 'submissionDate'>) => apiService.createLoanApplication(data),
  updateLoanApplication: (id: string, data: Partial<LoanApplication>) => apiService.updateLoanApplication(id, data),
  reviewLoanApplication: (id: string, status: 'approved' | 'rejected', comments?: string) => apiService.reviewLoanApplication(id, status, comments),
  
  // Loan Repayments
  getLoanRepayments: (params?: any) => apiService.getLoanRepayments(params),
  getLoanRepayment: (id: string) => apiService.getLoanRepayment(id),
  recordLoanPayment: (data: Omit<LoanRepayment, 'id' | 'remainingBalance'>) => apiService.recordLoanPayment(data),
  updateLoanPayment: (id: string, data: Partial<LoanRepayment>) => apiService.updateLoanPayment(id, data),
  getOverduePayments: () => apiService.getOverduePayments(),
  applyLateFee: (repaymentId: string, feeAmount: number) => apiService.applyLateFee(repaymentId, feeAmount),
  waivePayment: (repaymentId: string, reason: string) => apiService.waivePayment(repaymentId, reason),
  
  // Loan Scheduling and Calculations
  getLoanSchedule: (loanId: string) => apiService.getLoanSchedule(loanId),
  generateLoanSchedule: (loanId: string) => apiService.generateLoanSchedule(loanId),
  checkLoanEligibility: (employeeId: string, requestedAmount: number, loanType: string) => apiService.checkLoanEligibility(employeeId, requestedAmount, loanType),
  calculateEmi: (principal: number, interestRate: number, tenure: number) => apiService.calculateEmi(principal, interestRate, tenure),
  
  // Reports and Analytics
  getLoanStats: () => apiService.getLoanStats(),
  generateLoanReport: (params: any) => apiService.generateLoanReport(params),
  getUpcomingLoanPayments: (days?: number) => apiService.getUpcomingLoanPayments(days),
  sendPaymentReminder: (repaymentId: string) => apiService.sendPaymentReminder(repaymentId),
};

// Disciplinary Actions Service (Senior HR Manager Only)
export const disciplinaryService = {
  // CRUD Operations
  getDisciplinaryActions: (params?: any) => apiService.getDisciplinaryActions(params),
  getDisciplinaryAction: (id: string) => apiService.getDisciplinaryAction(id),
  createDisciplinaryAction: (data: any) => apiService.createDisciplinaryAction(data),
  updateDisciplinaryAction: (id: string, data: any) => apiService.updateDisciplinaryAction(id, data),
  deleteDisciplinaryAction: (id: string) => apiService.deleteDisciplinaryAction(id),
  
  // Workflow Management
  approveDisciplinaryAction: (id: string, comments?: string) => apiService.approveDisciplinaryAction(id, comments),
  implementDisciplinaryAction: (id: string) => apiService.implementDisciplinaryAction(id),
  
  // Appeals
  submitAppeal: (id: string, appealReason: string, evidenceUrls?: string[]) => apiService.submitAppeal(id, appealReason, evidenceUrls),
  reviewAppeal: (id: string, decision: 'upheld' | 'overturned', reviewNotes?: string) => apiService.reviewAppeal(id, decision, reviewNotes),
  
  // Analytics and Reports
  getDisciplinaryStats: () => apiService.getDisciplinaryStats(),
  generateDisciplinaryReport: (params: any) => apiService.generateDisciplinaryReport(params),
  getEmployeeDisciplinaryHistory: (employeeId: string) => apiService.getEmployeeDisciplinaryHistory(employeeId),
  
  // Follow-ups
  getUpcomingFollowUps: (days?: number) => apiService.getUpcomingFollowUps(days),
  markFollowUpComplete: (actionId: string, followUpNotes: string) => apiService.markFollowUpComplete(actionId, followUpNotes),
};

// Reports Service (Senior HR Manager Only)
export const reportsService = {
  // Report Configuration Management
  getReportConfigs: (params?: any) => apiService.getReportConfigs(params),
  getReportConfig: (id: string) => apiService.getReportConfig(id),
  createReportConfig: (data: any) => apiService.createReportConfig(data),
  updateReportConfig: (id: string, data: any) => apiService.updateReportConfig(id, data),
  deleteReportConfig: (id: string) => apiService.deleteReportConfig(id),
  
  // Report Generation
  generateReport: (configId: string, parameters: any, format: string) => apiService.generateReport(configId, parameters, format),
  getReportGenerations: (params?: any) => apiService.getReportGenerations(params),
  getReportGeneration: (id: string) => apiService.getReportGeneration(id),
  cancelReportGeneration: (id: string) => apiService.cancelReportGeneration(id),
  downloadReport: (generationId: string) => apiService.downloadReport(generationId),
  
  // Analytics and Templates
  getReportAnalytics: () => apiService.getReportAnalytics(),
  getReportTemplates: (category?: string) => apiService.getReportTemplates(category),
  createReportTemplate: (data: any) => apiService.createReportTemplate(data),
  updateReportTemplate: (id: string, data: any) => apiService.updateReportTemplate(id, data),
  deleteReportTemplate: (id: string) => apiService.deleteReportTemplate(id),
  
  // Scheduling
  scheduleReport: (configId: string, schedule: any) => apiService.scheduleReport(configId, schedule),
  updateReportSchedule: (configId: string, schedule: any) => apiService.updateReportSchedule(configId, schedule),
  deleteReportSchedule: (configId: string) => apiService.deleteReportSchedule(configId),
  getScheduledReports: () => apiService.getScheduledReports(),
  
  // Preview and Export
  previewReport: (configId: string, parameters: any) => apiService.previewReport(configId, parameters),
  exportReportData: (configId: string, parameters: any, format: string) => apiService.exportReportData(configId, parameters, format),
  shareReport: (generationId: string, recipients: string[], message?: string) => apiService.shareReport(generationId, recipients, message),
  
  // Dashboards
  getReportDashboards: () => apiService.getReportDashboards(),
  createReportDashboard: (data: any) => apiService.createReportDashboard(data),
  updateReportDashboard: (id: string, data: any) => apiService.updateReportDashboard(id, data),

  // Employee Reports
  generateEmployeeReport: (request: any) => apiService.generateEmployeeReport(request),
  getEmployeeReportData: (employeeId: string) => apiService.getEmployeeReportData(employeeId),
  getEmployeeReportGenerations: (params?: any) => apiService.getEmployeeReportGenerations(params),
  getEmployeeReportGeneration: (id: string) => apiService.getEmployeeReportGeneration(id),
  downloadEmployeeReport: (generationId: string) => apiService.downloadEmployeeReport(generationId),
  getEmployeeReportTemplates: () => apiService.getEmployeeReportTemplates(),
  previewEmployeeReport: (request: any) => apiService.previewEmployeeReport(request),
};

export default apiService;