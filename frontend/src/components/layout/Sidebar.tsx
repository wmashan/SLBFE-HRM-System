// Sidebar Component for SLBFE HRM System

import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  Building2, 
  Award, 
  BarChart3, 
  FileText, 
  Settings,
  Globe,
  Calendar,
  UserCheck,
  Shield,
  Database,
  Activity,
  Lock,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { NavigationItem } from '../../types';

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const getNavigationItems = (): NavigationItem[] => {
    const commonItems: NavigationItem[] = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        path: user?.role === 'admin' ? '/admin-dashboard' : user?.role === 'employee' ? '/employee-dashboard' : '/hr-dashboard',
        icon: Home,
        roles: ['employee', 'hr', 'senior_hr_manager', 'training_coordinator', 'branch_manager', 'program_manager', 'admin'],
      }
    ];

    // Add role-specific navigation items
    const roleBasedItems: NavigationItem[] = [];

    if (user?.role === 'admin') {
      roleBasedItems.push(
        {
          id: 'user-management',
          label: 'User Management',
          path: '/admin/users',
          icon: Users,
          roles: ['admin'],
        },
        {
          id: 'role-management',
          label: 'Role Management',
          path: '/admin/roles',
          icon: UserCheck,
          roles: ['admin'],
        },
        {
          id: 'system-config',
          label: 'System Config',
          path: '/admin/system',
          icon: Settings,
          roles: ['admin'],
        },
        {
          id: 'security-audit',
          label: 'Security & Audit',
          path: '/admin/security',
          icon: Shield,
          roles: ['admin'],
        },
        {
          id: 'system-monitoring',
          label: 'System Monitoring',
          path: '/admin/monitoring',
          icon: Activity,
          roles: ['admin'],
        },
        {
          id: 'backup-restore',
          label: 'Backup & Restore',
          path: '/admin/backup',
          icon: Database,
          roles: ['admin'],
        },
        {
          id: 'access-control',
          label: 'Access Control',
          path: '/admin/access',
          icon: Lock,
          roles: ['admin'],
        }
      );
    }

    // Common HR and business items for non-admin roles
    if (user?.role !== 'admin') {
      roleBasedItems.push(
        {
          id: 'employees',
          label: 'Employees',
          path: '/employees',
          icon: Users,
          roles: ['hr', 'senior_hr_manager', 'branch_manager', 'program_manager'],
        },
        {
          id: 'departments',
          label: 'Departments',
          path: '/departments',
          icon: Building2,
          roles: ['hr', 'senior_hr_manager', 'branch_manager', 'program_manager'],
        },
        {
          id: 'branches',
          label: 'Branches',
          path: '/branches',
          icon: Globe,
          roles: ['hr', 'senior_hr_manager', 'program_manager'],
        },
        {
          id: 'training',
          label: 'Training Programs',
          path: '/training',
          icon: Award,
          roles: ['training_coordinator', 'hr', 'senior_hr_manager', 'program_manager'],
        },
        {
          id: 'attendance',
          label: 'Attendance',
          path: '/attendance',
          icon: Calendar,
          roles: ['hr', 'senior_hr_manager', 'branch_manager', 'program_manager'],
        },
        {
          id: 'recruitment',
          label: 'Recruitment',
          path: '/recruitment',
          icon: UserCheck,
          roles: ['hr', 'senior_hr_manager', 'program_manager'],
        },
        {
          id: 'reports',
          label: 'Reports',
          path: '/reports',
          icon: BarChart3,
          roles: ['hr', 'senior_hr_manager', 'branch_manager', 'program_manager'],
        }
      );
    }

    // Add items available to all roles
    roleBasedItems.push(
      {
        id: 'documents',
        label: 'Documents',
        path: '/documents',
        icon: FileText,
        roles: ['employee', 'hr', 'senior_hr_manager', 'training_coordinator', 'branch_manager', 'program_manager', 'admin'],
      }
    );

    // Settings for admins and HR
    if (user?.role === 'admin' || user?.role === 'hr' || user?.role === 'senior_hr_manager') {
      roleBasedItems.push({
        id: 'settings',
        label: user?.role === 'admin' ? 'System Settings' : 'Settings',
        path: user?.role === 'admin' ? '/admin/settings' : '/settings',
        icon: Settings,
        roles: ['hr', 'senior_hr_manager', 'admin'],
      });
    }

    return [...commonItems, ...roleBasedItems];
  };

  const navigationItems = getNavigationItems();

  const hasAccess = (item: NavigationItem): boolean => {
    if (!item.roles || !user?.role) return true;
    return item.roles.includes(user.role);
  };

  return (
    <aside className="bg-white shadow-sm border-r border-gray-200 w-64 min-h-screen">
      <nav className="p-4 space-y-2">
        {navigationItems.filter(hasAccess).map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-r-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`
            }
          >
            {item.icon && <item.icon className="w-5 h-5 mr-3" />}
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;