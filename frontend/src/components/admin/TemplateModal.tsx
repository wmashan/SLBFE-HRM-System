// Template Creation and Editing Modal

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  FileText, 
  Plus,
  Trash2,
  AlertCircle,
  Settings
} from 'lucide-react';
import { 
  DocumentTemplate, 
  DocumentTemplateCategory, 
  TemplatePlaceholder 
} from '../../types';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template?: DocumentTemplate | null;
  onSave: (template: Partial<DocumentTemplate>) => void;
}

const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  template,
  onSave
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'employment_letters' as DocumentTemplateCategory,
    fileType: 'docx' as 'docx' | 'pdf' | 'html' | 'txt',
    isActive: true,
    isDefault: false,
    approvalRequired: false,
    tags: [] as string[],
    placeholders: [] as TemplatePlaceholder[]
  });

  const [newTag, setNewTag] = useState('');
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const documentCategories = [
    { value: 'employment_letters', label: 'Employment Letters' },
    { value: 'leave_letters', label: 'Leave Letters' },
    { value: 'transfer_letters', label: 'Transfer Letters' },
    { value: 'medical_letters', label: 'Medical Letters' },
    { value: 'salary_letters', label: 'Salary Letters' },
    { value: 'retirement_letters', label: 'Retirement Letters' },
    { value: 'disciplinary_letters', label: 'Disciplinary Letters' },
    { value: 'training_certificates', label: 'Training Certificates' },
    { value: 'general_correspondence', label: 'General Correspondence' },
    { value: 'forms', label: 'Forms' },
    { value: 'reports', label: 'Reports' },
    { value: 'policies', label: 'Policies' },
    { value: 'other', label: 'Other' }
  ];

  const placeholderTypes = [
    { value: 'text', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'date', label: 'Date' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'address', label: 'Address' },
    { value: 'boolean', label: 'Yes/No' },
    { value: 'dropdown', label: 'Dropdown' }
  ];

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        description: template.description,
        category: template.category,
        fileType: template.fileType,
        isActive: template.isActive,
        isDefault: template.isDefault,
        approvalRequired: template.approvalRequired,
        tags: [...template.tags],
        placeholders: [...template.placeholders]
      });
    } else {
      // Reset for new template
      setFormData({
        name: '',
        description: '',
        category: 'employment_letters',
        fileType: 'docx',
        isActive: true,
        isDefault: false,
        approvalRequired: false,
        tags: [],
        placeholders: []
      });
    }
    setTemplateFile(null);
    setErrors({});
  }, [template, isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleAddPlaceholder = () => {
    const newPlaceholder: TemplatePlaceholder = {
      id: Date.now().toString(),
      key: '',
      label: '',
      description: '',
      type: 'text',
      required: false
    };
    setFormData(prev => ({
      ...prev,
      placeholders: [...prev.placeholders, newPlaceholder]
    }));
  };

  const handlePlaceholderChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      placeholders: prev.placeholders.map((placeholder, i) =>
        i === index ? { ...placeholder, [field]: value } : placeholder
      )
    }));
  };

  const handleRemovePlaceholder = (index: number) => {
    setFormData(prev => ({
      ...prev,
      placeholders: prev.placeholders.filter((_, i) => i !== index)
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTemplateFile(file);
      // Auto-detect file type
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (extension && ['docx', 'pdf', 'html', 'txt'].includes(extension)) {
        setFormData(prev => ({ ...prev, fileType: extension as any }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Template name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!template && !templateFile) {
      newErrors.template = 'Template file is required for new templates';
    }

    // Validate placeholders
    formData.placeholders.forEach((placeholder, index) => {
      if (!placeholder.key.trim()) {
        newErrors[`placeholder_${index}_key`] = 'Placeholder key is required';
      }
      if (!placeholder.label.trim()) {
        newErrors[`placeholder_${index}_label`] = 'Placeholder label is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const templateData: Partial<DocumentTemplate> = {
      ...formData,
      version: template ? template.version : '1.0',
      updatedAt: new Date(),
      lastModifiedBy: 'admin@slbfe.lk'
    };

    if (!template) {
      templateData.id = Date.now().toString();
      templateData.createdAt = new Date();
      templateData.createdBy = 'admin@slbfe.lk';
      templateData.usage = { totalUsed: 0 };
    }

    onSave(templateData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {template ? 'Edit Template' : 'Create New Template'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter template name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {documentCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe the template purpose and usage"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template File {!template && '*'}
              </label>
              <div className={`border-2 border-dashed rounded-lg p-4 ${
                errors.template ? 'border-red-300' : 'border-gray-300'
              }`}>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".docx,.pdf,.html,.txt"
                  className="w-full"
                />
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <FileText className="w-4 h-4 mr-2" />
                  <span>Supported formats: DOCX, PDF, HTML, TXT</span>
                </div>
                {templateFile && (
                  <div className="mt-2 text-sm text-green-600">
                    Selected: {templateFile.name}
                  </div>
                )}
              </div>
              {errors.template && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.template}
                </p>
              )}
            </div>

            {/* Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File Type
                </label>
                <select
                  value={formData.fileType}
                  onChange={(e) => handleInputChange('fileType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="docx">DOCX</option>
                  <option value="pdf">PDF</option>
                  <option value="html">HTML</option>
                  <option value="txt">TXT</option>
                </select>
              </div>

              <div className="flex items-center space-x-4 pt-8">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => handleInputChange('isDefault', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Default</span>
                </label>
              </div>

              <div className="flex items-center pt-8">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.approvalRequired}
                    onChange={(e) => handleInputChange('approvalRequired', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Requires Approval</span>
                </label>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Add tag"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Placeholders */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Template Placeholders
                </label>
                <button
                  type="button"
                  onClick={handleAddPlaceholder}
                  className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Placeholder
                </button>
              </div>

              <div className="space-y-4">
                {formData.placeholders.map((placeholder, index) => (
                  <div key={placeholder.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-900">
                        Placeholder {index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => handleRemovePlaceholder(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Key *
                        </label>
                        <input
                          type="text"
                          value={placeholder.key}
                          onChange={(e) => handlePlaceholderChange(index, 'key', e.target.value)}
                          className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                            errors[`placeholder_${index}_key`] ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="e.g., employee_name"
                        />
                        {errors[`placeholder_${index}_key`] && (
                          <p className="mt-1 text-xs text-red-600">{errors[`placeholder_${index}_key`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Label *
                        </label>
                        <input
                          type="text"
                          value={placeholder.label}
                          onChange={(e) => handlePlaceholderChange(index, 'label', e.target.value)}
                          className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                            errors[`placeholder_${index}_label`] ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Employee Name"
                        />
                        {errors[`placeholder_${index}_label`] && (
                          <p className="mt-1 text-xs text-red-600">{errors[`placeholder_${index}_label`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Type
                        </label>
                        <select
                          value={placeholder.type}
                          onChange={(e) => handlePlaceholderChange(index, 'type', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          {placeholderTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-3">
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={placeholder.description}
                        onChange={(e) => handlePlaceholderChange(index, 'description', e.target.value)}
                        rows={2}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Describe what this placeholder represents..."
                      />
                    </div>

                    <div className="mt-3 flex items-center">
                      <label className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={placeholder.required}
                          onChange={(e) => handlePlaceholderChange(index, 'required', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                        />
                        Required
                      </label>
                    </div>
                  </div>
                ))}

                {formData.placeholders.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Settings className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No placeholders defined</p>
                    <p className="text-xs">Add placeholders to make your template dynamic</p>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Save className="w-4 h-4 mr-2" />
            {template ? 'Update Template' : 'Create Template'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateModal;