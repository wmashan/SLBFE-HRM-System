import React, { useState } from 'react';
import {
  Heart,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Upload,
  Download,
  X,
  DollarSign,
  TrendingUp,
  Activity
} from 'lucide-react';
import { generateMedicalClaimPDF } from '../../utils/medicalFormPdfGenerator';
import { generateHospitalClaimFormPDF } from '../../utils/hospitalClaimFormPdfGenerator';

interface MedicalRequest {
  id: number;
  requestNumber: string;
  requestType: string;
  requestTypeName: string;
  treatmentDate: string;
  medicalProvider: string;
  diagnosis: string;
  description: string;
  claimedAmount: number;
  approvedAmount?: number;
  status: 'Pending' | 'UnderReview' | 'Approved' | 'Rejected' | 'Paid';
  statusName: string;
  submittedDate: string;
  approvedBy?: number;
  approverName?: string;
  reviewedDate?: string;
  approverComments?: string;
  paymentDate?: string;
  paymentReference?: string;
  rejectionReason?: string;
  attachments: string[];
  // New fields
  employeeNumber?: string;
  employeeFullName?: string;
  employeeAddress?: string;
  patientName?: string;
  patientDateOfBirth?: string;
  patientSex?: string;
  isGovernmentHospital?: boolean;
  hospitalizationFromDate?: string;
  hospitalizationToDate?: string;
  chargesBreakdown?: string;
}

interface MedicalBalance {
  annualAllowance: number;
  totalClaimed: number;
  totalApproved: number;
  totalPaid: number;
  pendingAmount: number;
  remainingBalance: number;
  year: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  totalRequests: number;
}

interface MedicalManagementProps {
  employeeId?: number;
}

const MedicalManagement: React.FC<MedicalManagementProps> = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'apply' | 'history'>('overview');
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  // Medical balance state
  const [medicalBalance] = useState<MedicalBalance>({
    annualAllowance: 50000,
    totalClaimed: 12500,
    totalApproved: 10000,
    totalPaid: 8000,
    pendingAmount: 2500,
    remainingBalance: 37500,
    year: 2024,
    pendingRequests: 1,
    approvedRequests: 2,
    rejectedRequests: 0,
    totalRequests: 3
  });

  // Medical requests history
  const [medicalHistory] = useState<MedicalRequest[]>([
    {
      id: 1,
      requestNumber: 'MED20241001',
      requestType: 'OutpatientTreatment',
      requestTypeName: 'Outpatient Treatment',
      treatmentDate: '2024-09-25',
      medicalProvider: 'Asiri Central Hospital',
      diagnosis: 'Dengue Fever',
      description: 'Emergency outpatient treatment for dengue fever including blood tests and medications',
      claimedAmount: 2500,
      status: 'Pending',
      statusName: 'Pending',
      submittedDate: '2024-09-26',
      attachments: ['medical-bill-sep-2024.pdf', 'lab-report.pdf']
    },
    {
      id: 2,
      requestNumber: 'MED20240802',
      requestType: 'Prescription',
      requestTypeName: 'Prescription',
      treatmentDate: '2024-08-15',
      medicalProvider: 'Durdans Hospital',
      diagnosis: 'Hypertension',
      description: 'Monthly prescription medication for hypertension management',
      claimedAmount: 5000,
      approvedAmount: 4500,
      status: 'Approved',
      statusName: 'Approved',
      submittedDate: '2024-08-16',
      approverName: 'Sarah Wilson',
      reviewedDate: '2024-08-17',
      approverComments: 'Approved as per company medical policy. Prescription validated.',
      attachments: ['prescription-aug-2024.pdf']
    },
    {
      id: 3,
      requestNumber: 'MED20240603',
      requestType: 'DentalTreatment',
      requestTypeName: 'Dental Treatment',
      treatmentDate: '2024-06-10',
      medicalProvider: 'Smile Care Dental Clinic',
      diagnosis: 'Dental Cavity Filling',
      description: 'Tooth filling and routine dental checkup',
      claimedAmount: 5000,
      approvedAmount: 3500,
      status: 'Paid',
      statusName: 'Paid',
      submittedDate: '2024-06-11',
      approverName: 'Sarah Wilson',
      reviewedDate: '2024-06-12',
      approverComments: 'Approved with adjusted amount as per dental coverage policy',
      paymentDate: '2024-06-20',
      paymentReference: 'PAY-20240620-001',
      attachments: ['dental-receipt.pdf']
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
      case 'underreview':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'underreview':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return `LKR ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const MedicalApplicationModal = () => {
    const [formData, setFormData] = useState({
      // Employee Information
      employeeNumber: 'E2024001',
      division: '',
      applicantName: '',
      maritalStatus: '' as 'Married' | 'Unmarried' | '',
      
      // Patient Information
      patientName: '',
      relationshipToApplicant: '' as 'Self' | 'Spouse' | 'Child' | 'Parent' | 'Other' | '',
      patientAge: '',
      
      // Medical Treatment Details
      hospitalName: '',
      doctorName: '',
      diagnosis: '',
      treatmentDate: '',
      treatmentDuration: '',
      
      // Financial Details
      requestedAmount: '',
      claimedAmount: '',
      availableAmount: medicalBalance.remainingBalance.toString(),
      
      // Supporting Documents
      attachments: [] as File[]
    });

    const [declarationAccepted, setDeclarationAccepted] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;
      
      if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: checked }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      setFormData(prev => ({ ...prev, attachments: files }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Submitting medical request:', formData);
      // Here you would call the API to create the medical request
      setShowInstructions(true);
    };

    const handleDownloadHRF07 = async () => {
      try {
        // Prepare the data for PDF generation
        const pdfData = {
          employeeNumber: formData.employeeNumber,
          division: formData.division,
          applicantName: formData.applicantName,
          maritalStatus: formData.maritalStatus,
          patientName: formData.patientName,
          relationshipToApplicant: formData.relationshipToApplicant,
          patientAge: parseInt(formData.patientAge) || 0,
          hospitalName: formData.hospitalName,
          doctorName: formData.doctorName,
          diagnosis: formData.diagnosis,
          treatmentDate: formData.treatmentDate,
          treatmentDuration: formData.treatmentDuration,
          requestedAmount: parseFloat(formData.requestedAmount) || 0,
          claimedAmount: parseFloat(formData.claimedAmount) || 0,
          availableAmount: parseFloat(formData.availableAmount) || 0
        };

        // Generate and download the PDF
        await generateMedicalClaimPDF(pdfData);
        console.log('HR/F/07 PDF generated successfully');
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again.');
      }
    };

    const handleDownloadHRF08 = async () => {
      try {
        // Generate HR/F/08 Hospital Claim Form PDF
        await generateHospitalClaimFormPDF({
          employeeNumber: formData.employeeNumber,
          patientName: formData.patientName
        });
        console.log('HR/F/08 PDF generated successfully');
      } catch (error) {
        console.error('Error generating HR/F/08 PDF:', error);
        alert('Failed to generate HR/F/08 form. Please try again.');
      }
    };

    const handleCloseModal = () => {
      setShowApplicationModal(false);
      setShowInstructions(false);
      setDeclarationAccepted(false);
    };

    if (!showApplicationModal) return null;

    // Instruction page after form submission
    if (showInstructions) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Next Steps - Medical Claim Submission</h3>
                <p className="text-sm text-gray-600">Please follow these instructions to complete your claim</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Success Message */}
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 mr-3" />
                  <div>
                    <h4 className="text-green-900 font-semibold mb-1">Application Initiated Successfully!</h4>
                    <p className="text-sm text-green-800">
                      Your medical claim application has been recorded. Please complete the following steps to finalize your submission.
                    </p>
                  </div>
                </div>
              </div>

              {/* Important Note */}
              <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-blue-900 font-semibold mb-2">Important Note</h4>
                    <p className="text-sm text-blue-800">
                      Download and print the following documents and fill them with true details. Both forms are required for your claim submission.
                    </p>
                  </div>
                </div>
              </div>

              {/* Download Forms Section */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">Step 1: Download Required Forms</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* HR/F/07 Form */}
                  <div className="border-2 border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">HR/F/07 Form</h5>
                        <p className="text-xs text-gray-600">Medical Claim Form</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      This form contains your submitted details and is automatically filled.
                    </p>
                    <button
                      type="button"
                      onClick={handleDownloadHRF07}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download HR/F/07
                    </button>
                  </div>

                  {/* HR/F/08 Form */}
                  <div className="border-2 border-gray-300 rounded-lg p-4 hover:border-green-500 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">HR/F/08 Form</h5>
                        <p className="text-xs text-gray-600">Hospital Claim Form</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      Please fill this form with hospital/clinic details and get it signed.
                    </p>
                    <button
                      type="button"
                      onClick={handleDownloadHRF08}
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download HR/F/08
                    </button>
                  </div>
                </div>
              </div>

              {/* Submission Instructions */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">Step 2: Submit Documents</h4>
                
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      1
                    </div>
                    <p className="text-sm text-gray-800">
                      Print both <strong>HR/F/07</strong> and <strong>HR/F/08</strong> forms
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      2
                    </div>
                    <p className="text-sm text-gray-800">
                      Fill the HR/F/08 form with complete hospital/clinic details and get necessary signatures
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      3
                    </div>
                    <p className="text-sm text-gray-800">
                      Gather all supporting documents (medical bills, prescriptions, lab reports, etc.)
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      4
                    </div>
                    <p className="text-sm text-gray-800">
                      Submit filled <strong>HR/F/07 & HR/F/08</strong> forms with supportive documents <strong className="text-red-600">within 1 week</strong> to HR Division
                    </p>
                  </div>
                </div>
              </div>

              {/* Evaluation Notice */}
              <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <h5 className="text-purple-900 font-semibold mb-1">Step 3: Await Evaluation</h5>
                    <p className="text-sm text-purple-800">
                      After evaluation of your submission, our HR team will inform you about your application status via email and system notification.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  I Understand
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Medical Claim Form</h3>
              <p className="text-sm text-gray-600">Form No: HR/F/07</p>
            </div>
            <button
              onClick={handleCloseModal}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Employee Information */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <h4 className="text-sm font-semibold text-blue-900 mb-3">Employee Information</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="employeeNumber"
                    value={formData.employeeNumber}
                    onChange={handleInputChange}
                    required
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Division <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="division"
                    value={formData.division}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter division"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Applicant Information */}
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <h4 className="text-sm font-semibold text-green-900 mb-3">Applicant Information</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Applicant Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="applicantName"
                    value={formData.applicantName}
                    onChange={handleInputChange}
                    required
                    placeholder="Full name of applicant"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marital Status <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-6 mt-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="maritalStatus"
                        value="Married"
                        checked={formData.maritalStatus === 'Married'}
                        onChange={handleInputChange}
                        required
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">Married</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="maritalStatus"
                        value="Unmarried"
                        checked={formData.maritalStatus === 'Unmarried'}
                        onChange={handleInputChange}
                        required
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">Unmarried</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Information */}
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
              <h4 className="text-sm font-semibold text-purple-900 mb-3">Patient Information</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name of those who received treatment <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleInputChange}
                    required
                    placeholder="Patient name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Family relationship to the applicant <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="relationshipToApplicant"
                    value={formData.relationshipToApplicant}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select relationship</option>
                    <option value="Self">Self</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Child">Child</option>
                    <option value="Parent">Parent</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="patientAge"
                    value={formData.patientAge}
                    onChange={handleInputChange}
                    required
                    min="0"
                    max="120"
                    placeholder="Age"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Medical Treatment Details */}
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
              <h4 className="text-sm font-semibold text-orange-900 mb-3">Medical Treatment Details</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hospital/Pharmacy/Clinic where treatment was received <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="hospitalName"
                    value={formData.hospitalName}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Asiri Central Hospital"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name of the doctor who prescribed the treatment <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="doctorName"
                    value={formData.doctorName}
                    onChange={handleInputChange}
                    required
                    placeholder="Doctor's name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What illness were you treated for? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    placeholder="Describe the illness or diagnosis..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of treatment received <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="treatmentDate"
                    value={formData.treatmentDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration of treatment (Optional)
                  </label>
                  <input
                    type="text"
                    name="treatmentDuration"
                    value={formData.treatmentDuration}
                    onChange={handleInputChange}
                    placeholder="e.g., 3 days, 1 week"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Financial Details */}
            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded">
              <h4 className="text-sm font-semibold text-emerald-900 mb-3">Financial Details</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requested Amount (Rs.) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="requestedAmount"
                    value={formData.requestedAmount}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Claimed Amount (Rs.) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="claimedAmount"
                    value={formData.claimedAmount}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Amount (Rs.)
                  </label>
                  <input
                    type="number"
                    name="availableAmount"
                    value={formData.availableAmount}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Your remaining medical allowance balance
                  </p>
                </div>
              </div>
            </div>

            {/* Supporting Documents */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supporting Documents (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <label className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-500">Click to upload</span>
                    <span className="text-gray-500"> or drag and drop</span>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Medical bills, prescriptions, reports (PDF, JPG, PNG up to 10MB each)
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    You can submit physical documents later to HR Division
                  </p>
                </div>
                {formData.attachments.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
                    <ul className="space-y-1">
                      {formData.attachments.map((file, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Declaration */}
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">DECLARATION</h4>
              <p className="text-xs text-gray-700 italic mb-4">
                I declare that the particulars given herein above are true and correct to the best of my knowledge and that I have not withheld any material information connected with this claim.
              </p>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={declarationAccepted}
                  onChange={(e) => setDeclarationAccepted(e.target.checked)}
                  className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-800 font-medium">
                  I accept and agree to the above declaration
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              {declarationAccepted && (
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
                >
                  <Heart className="w-4 h-4" />
                  Submit
                </button>
              )}
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Medical Claims</h2>
          <p className="text-sm text-gray-600 mt-1">Medical Claim Application - Form No: HR/F/07</p>
        </div>
        <button
          onClick={() => setShowApplicationModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Claim Application
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Overview
            </div>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Request History
            </div>
          </button>
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Balance Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium opacity-90">Annual Allowance</h4>
                <DollarSign className="w-8 h-8 opacity-75" />
              </div>
              <p className="text-2xl font-bold">{formatCurrency(medicalBalance.annualAllowance)}</p>
              <p className="text-xs opacity-75 mt-1">Year {medicalBalance.year}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-600">Total Claimed</h4>
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(medicalBalance.totalClaimed)}</p>
              <p className="text-xs text-gray-500 mt-1">{medicalBalance.totalRequests} requests</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-gray-600">Approved Amount</h4>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(medicalBalance.totalApproved)}</p>
              <p className="text-xs text-gray-500 mt-1">{medicalBalance.approvedRequests} approved</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium opacity-90">Remaining Balance</h4>
                <Heart className="w-8 h-8 opacity-75" />
              </div>
              <p className="text-2xl font-bold">{formatCurrency(medicalBalance.remainingBalance)}</p>
              <p className="text-xs opacity-75 mt-1">
                {((medicalBalance.remainingBalance / medicalBalance.annualAllowance) * 100).toFixed(1)}% available
              </p>
            </div>
          </div>

          {/* Detailed Balance Breakdown */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Balance Breakdown for {medicalBalance.year}</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700">Annual Allowance</span>
                <span className="text-sm font-semibold text-gray-900">{formatCurrency(medicalBalance.annualAllowance)}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-sm text-gray-600">Total Claimed</span>
                <span className="text-sm font-semibold text-orange-600">-{formatCurrency(medicalBalance.totalClaimed)}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-sm text-gray-600">Approved Amount</span>
                <span className="text-sm font-semibold text-green-600">{formatCurrency(medicalBalance.totalApproved)}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-sm text-gray-600">Paid Amount</span>
                <span className="text-sm font-semibold text-blue-600">{formatCurrency(medicalBalance.totalPaid)}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-sm text-gray-600">Pending Amount</span>
                <span className="text-sm font-semibold text-yellow-600">{formatCurrency(medicalBalance.pendingAmount)}</span>
              </div>
              
              <div className="flex justify-between items-center py-3 bg-green-50 -mx-6 px-6 rounded-b-lg">
                <span className="text-sm font-medium text-green-900">Remaining Balance</span>
                <span className="text-lg font-bold text-green-700">{formatCurrency(medicalBalance.remainingBalance)}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-xs text-gray-600 mb-2">
                <span>Utilization</span>
                <span>
                  {(((medicalBalance.annualAllowance - medicalBalance.remainingBalance) / medicalBalance.annualAllowance) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="relative h-3 rounded-full overflow-hidden">
                  <div 
                    className="absolute bg-green-500 h-3 rounded-full" 
                    style={{ width: `${(medicalBalance.totalApproved / medicalBalance.annualAllowance) * 100}%` }}
                  ></div>
                  <div 
                    className="absolute bg-yellow-400 h-3 rounded-full" 
                    style={{ 
                      width: `${(medicalBalance.pendingAmount / medicalBalance.annualAllowance) * 100}%`,
                      left: `${(medicalBalance.totalApproved / medicalBalance.annualAllowance) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
              <div className="flex gap-4 mt-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span className="text-gray-600">Approved</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                  <span className="text-gray-600">Pending</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-200 rounded"></div>
                  <span className="text-gray-600">Available</span>
                </div>
              </div>
            </div>
          </div>

          {/* Request Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{medicalBalance.pendingRequests}</p>
                  <p className="text-sm text-gray-600">Pending Requests</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{medicalBalance.approvedRequests}</p>
                  <p className="text-sm text-gray-600">Approved Requests</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{medicalBalance.rejectedRequests}</p>
                  <p className="text-sm text-gray-600">Rejected Requests</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Requests */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Medical Requests</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {medicalHistory.slice(0, 3).map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{request.requestTypeName}</h4>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(request.status)}
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                            {request.statusName}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{request.medicalProvider} • {request.diagnosis}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Submitted: {new Date(request.submittedDate).toLocaleDateString()}</span>
                        <span>Claimed: {formatCurrency(request.claimedAmount)}</span>
                        {request.approvedAmount && (
                          <span className="text-green-600 font-medium">
                            Approved: {formatCurrency(request.approvedAmount)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">All Medical Requests</h3>
            <div className="space-y-4">
              {medicalHistory.map((request) => (
                <div key={request.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Heart className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{request.requestTypeName}</h4>
                        <p className="text-sm text-gray-600">Request #: {request.requestNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(request.status)}
                      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {request.statusName}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Treatment Date</h5>
                      <p className="text-sm text-gray-900">{new Date(request.treatmentDate).toLocaleDateString()}</p>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Medical Provider</h5>
                      <p className="text-sm text-gray-900">{request.medicalProvider}</p>
                    </div>

                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Submitted Date</h5>
                      <p className="text-sm text-gray-900">{new Date(request.submittedDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Diagnosis</h5>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{request.diagnosis}</p>
                  </div>

                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Description</h5>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{request.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                    <div className="bg-orange-50 p-3 rounded-lg">
                      <h5 className="text-sm font-medium text-orange-700 mb-1">Claimed Amount</h5>
                      <p className="text-lg font-bold text-orange-900">{formatCurrency(request.claimedAmount)}</p>
                    </div>

                    {request.approvedAmount !== undefined && (
                      <div className="bg-green-50 p-3 rounded-lg">
                        <h5 className="text-sm font-medium text-green-700 mb-1">Approved Amount</h5>
                        <p className="text-lg font-bold text-green-900">{formatCurrency(request.approvedAmount)}</p>
                      </div>
                    )}

                    {request.paymentReference && (
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <h5 className="text-sm font-medium text-blue-700 mb-1">Payment Reference</h5>
                        <p className="text-sm font-semibold text-blue-900">{request.paymentReference}</p>
                      </div>
                    )}
                  </div>

                  {request.approverComments && (
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Approver Comments</h5>
                      <p className="text-sm text-gray-900 bg-blue-50 p-3 rounded-lg border border-blue-200">
                        {request.approverComments}
                      </p>
                      {request.approverName && (
                        <p className="text-xs text-gray-500 mt-1">
                          By {request.approverName} on {request.reviewedDate && new Date(request.reviewedDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}

                  {request.rejectionReason && (
                    <div className="mb-4">
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Rejection Reason</h5>
                      <p className="text-sm text-gray-900 bg-red-50 p-3 rounded-lg border border-red-200">
                        {request.rejectionReason}
                      </p>
                    </div>
                  )}

                  {request.attachments && request.attachments.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Attachments</h5>
                      <div className="flex flex-wrap gap-2">
                        {request.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                            <FileText className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-700">{attachment}</span>
                            <button className="text-blue-600 hover:text-blue-500">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Medical Application Modal */}
      <MedicalApplicationModal />
    </div>
  );
};

export default MedicalManagement;
