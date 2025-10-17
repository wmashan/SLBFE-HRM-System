// Admin Dashboard - System Administration and Management

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Settings, 
  Shield, 
  Activity, 
  Database, 
  AlertTriangle,
  Server,
  UserCheck,
  BarChart3,
  Bell,
  RefreshCw,
  Download,
  FileText
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import { AdminDashboardStats } from '../types';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const mockData: AdminDashboardStats = {
        systemHealth: {
          cpuUsage: 45,
          memoryUsage: 62,
          diskUsage: 38,
          databaseStatus: 'healthy',
          serviceStatus: [
            { name: 'Web Server', status: 'running', lastChecked: new Date(), responseTime: 120 },
            { name: 'Database', status: 'running', lastChecked: new Date(), responseTime: 45 },
            { name: 'Email Service', status: 'running', lastChecked: new Date(), responseTime: 200 },
            { name: 'Backup Service', status: 'running', lastChecked: new Date(), responseTime: 300 }
          ],
          uptime: 99.8,
          lastHealthCheck: new Date()
        },
        userActivity: {
          activeUsers: 342,
          onlineUsers: 28,
          totalSessions: 156,
          avgSessionDuration: 45,
          peakConcurrentUsers: 89,
          activityTrend: []
        },
        securityOverview: {
          totalAlerts: 12,
          criticalAlerts: 2,
          resolvedToday: 8,
          pendingAlerts: 4,
          failedLogins: 15,
          suspiciousActivities: 3,
          securityScore: 87
        },
        recentActions: [],
        systemAlerts: [
          {
            id: '1',
            type: 'backup_failed',
            severity: 'medium',
            message: 'Scheduled backup failed for database cluster',
            timestamp: new Date(Date.now() - 3600000),
            acknowledged: false
          },
          {
            id: '2',
            type: 'performance_degradation',
            severity: 'low',
            message: 'Response time increased by 15% in the last hour',
            timestamp: new Date(Date.now() - 7200000),
            acknowledged: true
          }
        ],
        performanceMetrics: {
          responseTime: 120,
          throughput: 1500,
          errorRate: 0.02,
          concurrentUsers: 28,
          databaseConnections: 15,
          cacheHitRate: 94.5,
          queueSize: 5
        }
      };
      setDashboardData(mockData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
      case 'running':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
      case 'stopped':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">System administration and management overview</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={refreshData}
              disabled={refreshing}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData?.userActivity.activeUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">System Uptime</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData?.systemHealth.uptime}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Security Alerts</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData?.securityOverview.pendingAlerts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Security Score</p>
                <p className="text-2xl font-bold text-gray-900">{dashboardData?.securityOverview.securityScore}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* System Health and Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Health */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
              <Server className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>CPU Usage</span>
                  <span>{dashboardData?.systemHealth.cpuUsage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${dashboardData?.systemHealth.cpuUsage}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Memory Usage</span>
                  <span>{dashboardData?.systemHealth.memoryUsage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${dashboardData?.systemHealth.memoryUsage}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Disk Usage</span>
                  <span>{dashboardData?.systemHealth.diskUsage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full" 
                    style={{ width: `${dashboardData?.systemHealth.diskUsage}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Services Status</h4>
                <div className="space-y-2">
                  {dashboardData?.systemHealth.serviceStatus.map((service) => (
                    <div key={service.name} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{service.name}</span>
                      <div className="flex items-center">
                        <span className={`text-sm font-medium ${getHealthStatusColor(service.status)}`}>
                          {service.status}
                        </span>
                        {service.responseTime && (
                          <span className="text-xs text-gray-400 ml-2">
                            {service.responseTime}ms
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* User Activity */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">User Activity</h3>
              <UserCheck className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  {dashboardData?.userActivity.onlineUsers}
                </p>
                <p className="text-sm text-gray-600">Online Now</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {dashboardData?.userActivity.totalSessions}
                </p>
                <p className="text-sm text-gray-600">Active Sessions</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  {dashboardData?.userActivity.avgSessionDuration}m
                </p>
                <p className="text-sm text-gray-600">Avg Session</p>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">
                  {dashboardData?.userActivity.peakConcurrentUsers}
                </p>
                <p className="text-sm text-gray-600">Peak Users</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Security Overview */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Security Overview</h3>
              <Shield className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-red-800">Critical Alerts</p>
                  <p className="text-sm text-red-600">Require immediate attention</p>
                </div>
                <span className="text-2xl font-bold text-red-600">
                  {dashboardData?.securityOverview.criticalAlerts}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div>
                  <p className="font-medium text-yellow-800">Failed Logins</p>
                  <p className="text-sm text-yellow-600">Last 24 hours</p>
                </div>
                <span className="text-2xl font-bold text-yellow-600">
                  {dashboardData?.securityOverview.failedLogins}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-blue-800">Suspicious Activities</p>
                  <p className="text-sm text-blue-600">Under investigation</p>
                </div>
                <span className="text-2xl font-bold text-blue-600">
                  {dashboardData?.securityOverview.suspiciousActivities}
                </span>
              </div>
            </div>
          </div>

          {/* System Alerts */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Alerts</h3>
              <Bell className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-3">
              {dashboardData?.systemAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-3 rounded-lg border-l-4 ${
                    alert.severity === 'critical' ? 'border-red-500 bg-red-50' :
                    alert.severity === 'high' ? 'border-orange-500 bg-orange-50' :
                    alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                    'border-blue-500 bg-blue-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(alert.severity)}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                        {!alert.acknowledged && (
                          <span className="ml-2 w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {alert.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {(!dashboardData?.systemAlerts || dashboardData.systemAlerts.length === 0) && (
                <div className="text-center py-4 text-gray-500">
                  <Shield className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No recent alerts</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <button 
              onClick={() => navigate('/admin/users')}
              className="flex flex-col items-center p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">User Management</span>
            </button>
            
            <button 
              onClick={() => navigate('/admin/roles')}
              className="flex flex-col items-center p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <UserCheck className="w-8 h-8 text-indigo-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Role Management</span>
            </button>
            
            <button className="flex flex-col items-center p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Settings className="w-8 h-8 text-gray-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">System Config</span>
            </button>
            
            <button 
              onClick={() => navigate('/admin/backup')}
              className="flex flex-col items-center p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Database className="w-8 h-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Backup & Restore</span>
            </button>
            
            <button className="flex flex-col items-center p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <BarChart3 className="w-8 h-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Analytics</span>
            </button>
            
            <button className="flex flex-col items-center p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Shield className="w-8 h-8 text-red-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Security Audit</span>
            </button>
            
            <button 
              onClick={() => navigate('/documents')}
              className="flex flex-col items-center p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FileText className="w-8 h-8 text-teal-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Documents</span>
            </button>
            
            <button className="flex flex-col items-center p-4 text-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-8 h-8 text-orange-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Export Data</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;