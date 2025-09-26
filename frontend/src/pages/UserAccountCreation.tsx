import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Calendar } from 'lucide-react';

const UserAccountCreation = () => {
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState(1);
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
    // Stage 2 - Contact Details (to be added)
    // Stage 3 - Educational Details (to be added) 
    // Stage 4 - Other Details (to be added)
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  const handleFieldChange = (field: string, value: string) => {
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

  const handlePrevious = () => {
    if (currentStage > 1) {
      setCurrentStage(prev => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      alert('Account created successfully!');
      setIsSubmitting(false);
      navigate('/');
    }, 1000);
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
                <div className="text-xs">Credit card information</div>
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
                <div className="text-xs">Notification and account options</div>
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
                      >
                        <option value="">- select title -</option>
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Miss">Miss</option>
                        <option value="Dr">Dr</option>
                        <option value="Prof">Prof</option>
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Birth Day (MM/dd/yyyy)</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.birthDay}
                          onChange={(e) => handleFieldChange('birthDay', e.target.value)}
                          placeholder="01/16/1978"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Division */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Division</label>
                      <input
                        type="text"
                        value={formData.division}
                        onChange={(e) => handleFieldChange('division', e.target.value)}
                        placeholder="DGM ( Employment Approval )"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Designation */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                      <input
                        type="text"
                        value={formData.designation}
                        onChange={(e) => handleFieldChange('designation', e.target.value)}
                        placeholder="Director Admin"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Grade */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
                      <input
                        type="text"
                        value={formData.grade}
                        onChange={(e) => handleFieldChange('grade', e.target.value)}
                        placeholder="HM 1-1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Civil Status */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Civil Status</label>
                      <input
                        type="text"
                        value={formData.civilStatus}
                        onChange={(e) => handleFieldChange('civilStatus', e.target.value)}
                        placeholder="Married"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
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

          {/* Placeholder for other stages */}
          {currentStage === 2 && (
            <div className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-4">Stage 2: Contact Details</h2>
              <p className="text-gray-600 mb-8">This stage will be implemented next...</p>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Next: Educational Details
                </button>
              </div>
            </div>
          )}

          {currentStage === 3 && (
            <div className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-4">Stage 3: Educational Details</h2>
              <p className="text-gray-600 mb-8">This stage will be implemented next...</p>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Next: Other Details
                </button>
              </div>
            </div>
          )}

          {currentStage === 4 && (
            <div className="p-8 text-center">
              <h2 className="text-xl font-semibold mb-4">Stage 4: Other Details</h2>
              <p className="text-gray-600 mb-8">This stage will be implemented next...</p>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-600 text-white px-8 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors font-medium"
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UserAccountCreation;