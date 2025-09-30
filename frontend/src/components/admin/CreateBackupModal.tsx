// Create Backup Modal Component

import React, { useState } from 'react';
import { X, Database, HardDrive, Settings, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { BackupType } from '../../types';

interface CreateBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBackup: (type: BackupType, name: string, description?: string) => Promise<void>;
  isCreating?: boolean;
}

const CreateBackupModal: React.FC<CreateBackupModalProps> = ({
  isOpen,
  onClose,
  onCreateBackup,
  isCreating = false
}) => {
  const [selectedType, setSelectedType] = useState<BackupType>('full');
  const [backupName, setBackupName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const backupTypes: { type: BackupType; label: string; description: string; icon: React.ComponentType<{ className?: string }>; color: string; estimatedSize: string; estimatedTime: string }[] = [
    {
      type: 'full',
      label: 'Full System Backup',
      description: 'Complete system backup including database, files, and configurations',
      icon: Database,
      color: 'bg-blue-100 text-blue-600',
      estimatedSize: '2-4 GB',
      estimatedTime: '15-30 minutes'
    },
    {
      type: 'database',
      label: 'Database Only',
      description: 'Database backup with all user data and system settings',
      icon: Database,
      color: 'bg-green-100 text-green-600',
      estimatedSize: '500 MB - 1 GB',
      estimatedTime: '5-10 minutes'
    },
    {
      type: 'files',
      label: 'File System',
      description: 'Application files, documents, and media backups',
      icon: HardDrive,
      color: 'bg-purple-100 text-purple-600',
      estimatedSize: '1-3 GB',
      estimatedTime: '10-20 minutes'
    },
    {
      type: 'configuration',
      label: 'Configuration',
      description: 'System settings, user preferences, and application config',
      icon: Settings,
      color: 'bg-orange-100 text-orange-600',
      estimatedSize: '10-50 MB',
      estimatedTime: '1-2 minutes'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!backupName.trim()) {
      setError('Backup name is required');
      return;
    }

    try {
      await onCreateBackup(selectedType, backupName.trim(), description.trim() || undefined);
      
      // Reset form
      setBackupName('');
      setDescription('');
      setSelectedType('full');
      onClose();
    } catch (error) {
      console.error('Backup creation failed:', error);
      setError('Failed to create backup. Please try again.');
    }
  };

  const generateDefaultName = (type: BackupType) => {
    const typeLabels: Record<BackupType, string> = {
      full: 'Full System Backup',
      database: 'Database Backup',
      files: 'File System Backup',
      configuration: 'Configuration Backup',
      incremental: 'Incremental Backup'
    };
    
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-CA'); // YYYY-MM-DD format
    return `${typeLabels[type]} - ${dateStr}`;
  };

  const handleTypeChange = (type: BackupType) => {
    setSelectedType(type);
    if (!backupName || backupTypes.some(bt => backupName.startsWith(bt.label))) {
      setBackupName(generateDefaultName(type));
    }
  };

  React.useEffect(() => {
    if (isOpen && !backupName) {
      setBackupName(generateDefaultName(selectedType));
    }
  }, [isOpen, selectedType, backupName]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <Download className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Create New Backup</h2>
              <p className="text-sm text-gray-600">Select backup type and configure options</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isCreating}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Backup Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Backup Type
            </label>
            <div className="space-y-3">
              {backupTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div
                    key={type.type}
                    className={`relative flex cursor-pointer border rounded-lg p-4 hover:bg-gray-50 ${
                      selectedType === type.type ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => handleTypeChange(type.type)}
                  >
                    <input
                      type="radio"
                      name="backupType"
                      value={type.type}
                      checked={selectedType === type.type}
                      onChange={() => handleTypeChange(type.type)}
                      className="sr-only"
                    />
                    
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`p-2 rounded-lg ${type.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900">{type.label}</h4>
                          {selectedType === type.type && (
                            <CheckCircle className="w-5 h-5 text-blue-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                        
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                          <span>Size: {type.estimatedSize}</span>
                          <span>Time: {type.estimatedTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Backup Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Backup Name *
            </label>
            <input
              type="text"
              value={backupName}
              onChange={(e) => setBackupName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter backup name..."
              required
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe the purpose of this backup..."
            />
          </div>

          {/* Backup Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
              <div className="ml-3">
                <h4 className="text-sm font-medium text-blue-800">Backup Information</h4>
                <div className="text-sm text-blue-700 mt-1 space-y-1">
                  <p>• Backup will be created in the background and may take some time to complete</p>
                  <p>• You can monitor progress from the backup history section</p>
                  <p>• Automatic verification will be performed after backup creation</p>
                  <p>• Backup files are encrypted and compressed for security</p>
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
              disabled={isCreating}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || !backupName.trim()}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isCreating && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              )}
              <Download className="w-4 h-4 mr-2" />
              Create Backup
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBackupModal;