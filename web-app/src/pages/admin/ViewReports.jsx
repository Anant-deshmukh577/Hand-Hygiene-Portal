import { useState, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';
import ReportGenerator from '../../components/admin/ReportGenerator';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

/* --- SVG Icons --- */
const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const DocumentReportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DocumentTextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const TableIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const ExclamationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ViewReports = () => {
  const { showSuccess, showError, showLoading, dismissLoading } = useNotification();
  const [reportsData, setReportsData] = useState([]);
  const [showNoDataModal, setShowNoDataModal] = useState(false);
  const [noDataMessage, setNoDataMessage] = useState('');
  const [downloadingIndex, setDownloadingIndex] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const now = new Date();
    setReportsData([
      { 
        name: 'Weekly Compliance Report', 
        date: now.toISOString(), 
        format: 'pdf', 
        days: 7,
        type: 'compliance',
        size: '245 KB',
      },
      { 
        name: 'Department Performance', 
        date: new Date(now.getTime() - 86400000).toISOString(), 
        format: 'excel', 
        days: 30,
        type: 'performance',
        size: '1.2 MB',
      },
      { 
        name: 'Monthly Summary', 
        date: new Date(now.getTime() - 172800000).toISOString(), 
        format: 'csv', 
        days: 30,
        type: 'summary',
        size: '89 KB',
      },
    ]);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      showSuccess('Reports refreshed');
    }, 1000);
  };

  const getFormatConfig = (format) => {
    const configs = {
      pdf: { 
        bg: 'bg-red-100', 
        text: 'text-red-700', 
        border: 'border-red-200',
        icon: <DocumentTextIcon />,
        label: 'PDF',
      },
      excel: { 
        bg: 'bg-green-100', 
        text: 'text-green-700', 
        border: 'border-green-200',
        icon: <TableIcon />,
        label: 'Excel',
      },
      csv: { 
        bg: 'bg-blue-100', 
        text: 'text-blue-700', 
        border: 'border-blue-200',
        icon: <TableIcon />,
        label: 'CSV',
      },
    };
    return configs[format] || configs.pdf;
  };

  const getTypeConfig = (type) => {
    const configs = {
      compliance: { bg: 'bg-teal-100', text: 'text-teal-700', icon: '✅' },
      performance: { bg: 'bg-purple-100', text: 'text-purple-700', icon: '📈' },
      summary: { bg: 'bg-amber-100', text: 'text-amber-700', icon: '📋' },
    };
    return configs[type] || configs.summary;
  };

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleDownload = async (report, index) => {
    setDownloadingIndex(index);
    try {
      const token = localStorage.getItem('token');
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - report.days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/reports/export/${report.format}?startDate=${startDate}&endDate=${endDate}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 404) {
          setNoDataMessage(errorData.message || 'No data available for this report.');
          setShowNoDataModal(true);
          return;
        }
        throw new Error(errorData.message || 'Failed to download report');
      }

      if (report.format === 'pdf') {
        const htmlContent = await response.text();
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(htmlContent);
          newWindow.document.close();
        }
        showSuccess('Report opened in new tab. Use Print (Ctrl+P) to save as PDF.');
      } else {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${report.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.${report.format === 'excel' ? 'xls' : report.format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showSuccess(`${report.name} downloaded successfully`);
      }
    } catch (error) {
      console.error('Download error:', error);
      showError(error.message || 'Failed to download report');
    } finally {
      setDownloadingIndex(null);
    }
  };

  const handleGenerate = async (reportConfig) => {
    const toastId = showLoading('Generating report...');
    
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      
      if (reportConfig.startDate) queryParams.append('startDate', reportConfig.startDate);
      if (reportConfig.endDate) queryParams.append('endDate', reportConfig.endDate);
      queryParams.append('reportType', reportConfig.reportType);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/reports/export/${reportConfig.format}?${queryParams.toString()}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      dismissLoading(toastId);

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 404) {
          setNoDataMessage(errorData.message || 'No data available for the selected filters.');
          setShowNoDataModal(true);
          return;
        }
        throw new Error(errorData.message || 'Failed to generate report');
      }

      if (reportConfig.format === 'pdf') {
        const htmlContent = await response.text();
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(htmlContent);
          newWindow.document.close();
        }
        showSuccess('Report opened in new tab. Use Print (Ctrl+P) to save as PDF.');
      } else {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${reportConfig.reportType}_report_${new Date().toISOString().split('T')[0]}.${reportConfig.format === 'excel' ? 'xls' : reportConfig.format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showSuccess(`${reportConfig.reportType} report generated successfully`);
      }
    } catch (error) {
      dismissLoading(toastId);
      console.error('Generate error:', error);
      showError(error.message || 'Failed to generate report');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        
        {/* No Data Modal */}
        <Modal
          isOpen={showNoDataModal}
          onClose={() => setShowNoDataModal(false)}
          title="No Data Available"
        >
          <div className="p-6 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-400">
              <ExclamationIcon />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Found</h3>
            <p className="text-gray-600 mb-4">
              {noDataMessage}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Try adjusting your date range or filters to find available data.
            </p>
            <button
              onClick={() => setShowNoDataModal(false)}
              className="inline-flex items-center justify-center px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl shadow-lg shadow-teal-600/25 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </Modal>

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/30">
                <DocumentReportIcon />
              </div>
              
              {/* Title */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Reports
                  </h1>
                  <ChartIcon className="h-6 w-6 text-purple-500" />
                </div>
                <p className="text-gray-500">
                  Generate and download compliance reports
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className={`
                  inline-flex items-center gap-2 px-4 py-2.5
                  bg-white border border-gray-200 rounded-xl
                  text-sm font-medium text-gray-700
                  hover:bg-gray-50 hover:border-gray-300
                  focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <RefreshIcon className={refreshing ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>

              {/* Admin Badge */}
              <Badge variant="primary" size="medium">
                Reports
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <DocumentReportIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{reportsData.length}</p>
                <p className="text-xs text-gray-500">Recent Reports</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <DocumentTextIcon className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">
                  {reportsData.filter(r => r.format === 'pdf').length}
                </p>
                <p className="text-xs text-gray-500">PDF Reports</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <TableIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {reportsData.filter(r => r.format === 'excel').length}
                </p>
                <p className="text-xs text-gray-500">Excel Reports</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <TableIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {reportsData.filter(r => r.format === 'csv').length}
                </p>
                <p className="text-xs text-gray-500">CSV Reports</p>
              </div>
            </div>
          </div>
        </div>

        {/* Report Generator Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/8 overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                <PlusIcon className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Generate New Report</h2>
                <p className="text-sm text-gray-500">Create custom reports with filters</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <ReportGenerator onGenerate={handleGenerate} />
          </div>
        </div>

        {/* Recent Reports Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/8 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                  <ClockIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
                  <p className="text-sm text-gray-500">Previously generated reports</p>
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center px-3 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full">
                {reportsData.length} reports
              </span>
            </div>
          </div>

          {/* Reports List */}
          <div className="divide-y divide-gray-100">
            {reportsData.map((report, index) => {
              const formatConfig = getFormatConfig(report.format);
              const typeConfig = getTypeConfig(report.type);
              const isDownloading = downloadingIndex === index;

              return (
                <div
                  key={index}
                  className="group px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-gray-50/50 transition-colors"
                >
                  {/* Icon & Info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Format Icon */}
                    <div className={`
                      w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                      ${formatConfig.bg} ${formatConfig.text}
                    `}>
                      {formatConfig.icon}
                    </div>

                    {/* Report Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate" title={report.name}>
                          {report.name}
                        </h4>
                        <span className={`
                          inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                          ${typeConfig.bg} ${typeConfig.text}
                        `}>
                          {typeConfig.icon} {report.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="h-4 w-4" />
                          {getRelativeTime(report.date)}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span>{report.days} days</span>
                        {report.size && (
                          <>
                            <span className="text-gray-300">•</span>
                            <span>{report.size}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 sm:flex-shrink-0">
                    {/* Format Badge */}
                    <span className={`
                      hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold
                      ${formatConfig.bg} ${formatConfig.text} ${formatConfig.border} border
                    `}>
                      {formatConfig.label}
                    </span>

                    {/* Download Button */}
                    <button
                      onClick={() => handleDownload(report, index)}
                      disabled={isDownloading}
                      className={`
                        inline-flex items-center gap-2 px-4 py-2.5
                        rounded-xl text-sm font-medium
                        transition-all duration-200
                        ${isDownloading 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : `bg-white border ${formatConfig.border} ${formatConfig.text} hover:${formatConfig.bg}`
                        }
                      `}
                    >
                      {isDownloading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Downloading...
                        </>
                      ) : (
                        <>
                          <DownloadIcon />
                          <span className="hidden sm:inline">Download</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {reportsData.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                <DocumentReportIcon className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No reports yet</h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto">
                Generate your first report using the form above.
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Reports are generated in real-time</span>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-red-100"></div>
                  <span className="text-gray-500">PDF</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-green-100"></div>
                  <span className="text-gray-500">Excel</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-blue-100"></div>
                  <span className="text-gray-500">CSV</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-100 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-purple-800 mb-1">Report Formats</h3>
                <p className="text-sm text-purple-700">
                  <strong>PDF</strong> - Best for printing and sharing. 
                  <strong> Excel</strong> - Great for data analysis with formulas. 
                  <strong> CSV</strong> - Compatible with any spreadsheet software.
                </p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white hover:bg-purple-50 text-purple-700 text-sm font-medium rounded-lg border border-purple-200 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ViewReports;