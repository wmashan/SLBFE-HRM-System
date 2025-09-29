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
  GraduationCap,
  ChevronDown,
  X,
  FileText,
  Award,
  UserCheck,
  Clock
} from 'lucide-react';

import { useState } from 'react';

const Employees = () => {
  // Filter state management
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    promotion: 'all',
    gender: 'all',
    ageGroup: 'all',
    customAgeType: 'range', // 'range', 'fixed', 'above', 'below'
    ageRangeFrom: '',
    ageRangeTo: '',
    fixedAge: '',
    education: 'all',
    employmentType: 'all',
    division: 'all',
    branch: 'all',
    dateFrom: '',
    dateTo: ''
  });
  // Enhanced employee data with demographics and education
  const employees = [
    {
      id: 1,
      employeeNo: "9512",
      fullName: "John Doe",
      nameWithInitials: "J.D. Doe",
      designation: "Software Engineer",
      division: "IT Services",
      branch: "Colombo Main",
      grade: "Grade 2",
      email: "john.doe@slbfe.lk",
      mobile: "077-1234567",
      civilStatus: "Single",
      gender: "Male",
      age: 28,
      dateOfBirth: "1995-05-15",
      dateJoined: "2023-01-15",
      employmentType: "Permanent",
      promotions: [
        { date: "2023-12-01", from: "Junior Software Engineer", to: "Software Engineer" }
      ],
      education: {
        highestQualification: "Graduate",
        qualifications: ["O/L", "A/L", "Bachelor's Degree"]
      }
    },
    {
      id: 2,
      employeeNo: "9513",
      fullName: "Jane Smith",
      nameWithInitials: "J.S. Smith",
      designation: "HR Manager",
      division: "Human Resources",
      branch: "Colombo Main",
      grade: "Grade 1",
      email: "jane.smith@slbfe.lk",
      mobile: "077-2345678",
      civilStatus: "Married",
      gender: "Female",
      age: 36,
      dateOfBirth: "1987-08-22",
      dateJoined: "2022-06-10",
      employmentType: "Permanent",
      promotions: [
        { date: "2023-01-01", from: "Senior HR Officer", to: "HR Manager" }
      ],
      education: {
        highestQualification: "Graduate",
        qualifications: ["O/L", "A/L", "Master's Degree"]
      }
    },
    {
      id: 3,
      employeeNo: "9514",
      fullName: "Mike Johnson",
      nameWithInitials: "M.J. Johnson",
      designation: "Data Analyst",
      division: "Analytics",
      branch: "Kandy Branch",
      grade: "Grade 2",
      email: "mike.johnson@slbfe.lk",
      mobile: "077-3456789",
      civilStatus: "Single",
      gender: "Male",
      age: 31,
      dateOfBirth: "1992-12-10",
      dateJoined: "2023-03-20",
      employmentType: "Contract",
      promotions: [],
      education: {
        highestQualification: "Diploma",
        qualifications: ["O/L", "A/L", "Diploma"]
      }
    },
    {
      id: 4,
      employeeNo: "9515",
      fullName: "Sarah Wilson",
      nameWithInitials: "S.W. Wilson",
      designation: "Marketing Manager",
      division: "Marketing",
      branch: "Galle Branch",
      grade: "Grade 1",
      email: "sarah.wilson@slbfe.lk",
      mobile: "077-4567890",
      civilStatus: "Married",
      gender: "Female",
      age: 38,
      dateOfBirth: "1985-11-05",
      dateJoined: "2021-11-05",
      employmentType: "Permanent",
      promotions: [
        { date: "2022-11-01", from: "Marketing Officer", to: "Marketing Manager" }
      ],
      education: {
        highestQualification: "Graduate",
        qualifications: ["O/L", "A/L", "Bachelor's Degree", "Professional Certificate"]
      }
    },
    {
      id: 5,
      employeeNo: "9516",
      fullName: "Tom Brown",
      nameWithInitials: "T.B. Brown",
      designation: "Finance Officer",
      division: "Finance",
      branch: "Matara Branch",
      grade: "Grade 2",
      email: "tom.brown@slbfe.lk",
      mobile: "077-5678901",
      civilStatus: "Single",
      gender: "Male",
      age: 26,
      dateOfBirth: "1997-08-12",
      dateJoined: "2023-08-12",
      employmentType: "Casual",
      promotions: [],
      education: {
        highestQualification: "Certificate",
        qualifications: ["O/L", "A/L", "Certificate"]
      }
    },
    {
      id: 6,
      employeeNo: "9517",
      fullName: "Emily Davis",
      nameWithInitials: "E.D. Davis",
      designation: "Senior Developer",
      division: "IT Services",
      branch: "Colombo Main",
      grade: "Grade 1",
      email: "emily.davis@slbfe.lk",
      mobile: "077-6789012",
      civilStatus: "Married",
      gender: "Female",
      age: 35,
      dateOfBirth: "1988-03-18",
      dateJoined: "2020-03-18",
      employmentType: "Permanent",
      promotions: [
        { date: "2021-03-01", from: "Developer", to: "Senior Developer" }
      ],
      education: {
        highestQualification: "Graduate",
        qualifications: ["O/L", "A/L", "Bachelor's Degree"]
      }
    },
    {
      id: 7,
      employeeNo: "9518",
      fullName: "Alex Turner",
      nameWithInitials: "A.T. Turner",
      designation: "Administrative Assistant",
      division: "Administration",
      branch: "Colombo Main",
      grade: "Grade 3",
      email: "alex.turner@slbfe.lk",
      mobile: "077-7890123",
      civilStatus: "Single",
      gender: "Male",
      age: 23,
      dateOfBirth: "2000-07-25",
      dateJoined: "2024-01-10",
      employmentType: "Contract",
      promotions: [],
      education: {
        highestQualification: "A/L",
        qualifications: ["O/L", "A/L"]
      }
    },
    {
      id: 8,
      employeeNo: "9519",
      fullName: "Maria Garcia",
      nameWithInitials: "M.G. Garcia",
      designation: "Quality Assurance Manager",
      division: "Quality Assurance",
      branch: "Kandy Branch",
      grade: "Grade 1",
      email: "maria.garcia@slbfe.lk",
      mobile: "077-8901234",
      civilStatus: "Married",
      gender: "Female",
      age: 40,
      dateOfBirth: "1983-09-12",
      dateJoined: "2019-09-12",
      employmentType: "Permanent",
      promotions: [
        { date: "2020-09-01", from: "QA Officer", to: "QA Manager" }
      ],
      education: {
        highestQualification: "Graduate",
        qualifications: ["O/L", "A/L", "Bachelor's Degree", "Master's Degree"]
      }
    }
  ];

  // Filter handling functions
  const handleFilterChange = (filterKey: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterKey]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      promotion: 'all',
      gender: 'all',
      ageGroup: 'all',
      customAgeType: 'range',
      ageRangeFrom: '',
      ageRangeTo: '',
      fixedAge: '',
      education: 'all',
      employmentType: 'all',
      division: 'all',
      branch: 'all',
      dateFrom: '',
      dateTo: ''
    });
    setSearchTerm('');
  };

  // Apply filters to employee data
  const filteredEmployees = employees.filter(employee => {
    // Search term filter
    const matchesSearch = searchTerm === '' || 
      employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeNo.includes(searchTerm) ||
      employee.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.division.toLowerCase().includes(searchTerm.toLowerCase());

    // Promotion filter
    const matchesPromotion = filters.promotion === 'all' || 
      (filters.promotion === 'promoted' && employee.promotions.length > 0) ||
      (filters.promotion === 'not-promoted' && employee.promotions.length === 0);

    // Gender filter
    const matchesGender = filters.gender === 'all' || employee.gender === filters.gender;

    // Age group filter with custom criteria
    let matchesAgeGroup = true;
    if (filters.ageGroup !== 'all') {
      if (filters.ageGroup === 'custom') {
        // Handle custom age criteria
        if (filters.customAgeType === 'range') {
          const ageFrom = parseInt(filters.ageRangeFrom) || 0;
          const ageTo = parseInt(filters.ageRangeTo) || 100;
          matchesAgeGroup = employee.age >= ageFrom && employee.age <= ageTo;
        } else if (filters.customAgeType === 'fixed') {
          const fixedAge = parseInt(filters.fixedAge);
          matchesAgeGroup = fixedAge ? employee.age === fixedAge : true;
        } else if (filters.customAgeType === 'above') {
          const fixedAge = parseInt(filters.fixedAge);
          matchesAgeGroup = fixedAge ? employee.age > fixedAge : true;
        } else if (filters.customAgeType === 'below') {
          const fixedAge = parseInt(filters.fixedAge);
          matchesAgeGroup = fixedAge ? employee.age < fixedAge : true;
        }
      }
    }

    // Education filter
    const matchesEducation = filters.education === 'all' ||
      employee.education.highestQualification === filters.education ||
      employee.education.qualifications.includes(filters.education);

    // Employment type filter
    const matchesEmploymentType = filters.employmentType === 'all' || 
      employee.employmentType === filters.employmentType;

    // Division filter
    const matchesDivision = filters.division === 'all' || 
      employee.division === filters.division;

    // Branch filter
    const matchesBranch = filters.branch === 'all' || 
      employee.branch === filters.branch;

    // Date range filter (joined date)
    const matchesDateRange = (!filters.dateFrom || new Date(employee.dateJoined) >= new Date(filters.dateFrom)) &&
                             (!filters.dateTo || new Date(employee.dateJoined) <= new Date(filters.dateTo));

    return matchesSearch && matchesPromotion && matchesGender && matchesAgeGroup && 
           matchesEducation && matchesEmploymentType && matchesDivision && 
           matchesBranch && matchesDateRange;
  });

  // Get unique values for filter options
  const divisions = [...new Set(employees.map(emp => emp.division))];
  const branches = [...new Set(employees.map(emp => emp.branch))];

  const employeeStats = {
    total: filteredEmployees.length,
    active: filteredEmployees.filter(emp => emp.employmentType === 'Permanent').length,
    newThisMonth: filteredEmployees.filter(emp => {
      const joinDate = new Date(emp.dateJoined);
      const currentDate = new Date();
      return joinDate.getMonth() === currentDate.getMonth() && 
             joinDate.getFullYear() === currentDate.getFullYear();
    }).length,
    onLeave: 24 // This would come from a separate leave management system
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

  const getPromotionBadge = (promotions: any[]) => {
    if (promotions.length > 0) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <Award className="w-3 h-3 mr-1" />
          Promoted ({promotions.length})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        No Promotions
      </span>
    );
  };

  const getEducationBadge = (education: any) => {
    const colorMap: {[key: string]: string} = {
      'O/L': 'bg-blue-100 text-blue-800',
      'A/L': 'bg-green-100 text-green-800',
      'Certificate': 'bg-yellow-100 text-yellow-800',
      'Diploma': 'bg-purple-100 text-purple-800',
      'Graduate': 'bg-red-100 text-red-800'
    };
    
    const colorClass = colorMap[education.highestQualification] || 'bg-gray-100 text-gray-800';
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        <GraduationCap className="w-3 h-3 mr-1" />
        {education.highestQualification}
      </span>
    );
  };

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-4 py-2 rounded-md transition-colors ${
              showFilters ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
            <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${
              showFilters ? 'rotate-180' : ''
            }`} />
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

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Filter className="w-5 h-5 mr-2 text-blue-600" />
              Advanced Filters
            </h3>
            <button 
              onClick={clearAllFilters}
              className="flex items-center px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Promotion Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Award className="w-4 h-4 inline mr-1" />
                Promotion Status
              </label>
              <select
                value={filters.promotion}
                onChange={(e) => handleFilterChange('promotion', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Employees</option>
                <option value="promoted">Recently Promoted</option>
                <option value="not-promoted">No Promotions</option>
              </select>
            </div>

            {/* Gender Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <UserCheck className="w-4 h-4 inline mr-1" />
                Gender
              </label>
              <select
                value={filters.gender}
                onChange={(e) => handleFilterChange('gender', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Enhanced Age Group Filter */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Age Criteria
              </label>
              
              {/* Predefined Age Groups */}
              <div className="mb-3">
                <select
                  value={filters.ageGroup}
                  onChange={(e) => handleFilterChange('ageGroup', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Ages</option>
                  <option value="custom">Custom Age Criteria</option>
                </select>
              </div>

              {/* Custom Age Criteria */}
              {filters.ageGroup === 'custom' && (
                <div className="space-y-3 p-3 bg-blue-50 rounded-md border border-blue-200">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Age Criteria Type</label>
                    <select
                      value={filters.customAgeType}
                      onChange={(e) => handleFilterChange('customAgeType', e.target.value)}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="range">Age Range</option>
                      <option value="fixed">Exact Age</option>
                      <option value="above">Above Age</option>
                      <option value="below">Below Age</option>
                    </select>
                  </div>

                  {/* Age Range Inputs */}
                  {filters.customAgeType === 'range' && (
                    <div className="flex space-x-2">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">From Age</label>
                        <input
                          type="number"
                          placeholder="18"
                          min="16"
                          max="80"
                          value={filters.ageRangeFrom}
                          onChange={(e) => handleFilterChange('ageRangeFrom', e.target.value)}
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">To Age</label>
                        <input
                          type="number"
                          placeholder="65"
                          min="16"
                          max="80"
                          value={filters.ageRangeTo}
                          onChange={(e) => handleFilterChange('ageRangeTo', e.target.value)}
                          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Fixed/Above/Below Age Input */}
                  {(filters.customAgeType === 'fixed' || filters.customAgeType === 'above' || filters.customAgeType === 'below') && (
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        {filters.customAgeType === 'fixed' && 'Exact Age'}
                        {filters.customAgeType === 'above' && 'Age Above'}
                        {filters.customAgeType === 'below' && 'Age Below'}
                      </label>
                      <input
                        type="number"
                        placeholder="30"
                        min="16"
                        max="80"
                        value={filters.fixedAge}
                        onChange={(e) => handleFilterChange('fixedAge', e.target.value)}
                        className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  {/* Age Criteria Preview */}
                  <div className="text-xs text-blue-700 bg-blue-100 p-2 rounded">
                    <strong>Preview:</strong>
                    {filters.customAgeType === 'range' && (
                      <span> Ages {filters.ageRangeFrom || '?'} to {filters.ageRangeTo || '?'} years</span>
                    )}
                    {filters.customAgeType === 'fixed' && (
                      <span> Exactly {filters.fixedAge || '?'} years old</span>
                    )}
                    {filters.customAgeType === 'above' && (
                      <span> Above {filters.fixedAge || '?'} years old</span>
                    )}
                    {filters.customAgeType === 'below' && (
                      <span> Below {filters.fixedAge || '?'} years old</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Education Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <GraduationCap className="w-4 h-4 inline mr-1" />
                Education Level
              </label>
              <select
                value={filters.education}
                onChange={(e) => handleFilterChange('education', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Education Levels</option>
                <option value="O/L">O/L Only</option>
                <option value="A/L">A/L Completed</option>
                <option value="Certificate">Certificate Holders</option>
                <option value="Diploma">Diploma Holders</option>
                <option value="Graduate">Graduates</option>
              </select>
            </div>

            {/* Employment Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-1" />
                Employment Type
              </label>
              <select
                value={filters.employmentType}
                onChange={(e) => handleFilterChange('employmentType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="Permanent">Permanent</option>
                <option value="Contract">Contract</option>
                <option value="Casual">Casual</option>
              </select>
            </div>

            {/* Division Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="w-4 h-4 inline mr-1" />
                Division
              </label>
              <select
                value={filters.division}
                onChange={(e) => handleFilterChange('division', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Divisions</option>
                {divisions.map(division => (
                  <option key={division} value={division}>{division}</option>
                ))}
              </select>
            </div>

            {/* Branch Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="w-4 h-4 inline mr-1" />
                Branch
              </label>
              <select
                value={filters.branch}
                onChange={(e) => handleFilterChange('branch', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Branches</option>
                {branches.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>

            {/* Date From Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Joined From
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Date To Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Joined To
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Active Filters Display */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Showing {filteredEmployees.length} of {employees.length} employees
              </span>
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters).map(([key, value]) => {
                  if (value && value !== 'all' && value !== '' && key !== 'customAgeType' && key !== 'ageRangeFrom' && key !== 'ageRangeTo' && key !== 'fixedAge') {
                    let displayValue = value;
                    
                    // Special handling for custom age criteria
                    if (key === 'ageGroup' && value === 'custom') {
                      if (filters.customAgeType === 'range') {
                        displayValue = `Age: ${filters.ageRangeFrom || '?'}-${filters.ageRangeTo || '?'}`;
                      } else if (filters.customAgeType === 'fixed') {
                        displayValue = `Age: ${filters.fixedAge || '?'}`;
                      } else if (filters.customAgeType === 'above') {
                        displayValue = `Age: >${filters.fixedAge || '?'}`;
                      } else if (filters.customAgeType === 'below') {
                        displayValue = `Age: <${filters.fixedAge || '?'}`;
                      }
                    }
                    
                    return (
                      <span key={key} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {key === 'ageGroup' && value === 'custom' ? displayValue : `${key}: ${displayValue}`}
                        <button 
                          onClick={() => {
                            if (key === 'ageGroup' && value === 'custom') {
                              // Reset all custom age fields when clearing custom age criteria
                              handleFilterChange('ageGroup', 'all');
                              handleFilterChange('customAgeType', 'range');
                              handleFilterChange('ageRangeFrom', '');
                              handleFilterChange('ageRangeTo', '');
                              handleFilterChange('fixedAge', '');
                            } else {
                              handleFilterChange(key, key.includes('date') ? '' : 'all');
                            }
                          }}
                          className="ml-1 hover:text-blue-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        </div>
      )}

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
                  Position & Branch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Demographics
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Education & Promotions
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
              {filteredEmployees.map((employee) => (
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
                      <div className="text-xs text-gray-400 flex items-center">
                        <Building className="w-3 h-3 mr-1" />
                        {employee.branch}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="flex items-center text-gray-900 mb-1">
                        <UserCheck className="w-3 h-3 mr-1 text-gray-400" />
                        {employee.gender}, {employee.age} years
                      </div>
                      <div className="text-xs text-gray-500">{employee.civilStatus}</div>
                      <div className="text-xs text-gray-400">
                        DOB: {employee.dateOfBirth}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm space-y-1">
                      {getEducationBadge(employee.education)}
                      {getPromotionBadge(employee.promotions)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <div className="flex items-center text-gray-900 mb-1">
                        <Mail className="w-3 h-3 mr-1 text-gray-400" />
                        <span className="truncate max-w-32">{employee.email}</span>
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
          
          {filteredEmployees.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No employees found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search criteria or filters.</p>
            </div>
          )}
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