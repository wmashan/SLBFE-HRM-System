// User and Authentication Types
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  profilePicture?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 
  | 'employee' 
  | 'hr' 
  | 'senior_hr_manager'
  | 'training_coordinator' 
  | 'branch_manager' 
  | 'program_manager' 
  | 'admin';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Employee Management Types
export interface Employee extends User {
  employeeId: string;
  department: Department;
  position: string;
  branch: Branch;
  manager?: Employee;
  joinDate: Date;
  salary?: number;
  status: EmployeeStatus;
  skills: string[];
  certifications: Certification[];
}

export type EmployeeStatus = 'active' | 'inactive' | 'on_leave' | 'terminated';

export interface Department {
  id: string;
  name: string;
  description: string;
  headOfDepartment: Employee;
  budget?: number;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  district: string;
  province: string;
  phone: string;
  email: string;
  manager: Employee;
  employees: Employee[];
}

export interface Certification {
  id: string;
  name: string;
  issuedBy: string;
  issuedDate: Date;
  expiryDate?: Date;
  certificateUrl?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'textarea' | 'date' | 'number';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string; }[];
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean | string;
  };
}

export interface FormState<T = Record<string, any>> {
  data: T;
  errors: Record<keyof T, string>;
  isValid: boolean;
  isSubmitting: boolean;
}

// Navigation Types
export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: React.ComponentType;
  children?: NavigationItem[];
  roles?: UserRole[];
}

// Disciplinary Actions Types (Senior HR Manager only)
export interface DisciplinaryAction {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  branch: string;
  actionType: DisciplinaryActionType;
  severity: DisciplinarySeverity;
  incidentDate: string;
  reportedDate: string;
  reportedBy: string;
  description: string;
  investigationDetails?: string;
  witnessStatements?: string[];
  evidenceAttachments?: string[];
  actionTaken: string;
  startDate: string;
  endDate?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  status: DisciplinaryStatus;
  approvedBy?: string;
  approvalDate?: string;
  employeeResponse?: string;
  appealSubmitted: boolean;
  appealDate?: string;
  appealOutcome?: string;
  finalDecision: string;
  impactOnRecord: RecordImpact;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export type DisciplinaryActionType = 
  | 'verbal_warning'
  | 'written_warning'
  | 'final_warning'
  | 'suspension'
  | 'demotion'
  | 'salary_reduction'
  | 'termination'
  | 'counseling'
  | 'training_mandatory'
  | 'transfer';

export type DisciplinarySeverity = 'minor' | 'moderate' | 'major' | 'severe';

export type DisciplinaryStatus = 
  | 'investigation'
  | 'pending_approval'
  | 'approved'
  | 'implemented'
  | 'under_appeal'
  | 'appeal_resolved'
  | 'completed'
  | 'dismissed';

export type RecordImpact = 'temporary' | 'permanent' | 'expungeable' | 'none';

export interface DisciplinaryActionForm {
  employeeId: string;
  actionType: DisciplinaryActionType;
  severity: DisciplinarySeverity;
  incidentDate: string;
  description: string;
  investigationDetails?: string;
  actionTaken: string;
  startDate: string;
  endDate?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  employeeResponse?: string;
  finalDecision: string;
  impactOnRecord: RecordImpact;
}

export interface DisciplinaryStats {
  totalActions: number;
  pendingInvestigation: number;
  activeWarnings: number;
  suspensionsThisYear: number;
  terminationsThisYear: number;
  appealsInProgress: number;
  actionsByType: Record<DisciplinaryActionType, number>;
  actionsBySeverity: Record<DisciplinarySeverity, number>;
}

// Reports Types (Senior HR Manager only)
export interface ReportConfig {
  id: string;
  name: string;
  type: ReportType;
  category: ReportCategory;
  description: string;
  parameters: ReportParameter[];
  defaultFilters?: Record<string, any>;
  schedule?: ReportSchedule;
  outputFormats: OutputFormat[];
  accessLevel: 'senior_hr_manager' | 'hr' | 'manager' | 'all';
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ReportType = 
  | 'employee_summary'
  | 'attendance_analysis'
  | 'salary_analysis'
  | 'disciplinary_summary'
  | 'recruitment_metrics'
  | 'loan_analysis'
  | 'retirement_forecast'
  | 'performance_analytics'
  | 'compliance_report'
  | 'custom_report';

export type ReportCategory = 
  | 'hr_analytics'
  | 'financial'
  | 'compliance'
  | 'operational'
  | 'strategic';

export type OutputFormat = 'pdf' | 'excel' | 'csv' | 'json' | 'chart';

export type ReportFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'on_demand';

export interface ReportParameter {
  name: string;
  label: string;
  type: 'date' | 'daterange' | 'select' | 'multiselect' | 'text' | 'number' | 'boolean';
  required: boolean;
  defaultValue?: any;
  options?: { value: string; label: string; }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
  };
}

export interface ReportSchedule {
  frequency: ReportFrequency;
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  time: string; // HH:mm format
  timezone: string;
  recipients: string[];
  isActive: boolean;
}

export interface ReportGeneration {
  id: string;
  configId: string;
  reportName: string;
  parameters: Record<string, any>;
  status: ReportStatus;
  format: OutputFormat;
  progress?: number;
  startTime: Date;
  endTime?: Date;
  fileUrl?: string;
  fileSize?: number;
  error?: string;
  generatedBy: string;
  scheduledRun: boolean;
}

export type ReportStatus = 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface ReportData {
  metadata: {
    reportName: string;
    generatedAt: Date;
    parameters: Record<string, any>;
    totalRecords: number;
    executionTime: number;
  };
  data: any[];
  charts?: ChartData[];
  summary?: Record<string, any>;
}

export interface ChartData {
  id: string;
  title: string;
  type: ChartType;
  data: any[];
  options?: any;
}

export type ChartType = 'bar' | 'line' | 'pie' | 'doughnut' | 'area' | 'scatter' | 'gauge';

export interface ReportDashboard {
  id: string;
  name: string;
  description: string;
  widgets: ReportWidget[];
  layout: DashboardLayout;
  refreshInterval?: number;
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
}

export interface ReportWidget {
  id: string;
  title: string;
  type: 'chart' | 'metric' | 'table' | 'text';
  position: { x: number; y: number; width: number; height: number; };
  config: any;
  dataSource: string;
  refreshRate?: number;
}

export interface DashboardLayout {
  columns: number;
  rowHeight: number;
  margin: [number, number];
  padding: [number, number];
}

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: ReportCategory;
  template: string; // HTML/template content
  variables: string[];
  styles?: string;
  isDefault: boolean;
  createdBy: string;
  createdAt: Date;
}

export interface ReportAnalytics {
  totalReportsGenerated: number;
  mostPopularReports: Array<{ reportId: string; name: string; count: number; }>;
  reportsGeneratedToday: number;
  reportsGeneratedThisWeek: number;
  reportsGeneratedThisMonth: number;
  averageGenerationTime: number;
  failureRate: number;
  storageUsed: number;
  scheduledReportsActive: number;
}

// Theme and UI Types
export interface Theme {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}