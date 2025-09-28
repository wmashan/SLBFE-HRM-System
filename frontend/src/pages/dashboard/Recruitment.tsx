import { 
  UserPlus, 
  Search, 
  Filter, 
  Download, 
  Plus,
  Calendar,
  Users,
  Building,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Recruitment = () => {
  const recruitmentStats = {
    activeJobs: 12,
    totalApplicants: 156,
    interviewsScheduled: 23,
    offersExtended: 8
  };

  const activeJobs = [
    {
      id: 1,
      title: "Senior Software Engineer",
      department: "IT Services",
      location: "Colombo",
      type: "Full-time",
      applicants: 45,
      status: "Active",
      postedDate: "2025-09-15"
    },
    {
      id: 2,
      title: "HR Coordinator",
      department: "Human Resources",
      location: "Colombo",
      type: "Full-time",
      applicants: 23,
      status: "Active",
      postedDate: "2025-09-20"
    },
    {
      id: 3,
      title: "Data Analyst",
      department: "Analytics",
      location: "Remote",
      type: "Contract",
      applicants: 31,
      status: "Closed",
      postedDate: "2025-09-10"
    }
  ];

  const upcomingInterviews = [
    {
      id: 1,
      candidate: "John Doe",
      position: "Software Engineer",
      time: "10:00 AM",
      date: "2025-09-29",
      interviewer: "Tech Lead"
    },
    {
      id: 2,
      candidate: "Jane Smith",
      position: "HR Coordinator",
      time: "2:00 PM",
      date: "2025-09-29",
      interviewer: "HR Manager"
    }
  ];

  const StatCard = ({ title, value, color, icon: Icon }: any) => (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-8 h-8" style={{ color }} />
        </div>
      </div>
    </div>
  );

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      Active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      Closed: { color: 'bg-gray-100 text-gray-800', icon: AlertCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Recruitment Management</h2>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Job Posts"
          value={recruitmentStats.activeJobs}
          icon={UserPlus}
          color="#3B82F6"
        />
        <StatCard
          title="Total Applicants"
          value={recruitmentStats.totalApplicants}
          icon={Users}
          color="#10B981"
        />
        <StatCard
          title="Interviews Scheduled"
          value={recruitmentStats.interviewsScheduled}
          icon={Calendar}
          color="#8B5CF6"
        />
        <StatCard
          title="Offers Extended"
          value={recruitmentStats.offersExtended}
          icon={CheckCircle}
          color="#F59E0B"
        />
      </div>

      {/* Active Jobs and Upcoming Interviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Jobs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Active Job Postings</h3>
          </div>
          <div className="p-6 space-y-4">
            {activeJobs.map((job) => (
              <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{job.title}</h4>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Building className="w-4 h-4 mr-1" />
                      {job.department}
                      <span className="mx-2">•</span>
                      <MapPin className="w-4 h-4 mr-1" />
                      {job.location}
                    </div>
                  </div>
                  {getStatusBadge(job.status)}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-1" />
                    {job.applicants} applicants
                  </div>
                  <span className="text-gray-500">Posted: {job.postedDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Interviews</h3>
          </div>
          <div className="p-6 space-y-4">
            {upcomingInterviews.map((interview) => (
              <div key={interview.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{interview.candidate}</h4>
                  <div className="flex items-center text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    <Clock className="w-3 h-3 mr-1" />
                    {interview.time}
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-2">{interview.position}</div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {interview.date}
                  </div>
                  <span>Interviewer: {interview.interviewer}</span>
                </div>
              </div>
            ))}
            <div className="text-center">
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All Interviews →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recruitment Pipeline */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recruitment Pipeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-1">156</div>
            <div className="text-sm text-gray-600">Applications</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600 mb-1">89</div>
            <div className="text-sm text-gray-600">Under Review</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-1">34</div>
            <div className="text-sm text-gray-600">Phone Screen</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">23</div>
            <div className="text-sm text-gray-600">Interview</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 mb-1">8</div>
            <div className="text-sm text-gray-600">Offer</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <Plus className="w-6 h-6 text-green-600 mb-2" />
            <span className="text-sm font-medium text-green-900">Post New Job</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <Calendar className="w-6 h-6 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-blue-900">Schedule Interview</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <Users className="w-6 h-6 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-purple-900">Review Applications</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
            <Download className="w-6 h-6 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-orange-900">Generate Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Recruitment;