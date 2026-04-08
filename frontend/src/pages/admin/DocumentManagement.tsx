// Document Management Page for Admin - System Documents & HR Forms Management

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Download, 
  Upload,
  Eye,
  Filter,
  Calendar,
  Users,
  BarChart3,
  FolderOpen,
  Star,
  Clock,
  Shield,
  Building,
  BookOpen,
  AlertTriangle,
  HardDrive,
  TrendingUp,
  File,
  Lock,
  Globe,
  X,
  CheckCircle,
  AlertCircle,
  Copy
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { 
  SystemDocument, 
  SystemDocumentCategory,
  DocumentStats,
  DocumentAccessLevel,
  DocumentUploadData
} from '../../types';

const DocumentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'documents' | 'stats'>('documents');
  const [documents, setDocuments] = useState<SystemDocument[]>([]);
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SystemDocumentCategory | 'all'>('all');
  const [selectedAccessLevel, setSelectedAccessLevel] = useState<DocumentAccessLevel | 'all'>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<SystemDocument | null>(null);
  const [uploadData, setUploadData] = useState<Partial<DocumentUploadData>>({
    name: '',
    description: '',
    category: 'hr_forms',
    accessLevel: 'all_employees',
    tags: [],
    isSystemForm: false,
    formCode: ''
  });

  const documentCategories: Array<{
    value: SystemDocumentCategory;
    label: string;
    icon: React.ComponentType<any>;
    description: string;
  }> = [
    { 
      value: 'policies_procedures', 
      label: 'Policies & Procedures', 
      icon: BookOpen,
      description: 'Company policies, procedures, and guidelines'
    },
    { 
      value: 'employee_handbook', 
      label: 'Employee Handbook', 
      icon: Users,
      description: 'Employee handbook and onboarding materials'
    },
    { 
      value: 'forms_applications', 
      label: 'Forms & Applications', 
      icon: FileText,
      description: 'Standard forms and application templates'
    },
    { 
      value: 'training_materials', 
      label: 'Training Materials', 
      icon: Star,
      description: 'Training documents and educational resources'
    },
    { 
      value: 'compliance_documents', 
      label: 'Compliance Documents', 
      icon: Shield,
      description: 'Legal and compliance documentation'
    },
    { 
      value: 'hr_guidelines', 
      label: 'HR Guidelines', 
      icon: Users,
      description: 'Human resources guidelines and processes'
    },
    { 
      value: 'safety_documents', 
      label: 'Safety Documents', 
      icon: AlertTriangle,
      description: 'Workplace safety and emergency procedures'
    },
    { 
      value: 'benefits_information', 
      label: 'Benefits Information', 
      icon: TrendingUp,
      description: 'Employee benefits and compensation information'
    },
    { 
      value: 'organizational_charts', 
      label: 'Organizational Charts', 
      icon: Building,
      description: 'Organization structure and reporting hierarchy'
    },
    { 
      value: 'announcements', 
      label: 'Announcements', 
      icon: Calendar,
      description: 'Company announcements and news'
    },
    { 
      value: 'reference_materials', 
      label: 'Reference Materials', 
      icon: FolderOpen,
      description: 'Reference documents and resources'
    },
    { 
      value: 'templates', 
      label: 'Templates', 
      icon: File,
      description: 'Document templates for employee use'
    },
    { 
      value: 'other', 
      label: 'Other', 
      icon: FileText,
      description: 'Miscellaneous documents'
    }
  ];

  const accessLevels: Array<{
    value: DocumentAccessLevel;
    label: string;
    icon: React.ComponentType<any>;
    color: string;
  }> = [
    { value: 'all_employees', label: 'All Employees', icon: Globe, color: 'text-green-600 bg-green-100' },
    { value: 'hr_only', label: 'HR Only', icon: Users, color: 'text-blue-600 bg-blue-100' },
    { value: 'admin_only', label: 'Admin Only', icon: Shield, color: 'text-red-600 bg-red-100' },
    { value: 'managers_only', label: 'Managers Only', icon: Star, color: 'text-purple-600 bg-purple-100' },
    { value: 'restricted', label: 'Restricted', icon: Lock, color: 'text-orange-600 bg-orange-100' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API calls
      const mockDocuments: SystemDocument[] = [
        {
          id: '1',
          name: 'Employee Handbook 2024',
          description: 'Comprehensive guide for all employees covering policies, procedures, and benefits',
          category: 'employee_handbook',
          fileType: 'pdf',
          fileName: 'Employee_Handbook_2024.pdf',
          filePath: '/documents/employee_handbook_2024.pdf',
          fileSize: 2547832, // ~2.5MB
          isActive: true,
          accessLevel: 'all_employees',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-09-20'),
          uploadedBy: 'admin@slbfe.lk',
          lastModifiedBy: 'hr@slbfe.lk',
          downloadCount: 247,
          lastDownloaded: new Date('2024-10-16'),
          tags: ['handbook', 'policies', 'onboarding'],
          version: '2.0'
        },
        {
          id: '2',
          name: 'Leave Application Form',
          description: 'Standard form for requesting leave from work',
          category: 'forms_applications',
          fileType: 'docx',
          fileName: 'Leave_Application_Form.docx',
          filePath: '/documents/leave_application_form.docx',
          fileSize: 156743,
          isActive: true,
          accessLevel: 'all_employees',
          createdAt: new Date('2024-02-10'),
          updatedAt: new Date('2024-08-15'),
          uploadedBy: 'admin@slbfe.lk',
          lastModifiedBy: 'admin@slbfe.lk',
          downloadCount: 892,
          lastDownloaded: new Date('2024-10-17'),
          tags: ['form', 'leave', 'application'],
          version: '1.3'
        },
        {
          id: '3',
          name: 'Code of Conduct Policy',
          description: 'Company code of conduct and ethical guidelines for all employees',
          category: 'policies_procedures',
          fileType: 'pdf',
          fileName: 'Code_of_Conduct_Policy.pdf',
          filePath: '/documents/code_of_conduct.pdf',
          fileSize: 1234567,
          isActive: true,
          accessLevel: 'all_employees',
          createdAt: new Date('2024-01-20'),
          updatedAt: new Date('2024-07-10'),
          uploadedBy: 'admin@slbfe.lk',
          lastModifiedBy: 'admin@slbfe.lk',
          downloadCount: 156,
          lastDownloaded: new Date('2024-10-12'),
          tags: ['policy', 'conduct', 'ethics'],
          version: '1.1'
        },
        {
          id: '4',
          name: 'HR Performance Review Guidelines',
          description: 'Guidelines for conducting employee performance reviews',
          category: 'hr_guidelines',
          fileType: 'docx',
          fileName: 'Performance_Review_Guidelines.docx',
          filePath: '/documents/performance_review_guidelines.docx',
          fileSize: 456789,
          isActive: true,
          accessLevel: 'hr_only',
          createdAt: new Date('2024-03-05'),
          updatedAt: new Date('2024-09-01'),
          uploadedBy: 'admin@slbfe.lk',
          lastModifiedBy: 'hr@slbfe.lk',
          downloadCount: 34,
          lastDownloaded: new Date('2024-10-08'),
          tags: ['performance', 'review', 'hr'],
          version: '2.2'
        },
        {
          id: '5',
          name: 'Safety Protocols Manual',
          description: 'Comprehensive safety protocols and emergency procedures',
          category: 'safety_documents',
          fileType: 'pdf',
          fileName: 'Safety_Protocols_Manual.pdf',
          filePath: '/documents/safety_protocols.pdf',
          fileSize: 3456789,
          isActive: true,
          accessLevel: 'all_employees',
          createdAt: new Date('2024-02-28'),
          updatedAt: new Date('2024-08-20'),
          uploadedBy: 'admin@slbfe.lk',
          lastModifiedBy: 'safety@slbfe.lk',
          downloadCount: 89,
          lastDownloaded: new Date('2024-10-15'),
          tags: ['safety', 'emergency', 'protocols'],
          version: '1.4'
        }
      ];

      const mockStats: DocumentStats = {
        totalDocuments: 47,
        activeDocuments: 43,
        categoryBreakdown: {
          policies_procedures: 8,
          employee_handbook: 3,
          forms_applications: 12,
          training_materials: 6,
          compliance_documents: 4,
          hr_guidelines: 5,
          safety_documents: 3,
          benefits_information: 2,
          organizational_charts: 2,
          announcements: 1,
          reference_materials: 1,
          templates: 1,
          other: 0
        },
        recentlyUploaded: mockDocuments.slice(0, 5),
        mostDownloaded: mockDocuments.sort((a, b) => b.downloadCount - a.downloadCount).slice(0, 5),
        totalDownloads: 1418,
        documentsUploadedThisMonth: 8,
        storageUsed: 125000000, // ~125MB
        accessLevelBreakdown: {
          all_employees: 35,
          hr_only: 8,
          admin_only: 2,
          managers_only: 2,
          restricted: 0
        }
      };

      setDocuments(mockDocuments);
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to load document data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter(document => {
    const matchesSearch = document.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         document.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         document.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || document.category === selectedCategory;
    const matchesAccess = selectedAccessLevel === 'all' || document.accessLevel === selectedAccessLevel;
    return matchesSearch && matchesCategory && matchesAccess;
  });

  const handleUploadDocument = () => {
    setShowUploadModal(true);
  };

  const handleSaveDocument = (documentData: Partial<SystemDocument>) => {
    // Create new document
    setDocuments(prev => [...prev, documentData as SystemDocument]);
    setShowUploadModal(false);
  };

  const handleDownloadDocument = (document: SystemDocument) => {
    // In a real application, this would trigger the file download
    console.log('Downloading document:', document.name);
    // Increment download count
    setDocuments(prev => prev.map(d =>
      d.id === document.id
        ? { ...d, downloadCount: d.downloadCount + 1, lastDownloaded: new Date() }
        : d
    ));
  };

  const handleDeleteDocument = (documentId: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      setDocuments(prev => prev.filter(d => d.id !== documentId));
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getAccessLevelBadge = (level: string) => {
    const badges = {
      all_employees: 'bg-green-100 text-green-800',
      hr_only: 'bg-blue-100 text-blue-800', 
      admin_only: 'bg-red-100 text-red-800',
      managers_only: 'bg-yellow-100 text-yellow-800',
      restricted: 'bg-gray-100 text-gray-800'
    };
    return badges[level as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const getAccessLevelLabel = (level: string) => {
    const labels = {
      all_employees: 'All Employees',
      hr_only: 'HR Only',
      admin_only: 'Admin Only', 
      managers_only: 'Managers Only',
      restricted: 'Restricted'
    };
    return labels[level as keyof typeof labels] || level;
  };

  const getCategoryIcon = (category: SystemDocumentCategory) => {
    const categoryData = documentCategories.find(c => c.value === category);
    return categoryData?.icon || FileText;
  };

  const getCategoryLabel = (category: SystemDocumentCategory) => {
    const categoryData = documentCategories.find(c => c.value === category);
    return categoryData?.label || category;
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
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
              <p className="text-gray-600 mt-2">Manage system documents for HR and employees</p>
            </div>
            <button
              onClick={handleUploadDocument}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Upload Document
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Templates</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalTemplates}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Templates</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeTemplates}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Download className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Documents Generated</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalDocumentsGenerated}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.documentsGeneratedThisMonth}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'templates', label: 'Templates', icon: FileText },
              { id: 'generated', label: 'Generated Documents', icon: Download },
              { id: 'stats', label: 'Statistics', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {documentCategories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => {
                const CategoryIcon = getCategoryIcon(template.category);
                return (
                  <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="p-2 bg-blue-100 rounded-lg mr-3">
                            <CategoryIcon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                            <p className="text-sm text-gray-600">{getCategoryLabel(template.category)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {template.isDefault && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                          <div className={`w-2 h-2 rounded-full ${template.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 text-sm">{template.description}</p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {template.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                        {template.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{template.tags.length - 3} more
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>Used {template.usage.totalUsed} times</span>
                        <span>v{template.version}</span>
                      </div>

                      <div className="space-y-2">
                        <button
                          onClick={() => handleGenerateDocument(template)}
                          className="w-full px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium flex items-center justify-center"
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          Generate Document
                        </button>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => console.log('Preview template:', template.name)}
                            className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium flex items-center justify-center"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Preview
                          </button>
                          <button
                            onClick={() => handleEditTemplate(template)}
                            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDuplicateTemplate(template)}
                            className="px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredTemplates.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by creating your first document template.'
                  }
                </p>
                <button
                  onClick={handleCreateTemplate}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Template
                </button>
              </div>
            )}
          </div>
        )}

        {/* Generated Documents Tab */}
        {activeTab === 'generated' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="text-center py-12">
              <Download className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Generated Documents</h3>
              <p className="text-gray-500">
                View and manage documents generated from templates.
              </p>
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Breakdown */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Templates by Category</h3>
              <div className="space-y-3">
                {Object.entries(stats.categoryBreakdown).filter(([_, count]) => count > 0).map(([category, count]) => {
                  const CategoryIcon = getCategoryIcon(category as DocumentTemplateCategory);
                  return (
                    <div key={category} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CategoryIcon className="w-4 h-4 text-gray-600 mr-3" />
                        <span className="text-sm text-gray-700">
                          {getCategoryLabel(category as DocumentTemplateCategory)}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Most Used Templates */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Used Templates</h3>
              <div className="space-y-3">
                {stats.mostUsed.map((template, index) => {
                  const CategoryIcon = getCategoryIcon(template.category);
                  return (
                    <div key={template.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-500 mr-3 w-4">#{index + 1}</span>
                        <CategoryIcon className="w-4 h-4 text-gray-600 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{template.name}</p>
                          <p className="text-xs text-gray-500">{getCategoryLabel(template.category)}</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-blue-600">{template.usage.totalUsed} uses</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Template Modal */}
        <TemplateModal
          isOpen={showTemplateModal}
          onClose={() => setShowTemplateModal(false)}
          template={selectedTemplate}
          onSave={handleSaveTemplate}
        />

        {/* Document Generator Modal */}
        {templateToGenerate && (
          <DocumentGenerator
            isOpen={showGenerator}
            onClose={() => setShowGenerator(false)}
            template={templateToGenerate}
          />
        )}
      </div>
    </Layout>
  );
};

export default DocumentManagement;