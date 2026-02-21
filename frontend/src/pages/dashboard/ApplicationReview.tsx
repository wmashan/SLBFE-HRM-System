import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  FileText,
  CheckCircle,
  XCircle,
  MessageSquare
} from 'lucide-react';
import { employeeService } from '../../services/api';

interface EmployeeDetails {
  employeeId: string;
  fullName: string;
  nameInitials: string;
  email: string;
  contact1: string;
  contact2?: string;
  nic: string;
  passportNumber?: string;
  dob: string;
  gender: string;
  permanentAddress: string;
  currentAddress?: string;
  designationId: string;
  divisionId: number;
  employeeTypeId: number;
  createdAt: string;
  profilePictureUrl?: string;
  status?: string;
}

const ApplicationReview = () => {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  
  const [employee, setEmployee] = useState<EmployeeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reviewComments, setReviewComments] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [reviewAction, setReviewAction] = useState<'Approved' | 'Rejected' | null>(null);

  useEffect(() => {
    if (employeeId) {
      fetchEmployeeDetails();
    }
  }, [employeeId]);

  const fetchEmployeeDetails = async () => {
    if (!employeeId) return;
    
    setLoading(true);
    try {
      const response = await employeeService.getEmployeeByEmployeeId(employeeId);
      if (response.success && response.data) {
        setEmployee(response.data);
      }
    } catch (error) {
      console.error('Error fetching employee details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAction = (action: 'Approved' | 'Rejected') => {
    setReviewAction(action);
    setShowConfirmModal(true);
  };

  const confirmReview = async () => {
    if (!employeeId || !reviewAction) return;

    setSubmitting(true);
    try {
      const response = await employeeService.reviewApplication(employeeId, {
        status: reviewAction,
        reviewComments: reviewComments || undefined
      });

      if (response.success) {
        alert(`Application ${reviewAction.toLowerCase()} successfully!`);
        navigate('/hr-dashboard');
      } else {
        alert('Failed to submit review. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('An error occurred while submitting the review.');
    } finally {
      setSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  const cancelReview = () => {
    setShowConfirmModal(false);
    setReviewAction(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 text-lg">Loading application...</span>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <FileText className="w-16 h-16 text-gray-400 mb-4" />
        <p className="text-gray-600 text-lg">Application not found</p>
        <button
          onClick={() => navigate('/hr-dashboard')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Applications
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <button
          onClick={() => navigate('/hr-dashboard')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Applications
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Review Application</h2>
        <p className="text-gray-600 mt-1">Employee ID: {employee.employeeId}</p>
      </div>

      {/* Employee Profile Card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-start space-x-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
            {employee.profilePictureUrl ? (
              <img
                src={employee.profilePictureUrl}
                alt={employee.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-gray-600" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900">{employee.fullName}</h3>
            <p className="text-gray-600">{employee.nameInitials}</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="flex items-center text-gray-700">
                <Mail className="w-5 h-5 mr-2 text-gray-400" />
                {employee.email}
              </div>
              <div className="flex items-center text-gray-700">
                <Phone className="w-5 h-5 mr-2 text-gray-400" />
                {employee.contact1}
              </div>
              {employee.contact2 && (
                <div className="flex items-center text-gray-700">
                  <Phone className="w-5 h-5 mr-2 text-gray-400" />
                  {employee.contact2}
                </div>
              )}
              <div className="flex items-center text-gray-700">
                <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                DOB: {formatDate(employee.dob)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">NIC</label>
            <p className="text-gray-900">{employee.nic}</p>
          </div>
          {employee.passportNumber && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Passport Number</label>
              <p className="text-gray-900">{employee.passportNumber}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Gender</label>
            <p className="text-gray-900">{employee.gender}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Application Date</label>
            <p className="text-gray-900">{formatDate(employee.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              Permanent Address
            </label>
            <p className="text-gray-900">{employee.permanentAddress}</p>
          </div>
          {employee.currentAddress && (
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1 flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Current Address
              </label>
              <p className="text-gray-900">{employee.currentAddress}</p>
            </div>
          )}
        </div>
      </div>

      {/* Employment Details */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Details</h3>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Designation ID</label>
            <p className="text-gray-900">{employee.designationId}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Division ID</label>
            <p className="text-gray-900">{employee.divisionId}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Employee Type ID</label>
            <p className="text-gray-900">{employee.employeeTypeId}</p>
          </div>
        </div>
      </div>

      {/* Review Comments */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <MessageSquare className="w-5 h-5 mr-2" />
          Review Comments (Optional)
        </h3>
        <textarea
          value={reviewComments}
          onChange={(e) => setReviewComments(e.target.value)}
          placeholder="Add any comments or notes about this application..."
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={4}
        />
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-end space-x-4">
          <button
            onClick={() => navigate('/hr-dashboard')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => handleReviewAction('Rejected')}
            disabled={submitting}
            className="flex items-center px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <XCircle className="w-5 h-5 mr-2" />
            Reject Application
          </button>
          <button
            onClick={() => handleReviewAction('Approved')}
            disabled={submitting}
            className="flex items-center px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Approve Application
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="text-center">
              {reviewAction === 'Approved' ? (
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              ) : (
                <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              )}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Confirm {reviewAction === 'Approved' ? 'Approval' : 'Rejection'}
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to {reviewAction?.toLowerCase()} this application for{' '}
                <strong>{employee.fullName}</strong>?
              </p>
              {reviewComments && (
                <div className="bg-gray-50 p-4 rounded-md mb-6 text-left">
                  <p className="text-sm font-medium text-gray-700 mb-1">Your Comments:</p>
                  <p className="text-sm text-gray-600">{reviewComments}</p>
                </div>
              )}
              <div className="flex space-x-4">
                <button
                  onClick={cancelReview}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReview}
                  disabled={submitting}
                  className={`flex-1 px-4 py-2 text-white rounded-md transition-colors disabled:opacity-50 ${
                    reviewAction === 'Approved'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {submitting ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationReview;
