import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  FileText,
  TrendingUp
} from 'lucide-react';

interface Application {
  id: number;
  employeeNo: string;
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
  email: string;
  mobile: string;
  permanentAddress: string;
  temporaryAddress: string;
  gceOL: boolean;
  gceAL: boolean;
  higherStudies: boolean;
  employmentType: string;
  appliedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  profilePicture?: string;
}

const Applications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Sample applications data based on user account creation form structure
  const applications: Application[] = [
    {
      id: 1,
      employeeNo: "9520",
      fullName: "John Doe",
      nameWithInitials: "J. Doe",
      firstName: "John",
      lastName: "Doe",
      nic: "920123456V",
      birthDay: "1992-01-23",
      designation: "Software Engineer",
      division: "IT Services",
      grade: "Grade 2",
      civilStatus: "Single",
      email: "john.doe@email.com",
      mobile: "077-1234567",
      permanentAddress: "123 Main St, Colombo 03",
      temporaryAddress: "456 Oak Ave, Colombo 07",
      gceOL: true,
      gceAL: true,
      higherStudies: true,
      employmentType: "Permanent",
      appliedDate: "2025-09-27",
      status: "pending"
    },
    {
      id: 2,
      employeeNo: "9521",
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
      email: "jane.smith@email.com",
      mobile: "077-2345678",
      permanentAddress: "789 Pine St, Kandy",
      temporaryAddress: "321 Cedar Rd, Colombo 05",
      gceOL: true,
      gceAL: true,
      higherStudies: false,
      employmentType: "Permanent",
      appliedDate: "2025-09-26",
      status: "approved"
    },
    {
      id: 3,
      employeeNo: "9522",
      fullName: "Mike Johnson",
      nameWithInitials: "M. J. Johnson",
      firstName: "Mike",
      lastName: "Johnson",
      nic: "950789123V",
      birthDay: "1995-07-08",
      designation: "Data Analyst",
      division: "Analytics",
      grade: "Grade 2",
      civilStatus: "Single",
      email: "mike.johnson@email.com",
      mobile: "077-3456789",
      permanentAddress: "654 Elm St, Galle",
      temporaryAddress: "987 Maple Ave, Colombo 06",
      gceOL: true,
      gceAL: true,
      higherStudies: true,
      employmentType: "Contract",
      appliedDate: "2025-09-25",
      status: "rejected"
    },
    {
      id: 4,
      employeeNo: "9523",
      fullName: "Sarah Wilson",
      nameWithInitials: "S. W. Wilson",
      firstName: "Sarah",
      lastName: "Wilson",
      nic: "870234567V",
      birthDay: "1987-02-12",
      designation: "Marketing Manager",
      division: "Marketing",
      grade: "Grade 1",
      civilStatus: "Married",
      email: "sarah.wilson@email.com",
      mobile: "077-4567890",
      permanentAddress: "147 Beach Rd, Negombo",
      temporaryAddress: "258 Hill St, Colombo 04",
      gceOL: true,
      gceAL: true,
      higherStudies: true,
      employmentType: "Permanent",
      appliedDate: "2025-09-24",
      status: "pending"
    },
    {
      id: 5,
      employeeNo: "9524",
      fullName: "Tom Brown",
      nameWithInitials: "T. B. Brown",
      firstName: "Tom",
      lastName: "Brown",
      nic: "930567890V",
      birthDay: "1993-05-30",
      designation: "Finance Officer",
      division: "Finance",
      grade: "Grade 2",
      civilStatus: "Single",
      email: "tom.brown@email.com",
      mobile: "077-5678901",
      permanentAddress: "369 Lake View, Kurunegala",
      temporaryAddress: "741 Garden St, Colombo 08",
      gceOL: true,
      gceAL: false,
      higherStudies: false,
      employmentType: "Casual",
      appliedDate: "2025-09-23",
      status: "approved"
    }
  ];

  // Calculate statistics
  const applicationStats = {
    total: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
    thisWeek: applications.filter(app => {
      const appDate = new Date(app.appliedDate);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return appDate >= weekAgo;
    }).length
  };

  // Filter applications based on search and status
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.designation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

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
  };

  const handleStatusUpdate = (applicationId: number, newStatus: 'approved' | 'rejected') => {
    // In a real application, this would make an API call
    console.log(`Updating application ${applicationId} status to ${newStatus}`);
    setShowModal(false);
    setSelectedApplication(null);
    // You would update the applications list here
  };

  const handleDeleteApplication = (applicationId: number) => {
    // In a real application, this would make an API call
    console.log(`Deleting application ${applicationId}`);
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
            <Filter className="w-4 h-4 mr-2" />
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
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
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
                    {getStatusBadge(application.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleViewApplication(application)}
                        className="text-blue-600 hover:text-blue-900" 
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteApplication(application.id)}
                        className="text-red-600 hover:text-red-900" 
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
                    <p className="text-gray-900">{selectedApplication.employmentType}</p>
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
                    <label className="block text-sm font-medium text-gray-500">Mobile:</label>
                    <p className="text-gray-900 flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {selectedApplication.mobile}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Permanent Address:</label>
                    <p className="text-gray-900">{selectedApplication.permanentAddress}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Temporary Address:</label>
                    <p className="text-gray-900">{selectedApplication.temporaryAddress}</p>
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
                      selectedApplication.gceOL 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedApplication.gceOL ? 'Completed' : 'Not Completed'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">GCE A/L Examination:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedApplication.gceAL 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedApplication.gceAL ? 'Completed' : 'Not Completed'}
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

              {/* Action Buttons */}
              {selectedApplication.status === 'pending' && (
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => handleStatusUpdate(selectedApplication.id, 'rejected')}
                    className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Reject Application
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedApplication.id, 'approved')}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Approve Application
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