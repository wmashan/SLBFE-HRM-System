import React, { useState } from 'react';
import { 
  User, 
  Building, 
  CreditCard,
  GraduationCap,
  Briefcase,
  Heart,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface EmployeeData {
  id: string;
  employeeNo: string;
  fullName: string;
  nameWithInitials: string;
  designation: string;
  division: string;
  branch: string;
  email: string;
  mobile: string;
  joinDate: string;
  status: string;
  // Personal Details
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  nationality: string;
  nic: string;
  passportNo?: string;
  address: string;
  city: string;
  postalCode: string;
  // Employment Details
  employeeType: string;
  workLocation: string;
  reportingManager: string;
  department: string;
  grade: string;
  basicSalary: number;
  // Emergency Contact
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
  // Qualifications
  qualifications: Array<{
    degree: string;
    institution: string;
    year: string;
    field: string;
  }>;
  // Work Experience (before current position)
  previousExperience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  // Bank Details
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
}

interface EmployeeProfileProps {
  employeeData?: EmployeeData;
}

const EmployeeProfile: React.FC<EmployeeProfileProps> = ({ employeeData }) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    personal: true,
    employment: false,
    emergency: false,
    qualifications: false,
    experience: false,
    banking: false
  });

  // Default employee data for demonstration
  const defaultEmployeeData: EmployeeData = {
    id: '1',
    employeeNo: 'EMP001',
    fullName: 'John Alexander Perera',
    nameWithInitials: 'J.A. Perera',
    designation: 'Senior Software Engineer',
    division: 'Information Technology',
    branch: 'Head Office',
    email: 'john.perera@company.com',
    mobile: '+94 77 123 4567',
    joinDate: '2020-03-15',
    status: 'Active',
    // Personal Details
    dateOfBirth: '1990-05-20',
    gender: 'Male',
    maritalStatus: 'Married',
    nationality: 'Sri Lankan',
    nic: '902341234V',
    passportNo: 'N1234567',
    address: '123, Galle Road, Colombo 03',
    city: 'Colombo',
    postalCode: '00300',
    // Employment Details
    employeeType: 'Permanent',
    workLocation: 'Head Office - Colombo',
    reportingManager: 'Sarah Wilson',
    department: 'Software Development',
    grade: 'Grade 12',
    basicSalary: 150000,
    // Emergency Contact
    emergencyContactName: 'Maria Perera',
    emergencyContactRelation: 'Spouse',
    emergencyContactPhone: '+94 77 987 6543',
    // Qualifications
    qualifications: [
      {
        degree: 'B.Sc. Computer Science',
        institution: 'University of Colombo',
        year: '2015',
        field: 'Computer Science'
      },
      {
        degree: 'Higher Diploma in Software Engineering',
        institution: 'SLIIT',
        year: '2016',
        field: 'Software Engineering'
      }
    ],
    // Work Experience
    previousExperience: [
      {
        company: 'ABC Software Solutions',
        position: 'Junior Developer',
        duration: '2016 - 2018',
        description: 'Developed web applications using PHP and MySQL'
      },
      {
        company: 'XYZ Tech',
        position: 'Software Developer',
        duration: '2018 - 2020',
        description: 'Full-stack development with React and Node.js'
      }
    ],
    // Bank Details
    bankName: 'Bank of Ceylon',
    accountNumber: '12345678901',
    accountHolderName: 'John Alexander Perera'
  };

  const employee = employeeData || defaultEmployeeData;

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const SectionHeader = ({ title, icon: Icon, sectionKey }: { title: string; icon: any; sectionKey: string }) => (
    <button
      onClick={() => toggleSection(sectionKey)}
      className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 border-b border-gray-200"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {expandedSections[sectionKey] ? (
        <ChevronUp className="w-5 h-5 text-gray-400" />
      ) : (
        <ChevronDown className="w-5 h-5 text-gray-400" />
      )}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
          <p className="text-sm text-gray-600 mt-1">View your professional information</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Profile Summary Card */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
            <div className="text-center">
              {/* Profile Picture */}
              <div className="relative inline-block">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                  {employee.fullName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-1">{employee.fullName}</h3>
              <p className="text-sm text-gray-600 mb-2">ID: {employee.employeeNo}</p>
              <p className="text-sm text-blue-600 font-medium mb-3">{employee.designation}</p>
              
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                employee.status === 'Active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {employee.status}
              </span>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Department:</span>
                <span className="font-medium">{employee.department}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Division:</span>
                <span className="font-medium">{employee.division}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Years of Service:</span>
                <span className="font-medium">{new Date().getFullYear() - new Date(employee.joinDate).getFullYear()} years</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Employee Type:</span>
                <span className="font-medium">{employee.employeeType}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* Personal Information Section */}
          <div className="bg-white rounded-lg shadow">
            <SectionHeader title="Personal Information" icon={User} sectionKey="personal" />
            {expandedSections.personal && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                      {employee.fullName}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name with Initials</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                      {employee.nameWithInitials}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                      {new Date(employee.dateOfBirth).toLocaleDateString()}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                      {employee.gender}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                      {employee.maritalStatus}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nationality</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                      {employee.nationality}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">NIC Number</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                      {employee.nic}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Passport Number</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                      {employee.passportNo || 'Not provided'}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                      {employee.address}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                      {employee.city}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                      {employee.postalCode}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                      {employee.email}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                      {employee.mobile}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Employment Information Section */}
          <div className="bg-white rounded-lg shadow">
            <SectionHeader title="Employment Information" icon={Building} sectionKey="employment" />
            {expandedSections.employment && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employee Number</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                      {employee.employeeNo}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                      {employee.designation}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                      {employee.department}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Division</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                      {employee.division}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                      {employee.branch}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employee Type</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                      {employee.employeeType}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                      {employee.grade}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Work Location</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                      {employee.workLocation}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reporting Manager</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                      {employee.reportingManager}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Join Date</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                      {new Date(employee.joinDate).toLocaleDateString()}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Basic Salary</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                      LKR {employee.basicSalary.toLocaleString()}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        employee.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {employee.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Emergency Contact Section */}
          <div className="bg-white rounded-lg shadow">
            <SectionHeader title="Emergency Contact" icon={Heart} sectionKey="emergency" />
            {expandedSections.emergency && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                      {employee.emergencyContactName}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                      {employee.emergencyContactRelation}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                      {employee.emergencyContactPhone}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Qualifications Section */}
          <div className="bg-white rounded-lg shadow">
            <SectionHeader title="Educational Qualifications" icon={GraduationCap} sectionKey="qualifications" />
            {expandedSections.qualifications && (
              <div className="p-6">
                <div className="space-y-4">
                  {employee.qualifications.map((qualification, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Degree/Certification</label>
                          <p className="text-sm text-gray-900 font-semibold">{qualification.degree}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                          <p className="text-sm text-gray-900">{qualification.institution}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                          <p className="text-sm text-gray-900">{qualification.year}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
                          <p className="text-sm text-gray-900">{qualification.field}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Work Experience Section */}
          <div className="bg-white rounded-lg shadow">
            <SectionHeader title="Previous Work Experience" icon={Briefcase} sectionKey="experience" />
            {expandedSections.experience && (
              <div className="p-6">
                <div className="space-y-4">
                  {employee.previousExperience.map((experience, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                          <p className="text-sm font-semibold text-gray-900">{experience.company}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                          <p className="text-sm text-gray-900">{experience.position}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                          <p className="text-sm text-gray-900">{experience.duration}</p>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <p className="text-sm text-gray-900">{experience.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Banking Information Section */}
          <div className="bg-white rounded-lg shadow">
            <SectionHeader title="Banking Information" icon={CreditCard} sectionKey="banking" />
            {expandedSections.banking && (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                      {employee.bankName}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                      {employee.accountNumber}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name</label>
                    <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                      {employee.accountHolderName}
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-700">
                    <strong>Information Note:</strong> Banking information is securely maintained and only accessible to authorized HR personnel for payroll processing. If you need to update any banking details, please contact the HR department.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Read-only Notice */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          <strong>Profile Information:</strong> This is a read-only view of your profile data. 
          If you need to update any information, please contact the HR department or submit a request through the appropriate channels.
        </p>
      </div>
    </div>
  );
};

export default EmployeeProfile;