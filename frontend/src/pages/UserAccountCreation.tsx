import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Calendar, CheckCircle, Mail, Clock, Copy, Check } from 'lucide-react';
import { employeeService, apiService } from '../services/api';
import { EmployeeCreateRequest, Title, Division, Grade } from '../types';

// Sri Lankan Towns/Cities List
const SRI_LANKAN_TOWNS = [
  'Akkaraipattu', 'Akmeemana', 'Akurana', 'Alawwa', 'Ambalangoda', 'Ambalantota', 'Ampara',
  'Anuradhapura', 'Avissawella', 'Badulla', 'Balangoda', 'Batticaloa', 'Battaramulla',
  'Beruwala', 'Boralesgamuwa', 'Chavakacheri', 'Chilaw', 'Chunnakam', 'Colombo',
  'Dambulla', 'Dehiwala', 'Delft', 'Deniyaya', 'Devinuwara', 'Divulapitiya',
  'Eheliyagoda', 'Ella', 'Elpitiya', 'Embilipitiya', 'Eravur',
  'Galgamuwa', 'Galle', 'Gampaha', 'Gampola', 'Ganemulla', 'Giriulla',
  'Habarana', 'Hambantota', 'Haputale', 'Hatton', 'Havelok Town', 'Hikkaduwa', 'Homagama', 'Horana',
  'Ja-Ela', 'Jaffna', 'Kadugannawa', 'Kaduwela', 'Kalmunai', 'Kalutara', 'Kandana', 'Kandy',
  'Kanthale', 'Karapitiya', 'Kataragama', 'Katunayake', 'Kegalle', 'Kekirawa', 'Kelaniya', 'Kilinochchi',
  'Kolonnawa', 'Kuliyapitiya', 'Kurunegala',
  'Maharagama', 'Mahiyanganaya', 'Makumbura', 'Mannar', 'Maskeliya', 'Matale', 'Matara',
  'Mathugama', 'Medawachchiya', 'Minuwangoda', 'Moneragala', 'Moratuwa', 'Mount Lavinia', 'Mullativu',
  'Nawalapitiya', 'Negombo', 'Nelliady', 'Nikaweratiya', 'Nittambuwa', 'Nugegoda', 'Nuwara Eliya',
  'Padukka', 'Panadura', 'Peliyagoda', 'Pelmadulla', 'Piliyandala', 'Point Pedro', 'Polgahawela',
  'Polonnaruwa', 'Puttalam',
  'Ragama', 'Rambukkana', 'Ratmalana', 'Ratnapura',
  'Seeduwa', 'Sigiriya', 'Siyambalanduwa', 'Sri Jayewardenepura Kotte',
  'Talawakele', 'Tangalle', 'Thissamaharama', 'Trincomalee',
  'Valvettithurai', 'Vavuniya', 'Velvetiturai',
  'Wadduwa', 'Warakapola', 'Wattala', 'Wattegama', 'Weligama', 'Wellawaya', 'Welisara'
].sort();

const UserAccountCreation = () => {
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState(1);
  const [showReviewPage, setShowReviewPage] = useState(false);
  const [showSuccessPage, setShowSuccessPage] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [titles, setTitles] = useState<Title[]>([]);
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [designations, setDesignations] = useState<string[]>([]);
  const [loadingTitles, setLoadingTitles] = useState(true);
  const [loadingDivisions, setLoadingDivisions] = useState(true);
  const [loadingGrades, setLoadingGrades] = useState(true);
  const [generatedCredentials, setGeneratedCredentials] = useState<{username: string, password: string} | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    // Stage 1 - Personal Details
    profilePicture: null as File | null,
    title: '',
    fullName: '',
    nameWithInitials: '',
    firstName: '',
    lastName: '',
    nic: '',
    birthDay: '',
    division: '',
    designation: '',
    grade: '',
    civilStatus: '',
    // Stage 2 - Contact Details
    permanentAddressLine1: '',
    permanentAddressLine2: '',
    permanentTown: '',
    temporaryAddressLine1: '',
    temporaryAddressLine2: '',
    temporaryTown: '',
    mobileNumberPersonal: '',
    phoneNumberOfficial: '',
    emailAddress: '',
    // Stage 3 - Educational Details
    gceOLExamination: false,
    gceALExamination: false,
    higherStudies: false,
    // Stage 4 - Other Details
    typeOfEmployment: '',
    dateOfPermanent: '',
    joinDateContract: '',
    joinDateCasual: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  // Fetch titles, divisions, and grades on component mount
  useEffect(() => {
    const fetchTitles = async () => {
      try {
        setLoadingTitles(true);
        const response = await apiService.getTitles();
        if (response.success && response.data) {
          setTitles(response.data);
        } else {
          console.error('Failed to fetch titles:', response.message);
        }
      } catch (error) {
        console.error('Error fetching titles:', error);
      } finally {
        setLoadingTitles(false);
      }
    };

    const fetchDivisions = async () => {
      try {
        setLoadingDivisions(true);
        const response = await apiService.getDivisions();
        if (response.success && response.data) {
          setDivisions(response.data);
        } else {
          console.error('Failed to fetch divisions:', response.message);
        }
      } catch (error) {
        console.error('Error fetching divisions:', error);
      } finally {
        setLoadingDivisions(false);
      }
    };

    const fetchGrades = async () => {
      try {
        setLoadingGrades(true);
        const response = await apiService.getGrades();
        if (response.success && response.data) {
          setGrades(response.data);
        } else {
          console.error('Failed to fetch grades:', response.message);
        }
      } catch (error) {
        console.error('Error fetching grades:', error);
      } finally {
        setLoadingGrades(false);
      }
    };

    fetchTitles();
    fetchDivisions();
    fetchGrades();
  }, []);

  // Handle grade change to populate designations
  const handleGradeChange = (gradeId: string) => {
    setFormData(prev => ({
      ...prev,
      grade: gradeId,
      designation: '' // Reset designation when grade changes
    }));

    // Find the selected grade and parse designations
    const selectedGrade = grades.find(g => g.gradeId === gradeId);
    if (selectedGrade && selectedGrade.designation) {
      // Split by comma and trim whitespace
      const parsedDesignations = selectedGrade.designation
        .split(',')
        .map(d => d.trim())
        .filter(d => d.length > 0);
      setDesignations(parsedDesignations);
    } else {
      setDesignations([]);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleToggleChange = (field: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({
      ...prev,
      profilePicture: file
    }));
    
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setProfilePreview(null);
    }
  };

  const handleNext = () => {
    // Validate current stage before proceeding
    if (currentStage < 4) {
      setCurrentStage(prev => prev + 1);
    }
  };

  const handleCompleteRegistration = () => {
    setShowReviewPage(true);
  };

  const handleCopyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  const handleFinalSubmit = async () => {
    if (!agreedToTerms) {
      alert('Please confirm that all details are correct by checking the agreement box.');
      return;
    }

    // Validate required fields
    if (!formData.fullName || !formData.firstName || !formData.lastName || !formData.nic || !formData.birthDay) {
      alert('Please fill in all required personal details.');
      return;
    }

    if (!formData.division || !formData.designation || !formData.civilStatus) {
      alert('Please fill in all required work details.');
      return;
    }

    if (!formData.permanentAddressLine1 || !formData.permanentTown) {
      alert('Please fill in permanent address details.');
      return;
    }

    if (!formData.mobileNumberPersonal || !formData.emailAddress) {
      alert('Please fill in contact details.');
      return;
    }

    if (!formData.typeOfEmployment) {
      alert('Please select the type of employment.');
      return;
    }

    setIsSubmitting(true);
    
    // Prepare employee data outside try block for error logging
    let employeeData: EmployeeCreateRequest | null = null;
    
    try {
      // Convert date from MM/dd/yyyy to ISO format (yyyy-MM-dd) for API
      const convertToISO = (dateString: string) => {
        if (!dateString) return undefined;
        // If already in yyyy-MM-dd format, return as is
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
          return dateString;
        }
        // Convert MM/dd/yyyy to yyyy-MM-dd
        const parts = dateString.split('/');
        if (parts.length === 3) {
          const month = parts[0].padStart(2, '0');
          const day = parts[1].padStart(2, '0');
          const year = parts[2];
          return `${year}-${month}-${day}`;
        }
        return dateString;
      };

      // Prepare employee data for API
      employeeData = {
        titleId: parseInt(formData.title),
        fullName: formData.fullName,
        nameInitials: formData.nameWithInitials,
        firstName: formData.firstName,
        lastName: formData.lastName,
        nic: formData.nic,
        birthDate: convertToISO(formData.birthDay) || '',
        divisionId: parseInt(formData.division),
        designationId: formData.designation,
        gradeId: formData.grade,
        civilStatusId: formData.civilStatus,
        permanentAddressL1: formData.permanentAddressLine1,
        permanentAddressL2: formData.permanentAddressLine2 || undefined,
        permanentTownId: formData.permanentTown,
        temporaryAddressL1: formData.temporaryAddressLine1 || undefined,
        temporaryAddressL2: formData.temporaryAddressLine2 || undefined,
        temporaryTownId: formData.temporaryTown || undefined,
        contact1: formData.mobileNumberPersonal,
        contact2: formData.phoneNumberOfficial || undefined,
        email: formData.emailAddress,
        employeeTypeId: formData.typeOfEmployment,
        permanentDate: convertToISO(formData.dateOfPermanent),
        joinDateContract: convertToISO(formData.joinDateContract),
        joinDateCasual: convertToISO(formData.joinDateCasual),
        // Educational details as JSON
        ol: formData.gceOLExamination ? JSON.stringify({ hasOL: true }) : undefined,
        al: formData.gceALExamination ? JSON.stringify({ hasAL: true }) : undefined,
        higherStudies: formData.higherStudies ? JSON.stringify({ hasHigherStudies: true }) : undefined,
      };

      console.log('Submitting employee data:', employeeData);

      const response = await employeeService.createEmployee(employeeData);
      
      console.log('API Response:', response);
      console.log('Response data:', response.data);
      
      if (response.success) {
        console.log('Employee created successfully!');
        
        // Capture login credentials from response
        // Check both PascalCase (C#) and camelCase (JSON serialized) properties
        const data = response.data as any;
        const username = data.username || data.Username || data.employeeId || data.EmployeeId;
        const password = data.password || data.Password;
        
        console.log('Username:', username);
        console.log('Password:', password);
        
        if (username && password) {
          console.log('Setting credentials:', { username, password });
          setGeneratedCredentials({
            username: username,
            password: password
          });
        } else {
          console.warn('Credentials not found in response! Full data:', data);
        }
        
        setIsSubmitting(false);
        setShowSuccessPage(true);
      } else {
        console.error('API returned error:', response.message);
        throw new Error(response.message || 'Failed to create employee');
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      if (employeeData) {
        console.error('Employee data:', employeeData);
      }
      
      // More detailed error message
      let errorMessage = 'Failed to create employee. ';
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          errorMessage += 'Cannot connect to server. Please check if the backend is running.';
        } else {
          errorMessage += `Error: ${error.message}`;
        }
      } else {
        errorMessage += 'Please try again.';
      }
      
      alert(errorMessage);
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    if (currentStage > 1) {
      setCurrentStage(prev => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let employeeData: EmployeeCreateRequest | null = null;
    
    try {
      // Prepare employee data for API
      employeeData = {
        titleId: parseInt(formData.title),
        fullName: formData.fullName,
        nameInitials: formData.nameWithInitials,
        firstName: formData.firstName,
        lastName: formData.lastName,
        nic: formData.nic,
        birthDate: formData.birthDay,
        divisionId: parseInt(formData.division),
        designationId: formData.designation,
        gradeId: formData.grade,
        civilStatusId: formData.civilStatus,
        permanentAddressL1: formData.permanentAddressLine1,
        permanentAddressL2: formData.permanentAddressLine2 || undefined,
        permanentTownId: formData.permanentTown,
        temporaryAddressL1: formData.temporaryAddressLine1 || undefined,
        temporaryAddressL2: formData.temporaryAddressLine2 || undefined,
        temporaryTownId: formData.temporaryTown || undefined,
        contact1: formData.mobileNumberPersonal,
        contact2: formData.phoneNumberOfficial || undefined,
        email: formData.emailAddress,
        employeeTypeId: formData.typeOfEmployment,
        permanentDate: formData.dateOfPermanent || undefined,
        joinDateContract: formData.joinDateContract || undefined,
        joinDateCasual: formData.joinDateCasual || undefined,
        // Educational details as JSON
        ol: formData.gceOLExamination ? JSON.stringify({ hasOL: true }) : undefined,
        al: formData.gceALExamination ? JSON.stringify({ hasAL: true }) : undefined,
        higherStudies: formData.higherStudies ? JSON.stringify({ hasHigherStudies: true }) : undefined,
      };

      const response = await employeeService.createEmployee(employeeData);
      
      if (response.success) {
        alert('Employee created successfully!');
        setIsSubmitting(false);
        navigate('/');
      } else {
        throw new Error(response.message || 'Failed to create employee');
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      if (employeeData) {
        console.error('Employee data:', employeeData);
      }
      
      // More detailed error message
      let errorMessage = 'Failed to create employee. ';
      if (error instanceof Error) {
        if (error.message.includes('fetch')) {
          errorMessage += 'Cannot connect to server. Please check if the backend is running.';
        } else {
          errorMessage += `Error: ${error.message}`;
        }
      } else {
        errorMessage += 'Please try again.';
      }
      
      alert(errorMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Create Account</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      {/* Stage Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            {/* Stage 1 */}
            <div className={`flex items-center ${currentStage >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                ${currentStage >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                1
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium">Personal Details</div>
                <div className="text-xs">Basic details and information</div>
              </div>
            </div>

            {/* Stage 2 */}
            <div className={`flex items-center ${currentStage >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                ${currentStage >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                2
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium">Contact Details</div>
                <div className="text-xs">Contact and address information</div>
              </div>
            </div>

            {/* Stage 3 */}
            <div className={`flex items-center ${currentStage >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                ${currentStage >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                3
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium">Educational Details</div>
                <div className="text-xs">Educational qualifications</div>
              </div>
            </div>

            {/* Stage 4 */}
            <div className={`flex items-center ${currentStage >= 4 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                ${currentStage >= 4 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                4
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium">Other Details</div>
                <div className="text-xs">Review and submit changes</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Show Success Page, Review Page, or Regular Stages */}
        {showSuccessPage ? (
          /* Success Page */
          <div className="min-h-[600px] flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-2xl w-full">
              {/* Success Icon */}
              <div className="mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <div className="w-32 h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full mx-auto"></div>
              </div>

              {/* Congratulations Message */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  🎉 Congratulations!
                </h1>
                <h2 className="text-2xl font-semibold text-green-600 mb-6">
                  Your Application Successfully Submitted
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Your application is now under review by our HR team. We appreciate your interest in joining the SLBFE family.
                </p>
              </div>

              {/* Status Information */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-blue-600 mr-3" />
                  <span className="text-lg font-medium text-blue-800">Application Status: Under Review</span>
                </div>
                <div className="flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-blue-700">
                    We will notify you via email at: 
                    <strong className="ml-1">{formData.emailAddress || 'your provided email'}</strong>
                  </span>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">What happens next?</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-blue-600 text-sm font-bold">1</span>
                    </div>
                    <p className="text-gray-700">Our HR team will review your application within 3-5 business days</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-blue-600 text-sm font-bold">2</span>
                    </div>
                    <p className="text-gray-700">You will receive an email with the review status and next steps</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-blue-600 text-sm font-bold">3</span>
                    </div>
                    <p className="text-gray-700">If approved, you'll receive further instructions for onboarding</p>
                  </div>
                </div>
              </div>

              {/* Login Credentials Section */}
              {generatedCredentials && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 mb-8">
                  <div className="flex items-center justify-center mb-4">
                    <User className="w-6 h-6 text-purple-600 mr-3" />
                    <h3 className="text-xl font-bold text-purple-800">Your Login Credentials</h3>
                  </div>
                  
                  <div className="bg-white rounded-lg p-6 shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Username */}
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">Username</p>
                        <div className="bg-gray-50 border border-gray-300 rounded-lg p-3 relative group">
                          <p className="text-lg font-mono font-bold text-gray-900">{generatedCredentials.username}</p>
                          <button
                            onClick={() => handleCopyToClipboard(generatedCredentials.username, 'username')}
                            className="absolute top-2 right-2 p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Copy username"
                          >
                            {copiedField === 'username' ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Password */}
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">Password</p>
                        <div className="bg-gray-50 border border-gray-300 rounded-lg p-3 relative group">
                          <p className="text-lg font-mono font-bold text-gray-900">{generatedCredentials.password}</p>
                          <button
                            onClick={() => handleCopyToClipboard(generatedCredentials.password, 'password')}
                            className="absolute top-2 right-2 p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Copy password"
                          >
                            {copiedField === 'password' ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800 flex items-start">
                        <span className="text-yellow-600 mr-2 font-bold">⚠️</span>
                        <span><strong>Important:</strong> Please save these credentials securely. This is the only time you'll see your password. You can use these to log in to the system.</span>
                      </p>
                    </div>

                    {/* Copy Both Button */}
                    <div className="mt-4 text-center">
                      <button
                        onClick={() => handleCopyToClipboard(`Username: ${generatedCredentials.username}\nPassword: ${generatedCredentials.password}`, 'both')}
                        className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        {copiedField === 'both' ? (
                          <>
                            <Check className="w-4 h-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copy Both Credentials
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Call to Action */}
              <div className="mb-6">
                <p className="text-gray-600 mb-6">
                  Thank you for choosing SLBFE. Have a wonderful day! 🌟
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate('/')}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Return to Home
                  </button>
                  <button
                    onClick={() => {
                      setShowSuccessPage(false);
                      setShowReviewPage(false);
                      setCurrentStage(1);
                      // Reset form data if needed
                    }}
                    className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    Create Another Application
                  </button>
                </div>
              </div>

              {/* Footer Message */}
              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-500">
                  Application ID: <span className="font-mono font-medium">SLBFE-{Date.now().toString().slice(-8)}</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Submitted on {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
        ) : showReviewPage ? (
          /* Review Page */
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Information</h2>
              <p className="text-gray-600">Please review all the information below before final submission.</p>
            </div>

            {/* Personal Details Review */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-blue-600 mb-4 border-b border-gray-200 pb-2">
                Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Title:</span>
                  <p className="text-gray-900">
                    {titles.find(t => t.titleId === formData.title)?.description || formData.title || 'Not provided'}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Full Name:</span>
                  <p className="text-gray-900">{formData.fullName || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Name with Initials:</span>
                  <p className="text-gray-900">{formData.nameWithInitials || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">First Name:</span>
                  <p className="text-gray-900">{formData.firstName || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Last Name:</span>
                  <p className="text-gray-900">{formData.lastName || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">NIC:</span>
                  <p className="text-gray-900">{formData.nic || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Birth Day:</span>
                  <p className="text-gray-900">{formData.birthDay || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Division:</span>
                  <p className="text-gray-900">
                    {formData.division 
                      ? divisions.find(d => d.divisionId.toString() === formData.division)?.description || formData.division
                      : 'Not provided'
                    }
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Designation:</span>
                  <p className="text-gray-900">{formData.designation || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Grade:</span>
                  <p className="text-gray-900">{formData.grade || 'Not provided'}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="text-sm font-medium text-gray-500">Civil Status:</span>
                  <p className="text-gray-900">{formData.civilStatus || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Contact Details Review */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-blue-600 mb-4 border-b border-gray-200 pb-2">
                Contact Details
              </h3>
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Permanent Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Address Line 1:</span>
                    <p className="text-gray-900">{formData.permanentAddressLine1 || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Address Line 2:</span>
                    <p className="text-gray-900">{formData.permanentAddressLine2 || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Town:</span>
                    <p className="text-gray-900">{formData.permanentTown || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Temporary Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Address Line 1:</span>
                    <p className="text-gray-900">{formData.temporaryAddressLine1 || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Address Line 2:</span>
                    <p className="text-gray-900">{formData.temporaryAddressLine2 || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Town:</span>
                    <p className="text-gray-900">{formData.temporaryTown || 'Not provided'}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Mobile Number (Personal):</span>
                  <p className="text-gray-900">{formData.mobileNumberPersonal || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Phone Number (Official):</span>
                  <p className="text-gray-900">{formData.phoneNumberOfficial || 'Not provided'}</p>
                </div>
                <div className="md:col-span-2">
                  <span className="text-sm font-medium text-gray-500">Email Address:</span>
                  <p className="text-gray-900">{formData.emailAddress || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Educational Details Review */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-blue-600 mb-4 border-b border-gray-200 pb-2">
                Educational Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">GCE O/L Examination:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    formData.gceOLExamination 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {formData.gceOLExamination ? 'Completed' : 'Not Completed'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">GCE A/L Examination:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    formData.gceALExamination 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {formData.gceALExamination ? 'Completed' : 'Not Completed'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Higher Studies:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    formData.higherStudies 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {formData.higherStudies ? 'Completed' : 'Not Completed'}
                  </span>
                </div>
              </div>
            </div>

            {/* Employment Details Review */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-blue-600 mb-4 border-b border-gray-200 pb-2">
                Employment Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Type of Employment:</span>
                  <p className="text-gray-900">{formData.typeOfEmployment || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Date of Permanent:</span>
                  <p className="text-gray-900">{formData.dateOfPermanent || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Join Date (Contract):</span>
                  <p className="text-gray-900">{formData.joinDateContract || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Join Date (Casual):</span>
                  <p className="text-gray-900">{formData.joinDateCasual || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Agreement Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="final-agreement"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="final-agreement" className="text-sm text-gray-700">
                  <strong>Declaration:</strong> I hereby confirm and declare that all the information provided above is true, accurate, and complete to the best of my knowledge. I understand that any false or misleading information may result in the rejection of my application or termination of employment. I agree to notify SLBFE HRM System of any changes to this information promptly.
                </label>
              </div>
            </div>

            {/* Final Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setShowReviewPage(false)}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors font-medium"
              >
                ← Back to Edit
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={!agreedToTerms || isSubmitting}
                className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Submitting...
                  </>
                ) : (
                  'Confirm & Submit'
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Regular Form Stages */
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm">
          {/* Stage 1 - Personal Details */}
          {currentStage === 1 && (
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Profile Picture */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <h3 className="text-sm font-medium text-gray-700 mb-4">Profile Picture</h3>
                    
                    <div className="mb-4">
                      {profilePreview ? (
                        <img
                          src={profilePreview}
                          alt="Profile Preview"
                          className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-md"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full mx-auto bg-gray-200 flex items-center justify-center">
                          <User className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                          className="hidden"
                        />
                        <div className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm cursor-pointer hover:bg-blue-700 transition-colors">
                          Upload Photo
                        </div>
                      </label>
                      {profilePreview && (
                        <button
                          type="button"
                          onClick={() => handleFileChange(null)}
                          className="text-red-600 text-sm hover:text-red-700"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>

                    <div className="mt-6 text-center">
                      <div className="text-sm text-gray-600">Username</div>
                      <div className="font-medium">9512</div>
                      <div className="text-sm text-gray-600 mt-2">Employee No</div>
                      <div className="font-medium">9512</div>
                    </div>

                    <div className="mt-6 space-y-2">
                      <button
                        type="button"
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
                      >
                        Update Transfer
                      </button>
                      <button
                        type="button"
                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition-colors"
                      >
                        Update Promotions
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Column - Account Details */}
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Account Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                      <select
                        value={formData.title}
                        onChange={(e) => handleFieldChange('title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={loadingTitles}
                      >
                        <option value="">- select title -</option>
                        {loadingTitles ? (
                          <option disabled>Loading titles...</option>
                        ) : (
                          titles.map((title) => (
                            <option key={title.titleId} value={title.titleId}>
                              {title.description}
                            </option>
                          ))
                        )}
                      </select>
                    </div>

                    {/* Full Name */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleFieldChange('fullName', e.target.value)}
                        placeholder="Test SL CERT"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Name with Initials */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name with Initials</label>
                      <input
                        type="text"
                        value={formData.nameWithInitials}
                        onChange={(e) => handleFieldChange('nameWithInitials', e.target.value)}
                        placeholder="TEST SL CERT"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First name</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleFieldChange('firstName', e.target.value)}
                        placeholder="TEST"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last name</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleFieldChange('lastName', e.target.value)}
                        placeholder="CERT"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* NIC */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">NIC</label>
                      <input
                        type="text"
                        value={formData.nic}
                        onChange={(e) => handleFieldChange('nic', e.target.value)}
                        placeholder="125556666V"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Birth Day */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Birth Day *</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={formData.birthDay}
                          onChange={(e) => handleFieldChange('birthDay', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                          required
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Division */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Division <span className="text-red-500">*</span></label>
                      <select
                        value={formData.division}
                        onChange={(e) => handleFieldChange('division', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Division</option>
                        {loadingDivisions ? (
                          <option disabled>Loading divisions...</option>
                        ) : (
                          divisions.map((division) => (
                            <option key={division.divisionId} value={division.divisionId}>
                              {division.description}
                            </option>
                          ))
                        )}
                      </select>
                    </div>

                    {/* Grade */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Grade <span className="text-red-500">*</span></label>
                      <select
                        value={formData.grade}
                        onChange={(e) => handleGradeChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Grade</option>
                        {loadingGrades ? (
                          <option disabled>Loading grades...</option>
                        ) : (
                          grades.map((grade) => (
                            <option key={grade.gradeId} value={grade.gradeId}>
                              {grade.gradeId}
                            </option>
                          ))
                        )}
                      </select>
                    </div>

                    {/* Designation */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Designation {formData.grade && <span className="text-red-500">*</span>}
                      </label>
                      <select
                        value={formData.designation}
                        onChange={(e) => handleFieldChange('designation', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                        disabled={!formData.grade || designations.length === 0}
                        required={!!formData.grade}
                      >
                        <option value="">{formData.grade ? 'Select Designation' : 'Select Grade First'}</option>
                        {designations.map((designation, index) => (
                          <option key={index} value={designation}>
                            {designation}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Civil Status */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Civil Status <span className="text-red-500">*</span></label>
                      <select
                        value={formData.civilStatus}
                        onChange={(e) => handleFieldChange('civilStatus', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Civil Status</option>
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widowed">Widowed</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Changes Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
                    >
                      Save changes
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
                    >
                      Next: Contact Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stage 2 - Contact Details */}
          {currentStage === 2 && (
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Profile Picture (Same as Stage 1) */}
                <div className="lg:col-span-1">
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <h3 className="text-sm font-medium text-gray-700 mb-4">Profile Picture</h3>
                    
                    <div className="mb-4">
                      {profilePreview ? (
                        <img
                          src={profilePreview}
                          alt="Profile Preview"
                          className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-md"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full mx-auto bg-blue-100 flex items-center justify-center">
                          <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                              <User className="w-8 h-8 text-blue-500" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 text-center">
                      <div className="text-sm text-gray-600">Username</div>
                      <div className="font-medium">9512</div>
                      <div className="text-sm text-gray-600 mt-2">Employee No</div>
                      <div className="font-medium">9512</div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Contact Details */}
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Account Details</h3>
                  
                  {/* Permanent Details Section */}
                  <div className="mb-8">
                    <h4 className="text-md font-medium text-gray-800 mb-4">Permanent Details</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      {/* Address Line 1 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1</label>
                        <input
                          type="text"
                          value={formData.permanentAddressLine1}
                          onChange={(e) => handleFieldChange('permanentAddressLine1', e.target.value)}
                          placeholder="TEST SL CERT"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Address Line 2 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">address Line 2</label>
                        <input
                          type="text"
                          value={formData.permanentAddressLine2}
                          onChange={(e) => handleFieldChange('permanentAddressLine2', e.target.value)}
                          placeholder="TEST SL CERT"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Town */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Town <span className="text-red-500">*</span></label>
                      <select
                        value={formData.permanentTown}
                        onChange={(e) => handleFieldChange('permanentTown', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Town</option>
                        {SRI_LANKAN_TOWNS.map((town) => (
                          <option key={town} value={town}>
                            {town}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Temporary Place Details Section */}
                  <div className="mb-8">
                    <h4 className="text-md font-medium text-gray-800 mb-4">Temporary Place Details</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      {/* Address Line 1 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address Line 1</label>
                        <input
                          type="text"
                          value={formData.temporaryAddressLine1}
                          onChange={(e) => handleFieldChange('temporaryAddressLine1', e.target.value)}
                          placeholder="Enter your first name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Address Line 2 */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">address Line 2</label>
                        <input
                          type="text"
                          value={formData.temporaryAddressLine2}
                          onChange={(e) => handleFieldChange('temporaryAddressLine2', e.target.value)}
                          placeholder="Enter your first name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Town */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Town</label>
                      <select
                        value={formData.temporaryTown}
                        onChange={(e) => handleFieldChange('temporaryTown', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Town (Optional)</option>
                        {SRI_LANKAN_TOWNS.map((town) => (
                          <option key={town} value={town}>
                            {town}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Mobile Number (Personal) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mobile number (Personal )</label>
                        <input
                          type="tel"
                          value={formData.mobileNumberPersonal}
                          onChange={(e) => handleFieldChange('mobileNumberPersonal', e.target.value)}
                          placeholder="0771234567"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      {/* Phone Number (Official) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone number (Official )</label>
                        <input
                          type="tel"
                          value={formData.phoneNumberOfficial}
                          onChange={(e) => handleFieldChange('phoneNumberOfficial', e.target.value)}
                          placeholder="Enter your first name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Email Address */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        value={formData.emailAddress}
                        onChange={(e) => handleFieldChange('emailAddress', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Changes and Navigation Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Previous: Personal Details
                  </button>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
                    >
                      Save changes
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
                    >
                      Next: Educational Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stage 3 - Educational Details */}
          {currentStage === 3 && (
            <div className="p-8">
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Step 3</h3>
                <p className="text-gray-600">Member Educational Background</p>
              </div>

              {/* Educational Qualifications */}
              <div className="space-y-4 mb-8">
                {/* GCE O/L Examination */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-blue-600 font-medium">GCE O/L Examination</span>
                  </div>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.gceOLExamination}
                        onChange={(e) => handleToggleChange('gceOLExamination', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                {/* GCE A/L Examination */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-blue-600 font-medium">GCE A/L Examination</span>
                  </div>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.gceALExamination}
                        onChange={(e) => handleToggleChange('gceALExamination', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                {/* Higher Studies */}
                <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-blue-600 font-medium">Higher Studies</span>
                  </div>
                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.higherStudies}
                        onChange={(e) => handleToggleChange('higherStudies', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Previous: Contact Details
                </button>
                <div className="flex gap-4">
                  <button
                    type="button"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
                  >
                    Save changes
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
                  >
                    Next: Other Details
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stage 4 - Other Details */}
          {currentStage === 4 && (
            <div className="p-8">
              {/* Employment Details Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
                <h3 className="text-lg font-medium text-blue-600 mb-6">Employment Details</h3>
                
                <div className="space-y-6">
                  {/* Type of Employment */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type of Employment</label>
                    <input
                      type="text"
                      value={formData.typeOfEmployment}
                      onChange={(e) => handleFieldChange('typeOfEmployment', e.target.value)}
                      placeholder="Employed"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Date of Permanent */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Permanent</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={formData.dateOfPermanent}
                        onChange={(e) => handleFieldChange('dateOfPermanent', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Join Date Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Join Date of Join (Contract) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Join Date of Join (Contract)</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={formData.joinDateContract}
                          onChange={(e) => handleFieldChange('joinDateContract', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Join Date of Join (Casual) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Join Date of Join (Casual)</label>
                      <div className="relative">
                        <input
                          type="date"
                          value={formData.joinDateCasual}
                          onChange={(e) => handleFieldChange('joinDateCasual', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between items-center">
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Previous: Educational Details
                </button>
                <div className="flex gap-4">
                  <button
                    type="button"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
                  >
                    Save changes
                  </button>
                  <button
                    type="button"
                    onClick={handleCompleteRegistration}
                    className="bg-green-600 text-white px-8 py-2 rounded-md hover:bg-green-700 transition-colors font-medium"
                  >
                    Complete Registration
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
        )}
      </div>
    </div>
  );
};

export default UserAccountCreation;