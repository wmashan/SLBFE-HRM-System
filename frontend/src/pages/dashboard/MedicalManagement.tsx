import React, { useState } from 'react';
import {
  Heart,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
  Download,
  Send,
  X,
  Mail,
  Calendar,
  User,
  DollarSign,
  CheckCheck,
  ArrowRight
} from 'lucide-react';

interface MedicalRequest {
  id: number;
  requestNumber: string;
  employeeNumber: string;
  employeeName: string;
  department: string;
  requestType: string;
  requestTypeName: string;
  treatmentDate: string;
  medicalProvider: string;
  diagnosis: string;
  description: string;
  claimedAmount: number;
  status: 'Pending' | 'DocumentsReceived' | 'UnderReview' | 'Approved' | 'Rejected' | 'ForwardedToOfficer';
  statusName: string;
  submittedDate: string;
  documentsReceived?: boolean;
  documentsReceivedDate?: string;
  reviewedBy?: string;
  reviewedDate?: string;
  reviewComments?: string;
  approvedAmount?: number;
  rejectionReason?: string;
  forwardedTo?: string;
  forwardedDate?: string;
  attachments: string[];
  
  // Employee additional info
  division?: string;
  maritalStatus?: string;
  applicantName?: string;
  
  // Patient info
  patientName?: string;
  relationshipToApplicant?: string;
  patientAge?: number;
  
  // Medical details
  hospitalName?: string;
  doctorName?: string;
  treatmentDuration?: string;
  
  // Financial
  requestedAmount?: number;
  availableAmount?: number;
}

const MedicalManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'documents-received' | 'under-review' | 'approved' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<MedicalRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDocumentsReceivedModal, setShowDocumentsReceivedModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');
  const [reviewComments, setReviewComments] = useState('');
  const [approvedAmount, setApprovedAmount] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  // Mock data
  const [medicalRequests] = useState<MedicalRequest[]>([
    {
      id: 1,
      requestNumber: 'MED20251001',
      employeeNumber: 'E2024001',
      employeeName: 'John Doe',
      department: 'IT Department',
      requestType: 'OutpatientTreatment',
      requestTypeName: 'Outpatient Treatment',
      treatmentDate: '2025-09-25',
      medicalProvider: 'Asiri Central Hospital',
      diagnosis: 'Dengue Fever',
      description: 'Emergency outpatient treatment for dengue fever including blood tests and medications',
      claimedAmount: 15000,
      requestedAmount: 15000,
      availableAmount: 35000,
      status: 'Pending',
      statusName: 'Pending - Awaiting Documents',
      submittedDate: '2025-09-26',
      documentsReceived: false,
      attachments: ['medical-bill-sep-2024.pdf', 'lab-report.pdf'],
      division: 'Information Technology',
      applicantName: 'John Doe',
      maritalStatus: 'Married',
      patientName: 'Jane Doe',
      relationshipToApplicant: 'Spouse',
      patientAge: 32,
      hospitalName: 'Asiri Central Hospital',
      doctorName: 'Dr. Silva',
      treatmentDuration: '3 days'
    },
    {
      id: 2,
      requestNumber: 'MED20251002',
      employeeNumber: 'E2024012',
      employeeName: 'Sarah Wilson',
      department: 'HR Department',
      requestType: 'Prescription',
      requestTypeName: 'Prescription',
      treatmentDate: '2025-08-15',
      medicalProvider: 'Durdans Hospital',
      diagnosis: 'Hypertension',
      description: 'Monthly prescription medication for hypertension management',
      claimedAmount: 8500,
      requestedAmount: 9000,
      availableAmount: 42000,
      status: 'DocumentsReceived',
      statusName: 'Documents Received',
      submittedDate: '2025-08-16',
      documentsReceived: true,
      documentsReceivedDate: '2025-09-28',
      attachments: ['prescription-aug-2024.pdf', 'hr-f-07.pdf', 'hr-f-08.pdf'],
      division: 'Human Resources',
      applicantName: 'Sarah Wilson',
      maritalStatus: 'Unmarried',
      patientName: 'Sarah Wilson',
      relationshipToApplicant: 'Self',
      patientAge: 35,
      hospitalName: 'Durdans Hospital',
      doctorName: 'Dr. Perera',
      treatmentDuration: '1 day'
    },
    {
      id: 3,
      requestNumber: 'MED20251003',
      employeeNumber: 'E2024020',
      employeeName: 'Mike Johnson',
      department: 'Finance Department',
      requestType: 'DentalTreatment',
      requestTypeName: 'Dental Treatment',
      treatmentDate: '2025-06-10',
      medicalProvider: 'Smile Care Dental Clinic',
      diagnosis: 'Dental Cavity Filling',
      description: 'Tooth filling and routine dental checkup',
      claimedAmount: 12000,
      requestedAmount: 12000,
      availableAmount: 38000,
      status: 'Approved',
      statusName: 'Approved - Forwarded',
      submittedDate: '2025-06-11',
      documentsReceived: true,
      documentsReceivedDate: '2025-06-13',
      reviewedBy: 'HR Manager',
      reviewedDate: '2025-06-14',
      reviewComments: 'Approved as per medical policy. All documents verified.',
      approvedAmount: 10500,
      forwardedTo: 'Senior Finance Officer',
      forwardedDate: '2025-06-14',
      attachments: ['dental-receipt.pdf', 'hr-f-07.pdf', 'hr-f-08.pdf']
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'forwardedtoofficer':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'documentsreceived':
        return <CheckCheck className="w-5 h-5 text-blue-500" />;
      case 'pending':
      case 'underreview':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'forwardedtoofficer':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'documentsreceived':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'underreview':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return `LKR ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const filteredRequests = medicalRequests.filter((request) => {
    const matchesSearch = 
      request.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = 
      activeTab === 'all' ||
      (activeTab === 'pending' && request.status === 'Pending') ||
      (activeTab === 'documents-received' && request.status === 'DocumentsReceived') ||
      (activeTab === 'under-review' && request.status === 'UnderReview') ||
      (activeTab === 'approved' && (request.status === 'Approved' || request.status === 'ForwardedToOfficer')) ||
      (activeTab === 'rejected' && request.status === 'Rejected');
    
    return matchesSearch && matchesTab;
  });

  const handleViewDetails = (request: MedicalRequest) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleDocumentsReceived = (request: MedicalRequest) => {
    setSelectedRequest(request);
    setShowDocumentsReceivedModal(true);
  };

  const handleReview = (request: MedicalRequest, action: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setReviewAction(action);
    setReviewComments('');
    setApprovedAmount(request.claimedAmount.toString());
    setRejectionReason('');
    setShowReviewModal(true);
  };

  const handleConfirmDocumentsReceived = () => {
    console.log('Documents received confirmed for:', selectedRequest);
    // TODO: API call to update status
    setShowDocumentsReceivedModal(false);
    setSelectedRequest(null);
  };

  const handleConfirmReview = () => {
    console.log('Review confirmed:', {
      request: selectedRequest,
      action: reviewAction,
      comments: reviewComments,
      approvedAmount: reviewAction === 'approve' ? approvedAmount : null,
      rejectionReason: reviewAction === 'reject' ? rejectionReason : null
    });
    // TODO: API call to update status
    setShowReviewModal(false);
    setSelectedRequest(null);
  };

  const getTabCount = (tab: string) => {
    switch (tab) {
      case 'all':
        return medicalRequests.length;
      case 'pending':
        return medicalRequests.filter(r => r.status === 'Pending').length;
      case 'documents-received':
        return medicalRequests.filter(r => r.status === 'DocumentsReceived').length;
      case 'under-review':
        return medicalRequests.filter(r => r.status === 'UnderReview').length;
      case 'approved':
        return medicalRequests.filter(r => r.status === 'Approved' || r.status === 'ForwardedToOfficer').length;
      case 'rejected':
        return medicalRequests.filter(r => r.status === 'Rejected').length;
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Medical Claims Management</h2>
          <p className="text-sm text-gray-600 mt-1">Review and process employee medical claim requests</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800">Pending Documents</p>
              <p className="text-2xl font-bold text-yellow-900">{getTabCount('pending')}</p>
            </div>
            <Clock className="w-10 h-10 text-yellow-500 opacity-50" />
          </div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Documents Received</p>
              <p className="text-2xl font-bold text-blue-900">{getTabCount('documents-received')}</p>
            </div>
            <CheckCheck className="w-10 h-10 text-blue-500 opacity-50" />
          </div>
        </div>

        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">Approved</p>
              <p className="text-2xl font-bold text-green-900">{getTabCount('approved')}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500 opacity-50" />
          </div>
        </div>

        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-800">Rejected</p>
              <p className="text-2xl font-bold text-red-900">{getTabCount('rejected')}</p>
            </div>
            <XCircle className="w-10 h-10 text-red-500 opacity-50" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by request number, employee name, or employee number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'all', label: 'All Requests' },
            { key: 'pending', label: 'Pending Documents' },
            { key: 'documents-received', label: 'Documents Received' },
            { key: 'under-review', label: 'Under Review' },
            { key: 'approved', label: 'Approved' },
            { key: 'rejected', label: 'Rejected' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.key ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {getTabCount(tab.key)}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No medical requests found</h3>
            <p className="text-gray-600">No requests match your current filters</p>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Heart className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{request.requestTypeName}</h3>
                    <p className="text-sm text-gray-600">Request #: {request.requestNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(request.status)}
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(request.status)}`}>
                    {request.statusName}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Employee</p>
                    <p className="text-sm font-medium text-gray-900">{request.employeeName}</p>
                    <p className="text-xs text-gray-600">{request.employeeNumber}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Treatment Date</p>
                    <p className="text-sm font-medium text-gray-900">{new Date(request.treatmentDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Claimed Amount</p>
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(request.claimedAmount)}</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Medical Provider:</span> {request.medicalProvider}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Diagnosis:</span> {request.diagnosis}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleViewDetails(request)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>

                {request.status === 'Pending' && !request.documentsReceived && (
                  <button
                    onClick={() => handleDocumentsReceived(request)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <CheckCheck className="w-4 h-4" />
                    Mark Documents Received
                  </button>
                )}

                {request.status === 'DocumentsReceived' && (
                  <>
                    <button
                      onClick={() => handleReview(request, 'approve')}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReview(request, 'reject')}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* View Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Medical Request Details</h3>
                <p className="text-sm text-gray-600">Request #: {selectedRequest.requestNumber}</p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                {getStatusIcon(selectedRequest.status)}
                <div>
                  <p className="text-sm font-medium text-gray-700">Current Status</p>
                  <p className={`text-lg font-semibold ${getStatusColor(selectedRequest.status).replace('bg-', 'text-').replace('-100', '-600')}`}>
                    {selectedRequest.statusName}
                  </p>
                </div>
              </div>

              {/* Employee Information */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h4 className="text-sm font-semibold text-blue-900 mb-3">Employee Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Employee Number</p>
                    <p className="text-sm font-medium text-gray-900">{selectedRequest.employeeNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Full Name</p>
                    <p className="text-sm font-medium text-gray-900">{selectedRequest.employeeName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Department</p>
                    <p className="text-sm font-medium text-gray-900">{selectedRequest.department}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Division</p>
                    <p className="text-sm font-medium text-gray-900">{selectedRequest.division}</p>
                  </div>
                </div>
              </div>

              {/* Patient Information */}
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                <h4 className="text-sm font-semibold text-purple-900 mb-3">Patient Information</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Patient Name</p>
                    <p className="text-sm font-medium text-gray-900">{selectedRequest.patientName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Relationship</p>
                    <p className="text-sm font-medium text-gray-900">{selectedRequest.relationshipToApplicant}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Age</p>
                    <p className="text-sm font-medium text-gray-900">{selectedRequest.patientAge} years</p>
                  </div>
                </div>
              </div>

              {/* Medical Details */}
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                <h4 className="text-sm font-semibold text-orange-900 mb-3">Medical Treatment Details</h4>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-600">Hospital/Clinic</p>
                    <p className="text-sm font-medium text-gray-900">{selectedRequest.hospitalName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Doctor Name</p>
                    <p className="text-sm font-medium text-gray-900">{selectedRequest.doctorName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Treatment Date</p>
                    <p className="text-sm font-medium text-gray-900">{new Date(selectedRequest.treatmentDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Duration</p>
                    <p className="text-sm font-medium text-gray-900">{selectedRequest.treatmentDuration}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Diagnosis</p>
                  <p className="text-sm font-medium text-gray-900 bg-white p-3 rounded mt-1">{selectedRequest.diagnosis}</p>
                </div>
                <div className="mt-3">
                  <p className="text-xs text-gray-600">Description</p>
                  <p className="text-sm font-medium text-gray-900 bg-white p-3 rounded mt-1">{selectedRequest.description}</p>
                </div>
              </div>

              {/* Financial Details */}
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <h4 className="text-sm font-semibold text-green-900 mb-3">Financial Details</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-600">Requested Amount</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(selectedRequest.requestedAmount || 0)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Claimed Amount</p>
                    <p className="text-lg font-bold text-orange-600">{formatCurrency(selectedRequest.claimedAmount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Available Amount</p>
                    <p className="text-lg font-bold text-green-600">{formatCurrency(selectedRequest.availableAmount || 0)}</p>
                  </div>
                </div>
                {selectedRequest.approvedAmount && (
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <p className="text-xs text-gray-600">Approved Amount</p>
                    <p className="text-lg font-bold text-green-600">{formatCurrency(selectedRequest.approvedAmount)}</p>
                  </div>
                )}
              </div>

              {/* Documents */}
              {selectedRequest.attachments && selectedRequest.attachments.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Attachments</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedRequest.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">{attachment}</span>
                        <button className="text-blue-600 hover:text-blue-500">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Review History */}
              {(selectedRequest.reviewComments || selectedRequest.rejectionReason) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Review History</h4>
                  {selectedRequest.reviewComments && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-600">Comments</p>
                      <p className="text-sm text-gray-900 mt-1">{selectedRequest.reviewComments}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        By {selectedRequest.reviewedBy} on {selectedRequest.reviewedDate && new Date(selectedRequest.reviewedDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {selectedRequest.rejectionReason && (
                    <div className="bg-red-50 p-3 rounded border border-red-200">
                      <p className="text-xs text-red-600 font-medium">Rejection Reason</p>
                      <p className="text-sm text-red-900 mt-1">{selectedRequest.rejectionReason}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 sticky bottom-0">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Documents Received Modal */}
      {showDocumentsReceivedModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Confirm Documents Received</h3>
              <button
                onClick={() => setShowDocumentsReceivedModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg mb-6">
                <Mail className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Employee will be notified</h4>
                  <p className="text-sm text-blue-700">
                    {selectedRequest.employeeName} will receive an email notification that their physical documents have been received and are under review.
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Request Number:</span>
                  <span className="text-sm font-medium text-gray-900">{selectedRequest.requestNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Employee:</span>
                  <span className="text-sm font-medium text-gray-900">{selectedRequest.employeeName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Claimed Amount:</span>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(selectedRequest.claimedAmount)}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDocumentsReceivedModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDocumentsReceived}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Confirm & Notify
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal (Approve/Reject) */}
      {showReviewModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {reviewAction === 'approve' ? 'Approve Medical Request' : 'Reject Medical Request'}
              </h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Request Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Request Summary</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-600">Request Number</p>
                    <p className="text-sm font-medium text-gray-900">{selectedRequest.requestNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Employee</p>
                    <p className="text-sm font-medium text-gray-900">{selectedRequest.employeeName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Claimed Amount</p>
                    <p className="text-sm font-medium text-gray-900">{formatCurrency(selectedRequest.claimedAmount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Treatment Type</p>
                    <p className="text-sm font-medium text-gray-900">{selectedRequest.requestTypeName}</p>
                  </div>
                </div>
              </div>

              {reviewAction === 'approve' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Approved Amount (LKR) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={approvedAmount}
                      onChange={(e) => setApprovedAmount(e.target.value)}
                      min="0"
                      max={selectedRequest.claimedAmount}
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter approved amount"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Maximum claimable: {formatCurrency(selectedRequest.claimedAmount)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Review Comments
                    </label>
                    <textarea
                      value={reviewComments}
                      onChange={(e) => setReviewComments(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Add any comments or notes about this approval..."
                    />
                  </div>

                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                    <div className="flex items-start gap-3">
                      <ArrowRight className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-900 mb-1">Next Step</h4>
                        <p className="text-sm text-green-700">
                          After approval, this request will be forwarded to the Senior Finance Officer for payment processing. 
                          The employee will be notified via email about the approval.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rejection Reason <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      rows={4}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      placeholder="Provide a clear reason for rejection..."
                    />
                  </div>

                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-900 mb-1">Employee Notification</h4>
                        <p className="text-sm text-red-700">
                          The employee will be notified via email about the rejection with the reason you provide above.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReview}
                  disabled={
                    (reviewAction === 'approve' && !approvedAmount) ||
                    (reviewAction === 'reject' && !rejectionReason.trim())
                  }
                  className={`flex-1 px-4 py-2 text-white rounded-lg flex items-center justify-center gap-2 ${
                    reviewAction === 'approve'
                      ? 'bg-green-600 hover:bg-green-700 disabled:bg-green-300'
                      : 'bg-red-600 hover:bg-red-700 disabled:bg-red-300'
                  } disabled:cursor-not-allowed`}
                >
                  {reviewAction === 'approve' ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Approve & Forward
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      Reject Request
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalManagement;
