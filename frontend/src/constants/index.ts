// Application Constants
export const APP_NAME = 'SLBFE HR Management System';
export const APP_VERSION = '1.0.0';
export const APP_DESCRIPTION = 'Human Resource Management System for Sri Lanka Bureau of Foreign Employment';

// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
export const API_VERSION = 'v1';

// Authentication
export const AUTH_TOKEN_KEY = 'slbfe_auth_token';
export const REFRESH_TOKEN_KEY = 'slbfe_refresh_token';
export const USER_DATA_KEY = 'slbfe_user_data';
export const TOKEN_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/create-account',
  DASHBOARD: '/dashboard',
  EMPLOYEES: '/employees',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  REPORTS: '/reports',
  TRAINING: '/training',
  BRANCHES: '/branches',
  DEPARTMENTS: '/departments',
} as const;

// User Roles
export const USER_ROLES = {
  EMPLOYEE: 'employee',
  HR: 'hr',
  TRAINING_COORDINATOR: 'training_coordinator',
  BRANCH_MANAGER: 'branch_manager',
  PROGRAM_MANAGER: 'program_manager',
  ADMIN: 'admin',
} as const;

// SLBFE Specific Constants
export const SLBFE_PROGRAMS = {
  KOREA_EPS: 'korea_eps',
  JAPAN_TECHNICAL: 'japan_technical',
  MIDDLE_EAST: 'middle_east',
  SINGAPORE: 'singapore',
  MALAYSIA: 'malaysia',
  ITALY: 'italy',
} as const;

export const EMPLOYEE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ON_LEAVE: 'on_leave',
  TERMINATED: 'terminated',
} as const;

// Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 20,
  NAME_MAX_LENGTH: 100,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[0-9+\-\s()]+$/,
  EMPLOYEE_ID_REGEX: /^SLBFE\d{4,}$/,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
} as const;

// Sri Lankan Provinces and Districts
export const SRI_LANKAN_LOCATIONS = {
  PROVINCES: [
    'Western',
    'Central',
    'Southern',
    'Northern',
    'Eastern',
    'North Western',
    'North Central',
    'Uva',
    'Sabaragamuwa',
  ],
  DISTRICTS: {
    Western: ['Colombo', 'Gampaha', 'Kalutara'],
    Central: ['Kandy', 'Matale', 'Nuwara Eliya'],
    Southern: ['Galle', 'Matara', 'Hambantota'],
    Northern: ['Jaffna', 'Kilinochchi', 'Mannar', 'Mullaitivu', 'Vavuniya'],
    Eastern: ['Ampara', 'Batticaloa', 'Trincomalee'],
    'North Western': ['Kurunegala', 'Puttalam'],
    'North Central': ['Anuradhapura', 'Polonnaruwa'],
    Uva: ['Badulla', 'Monaragala'],
    Sabaragamuwa: ['Ratnapura', 'Kegalle'],
  },
} as const;

// Theme Colors
export const THEME = {
  PRIMARY: '#3B82F6', // Blue
  SECONDARY: '#6366F1', // Indigo
  SUCCESS: '#10B981', // Green
  WARNING: '#F59E0B', // Yellow
  ERROR: '#EF4444', // Red
  INFO: '#06B6D4', // Cyan
  GRAY: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  FULL: 'EEEE, MMMM do, yyyy',
  TIME: 'HH:mm:ss',
  DATETIME: 'MMM dd, yyyy HH:mm',
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  THEME: 'slbfe_theme',
  LANGUAGE: 'slbfe_language',
  SIDEBAR_COLLAPSED: 'slbfe_sidebar_collapsed',
  TABLE_PREFERENCES: 'slbfe_table_preferences',
} as const;