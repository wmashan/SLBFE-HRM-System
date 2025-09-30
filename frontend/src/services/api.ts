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

// Retirement Management Types
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

export default apiService;