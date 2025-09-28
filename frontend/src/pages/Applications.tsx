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
  TrendingUp
} from 'lucide-react';

interface Application {
  id: number;
  employeeNo: string;
  // Personal Details
  title: string;
  fullName: string;
  nameWithInitials: string;
  firstName: string;
  lastName: string;
  nic: string;
  birthDay: string;
  designation: string;
  division: string;
  grade: string;
  civilStatus: string;
  // Contact Details
  permanentAddressLine1: string;
  permanentAddressLine2: string;
  permanentTown: string;
  temporaryAddressLine1: string;
  temporaryAddressLine2: string;
  temporaryTown: string;
  mobileNumberPersonal: string;
  phoneNumberOfficial: string;
  email: string;
  // Educational Details
  gceOLExamination: boolean;
  gceALExamination: boolean;
  higherStudies: boolean;
  // Other Details
  typeOfEmployment: string;
  dateOfPermanent: string;
  joinDateContract: string;
  joinDateCasual: string;
  // Application Meta
  appliedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  profilePicture?: string;
}

const Applications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [confirmedSections, setConfirmedSections] = useState({
    personal: false,
    contact: false,
    education: false,
    other: false
  });

  // Sample applications data
  const applications: Application[] = [
    {
      id: 1,
      employeeNo: '9512',
      // Personal Details
      title: 'Mr',
      fullName: 'Test SL CERT',
      nameWithInitials: 'TEST SL CERT',
      firstName: 'TEST',
      lastName: 'CERT',
      nic: '125556666V',
      birthDay: '01/16/1978',
      designation: 'Director Admin',
      division: 'DGM (Employment Approval)',
      grade: 'HM 1-1',
      civilStatus: 'Married',
      // Contact Details
      permanentAddressLine1: 'No 123, Main Street',
      permanentAddressLine2: 'Colombo 03',
      permanentTown: 'Colombo',
      temporaryAddressLine1: 'No 456, Temple Road',
      temporaryAddressLine2: 'Kandy',
      temporaryTown: 'Kandy',
      mobileNumberPersonal: '0771234567',
      phoneNumberOfficial: '0112345678',
      email: 'test@slbfe.lk',
      // Educational Details
      gceOLExamination: true,
      gceALExamination: true,
      higherStudies: false,
      // Other Details
      typeOfEmployment: 'Permanent',
      dateOfPermanent: '2020-01-15',
      joinDateContract: '',
      joinDateCasual: '',
      // Application Meta
      appliedDate: '2024-03-15',
      status: 'pending'
    },
    {
      id: 2,
      employeeNo: "9521",
      title: 'Ms',
      fullName: "Jane Smith",
      nameWithInitials: "J. S. Smith",
      firstName: "Jane",
      lastName: "Smith",
      nic: "890456789V",
      birthDay: "1989-04-15",
      designation: "HR Coordinator",
      division: "Human Resources",
      grade: "Grade 1",
      civilStatus: "Married",
      permanentAddressLine1: "789 Pine St",
      permanentAddressLine2: "Kandy",
      permanentTown: "Kandy",
      temporaryAddressLine1: "321 Cedar Rd",
      temporaryAddressLine2: "Colombo 05",
      temporaryTown: "Colombo",
      mobileNumberPersonal: "077-2345678",
      phoneNumberOfficial: "011-2345679",
      email: "jane.smith@slbfe.lk",
      gceOLExamination: true,
      gceALExamination: true,
      higherStudies: false,
      typeOfEmployment: "Permanent",
      dateOfPermanent: "2020-06-01",
      joinDateContract: "",
      joinDateCasual: "",
      appliedDate: "2025-09-26",
      status: "approved"
    },
    {
      id: 3,
      employeeNo: "9522",
      title: 'Mr',
      fullName: "Michael Johnson",
      nameWithInitials: "M. J. Johnson",
      firstName: "Michael",
      lastName: "Johnson",
      nic: "891234567V",
      birthDay: "1995-12-08",
      designation: "Accountant",
      division: "Finance Department",
      grade: "Grade 3",
      civilStatus: "Single",
      permanentAddressLine1: "456 Oak Ave",
      permanentAddressLine2: "Galle",
      permanentTown: "Galle",
      temporaryAddressLine1: "654 Maple Rd",
      temporaryAddressLine2: "Colombo 07",
      temporaryTown: "Colombo",
      mobileNumberPersonal: "077-3456789",
      phoneNumberOfficial: "031-2234567",
      email: "michael.johnson@slbfe.lk",
      gceOLExamination: true,
      gceALExamination: false,
      higherStudies: true,
      typeOfEmployment: "Contract",
      dateOfPermanent: "",
      joinDateContract: "2023-03-15",
      joinDateCasual: "",
      appliedDate: "2025-09-27",
      status: "pending"
    },
    {
      id: 4,
      employeeNo: "9523",
      title: 'Ms',
      fullName: "Sarah Wilson",
      nameWithInitials: "S. W. Wilson",
      firstName: "Sarah",
      lastName: "Wilson",
      nic: "945678901V",
      birthDay: "1988-03-22",
      designation: "Marketing Specialist",
      division: "Marketing Department",
      grade: "Grade 2",
      civilStatus: "Single",
      permanentAddressLine1: "987 Cedar Ln",
      permanentAddressLine2: "Matara",
      permanentTown: "Matara",
      temporaryAddressLine1: "753 Birch St",
      temporaryAddressLine2: "Mount Lavinia",
      temporaryTown: "Colombo",
      mobileNumberPersonal: "077-4567890",
      phoneNumberOfficial: "041-2123456",
      email: "sarah.wilson@slbfe.lk",
      gceOLExamination: true,
      gceALExamination: true,
      higherStudies: false,
      typeOfEmployment: "Permanent",
      dateOfPermanent: "2021-08-10",
      joinDateContract: "",
      joinDateCasual: "",
      appliedDate: "2025-09-28",
      status: "rejected"
    },
    {
      id: 5,
      employeeNo: "9524",
      title: 'Mr',
      fullName: "David Brown",
      nameWithInitials: "D. B. Brown",
      firstName: "David",
      lastName: "Brown",
      nic: "887654321V",
      birthDay: "1982-07-10",
      designation: "Project Manager",
      division: "Operations Department",
      grade: "Grade 4",
      civilStatus: "Married",
      permanentAddressLine1: "147 Elm St",
      permanentAddressLine2: "Jaffna",
      permanentTown: "Jaffna",
      temporaryAddressLine1: "852 Spruce Ave",
      temporaryAddressLine2: "Colombo 03",
      temporaryTown: "Colombo",
      mobileNumberPersonal: "077-5678901",
      phoneNumberOfficial: "021-2987654",
      email: "david.brown@slbfe.lk",
      gceOLExamination: true,
      gceALExamination: true,
      higherStudies: true,
      typeOfEmployment: "Permanent",
      dateOfPermanent: "2019-11-20",
      joinDateContract: "",
      joinDateCasual: "",
      appliedDate: "2025-09-25",
      status: "pending"
    }
  ];

  // Calculate statistics (matching the attached image)
  const applicationStats = {
    total: 5,
    pending: 2,
    approved: 2,
    rejected: 1,
    thisWeek: 5
  };

  // Filter applications based on search and status
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });



  const StatCard = ({ title, value, color, percentage, icon: Icon }: any) => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {percentage && (
            <p className="text-sm text-gray-500 mt-1">
              <span className={`font-medium ${color}`}>{percentage}</span> from last month
            </p>
          )}
        </div>
        <div className="p-3 rounded-full bg-gray-50">
          <Icon className="w-8 h-8 text-gray-600" />
        </div>
      </div>
    </div>
  );

  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
    setShowModal(true);
    // Reset confirmation states when opening modal
    setConfirmedSections({
      personal: false,
      contact: false,
      education: false,
      other: false
    });
  };

  const handleSectionConfirmation = (section: 'personal' | 'contact' | 'education' | 'other') => {
    setConfirmedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const allSectionsConfirmed = Object.values(confirmedSections).every(Boolean);

  const handleStatusUpdate = (applicationId: number, newStatus: 'approved' | 'rejected') => {
    // In a real application, this would make an API call
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
          title="This Week"
          value={applicationStats.thisWeek}
          color="text-purple-600"
          percentage="+8%"
          icon={TrendingUp}
        />
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Review
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-medium text-sm">
                          {application.firstName.charAt(0)}{application.lastName.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{application.fullName}</div>
                        <div className="text-sm text-gray-500">{application.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{application.designation}</div>
                    <div className="text-sm text-gray-500">{application.division}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {application.appliedDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => handleViewApplication(application)}
                      className="inline-flex items-center px-3 py-1.5 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
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

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <FileText className="w-6 h-6 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-blue-900">Review Applications</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
            <span className="text-sm font-medium text-green-900">Approve Bulk</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
            <Clock className="w-6 h-6 text-yellow-600 mb-2" />
            <span className="text-sm font-medium text-yellow-900">Schedule Interviews</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <Download className="w-6 h-6 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-purple-900">Export Report</span>
          </button>
        </div>
      </div>

      {/* Application Details Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white max-h-screen overflow-y-auto">
            <div className="mt-3">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Application Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Personal Information */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-blue-600 mb-4 border-b border-gray-200 pb-2">
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Employee No:</label>
                    <p className="text-gray-900">{selectedApplication.employeeNo}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Full Name:</label>
                    <p className="text-gray-900">{selectedApplication.fullName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Name with Initials:</label>
                    <p className="text-gray-900">{selectedApplication.nameWithInitials}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">NIC:</label>
                    <p className="text-gray-900">{selectedApplication.nic}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Birth Date:</label>
                    <p className="text-gray-900">{selectedApplication.birthDay}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Civil Status:</label>
                    <p className="text-gray-900">{selectedApplication.civilStatus}</p>
                  </div>
                </div>
              </div>

              {/* Employment Information */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-blue-600 mb-4 border-b border-gray-200 pb-2">
                  Employment Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Designation:</label>
                    <p className="text-gray-900">{selectedApplication.designation}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Division:</label>
                    <p className="text-gray-900">{selectedApplication.division}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Grade:</label>
                    <p className="text-gray-900">{selectedApplication.grade}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Employment Type:</label>
                    <p className="text-gray-900">{selectedApplication.typeOfEmployment}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-blue-600 mb-4 border-b border-gray-200 pb-2">
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Email:</label>
                    <p className="text-gray-900 flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {selectedApplication.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Personal Mobile:</label>
                    <p className="text-gray-900 flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {selectedApplication.mobileNumberPersonal}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Permanent Address:</label>
                    <p className="text-gray-900">{selectedApplication.permanentAddressLine1}, {selectedApplication.permanentTown}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Temporary Address:</label>
                    <p className="text-gray-900">{selectedApplication.temporaryAddressLine1 || 'Same as permanent address'}, {selectedApplication.temporaryTown || selectedApplication.permanentTown}</p>
                  </div>
                </div>
              </div>

              {/* Educational Qualifications */}
              <div className="mb-6">
                <h4 className="text-md font-semibold text-blue-600 mb-4 border-b border-gray-200 pb-2">
                  Educational Qualifications
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">GCE O/L Examination:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedApplication.gceOLExamination 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedApplication.gceOLExamination ? 'Completed' : 'Not Completed'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">GCE A/L Examination:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedApplication.gceALExamination 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedApplication.gceALExamination ? 'Completed' : 'Not Completed'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Higher Studies:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedApplication.higherStudies 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedApplication.higherStudies ? 'Completed' : 'Not Completed'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Enhanced Application Review Modal with Multi-Stage Confirmation */}
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

              {/* Multi-Stage Form Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Profile and Progress */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 rounded-lg p-6 text-center sticky top-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-4">Profile Information</h3>
                    
                    <div className="mb-4">
                      <div className="w-32 h-32 rounded-full mx-auto bg-blue-100 flex items-center justify-center">
                        <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                            <span className="text-blue-500 font-bold text-lg">
                              {selectedApplication.firstName.charAt(0)}{selectedApplication.lastName.charAt(0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 text-center space-y-2">
                      <div className="text-sm text-gray-600">Employee No</div>
                      <div className="font-semibold text-lg">{selectedApplication.employeeNo}</div>
                      
                      <div className="text-sm text-gray-600 mt-4">Applied Position</div>
                      <div className="font-medium">{selectedApplication.designation}</div>
                      <div className="text-sm text-gray-500">{selectedApplication.division}</div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="text-sm text-gray-600 mb-2">Application Type</div>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        selectedApplication.typeOfEmployment === 'Permanent' ? 'bg-green-100 text-green-800' :
                        selectedApplication.typeOfEmployment === 'Contract' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedApplication.typeOfEmployment}
                      </div>
                    </div>

                    {/* Confirmation Progress */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-4">Review Progress</h4>
                      <div className="space-y-2">
                        <div className={`flex items-center justify-between p-2 rounded ${confirmedSections.personal ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <span className="text-xs font-medium">Personal Details</span>
                          {confirmedSections.personal && <CheckCircle className="w-4 h-4 text-green-600" />}
                        </div>
                        <div className={`flex items-center justify-between p-2 rounded ${confirmedSections.contact ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <span className="text-xs font-medium">Contact Details</span>
                          {confirmedSections.contact && <CheckCircle className="w-4 h-4 text-green-600" />}
                        </div>
                        <div className={`flex items-center justify-between p-2 rounded ${confirmedSections.education ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <span className="text-xs font-medium">Education Details</span>
                          {confirmedSections.education && <CheckCircle className="w-4 h-4 text-green-600" />}
                        </div>
                        <div className={`flex items-center justify-between p-2 rounded ${confirmedSections.other ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <span className="text-xs font-medium">Other Details</span>
                          {confirmedSections.other && <CheckCircle className="w-4 h-4 text-green-600" />}
                        </div>
                      </div>

                      {allSectionsConfirmed && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center text-green-800">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            <span className="text-sm font-medium">Ready for Final Approval</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Detailed Information with Confirmation Sections */}
                <div className="lg:col-span-2 space-y-8">
                  
                  {/* Personal Details Section */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-blue-600 flex items-center">
                        <FileText className="w-5 h-5 mr-2" />
                        Personal Details
                      </h4>
                      <button
                        onClick={() => handleSectionConfirmation('personal')}
                        className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                          confirmedSections.personal
                            ? 'bg-green-100 text-green-800 border border-green-300'
                            : 'bg-blue-50 text-blue-700 border border-blue-300 hover:bg-blue-100'
                        }`}
                      >
                        {confirmedSections.personal ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Confirmed
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            Confirm Section
                          </>
                        )}
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Title</label>
                        <p className="text-gray-900 font-medium">{selectedApplication.title}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                        <p className="text-gray-900 font-medium">{selectedApplication.fullName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Name with Initials</label>
                        <p className="text-gray-900">{selectedApplication.nameWithInitials}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">First Name</label>
                        <p className="text-gray-900">{selectedApplication.firstName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Last Name</label>
                        <p className="text-gray-900">{selectedApplication.lastName}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">NIC</label>
                        <p className="text-gray-900 font-mono">{selectedApplication.nic}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Birth Date</label>
                        <p className="text-gray-900">{selectedApplication.birthDay}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Civil Status</label>
                        <p className="text-gray-900">{selectedApplication.civilStatus}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Designation</label>
                        <p className="text-gray-900">{selectedApplication.designation}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Division</label>
                        <p className="text-gray-900">{selectedApplication.division}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Grade</label>
                        <p className="text-gray-900">{selectedApplication.grade}</p>
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
                      <button
                        onClick={() => handleSectionConfirmation('contact')}
                        className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                          confirmedSections.contact
                            ? 'bg-green-100 text-green-800 border border-green-300'
                            : 'bg-blue-50 text-blue-700 border border-blue-300 hover:bg-blue-100'
                        }`}
                      >
                        {confirmedSections.contact ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Confirmed
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            Confirm Section
                          </>
                        )}
                      </button>
                    </div>
                    
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
                      <button
                        onClick={() => handleSectionConfirmation('education')}
                        className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                          confirmedSections.education
                            ? 'bg-green-100 text-green-800 border border-green-300'
                            : 'bg-blue-50 text-blue-700 border border-blue-300 hover:bg-blue-100'
                        }`}
                      >
                        {confirmedSections.education ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Confirmed
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            Confirm Section
                          </>
                        )}
                      </button>
                    </div>
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
                      <button
                        onClick={() => handleSectionConfirmation('other')}
                        className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                          confirmedSections.other
                            ? 'bg-green-100 text-green-800 border border-green-300'
                            : 'bg-blue-50 text-blue-700 border border-blue-300 hover:bg-blue-100'
                        }`}
                      >
                        {confirmedSections.other ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Confirmed
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            Confirm Section
                          </>
                        )}
                      </button>
                    </div>
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
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-8 mt-8 border-t border-gray-200">
                <div className="text-sm text-gray-500">
                  Application submitted on {selectedApplication.appliedDate}
                </div>
                
                {selectedApplication.status === 'pending' && (
                  <div className="flex space-x-4">
                    {!allSectionsConfirmed ? (
                      <div className="text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
                        Please confirm all sections before final approval
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(selectedApplication.id, 'rejected')}
                          className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject Application
                        </button>
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
                      </>
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

              {/* Action Buttons */}
              {selectedApplication.status === 'pending' && (
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => handleStatusUpdate(selectedApplication.id, 'rejected')}
                    className="inline-flex items-center px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Application
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedApplication.id, 'approved')}
                    className="inline-flex items-center px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Application
                  </button>
                </div>
              )}
              {selectedApplication.status !== 'pending' && (
                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    Close Review
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;