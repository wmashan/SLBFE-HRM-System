import { useState } from 'react';
import { 
  Search, 
  Eye, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Download,
  Mail, 
  Phone,
  Bell,
  User,
  Calendar
} from 'lucide-react';

// Mock data for applications
const applications = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    appliedDate: '2024-01-15',
    status: 'pending',
    nic: '123456789V',
    dateOfBirth: '1990-05-15',
    nationality: 'Sri Lankan',
    religion: 'Buddhist',
    gender: 'male',
    civilStatus: 'single',
    mobileNumberPersonal: '+94771234567',
    phoneNumberOfficial: '+94112345678',
    permanentAddressLine1: '123 Main Street',
    permanentAddressLine2: 'Colombo 03',
    permanentTown: 'Colombo',
    temporaryAddressLine1: '456 Secondary Street',
    temporaryAddressLine2: 'Nugegoda',
    temporaryTown: 'Nugegoda',
    gceOLExamination: true,
    gceALExamination: true,
    higherStudies: false,
    typeOfEmployment: 'Permanent',
    dateOfPermanent: '2023-06-01',
    joinDateContract: null,
    joinDateCasual: null
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@email.com',
    appliedDate: '2024-01-10',
    status: 'approved',
    nic: '987654321V',
    dateOfBirth: '1985-08-22',
    nationality: 'Sri Lankan',
    religion: 'Christian',
    gender: 'female',
    civilStatus: 'married',
    mobileNumberPersonal: '+94779876543',
    phoneNumberOfficial: '+94118765432',
    permanentAddressLine1: '789 Another Street',
    permanentAddressLine2: '',
    permanentTown: 'Kandy',
    temporaryAddressLine1: '',
    temporaryAddressLine2: '',
    temporaryTown: '',
    gceOLExamination: true,
    gceALExamination: true,
    higherStudies: true,
    typeOfEmployment: 'Contract',
    dateOfPermanent: null,
    joinDateContract: '2023-03-15',
    joinDateCasual: null
  },
  {
    id: 3,
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@email.com',
    appliedDate: '2024-01-05',
    status: 'rejected',
    nic: '456789123V',
    dateOfBirth: '1992-12-10',
    nationality: 'Sri Lankan',
    religion: 'Hindu',
    gender: 'male',
    civilStatus: 'single',
    mobileNumberPersonal: '+94775555555',
    phoneNumberOfficial: '',
    permanentAddressLine1: '321 Third Avenue',
    permanentAddressLine2: 'Matara',
    permanentTown: 'Matara',
    temporaryAddressLine1: '321 Third Avenue',
    temporaryAddressLine2: 'Matara',
    temporaryTown: 'Matara',
    gceOLExamination: true,
    gceALExamination: false,
    higherStudies: false,
    typeOfEmployment: 'Casual',
    dateOfPermanent: null,
    joinDateContract: null,
    joinDateCasual: '2023-01-20'
  }
];

interface StatCardProps {
  title: string;
  value: number;
  color: string;
  percentage: string;
  icon: any;
}

const StatCard = ({ title, value, color, percentage, icon: Icon }: StatCardProps) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <div className="flex items-center">
      <div className="flex-shrink-0">
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      <div className="ml-4 flex-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <span className="text-sm text-green-600">{percentage}</span>
        </div>
        <p className={`text-2xl font-semibold ${color}`}>{value}</p>
      </div>
    </div>
  </div>
);

const Applications = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // State for section-wise approval/rejection
  const [confirmedSections, setConfirmedSections] = useState({
    personal: false,
    contact: false,
    education: false,
    other: false
  });

  const [rejectedSections, setRejectedSections] = useState({
    personal: false,
    contact: false,
    education: false,
    other: false
  });

  const [rejectionReasons, setRejectionReasons] = useState({
    personal: '',
    contact: '',
    education: '',
    other: ''
  });

  const applicationStats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
    interview: 0
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleViewApplication = (application: any) => {
    setSelectedApplication(application);
    setShowModal(true);
    // Reset all states when opening modal
    setConfirmedSections({
      personal: false,
      contact: false,
      education: false,
      other: false
    });
    setRejectedSections({
      personal: false,
      contact: false,
      education: false,
      other: false
    });
    setRejectionReasons({
      personal: '',
      contact: '',
      education: '',
      other: ''
    });
  };

  const handleSectionApproval = (section: 'personal' | 'contact' | 'education' | 'other') => {
    setConfirmedSections(prev => ({ ...prev, [section]: true }));
    // Clear rejection if previously rejected
    setRejectedSections(prev => ({ ...prev, [section]: false }));
    setRejectionReasons(prev => ({ ...prev, [section]: '' }));
  };

  const handleSectionRejection = (section: 'personal' | 'contact' | 'education' | 'other') => {
    setRejectedSections(prev => ({ ...prev, [section]: true }));
    // Clear confirmation if previously confirmed
    setConfirmedSections(prev => ({ ...prev, [section]: false }));
  };

  const handleRejectionReasonChange = (section: 'personal' | 'contact' | 'education' | 'other', reason: string) => {
    setRejectionReasons(prev => ({ ...prev, [section]: reason }));
  };

  const allSectionsConfirmed = Object.values(confirmedSections).every(Boolean);
  const hasAnyRejectedSection = Object.values(rejectedSections).some(Boolean);

  const handleNotifyApplicant = () => {
    console.log('Notifying applicant about rejection:', {
      applicationId: selectedApplication.id,
      rejectedSections: Object.keys(rejectedSections).filter(section => rejectedSections[section as keyof typeof rejectedSections]),
      reasons: rejectionReasons
    });
    alert('Applicant has been notified about the rejection with detailed reasons.');
    setShowModal(false);
    setSelectedApplication(null);
  };

  const handleStatusUpdate = (applicationId: number, newStatus: string) => {
    console.log(`Updating application ${applicationId} status to ${newStatus}`);
    setShowModal(false);
    setSelectedApplication(null);
    setConfirmedSections({
      personal: false,
      contact: false,
      education: false,
      other: false
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Job Applications</h2>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
            <Search className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Applications"
          value={applicationStats.total}
          color="text-blue-600"
          percentage="+15%"
          icon={FileText}
        />
        <StatCard
          title="Pending Review"
          value={applicationStats.pending}
          color="text-yellow-600"
          percentage="+5%"
          icon={Clock}
        />
        <StatCard
          title="Approved"
          value={applicationStats.approved}
          color="text-green-600"
          percentage="+12%"
          icon={CheckCircle}
        />
        <StatCard
          title="Rejected"
          value={applicationStats.rejected}
          color="text-red-600"
          percentage="-3%"
          icon={XCircle}
        />
        <StatCard
          title="Interview"
          value={applicationStats.interview}
          color="text-purple-600"
          percentage="+8%"
          icon={User}
        />
      </div>

      {/* Applications Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Applications</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {application.firstName} {application.lastName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{application.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {application.appliedDate}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      application.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : application.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleViewApplication(application)}
                      className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Details Modal - Enhanced Multi-Stage Review */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-5 mx-auto p-5 border w-11/12 md:w-5/6 lg:w-4/5 xl:w-3/4 shadow-lg rounded-md bg-white max-h-screen overflow-y-auto">
            <div className="mt-3">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Application Review</h3>
                  <p className="text-gray-600 mt-1">Complete submitted application details with stage-wise confirmation</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Application Status Display */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Application Status</h4>
                    <p className="text-sm text-gray-600">Applied on {selectedApplication.appliedDate}</p>
                  </div>
                  <div>
                    {selectedApplication.status === 'pending' && (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        <Clock className="w-4 h-4 mr-2" />
                        Pending Review
                      </span>
                    )}
                    {selectedApplication.status === 'approved' && (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approved
                      </span>
                    )}
                    {selectedApplication.status === 'rejected' && (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
                        <XCircle className="w-4 h-4 mr-2" />
                        Rejected
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Tracking */}
              <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-800 mb-4">Review Progress</h4>
                <div className="flex items-center justify-between space-x-4">
                  <div className={`flex flex-col items-center p-3 rounded-lg ${
                    confirmedSections.personal ? 'bg-green-100' : 
                    rejectedSections.personal ? 'bg-red-100' : 'bg-gray-100'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      confirmedSections.personal ? 'bg-green-500 text-white' : 
                      rejectedSections.personal ? 'bg-red-500 text-white' : 'bg-gray-400 text-white'
                    }`}>
                      1
                    </div>
                    <span className="text-xs font-medium">Personal Details</span>
                  </div>
                  <div className={`flex flex-col items-center p-3 rounded-lg ${
                    confirmedSections.contact ? 'bg-green-100' : 
                    rejectedSections.contact ? 'bg-red-100' : 'bg-gray-100'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      confirmedSections.contact ? 'bg-green-500 text-white' : 
                      rejectedSections.contact ? 'bg-red-500 text-white' : 'bg-gray-400 text-white'
                    }`}>
                      2
                    </div>
                    <span className="text-xs font-medium">Contact Details</span>
                  </div>
                  <div className={`flex flex-col items-center p-3 rounded-lg ${
                    confirmedSections.education ? 'bg-green-100' : 
                    rejectedSections.education ? 'bg-red-100' : 'bg-gray-100'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      confirmedSections.education ? 'bg-green-500 text-white' : 
                      rejectedSections.education ? 'bg-red-500 text-white' : 'bg-gray-400 text-white'
                    }`}>
                      3
                    </div>
                    <span className="text-xs font-medium">Education Details</span>
                  </div>
                  <div className={`flex flex-col items-center p-3 rounded-lg ${
                    confirmedSections.other ? 'bg-green-100' : 
                    rejectedSections.other ? 'bg-red-100' : 'bg-gray-100'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      confirmedSections.other ? 'bg-green-500 text-white' : 
                      rejectedSections.other ? 'bg-red-500 text-white' : 'bg-gray-400 text-white'
                    }`}>
                      4
                    </div>
                    <span className="text-xs font-medium">Other Details</span>
                  </div>
                </div>
              </div>

              {/* Section-wise Review */}
              <div className="space-y-6">
                {/* Personal Details Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-blue-600 flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Personal Details
                    </h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSectionApproval('personal')}
                        className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                          confirmedSections.personal
                            ? 'bg-green-100 text-green-800 border border-green-300'
                            : 'bg-green-50 text-green-700 border border-green-300 hover:bg-green-100'
                        }`}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {confirmedSections.personal ? 'Approved' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleSectionRejection('personal')}
                        className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                          rejectedSections.personal
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : 'bg-red-50 text-red-700 border border-red-300 hover:bg-red-100'
                        }`}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        {rejectedSections.personal ? 'Rejected' : 'Reject'}
                      </button>
                    </div>
                  </div>
                  
                  {/* Rejection Reason Input */}
                  {rejectedSections.personal && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <label className="block text-sm font-medium text-red-800 mb-2">Rejection Reason</label>
                      <div className="flex space-x-3">
                        <textarea
                          value={rejectionReasons.personal}
                          onChange={(e) => handleRejectionReasonChange('personal', e.target.value)}
                          placeholder="Please provide a detailed reason for rejecting this section..."
                          className="flex-1 px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                          rows={3}
                        />
                        <button
                          onClick={() => console.log('Adding rejection reason for personal section:', rejectionReasons.personal)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium self-start mt-1"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                      <p className="text-gray-900 font-medium">{selectedApplication.firstName} {selectedApplication.lastName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">NIC Number</label>
                      <p className="text-gray-900">{selectedApplication.nic}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Date of Birth</label>
                      <p className="text-gray-900 flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        {selectedApplication.dateOfBirth}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Gender</label>
                      <p className="text-gray-900 capitalize">{selectedApplication.gender}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Nationality</label>
                      <p className="text-gray-900">{selectedApplication.nationality}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Religion</label>
                      <p className="text-gray-900">{selectedApplication.religion}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Civil Status</label>
                      <p className="text-gray-900 capitalize">{selectedApplication.civilStatus}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Details Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-blue-600 flex items-center">
                      <Mail className="w-5 h-5 mr-2" />
                      Contact Details
                    </h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSectionApproval('contact')}
                        className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                          confirmedSections.contact
                            ? 'bg-green-100 text-green-800 border border-green-300'
                            : 'bg-green-50 text-green-700 border border-green-300 hover:bg-green-100'
                        }`}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {confirmedSections.contact ? 'Approved' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleSectionRejection('contact')}
                        className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                          rejectedSections.contact
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : 'bg-red-50 text-red-700 border border-red-300 hover:bg-red-100'
                        }`}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        {rejectedSections.contact ? 'Rejected' : 'Reject'}
                      </button>
                    </div>
                  </div>
                  
                  {/* Rejection Reason Input */}
                  {rejectedSections.contact && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <label className="block text-sm font-medium text-red-800 mb-2">Rejection Reason</label>
                      <div className="flex space-x-3">
                        <textarea
                          value={rejectionReasons.contact}
                          onChange={(e) => handleRejectionReasonChange('contact', e.target.value)}
                          placeholder="Please provide a detailed reason for rejecting this section..."
                          className="flex-1 px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                          rows={3}
                        />
                        <button
                          onClick={() => console.log('Adding rejection reason for contact section:', rejectionReasons.contact)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium self-start mt-1"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {/* Contact Information */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                        <p className="text-gray-900 flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {selectedApplication.email}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Personal Mobile</label>
                        <p className="text-gray-900 flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {selectedApplication.mobileNumberPersonal}
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-500 mb-1">Official Phone</label>
                        <p className="text-gray-900 flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {selectedApplication.phoneNumberOfficial || 'Not provided'}
                        </p>
                      </div>
                    </div>

                    {/* Permanent Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-3">Permanent Address</label>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="space-y-2">
                          <p className="text-gray-900">{selectedApplication.permanentAddressLine1}</p>
                          {selectedApplication.permanentAddressLine2 && (
                            <p className="text-gray-900">{selectedApplication.permanentAddressLine2}</p>
                          )}
                          <p className="text-gray-900 font-medium">{selectedApplication.permanentTown}</p>
                        </div>
                      </div>
                    </div>

                    {/* Temporary Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-3">Temporary Address</label>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <div className="space-y-2">
                          <p className="text-gray-900">{selectedApplication.temporaryAddressLine1 || 'Same as permanent address'}</p>
                          {selectedApplication.temporaryAddressLine2 && (
                            <p className="text-gray-900">{selectedApplication.temporaryAddressLine2}</p>
                          )}
                          <p className="text-gray-900 font-medium">{selectedApplication.temporaryTown || selectedApplication.permanentTown}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Educational Qualifications Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-blue-600 flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Educational Background
                    </h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSectionApproval('education')}
                        className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                          confirmedSections.education
                            ? 'bg-green-100 text-green-800 border border-green-300'
                            : 'bg-green-50 text-green-700 border border-green-300 hover:bg-green-100'
                        }`}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {confirmedSections.education ? 'Approved' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleSectionRejection('education')}
                        className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                          rejectedSections.education
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : 'bg-red-50 text-red-700 border border-red-300 hover:bg-red-100'
                        }`}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        {rejectedSections.education ? 'Rejected' : 'Reject'}
                      </button>
                    </div>
                  </div>
                  
                  {/* Rejection Reason Input */}
                  {rejectedSections.education && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <label className="block text-sm font-medium text-red-800 mb-2">Rejection Reason</label>
                      <div className="flex space-x-3">
                        <textarea
                          value={rejectionReasons.education}
                          onChange={(e) => handleRejectionReasonChange('education', e.target.value)}
                          placeholder="Please provide a detailed reason for rejecting this section..."
                          className="flex-1 px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                          rows={3}
                        />
                        <button
                          onClick={() => console.log('Adding rejection reason for education section:', rejectionReasons.education)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium self-start mt-1"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                      <div>
                        <h5 className="font-medium text-gray-900">GCE O/L Examination</h5>
                        <p className="text-sm text-gray-600">Ordinary Level Certificate</p>
                      </div>
                      <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                        selectedApplication.gceOLExamination 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {selectedApplication.gceOLExamination ? '✓ Completed' : '✗ Not Completed'}
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                      <div>
                        <h5 className="font-medium text-gray-900">GCE A/L Examination</h5>
                        <p className="text-sm text-gray-600">Advanced Level Certificate</p>
                      </div>
                      <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                        selectedApplication.gceALExamination 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {selectedApplication.gceALExamination ? '✓ Completed' : '✗ Not Completed'}
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                      <div>
                        <h5 className="font-medium text-gray-900">Higher Studies</h5>
                        <p className="text-sm text-gray-600">University or Professional Qualifications</p>
                      </div>
                      <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                        selectedApplication.higherStudies 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {selectedApplication.higherStudies ? '✓ Completed' : '✗ Not Completed'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Other Details Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-blue-600 flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      Employment Details
                    </h4>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleSectionApproval('other')}
                        className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                          confirmedSections.other
                            ? 'bg-green-100 text-green-800 border border-green-300'
                            : 'bg-green-50 text-green-700 border border-green-300 hover:bg-green-100'
                        }`}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {confirmedSections.other ? 'Approved' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleSectionRejection('other')}
                        className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                          rejectedSections.other
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : 'bg-red-50 text-red-700 border border-red-300 hover:bg-red-100'
                        }`}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        {rejectedSections.other ? 'Rejected' : 'Reject'}
                      </button>
                    </div>
                  </div>
                  
                  {/* Rejection Reason Input */}
                  {rejectedSections.other && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <label className="block text-sm font-medium text-red-800 mb-2">Rejection Reason</label>
                      <div className="flex space-x-3">
                        <textarea
                          value={rejectionReasons.other}
                          onChange={(e) => handleRejectionReasonChange('other', e.target.value)}
                          placeholder="Please provide a detailed reason for rejecting this section..."
                          className="flex-1 px-3 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                          rows={3}
                        />
                        <button
                          onClick={() => console.log('Adding rejection reason for employment section:', rejectionReasons.other)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium self-start mt-1"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Type of Employment</label>
                      <p className="text-gray-900 font-medium">{selectedApplication.typeOfEmployment}</p>
                    </div>
                    {selectedApplication.dateOfPermanent && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Date of Permanent</label>
                        <p className="text-gray-900">{selectedApplication.dateOfPermanent}</p>
                      </div>
                    )}
                    {selectedApplication.joinDateContract && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Contract Join Date</label>
                        <p className="text-gray-900">{selectedApplication.joinDateContract}</p>
                      </div>
                    )}
                    {selectedApplication.joinDateCasual && (
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Casual Join Date</label>
                        <p className="text-gray-900">{selectedApplication.joinDateCasual}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-8 mt-8 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Application submitted on {selectedApplication.appliedDate}
                </div>
                
                {selectedApplication.status === 'pending' && (
                  <div className="flex space-x-4">
                    {hasAnyRejectedSection ? (
                      // Show notify applicant button if any section is rejected
                      <button
                        onClick={handleNotifyApplicant}
                        className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center"
                      >
                        <Bell className="w-4 h-4 mr-2" />
                        Notify Applicant
                      </button>
                    ) : !allSectionsConfirmed ? (
                      // Show message if not all sections are confirmed
                      <div className="text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
                        Please approve or reject all sections to proceed
                      </div>
                    ) : (
                      // Show final approval button only if all sections are confirmed and none rejected
                      <button
                        onClick={() => {
                          console.log('Final approval for application', selectedApplication.id);
                          alert('Application has been fully approved!');
                          handleStatusUpdate(selectedApplication.id, 'approved');
                        }}
                        className="px-8 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center shadow-lg"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Final Approval
                      </button>
                    )}
                  </div>
                )}
                
                {selectedApplication.status !== 'pending' && (
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    Close Review
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;