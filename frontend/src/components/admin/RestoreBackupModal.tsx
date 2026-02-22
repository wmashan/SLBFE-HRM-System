// Restore Backup Modal Component

import React, { useState } from 'react';
import { X, Upload, AlertTriangle, Database, Shield, Clock, CheckCircle } from 'lucide-react';
import { BackupItem } from '../../types';

interface RestoreBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  backup: BackupItem | null;
  onRestore: (backupId: string, options: RestoreOptions) => Promise<void>;
  isRestoring?: boolean;
}

interface RestoreOptions {
  createRestorePoint: boolean;
  verifyIntegrity: boolean;
  includeFiles: boolean;
  includeDatabase: boolean;
  includeConfiguration: boolean;
  overwriteExisting: boolean;
  notifyOnCompletion: boolean;
}

const RestoreBackupModal: React.FC<RestoreBackupModalProps> = ({
  isOpen,
  onClose,
  backup,
  onRestore,
  isRestoring = false
}) => {
  const [options, setOptions] = useState<RestoreOptions>({
    createRestorePoint: true,
    verifyIntegrity: true,
    includeFiles: true,
    includeDatabase: true,
    includeConfiguration: true,
    overwriteExisting: false,
    notifyOnCompletion: true
  });
  const [confirmationText, setConfirmationText] = useState('');
  const [error, setError] = useState('');

  const requiredConfirmationText = 'RESTORE';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (confirmationText !== requiredConfirmationText) {
      setError(`Please type "${requiredConfirmationText}" to confirm the restore operation`);
      return;
    }

    if (!backup) {
      setError('No backup selected for restore');
      return;
    }

    try {
      await onRestore(backup.id, options);
      setConfirmationText('');
      onClose();
    } catch (error) {
      console.error('Restore failed:', error);
      setError('Failed to restore backup. Please try again.');
    }
  };

  const updateOption = (key: keyof RestoreOptions, value: boolean) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const getBackupTypeDetails = (type: string) => {
    switch (type) {
      case 'full':
        return {
          icon: Database,
          color: 'text-blue-600',
          description: 'Complete system restoration including database, files, and configuration'
        };
      case 'database':
        return {
          icon: Database,
          color: 'text-green-600',
          description: 'Database restoration with all user data and system settings'
        };
      case 'files':
        return {
          icon: Upload,
          color: 'text-purple-600',
          description: 'File system restoration including documents and media'
        };
      case 'configuration':
        return {
          icon: Shield,
          color: 'text-orange-600',
          description: 'System settings and configuration restoration'
        };
      default:
        return {
          icon: Database,
          color: 'text-gray-600',
          description: 'System restoration'
        };
    }
  };

  if (!isOpen || !backup) return null;

  const typeDetails = getBackupTypeDetails(backup.type);
  const TypeIcon = typeDetails.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg mr-3">
              <Upload className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Restore System</h2>
              <p className="text-sm text-gray-600">Restore from backup - this action cannot be undone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isRestoring}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Backup Information */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Selected Backup</h3>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg bg-gray-100 ${typeDetails.color}`}>
                  <TypeIcon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{backup.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">{typeDetails.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>Created: {new Date(backup.createdAt).toLocaleString()}</span>
                    </div>
                    <span>Size: {backup.size}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Critical Warning */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
              <div className="ml-3">
                <h4 className="text-sm font-medium text-red-800">⚠️ Critical Warning</h4>
                <div className="text-sm text-red-700 mt-1 space-y-1">
                  <p><strong>This action will permanently replace your current system data.</strong></p>
                  <p>• All current data will be overwritten with backup data from {new Date(backup.createdAt).toLocaleString()}</p>
                  <p>• Any changes made after the backup date will be lost</p>
                  <p>• Users may experience service interruption during restore</p>
                  <p>• This operation cannot be undone once started</p>
                </div>
              </div>
            </div>
          </div>

          {/* Restore Options */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Restore Options</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Create Restore Point</h4>
                  <p className="text-xs text-gray-500">Create a backup of current system before restore</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.createRestorePoint}
                    onChange={(e) => updateOption('createRestorePoint', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Verify Backup Integrity</h4>
                  <p className="text-xs text-gray-500">Verify backup files before restore (recommended)</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.verifyIntegrity}
                    onChange={(e) => updateOption('verifyIntegrity', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {backup.type === 'full' && (
                <>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Include Files</h4>
                      <p className="text-xs text-gray-500">Restore file system and documents</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={options.includeFiles}
                        onChange={(e) => updateOption('includeFiles', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Include Database</h4>
                      <p className="text-xs text-gray-500">Restore database and user data</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={options.includeDatabase}
                        onChange={(e) => updateOption('includeDatabase', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Include Configuration</h4>
                      <p className="text-xs text-gray-500">Restore system settings and config</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={options.includeConfiguration}
                        onChange={(e) => updateOption('includeConfiguration', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </>
              )}

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Notify on Completion</h4>
                  <p className="text-xs text-gray-500">Send notification when restore is complete</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.notifyOnCompletion}
                    onChange={(e) => updateOption('notifyOnCompletion', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Confirmation */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirmation Required *
            </label>
            <p className="text-sm text-gray-600 mb-3">
              Type <strong className="text-red-600">{requiredConfirmationText}</strong> to confirm this destructive action:
            </p>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder={`Type "${requiredConfirmationText}" to continue...`}
              required
            />
          </div>

          {/* Pre-restore Checklist */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5" />
              <div className="ml-3">
                <h4 className="text-sm font-medium text-blue-800">Pre-restore Checklist</h4>
                <div className="text-sm text-blue-700 mt-1 space-y-1">
                  <p>✓ All users have been notified of the maintenance window</p>
                  <p>✓ Recent backup has been created (if "Create Restore Point" is enabled)</p>
                  <p>✓ Backup integrity has been verified</p>
                  <p>✓ You have confirmed the backup contains the correct data</p>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isRestoring}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isRestoring || confirmationText !== requiredConfirmationText}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {isRestoring && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              )}
              <Upload className="w-4 h-4 mr-2" />
              {isRestoring ? 'Restoring...' : 'Restore System'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestoreBackupModal;