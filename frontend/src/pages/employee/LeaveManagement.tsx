import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Upload,
  Download,
  X,
  CalendarDays
} from 'lucide-react';

interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  comments?: string;
  attachments?: string[];
}

interface LeaveBalance {
  type: string;
  allocated: number;
  used: number;
  pending: number;
  remaining: number;
}

interface LeaveManagementProps {}

const LeaveManagement: React.FC<LeaveManagementProps> = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'apply' | 'history'>('overview');
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  // Sample leave balances
  const [leaveBalances] = useState<LeaveBalance[]>([
    { type: 'Annual Leave', allocated: 21, used: 8, pending: 2, remaining: 11 },
    { type: 'Sick Leave', allocated: 7, used: 3, pending: 0, remaining: 4 },
    { type: 'Casual Leave', allocated: 7, used: 2, pending: 1, remaining: 4 },
    { type: 'Maternity/Paternity', allocated: 84, used: 0, pending: 0, remaining: 84 }
  ]);

  // Sample leave history
  const [leaveHistory] = useState<LeaveRequest[]>([
    {
      id: 'L001',
      type: 'Annual Leave',
      startDate: '2024-12-20',
      endDate: '2024-12-31',
      days: 8,
      reason: 'Year-end vacation with family',
      status: 'pending',
      appliedDate: '2024-11-15',
      attachments: ['vacation-plan.pdf']
    },
    {
      id: 'L002',
      type: 'Sick Leave',
      startDate: '2024-10-15',
      endDate: '2024-10-17',
      days: 3,
      reason: 'Flu and fever',
      status: 'approved',
      appliedDate: '2024-10-14',
      approvedBy: 'Sarah Wilson',
      approvedDate: '2024-10-14',
      comments: 'Approved. Please rest well and recover.',
      attachments: ['medical-certificate.pdf']
    },
    {
      id: 'L003',
      type: 'Casual Leave',
      startDate: '2024-09-10',
      endDate: '2024-09-10',
      days: 1,
      reason: 'Personal family matter',
      status: 'approved',
      appliedDate: '2024-09-08',
      approvedBy: 'Sarah Wilson',
      approvedDate: '2024-09-09'
    },
    {
      id: 'L004',
      type: 'Annual Leave',
      startDate: '2024-08-01',
      endDate: '2024-08-05',
      days: 5,
      reason: 'Summer vacation',
      status: 'approved',
      appliedDate: '2024-07-15',
      approvedBy: 'Sarah Wilson',
      approvedDate: '2024-07-16'
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const LeaveApplicationModal = () => {
    const [formData, setFormData] = useState({
      type: '',
      startDate: '',
      endDate: '',
      reason: '',
      attachments: [] as File[]
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      setFormData(prev => ({ ...prev, attachments: files }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Here you would submit the leave application
      console.log('Submitting leave application:', formData);
      setShowApplicationModal(false);
      setFormData({ type: '', startDate: '', endDate: '', reason: '', attachments: [] });
    };

    const calculateDays = () => {
      if (formData.startDate && formData.endDate) {
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        return diffDays;
      }
      return 0;
    };

    if (!showApplicationModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Apply for Leave</h3>
            <button
              onClick={() => setShowApplicationModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leave Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Leave Type</option>
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Maternity Leave">Maternity Leave</option>
                  <option value="Paternity Leave">Paternity Leave</option>
                  <option value="Emergency Leave">Emergency Leave</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
                  {calculateDays()} day(s)
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Leave <span className="text-red-500">*</span>
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="Please provide a detailed reason for your leave request..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supporting Documents (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <label className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-500">Click to upload</span>
                    <span className="text-gray-500"> or drag and drop</span>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    PDF, DOC, DOCX, JPG, PNG up to 10MB each
                  </p>
                </div>
                {formData.attachments.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
                    <ul className="space-y-1">
                      {formData.attachments.map((file, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Leave Policy Reminder:</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Annual leave requests should be submitted at least 7 days in advance</li>
                <li>• Sick leave requires medical certificate for absences over 3 days</li>
                <li>• Emergency leave requests will be reviewed on a case-by-case basis</li>
                <li>• All leave is subject to manager approval and business requirements</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Submit Leave Request
              </button>
              <button
                type="button"
                onClick={() => setShowApplicationModal(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Leave Management</h2>
          <p className="text-sm text-gray-600 mt-1">Manage your leave requests and view balances</p>
        </div>
        <button
          onClick={() => setShowApplicationModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Apply for Leave
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              Leave Overview
            </div>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Leave History
            </div>
          </button>
        </nav>
      </div>

      {/* Leave Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Leave Balances */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave Balances for 2024</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {leaveBalances.map((balance, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">{balance.type}</h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Allocated</span>
                      <span className="text-sm font-semibold text-gray-900">{balance.allocated}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Used</span>
                      <span className="text-sm font-semibold text-red-600">{balance.used}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Pending</span>
                      <span className="text-sm font-semibold text-yellow-600">{balance.pending}</span>
                    </div>
                    
                    <hr className="border-gray-200" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">Remaining</span>
                      <span className="text-lg font-bold text-green-600">{balance.remaining}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Usage</span>
                      <span>{Math.round(((balance.used + balance.pending) / balance.allocated) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(balance.used / balance.allocated) * 100}%` }}
                      ></div>
                      <div 
                        className="bg-yellow-400 h-2 rounded-full -mt-2" 
                        style={{ 
                          width: `${(balance.pending / balance.allocated) * 100}%`,
                          marginLeft: `${(balance.used / balance.allocated) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Leave Requests */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Leave Requests</h3>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Leave Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Duration
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applied Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leaveHistory.slice(0, 3).map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{request.type}</div>
                            <div className="text-sm text-gray-500">{request.reason.substring(0, 50)}...</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">{request.days} day(s)</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(request.status)}
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(request.appliedDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leave History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">All Leave Requests</h3>
            <div className="space-y-4">
              {leaveHistory.map((request) => (
                <div key={request.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{request.type}</h4>
                        <p className="text-sm text-gray-600">Request ID: {request.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(request.status)}
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Duration</h5>
                      <p className="text-sm text-gray-900">
                        {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">{request.days} day(s)</p>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Applied Date</h5>
                      <p className="text-sm text-gray-900">{new Date(request.appliedDate).toLocaleDateString()}</p>
                    </div>

                    {request.approvedBy && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-1">Approved By</h5>
                        <p className="text-sm text-gray-900">{request.approvedBy}</p>
                        {request.approvedDate && (
                          <p className="text-sm text-gray-600">{new Date(request.approvedDate).toLocaleDateString()}</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Reason</h5>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{request.reason}</p>
                  </div>

                  {request.comments && (
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Manager Comments</h5>
                      <p className="text-sm text-gray-900 bg-blue-50 p-3 rounded-lg border border-blue-200">{request.comments}</p>
                    </div>
                  )}

                  {request.attachments && request.attachments.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Attachments</h5>
                      <div className="flex flex-wrap gap-2">
                        {request.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
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
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Leave Application Modal */}
      <LeaveApplicationModal />
    </div>
  );
};

export default LeaveManagement;