import { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  Search, 
  Download, 
  Edit3, 
  Plus,
  Users, 
  Calendar,
  BookOpen,
  Award,
  TrendingUp,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';

interface TrainingProgram {
  id: string;
  programName: string;
  category: string;
  duration: string;
  instructor: string;
  startDate: string;
  endDate: string;
  capacity: number;
  enrolled: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  location: string;
  description: string;
}

interface TrainingEnrollment {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  programId: string;
  programName: string;
  enrollmentDate: string;
  completionStatus: 'enrolled' | 'in_progress' | 'completed' | 'dropped';
  attendance: number;
  score?: number;
  certificateIssued: boolean;
}

interface TrainingRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  requestedProgram: string;
  requestDate: string;
  justification: string;
  estimatedCost: number;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
}

const TrainingManagement = () => {
  const [activeTab, setActiveTab] = useState<'programs' | 'enrollments' | 'requests' | 'reports'>('programs');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isAddProgramModalOpen, setIsAddProgramModalOpen] = useState(false);
  
  // Mock data - in real app, this would come from API
  const [trainingPrograms] = useState<TrainingProgram[]>([
    {
      id: '1',
      programName: 'Leadership Development Program',
      category: 'Management',
      duration: '3 months',
      instructor: 'Dr. Sarah Johnson',
      startDate: '2024-02-01',
      endDate: '2024-04-30',
      capacity: 25,
      enrolled: 18,
      status: 'ongoing',
      location: 'Head Office - Training Room A',
      description: 'Comprehensive leadership training for mid-level managers'
    },
    {
      id: '2',
      programName: 'Digital Marketing Fundamentals',
      category: 'Marketing',
      duration: '6 weeks',
      instructor: 'Michael Chen',
      startDate: '2024-03-15',
      endDate: '2024-04-26',
      capacity: 30,
      enrolled: 22,
      status: 'upcoming',
      location: 'Online',
      description: 'Introduction to modern digital marketing strategies'
    },
    {
      id: '3',
      programName: 'Advanced Excel for Business',
      category: 'Technical',
      duration: '4 weeks',
      instructor: 'Lisa Williams',
      startDate: '2024-01-10',
      endDate: '2024-02-07',
      capacity: 20,
      enrolled: 20,
      status: 'completed',
      location: 'Head Office - Computer Lab',
      description: 'Master Excel for data analysis and business intelligence'
    }
  ]);

  const [enrollments] = useState<TrainingEnrollment[]>([
    {
      id: '1',
      employeeId: 'EMP001',
      employeeName: 'John Doe',
      department: 'Sales',
      programId: '2',
      programName: 'Digital Marketing Fundamentals',
      enrollmentDate: '2024-02-15',
      completionStatus: 'enrolled',
      attendance: 0,
      certificateIssued: false
    },
    {
      id: '2',
      employeeId: 'EMP002',
      employeeName: 'Jane Smith',
      department: 'IT',
      programId: '3',
      programName: 'Advanced Excel for Business',
      enrollmentDate: '2024-01-05',
      completionStatus: 'completed',
      attendance: 100,
      score: 92,
      certificateIssued: true
    }
  ]);

  const [trainingRequests] = useState<TrainingRequest[]>([
    {
      id: '1',
      employeeId: 'EMP003',
      employeeName: 'Robert Brown',
      department: 'Engineering',
      requestedProgram: 'AWS Cloud Certification',
      requestDate: '2024-02-20',
      justification: 'Required for upcoming cloud migration project',
      estimatedCost: 2500,
      status: 'pending'
    },
    {
      id: '2',
      employeeId: 'EMP004',
      employeeName: 'Emily Davis',
      department: 'HR',
      requestedProgram: 'Conflict Resolution Workshop',
      requestDate: '2024-02-18',
      justification: 'To improve employee relations and mediation skills',
      estimatedCost: 800,
      status: 'approved',
      approvedBy: 'HR Manager'
    }
  ]);

  // Filter training programs
  const filteredPrograms = useMemo(() => {
    return trainingPrograms.filter(program => {
      const matchesSearch = program.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          program.instructor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || program.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [trainingPrograms, searchTerm, selectedCategory]);

  // Filter enrollments
  const filteredEnrollments = useMemo(() => {
    return enrollments.filter(enrollment => {
      return enrollment.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             enrollment.programName.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [enrollments, searchTerm]);

  // Filter requests
  const filteredRequests = useMemo(() => {
    return trainingRequests.filter(request => {
      return request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             request.requestedProgram.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [trainingRequests, searchTerm]);

  // Calculate statistics
  const stats = {
    totalPrograms: trainingPrograms.length,
    activePrograms: trainingPrograms.filter(p => p.status === 'ongoing').length,
    totalEnrollments: enrollments.length,
    completionRate: Math.round((enrollments.filter(e => e.completionStatus === 'completed').length / enrollments.length) * 100),
    pendingRequests: trainingRequests.filter(r => r.status === 'pending').length
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
      case 'enrolled':
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
      case 'dropped':
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            Training Management
          </h1>
          <p className="text-gray-600 mt-1">Manage employee training programs and development</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
          <Button 
            variant="primary" 
            className="flex items-center gap-2"
            onClick={() => setIsAddProgramModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Add Training Program
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Programs</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalPrograms}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Programs</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activePrograms}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Enrollments</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalEnrollments}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.completionRate}%</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Award className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pendingRequests}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('programs')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'programs'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Training Programs
            </div>
          </button>
          <button
            onClick={() => setActiveTab('enrollments')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'enrollments'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Enrollments
            </div>
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'requests'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Training Requests
              {stats.pendingRequests > 0 && (
                <span className="ml-2 bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded-full">
                  {stats.pendingRequests}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'reports'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Reports & Analytics
            </div>
          </button>
        </nav>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          {activeTab === 'programs' && (
            <div className="sm:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                <option value="Management">Management</option>
                <option value="Technical">Technical</option>
                <option value="Marketing">Marketing</option>
                <option value="Soft Skills">Soft Skills</option>
                <option value="Compliance">Compliance</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      {activeTab === 'programs' && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Program Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Schedule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrollment
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
                {filteredPrograms.map((program) => (
                  <tr key={program.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{program.programName}</div>
                        <div className="text-sm text-gray-500">{program.duration}</div>
                        <div className="text-xs text-gray-400 mt-1">{program.location}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                        {program.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {program.instructor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(program.startDate)}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        to {formatDate(program.endDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {program.enrolled} / {program.capacity}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(program.enrolled / program.capacity) * 100}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(program.status)}`}>
                        {program.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-800">
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredPrograms.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No training programs found</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'enrollments' && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Program
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrollment Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attendance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Certificate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEnrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">{enrollment.employeeName}</div>
                        <div className="text-sm text-gray-500">{enrollment.department}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{enrollment.programName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(enrollment.enrollmentDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{enrollment.attendance}%</div>
                      <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${enrollment.attendance}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {enrollment.score ? `${enrollment.score}%` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(enrollment.completionStatus)}`}>
                        {enrollment.completionStatus.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {enrollment.certificateIssued ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-gray-400" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredEnrollments.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No enrollments found</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requested Program
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estimated Cost
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
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">{request.employeeName}</div>
                        <div className="text-sm text-gray-500">{request.department}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">{request.requestedProgram}</div>
                      <div className="text-xs text-gray-500 mt-1">{request.justification}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(request.requestDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${request.estimatedCost.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        {request.status === 'pending' && (
                          <>
                            <Button variant="primary" size="sm">
                              Approve
                            </Button>
                            <Button variant="secondary" size="sm">
                              Reject
                            </Button>
                          </>
                        )}
                        <button className="text-blue-600 hover:text-blue-800">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredRequests.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No training requests found</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Training Analytics & Reports
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Completion Trends</h4>
                <p className="text-sm text-gray-600">Track training completion rates over time</p>
                <div className="mt-4 h-40 bg-gray-50 rounded flex items-center justify-center">
                  <p className="text-gray-400">Chart placeholder - Integration needed</p>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Department Participation</h4>
                <p className="text-sm text-gray-600">Training participation by department</p>
                <div className="mt-4 h-40 bg-gray-50 rounded flex items-center justify-center">
                  <p className="text-gray-400">Chart placeholder - Integration needed</p>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Training ROI</h4>
                <p className="text-sm text-gray-600">Return on investment for training programs</p>
                <div className="mt-4 h-40 bg-gray-50 rounded flex items-center justify-center">
                  <p className="text-gray-400">Chart placeholder - Integration needed</p>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Skills Development</h4>
                <p className="text-sm text-gray-600">Skills acquired through training programs</p>
                <div className="mt-4 h-40 bg-gray-50 rounded flex items-center justify-center">
                  <p className="text-gray-400">Chart placeholder - Integration needed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <Modal
        isOpen={isAddProgramModalOpen}
        onClose={() => setIsAddProgramModalOpen(false)}
        title="Add Training Program"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Form to add new training program will be implemented here</p>
          {/* Add form fields here */}
        </div>
      </Modal>
    </div>
  );
};

export default TrainingManagement;
