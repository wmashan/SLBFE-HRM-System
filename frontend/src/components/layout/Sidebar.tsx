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
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { NavigationItem } from '../../types';

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      icon: Home,
      roles: ['employee', 'hr', 'training_coordinator', 'branch_manager', 'program_manager', 'admin'],
    },
    {
      id: 'employees',
      label: 'Employees',
      path: '/employees',
      icon: Users,
      roles: ['hr', 'branch_manager', 'program_manager', 'admin'],
    },
    {
      id: 'departments',
      label: 'Departments',
      path: '/departments',
      icon: Building2,
      roles: ['hr', 'branch_manager', 'program_manager', 'admin'],
    },
    {
      id: 'branches',
      label: 'Branches',
      path: '/branches',
      icon: Globe,
      roles: ['hr', 'program_manager', 'admin'],
    },
    {
      id: 'training',
      label: 'Training Programs',
      path: '/training',
      icon: Award,
      roles: ['training_coordinator', 'hr', 'program_manager', 'admin'],
    },
    {
      id: 'attendance',
      label: 'Attendance',
      path: '/attendance',
      icon: Calendar,
      roles: ['hr', 'branch_manager', 'program_manager', 'admin'],
    },
    {
      id: 'recruitment',
      label: 'Recruitment',
      path: '/recruitment',
      icon: UserCheck,
      roles: ['hr', 'program_manager', 'admin'],
    },
    {
      id: 'reports',
      label: 'Reports',
      path: '/reports',
      icon: BarChart3,
      roles: ['hr', 'branch_manager', 'program_manager', 'admin'],
    },
    {
      id: 'documents',
      label: 'Documents',
      path: '/documents',
      icon: FileText,
      roles: ['employee', 'hr', 'training_coordinator', 'branch_manager', 'program_manager', 'admin'],
    },
    {
      id: 'settings',
      label: 'Settings',
      path: '/settings',
      icon: Settings,
      roles: ['hr', 'admin'],
    },
  ];

  const hasAccess = (item: NavigationItem): boolean => {
    return !item.roles || item.roles.includes(user?.role || '');
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