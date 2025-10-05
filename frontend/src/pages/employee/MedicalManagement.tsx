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
import { generateMedicalClaimPDF, MedicalFormData } from '../../utils/medicalFormPDF';

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
      employeeNo: 'E2024001',
      employeeFullName: 'John Doe',
      employeeAddress: 'No. 123, Colombo Road, Colombo 07',
      patientName: '',
      patientDOBDay: '',
      patientDOBMonth: '',
      patientDOBYear: '',
      patientSex: '' as 'M' | 'F' | '',
      hospitalName: '',
      isGovernmentHospital: false,
      hospitalizationFromDay: '',
      hospitalizationFromMonth: '',
      hospitalizationFromYear: '',
      hospitalizationToDay: '',
      hospitalizationToMonth: '',
      hospitalizationToYear: '',
      totalCharges: '',
      chargesBreakdown: '',
      attachments: [] as File[]
    });

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
      setShowApplicationModal(false);
    };

    const handleDownloadPDF = () => {
      const pdfData: MedicalFormData = {
        employeeNo: formData.employeeNo,
        employeeFullName: formData.employeeFullName,
        employeeAddress: formData.employeeAddress,
        patientName: formData.patientName,
        patientDOB: {
          day: formData.patientDOBDay,
          month: formData.patientDOBMonth,
          year: formData.patientDOBYear
        },
        patientSex: formData.patientSex as 'M' | 'F',
        hospitalName: formData.hospitalName,
        isGovernmentHospital: formData.isGovernmentHospital,
        hospitalizationFrom: {
          day: formData.hospitalizationFromDay,
          month: formData.hospitalizationFromMonth,
          year: formData.hospitalizationFromYear
        },
        hospitalizationTo: {
          day: formData.hospitalizationToDay,
          month: formData.hospitalizationToMonth,
          year: formData.hospitalizationToYear
        },
        totalCharges: formData.totalCharges,
        chargesBreakdown: formData.chargesBreakdown,
        date: new Date().toLocaleDateString('en-GB')
      };

      generateMedicalClaimPDF(pdfData);
    };

    if (!showApplicationModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Surgical & Hospital Expenses Claim Form</h3>
              <p className="text-sm text-gray-600">Form No: HR/F/08</p>
            </div>
            <button
              onClick={() => setShowApplicationModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Employee Information */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <h4 className="text-sm font-semibold text-blue-900 mb-3">Employee Information</h4>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee No <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="employeeNo"
                    value={formData.employeeNo}
                    onChange={handleInputChange}
                    required
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name of Employee <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="employeeFullName"
                    value={formData.employeeFullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="employeeAddress"
                    value={formData.employeeAddress}
                    onChange={handleInputChange}
                    required
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Person in Respect of Whom Claim is Made */}
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <h4 className="text-sm font-semibold text-green-900 mb-3">2. Person in Respect of Whom Claim is Made</h4>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleInputChange}
                    required
                    placeholder="Full name of patient"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        name="patientDOBDay"
                        value={formData.patientDOBDay}
                        onChange={handleInputChange}
                        required
                        placeholder="DD"
                        maxLength={2}
                        className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                      />
                      <input
                        type="text"
                        name="patientDOBMonth"
                        value={formData.patientDOBMonth}
                        onChange={handleInputChange}
                        required
                        placeholder="MM"
                        maxLength={2}
                        className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                      />
                      <input
                        type="text"
                        name="patientDOBYear"
                        value={formData.patientDOBYear}
                        onChange={handleInputChange}
                        required
                        placeholder="YYYY"
                        maxLength={4}
                        className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sex <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-6 mt-3">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="patientSex"
                          value="M"
                          checked={formData.patientSex === 'M'}
                          onChange={handleInputChange}
                          required
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-700">Male (M)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="patientSex"
                          value="F"
                          checked={formData.patientSex === 'F'}
                          onChange={handleInputChange}
                          required
                          className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-gray-700">Female (F)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: General */}
            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
              <h4 className="text-sm font-semibold text-purple-900 mb-3">3. General</h4>
              
              <div className="space-y-4">
                {/* a. Name of the Hospital */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    a. Name of the Hospital <span className="text-red-500">*</span>
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

                {/* b. Is it a Government Hospital? */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    b. Is it a Government Hospital? <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isGovernmentHospital"
                        value="true"
                        checked={formData.isGovernmentHospital === true}
                        onChange={(e) => setFormData(prev => ({ ...prev, isGovernmentHospital: true }))}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">Yes</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="isGovernmentHospital"
                        value="false"
                        checked={formData.isGovernmentHospital === false}
                        onChange={(e) => setFormData(prev => ({ ...prev, isGovernmentHospital: false }))}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">No</span>
                    </label>
                  </div>
                </div>

                {/* c. Period of Hospitalization */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    c. Period of Hospitalization
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">From</label>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          name="hospitalizationFromDay"
                          value={formData.hospitalizationFromDay}
                          onChange={handleInputChange}
                          placeholder="DD"
                          maxLength={2}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-sm"
                        />
                        <input
                          type="text"
                          name="hospitalizationFromMonth"
                          value={formData.hospitalizationFromMonth}
                          onChange={handleInputChange}
                          placeholder="MM"
                          maxLength={2}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-sm"
                        />
                        <input
                          type="text"
                          name="hospitalizationFromYear"
                          value={formData.hospitalizationFromYear}
                          onChange={handleInputChange}
                          placeholder="YYYY"
                          maxLength={4}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">To</label>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          name="hospitalizationToDay"
                          value={formData.hospitalizationToDay}
                          onChange={handleInputChange}
                          placeholder="DD"
                          maxLength={2}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-sm"
                        />
                        <input
                          type="text"
                          name="hospitalizationToMonth"
                          value={formData.hospitalizationToMonth}
                          onChange={handleInputChange}
                          placeholder="MM"
                          maxLength={2}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-sm"
                        />
                        <input
                          type="text"
                          name="hospitalizationToYear"
                          value={formData.hospitalizationToYear}
                          onChange={handleInputChange}
                          placeholder="YYYY"
                          maxLength={4}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* d. Hospitalization charges */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    d. Hospitalization charges including Nursing Home charges, Surgeon's fees, Anesthetist's Operation Theatre charges, Expenses for X-Ray, ECG, Laboratory Tests, Medicines and Drugs, Fees paid to medical Practitioner and all other expenses whilst in hospital <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="chargesBreakdown"
                    value={formData.chargesBreakdown}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder="Provide detailed breakdown of all charges..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Amount (Rs.) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="totalCharges"
                    value={formData.totalCharges}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Supporting Documents */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Supporting Documents <span className="text-red-500">*</span>
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
                      required
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    Medical bills, prescriptions, reports (PDF, JPG, PNG up to 10MB each)
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
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">DECLARATION</h4>
              <p className="text-xs text-gray-700 italic">
                I declare that the particulars given herein above are true and correct to the best of my knowledge and that I have not withheld from the SLBFE any material information connected with this claim.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4" />
                Submit Claim
              </button>
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download as PDF
              </button>
              <button
                type="button"
                onClick={() => setShowApplicationModal(false)}
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
          <h2 className="text-2xl font-bold text-gray-900">Medical Reimbursement</h2>
          <p className="text-sm text-gray-600 mt-1">Surgical & Hospital Expenses Claims</p>
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
