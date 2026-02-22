import { useState } from 'react';
import { 
  MapPin, 
  Plus, 
  X, 
  Clock, 
  CheckCircle, 
  XCircle,
  FileText,
  Upload,
  Eye,
  Download,
  Trash2,
  Calendar,
  Building2
} from 'lucide-react';

// TypeScript Interfaces
interface TransferRequest {
  transferRequestId: number;
  employeeId: string;
  employeeName: string;
  currentBranch: string;
  requestedBranch: string;
  requestedDate: string;
  submittedDate: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approvedBy?: string;
  approvedDate?: string;
  remarks?: string;
  documents: TransferDocument[];
}

interface TransferDocument {
  documentId: number;
  fileName: string;
  fileSize: string;
  uploadedDate: string;
  fileType: string;
}

interface Branch {
  branchId: number;
  branchName: string;
  location: string;
  code: string;
}

const EmployeeTransferRequest = () => {
  const [activeTab, setActiveTab] = useState<'requests' | 'new'>('requests');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedRequest, setSelectedRequest] = useState<TransferRequest | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    requestedBranch: '',
    requestedDate: '',
    reason: '',
    documents: [] as File[]
  });

  // Dummy data - Available branches
  const branches: Branch[] = [
    { branchId: 1, branchName: 'Colombo Main Branch', location: 'Colombo', code: 'CMB-001' },
    { branchId: 2, branchName: 'Kandy Branch', location: 'Kandy', code: 'KDY-001' },
    { branchId: 3, branchName: 'Galle Branch', location: 'Galle', code: 'GLE-001' },
    { branchId: 4, branchName: 'Jaffna Branch', location: 'Jaffna', code: 'JFN-001' },
    { branchId: 5, branchName: 'Anuradhapura Branch', location: 'Anuradhapura', code: 'ANU-001' },
    { branchId: 6, branchName: 'Kurunegala Branch', location: 'Kurunegala', code: 'KRN-001' },
    { branchId: 7, branchName: 'Matara Branch', location: 'Matara', code: 'MTR-001' },
    { branchId: 8, branchName: 'Ratnapura Branch', location: 'Ratnapura', code: 'RTN-001' },
    { branchId: 9, branchName: 'Batticaloa Branch', location: 'Batticaloa', code: 'BTC-001' },
    { branchId: 10, branchName: 'Negombo Branch', location: 'Negombo', code: 'NGB-001' }
  ];

  // Dummy data - Transfer requests
  const transferRequests: TransferRequest[] = [
    {
      transferRequestId: 1,
      employeeId: 'EMP001',
      employeeName: 'John Silva',
      currentBranch: 'Colombo Main Branch',
      requestedBranch: 'Kandy Branch',
      requestedDate: '2026-03-01',
      submittedDate: '2026-01-15',
      reason: 'Family relocation to Kandy area. Seeking transfer to maintain work-life balance and reduce commute time.',
      status: 'Approved',
      approvedBy: 'HR Manager - Sarah Fernando',
      approvedDate: '2026-01-20',
      remarks: 'Transfer approved. Please coordinate with Kandy branch for onboarding.',
      documents: [
        { documentId: 1, fileName: 'Family_Certificate.pdf', fileSize: '245 KB', uploadedDate: '2026-01-15', fileType: 'PDF' },
        { documentId: 2, fileName: 'Residence_Proof.pdf', fileSize: '189 KB', uploadedDate: '2026-01-15', fileType: 'PDF' }
      ]
    },
    {
      transferRequestId: 2,
      employeeId: 'EMP001',
      employeeName: 'John Silva',
      currentBranch: 'Colombo Main Branch',
      requestedBranch: 'Galle Branch',
      requestedDate: '2026-04-01',
      submittedDate: '2026-01-20',
      reason: 'Career development opportunity. Interested in gaining experience in regional operations.',
      status: 'Pending',
      documents: [
        { documentId: 3, fileName: 'Career_Development_Plan.pdf', fileSize: '312 KB', uploadedDate: '2026-01-20', fileType: 'PDF' }
      ]
    },
    {
      transferRequestId: 3,
      employeeId: 'EMP001',
      employeeName: 'John Silva',
      currentBranch: 'Colombo Main Branch',
      requestedBranch: 'Jaffna Branch',
      requestedDate: '2025-12-01',
      submittedDate: '2025-11-10',
      reason: 'Personal reasons and preference for working in hometown region.',
      status: 'Rejected',
      approvedBy: 'HR Manager - Sarah Fernando',
      approvedDate: '2025-11-18',
      remarks: 'Unable to accommodate at this time due to staffing requirements in current location.',
      documents: []
    },
    {
      transferRequestId: 4,
      employeeId: 'EMP001',
      employeeName: 'John Silva',
      currentBranch: 'Colombo Main Branch',
      requestedBranch: 'Negombo Branch',
      requestedDate: '2026-02-15',
      submittedDate: '2026-01-25',
      reason: 'Health reasons requiring relocation to coastal area as per medical advice.',
      status: 'Pending',
      documents: [
        { documentId: 4, fileName: 'Medical_Certificate.pdf', fileSize: '156 KB', uploadedDate: '2026-01-25', fileType: 'PDF' },
        { documentId: 5, fileName: 'Doctor_Recommendation.pdf', fileSize: '198 KB', uploadedDate: '2026-01-25', fileType: 'PDF' }
      ]
    }
  ];

  // Filter requests based on status
  const filteredRequests = transferRequests.filter(request => {
    if (filterStatus === 'all') return true;
    return request.status.toLowerCase() === filterStatus;
  });

  // Get status badge
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock },
      Approved: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle },
      Rejected: { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
        <Icon className="w-4 h-4 mr-1" />
        {status}
      </span>
    );
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents, ...newFiles]
      }));
    }
  };

  // Remove file from upload list
  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Transfer request submitted:', formData);
    // Reset form
    setFormData({
      requestedBranch: '',
      requestedDate: '',
      reason: '',
      documents: []
    });
    setIsApplyModalOpen(false);
    alert('Transfer request submitted successfully!');
  };

  // View request details
  const viewDetails = (request: TransferRequest) => {
    setSelectedRequest(request);
    setIsDetailsModalOpen(true);
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Transfer Requests</h2>
          <p className="text-gray-600 mt-1">Manage your branch transfer requests</p>
        </div>
        <button
          onClick={() => setIsApplyModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Transfer Request
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">{transferRequests.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 mt-2">
                {transferRequests.filter(r => r.status === 'Pending').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600 mt-2">
                {transferRequests.filter(r => r.status === 'Approved').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600 mt-2">
                {transferRequests.filter(r => r.status === 'Rejected').length}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Requests
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'approved'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilterStatus('rejected')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'rejected'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Rejected
          </button>
        </div>
      </div>

      {/* Transfer Requests List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Branch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requested Branch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Requested Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <tr key={request.transferRequestId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      TR-{String(request.transferRequestId).padStart(4, '0')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900">{request.currentBranch}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-blue-500 mr-2" />
                        <span className="text-sm font-medium text-gray-900">{request.requestedBranch}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        {new Date(request.requestedDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.submittedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => viewDetails(request)}
                        className="text-blue-600 hover:text-blue-900 font-medium flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No transfer requests found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Transfer Request Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">New Transfer Request</h3>
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Current Branch (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Branch
                </label>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <Building2 className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-gray-900 font-medium">Colombo Main Branch</span>
                </div>
              </div>

              {/* Requested Branch */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requested Branch <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.requestedBranch}
                  onChange={(e) => setFormData({ ...formData, requestedBranch: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a branch</option>
                  {branches.map((branch) => (
                    <option key={branch.branchId} value={branch.branchName}>
                      {branch.branchName} - {branch.location} ({branch.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Requested Transfer Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Transfer Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.requestedDate}
                  onChange={(e) => setFormData({ ...formData, requestedDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Select your preferred date for the transfer</p>
              </div>

              {/* Reason for Transfer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Transfer <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Please provide a detailed reason for your transfer request..."
                  required
                  minLength={20}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 20 characters. Be specific about your reasons.
                </p>
              </div>

              {/* Document Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supporting Documents
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Upload supporting documents (Medical certificates, family proof, etc.)
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer"
                  >
                    Choose Files
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 5MB each)
                  </p>
                </div>

                {/* Uploaded Files List */}
                {formData.documents.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700">Uploaded Files:</p>
                    {formData.documents.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-blue-500 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsApplyModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {isDetailsModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Transfer Request Details</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Request ID: TR-{String(selectedRequest.transferRequestId).padStart(4, '0')}
                </p>
              </div>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex justify-center">
                {getStatusBadge(selectedRequest.status)}
              </div>

              {/* Transfer Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Current Branch</label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Building2 className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-gray-900 font-medium">{selectedRequest.currentBranch}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Requested Branch</label>
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-gray-900 font-medium">{selectedRequest.requestedBranch}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Submitted Date</label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-gray-900">
                      {new Date(selectedRequest.submittedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Preferred Transfer Date</label>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-gray-900">
                      {new Date(selectedRequest.requestedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">Reason for Transfer</label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-900">{selectedRequest.reason}</p>
                </div>
              </div>

              {/* Supporting Documents */}
              {selectedRequest.documents.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Supporting Documents</label>
                  <div className="space-y-2">
                    {selectedRequest.documents.map((doc) => (
                      <div
                        key={doc.documentId}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center">
                          <FileText className="w-5 h-5 text-blue-500 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{doc.fileName}</p>
                            <p className="text-xs text-gray-500">
                              {doc.fileSize} • Uploaded on {new Date(doc.uploadedDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800">
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Approval Details (if approved or rejected) */}
              {(selectedRequest.status === 'Approved' || selectedRequest.status === 'Rejected') && (
                <div className={`p-4 rounded-lg ${
                  selectedRequest.status === 'Approved' ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">
                        {selectedRequest.status === 'Approved' ? 'Approved By' : 'Reviewed By'}
                      </label>
                      <p className="text-gray-900 font-medium">{selectedRequest.approvedBy}</p>
                    </div>
                    {selectedRequest.approvedDate && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Date</label>
                        <p className="text-gray-900">
                          {new Date(selectedRequest.approvedDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    )}
                    {selectedRequest.remarks && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Remarks</label>
                        <p className="text-gray-900">{selectedRequest.remarks}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200">
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTransferRequest;
