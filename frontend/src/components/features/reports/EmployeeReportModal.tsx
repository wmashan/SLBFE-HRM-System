import React, { useState, useEffect } from 'react';
import { User as UserIcon, Search, FileText, Calendar, Shield, DollarSign, Target, History } from 'lucide-react';
import Modal from '../../ui/Modal';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import {
  EmployeeReportRequest,
  EmployeeReportSection,
  EmployeeReportType,
  OutputFormat,
} from '../../../types';

interface EmployeeReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReportGenerated: () => void;
}

export const EmployeeReportModal: React.FC<EmployeeReportModalProps> = ({
  isOpen,
  onClose,
  onReportGenerated,
}) => {
  const [step, setStep] = useState<'select' | 'configure' | 'generating'>('select');
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reportConfig, setReportConfig] = useState<Partial<EmployeeReportRequest>>({
    reportType: 'comprehensive',
    includeConfidential: true,
    includeSalaryDetails: true,
    includePerformanceHistory: true,
    includeDisciplinaryHistory: true,
    outputFormat: 'pdf',
    sections: [
      'personal_details',
      'employment_history',
      'service_summary',
      'transfer_history',
      'disciplinary_history',
      'performance_history',
      'salary_history',
      'leave_history',
      'training_history',
      'certifications',
    ],
  });

  useEffect(() => {
    if (isOpen && step === 'select') {
      loadEmployees();
    }
  }, [isOpen, step]);

  const loadEmployees = async () => {
    setIsLoading(true);
    try {
      // Mock employee data for demonstration
      const mockEmployees = [
        {
          id: '1',
          fullName: 'John Doe',
          employeeId: 'EMP001',
          position: 'Senior Software Engineer',
          department: { name: 'IT Department' },
          branch: { name: 'Head Office' },
          status: 'active',
        },
        {
          id: '2',
          fullName: 'Jane Smith',
          employeeId: 'EMP002',
          position: 'HR Manager',
          department: { name: 'Human Resources' },
          branch: { name: 'Head Office' },
          status: 'active',
        },
        {
          id: '3',
          fullName: 'Mike Johnson',
          employeeId: 'EMP003',
          position: 'Accountant',
          department: { name: 'Finance' },
          branch: { name: 'Branch A' },
          status: 'on_leave',
        },
      ];
      setEmployees(mockEmployees);
    } catch (error) {
      console.error('Error loading employees:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.department.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEmployeeSelect = (employee: any) => {
    setSelectedEmployee(employee);
    setStep('configure');
  };

  const handleSectionToggle = (section: EmployeeReportSection) => {
    setReportConfig(prev => ({
      ...prev,
      sections: prev.sections?.includes(section)
        ? prev.sections.filter(s => s !== section)
        : [...(prev.sections || []), section],
    }));
  };

  const handleGenerateReport = async () => {
    if (!selectedEmployee) return;

    setStep('generating');
    setIsLoading(true);

    try {
      const request: EmployeeReportRequest = {
        employeeId: selectedEmployee.id,
        reportType: reportConfig.reportType || 'comprehensive',
        includeConfidential: reportConfig.includeConfidential || false,
        includeSalaryDetails: reportConfig.includeSalaryDetails || false,
        includePerformanceHistory: reportConfig.includePerformanceHistory || false,
        includeDisciplinaryHistory: reportConfig.includeDisciplinaryHistory || false,
        outputFormat: reportConfig.outputFormat || 'pdf',
        sections: reportConfig.sections || [],
      };

      // Mock report generation - simulate API delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // TODO: Uncomment when backend is ready
      // const response = await reportsService.generateEmployeeReport(request);
      // if (response.success) {
        console.log('Employee report generated successfully:', request);
        onReportGenerated();
        onClose();
        resetModal();
      // }
    } catch (error) {
      console.error('Error generating employee report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetModal = () => {
    setStep('select');
    setSelectedEmployee(null);
    setSearchQuery('');
    setReportConfig({
      reportType: 'comprehensive',
      includeConfidential: true,
      includeSalaryDetails: true,
      includePerformanceHistory: true,
      includeDisciplinaryHistory: true,
      outputFormat: 'pdf',
      sections: [
        'personal_details',
        'employment_history',
        'service_summary',
        'transfer_history',
        'disciplinary_history',
        'performance_history',
        'salary_history',
        'leave_history',
        'training_history',
        'certifications',
      ],
    });
  };

  const handleClose = () => {
    onClose();
    resetModal();
  };

  const sectionOptions = [
    { key: 'personal_details', label: 'Personal Details', icon: UserIcon, description: 'Basic personal information and contact details' },
    { key: 'employment_history', label: 'Employment History', icon: History, description: 'Complete employment timeline and positions' },
    { key: 'service_summary', label: 'Service Summary', icon: Calendar, description: 'Total service periods and milestones' },
    { key: 'transfer_history', label: 'Transfer History', icon: FileText, description: 'All transfers between branches/departments' },
    { key: 'disciplinary_history', label: 'Disciplinary History', icon: Shield, description: 'Disciplinary actions and resolutions' },
    { key: 'performance_history', label: 'Performance History', icon: Target, description: 'Performance reviews and ratings' },
    { key: 'salary_history', label: 'Salary History', icon: DollarSign, description: 'Salary progression and changes' },
    { key: 'leave_history', label: 'Leave History', icon: Calendar, description: 'Leave records and balances' },
    { key: 'training_history', label: 'Training History', icon: FileText, description: 'Training programs and certifications' },
    { key: 'certifications', label: 'Certifications', icon: FileText, description: 'Professional certifications and licenses' },
    { key: 'emergency_contacts', label: 'Emergency Contacts', icon: UserIcon, description: 'Emergency contact information' },
    { key: 'dependents', label: 'Dependents', icon: UserIcon, description: 'Dependent information for benefits' },
    { key: 'documents', label: 'Documents', icon: FileText, description: 'Attached documents and files' },
  ] as const;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl" title="Generate Employee Report">
      <div className="space-y-6">
        {step === 'select' && (
          <>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs">1</span>
              <span className="font-medium">Select Employee</span>
              <span className="w-6 h-6 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center text-xs">2</span>
              <span className="text-gray-400">Configure Report</span>
              <span className="w-6 h-6 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center text-xs">3</span>
              <span className="text-gray-400">Generate</span>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by name, employee ID, department, or position..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="max-h-96 overflow-y-auto border rounded-lg">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Loading employees...</p>
                  </div>
                ) : filteredEmployees.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <UserIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No employees found</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredEmployees.map((employee) => (
                      <div
                        key={employee.id}
                        onClick={() => handleEmployeeSelect(employee)}
                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <UserIcon className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium text-gray-900">{employee.fullName}</h3>
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {employee.employeeId}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">
                              {employee.position} • {employee.department.name} • {employee.branch.name}
                            </p>
                          </div>
                          <div className="text-xs text-gray-400">
                            <span className={`px-2 py-1 rounded-full ${
                              employee.status === 'active' ? 'bg-green-100 text-green-800' :
                              employee.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                              employee.status === 'on_leave' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {employee.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {step === 'configure' && selectedEmployee && (
          <>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">✓</span>
              <span className="text-green-600">Select Employee</span>
              <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs">2</span>
              <span className="font-medium">Configure Report</span>
              <span className="w-6 h-6 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center text-xs">3</span>
              <span className="text-gray-400">Generate</span>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{selectedEmployee.fullName}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedEmployee.employeeId} • {selectedEmployee.position} • {selectedEmployee.department.name}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Report Configuration</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                  <select
                    value={reportConfig.reportType}
                    onChange={(e) => setReportConfig(prev => ({ ...prev, reportType: e.target.value as EmployeeReportType }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="comprehensive">Comprehensive Report</option>
                    <option value="basic_info">Basic Information</option>
                    <option value="service_record">Service Record</option>
                    <option value="performance_summary">Performance Summary</option>
                    <option value="disciplinary_summary">Disciplinary Summary</option>
                    <option value="salary_history">Salary History</option>
                    <option value="custom">Custom Report</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Output Format</label>
                  <select
                    value={reportConfig.outputFormat}
                    onChange={(e) => setReportConfig(prev => ({ ...prev, outputFormat: e.target.value as OutputFormat }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="excel">Excel Spreadsheet</option>
                    <option value="csv">CSV File</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">Privacy & Access</label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={reportConfig.includeConfidential}
                      onChange={(e) => setReportConfig(prev => ({ ...prev, includeConfidential: e.target.checked }))}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">Include confidential information</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={reportConfig.includeSalaryDetails}
                      onChange={(e) => setReportConfig(prev => ({ ...prev, includeSalaryDetails: e.target.checked }))}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">Include salary details</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={reportConfig.includePerformanceHistory}
                      onChange={(e) => setReportConfig(prev => ({ ...prev, includePerformanceHistory: e.target.checked }))}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">Include performance history</span>
                  </label>
                  
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={reportConfig.includeDisciplinaryHistory}
                      onChange={(e) => setReportConfig(prev => ({ ...prev, includeDisciplinaryHistory: e.target.checked }))}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700">Include disciplinary history</span>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Report Sections</h4>
                <p className="text-sm text-gray-500">Select which sections to include in the report</p>
                
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {sectionOptions.map((option) => {
                    const IconComponent = option.icon;
                    const isSelected = reportConfig.sections?.includes(option.key as EmployeeReportSection);
                    
                    return (
                      <div
                        key={option.key}
                        onClick={() => handleSectionToggle(option.key as EmployeeReportSection)}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-indigo-500 bg-indigo-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}} // Handled by parent div click
                            className="mt-1 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <IconComponent className={`w-4 h-4 mt-1 ${isSelected ? 'text-indigo-600' : 'text-gray-400'}`} />
                          <div className="flex-1">
                            <h5 className={`text-sm font-medium ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>
                              {option.label}
                            </h5>
                            <p className={`text-xs ${isSelected ? 'text-indigo-700' : 'text-gray-500'}`}>
                              {option.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="secondary" onClick={() => setStep('select')}>
                Back
              </Button>
              <Button 
                onClick={handleGenerateReport}
                disabled={!reportConfig.sections?.length}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </>
        )}

        {step === 'generating' && (
          <>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">✓</span>
              <span className="text-green-600">Select Employee</span>
              <span className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">✓</span>
              <span className="text-green-600">Configure Report</span>
              <span className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs">3</span>
              <span className="font-medium">Generate</span>
            </div>

            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Generating Employee Report</h3>
              <p className="text-gray-500 mb-4">
                Compiling comprehensive report for {selectedEmployee?.fullName}...
              </p>
              <div className="max-w-md mx-auto">
                <div className="bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Processing sections and gathering data...</p>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};