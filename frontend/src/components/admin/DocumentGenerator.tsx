// Document Generator Component - Generate documents from templates

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  User, 
  Calendar, 
  Hash,
  Mail,
  Phone,
  MapPin,
  ToggleLeft,
  ToggleRight,
  ChevronDown,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { DocumentTemplate, TemplatePlaceholder, GeneratedDocument } from '../../types';
import { documentTemplateService } from '../../services/documentTemplateService';

interface DocumentGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  template: DocumentTemplate;
}

const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({
  isOpen,
  onClose,
  template
}) => {
  const [placeholderValues, setPlaceholderValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState<GeneratedDocument | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Initialize placeholder values with defaults
      const initialValues: Record<string, any> = {};
      template.placeholders.forEach(placeholder => {
        if (placeholder.defaultValue) {
          initialValues[placeholder.key] = placeholder.defaultValue;
        } else if (placeholder.type === 'boolean') {
          initialValues[placeholder.key] = false;
        } else {
          initialValues[placeholder.key] = '';
        }
      });
      setPlaceholderValues(initialValues);
      setErrors({});
      setGenerated(false);
      setGeneratedDocument(null);
    }
  }, [isOpen, template]);

  const handleValueChange = (key: string, value: any) => {
    setPlaceholderValues(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    template.placeholders.forEach(placeholder => {
      if (placeholder.required) {
        const value = placeholderValues[placeholder.key];
        if (!value || (typeof value === 'string' && !value.trim())) {
          newErrors[placeholder.key] = `${placeholder.label} is required`;
        }
      }

      // Type-specific validations
      if (placeholderValues[placeholder.key]) {
        const value = placeholderValues[placeholder.key];
        
        if (placeholder.type === 'email' && value) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            newErrors[placeholder.key] = 'Please enter a valid email address';
          }
        }

        if (placeholder.type === 'phone' && value) {
          const phoneRegex = /^[+]?[\d\s\-()]+$/;
          if (!phoneRegex.test(value)) {
            newErrors[placeholder.key] = 'Please enter a valid phone number';
          }
        }

        if (placeholder.validation) {
          if (placeholder.validation.minLength && value.length < placeholder.validation.minLength) {
            newErrors[placeholder.key] = `Minimum length is ${placeholder.validation.minLength} characters`;
          }
          if (placeholder.validation.maxLength && value.length > placeholder.validation.maxLength) {
            newErrors[placeholder.key] = `Maximum length is ${placeholder.validation.maxLength} characters`;
          }
          if (placeholder.validation.pattern) {
            const regex = new RegExp(placeholder.validation.pattern);
            if (!regex.test(value)) {
              newErrors[placeholder.key] = 'Please enter a valid format';
            }
          }
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerate = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setGenerating(true);
      const document = await documentTemplateService.generateDocument(template.id, placeholderValues);
      setGeneratedDocument(document);
      setGenerated(true);
    } catch (error) {
      console.error('Failed to generate document:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedDocument) {
      // Simulate download
      const link = document.createElement('a');
      link.href = '#'; // In real implementation, this would be the actual file URL
      link.download = generatedDocument.fileName;
      link.click();
    }
  };

  const renderInputField = (placeholder: TemplatePlaceholder) => {
    const value = placeholderValues[placeholder.key] || '';
    const error = errors[placeholder.key];

    const getIcon = () => {
      switch (placeholder.type) {
        case 'email': return Mail;
        case 'phone': return Phone;
        case 'address': return MapPin;
        case 'date': return Calendar;
        case 'number': return Hash;
        default: return User;
      }
    };

    const Icon = getIcon();

    switch (placeholder.type) {
      case 'boolean':
        return (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <label className="text-sm font-medium text-gray-900">{placeholder.label}</label>
              {placeholder.description && (
                <p className="text-xs text-gray-500 mt-1">{placeholder.description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => handleValueChange(placeholder.key, !value)}
              className="flex items-center"
            >
              {value ? (
                <ToggleRight className="w-8 h-8 text-blue-600" />
              ) : (
                <ToggleLeft className="w-8 h-8 text-gray-300" />
              )}
            </button>
          </div>
        );

      case 'dropdown':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {placeholder.label}
              {placeholder.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
              <select
                value={value}
                onChange={(e) => handleValueChange(placeholder.key, e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${
                  error ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select {placeholder.label}</option>
                {placeholder.options?.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            {placeholder.description && (
              <p className="text-xs text-gray-500 mt-1">{placeholder.description}</p>
            )}
            {error && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {error}
              </p>
            )}
          </div>
        );

      case 'date':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {placeholder.label}
              {placeholder.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={value}
                onChange={(e) => handleValueChange(placeholder.key, e.target.value)}
                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  error ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            </div>
            {placeholder.description && (
              <p className="text-xs text-gray-500 mt-1">{placeholder.description}</p>
            )}
            {error && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {error}
              </p>
            )}
          </div>
        );

      default:
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {placeholder.label}
              {placeholder.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <div className="relative">
              <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={placeholder.type === 'number' ? 'number' : placeholder.type === 'email' ? 'email' : 'text'}
                value={value}
                onChange={(e) => handleValueChange(placeholder.key, e.target.value)}
                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  error ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder={placeholder.description || `Enter ${placeholder.label.toLowerCase()}`}
                min={placeholder.validation?.min}
                max={placeholder.validation?.max}
                minLength={placeholder.validation?.minLength}
                maxLength={placeholder.validation?.maxLength}
              />
            </div>
            {placeholder.description && (
              <p className="text-xs text-gray-500 mt-1">{placeholder.description}</p>
            )}
            {error && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {error}
              </p>
            )}
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Generate Document</h2>
            <p className="text-sm text-gray-600 mt-1">{template.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {!generated ? (
            <div className="p-6">
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start">
                  <FileText className="w-5 h-5 text-blue-600 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-blue-900">Template Information</h3>
                    <p className="text-sm text-blue-700 mt-1">{template.description}</p>
                    <div className="flex items-center mt-2 space-x-4 text-xs text-blue-600">
                      <span>Type: {template.fileType.toUpperCase()}</span>
                      <span>Version: {template.version}</span>
                      <span>Category: {template.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Fill in the details</h3>
                
                {template.placeholders.map((placeholder) => (
                  <div key={placeholder.id}>
                    {renderInputField(placeholder)}
                  </div>
                ))}

                {template.placeholders.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>This template doesn't require any input values.</p>
                    <p className="text-sm">You can generate the document directly.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Document Generated Successfully!</h3>
                <p className="text-gray-600 mb-6">Your document is ready for download</p>
                
                {generatedDocument && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-center mb-3">
                      <FileText className="w-8 h-8 text-gray-600 mr-3" />
                      <div>
                        <p className="font-medium text-gray-900">{generatedDocument.fileName}</p>
                        <p className="text-sm text-gray-500">
                          {Math.round(generatedDocument.fileSize / 1024)} KB • Generated {generatedDocument.generatedAt.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleDownload}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Document
                </button>
              </div>
            </div>
          )}
        </div>

        {!generated && (
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {generating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Document
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentGenerator;