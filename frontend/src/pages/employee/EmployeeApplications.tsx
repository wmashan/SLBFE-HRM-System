import React, { useState } from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Download,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import NewApplicationModal from '../../components/common/NewApplicationModal';

interface Application {
  id: number;
  type: string;
  title: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  description: string;
}

interface EmployeeApplicationsProps {
  applications: Application[];
}

const EmployeeApplications: React.FC<EmployeeApplicationsProps> = ({ applications }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [applicationList, setApplicationList] = useState(applications);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNewApplication = (newApp: Application) => {
    setApplicationList(prev => [newApp, ...prev]);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredApplications = applicationList.filter(app => {
    const matchesFilter = filter === 'all' || app.status === filter;
    const matchesSearch = app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusCount = (status: string) => {
    if (status === 'all') return applicationList.length;
    return applicationList.filter(app => app.status === status).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Applications</h2>
          <p className="text-sm text-gray-600 mt-1">Track and manage your submitted applications</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Application
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{getStatusCount('all')}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{getStatusCount('pending')}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{getStatusCount('approved')}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{getStatusCount('rejected')}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search applications..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="w-5 h-5 text-gray-400" />
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-lg shadow">
        {filteredApplications.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredApplications.map((application) => (
              <div key={application.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{application.title}</h3>
                      {getStatusBadge(application.status)}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                        {application.type}
                      </span>
                      <span>Submitted: {application.submittedDate}</span>
                    </div>
                    
                    <p className="text-gray-700 mb-4">{application.description}</p>
                    
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded text-sm">
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1.5 text-gray-600 hover:bg-gray-50 rounded text-sm">
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'You haven\'t submitted any applications yet.'}
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Submit New Application
            </button>
          </div>
        )}
      </div>

      {/* New Application Modal */}
      <NewApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNewApplication}
      />
    </div>
  );
};

export default EmployeeApplications;