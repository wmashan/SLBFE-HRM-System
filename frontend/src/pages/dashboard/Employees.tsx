import { 
  Users, 
  Search, 
  Filter, 
  Download, 
  Plus,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Building,
  GraduationCap
} from 'lucide-react';

const Employees = () => {
  // Sample employee data based on user account creation form
  const employees = [
    {
      id: 1,
      employeeNo: "9512",
      fullName: "John Doe",
      nameWithInitials: "J.D. Doe",
      designation: "Software Engineer",
      division: "IT Services",
      grade: "Grade 2",
      email: "john.doe@slbfe.lk",
      mobile: "077-1234567",
      civilStatus: "Single",
      dateJoined: "2023-01-15",
      employmentType: "Permanent"
    },
    {
      id: 2,
      employeeNo: "9513",
      fullName: "Jane Smith",
      nameWithInitials: "J.S. Smith",
      designation: "HR Manager",
      division: "Human Resources",
      grade: "Grade 1",
      email: "jane.smith@slbfe.lk",
      mobile: "077-2345678",
      civilStatus: "Married",
      dateJoined: "2022-06-10",
      employmentType: "Permanent"
    },
    {
      id: 3,
      employeeNo: "9514",
      fullName: "Mike Johnson",
      nameWithInitials: "M.J. Johnson",
      designation: "Data Analyst",
      division: "Analytics",
      grade: "Grade 2",
      email: "mike.johnson@slbfe.lk",
      mobile: "077-3456789",
      civilStatus: "Single",
      dateJoined: "2023-03-20",
      employmentType: "Contract"
    },
    {
      id: 4,
      employeeNo: "9515",
      fullName: "Sarah Wilson",
      nameWithInitials: "S.W. Wilson",
      designation: "Marketing Manager",
      division: "Marketing",
      grade: "Grade 1",
      email: "sarah.wilson@slbfe.lk",
      mobile: "077-4567890",
      civilStatus: "Married",
      dateJoined: "2021-11-05",
      employmentType: "Permanent"
    },
    {
      id: 5,
      employeeNo: "9516",
      fullName: "Tom Brown",
      nameWithInitials: "T.B. Brown",
      designation: "Finance Officer",
      division: "Finance",
      grade: "Grade 2",
      email: "tom.brown@slbfe.lk",
      mobile: "077-5678901",
      civilStatus: "Single",
      dateJoined: "2023-08-12",
      employmentType: "Casual"
    }
  ];

  const employeeStats = {
    total: 1547,
    active: 1523,
    newThisMonth: 45,
    onLeave: 24
  };

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

  const getEmploymentTypeBadge = (type: string) => {
    const typeConfig = {
      Permanent: { color: 'bg-green-100 text-green-800' },
      Contract: { color: 'bg-blue-100 text-blue-800' },
      Casual: { color: 'bg-yellow-100 text-yellow-800' }
    };
    
    const config = typeConfig[type as keyof typeof typeConfig] || { color: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {type}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Employee Management</h2>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            Add Employee
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
          title="Total Employees"
          value={employeeStats.total.toLocaleString()}
          icon={Users}
          color="#3B82F6"
        />
        <StatCard
          title="Active Employees"
          value={employeeStats.active.toLocaleString()}
          icon={Users}
          color="#10B981"
        />
        <StatCard
          title="New This Month"
          value={employeeStats.newThisMonth}
          icon={Plus}
          color="#8B5CF6"
        />
        <StatCard
          title="On Leave"
          value={employeeStats.onLeave}
          icon={Calendar}
          color="#F59E0B"
        />
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Employee Directory</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Designation & Division
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">
                          {employee.nameWithInitials.split(' ')[0]}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{employee.fullName}</div>
                        <div className="text-sm text-gray-500">#{employee.employeeNo}</div>
                        <div className="text-xs text-gray-400">{employee.nameWithInitials}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900 flex items-center">
                        <Building className="w-4 h-4 mr-1 text-gray-400" />
                        {employee.designation}
                      </div>
                      <div className="text-gray-500">{employee.division}</div>
                      <div className="text-xs text-gray-400">{employee.grade}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="flex items-center text-gray-900 mb-1">
                        <Mail className="w-3 h-3 mr-1 text-gray-400" />
                        {employee.email}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Phone className="w-3 h-3 mr-1 text-gray-400" />
                        {employee.mobile}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="mb-2">
                        {getEmploymentTypeBadge(employee.employmentType)}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        Joined: {employee.dateJoined}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900" title="View Profile">
                        <Users className="w-4 h-4" />
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

      {/* Employee Statistics by Division */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Building className="w-5 h-5 mr-2 text-blue-600" />
            Employees by Division
          </h3>
          <div className="space-y-3">
            {[
              { division: 'IT Services', count: 234, color: '#3B82F6' },
              { division: 'Human Resources', count: 156, color: '#10B981' },
              { division: 'Finance', count: 189, color: '#8B5CF6' },
              { division: 'Marketing', count: 145, color: '#F59E0B' },
              { division: 'Analytics', count: 123, color: '#EF4444' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="font-medium text-gray-700">{item.division}</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <GraduationCap className="w-5 h-5 mr-2 text-purple-600" />
            Quick Employee Insights
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-gray-700">Average Age</span>
              <span className="text-lg font-semibold text-blue-600">32 years</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-gray-700">Average Tenure</span>
              <span className="text-lg font-semibold text-green-600">4.2 years</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-gray-700">Higher Education</span>
              <span className="text-lg font-semibold text-purple-600">68%</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
              <span className="text-gray-700">Professional Certs</span>
              <span className="text-lg font-semibold text-orange-600">45%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <Plus className="w-6 h-6 text-green-600 mb-2" />
            <span className="text-sm font-medium text-green-900">Add Employee</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <Download className="w-6 h-6 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-blue-900">Export Directory</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <Building className="w-6 h-6 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-purple-900">Manage Departments</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
            <Users className="w-6 h-6 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-orange-900">Bulk Actions</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Employees;