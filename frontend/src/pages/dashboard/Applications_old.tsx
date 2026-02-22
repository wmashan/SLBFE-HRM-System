import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Edit, 
  Trash2, 
  Clock, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';

const Applications = () => {
  // Sample data for applications
  const recentApplications = [
    {
      id: 1,
      name: "John Doe",
      position: "Software Engineer",
      appliedDate: "2025-09-27",
      status: "pending",
      email: "john.doe@email.com"
    },
    {
      id: 2,
      name: "Jane Smith",
      position: "HR Coordinator",
      appliedDate: "2025-09-26",
      status: "approved",
      email: "jane.smith@email.com"
    },
    {
      id: 3,
      name: "Mike Johnson",
      position: "Data Analyst",
      appliedDate: "2025-09-25",
      status: "rejected",
      email: "mike.johnson@email.com"
    },
    {
      id: 4,
      name: "Sarah Wilson",
      position: "Marketing Manager",
      appliedDate: "2025-09-24",
      status: "pending",
      email: "sarah.wilson@email.com"
    },
    {
      id: 5,
      name: "Tom Brown",
      position: "Finance Officer",
      appliedDate: "2025-09-23",
      status: "approved",
      email: "tom.brown@email.com"
    }
  ];

  const applicationStats = {
    total: 156,
    pending: 23,
    approved: 89,
    rejected: 44,
    thisWeek: 12
  };

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

  const StatCard = ({ title, value, color, percentage }: any) => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {percentage && (
            <p className="text-sm text-gray-500 mt-1">
              <span className={`font-medium ${color}`}>{percentage}</span> from last month
            </p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Job Applications</h2>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search applications..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Applications"
          value={applicationStats.total}
          color="text-blue-600"
          percentage="+15%"
        />
        <StatCard
          title="Pending Review"
          value={applicationStats.pending}
          color="text-yellow-600"
          percentage="+5%"
        />
        <StatCard
          title="Approved"
          value={applicationStats.approved}
          color="text-green-600"
          percentage="+12%"
        />
        <StatCard
          title="This Week"
          value={applicationStats.thisWeek}
          color="text-purple-600"
          percentage="+8%"
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
              {recentApplications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-medium text-sm">
                          {application.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{application.name}</div>
                        <div className="text-sm text-gray-500">{application.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {application.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {application.appliedDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(application.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900" title="Delete">
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
    </div>
  );
};

export default Applications;