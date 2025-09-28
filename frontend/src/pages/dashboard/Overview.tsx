import { 
  Users, 
  Calendar, 
  FileText, 
  UserPlus, 
  TrendingUp, 
  CheckCircle, 
  Phone,
  Mail,
  GraduationCap,
  Building,
  Star,
  Award,
  AlertCircle,
  Activity
} from 'lucide-react';

const Overview = () => {
  // Sample data based on user account creation form structure
  const employeeStats = {
    total: 1547,
    active: 1523,
    newThisMonth: 45,
    onLeave: 24,
    departments: 12,
    averageAge: 32
  };

  const departmentBreakdown = [
    { name: 'Administration', count: 234, percentage: 15.1 },
    { name: 'Employment Approval', count: 187, percentage: 12.1 },
    { name: 'Training & Development', count: 156, percentage: 10.1 },
    { name: 'Finance', count: 145, percentage: 9.4 },
    { name: 'IT Services', count: 123, percentage: 7.9 },
    { name: 'Others', count: 702, percentage: 45.4 }
  ];

  const employeeDistribution = {
    byEmploymentType: [
      { type: 'Permanent', count: 1234, color: '#3B82F6' },
      { type: 'Contract', count: 245, color: '#10B981' },
      { type: 'Casual', count: 68, color: '#F59E0B' }
    ],
    byGrade: [
      { grade: 'Grade 1', count: 245, color: '#8B5CF6' },
      { grade: 'Grade 2', count: 467, color: '#06B6D4' },
      { grade: 'Grade 3', count: 623, color: '#84CC16' },
      { grade: 'Others', count: 212, color: '#F97316' }
    ]
  };

  const educationalStats = {
    gceOL: 1234,
    gceAL: 987,
    higherStudies: 456,
    professional: 234
  };

  const recentActivities = [
    {
      id: 1,
      type: 'new_employee',
      message: 'John Doe joined as Software Engineer',
      time: '2 hours ago',
      icon: UserPlus,
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'promotion',
      message: 'Jane Smith promoted to HR Manager',
      time: '4 hours ago',
      icon: TrendingUp,
      color: 'text-blue-600'
    },
    {
      id: 3,
      type: 'transfer',
      message: 'Mike Johnson transferred to IT Department',
      time: '6 hours ago',
      icon: Building,
      color: 'text-purple-600'
    },
    {
      id: 4,
      type: 'leave',
      message: '15 employees on medical leave this week',
      time: '1 day ago',
      icon: AlertCircle,
      color: 'text-orange-600'
    }
  ];

  const contactSummary = {
    totalContacts: 1547,
    verifiedEmails: 1498,
    verifiedMobiles: 1456,
    missingContacts: 49
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }: any) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-8 h-8" style={{ color }} />
        </div>
      </div>
    </div>
  );

  const ProgressBar = ({ percentage, color }: { percentage: number; color: string }) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className="h-2 rounded-full transition-all duration-300" 
        style={{ width: `${percentage}%`, backgroundColor: color }}
      ></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Employee Overview Dashboard</h2>
        
        {/* Main Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Employees"
            value={employeeStats.total.toLocaleString()}
            subtitle={`${employeeStats.active} active`}
            icon={Users}
            color="#3B82F6"
          />
          <StatCard
            title="New This Month"
            value={employeeStats.newThisMonth}
            subtitle="hiring rate +12%"
            icon={UserPlus}
            color="#10B981"
          />
          <StatCard
            title="Departments"
            value={employeeStats.departments}
            subtitle="across organization"
            icon={Building}
            color="#8B5CF6"
          />
          <StatCard
            title="On Leave Today"
            value={employeeStats.onLeave}
            subtitle="1.6% of workforce"
            icon={Calendar}
            color="#F59E0B"
          />
        </div>

        {/* Department Breakdown and Employment Type */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Department Breakdown */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Building className="w-5 h-5 mr-2 text-blue-600" />
              Department Breakdown
            </h3>
            <div className="space-y-4">
              {departmentBreakdown.map((dept, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{dept.name}</span>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-gray-900">{dept.count}</span>
                      <span className="text-xs text-gray-500 ml-2">({dept.percentage}%)</span>
                    </div>
                  </div>
                  <ProgressBar percentage={dept.percentage} color="#3B82F6" />
                </div>
              ))}
            </div>
          </div>

          {/* Employment Type Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-green-600" />
              Employment Type Distribution
            </h3>
            <div className="space-y-4">
              {employeeDistribution.byEmploymentType.map((type, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3"
                      style={{ backgroundColor: type.color }}
                    ></div>
                    <span className="font-medium text-gray-700">{type.type}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-semibold text-gray-900">{type.count}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({((type.count / employeeStats.total) * 100).toFixed(1)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Educational Background and Contact Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Educational Background */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <GraduationCap className="w-5 h-5 mr-2 text-purple-600" />
              Educational Qualifications
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="font-medium text-gray-700">GCE O/L</span>
                </div>
                <span className="text-lg font-semibold text-blue-600">{educationalStats.gceOL}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                  <span className="font-medium text-gray-700">GCE A/L</span>
                </div>
                <span className="text-lg font-semibold text-green-600">{educationalStats.gceAL}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center">
                  <Award className="w-4 h-4 mr-2 text-purple-600" />
                  <span className="font-medium text-gray-700">Higher Studies</span>
                </div>
                <span className="text-lg font-semibold text-purple-600">{educationalStats.higherStudies}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center">
                  <Star className="w-4 h-4 mr-2 text-orange-600" />
                  <span className="font-medium text-gray-700">Professional Certs</span>
                </div>
                <span className="text-lg font-semibold text-orange-600">{educationalStats.professional}</span>
              </div>
            </div>
          </div>

          {/* Contact Information Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-indigo-600" />
              Contact Information Status
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-gray-600" />
                  <span className="font-medium text-gray-700">Total Contacts</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{contactSummary.totalContacts}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-green-600" />
                  <span className="font-medium text-gray-700">Verified Emails</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-semibold text-green-600">{contactSummary.verifiedEmails}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({((contactSummary.verifiedEmails / contactSummary.totalContacts) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="font-medium text-gray-700">Verified Mobiles</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-semibold text-blue-600">{contactSummary.verifiedMobiles}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({((contactSummary.verifiedMobiles / contactSummary.totalContacts) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2 text-red-600" />
                  <span className="font-medium text-gray-700">Missing Contacts</span>
                </div>
                <span className="text-lg font-semibold text-red-600">{contactSummary.missingContacts}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grade Distribution and Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Grade Distribution */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              Grade Distribution
            </h3>
            <div className="space-y-3">
              {employeeDistribution.byGrade.map((grade, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-3"
                      style={{ backgroundColor: grade.color }}
                    ></div>
                    <span className="font-medium text-gray-700">{grade.grade}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-900">{grade.count}</span>
                    <div className="w-20">
                      <ProgressBar 
                        percentage={(grade.count / employeeStats.total) * 100} 
                        color={grade.color} 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-600" />
              Recent Activities
            </h3>
            <div className="space-y-3">
              {recentActivities.map((activity) => {
                const IconComponent = activity.icon;
                return (
                  <div key={activity.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-full bg-white mr-3 ${activity.color}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <UserPlus className="w-6 h-6 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-blue-900">Add Employee</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <FileText className="w-6 h-6 text-green-600 mb-2" />
              <span className="text-sm font-medium text-green-900">Generate Report</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <Building className="w-6 h-6 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-purple-900">Manage Departments</span>
            </button>
            <button className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
              <TrendingUp className="w-6 h-6 text-orange-600 mb-2" />
              <span className="text-sm font-medium text-orange-900">View Analytics</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;