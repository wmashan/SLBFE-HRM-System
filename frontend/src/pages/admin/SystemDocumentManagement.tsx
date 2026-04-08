// System Document Management - Admin Portal for HR Forms & System Documents

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
  Calendar,
  Users,
  BarChart3,
  FolderOpen,
  Shield,
  Building,
  BookOpen,
  AlertTriangle,
  TrendingUp,
  File,
  Lock,
  Globe,
  X,
  CheckCircle,
  Save
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import { 
  SystemDocument, 
  SystemDocumentCategory,
  DocumentStats,
  DocumentAccessLevel,
  DocumentUploadData
} from '../../types';

const SystemDocumentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'documents' | 'upload' | 'stats'>('documents');
  const [documents, setDocuments] = useState<SystemDocument[]>([]);
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SystemDocumentCategory | 'all'>('all');
  const [selectedAccessLevel, setSelectedAccessLevel] = useState<DocumentAccessLevel | 'all'>('all');
  const [showSystemForms, setShowSystemForms] = useState<boolean | 'all'>('all');
  
  // Upload form state
  const [uploadData, setUploadData] = useState<Partial<DocumentUploadData>>({
    name: '',
    description: '',
    category: 'hr_forms',
    accessLevel: 'all_employees',
    tags: [],
    isSystemForm: false,
    formCode: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const documentCategories: Array<{
    value: SystemDocumentCategory;
    label: string;
    icon: React.ComponentType<any>;
    description: string;
  }> = [
    { 
      value: 'hr_forms', 
      label: 'HR Forms', 
      icon: FileText,
      description: 'Official HR forms like HR/F/07, HR/F/08, etc.'
    },
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
      label: 'Application Forms', 
      icon: File,
      description: 'Leave, transfer, and other application forms'
    },
    { 
      value: 'training_materials', 
      label: 'Training Materials', 
      icon: BookOpen,
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
    { value: 'all_employees', label: 'All Employees', icon: Globe, color: 'bg-green-100 text-green-800' },
    { value: 'hr_only', label: 'HR Only', icon: Users, color: 'bg-blue-100 text-blue-800' },
    { value: 'admin_only', label: 'Admin Only', icon: Shield, color: 'bg-red-100 text-red-800' },
    { value: 'managers_only', label: 'Managers Only', icon: Building, color: 'bg-purple-100 text-purple-800' },
    { value: 'restricted', label: 'Restricted', icon: Lock, color: 'bg-orange-100 text-orange-800' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Mock data with HR forms and system documents
      const mockDocuments: SystemDocument[] = [
        {
          id: '1',
          name: 'Medical Claim Form (HR/F/07)',
          description: 'Official medical claim application form',
          category: 'hr_forms',
          fileType: 'pdf',
          fileName: 'HR_F_07_Medical_Claim_Form.pdf',
          filePath: '/documents/hr_forms/HR_F_07.pdf',
          fileSize: 245783,
          isActive: true,
          accessLevel: 'all_employees',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-09-20'),
          uploadedBy: 'admin@slbfe.lk',
          lastModifiedBy: 'hr@slbfe.lk',
          downloadCount: 1247,
          lastDownloaded: new Date('2024-10-17'),
          tags: ['medical', 'claim', 'form', 'HR/F/07'],
          version: '3.2',
          isSystemForm: true,
          formCode: 'HR/F/07'
        },
        {
          id: '2',
          name: 'Medical Certificate Form (HR/F/08)',
          description: 'Medical certificate form to be filled by doctor',
          category: 'hr_forms',
          fileType: 'pdf',
          fileName: 'HR_F_08_Medical_Certificate.pdf',
          filePath: '/documents/hr_forms/HR_F_08.pdf',
          fileSize: 189234,
          isActive: true,
          accessLevel: 'all_employees',
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-08-15'),
          uploadedBy: 'admin@slbfe.lk',
          lastModifiedBy: 'admin@slbfe.lk',
          downloadCount: 892,
          lastDownloaded: new Date('2024-10-17'),
          tags: ['medical', 'certificate', 'doctor', 'HR/F/08'],
          version: '2.1',
          isSystemForm: true,
          formCode: 'HR/F/08'
        },
        {
          id: '3',
          name: 'Leave Application Form',
          description: 'Standard form for requesting leave from work',
          category: 'forms_applications',
          fileType: 'docx',
          fileName: 'Leave_Application_Form.docx',
          filePath: '/documents/forms/leave_application.docx',
          fileSize: 156743,
          isActive: true,
          accessLevel: 'all_employees',
          createdAt: new Date('2024-02-10'),
          updatedAt: new Date('2024-08-15'),
          uploadedBy: 'admin@slbfe.lk',
          lastModifiedBy: 'admin@slbfe.lk',
          downloadCount: 543,
          lastDownloaded: new Date('2024-10-16'),
          tags: ['leave', 'application', 'form'],
          version: '1.5',
          isSystemForm: false
        },
        {
          id: '4',
          name: 'Transfer Application Form',
          description: 'Form for requesting job transfer or relocation',
          category: 'forms_applications',
          fileType: 'pdf',
          fileName: 'Transfer_Application_Form.pdf',
          filePath: '/documents/forms/transfer_application.pdf',
          fileSize: 234567,
          isActive: true,
          accessLevel: 'all_employees',
          createdAt: new Date('2024-03-05'),
          updatedAt: new Date('2024-07-20'),
          uploadedBy: 'admin@slbfe.lk',
          lastModifiedBy: 'hr@slbfe.lk',
          downloadCount: 289,
          lastDownloaded: new Date('2024-10-12'),
          tags: ['transfer', 'application', 'relocation'],
          version: '1.3',
          isSystemForm: false
        },
        {
          id: '5',
          name: 'Employee Handbook 2024',
          description: 'Comprehensive guide for all employees',
          category: 'employee_handbook',
          fileType: 'pdf',
          fileName: 'Employee_Handbook_2024.pdf',
          filePath: '/documents/handbook/employee_handbook_2024.pdf',
          fileSize: 2547832,
          isActive: true,
          accessLevel: 'all_employees',
          createdAt: new Date('2024-01-01'),
          updatedAt: new Date('2024-09-01'),
          uploadedBy: 'admin@slbfe.lk',
          lastModifiedBy: 'hr@slbfe.lk',
          downloadCount: 156,
          lastDownloaded: new Date('2024-10-15'),
          tags: ['handbook', 'policies', 'guidelines'],
          version: '2024.1',
          isSystemForm: false
        }
      ];

      const mockStats: DocumentStats = {
        totalDocuments: 47,
        activeDocuments: 45,
        categoryBreakdown: {
          hr_forms: 12,
          policies_procedures: 8,
          employee_handbook: 3,
          forms_applications: 9,
          training_materials: 6,
          compliance_documents: 4,
          hr_guidelines: 3,
          safety_documents: 2,
          benefits_information: 0,
          organizational_charts: 0,
          announcements: 0,
          reference_materials: 0,
          templates: 0,
          other: 0
        },
        recentlyUploaded: mockDocuments.slice(0, 3),
        mostDownloaded: mockDocuments.sort((a, b) => b.downloadCount - a.downloadCount).slice(0, 3),
        totalDownloads: 3127,
        documentsUploadedThisMonth: 8,
        storageUsed: 125000000,
        accessLevelBreakdown: {
          all_employees: 40,
          hr_only: 5,
          admin_only: 2,
          managers_only: 0,
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
    const matchesSystemForm = showSystemForms === 'all' || 
                              (showSystemForms === true && document.isSystemForm) ||
                              (showSystemForms === false && !document.isSystemForm);
    return matchesSearch && matchesCategory && matchesAccess && matchesSystemForm;
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!uploadData.name) {
        setUploadData(prev => ({ 
          ...prev, 
          name: file.name.split('.')[0].replace(/[_-]/g, ' ')
        }));
      }
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile || !uploadData.name || !uploadData.description) {
      alert('Please fill in all required fields and select a file.');
      return;
    }

    try {
      // Mock upload API call
      const newDocument: SystemDocument = {
        id: Date.now().toString(),
        name: uploadData.name!,
        description: uploadData.description!,
        category: uploadData.category!,
        fileType: selectedFile.name.split('.').pop() as any,
        fileName: selectedFile.name,
        filePath: `/documents/${uploadData.category}/${selectedFile.name}`,
        fileSize: selectedFile.size,
        isActive: true,
        accessLevel: uploadData.accessLevel!,
        createdAt: new Date(),
        updatedAt: new Date(),
        uploadedBy: 'admin@slbfe.lk',
        lastModifiedBy: 'admin@slbfe.lk',
        downloadCount: 0,
        tags: uploadData.tags || [],
        version: '1.0',
        isSystemForm: uploadData.isSystemForm || false,
        formCode: uploadData.formCode
      };

      setDocuments(prev => [newDocument, ...prev]);
      
      // Reset form
      setUploadData({
        name: '',
        description: '',
        category: 'hr_forms',
        accessLevel: 'all_employees',
        tags: [],
        isSystemForm: false,
        formCode: ''
      });
      setSelectedFile(null);
      setUploadSuccess(true);
      
      // Auto-hide success message
      setTimeout(() => setUploadSuccess(false), 3000);
      
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    }
  };

  const handleDeleteDocument = (documentId: string) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      setDocuments(prev => prev.filter(d => d.id !== documentId));
    }
  };

  const handleDownloadDocument = (document: SystemDocument) => {
    // Mock download functionality
    console.log('Downloading:', document.name);
    setDocuments(prev => prev.map(d =>
      d.id === document.id
        ? { ...d, downloadCount: d.downloadCount + 1, lastDownloaded: new Date() }
        : d
    ));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getAccessLevelBadge = (level: DocumentAccessLevel) => {
    const accessLevel = accessLevels.find(a => a.value === level);
    return accessLevel ? accessLevel.color : 'bg-gray-100 text-gray-800';
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
              <p className="text-gray-600 mt-2">Manage system documents and HR forms</p>
            </div>
            <button
              onClick={() => setActiveTab('upload')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Upload Document
            </button>
          </div>
        </div>

        {/* Success Message */}
        {uploadSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <span className="text-green-800">Document uploaded successfully!</span>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Documents</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalDocuments}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Documents</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeDocuments}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Download className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Downloads</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalDownloads}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{stats.documentsUploadedThisMonth}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'documents', label: 'All Documents', icon: FileText },
              { id: 'upload', label: 'Upload Document', icon: Upload },
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

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
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

                <select
                  value={selectedAccessLevel}
                  onChange={(e) => setSelectedAccessLevel(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Access Levels</option>
                  {accessLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>

                <select
                  value={showSystemForms.toString()}
                  onChange={(e) => setShowSystemForms(e.target.value === 'all' ? 'all' : e.target.value === 'true')}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Documents</option>
                  <option value="true">System Forms Only</option>
                  <option value="false">Regular Documents</option>
                </select>
              </div>
            </div>

            {/* Documents List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map((document) => {
                const CategoryIcon = getCategoryIcon(document.category);
                return (
                  <div key={document.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className="p-2 bg-blue-100 rounded-lg mr-3">
                            <CategoryIcon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">{document.name}</h3>
                            <p className="text-sm text-gray-600">{getCategoryLabel(document.category)}</p>
                            {document.isSystemForm && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1">
                                {document.formCode || 'System Form'}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${document.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                      </div>

                      <p className="text-gray-700 mb-4 text-sm">{document.description}</p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {document.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                        {document.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{document.tags.length - 3}
                          </span>
                        )}
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Downloads:</span>
                          <span className="font-medium">{document.downloadCount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Size:</span>
                          <span className="font-medium">{formatFileSize(document.fileSize)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Access:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAccessLevelBadge(document.accessLevel)}`}>
                            {accessLevels.find(a => a.value === document.accessLevel)?.label}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleDownloadDocument(document)}
                          className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium flex items-center justify-center"
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </button>
                        
                        <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <button className="px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        
                        <button 
                          onClick={() => handleDeleteDocument(document.id)}
                          className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredDocuments.length === 0 && (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by uploading your first document.'
                  }
                </p>
                <button
                  onClick={() => setActiveTab('upload')}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Document
                </button>
              </div>
            )}
          </div>
        )}

        {/* Upload Tab */}
        {activeTab === 'upload' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Upload New Document</h3>
              
              <div className="space-y-6">
                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select File <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {selectedFile ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="w-8 h-8 text-blue-600 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900">{selectedFile.name}</p>
                            <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedFile(null)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <label className="cursor-pointer">
                          <span className="text-blue-600 hover:text-blue-500">Click to upload</span>
                          <span className="text-gray-500"> or drag and drop</span>
                          <input
                            type="file"
                            onChange={handleFileUpload}
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.txt"
                            className="hidden"
                          />
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                          PDF, DOC, DOCX, XLS, XLSX, JPG, PNG, TXT up to 10MB
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Document Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={uploadData.name || ''}
                    onChange={(e) => setUploadData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter document name"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={uploadData.description || ''}
                    onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter document description"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={uploadData.category}
                    onChange={(e) => setUploadData(prev => ({ ...prev, category: e.target.value as SystemDocumentCategory }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {documentCategories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Access Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Access Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={uploadData.accessLevel}
                    onChange={(e) => setUploadData(prev => ({ ...prev, accessLevel: e.target.value as DocumentAccessLevel }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {accessLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* System Form Settings */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      id="isSystemForm"
                      checked={uploadData.isSystemForm || false}
                      onChange={(e) => setUploadData(prev => ({ ...prev, isSystemForm: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isSystemForm" className="ml-2 text-sm font-medium text-gray-700">
                      This is a system form (HR/F/xx)
                    </label>
                  </div>
                  
                  {uploadData.isSystemForm && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Form Code (e.g., HR/F/07, HR/F/08)
                      </label>
                      <input
                        type="text"
                        value={uploadData.formCode || ''}
                        onChange={(e) => setUploadData(prev => ({ ...prev, formCode: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="HR/F/07"
                      />
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={uploadData.tags?.join(', ') || ''}
                    onChange={(e) => setUploadData(prev => ({ 
                      ...prev, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="form, medical, application"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setActiveTab('documents')}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUploadSubmit}
                    disabled={!selectedFile || !uploadData.name || !uploadData.description}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Upload Document
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && stats && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Breakdown */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents by Category</h3>
              <div className="space-y-3">
                {Object.entries(stats.categoryBreakdown)
                  .filter(([_, count]) => count > 0)
                  .sort(([,a], [,b]) => b - a)
                  .map(([category, count]) => {
                    const CategoryIcon = getCategoryIcon(category as SystemDocumentCategory);
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <CategoryIcon className="w-4 h-4 text-gray-600 mr-3" />
                          <span className="text-sm text-gray-700">
                            {getCategoryLabel(category as SystemDocumentCategory)}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{count}</span>
                      </div>
                    );
                })}
              </div>
            </div>

            {/* Most Downloaded Documents */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Downloaded</h3>
              <div className="space-y-3">
                {stats.mostDownloaded.map((document, index) => {
                  const CategoryIcon = getCategoryIcon(document.category);
                  return (
                    <div key={document.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-500 mr-3 w-4">#{index + 1}</span>
                        <CategoryIcon className="w-4 h-4 text-gray-600 mr-3" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{document.name}</p>
                          <p className="text-xs text-gray-500">{getCategoryLabel(document.category)}</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-blue-600 ml-2">{document.downloadCount}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Access Level Breakdown */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Access Level Distribution</h3>
              <div className="space-y-3">
                {Object.entries(stats.accessLevelBreakdown)
                  .filter(([_, count]) => count > 0)
                  .sort(([,a], [,b]) => b - a)
                  .map(([level, count]) => {
                    const accessLevel = accessLevels.find(a => a.value === level);
                    const Icon = accessLevel?.icon || Globe;
                    return (
                      <div key={level} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Icon className="w-4 h-4 text-gray-600 mr-3" />
                          <span className="text-sm text-gray-700">
                            {accessLevel?.label || level}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{count}</span>
                      </div>
                    );
                })}
              </div>
            </div>

            {/* Storage Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Storage Information</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Total Storage Used</span>
                  <span className="text-sm font-medium text-gray-900">{formatFileSize(stats.storageUsed)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Average File Size</span>
                  <span className="text-sm font-medium text-gray-900">
                    {stats.totalDocuments > 0 ? formatFileSize(stats.storageUsed / stats.totalDocuments) : '0 B'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SystemDocumentManagement;