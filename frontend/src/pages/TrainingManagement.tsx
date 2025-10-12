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
  FileText,
  Trash2,
  Save,
  X,
  CalendarDays,
  MapPin,
  Edit,
  Link2,
  Copy,
  BarChart3,
  MessageSquare
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
  programType?: 'regular' | 'special';
  requestType?: 'divisional_request' | 'increment_form' | 'sectional_request' | 'performance_improvement';
  requestedBy?: string;
  requestingDepartment?: string;
  requestReason?: string;
  employeeIds?: string[];
  isSpecialTraining?: boolean;
  feedbackLink?: string;
  feedbackCount?: number;
}

interface TrainingFeedback {
  id: string;
  programId: string;
  trainingSubject: string;
  trainingDate: string;
  trainingInstitute: string;
  objectiveClear: 1 | 2 | 3 | 4 | 5; // 1=Strongly Disagree, 5=Strongly Agree
  contentRelevant: 1 | 2 | 3 | 4 | 5;
  presentationEffective: 1 | 2 | 3 | 4 | 5;
  materialsUseful: 1 | 2 | 3 | 4 | 5;
  additionalComments: string;
  submittedDate: string;
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

interface CalendarEvent {
  id: string;
  programId: string;
  programName: string;
  title?: string; // Added for special training display
  category: string;
  instructor: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  duration?: string; // Added for special training display
  location: string;
  capacity: number;
  enrolled: number;
  cost: number;
  objectives: string[];
  prerequisites: string;
  targetAudience: string;
  materials: string[];
  notes: string;
  description?: string; // Added for special training display
  color: string;
  programType?: 'regular' | 'special';
  requestType?: 'divisional_request' | 'increment_form' | 'sectional_request' | 'performance_improvement';
  requestedBy?: string;
  isSpecialTraining?: boolean;
}

const TrainingManagement = () => {
  const [activeTab, setActiveTab] = useState<'programs' | 'enrollments' | 'requests' | 'calendar' | 'reports'>('programs');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isAddProgramModalOpen, setIsAddProgramModalOpen] = useState(false);
  const [isCalendarEventModalOpen, setIsCalendarEventModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'list'>('month');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [programType, setProgramType] = useState<'regular' | 'special'>('regular');
  const [requestType, setRequestType] = useState<'divisional_request' | 'increment_form' | 'sectional_request' | 'performance_improvement'>('divisional_request');
  const [selectedProgramForFeedback, setSelectedProgramForFeedback] = useState<TrainingProgram | null>(null);
  const [isFeedbackLinkModalOpen, setIsFeedbackLinkModalOpen] = useState(false);
  const [isFeedbackResultsModalOpen, setIsFeedbackResultsModalOpen] = useState(false);
  const [feedbackData, setFeedbackData] = useState<TrainingFeedback[]>([]);
  
  // Mock data - in real app, this would come from API
  const [trainingPrograms, setTrainingPrograms] = useState<TrainingProgram[]>([
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

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      programId: '1',
      programName: 'Leadership Development Program',
      category: 'Management',
      instructor: 'Dr. Sarah Johnson',
      startDate: '2025-02-01',
      endDate: '2025-04-30',
      startTime: '09:00',
      endTime: '17:00',
      location: 'Head Office - Training Room A',
      capacity: 25,
      enrolled: 18,
      cost: 5000,
      objectives: ['Develop leadership skills', 'Strategic thinking', 'Team management'],
      prerequisites: 'Minimum 2 years management experience',
      targetAudience: 'Mid-level managers and team leaders',
      materials: ['Leadership handbook', 'Case studies', 'Assessment tools'],
      notes: 'Includes practical sessions and group activities',
      color: '#3B82F6'
    },
    {
      id: '2',
      programId: '2',
      programName: 'Digital Marketing Fundamentals',
      category: 'Marketing',
      instructor: 'Michael Chen',
      startDate: '2025-03-15',
      endDate: '2025-04-26',
      startTime: '14:00',
      endTime: '17:00',
      location: 'Online',
      capacity: 30,
      enrolled: 22,
      cost: 1500,
      objectives: ['SEO basics', 'Social media marketing', 'Content strategy', 'Analytics'],
      prerequisites: 'Basic computer skills',
      targetAudience: 'Marketing team members and interested employees',
      materials: ['Digital marketing guide', 'Online resources', 'Practice assignments'],
      notes: 'Self-paced online modules with weekly live sessions',
      color: '#10B981'
    },
    {
      id: '3',
      programId: '3',
      programName: 'Advanced Excel for Business',
      category: 'Technical',
      instructor: 'Lisa Williams',
      startDate: '2025-05-10',
      endDate: '2025-06-07',
      startTime: '10:00',
      endTime: '13:00',
      location: 'Head Office - Computer Lab',
      capacity: 20,
      enrolled: 15,
      cost: 800,
      objectives: ['Advanced formulas', 'Pivot tables', 'Data visualization', 'Macros'],
      prerequisites: 'Basic Excel knowledge',
      targetAudience: 'All employees working with data',
      materials: ['Excel workbook', 'Practice datasets', 'Quick reference guide'],
      notes: 'Hands-on training with real business scenarios',
      color: '#8B5CF6'
    },
    {
      id: '4',
      programId: '4',
      programName: 'Effective Communication Skills',
      category: 'Soft Skills',
      instructor: 'Dr. Patricia Moore',
      startDate: '2025-06-15',
      endDate: '2025-06-17',
      startTime: '09:00',
      endTime: '16:00',
      location: 'Head Office - Conference Hall',
      capacity: 40,
      enrolled: 32,
      cost: 600,
      objectives: ['Active listening', 'Clear messaging', 'Presentation skills', 'Conflict resolution'],
      prerequisites: 'None',
      targetAudience: 'All employees',
      materials: ['Communication handbook', 'Video materials', 'Role-play scenarios'],
      notes: 'Interactive workshop with group exercises',
      color: '#F59E0B'
    },
    {
      id: '5',
      programId: '5',
      programName: 'Project Management Essentials',
      category: 'Management',
      instructor: 'James Anderson',
      startDate: '2025-07-01',
      endDate: '2025-08-31',
      startTime: '13:00',
      endTime: '16:00',
      location: 'Head Office - Training Room B',
      capacity: 30,
      enrolled: 0,
      cost: 3500,
      objectives: ['PM methodologies', 'Planning and scheduling', 'Risk management', 'Stakeholder communication'],
      prerequisites: 'None',
      targetAudience: 'Project coordinators and aspiring project managers',
      materials: ['PM handbook', 'Templates', 'Software tools access'],
      notes: 'Preparation for PMP certification',
      color: '#EF4444'
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

  // Generate unique feedback link for a program
  const generateFeedbackLink = (programId: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/training-feedback/${programId}`;
  };

  // Copy link to clipboard
  const copyFeedbackLink = (link: string) => {
    navigator.clipboard.writeText(link);
    alert('Feedback link copied to clipboard!');
  };

  // Calculate feedback statistics
  const calculateFeedbackStats = (programId: string) => {
    const programFeedback = feedbackData.filter(f => f.programId === programId);
    if (programFeedback.length === 0) {
      return null;
    }

    const avgObjectiveClear = programFeedback.reduce((sum, f) => sum + f.objectiveClear, 0) / programFeedback.length;
    const avgContentRelevant = programFeedback.reduce((sum, f) => sum + f.contentRelevant, 0) / programFeedback.length;
    const avgPresentationEffective = programFeedback.reduce((sum, f) => sum + f.presentationEffective, 0) / programFeedback.length;
    const avgMaterialsUseful = programFeedback.reduce((sum, f) => sum + f.materialsUseful, 0) / programFeedback.length;

    return {
      count: programFeedback.length,
      avgObjectiveClear,
      avgContentRelevant,
      avgPresentationEffective,
      avgMaterialsUseful,
      overallAvg: (avgObjectiveClear + avgContentRelevant + avgPresentationEffective + avgMaterialsUseful) / 4
    };
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
            onClick={() => setActiveTab('calendar')}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'calendar'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              Annual Calendar
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
                    Progress
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
                      {(() => {
                        const stats = calculateFeedbackStats(program.id);
                        return stats ? (
                          <div>
                            <button
                              onClick={() => {
                                setSelectedProgramForFeedback(program);
                                setIsFeedbackResultsModalOpen(true);
                              }}
                              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              <MessageSquare className="w-4 h-4" />
                              {stats.count} Feedback
                            </button>
                            <div className="flex items-center gap-1 mt-1">
                              <BarChart3 className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-600">
                                Avg: {stats.overallAvg.toFixed(1)}/5
                              </span>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedProgramForFeedback(program);
                              setIsFeedbackLinkModalOpen(true);
                            }}
                            className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600"
                          >
                            <Link2 className="w-4 h-4" />
                            <span>Get Feedback</span>
                          </button>
                        );
                      })()}
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

      {activeTab === 'calendar' && (
        <div className="space-y-6">
          {/* Calendar Header */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-blue-600" />
                  Annual Training Calendar {selectedYear}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={0}>January</option>
                  <option value={1}>February</option>
                  <option value={2}>March</option>
                  <option value={3}>April</option>
                  <option value={4}>May</option>
                  <option value={5}>June</option>
                  <option value={6}>July</option>
                  <option value={7}>August</option>
                  <option value={8}>September</option>
                  <option value={9}>October</option>
                  <option value={10}>November</option>
                  <option value={11}>December</option>
                </select>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={2024}>2024</option>
                  <option value={2025}>2025</option>
                  <option value={2026}>2026</option>
                </select>
                <div className="border-l pl-3">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setIsCalendarEventModalOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Event
                  </Button>
                </div>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setCalendarView('month')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  calendarView === 'month'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Month View
              </button>
              <button
                onClick={() => setCalendarView('week')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  calendarView === 'week'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Week View
              </button>
              <button
                onClick={() => setCalendarView('list')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  calendarView === 'list'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                List View
              </button>
            </div>
          </div>

          {/* Calendar Events List View */}
          {calendarView === 'list' && (
            <>
              {/* Special Training Section */}
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden mb-6">
                <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-orange-600" />
                      <h4 className="font-semibold text-gray-900">Special Training Programs - {selectedYear}</h4>
                      <span className="px-2 py-0.5 text-xs bg-orange-600 text-white rounded-full">
                        {calendarEvents.filter(e => 
                          new Date(e.startDate).getFullYear() === selectedYear && 
                          e.isSpecialTraining === true
                        ).length}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Manager requests, increment requirements, and performance improvement programs</p>
                </div>
                <div className="divide-y divide-gray-200">
                  {calendarEvents
                    .filter(event => {
                      const eventDate = new Date(event.startDate);
                      return eventDate.getFullYear() === selectedYear && event.isSpecialTraining === true;
                    })
                    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                    .map(event => (
                      <div key={event.id} className="p-4 hover:bg-orange-50 transition-colors border-l-4 border-l-orange-600">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h5 className="font-semibold text-gray-900">{event.title}</h5>
                              <span className="px-2 py-0.5 text-xs bg-orange-600 text-white rounded">Special</span>
                              {event.requestType && (
                                <span className="px-2 py-0.5 text-xs bg-gray-600 text-white rounded">
                                  {event.requestType.replace('_', ' ').toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}</span>
                              </div>
                              {event.requestedBy && (
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4" />
                                  <span>Requested by: {event.requestedBy}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>{event.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{event.duration}</span>
                              </div>
                              {event.description && (
                                <div className="mt-2 text-gray-700">
                                  <p>{event.description}</p>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                // Edit functionality
                                alert('Edit special training event');
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit Event"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this special training event?')) {
                                  setCalendarEvents(calendarEvents.filter(e => e.id !== event.id));
                                }
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Event"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  {calendarEvents.filter(e => 
                    new Date(e.startDate).getFullYear() === selectedYear && 
                    e.isSpecialTraining === true
                  ).length === 0 && (
                    <div className="text-center py-8">
                      <FileText className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No special training programs scheduled for {selectedYear}</p>
                      <p className="text-gray-400 text-xs mt-1">Create special training programs via "Add Training Program" button</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Regular Training Section */}
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="p-4 bg-gray-50 border-b">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900">Regular Training Events - {selectedYear}</h4>
                    <span className="px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full">
                      {calendarEvents.filter(e => 
                        new Date(e.startDate).getFullYear() === selectedYear && 
                        e.isSpecialTraining !== true
                      ).length}
                    </span>
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {calendarEvents
                    .filter(event => {
                      const eventDate = new Date(event.startDate);
                      return eventDate.getFullYear() === selectedYear && event.isSpecialTraining !== true;
                    })
                  .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                  .map((event) => (
                    <div key={event.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: event.color }}
                            />
                            <h4 className="text-lg font-semibold text-gray-900">{event.programName}</h4>
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                              {event.category}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span className="font-medium">Duration:</span>
                                {formatDate(event.startDate)} - {formatDate(event.endDate)}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span className="font-medium">Time:</span>
                                {event.startTime} - {event.endTime}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Users className="w-4 h-4" />
                                <span className="font-medium">Instructor:</span>
                                {event.instructor}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <BookOpen className="w-4 h-4" />
                                <span className="font-medium">Location:</span>
                                {event.location}
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Users className="w-4 h-4" />
                                <span className="font-medium">Capacity:</span>
                                {event.enrolled} / {event.capacity} enrolled
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="font-medium">Cost:</span>
                                ${event.cost.toLocaleString()}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="font-medium">Target:</span>
                                {event.targetAudience}
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${(event.enrolled / event.capacity) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Objectives */}
                          <div className="mt-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Learning Objectives:</p>
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                              {event.objectives.map((obj, idx) => (
                                <li key={idx}>{obj}</li>
                              ))}
                            </ul>
                          </div>

                          {/* Prerequisites & Materials */}
                          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-1">Prerequisites:</p>
                              <p className="text-sm text-gray-600">{event.prerequisites}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-1">Materials:</p>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {event.materials.map((material, idx) => (
                                  <li key={idx}>• {material}</li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Notes */}
                          {event.notes && (
                            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <p className="text-sm text-yellow-800">
                                <span className="font-medium">Note:</span> {event.notes}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => {
                              setSelectedEvent(event);
                              setIsCalendarEventModalOpen(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Event"
                          >
                            <Edit3 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this training event?')) {
                                setCalendarEvents(calendarEvents.filter(e => e.id !== event.id));
                              }
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Event"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {calendarEvents.filter(e => 
                    new Date(e.startDate).getFullYear() === selectedYear && 
                    e.isSpecialTraining !== true
                  ).length === 0 && (
                    <div className="text-center py-8">
                      <Calendar className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No regular training events scheduled for {selectedYear}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Month/Week View - Simplified Calendar Grid */}
          {(calendarView === 'month' || calendarView === 'week') && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {calendarView === 'month' ? 'Month' : 'Week'} Calendar View
                </h3>
                <p className="text-gray-600 mb-4">
                  Visual calendar view coming soon. Use List View to see all training events.
                </p>
                <Button variant="primary" onClick={() => setCalendarView('list')}>
                  Switch to List View
                </Button>
              </div>
            </div>
          )}

          {/* Quick Stats for Selected Period */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <p className="text-sm text-gray-600">Events This Year</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {calendarEvents.filter(e => new Date(e.startDate).getFullYear() === selectedYear).length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <p className="text-sm text-gray-600">Total Capacity</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {calendarEvents
                  .filter(e => new Date(e.startDate).getFullYear() === selectedYear)
                  .reduce((sum, e) => sum + e.capacity, 0)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <p className="text-sm text-gray-600">Total Enrolled</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {calendarEvents
                  .filter(e => new Date(e.startDate).getFullYear() === selectedYear)
                  .reduce((sum, e) => sum + e.enrolled, 0)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <p className="text-sm text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ${calendarEvents
                  .filter(e => new Date(e.startDate).getFullYear() === selectedYear)
                  .reduce((sum, e) => sum + e.cost, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
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
        onClose={() => {
          setIsAddProgramModalOpen(false);
          setProgramType('regular');
          setRequestType('divisional_request');
        }}
        title="Add Training Program"
        size="xl"
      >
        <div className="space-y-5">
          {/* Program Type Selection */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Program Type *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setProgramType('regular')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  programType === 'regular'
                    ? 'border-blue-600 bg-blue-50 shadow-md'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    programType === 'regular' ? 'border-blue-600' : 'border-gray-300'
                  }`}>
                    {programType === 'regular' && (
                      <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    )}
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-semibold text-gray-900">Regular Training</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Standard training programs for general employee development
                    </div>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setProgramType('special')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  programType === 'special'
                    ? 'border-orange-600 bg-orange-50 shadow-md'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    programType === 'special' ? 'border-orange-600' : 'border-gray-300'
                  }`}>
                    {programType === 'special' && (
                      <div className="w-3 h-3 rounded-full bg-orange-600"></div>
                    )}
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-semibold text-gray-900 flex items-center gap-2">
                      Special Training
                      <span className="px-2 py-0.5 text-xs bg-orange-600 text-white rounded">Special</span>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Training based on special requests or mandatory requirements
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Special Request Type - Only shown for Special Training */}
          {programType === 'special' && (
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Special Request Type *
              </label>
              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() => setRequestType('divisional_request')}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    requestType === 'divisional_request'
                      ? 'border-orange-600 bg-white shadow-sm'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      requestType === 'divisional_request' ? 'border-orange-600' : 'border-gray-300'
                    }`}>
                      {requestType === 'divisional_request' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-orange-600"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Divisional Request</div>
                      <div className="text-xs text-gray-600">Requested by relevant divisional manager</div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRequestType('sectional_request')}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    requestType === 'sectional_request'
                      ? 'border-orange-600 bg-white shadow-sm'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      requestType === 'sectional_request' ? 'border-orange-600' : 'border-gray-300'
                    }`}>
                      {requestType === 'sectional_request' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-orange-600"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Sectional Request</div>
                      <div className="text-xs text-gray-600">Requested by relevant sectional manager</div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRequestType('increment_form')}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    requestType === 'increment_form'
                      ? 'border-orange-600 bg-white shadow-sm'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      requestType === 'increment_form' ? 'border-orange-600' : 'border-gray-300'
                    }`}>
                      {requestType === 'increment_form' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-orange-600"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Increment Form Requirement</div>
                      <div className="text-xs text-gray-600">Training required if increment was not issued</div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRequestType('performance_improvement')}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    requestType === 'performance_improvement'
                      ? 'border-orange-600 bg-white shadow-sm'
                      : 'border-gray-300 bg-white hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      requestType === 'performance_improvement' ? 'border-orange-600' : 'border-gray-300'
                    }`}>
                      {requestType === 'performance_improvement' && (
                        <div className="w-2.5 h-2.5 rounded-full bg-orange-600"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">Performance Improvement</div>
                      <div className="text-xs text-gray-600">Training for performance enhancement</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Request Details - Only shown for Special Training */}
          {programType === 'special' && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-600" />
                Request Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Requested By *
                  </label>
                  <Input
                    type="text"
                    placeholder="Manager name or Employee ID"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Requesting Department/Division *
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., IT Department, Sales Division"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Request Reason *
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                    rows={3}
                    placeholder="Detailed reason for this special training request"
                  />
                </div>
                {requestType === 'increment_form' && (
                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium">Increment Form Reference</p>
                        <p className="mt-1">This training is mandatory for employees who were denied increment. Please specify the employees and increment cycle details below.</p>
                      </div>
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Employee IDs (comma-separated)
                  </label>
                  <Input
                    type="text"
                    placeholder="EMP001, EMP002, EMP003"
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty if targeting all employees in department</p>
                </div>
              </div>
            </div>
          )}

          {/* Basic Information Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Program Information
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Program Name *
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Customer Service Excellence"
                  className="w-full"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Select Category</option>
                    <option value="Management">Management</option>
                    <option value="Technical">Technical</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Soft Skills">Soft Skills</option>
                    <option value="Compliance">Compliance</option>
                    <option value="Safety">Safety</option>
                    <option value="Performance">Performance Improvement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration *
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., 2 weeks, 3 months"
                    className="w-full"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructor *
                </label>
                <Input
                  type="text"
                  placeholder="Instructor name"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                  rows={3}
                  placeholder="Brief description of the training program"
                />
              </div>
            </div>
          </div>

          {/* Schedule & Logistics Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Schedule & Logistics
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <Input
                    type="date"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date *
                  </label>
                  <Input
                    type="date"
                    className="w-full"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location *
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Training Room A or Online"
                  className="w-full"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity *
                  </label>
                  <Input
                    type="number"
                    placeholder="25"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation Message */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">
                  {programType === 'special' ? 'Special Training Program' : 'Regular Training Program'}
                </p>
                <p className="mt-1">
                  {programType === 'special' 
                    ? `This program will be added to the annual calendar under "Special Training" section and will be marked as a ${requestType.replace('_', ' ')} requirement.`
                    : 'This program will be added to the regular training calendar.'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              variant="secondary"
              className="flex-1 justify-center"
              onClick={() => {
                setIsAddProgramModalOpen(false);
                setProgramType('regular');
                setRequestType('divisional_request');
              }}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1 justify-center"
              onClick={() => {
                // Form submission logic will be implemented here
                const message = programType === 'special' 
                  ? `Special training program will be created and added to the calendar under "Special Training" section.`
                  : 'Regular training program will be created and added to the calendar.';
                alert(message + '\n\nAPI integration pending.');
                setIsAddProgramModalOpen(false);
                setProgramType('regular');
                setRequestType('divisional_request');
              }}
            >
              <Save className="w-4 h-4 mr-2" />
              Create Program
            </Button>
          </div>
        </div>
      </Modal>

      {/* Calendar Event Modal */}
      <Modal
        isOpen={isCalendarEventModalOpen}
        onClose={() => {
          setIsCalendarEventModalOpen(false);
          setSelectedEvent(null);
        }}
        title={selectedEvent ? 'Edit Training Event' : 'Add Training Event to Calendar'}
        size="xl"
      >
        <div className="space-y-5">
          {/* Basic Information Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Program Name *
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Leadership Development"
                  defaultValue={selectedEvent?.programName}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  defaultValue={selectedEvent?.category}
                >
                  <option value="">Select Category</option>
                  <option value="Management">Management</option>
                  <option value="Technical">Technical</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Soft Skills">Soft Skills</option>
                  <option value="Compliance">Compliance</option>
                  <option value="Safety">Safety</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instructor *
              </label>
              <Input
                type="text"
                placeholder="Instructor name"
                defaultValue={selectedEvent?.instructor}
                className="w-full"
              />
            </div>
          </div>

          {/* Schedule Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" />
              Schedule
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <Input
                  type="date"
                  defaultValue={selectedEvent?.startDate}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date *
                </label>
                <Input
                  type="date"
                  defaultValue={selectedEvent?.endDate}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <Input
                  type="time"
                  defaultValue={selectedEvent?.startTime}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <Input
                  type="time"
                  defaultValue={selectedEvent?.endTime}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Venue & Capacity Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              Venue & Capacity
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <Input
                type="text"
                placeholder="e.g., Training Room A or Online"
                defaultValue={selectedEvent?.location}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity *
                </label>
                <Input
                  type="number"
                  placeholder="25"
                  defaultValue={selectedEvent?.capacity}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cost (USD)
                </label>
                <Input
                  type="number"
                  placeholder="1000"
                  defaultValue={selectedEvent?.cost}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color Tag
                </label>
                <Input
                  type="color"
                  defaultValue={selectedEvent?.color || '#3B82F6'}
                  className="w-full h-10"
                />
              </div>
            </div>
          </div>

          {/* Target Audience Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              Target Audience
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Audience *
              </label>
              <Input
                type="text"
                placeholder="e.g., All employees, Managers, IT team"
                defaultValue={selectedEvent?.targetAudience}
                className="w-full"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prerequisites
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                rows={2}
                placeholder="Any prerequisites for this training"
                defaultValue={selectedEvent?.prerequisites}
              />
            </div>
          </div>

          {/* Learning Content Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Learning Content
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Learning Objectives (comma-separated)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                rows={3}
                placeholder="Objective 1, Objective 2, Objective 3"
                defaultValue={selectedEvent?.objectives.join(', ')}
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple objectives with commas</p>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Training Materials (comma-separated)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                rows={2}
                placeholder="Material 1, Material 2, Material 3"
                defaultValue={selectedEvent?.materials.join(', ')}
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple materials with commas</p>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                rows={3}
                placeholder="Any additional information"
                defaultValue={selectedEvent?.notes}
              />
            </div>
          </div>

          {/* Action Buttons - At the end of form */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
            <Button
              variant="secondary"
              className="flex-1 justify-center"
              onClick={() => {
                setIsCalendarEventModalOpen(false);
                setSelectedEvent(null);
              }}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              variant="primary"
              className="flex-1 justify-center"
              onClick={() => {
                // Form submission logic will be implemented here
                alert('Save functionality will be implemented with API integration');
                setIsCalendarEventModalOpen(false);
                setSelectedEvent(null);
              }}
            >
              <Save className="w-4 h-4 mr-2" />
              {selectedEvent ? 'Update Event' : 'Create Event'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Feedback Link Modal */}
      <Modal
        isOpen={isFeedbackLinkModalOpen}
        onClose={() => {
          setIsFeedbackLinkModalOpen(false);
          setSelectedProgramForFeedback(null);
        }}
        title="Generate Feedback Link"
        size="lg"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Link2 className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Training Evaluation Sheet - HRF/26(E)
                </h3>
                <p className="text-sm text-gray-700 mb-3">
                  Share this link with participants to collect anonymous feedback about the training program: <strong>{selectedProgramForFeedback?.programName}</strong>
                </p>
                <div className="bg-white border border-gray-300 rounded-lg p-3 mt-3">
                  <p className="text-xs text-gray-600 mb-2">Feedback Link:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm text-blue-600 bg-gray-50 px-3 py-2 rounded border border-gray-200 break-all">
                      {selectedProgramForFeedback && generateFeedbackLink(selectedProgramForFeedback.id)}
                    </code>
                    <button
                      onClick={() => selectedProgramForFeedback && copyFeedbackLink(generateFeedbackLink(selectedProgramForFeedback.id))}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-600" />
              Feedback Form Includes:
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Training subject, date, and institute information
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                4 evaluation criteria with 5-point agreement scale
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Additional comments and suggestions section
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Anonymous submission via mobile devices
              </li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Mobile-Friendly Form</p>
                <p className="mt-1">Participants can fill this form anonymously using their mobile devices. All feedback will be collected and displayed in the Progress section.</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="secondary"
              className="flex-1 justify-center"
              onClick={() => {
                setIsFeedbackLinkModalOpen(false);
                setSelectedProgramForFeedback(null);
              }}
            >
              Close
            </Button>
            <Button
              variant="primary"
              className="flex-1 justify-center"
              onClick={() => {
                if (selectedProgramForFeedback) {
                  copyFeedbackLink(generateFeedbackLink(selectedProgramForFeedback.id));
                }
              }}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Link & Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Feedback Results Modal */}
      <Modal
        isOpen={isFeedbackResultsModalOpen}
        onClose={() => {
          setIsFeedbackResultsModalOpen(false);
          setSelectedProgramForFeedback(null);
        }}
        title={`Feedback Results - ${selectedProgramForFeedback?.programName}`}
        size="xl"
      >
        <div className="space-y-4">
          {(() => {
            const stats = selectedProgramForFeedback ? calculateFeedbackStats(selectedProgramForFeedback.id) : null;
            const programFeedback = selectedProgramForFeedback ? feedbackData.filter(f => f.programId === selectedProgramForFeedback.id) : [];

            if (!stats) {
              return (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No feedback received yet</p>
                </div>
              );
            }

            return (
              <>
                {/* Summary Statistics */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 p-5 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      Overall Feedback Summary
                    </h3>
                    <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                      {stats.count} Responses
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Objective Clear */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-xs text-gray-600 mb-1">Objective Clarity</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-gray-900">
                          {stats.avgObjectiveClear.toFixed(1)}
                        </p>
                        <p className="text-sm text-gray-500">/5.0</p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${(stats.avgObjectiveClear / 5) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Content Relevant */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-xs text-gray-600 mb-1">Content Relevance</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-gray-900">
                          {stats.avgContentRelevant.toFixed(1)}
                        </p>
                        <p className="text-sm text-gray-500">/5.0</p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{ width: `${(stats.avgContentRelevant / 5) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Presentation Effective */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-xs text-gray-600 mb-1">Presentation Quality</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-gray-900">
                          {stats.avgPresentationEffective.toFixed(1)}
                        </p>
                        <p className="text-sm text-gray-500">/5.0</p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all"
                          style={{ width: `${(stats.avgPresentationEffective / 5) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Materials Useful */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <p className="text-xs text-gray-600 mb-1">Materials Quality</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-gray-900">
                          {stats.avgMaterialsUseful.toFixed(1)}
                        </p>
                        <p className="text-sm text-gray-500">/5.0</p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-orange-600 h-2 rounded-full transition-all"
                          style={{ width: `${(stats.avgMaterialsUseful / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Overall Score */}
                  <div className="mt-4 bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                          <span className="text-2xl font-bold text-white">
                            {stats.overallAvg.toFixed(1)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Overall Average Rating</p>
                          <p className="text-lg font-bold text-gray-900">
                            {stats.overallAvg >= 4.5 ? 'Excellent' : stats.overallAvg >= 3.5 ? 'Very Good' : stats.overallAvg >= 2.5 ? 'Good' : stats.overallAvg >= 1.5 ? 'Fair' : 'Needs Improvement'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-gray-900">{((stats.overallAvg / 5) * 100).toFixed(0)}%</p>
                        <p className="text-sm text-gray-600">Satisfaction</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Individual Feedback Comments */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-gray-600" />
                    Participant Comments ({programFeedback.filter(f => f.additionalComments).length})
                  </h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {programFeedback.filter(f => f.additionalComments).length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">No comments provided</p>
                    ) : (
                      programFeedback
                        .filter(f => f.additionalComments)
                        .map((feedback, idx) => (
                          <div key={feedback.id} className="bg-white p-3 rounded-lg border border-gray-200">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-medium text-blue-600">#{idx + 1}</span>
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-gray-700">{feedback.additionalComments}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                  Submitted on {formatDate(feedback.submittedDate)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    variant="secondary"
                    className="flex-1 justify-center"
                    onClick={() => {
                      setIsFeedbackResultsModalOpen(false);
                      setSelectedProgramForFeedback(null);
                    }}
                  >
                    Close
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-1 justify-center"
                    onClick={() => {
                      alert('Export feedback report functionality will be implemented');
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </>
            );
          })()}
        </div>
      </Modal>
    </div>
  );
};

export default TrainingManagement;
