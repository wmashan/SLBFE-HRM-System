// System Configuration Component for Admin

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  AlertTriangle,
  CheckCircle,
  Info,
  Database,
  Mail,
  Shield,
  Globe,
  Server
} from 'lucide-react';
import { SystemConfig, SystemConfigCategory } from '../../types';

const SystemConfiguration: React.FC = () => {
  const [configs, setConfigs] = useState<SystemConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<SystemConfigCategory | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSecureValues, setShowSecureValues] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadConfigurations();
  }, []);

  const loadConfigurations = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const mockConfigs: SystemConfig[] = [
        {
          id: '1',
          category: 'general',
          key: 'app.name',
          value: 'SLBFE HRM System',
          description: 'Application name displayed in the UI',
          isEditable: true,
          lastModified: new Date(),
          modifiedBy: 'admin'
        },
        {
          id: '2',
          category: 'general',
          key: 'app.version',
          value: '2.1.0',
          description: 'Current application version',
          isEditable: false,
          lastModified: new Date(),
          modifiedBy: 'system'
        },
        {
          id: '3',
          category: 'security',
          key: 'auth.session_timeout',
          value: 3600,
          description: 'Session timeout in seconds',
          isEditable: true,
          lastModified: new Date(),
          modifiedBy: 'admin'
        },
        {
          id: '4',
          category: 'security',
          key: 'auth.max_login_attempts',
          value: 5,
          description: 'Maximum failed login attempts before account lock',
          isEditable: true,
          lastModified: new Date(),
          modifiedBy: 'admin'
        },
        {
          id: '5',
          category: 'security',
          key: 'auth.password_policy.min_length',
          value: 8,
          description: 'Minimum password length requirement',
          isEditable: true,
          lastModified: new Date(),
          modifiedBy: 'admin'
        },
        {
          id: '6',
          category: 'email',
          key: 'smtp.host',
          value: 'mail.slbfe.lk',
          description: 'SMTP server hostname',
          isEditable: true,
          lastModified: new Date(),
          modifiedBy: 'admin'
        },
        {
          id: '7',
          category: 'email',
          key: 'smtp.port',
          value: 587,
          description: 'SMTP server port',
          isEditable: true,
          lastModified: new Date(),
          modifiedBy: 'admin'
        },
        {
          id: '8',
          category: 'email',
          key: 'smtp.username',
          value: 'noreply@slbfe.lk',
          description: 'SMTP authentication username',
          isEditable: true,
          lastModified: new Date(),
          modifiedBy: 'admin'
        },
        {
          id: '9',
          category: 'backup',
          key: 'backup.retention_days',
          value: 30,
          description: 'Number of days to retain backups',
          isEditable: true,
          lastModified: new Date(),
          modifiedBy: 'admin'
        },
        {
          id: '10',
          category: 'backup',
          key: 'backup.schedule',
          value: '0 2 * * *',
          description: 'Backup schedule in cron format (daily at 2 AM)',
          isEditable: true,
          lastModified: new Date(),
          modifiedBy: 'admin'
        }
      ];
      setConfigs(mockConfigs);
    } catch (error) {
      console.error('Failed to load configurations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfigUpdate = async (configId: string, newValue: string | number | boolean) => {
    try {
      setSaving(true);
      // TODO: Replace with actual API call
      console.log(`Updating config ${configId} to:`, newValue);
      
      setConfigs(configs.map(config => 
        config.id === configId 
          ? { ...config, value: newValue, lastModified: new Date(), modifiedBy: 'admin' }
          : config
      ));
    } catch (error) {
      console.error('Failed to update configuration:', error);
    } finally {
      setSaving(false);
    }
  };

  const getCategoryIcon = (category: SystemConfigCategory) => {
    switch (category) {
      case 'general':
        return <Settings className="w-5 h-5" />;
      case 'security':
        return <Shield className="w-5 h-5" />;
      case 'email':
        return <Mail className="w-5 h-5" />;
      case 'backup':
        return <Database className="w-5 h-5" />;
      case 'performance':
        return <Server className="w-5 h-5" />;
      case 'integration':
        return <Globe className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: SystemConfigCategory) => {
    switch (category) {
      case 'general':
        return 'bg-blue-100 text-blue-800';
      case 'security':
        return 'bg-red-100 text-red-800';
      case 'email':
        return 'bg-green-100 text-green-800';
      case 'backup':
        return 'bg-purple-100 text-purple-800';
      case 'performance':
        return 'bg-orange-100 text-orange-800';
      case 'integration':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isSecureField = (key: string) => {
    return key.toLowerCase().includes('password') || 
           key.toLowerCase().includes('secret') || 
           key.toLowerCase().includes('key') ||
           key.toLowerCase().includes('token');
  };

  const toggleSecureValue = (configId: string) => {
    setShowSecureValues(prev => ({
      ...prev,
      [configId]: !prev[configId]
    }));
  };

  const filteredConfigs = configs.filter(config => {
    const matchesCategory = selectedCategory === 'all' || config.category === selectedCategory;
    const matchesSearch = config.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         config.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const categories = Array.from(new Set(configs.map(config => config.category)));

  const ConfigInput: React.FC<{ config: SystemConfig }> = ({ config }) => {
    const [value, setValue] = useState(config.value);
    const [hasChanged, setHasChanged] = useState(false);

    useEffect(() => {
      setValue(config.value);
      setHasChanged(false);
    }, [config.value]);

    const handleChange = (newValue: string | number | boolean) => {
      setValue(newValue);
      setHasChanged(newValue !== config.value);
    };

    const handleSave = () => {
      if (hasChanged) {
        handleConfigUpdate(config.id, value);
        setHasChanged(false);
      }
    };

    const isSecure = isSecureField(config.key);
    const shouldHideValue = isSecure && !showSecureValues[config.id];

    if (!config.isEditable) {
      return (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-900 font-mono">
            {shouldHideValue ? '••••••••' : String(config.value)}
          </span>
          {isSecure && (
            <button
              onClick={() => toggleSecureValue(config.id)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              {shouldHideValue ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
          <span className="text-xs text-gray-500">(Read-only)</span>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2">
        <div className="flex-1">
          {typeof config.value === 'boolean' ? (
            <select
              value={String(value)}
              onChange={(e) => handleChange(e.target.value === 'true')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          ) : typeof config.value === 'number' ? (
            <input
              type="number"
              value={String(value)}
              onChange={(e) => handleChange(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-mono"
            />
          ) : (
            <input
              type={shouldHideValue ? 'password' : 'text'}
              value={String(value)}
              onChange={(e) => handleChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-mono"
            />
          )}
        </div>
        
        {isSecure && (
          <button
            onClick={() => toggleSecureValue(config.id)}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            {shouldHideValue ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
        
        {hasChanged && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
          >
            <Save className="w-4 h-4 mr-1" />
            Save
          </button>
        )}
        
        {!hasChanged && (
          <CheckCircle className="w-5 h-5 text-green-500" />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Configuration</h2>
          <p className="text-gray-600 mt-1">Manage system-wide settings and parameters</p>
        </div>
        
        <button
          onClick={loadConfigurations}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Configuration Changes
            </h3>
            <p className="text-sm text-yellow-700 mt-1">
              Changes to system configuration may require application restart to take effect. 
              Please ensure you understand the impact before modifying critical settings.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search configurations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as SystemConfigCategory | 'all')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Configurations */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-500">Loading configurations...</span>
            </div>
          </div>
        ) : filteredConfigs.length > 0 ? (
          filteredConfigs.map((config) => (
            <div key={config.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-1">
                  <div className="flex items-start space-x-3">
                    <div className={`p-1 rounded ${getCategoryColor(config.category)}`}>
                      {getCategoryIcon(config.category)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 font-mono">
                        {config.key}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {config.description}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(config.category)}`}>
                          {config.category}
                        </span>
                        <span className="text-xs text-gray-400">
                          Modified: {config.lastModified.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-2">
                  <ConfigInput config={config} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
            <Settings className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No configurations found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemConfiguration;