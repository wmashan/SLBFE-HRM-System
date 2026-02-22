// Backup & Restore Management Page for Admin

import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Download, 
  Upload, 
  Clock, 
  HardDrive,
  Settings,
  Shield,
  Calendar,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Trash2,
  Pause
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { BackupItem, BackupType } from '../../types';
import { backupService } from '../../services/api';
import CreateBackupModal from '../../components/admin/CreateBackupModal';
import RestoreBackupModal from '../../components/admin/RestoreBackupModal';

const BackupRestore: React.FC = () => {
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'backups' | 'schedule' | 'restore'>('backups');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<BackupItem | null>(null);
  const [backupInProgress, setBackupInProgress] = useState(false);

  const backupTypes: { type: BackupType; label: string; description: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
    {
      type: 'full',
      label: 'Full System Backup',
      description: 'Complete system backup including database, files, and configurations',
      icon: Database,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      type: 'database',
      label: 'Database Only',
      description: 'Database backup with all user data and system settings',
      icon: Database,
      color: 'bg-green-100 text-green-600'
    },
    {
      type: 'files',
      label: 'File System',
      description: 'Application files, documents, and media backups',
      icon: HardDrive,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      type: 'configuration',
      label: 'Configuration',
      description: 'System settings, user preferences, and application config',
      icon: Settings,
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  useEffect(() => {
    loadBackups();
  }, []);

  const loadBackups = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const mockBackups: BackupItem[] = [
        {
          id: '1',
          name: 'Full System Backup - Oct 1, 2025',
          type: 'full',
          size: '2.4 GB',
          createdAt: new Date(Date.now() - 86400000),
          status: 'completed',
          description: 'Scheduled daily backup',
          filePath: '/backups/full_20251001_000000.tar.gz',
          isAutomatic: true,
          restorePoints: []
        },
        {
          id: '2',
          name: 'Database Backup - Sep 30, 2025',
          type: 'database',
          size: '850 MB',
          createdAt: new Date(Date.now() - 172800000),
          status: 'completed',
          description: 'Pre-update database backup',
          filePath: '/backups/db_20250930_180000.sql.gz',
          isAutomatic: false,
          restorePoints: []
        },
        {
          id: '3',
          name: 'Configuration Backup - Sep 29, 2025',
          type: 'configuration',
          size: '45 MB',
          createdAt: new Date(Date.now() - 259200000),
          status: 'completed',
          description: 'System configuration snapshot',
          filePath: '/backups/config_20250929_120000.tar.gz',
          isAutomatic: false,
          restorePoints: []
        }
      ];
      setBackups(mockBackups);
    } catch (error) {
      console.error('Failed to load backups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async (type: BackupType, name: string, description?: string) => {
    try {
      setBackupInProgress(true);
      await backupService.createBackup(type, name, description);
      await loadBackups();
      setShowCreateModal(false);
    } catch (error) {
      console.error('Backup creation failed:', error);
    } finally {
      setBackupInProgress(false);
    }
  };

  const handleRestoreBackup = async (backupId: string, restoreOptions?: any) => {
    try {
      await backupService.restoreBackup(backupId, restoreOptions);
      setShowRestoreModal(false);
      setSelectedBackup(null);
      // Optionally reload backups after restore
      await loadBackups();
    } catch (error) {
      console.error('Restore failed:', error);
      // Error handling is done in the modal component
    }
  };

  const handleDeleteBackup = async (backupId: string) => {
    if (window.confirm('Are you sure you want to delete this backup? This action cannot be undone.')) {
      try {
        await backupService.deleteBackup(backupId);
        setBackups(backups.filter(backup => backup.id !== backupId));
      } catch (error) {
        console.error('Failed to delete backup:', error);
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: BackupType) => {
    const typeConfig = backupTypes.find(t => t.type === type);
    if (typeConfig) {
      const Icon = typeConfig.icon;
      return <Icon className="w-5 h-5" />;
    }
    return <Database className="w-5 h-5" />;
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Backup & Restore</h1>
            <p className="text-gray-600 mt-2">Manage system backups and data restoration</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => loadBackups()}
              className="flex items-center px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              disabled={backupInProgress}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Download className="w-4 h-4 mr-2" />
              Create Backup
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Backups</p>
                <p className="text-2xl font-bold text-gray-900">{backups.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Successful</p>
                <p className="text-2xl font-bold text-gray-900">
                  {backups.filter(b => b.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <HardDrive className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Storage Used</p>
                <p className="text-2xl font-bold text-gray-900">3.3 GB</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Last Backup</p>
                <p className="text-sm font-bold text-gray-900">
                  {backups[0]?.createdAt ? new Date(backups[0].createdAt).toLocaleDateString() : 'Never'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { key: 'backups', label: 'Backup History', icon: Database },
                { key: 'schedule', label: 'Scheduled Backups', icon: Calendar },
                { key: 'restore', label: 'Restore Points', icon: Upload }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'backups' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Backup History</h3>
                  <div className="text-sm text-gray-500">
                    {backups.length} backups found
                  </div>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : backups.length === 0 ? (
                  <div className="text-center py-8">
                    <Database className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No backups found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {backups.map((backup) => (
                      <div
                        key={backup.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-lg ${
                            backupTypes.find(t => t.type === backup.type)?.color || 'bg-gray-100 text-gray-600'
                          }`}>
                            {getTypeIcon(backup.type)}
                          </div>
                          
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-gray-900">{backup.name}</h4>
                              {backup.isAutomatic && (
                                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                                  Automatic
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                              <span>Size: {backup.size}</span>
                              <span>Created: {new Date(backup.createdAt).toLocaleString()}</span>
                              {backup.description && <span>{backup.description}</span>}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          {getStatusIcon(backup.status)}
                          
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => {
                                setSelectedBackup(backup);
                                setShowRestoreModal(true);
                              }}
                              disabled={backup.status !== 'completed'}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-50"
                              title="Restore"
                            >
                              <Upload className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => window.open(backup.filePath, '_blank')}
                              disabled={backup.status !== 'completed'}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50"
                              title="Download"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => handleDeleteBackup(backup.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Scheduled Backups</h3>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Add Schedule
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="font-medium">Daily Full Backup</span>
                        </div>
                        <span className="text-sm text-gray-500">Every day at 12:00 AM</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                          <Pause className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-600 hover:bg-gray-50 rounded">
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="font-medium">Weekly Database Backup</span>
                        </div>
                        <span className="text-sm text-gray-500">Every Sunday at 2:00 AM</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                          <Pause className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-600 hover:bg-gray-50 rounded">
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'restore' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">System Restore Points</h3>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex">
                    <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-blue-800">Restore Point Information</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Restore points are automatically created before major system updates and can be manually created before making significant changes.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center py-8">
                  <Upload className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No restore points available</p>
                  <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Create Restore Point
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Create Backup Modal */}
        <CreateBackupModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreateBackup={handleCreateBackup}
          isCreating={backupInProgress}
        />

        {/* Restore Modal */}
        <RestoreBackupModal
          isOpen={showRestoreModal}
          onClose={() => {
            setShowRestoreModal(false);
            setSelectedBackup(null);
          }}
          backup={selectedBackup}
          onRestore={handleRestoreBackup}
        />
      </div>
    </Layout>
  );
};

export default BackupRestore;