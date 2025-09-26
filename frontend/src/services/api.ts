// API Service Layer for SLBFE HRM System

import { ApiResponse, PaginatedResponse, User, LoginCredentials, RegisterData } from '../types';

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
  }): Promise<PaginatedResponse<User>> {
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

export default apiService;