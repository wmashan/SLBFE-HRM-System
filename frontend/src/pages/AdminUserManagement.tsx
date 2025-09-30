// Admin User Management Page

import React from 'react';
import Layout from '../components/layout/Layout';
import UserManagementEnhanced from '../components/admin/UserManagementEnhanced';
import { AdminUserView } from '../types';

const AdminUserManagementPage: React.FC = () => {
  const handleUserSelect = (user: AdminUserView) => {
    // Handle user selection for detailed view
    console.log('Selected user:', user);
    // You can implement navigation to user detail page or open a detailed modal
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-2">
            Manage system users, edit credentials, and control access permissions
          </p>
        </div>
        
        <UserManagementEnhanced onUserSelect={handleUserSelect} />
      </div>
    </Layout>
  );
};

export default AdminUserManagementPage;