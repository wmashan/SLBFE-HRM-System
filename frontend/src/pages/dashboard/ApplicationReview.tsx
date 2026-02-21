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
  MessageSquare,
  Briefcase,
  GraduationCap,
  Building2,
  Award,
  UserCircle,
  Home
} from 'lucide-react';
import { employeeService } from '../../services/api';

interface EmployeeDetails {
  employeeId: string;
  titleId: number;
  fullName: string;
  nameInitials: string;
  firstName: string;
  lastName: string;
  email: string;
  contact1: string;
  contact2?: string;
  nic: string;
  birthDate: string;
  civilStatusId: string;
  permanentAddressL1: string;
  permanentAddressL2?: string;
  permanentTownId: string;
  temporaryAddressL1?: string;
  temporaryAddressL2?: string;
  temporaryTownId?: string;
  designationId: string;
  divisionId: number;
  gradeId: string;
  employeeTypeId: number;
  permanentDate?: string;
  joinDateContract?: string;
  joinDateCasual?: string;
  ol?: string;
  al?: string;
  higherStudies?: string;
  createdAt: string;
  updatedAt?: string;
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
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTitleName = (titleId: number) => {
    const titles: Record<number, string> = {
      1: 'Mr.',
      2: 'Mrs.',
      3: 'Ms.',
      4: 'Dr.',
      5: 'Prof.'
    };
    return titles[titleId] || 'N/A';
  };

  const getCivilStatus = (statusId: string) => {
    const statuses: Record<string, string> = {
      '1': 'Single',
      '2': 'Married',
      '3': 'Divorced',
      '4': 'Widowed'
    };
    return statuses[statusId] || statusId;
  };

  const getEmployeeType = (typeId: number) => {
    const types: Record<number, string> = {
      1: 'Permanent',
      2: 'Contract',
      3: 'Casual'
    };
    return types[typeId] || 'N/A';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Breadcrumb */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
          <button
            onClick={() => navigate('/hr-dashboard')}
            className="flex items-center text-gray-600 hover:text-blue-600 mb-4 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Applications</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Review Application</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Employee ID:</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">
                  {employee.employeeId}
                </span>
                <span className="text-gray-400">•</span>
                <span>Applied on: {formatDate(employee.createdAt)}</span>
              </div>
            </div>
            {employee.status && (
              <div className={`px-4 py-2 rounded-full font-semibold ${
                employee.status === 'Active' ? 'bg-green-100 text-green-700' : 
                employee.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                'bg-gray-100 text-gray-700'
              }`}>
                {employee.status}
              </div>
            )}
          </div>
        </div>

        {/* Profile Card - Enhanced with Cover */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>
          <div className="px-8 pb-8">
            <div className="flex items-start -mt-16 mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100">
                  {employee.profilePictureUrl ? (
                    <img
                      src={employee.profilePictureUrl}
                      alt={employee.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
                      <User className="w-16 h-16 text-white" />
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
              </div>
              <div className="ml-6 flex-1 pt-20">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">
                      {getTitleName(employee.titleId)} {employee.fullName}
                    </h3>
                    <p className="text-lg text-gray-600 mb-3">{employee.nameInitials}</p>
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center px-3 py-1 bg-blue-50 rounded-lg">
                        <Mail className="w-4 h-4 mr-2 text-blue-600" />
                        <span className="text-sm text-gray-700">{employee.email}</span>
                      </div>
                      <div className="flex items-center px-3 py-1 bg-green-50 rounded-lg">
                        <Phone className="w-4 h-4 mr-2 text-green-600" />
                        <span className="text-sm text-gray-700">{employee.contact1}</span>
                      </div>
                      {employee.contact2 && (
                        <div className="flex items-center px-3 py-1 bg-green-50 rounded-lg">
                          <Phone className="w-4 h-4 mr-2 text-green-600" />
                          <span className="text-sm text-gray-700">{employee.contact2}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-5 pb-3 border-b border-gray-200">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <UserCircle className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <p className="text-gray-900 font-medium">{employee.firstName} {employee.lastName}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      NIC
                    </label>
                    <p className="text-gray-900 font-medium">{employee.nic}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Date of Birth
                    </label>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <p className="text-gray-900 font-medium">{formatDate(employee.birthDate)}</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Civil Status
                    </label>
                    <p className="text-gray-900 font-medium">{getCivilStatus(employee.civilStatusId)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-5 pb-3 border-b border-gray-200">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <Home className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Address Information</h3>
              </div>
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Permanent Address
                  </label>
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p className="text-gray-900 font-medium">{employee.permanentAddressL1}</p>
                    {employee.permanentAddressL2 && (
                      <p className="text-gray-900 font-medium">{employee.permanentAddressL2}</p>
                    )}
                    <p className="text-gray-600 text-sm mt-1">Town ID: {employee.permanentTownId}</p>
                  </div>
                </div>
                {(employee.temporaryAddressL1 || employee.temporaryTownId) && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      Temporary Address
                    </label>
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      {employee.temporaryAddressL1 && (
                        <p className="text-gray-900 font-medium">{employee.temporaryAddressL1}</p>
                      )}
                      {employee.temporaryAddressL2 && (
                        <p className="text-gray-900 font-medium">{employee.temporaryAddressL2}</p>
                      )}
                      {employee.temporaryTownId && (
                        <p className="text-gray-600 text-sm mt-1">Town ID: {employee.temporaryTownId}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Educational Qualifications */}
            {(employee.ol || employee.al || employee.higherStudies) && (
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-5 pb-3 border-b border-gray-200">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <GraduationCap className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Educational Qualifications</h3>
                </div>
                <div className="space-y-4">
                  {employee.ol && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        O/L Qualifications
                      </label>
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <p className="text-gray-900 whitespace-pre-wrap">{employee.ol}</p>
                      </div>
                    </div>
                  )}
                  {employee.al && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        A/L Qualifications
                      </label>
                      <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                        <p className="text-gray-900 whitespace-pre-wrap">{employee.al}</p>
                      </div>
                    </div>
                  )}
                  {employee.higherStudies && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Higher Studies
                      </label>
                      <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                        <p className="text-gray-900 whitespace-pre-wrap">{employee.higherStudies}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Employment Details */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-5 pb-3 border-b border-gray-200">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                  <Briefcase className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Employment Details</h3>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      <Building2 className="w-3 h-3 inline mr-1" />
                      Division ID
                    </label>
                    <p className="text-gray-900 font-medium text-lg">{employee.divisionId}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      <Award className="w-3 h-3 inline mr-1" />
                      Grade ID
                    </label>
                    <p className="text-gray-900 font-medium text-lg">{employee.gradeId}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Designation ID
                  </label>
                  <p className="text-gray-900 font-medium text-lg">{employee.designationId}</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Employee Type
                  </label>
                  <div className={`inline-flex px-4 py-2 rounded-full font-semibold ${
                    employee.employeeTypeId === 1 ? 'bg-green-100 text-green-700' :
                    employee.employeeTypeId === 2 ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {getEmployeeType(employee.employeeTypeId)}
                  </div>
                </div>
                {(employee.permanentDate || employee.joinDateContract || employee.joinDateCasual) && (
                  <div className="pt-3 border-t border-gray-200">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      <Calendar className="w-3 h-3 inline mr-1" />
                      Join Dates
                    </label>
                    <div className="space-y-2 text-sm">
                      {employee.permanentDate && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Permanent:</span>
                          <span className="text-gray-900 font-medium">{formatDate(employee.permanentDate)}</span>
                        </div>
                      )}
                      {employee.joinDateContract && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Contract:</span>
                          <span className="text-gray-900 font-medium">{formatDate(employee.joinDateContract)}</span>
                        </div>
                      )}
                      {employee.joinDateCasual && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Casual:</span>
                          <span className="text-gray-900 font-medium">{formatDate(employee.joinDateCasual)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Review Comments */}
            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-5 pb-3 border-b border-gray-200">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                  <MessageSquare className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Review Comments</h3>
                <span className="ml-2 text-sm text-gray-500">(Optional)</span>
              </div>
              <textarea
                value={reviewComments}
                onChange={(e) => setReviewComments(e.target.value)}
                placeholder="Add any comments or notes about this application..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                rows={6}
              />
            </div>

            {/* Action Buttons */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-md p-6">
              <div className="flex items-center justify-end space-x-4">
                <button
                  onClick={() => navigate('/hr-dashboard')}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-white hover:border-gray-400 transition-all font-semibold shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReviewAction('Rejected')}
                  disabled={submitting}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  Reject Application
                </button>
                <button
                  onClick={() => handleReviewAction('Approved')}
                  disabled={submitting}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Approve Application
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal - Enhanced */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 transform transition-all">
            <div className="text-center">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
                reviewAction === 'Approved' 
                  ? 'bg-gradient-to-br from-green-400 to-green-600' 
                  : 'bg-gradient-to-br from-red-400 to-red-600'
              }`}>
                {reviewAction === 'Approved' ? (
                  <CheckCircle className="w-12 h-12 text-white" />
                ) : (
                  <XCircle className="w-12 h-12 text-white" />
                )}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Confirm {reviewAction === 'Approved' ? 'Approval' : 'Rejection'}
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to <span className="font-semibold">{reviewAction?.toLowerCase()}</span> this application for{' '}
                <span className="font-bold text-gray-900">{employee.fullName}</span>?
              </p>
              {reviewComments && (
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl mb-6 text-left border border-blue-200">
                  <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Your Comments:
                  </p>
                  <p className="text-sm text-gray-700 pl-6">{reviewComments}</p>
                </div>
              )}
              <div className="flex space-x-4">
                <button
                  onClick={cancelReview}
                  disabled={submitting}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmReview}
                  disabled={submitting}
                  className={`flex-1 px-6 py-3 text-white rounded-lg transition-all font-semibold shadow-lg disabled:opacity-50 ${
                    reviewAction === 'Approved'
                      ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800'
                      : 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                  }`}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Confirm'
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

export default ApplicationReview;
