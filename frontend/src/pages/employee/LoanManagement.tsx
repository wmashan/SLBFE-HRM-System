import React, { useState } from 'react';
import {
  DollarSign,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Upload,
  Download,
  X,
  CreditCard,
  TrendingUp,
  Eye
} from 'lucide-react';

interface LoanRequest {
  id: string;
  type: string;
  amount: number;
  requestedDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed';
  purpose: string;
  tenure: number;
  monthlyDeduction: number;
  interestRate: number;
  approvedBy?: string;
  approvedDate?: string;
  comments?: string;
  attachments?: string[];
  startDate?: string;
  endDate?: string;
  remainingAmount?: number;
}

interface LoanEligibility {
  type: string;
  maxAmount: number;
  usedAmount: number;
  availableAmount: number;
  interestRate: number;
  maxTenure: number;
  eligibilityStatus: 'eligible' | 'partial' | 'not-eligible';
}

interface LoanManagementProps {}

const LoanManagement: React.FC<LoanManagementProps> = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'apply' | 'history'>('overview');
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<LoanRequest | null>(null);

  // Sample loan eligibility data
  const [loanEligibility] = useState<LoanEligibility[]>([
    {
      type: 'Personal Loan',
      maxAmount: 500000,
      usedAmount: 150000,
      availableAmount: 350000,
      interestRate: 12,
      maxTenure: 48,
      eligibilityStatus: 'eligible'
    },
    {
      type: 'Emergency Loan',
      maxAmount: 100000,
      usedAmount: 0,
      availableAmount: 100000,
      interestRate: 8,
      maxTenure: 12,
      eligibilityStatus: 'eligible'
    },
    {
      type: 'Education Loan',
      maxAmount: 1000000,
      usedAmount: 0,
      availableAmount: 1000000,
      interestRate: 6,
      maxTenure: 60,
      eligibilityStatus: 'eligible'
    },
    {
      type: 'Vehicle Loan',
      maxAmount: 2000000,
      usedAmount: 800000,
      availableAmount: 1200000,
      interestRate: 10,
      maxTenure: 84,
      eligibilityStatus: 'partial'
    }
  ]);

  // Sample loan history
  const [loanHistory] = useState<LoanRequest[]>([
    {
      id: 'LN001',
      type: 'Personal Loan',
      amount: 150000,
      requestedDate: '2024-08-15',
      status: 'active',
      purpose: 'Home renovation and furniture purchase',
      tenure: 24,
      monthlyDeduction: 7500,
      interestRate: 12,
      approvedBy: 'Mr. Ranjan Silva - Finance Manager',
      approvedDate: '2024-08-18',
      comments: 'Approved based on employment history and salary eligibility.',
      attachments: ['salary-certificate.pdf', 'bank-statements.pdf'],
      startDate: '2024-09-01',
      endDate: '2026-09-01',
      remainingAmount: 135000
    },
    {
      id: 'LN002',
      type: 'Emergency Loan',
      amount: 50000,
      requestedDate: '2024-06-10',
      status: 'completed',
      purpose: 'Medical emergency for family member',
      tenure: 12,
      monthlyDeduction: 4500,
      interestRate: 8,
      approvedBy: 'Ms. Kamani Perera - HR Manager',
      approvedDate: '2024-06-11',
      comments: 'Emergency loan approved for medical expenses.',
      attachments: ['medical-bills.pdf', 'hospital-report.pdf'],
      startDate: '2024-06-15',
      endDate: '2024-06-15'
    },
    {
      id: 'LN003',
      type: 'Vehicle Loan',
      amount: 800000,
      requestedDate: '2023-12-20',
      status: 'completed',
      purpose: 'Purchase of motorcycle for daily transportation',
      tenure: 36,
      monthlyDeduction: 25000,
      interestRate: 10,
      approvedBy: 'Mr. Ranjan Silva - Finance Manager',
      approvedDate: '2023-12-22',
      startDate: '2024-01-01',
      endDate: '2024-08-30'
    },
    {
      id: 'LN004',
      type: 'Education Loan',
      amount: 75000,
      requestedDate: '2024-09-05',
      status: 'pending',
      purpose: 'Professional certification course in cybersecurity',
      tenure: 18,
      monthlyDeduction: 4500,
      interestRate: 6,
      attachments: ['course-details.pdf', 'fee-structure.pdf']
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEligibilityColor = (status: string) => {
    switch (status) {
      case 'eligible':
        return 'text-green-600';
      case 'partial':
        return 'text-yellow-600';
      case 'not-eligible':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const calculateEMI = (principal: number, rate: number, tenure: number) => {
    const monthlyRate = rate / 100 / 12;
    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
                (Math.pow(1 + monthlyRate, tenure) - 1);
    return Math.round(emi);
  };

  const LoanApplicationModal = () => {
    const [formData, setFormData] = useState({
      type: '',
      amount: '',
      purpose: '',
      tenure: '',
      attachments: [] as File[]
    });

    const [calculatedEMI, setCalculatedEMI] = useState(0);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));

      // Calculate EMI when amount, type, or tenure changes
      if (name === 'amount' || name === 'type' || name === 'tenure') {
        const selectedLoanType = loanEligibility.find(loan => loan.type === formData.type || loan.type === value);
        if (selectedLoanType && formData.amount && formData.tenure) {
          const amount = parseFloat(name === 'amount' ? value : formData.amount);
          const tenure = parseInt(name === 'tenure' ? value : formData.tenure);
          if (amount && tenure) {
            const emi = calculateEMI(amount, selectedLoanType.interestRate, tenure);
            setCalculatedEMI(emi);
          }
        }
      }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      setFormData(prev => ({ ...prev, attachments: files }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      console.log('Submitting loan application:', formData);
      setShowApplicationModal(false);
      setFormData({ type: '', amount: '', purpose: '', tenure: '', attachments: [] });
      setCalculatedEMI(0);
    };

    const selectedLoanType = loanEligibility.find(loan => loan.type === formData.type);
    const maxAmount = selectedLoanType?.availableAmount || 0;
    const maxTenure = selectedLoanType?.maxTenure || 0;

    if (!showApplicationModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Apply for Loan</h3>
            <button
              onClick={() => setShowApplicationModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Loan Type</option>
                  {loanEligibility.filter(loan => loan.eligibilityStatus !== 'not-eligible').map((loan) => (
                    <option key={loan.type} value={loan.type}>
                      {loan.type} (Available: LKR {loan.availableAmount.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Amount (LKR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  required
                  max={maxAmount}
                  min="1000"
                  step="1000"
                  placeholder="Enter loan amount"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {selectedLoanType && (
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum available: LKR {maxAmount.toLocaleString()} at {selectedLoanType.interestRate}% interest
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Repayment Tenure (Months) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="tenure"
                  value={formData.tenure}
                  onChange={handleInputChange}
                  required
                  max={maxTenure}
                  min="3"
                  placeholder="Enter tenure in months"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {selectedLoanType && (
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum tenure: {maxTenure} months
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estimated Monthly EMI
                </label>
                <div className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 font-semibold">
                  LKR {calculatedEMI.toLocaleString()}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purpose of Loan <span className="text-red-500">*</span>
              </label>
              <textarea
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="Please provide a detailed explanation for the loan purpose..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

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
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                      required
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    PDF, DOC, DOCX, JPG, PNG up to 10MB each
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

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">Required Documents:</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Last 3 months salary certificates</li>
                <li>• Bank statements for last 6 months</li>
                <li>• Copy of National Identity Card</li>
                <li>• Employment confirmation letter</li>
                <li>• Purpose-specific documents (quotations, invoices, etc.)</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <DollarSign className="w-4 h-4" />
                Submit Loan Application
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

  const LoanDetailsModal = ({ loan }: { loan: LoanRequest }) => {
    if (!loan) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Loan Details - {loan.id}</h3>
            <button
              onClick={() => setSelectedLoan(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-1">Loan Type</label>
                <p className="text-lg font-semibold text-gray-900">{loan.type}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount</label>
                <p className="text-lg font-semibold text-green-600">LKR {loan.amount.toLocaleString()}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <div className="flex items-center gap-2">
                  {getStatusIcon(loan.status)}
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(loan.status)}`}>
                    {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly EMI</label>
                <p className="text-lg font-semibold text-blue-600">LKR {loan.monthlyDeduction.toLocaleString()}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Purpose</label>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-900">{loan.purpose}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Request Date</label>
                <p className="text-gray-900">{new Date(loan.requestedDate).toLocaleDateString()}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tenure</label>
                <p className="text-gray-900">{loan.tenure} months</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate</label>
                <p className="text-gray-900">{loan.interestRate}% per annum</p>
              </div>
            </div>

            {loan.approvedBy && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-green-800 mb-2">Approval Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-green-700">Approved by: </span>
                    <span className="font-medium text-green-900">{loan.approvedBy}</span>
                  </div>
                  <div>
                    <span className="text-green-700">Approval date: </span>
                    <span className="font-medium text-green-900">{loan.approvedDate}</span>
                  </div>
                </div>
                {loan.comments && (
                  <div className="mt-3">
                    <span className="text-green-700">Comments: </span>
                    <span className="text-green-900">{loan.comments}</span>
                  </div>
                )}
              </div>
            )}

            {loan.status === 'active' && loan.remainingAmount && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Loan Progress</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Remaining: </span>
                    <span className="font-medium text-blue-900">LKR {loan.remainingAmount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-blue-700">Start date: </span>
                    <span className="font-medium text-blue-900">{loan.startDate}</span>
                  </div>
                  <div>
                    <span className="text-blue-700">End date: </span>
                    <span className="font-medium text-blue-900">{loan.endDate}</span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-sm text-blue-700 mb-1">
                    <span>Progress</span>
                    <span>{Math.round(((loan.amount - loan.remainingAmount) / loan.amount) * 100)}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${((loan.amount - loan.remainingAmount) / loan.amount) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {loan.attachments && loan.attachments.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {loan.attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-900">{attachment}</span>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 p-1">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-200">
            <button
              onClick={() => setSelectedLoan(null)}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Loan Management</h2>
          <p className="text-sm text-gray-600 mt-1">Apply for loans and track your loan status</p>
        </div>
        <button
          onClick={() => setShowApplicationModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Apply for Loan
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
              <TrendingUp className="w-4 h-4" />
              Loan Overview
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
              Loan History
            </div>
          </button>
        </nav>
      </div>

      {/* Loan Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Loan Eligibility */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Eligibility & Available Amounts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loanEligibility.map((loan, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{loan.type}</h4>
                        <p className="text-sm text-gray-600">Interest Rate: {loan.interestRate}% per annum</p>
                      </div>
                    </div>
                    <span className={`text-sm font-medium ${getEligibilityColor(loan.eligibilityStatus)}`}>
                      {loan.eligibilityStatus === 'eligible' ? 'Eligible' : 
                       loan.eligibilityStatus === 'partial' ? 'Partially Eligible' : 'Not Eligible'}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Maximum Limit</span>
                      <span className="text-sm font-semibold text-gray-900">LKR {loan.maxAmount.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Used Amount</span>
                      <span className="text-sm font-semibold text-red-600">LKR {loan.usedAmount.toLocaleString()}</span>
                    </div>
                    
                    <hr className="border-gray-200" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-900">Available Amount</span>
                      <span className="text-lg font-bold text-green-600">LKR {loan.availableAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Usage Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Usage</span>
                      <span>{Math.round((loan.usedAmount / loan.maxAmount) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(loan.usedAmount / loan.maxAmount) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600">
                    <p>Maximum Tenure: {loan.maxTenure} months</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Loans Summary */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Loans</h3>
            <div className="bg-white rounded-lg shadow">
              {loanHistory.filter(loan => loan.status === 'active').length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {loanHistory.filter(loan => loan.status === 'active').map((loan) => (
                    <div key={loan.id} className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900">{loan.type}</h4>
                            <p className="text-sm text-gray-600">Loan ID: {loan.id}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedLoan(loan)}
                          className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Loan Amount</p>
                          <p className="text-lg font-bold text-green-600">LKR {loan.amount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Monthly EMI</p>
                          <p className="text-lg font-bold text-blue-600">LKR {loan.monthlyDeduction.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Remaining Amount</p>
                          <p className="text-lg font-bold text-orange-600">LKR {loan.remainingAmount?.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">End Date</p>
                          <p className="text-sm font-medium text-gray-900">{loan.endDate}</p>
                        </div>
                      </div>

                      {loan.remainingAmount && (
                        <div className="mt-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>Repayment Progress</span>
                            <span>{Math.round(((loan.amount - loan.remainingAmount) / loan.amount) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${((loan.amount - loan.remainingAmount) / loan.amount) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No active loans</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loan History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">All Loan Requests</h3>
            <div className="space-y-4">
              {loanHistory.map((loan) => (
                <div key={loan.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900">{loan.type}</h4>
                        <p className="text-sm text-gray-600">Loan ID: {loan.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(loan.status)}
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(loan.status)}`}>
                          {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedLoan(loan)}
                        className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Amount</p>
                      <p className="text-lg font-bold text-green-600">LKR {loan.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tenure</p>
                      <p className="text-sm font-medium text-gray-900">{loan.tenure} months</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Monthly EMI</p>
                      <p className="text-lg font-bold text-blue-600">LKR {loan.monthlyDeduction.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Request Date</p>
                      <p className="text-sm font-medium text-gray-900">{new Date(loan.requestedDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Purpose</p>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{loan.purpose}</p>
                  </div>

                  {loan.comments && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Comments</p>
                      <p className="text-sm text-gray-900 bg-blue-50 p-3 rounded-lg border border-blue-200">{loan.comments}</p>
                    </div>
                  )}

                  {loan.attachments && loan.attachments.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Attachments</p>
                      <div className="flex flex-wrap gap-2">
                        {loan.attachments.map((attachment, index) => (
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

      {/* Loan Application Modal */}
      <LoanApplicationModal />

      {/* Loan Details Modal */}
      {selectedLoan && <LoanDetailsModal loan={selectedLoan} />}
    </div>
  );
};

export default LoanManagement;