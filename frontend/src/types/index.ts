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
  icon?: React.ComponentType<{ className?: string; }>;
  children?: NavigationItem[];
  roles?: UserRole[];
}

// Disciplinary Actions Types
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

// Reports Types
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
  accessLevel: 'hr' | 'manager' | 'all';
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ReportType = 
  | 'employee_summary'
  | 'comprehensive_employee_report'
  | 'attendance_analysis'
  | 'salary_analysis'
  | 'medical_claims_summary'
  | 'recruitment_metrics'
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

// Comprehensive Employee Report Types
export interface EmployeeReportData {
  employeeInfo: EmployeePersonalDetails;
  employmentHistory: EmploymentRecord[];
  transferHistory: TransferRecord[];
  disciplinaryHistory: DisciplinaryAction[];
  serviceRecord: ServiceSummary;
  performanceHistory: PerformanceRecord[];
  salaryHistory: SalaryRecord[];
  leaveHistory: LeaveRecord[];
  trainingHistory: TrainingRecord[];
  certifications: Certification[];
  emergencyContacts: EmergencyContact[];
  dependents: Dependent[];
  bankDetails?: BankDetails;
  documentAttachments: DocumentAttachment[];
}

export interface EmployeePersonalDetails {
  id: string;
  employeeId: string;
  fullName: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
  nationality: string;
  ethnicity?: string;
  religion?: string;
  bloodGroup?: string;
  idNumber: string;
  idType: 'nic' | 'passport' | 'driving_license';
  passportNumber?: string;
  permanentAddress: Address;
  currentAddress: Address;
  personalPhone: string;
  personalEmail: string;
  workPhone?: string;
  workEmail: string;
  profilePicture?: string;
  joinDate: Date;
  confirmationDate?: Date;
  probationPeriod?: number;
  status: EmployeeStatus;
  terminationDate?: Date;
  terminationReason?: string;
  rehireEligible: boolean;
}

export interface Address {
  street: string;
  city: string;
  district: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface EmploymentRecord {
  id: string;
  startDate: Date;
  endDate?: Date;
  position: string;
  department: string;
  branch: string;
  reportingManager: string;
  workType: 'full_time' | 'part_time' | 'contract' | 'temporary' | 'intern';
  employmentType: 'permanent' | 'temporary' | 'probation' | 'contract';
  salary: number;
  currency: string;
  benefits: string[];
  responsibilities: string[];
  isActive: boolean;
  reason?: string; // For position changes
}

export interface TransferRecord {
  id: string;
  transferDate: Date;
  effectiveDate: Date;
  fromBranch: string;
  toBranch: string;
  fromDepartment: string;
  toDepartment: string;
  fromPosition: string;
  toPosition: string;
  transferType: 'promotion' | 'lateral' | 'demotion' | 'departmental' | 'geographical';
  reason: string;
  requestedBy: string;
  approvedBy: string;
  salaryChange?: number;
  benefitsChange?: string[];
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  documents: string[];
}

export interface ServiceSummary {
  totalServicePeriod: ServicePeriod;
  currentPositionPeriod: ServicePeriod;
  divisionalServicePeriods: DivisionalServiceRecord[];
  branchServicePeriods: BranchServiceRecord[];
  departmentServicePeriods: DepartmentServiceRecord[];
  positionServicePeriods: PositionServiceRecord[];
  serviceBreaks: ServiceBreak[];
  totalWorkingDays: number;
  totalLeaveDays: number;
  totalAbsentDays: number;
  serviceAwards: ServiceAward[];
}

export interface ServicePeriod {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  startDate: Date;
  endDate?: Date;
}

export interface DivisionalServiceRecord {
  divisionName: string;
  startDate: Date;
  endDate?: Date;
  servicePeriod: ServicePeriod;
  positions: string[];
}

export interface BranchServiceRecord {
  branchName: string;
  branchCode: string;
  city: string;
  province: string;
  startDate: Date;
  endDate?: Date;
  servicePeriod: ServicePeriod;
  positions: string[];
  departments: string[];
}

export interface DepartmentServiceRecord {
  departmentName: string;
  startDate: Date;
  endDate?: Date;
  servicePeriod: ServicePeriod;
  positions: string[];
}

export interface PositionServiceRecord {
  positionTitle: string;
  level: string;
  startDate: Date;
  endDate?: Date;
  servicePeriod: ServicePeriod;
  department: string;
  branch: string;
  reportingManager: string;
}

export interface ServiceBreak {
  id: string;
  startDate: Date;
  endDate: Date;
  duration: ServicePeriod;
  reason: string;
  type: 'leave_without_pay' | 'suspension' | 'medical_leave' | 'maternity_leave' | 'study_leave' | 'other';
  approved: boolean;
  paidLeave: boolean;
}

export interface ServiceAward {
  id: string;
  awardName: string;
  awardDate: Date;
  reason: string;
  monetaryValue?: number;
  certificate?: string;
  awardedBy: string;
}

export interface PerformanceRecord {
  id: string;
  evaluationPeriod: string;
  evaluationDate: Date;
  overallRating: number;
  maxRating: number;
  evaluatedBy: string;
  objectives: PerformanceObjective[];
  competencies: CompetencyRating[];
  strengths: string[];
  areasForImprovement: string[];
  developmentPlan: string[];
  employeeComments?: string;
  managerComments: string;
  goals: PerformanceGoal[];
  achievements: Achievement[];
}

export interface PerformanceObjective {
  objective: string;
  weight: number;
  rating: number;
  comments: string;
}

export interface CompetencyRating {
  competency: string;
  rating: number;
  comments?: string;
}

export interface PerformanceGoal {
  goal: string;
  targetDate: Date;
  status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
  completionPercentage: number;
}

export interface Achievement {
  title: string;
  description: string;
  date: Date;
  recognitionReceived?: string;
}

export interface SalaryRecord {
  id: string;
  effectiveDate: Date;
  basicSalary: number;
  allowances: SalaryAllowance[];
  deductions: SalaryDeduction[];
  grossSalary: number;
  netSalary: number;
  currency: string;
  payrollCycle: 'monthly' | 'bi_weekly' | 'weekly';
  changeReason?: string;
  approvedBy: string;
  payrollMonth?: string;
  bonuses?: Bonus[];
  overtime?: OvertimeRecord[];
}

export interface SalaryAllowance {
  type: string;
  amount: number;
  percentage?: number;
  taxable: boolean;
}

export interface SalaryDeduction {
  type: string;
  amount: number;
  percentage?: number;
  mandatory: boolean;
}

export interface Bonus {
  type: string;
  amount: number;
  reason: string;
  date: Date;
  taxable: boolean;
}

export interface OvertimeRecord {
  date: Date;
  hours: number;
  rate: number;
  totalAmount: number;
  approved: boolean;
}

export interface LeaveRecord {
  id: string;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  numberOfDays: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  appliedDate: Date;
  approvedBy?: string;
  approvedDate?: Date;
  rejectionReason?: string;
  emergencyContact?: string;
  documents?: string[];
}

export interface TrainingRecord {
  id: string;
  trainingName: string;
  trainingProvider: string;
  trainingType: 'internal' | 'external' | 'online' | 'workshop' | 'certification';
  startDate: Date;
  endDate: Date;
  duration: number;
  cost?: number;
  status: 'enrolled' | 'in_progress' | 'completed' | 'cancelled' | 'failed';
  completionPercentage: number;
  certificateReceived: boolean;
  certificateUrl?: string;
  skills: string[];
  feedback?: string;
  rating?: number;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  address: Address;
  isPrimary: boolean;
}

export interface Dependent {
  id: string;
  name: string;
  relationship: 'spouse' | 'child' | 'parent' | 'sibling' | 'other';
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  idNumber?: string;
  isDependent: boolean;
  medicalInsuranceCovered: boolean;
  educationSupport?: boolean;
}

export interface BankDetails {
  bankName: string;
  branchName: string;
  accountNumber: string;
  accountHolderName: string;
  swiftCode?: string;
  routingNumber?: string;
  isPrimary: boolean;
}

export interface DocumentAttachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: Date;
  category: DocumentCategory;
  description?: string;
  isConfidential: boolean;
  uploadedBy: string;
  url: string;
}

export type DocumentCategory = 
  | 'identification'
  | 'educational_certificates'
  | 'professional_certificates'
  | 'medical_records'
  | 'contracts'
  | 'performance_reviews'
  | 'disciplinary_records'
  | 'training_certificates'
  | 'tax_documents'
  | 'other';

// Admin-specific Types
export interface SystemConfig {
  id: string;
  category: SystemConfigCategory;
  key: string;
  value: string | number | boolean;
  description: string;
  isEditable: boolean;
  lastModified: Date;
  modifiedBy: string;
}

export type SystemConfigCategory = 
  | 'general'
  | 'security'
  | 'email'
  | 'backup'
  | 'performance'
  | 'integration'
  | 'compliance';

export interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  totalEmployees: number;
  totalBranches: number;
  totalDepartments: number;
  systemUptime: number;
  lastBackup: Date;
  storageUsed: number;
  storageTotal: number;
  recentActivities: AdminActivity[];
  securityAlerts: SecurityAlert[];
}

export interface AdminActivity {
  id: string;
  action: AdminActionType;
  performedBy: string;
  targetResource: string;
  resourceId: string;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
  details?: Record<string, any>;
}

export type AdminActionType = 
  | 'user_created'
  | 'user_updated'
  | 'user_deleted'
  | 'user_activated'
  | 'user_deactivated'
  | 'role_assigned'
  | 'role_revoked'
  | 'system_config_updated'
  | 'backup_created'
  | 'backup_restored'
  | 'security_policy_updated'
  | 'audit_log_accessed'
  | 'bulk_operation'
  | 'data_export'
  | 'data_import';

export interface SecurityAlert {
  id: string;
  type: SecurityAlertType;
  severity: AlertSeverity;
  message: string;
  timestamp: Date;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
  details?: Record<string, any>;
}

export type SecurityAlertType = 
  | 'failed_login_attempts'
  | 'unauthorized_access'
  | 'suspicious_activity'
  | 'data_breach_attempt'
  | 'system_vulnerability'
  | 'compliance_violation';

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface UserManagementData {
  users: AdminUserView[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters: UserFilter;
  statistics: UserStatistics;
}

export interface AdminUserView extends User {
  lastActivity: Date;
  sessionsActive: number;
  totalLogins: number;
  accountLocked: boolean;
  passwordLastChanged: Date;
  twoFactorEnabled: boolean;
  permissions: Permission[];
  groups: UserGroup[];
}

export interface UserFilter {
  role?: UserRole;
  status?: 'active' | 'inactive' | 'locked';
  department?: string;
  branch?: string;
  createdAfter?: Date;
  createdBefore?: Date;
  lastLoginAfter?: Date;
  lastLoginBefore?: Date;
}

export interface UserStatistics {
  totalUsers: number;
  usersByRole: Record<UserRole, number>;
  activeUsers: number;
  lockedUsers: number;
  newUsersThisMonth: number;
  loginActivity: LoginActivityStats;
}

export interface LoginActivityStats {
  todayLogins: number;
  weeklyLogins: number;
  monthlyLogins: number;
  averageSessionDuration: number;
  peakHours: Array<{ hour: number; logins: number; }>;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: PermissionAction;
  granted: boolean;
  inheritedFrom?: string;
}

export type PermissionAction = 'create' | 'read' | 'update' | 'delete' | 'execute' | 'approve';

export interface UserGroup {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  memberCount: number;
  createdAt: Date;
}

export interface SystemAudit {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId?: string;
  previousValue?: any;
  newValue?: any;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  success: boolean;
  errorMessage?: string;
}

export interface BackupConfig {
  id: string;
  name: string;
  description: string;
  schedule: BackupSchedule;
  retention: BackupRetention;
  includeFiles: boolean;
  includeDatabase: boolean;
  encryptBackup: boolean;
  storageLocation: BackupStorageType;
  isActive: boolean;
  lastBackup?: Date;
  nextScheduledBackup?: Date;
  status: BackupStatus;
}

export interface BackupSchedule {
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string; // HH:mm format
  dayOfWeek?: number; // For weekly backups
  dayOfMonth?: number; // For monthly backups
  timezone: string;
}

export interface BackupRetention {
  keepDaily: number;
  keepWeekly: number;
  keepMonthly: number;
  keepYearly: number;
}

export type BackupStorageType = 'local' | 'cloud' | 'network';
export type BackupStatus = 'idle' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface AdminDashboardStats {
  systemHealth?: SystemHealth;
  userActivity: UserActivitySummary;
  securityOverview?: SecurityOverview;
  recentActions: AdminActivity[];
  systemAlerts: SystemAlert[];
  performanceMetrics?: PerformanceMetrics;
}

export interface SystemHealth {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  databaseStatus: 'healthy' | 'warning' | 'error';
  serviceStatus: ServiceStatus[];
  uptime: number;
  lastHealthCheck: Date;
}

export interface ServiceStatus {
  name: string;
  status: 'running' | 'stopped' | 'error';
  lastChecked: Date;
  responseTime?: number;
}

export interface UserActivitySummary {
  activeUsers: number;
  onlineUsers: number;
  totalSessions: number;
  avgSessionDuration: number;
  peakConcurrentUsers: number;
  activityTrend: Array<{ date: string; users: number; }>;
}

export interface SecurityOverview {
  totalAlerts: number;
  criticalAlerts: number;
  resolvedToday: number;
  pendingAlerts: number;
  failedLogins: number;
  suspiciousActivities: number;
  securityScore: number;
}

export interface SystemAlert {
  id: string;
  type: SystemAlertType;
  severity: AlertSeverity;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  acknowledgedBy?: string;
  details?: Record<string, any>;
}

export type SystemAlertType = 
  | 'system_error'
  | 'performance_degradation'
  | 'storage_full'
  | 'backup_failed'
  | 'security_breach'
  | 'service_unavailable'
  | 'maintenance_required';

export interface PerformanceMetrics {
  responseTime: number;
  throughput: number;
  errorRate: number;
  concurrentUsers: number;
  databaseConnections: number;
  cacheHitRate: number;
  queueSize: number;
}

export interface BulkUserOperation {
  id: string;
  operation: BulkOperationType;
  targetUsers: string[];
  parameters: Record<string, any>;
  status: BulkOperationStatus;
  progress: number;
  totalUsers: number;
  processedUsers: number;
  successfulOperations: number;
  failedOperations: number;
  errors: Array<{ userId: string; error: string; }>;
  startedAt: Date;
  completedAt?: Date;
  initiatedBy: string;
}

export type BulkOperationType = 
  | 'activate_users'
  | 'deactivate_users'
  | 'reset_passwords'
  | 'assign_role'
  | 'revoke_role'
  | 'delete_users'
  | 'send_notification'
  | 'export_data';

export type BulkOperationStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

// Employee Report Generation Types
export interface EmployeeReportRequest {
  employeeId: string;
  reportType: EmployeeReportType;
  includeConfidential: boolean;
  includeSalaryDetails: boolean;
  includePerformanceHistory: boolean;
  includeMedicalHistory: boolean;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
  outputFormat: OutputFormat;
  sections: EmployeeReportSection[];
}

export type EmployeeReportType = 
  | 'comprehensive'
  | 'basic_info'
  | 'service_record'
  | 'performance_summary'
  | 'medical_claims_summary'
  | 'salary_history'
  | 'custom';

export type EmployeeReportSection = 
  | 'personal_details'
  | 'employment_history'
  | 'service_summary'
  | 'transfer_history'
  | 'medical_claims_history'
  | 'performance_history'
  | 'salary_history'
  | 'leave_history'
  | 'training_history'
  | 'certifications'
  | 'emergency_contacts'
  | 'dependents'
  | 'documents';

export interface EmployeeReportGeneration extends ReportGeneration {
  employeeId: string;
  employeeName: string;
  reportSections: EmployeeReportSection[];
  confidentialDataIncluded: boolean;
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

// Backup & Restore Types
export interface BackupItem {
  id: string;
  name: string;
  type: BackupType;
  size: string;
  createdAt: Date;
  status: BackupItemStatus;
  description?: string;
  filePath: string;
  isAutomatic: boolean;
  restorePoints: RestorePoint[];
  checksum?: string;
  encrypted?: boolean;
  compressionRatio?: number;
  createdBy?: string;
}

export type BackupType = 'full' | 'database' | 'files' | 'configuration' | 'incremental';

export type BackupItemStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled' | 'expired';

export interface RestorePoint {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  backupId: string;
  systemVersion: string;
  databaseVersion: string;
  configVersion: string;
  canRestore: boolean;
  restoreEstimatedTime: number; // in minutes
  dependencies: string[];
}

export interface BackupScheduleConfig {
  id: string;
  name: string;
  backupType: BackupType;
  schedule: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
    time: string; // HH:mm format
    dayOfWeek?: number; // 0-6 for weekly
    dayOfMonth?: number; // 1-31 for monthly
    customCron?: string;
    timezone: string;
  };
  retention: {
    keepDaily: number;
    keepWeekly: number;
    keepMonthly: number;
    keepYearly: number;
    maxSize: number; // in GB
  };
  options: {
    compress: boolean;
    encrypt: boolean;
    verify: boolean;
    includeFiles: boolean;
    includeDatabase: boolean;
    includeConfiguration: boolean;
    excludePatterns: string[];
  };
  notifications: {
    onSuccess: boolean;
    onFailure: boolean;
    recipients: string[];
  };
  isActive: boolean;
  lastRun?: Date;
  nextRun?: Date;
  status: 'active' | 'paused' | 'error';
  createdAt: Date;
  updatedAt: Date;
}

export interface BackupRestoreOperation {
  id: string;
  type: 'backup' | 'restore';
  backupId?: string;
  restorePointId?: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number; // 0-100
  startTime: Date;
  endTime?: Date;
  estimatedCompletion?: Date;
  currentStep: string;
  totalSteps: number;
  completedSteps: number;
  errorMessage?: string;
  warnings: string[];
  logs: BackupOperationLog[];
  performedBy: string;
  settings: {
    verifyIntegrity: boolean;
    createRestorePoint: boolean;
    notifyOnCompletion: boolean;
  };
}

export interface BackupOperationLog {
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  component: string;
  details?: any;
}

export interface BackupStorageInfo {
  totalSpace: number;
  usedSpace: number;
  availableSpace: number;
  backupCount: number;
  oldestBackup?: Date;
  newestBackup?: Date;
  compressionRatio: number;
  storageLocations: StorageLocation[];
}

export interface StorageLocation {
  id: string;
  name: string;
  type: 'local' | 'network' | 'cloud';
  path: string;
  isDefault: boolean;
  isAvailable: boolean;
  freeSpace?: number;
  totalSpace?: number;
  connectionStatus: 'connected' | 'disconnected' | 'error';
  lastChecked: Date;
}

export interface BackupVerification {
  id: string;
  backupId: string;
  verificationDate: Date;
  status: 'passed' | 'failed' | 'warning';
  checksumMatch: boolean;
  filesVerified: number;
  totalFiles: number;
  issues: VerificationIssue[];
  verifiedBy: string;
  verificationTime: number; // in seconds
}

export interface VerificationIssue {
  type: 'checksum_mismatch' | 'file_missing' | 'corruption_detected' | 'access_denied';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  filePath?: string;
  recommendation: string;
}

// Document Template Types for Admin Management
export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: DocumentTemplateCategory;
  fileType: 'docx' | 'pdf' | 'html' | 'txt';
  template: string; // Template content or file path
  placeholders: TemplatePlaceholder[];
  isActive: boolean;
  isDefault: boolean;
  version: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastModifiedBy: string;
  usage: {
    totalUsed: number;
    lastUsed?: Date;
  };
  approvalRequired: boolean;
  tags: string[];
}

export type DocumentTemplateCategory = 
  | 'employment_letters'
  | 'leave_letters'
  | 'transfer_letters'
  | 'medical_letters'
  | 'salary_letters'
  | 'retirement_letters'
  | 'disciplinary_letters'
  | 'training_certificates'
  | 'general_correspondence'
  | 'forms'
  | 'reports'
  | 'policies'
  | 'other';

export interface TemplatePlaceholder {
  id: string;
  key: string;
  label: string;
  description: string;
  type: 'text' | 'number' | 'date' | 'email' | 'phone' | 'address' | 'boolean' | 'dropdown';
  required: boolean;
  defaultValue?: string;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
  options?: string[]; // For dropdown type
}

export interface GeneratedDocument {
  id: string;
  templateId: string;
  templateName: string;
  generatedFor: string; // Employee ID or name
  generatedBy: string;
  generatedAt: Date;
  filePath: string;
  fileName: string;
  fileSize: number;
  placeholderValues: Record<string, any>;
  status: 'draft' | 'final' | 'sent' | 'archived';
  downloadCount: number;
  lastDownloaded?: Date;
}

export interface DocumentTemplateStats {
  totalTemplates: number;
  activeTemplates: number;
  categoryBreakdown: Record<DocumentTemplateCategory, number>;
  recentlyUsed: DocumentTemplate[];
  mostUsed: DocumentTemplate[];
  totalDocumentsGenerated: number;
  documentsGeneratedThisMonth: number;
}

// System Document Types for Admin Document Management
export interface SystemDocument {
  id: string;
  name: string;
  description: string;
  category: SystemDocumentCategory;
  fileType: 'pdf' | 'docx' | 'xlsx' | 'doc' | 'xls' | 'jpg' | 'jpeg' | 'png' | 'txt';
  fileName: string;
  filePath: string;
  fileSize: number; // in bytes
  isActive: boolean;
  accessLevel: DocumentAccessLevel;
  createdAt: Date;
  updatedAt: Date;
  uploadedBy: string;
  lastModifiedBy: string;
  downloadCount: number;
  lastDownloaded?: Date;
  tags: string[];
  version: string;
  isSystemForm: boolean; // true for forms like HR/F/07, HR/F/08
  formCode?: string; // e.g., "HR/F/07", "HR/F/08"
}

export type SystemDocumentCategory = 
  | 'hr_forms'
  | 'policies_procedures'
  | 'employee_handbook'
  | 'forms_applications'
  | 'training_materials'
  | 'compliance_documents'
  | 'hr_guidelines'
  | 'safety_documents'
  | 'benefits_information'
  | 'organizational_charts'
  | 'announcements'
  | 'reference_materials'
  | 'templates'
  | 'other';

export type DocumentAccessLevel = 
  | 'all_employees'
  | 'hr_only'
  | 'admin_only'
  | 'managers_only'
  | 'restricted';

export interface DocumentStats {
  totalDocuments: number;
  activeDocuments: number;
  categoryBreakdown: Record<SystemDocumentCategory, number>;
  recentlyUploaded: SystemDocument[];
  mostDownloaded: SystemDocument[];
  totalDownloads: number;
  documentsUploadedThisMonth: number;
  storageUsed: number; // in bytes
  accessLevelBreakdown: Record<DocumentAccessLevel, number>;
}

export interface DocumentUploadData {
  name: string;
  description: string;
  category: SystemDocumentCategory;
  accessLevel: DocumentAccessLevel;
  file: File;
  tags: string[];
  isSystemForm: boolean;
  formCode?: string;
}

// Task Assignment and Permission Management Types
export type HRFeature = 
  | 'overview'
  | 'employees'
  | 'medical_claims'
  | 'retirement'
  | 'transfer'
  | 'leave_management'
  | 'attendance'
  | 'recruitment'
  | 'training'
  | 'performance'
  | 'payroll'
  | 'reports'
  | 'documents';

export type TaskAssignmentType = 
  | 'medical_officer'
  | 'transfer_officer'
  | 'retirement_officer'
  | 'recruitment_officer'
  | 'training_coordinator'
  | 'payroll_officer'
  | 'general_hr'
  | 'custom';

export interface HRTaskAssignment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  taskType: TaskAssignmentType;
  taskDescription: string;
  assignedFeatures: HRFeature[];
  isActive: boolean;
  assignedBy: string;
  assignedDate: Date;
  lastModified: Date;
  notes?: string;
}

export interface FeaturePermission {
  feature: HRFeature;
  label: string;
  description: string;
  icon: string;
  defaultForRoles: TaskAssignmentType[];
  dependencies?: HRFeature[];
}

export interface TaskTemplate {
  id: string;
  name: string;
  type: TaskAssignmentType;
  description: string;
  defaultFeatures: HRFeature[];
  isSystemTemplate: boolean;
}

export interface UserPermissionSummary {
  userId: string;
  userName: string;
  userEmail: string;
  taskAssignments: HRTaskAssignment[];
  effectiveFeatures: HRFeature[];
  lastLogin?: Date;
  isActive: boolean;
}