import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  BarChart3,
  Calendar,
  Users,
  TrendingUp,
  Zap,
  Clock,
  Building,
  Award,
  GraduationCap,
  UserCheck,
  Settings,
  Play,
  RefreshCw,
  Eye,
  Trash2,
  X,
  CheckCircle,
  Loader
} from 'lucide-react';
import {
  employeeReportService,
  EmployeeReportConfig,
  EmployeeReportResult,
  PREDEFINED_REPORTS,
  EmployeeReportType
} from '../services/employeeReportService';
import SimpleChart from './SimpleChart';

interface EmployeeReportsProps {
  isOpen: boolean;
  onClose: () => void;
  currentFilters?: any;
}

const EmployeeReports: React.FC<EmployeeReportsProps> = ({ 
  isOpen, 
  onClose
}) => {
  const [selectedReport, setSelectedReport] = useState<EmployeeReportConfig | null>(null);
  const [reportHistory, setReportHistory] = useState<EmployeeReportResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<EmployeeReportResult | null>(null);
  const [activeTab, setActiveTab] = useState<'predefined' | 'history'>('predefined');
  const [downloadingReports, setDownloadingReports] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (isOpen) {
      loadReportHistory();
    }
  }, [isOpen]);

  const loadReportHistory = async () => {
    try {
      const response = await employeeReportService.getReportHistory();
      if (response.success && response.data) {
        setReportHistory(response.data);
      }
    } catch (error) {
      console.error('Failed to load report history:', error);
    }
  };

  const handleGenerateReport = async (config: EmployeeReportConfig) => {
    setIsGenerating(true);
    setGeneratedReport(null);

    try {
      const response = await employeeReportService.generateReport(config);
      if (response.success && response.data) {
        setGeneratedReport(response.data);
        await loadReportHistory();
      }
    } catch (error) {
      console.error('Failed to generate report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadReport = async (reportId: string) => {
    try {
      const report = reportHistory.find(r => r.id === reportId) || generatedReport;
      if (!report) return;

      const response = await employeeReportService.downloadReport(reportId);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from response headers or generate one
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `employee_report_${reportId}.csv`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+?)"?(?:;|$)/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      } else {
        // Generate filename based on report type and format
        const reportName = report.config.name.replace(/\s+/g, '_').toLowerCase();
        const date = new Date().toISOString().split('T')[0];
        const extension = report.config.outputFormat === 'pdf' ? 'pdf' : 'csv';
        filename = `${reportName}_${date}.${extension}`;
      }
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Show success message (you can replace this with a toast notification)
      console.log(`Report "${report.config.name}" downloaded successfully as ${filename}`);
    } catch (error) {
      console.error('Failed to download report:', error);
      // Show error message (you can replace this with a toast notification)
      alert('Failed to download report. Please try again.');
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await employeeReportService.deleteReport(reportId);
        await loadReportHistory();
      } catch (error) {
        console.error('Failed to delete report:', error);
      }
    }
  };

  const getReportTypeIcon = (type: EmployeeReportType) => {
    const iconMap = {
      employee_summary: Users,
      demographics_analysis: BarChart3,
      salary_analysis: TrendingUp,
      service_tenure_report: Clock,
      education_qualifications: GraduationCap,
      department_wise_analysis: Building,
      branch_wise_analysis: Building,
      promotion_analysis: Award,
      age_distribution: UserCheck,
      gender_analysis: UserCheck,
      employee_directory: FileText,
      birthday_list: Calendar,
      new_joiners_report: Zap,
      employment_type_analysis: Users,
      comprehensive_employee_report: FileText,
      custom_report: Settings
    };
    return iconMap[type] || FileText;
  };

  const getReportTypeColor = (type: EmployeeReportType) => {
    const colorMap = {
      employee_summary: 'text-blue-600 bg-blue-100',
      demographics_analysis: 'text-green-600 bg-green-100',
      salary_analysis: 'text-purple-600 bg-purple-100',
      service_tenure_report: 'text-orange-600 bg-orange-100',
      education_qualifications: 'text-indigo-600 bg-indigo-100',
      department_wise_analysis: 'text-red-600 bg-red-100',
      branch_wise_analysis: 'text-pink-600 bg-pink-100',
      promotion_analysis: 'text-yellow-600 bg-yellow-100',
      age_distribution: 'text-teal-600 bg-teal-100',
      gender_analysis: 'text-cyan-600 bg-cyan-100',
      employee_directory: 'text-gray-600 bg-gray-100',
      birthday_list: 'text-rose-600 bg-rose-100',
      new_joiners_report: 'text-emerald-600 bg-emerald-100',
      employment_type_analysis: 'text-violet-600 bg-violet-100',
      comprehensive_employee_report: 'text-slate-600 bg-slate-100',
      custom_report: 'text-amber-600 bg-amber-100'
    };
    return colorMap[type] || 'text-gray-600 bg-gray-100';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-5/6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl font-bold text-gray-900">Employee Reports</h2>
                {reportHistory.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-700 bg-green-100 px-2 py-1 rounded-full">
                      {reportHistory.length} report{reportHistory.length !== 1 ? 's' : ''} available
                    </span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600">Generate comprehensive employee reports and analytics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('predefined')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'predefined'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Available Reports
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'history'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Report History
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'predefined' && (
            <div className="h-full flex">
              {/* Report List */}
              <div className="w-1/2 border-r overflow-y-auto">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Reports</h3>
                  <div className="space-y-3">
                    {PREDEFINED_REPORTS.map((report) => {
                      const IconComponent = getReportTypeIcon(report.type);
                      const colorClass = getReportTypeColor(report.type);
                      
                      return (
                        <div
                          key={report.id}
                          onClick={() => setSelectedReport(report)}
                          className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                            selectedReport?.id === report.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClass}`}>
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{report.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="text-xs text-gray-500">
                                  Format: {report.outputFormat.toUpperCase()}
                                </span>
                                {report.includeCharts && (
                                  <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                                    With Charts
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Report Preview & Generation */}
              <div className="w-1/2 overflow-y-auto">
                {selectedReport ? (
                  <div className="p-6">
                    <div className="mb-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getReportTypeColor(selectedReport.type)}`}>
                          {React.createElement(getReportTypeIcon(selectedReport.type), { className: "w-6 h-6" })}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{selectedReport.name}</h3>
                          <p className="text-gray-600">{selectedReport.description}</p>
                        </div>
                      </div>

                      {/* Report Configuration */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Report Configuration</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Output Format:</span>
                            <span className="ml-2 font-medium">{selectedReport.outputFormat.toUpperCase()}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Include Charts:</span>
                            <span className="ml-2 font-medium">{selectedReport.includeCharts ? 'Yes' : 'No'}</span>
                          </div>
                          {selectedReport.groupBy && (
                            <div>
                              <span className="text-gray-500">Group By:</span>
                              <span className="ml-2 font-medium">{selectedReport.groupBy.replace('_', ' ')}</span>
                            </div>
                          )}
                          {selectedReport.sortBy && (
                            <div>
                              <span className="text-gray-500">Sort By:</span>
                              <span className="ml-2 font-medium">{selectedReport.sortBy.replace('_', ' ')}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Included Sections */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Included Sections</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedReport.includedSections.map((section) => (
                            <span
                              key={section}
                              className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                            >
                              {section.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Generate Button */}
                      <div className="space-y-3">
                        <button
                          onClick={() => handleGenerateReport(selectedReport)}
                          disabled={isGenerating}
                          className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {isGenerating ? (
                            <>
                              <Loader className="w-5 h-5 mr-2 animate-spin" />
                              Generating Report...
                            </>
                          ) : (
                            <>
                              <Play className="w-5 h-5 mr-2" />
                              Generate Report
                            </>
                          )}
                        </button>
                        
                        <button
                          onClick={async () => {
                            try {
                              setDownloadingReports(prev => ({ ...prev, [selectedReport.id]: true }));
                              
                              // Generate and download sample report directly
                              const response = await employeeReportService.generateSampleReport(selectedReport.id);
                              
                              if (response.ok) {
                                const blob = await response.blob();
                                const url = window.URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = url;
                                
                                // Get filename from response headers or create one
                                const contentDisposition = response.headers.get('Content-Disposition');
                                let filename = '';
                                
                                if (contentDisposition) {
                                  const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                                  if (filenameMatch) {
                                    filename = filenameMatch[1];
                                  }
                                } 
                                
                                if (!filename) {
                                  // Create proper filename with correct extension
                                  const reportName = selectedReport.name.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');
                                  const dateStr = new Date().toISOString().split('T')[0];
                                  const extension = selectedReport.outputFormat === 'pdf' ? 'html' : 'csv';
                                  filename = `${reportName}_Sample_${dateStr}.${extension}`;
                                }
                                
                                link.download = filename;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                window.URL.revokeObjectURL(url);
                                
                                console.log(`Sample ${selectedReport.name} downloaded successfully!`);
                              } else {
                                throw new Error('Failed to generate sample report');
                              }
                            } catch (error) {
                              console.error('Error downloading sample:', error);
                              console.error('Failed to download sample report');
                            } finally {
                              setDownloadingReports(prev => ({ ...prev, [selectedReport.id]: false }));
                            }
                          }}
                          disabled={downloadingReports[selectedReport.id]}
                          className="w-full flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {downloadingReports[selectedReport.id] ? (
                            <>
                              <Loader className="w-5 h-5 mr-2 animate-spin" />
                              Downloading Sample...
                            </>
                          ) : (
                            <>
                              <Download className="w-5 h-5 mr-2" />
                              Download Sample Report
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Generated Report Preview */}
                    {generatedReport && (
                      <div className="border-t pt-6">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                          Report Generated Successfully
                        </h4>
                        
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Total Records:</span>
                              <span className="ml-2 font-semibold">{generatedReport.totalRecords}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Generated:</span>
                              <span className="ml-2 font-semibold">
                                {new Date(generatedReport.generatedAt).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Report Summary */}
                        <div className="bg-white border rounded-lg p-4 mb-4">
                          <h5 className="font-medium text-gray-900 mb-3">Report Summary</h5>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Total Employees:</span>
                                <span className="font-medium">{generatedReport.summary.totalEmployees}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Average Age:</span>
                                <span className="font-medium">{generatedReport.summary.demographics.averageAge} years</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Promotion Rate:</span>
                                <span className="font-medium">{generatedReport.summary.promotions.promotionRate}%</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Departments:</span>
                                <span className="font-medium">{Object.keys(generatedReport.summary.departments).length}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Branches:</span>
                                <span className="font-medium">{Object.keys(generatedReport.summary.branches).length}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Avg Service:</span>
                                <span className="font-medium">{generatedReport.summary.demographics.averageServiceYears} years</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Charts */}
                        {generatedReport.charts && generatedReport.charts.length > 0 && (
                          <div className="bg-white border rounded-lg p-4 mb-4">
                            <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                              <BarChart3 className="w-4 h-4 mr-2" />
                              Visual Analytics
                            </h5>
                            <div className="grid grid-cols-1 gap-4">
                              {generatedReport.charts.map((chart) => (
                                <SimpleChart key={chart.id} chart={chart} />
                              ))}
                            </div>
                          </div>
                        )}

                        <button
                          onClick={() => handleDownloadReport(generatedReport.id)}
                          className="w-full flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Download className="w-5 h-5 mr-2" />
                          Download Report
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>Select a report from the list to view details and generate</p>
                  </div>
                )}
              </div>
            </div>
          )}



          {activeTab === 'history' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Report History</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {reportHistory.length > 0 
                      ? `${reportHistory.length} reports generated • Most recent: ${new Date(reportHistory[0]?.generatedAt).toLocaleDateString()}`
                      : 'No reports generated yet'
                    }
                  </p>
                </div>
                <button
                  onClick={loadReportHistory}
                  className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </button>
              </div>

              {reportHistory.length > 0 ? (
                <div className="space-y-4">
                  {reportHistory.map((report, index) => {
                    const isRecent = index === 0; // Most recent report
                    const generatedHours = Math.floor((Date.now() - new Date(report.generatedAt).getTime()) / (1000 * 60 * 60));
                    const isVeryRecent = generatedHours < 6;
                    
                    return (
                      <div key={report.id} className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                        isRecent ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                      }`}>
                        {isRecent && (
                          <div className="flex items-center justify-between mb-3 pb-3 border-b border-blue-200">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                              <span className="text-sm font-medium text-blue-900">Most Recent Report</span>
                            </div>
                            {isVeryRecent && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                New
                              </span>
                            )}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getReportTypeColor(report.config.type)}`}>
                              {React.createElement(getReportTypeIcon(report.config.type), { className: "w-5 h-5" })}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium text-gray-900">{report.config.name}</h4>
                                {report.config.includeCharts && (
                                  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                                    With Charts
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{report.config.description}</p>
                              
                              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                <span className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {generatedHours === 0 ? 'Just now' : 
                                   generatedHours === 1 ? '1 hour ago' : 
                                   generatedHours < 24 ? `${generatedHours} hours ago` :
                                   `${Math.floor(generatedHours / 24)} days ago`}
                                </span>
                                <span className="flex items-center">
                                  <Users className="w-3 h-3 mr-1" />
                                  {report.totalRecords} records
                                </span>
                                <span className="flex items-center">
                                  <FileText className="w-3 h-3 mr-1" />
                                  {report.config.outputFormat.toUpperCase()}
                                </span>
                                <span className="flex items-center">
                                  <Building className="w-3 h-3 mr-1" />
                                  {Object.keys(report.summary.departments).length} departments
                                </span>
                              </div>

                              {/* Quick Summary Stats */}
                              <div className="grid grid-cols-3 gap-4 mt-3 p-2 bg-white bg-opacity-50 rounded">
                                <div className="text-center">
                                  <div className="text-lg font-semibold text-gray-900">{report.summary.demographics.averageAge}</div>
                                  <div className="text-xs text-gray-500">Avg Age</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-lg font-semibold text-gray-900">{report.summary.promotions.promotionRate}%</div>
                                  <div className="text-xs text-gray-500">Promoted</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-lg font-semibold text-gray-900">{report.summary.demographics.averageServiceYears}</div>
                                  <div className="text-xs text-gray-500">Avg Service</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-center space-y-2 ml-4">
                            <button
                              onClick={() => setGeneratedReport(report)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDownloadReport(report.id)}
                              className="p-2 text-green-600 hover:bg-green-100 rounded-md transition-colors"
                              title="Download Report"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteReport(report.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                              title="Delete Report"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">No Reports Generated</h3>
                  <p className="mb-4">Generate your first report to see it here</p>
                  <button
                    onClick={() => setActiveTab('predefined')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse Available Reports
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeReports;