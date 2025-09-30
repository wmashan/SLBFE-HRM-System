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