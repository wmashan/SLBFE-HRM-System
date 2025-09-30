import React, { useState } from 'react';
import {
  MapPin,
  ArrowRight,
  AlertTriangle,
  Calendar,
  Clock,
  User,
  Phone,
  FileText,
  CheckSquare,
  X,
  Download,
  Info
} from 'lucide-react';

interface TransferDetails {
  fromBranch: string;
  toBranch: string;
  transferDate: string;
  reportingDate: string;
  reportingTime: string;
  newDesignation: string;
  newDepartment: string;
  newReportingManager: string;
  newAddress: string;
  contactPerson: string;
  contactNumber: string;
  contactEmail: string;
  requirements: string[];
  documents: string[];
}

interface TransferNotification {
  id: number;
  title: string;
  message: string;
  date: string;
  type: string;
  read: boolean;
  isTransfer?: boolean;
  transferDetails?: TransferDetails;
}

interface TransferNotificationCardProps {
  notification: TransferNotification;
}

const TransferNotificationCard: React.FC<TransferNotificationCardProps> = ({ notification }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [completedRequirements, setCompletedRequirements] = useState<string[]>([]);

  if (!notification.isTransfer || !notification.transferDetails) {
    return null;
  }

  const { transferDetails } = notification;
  const daysUntilTransfer = Math.ceil((new Date(transferDetails.transferDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const toggleRequirement = (requirement: string) => {
    setCompletedRequirements(prev => 
      prev.includes(requirement)
        ? prev.filter(req => req !== requirement)
        : [...prev, requirement]
    );
  };

  const getUrgencyColor = () => {
    if (daysUntilTransfer <= 7) return 'border-red-500 bg-red-50';
    if (daysUntilTransfer <= 14) return 'border-yellow-500 bg-yellow-50';
    return 'border-blue-500 bg-blue-50';
  };

  const getUrgencyText = () => {
    if (daysUntilTransfer <= 7) return 'Urgent - Transfer in less than a week!';
    if (daysUntilTransfer <= 14) return 'Important - Transfer in 2 weeks';
    return 'Upcoming Transfer';
  };

  return (
    <div className={`border-l-4 ${getUrgencyColor()} rounded-lg p-6 mb-6`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{getUrgencyText()}</h3>
            <p className="text-sm text-gray-600">{notification.title}</p>
            <p className="text-xs text-gray-500 mt-1">
              {daysUntilTransfer > 0 ? `${daysUntilTransfer} days remaining` : 'Transfer date has passed'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {showDetails ? 'Hide Details' : 'View Details'}
        </button>
      </div>

      {/* Transfer Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">From</span>
          </div>
          <p className="text-sm text-gray-900">{transferDetails.fromBranch}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-center">
          <ArrowRight className="w-6 h-6 text-blue-600" />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center space-x-2 mb-2">
            <MapPin className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-700">To</span>
          </div>
          <p className="text-sm text-gray-900">{transferDetails.toBranch}</p>
        </div>
      </div>

      {/* Key Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Transfer Date</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">
            {new Date(transferDetails.transferDate).toLocaleDateString()}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-gray-700">Reporting Time</span>
          </div>
          <p className="text-lg font-semibold text-gray-900">{transferDetails.reportingTime}</p>
        </div>
      </div>

      {/* Detailed Information */}
      {showDetails && (
        <div className="space-y-6 mt-6 pt-6 border-t border-gray-200">
          {/* Employment Details */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              New Position Details
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Designation</label>
                <p className="text-gray-900">{transferDetails.newDesignation}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <p className="text-gray-900">{transferDetails.newDepartment}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reporting Manager</label>
                <p className="text-gray-900">{transferDetails.newReportingManager}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Office Address</label>
                <p className="text-gray-900">{transferDetails.newAddress}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Phone className="w-5 h-5 mr-2 text-green-600" />
              Contact Information
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                <p className="text-gray-900">{transferDetails.contactPerson}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <p className="text-gray-900">{transferDetails.contactNumber}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{transferDetails.contactEmail}</p>
              </div>
            </div>
          </div>

          {/* Pre-Transfer Requirements */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CheckSquare className="w-5 h-5 mr-2 text-purple-600" />
              Pre-Transfer Requirements
            </h4>
            
            <div className="space-y-3">
              {transferDetails.requirements.map((requirement, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleRequirement(requirement)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      completedRequirements.includes(requirement)
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {completedRequirements.includes(requirement) && (
                      <CheckSquare className="w-3 h-3 text-white" />
                    )}
                  </button>
                  <span className={`${
                    completedRequirements.includes(requirement)
                      ? 'line-through text-gray-500'
                      : 'text-gray-900'
                  }`}>
                    {requirement}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                <p className="text-sm text-blue-800">
                  Please complete all requirements before your transfer date. Contact HR if you need assistance with any of these items.
                </p>
              </div>
            </div>
          </div>

          {/* Available Documents */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-indigo-600" />
              Available Documents
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {transferDetails.documents.map((document, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-900">{document}</span>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 p-1">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2">
              <Phone className="w-4 h-4" />
              Contact HR
            </button>
            
            <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2">
              <FileText className="w-4 h-4" />
              Download All Documents
            </button>
            
            <button 
              onClick={() => setShowDetails(false)}
              className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransferNotificationCard;