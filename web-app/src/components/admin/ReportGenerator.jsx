import { useState } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

/* --- SVG Icons --- */
const DocumentReportIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ChartBarIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const DocumentDownloadIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const DownloadIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const ClipboardCheckIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const UserIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const PresentationChartIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 13v-1m4 1v-3m4 3V8M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const ReportGenerator = ({ onGenerate, loading = false }) => {
  const [reportConfig, setReportConfig] = useState({
    reportType: 'compliance',
    startDate: '',
    endDate: '',
    department: '',
    format: 'pdf',
  });

  const reportTypeOptions = [
    { value: 'compliance', label: 'Compliance Report', icon: <ClipboardCheckIcon />, description: 'Overall hand hygiene compliance data' },
    { value: 'department', label: 'Department Report', icon: <BuildingIcon />, description: 'Department-wise performance analysis' },
    { value: 'user', label: 'User Performance Report', icon: <UserIcon />, description: 'Individual staff performance metrics' },
    { value: 'trend', label: 'Trend Analysis', icon: <TrendingUpIcon />, description: 'Historical trends and patterns' },
    { value: 'summary', label: 'Executive Summary', icon: <PresentationChartIcon />, description: 'High-level overview for leadership' },
  ];

  const formatOptions = [
    { value: 'pdf', label: 'PDF Document', icon: '📄', color: 'red' },
    { value: 'excel', label: 'Excel Spreadsheet', icon: '📊', color: 'green' },
    { value: 'csv', label: 'CSV File', icon: '📋', color: 'blue' },
  ];

  const departmentOptions = [
    { value: '', label: 'All Departments' },
    { value: 'Medicine', label: 'Medicine' },
    { value: 'Surgery', label: 'Surgery' },
    { value: 'Pediatrics', label: 'Pediatrics' },
    { value: 'Emergency', label: 'Emergency' },
    { value: 'ICU', label: 'ICU' },
    { value: 'NICU', label: 'NICU' },
    { value: 'OT', label: 'Operation Theatre' },
    { value: 'OPD', label: 'OPD' },
  ];

  const handleGenerate = () => {
    onGenerate(reportConfig);
  };

  const selectedReportType = reportTypeOptions.find(r => r.value === reportConfig.reportType);

  // Quick date presets
  const setDatePreset = (preset) => {
    const today = new Date();
    let startDate, endDate;

    switch (preset) {
      case 'today':
        startDate = endDate = today.toISOString().split('T')[0];
        break;
      case 'week':
        startDate = new Date(today.setDate(today.getDate() - 7)).toISOString().split('T')[0];
        endDate = new Date().toISOString().split('T')[0];
        break;
      case 'month':
        startDate = new Date(today.setMonth(today.getMonth() - 1)).toISOString().split('T')[0];
        endDate = new Date().toISOString().split('T')[0];
        break;
      case 'quarter':
        startDate = new Date(today.setMonth(today.getMonth() - 3)).toISOString().split('T')[0];
        endDate = new Date().toISOString().split('T')[0];
        break;
      default:
        return;
    }

    setReportConfig(prev => ({ ...prev, startDate, endDate }));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 overflow-hidden">
      
      {/* ==================== HEADER ==================== */}
      <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/30">
            <DocumentReportIcon />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Generate Custom Report</h3>
            <p className="text-sm text-gray-500">Create detailed reports with custom parameters</p>
          </div>
        </div>
      </div>

      {/* ==================== CONTENT ==================== */}
      <div className="p-6 space-y-6">

        {/* Report Type Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Report Type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {reportTypeOptions.map((option) => {
              const isSelected = reportConfig.reportType === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setReportConfig(prev => ({ ...prev, reportType: option.value }))}
                  className={`
                    group relative p-4 rounded-xl border-2 text-left
                    transition-all duration-300
                    ${isSelected 
                      ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-500/20' 
                      : 'border-gray-200 bg-white hover:border-teal-200 hover:bg-teal-50/30'
                    }
                  `}
                >
                  {/* Selected Indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 text-teal-600">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`
                    w-10 h-10 rounded-xl flex items-center justify-center mb-3
                    transition-all duration-300
                    ${isSelected 
                      ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/30' 
                      : 'bg-gray-100 text-gray-500 group-hover:bg-teal-100 group-hover:text-teal-600'
                    }
                  `}>
                    {option.icon}
                  </div>

                  {/* Label */}
                  <h4 className={`font-semibold mb-1 ${isSelected ? 'text-teal-900' : 'text-gray-900'}`}>
                    {option.label}
                  </h4>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-white text-sm font-medium text-gray-500">
              Date Range
            </span>
          </div>
        </div>

        {/* Quick Date Presets */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Quick Select
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'today', label: 'Today' },
              { key: 'week', label: 'Last 7 Days' },
              { key: 'month', label: 'Last 30 Days' },
              { key: 'quarter', label: 'Last 3 Months' },
            ].map((preset) => (
              <button
                key={preset.key}
                type="button"
                onClick={() => setDatePreset(preset.key)}
                className="
                  inline-flex items-center gap-2 px-4 py-2
                  bg-gray-50 hover:bg-teal-50
                  text-gray-700 hover:text-teal-700
                  text-sm font-medium
                  rounded-lg border border-gray-200 hover:border-teal-200
                  transition-all duration-200
                "
              >
                <CalendarIcon className="h-4 w-4" />
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Start Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <CalendarIcon />
              </div>
              <input
                type="date"
                value={reportConfig.startDate}
                onChange={(e) => setReportConfig(prev => ({ ...prev, startDate: e.target.value }))}
                className="
                  w-full pl-12 pr-4 py-3
                  bg-white border border-gray-200 rounded-xl
                  text-gray-900
                  focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                  transition-all duration-200
                "
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              End Date
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <CalendarIcon />
              </div>
              <input
                type="date"
                value={reportConfig.endDate}
                onChange={(e) => setReportConfig(prev => ({ ...prev, endDate: e.target.value }))}
                className="
                  w-full pl-12 pr-4 py-3
                  bg-white border border-gray-200 rounded-xl
                  text-gray-900
                  focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                  transition-all duration-200
                "
              />
            </div>
          </div>
        </div>

        {/* Department Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Department Filter
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <BuildingIcon />
            </div>
            <select
              value={reportConfig.department}
              onChange={(e) => setReportConfig(prev => ({ ...prev, department: e.target.value }))}
              className="
                w-full pl-12 pr-4 py-3
                bg-white border border-gray-200 rounded-xl
                text-gray-900
                focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                transition-all duration-200
                appearance-none
                cursor-pointer
              "
            >
              {departmentOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-white text-sm font-medium text-gray-500">
              Export Options
            </span>
          </div>
        </div>

        {/* Export Format Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Export Format
          </label>
          <div className="grid grid-cols-3 gap-3">
            {formatOptions.map((option) => {
              const isSelected = reportConfig.format === option.value;
              const colorClasses = {
                red: isSelected ? 'border-red-500 bg-red-50 ring-red-500/20' : 'hover:border-red-200 hover:bg-red-50/30',
                green: isSelected ? 'border-green-500 bg-green-50 ring-green-500/20' : 'hover:border-green-200 hover:bg-green-50/30',
                blue: isSelected ? 'border-blue-500 bg-blue-50 ring-blue-500/20' : 'hover:border-blue-200 hover:bg-blue-50/30',
              };

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setReportConfig(prev => ({ ...prev, format: option.value }))}
                  className={`
                    group relative p-4 rounded-xl border-2 text-center
                    transition-all duration-300
                    ${isSelected 
                      ? `${colorClasses[option.color]} ring-2` 
                      : `border-gray-200 bg-white ${colorClasses[option.color]}`
                    }
                  `}
                >
                  {/* Icon */}
                  <div className="text-3xl mb-2">{option.icon}</div>
                  
                  {/* Label */}
                  <p className={`text-sm font-semibold ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                    {option.label}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Report Summary Preview */}
        {selectedReportType && (
          <div className="p-4 bg-gradient-to-br from-teal-50 to-white rounded-xl border border-teal-100">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-600 flex-shrink-0">
                <SparklesIcon />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-teal-900 mb-1">Report Preview</h4>
                <p className="text-sm text-teal-700">
                  <span className="font-medium">{selectedReportType.label}</span>
                  {reportConfig.startDate && reportConfig.endDate && (
                    <span> • {reportConfig.startDate} to {reportConfig.endDate}</span>
                  )}
                  {reportConfig.department && (
                    <span> • {reportConfig.department}</span>
                  )}
                  <span> • {formatOptions.find(f => f.value === reportConfig.format)?.label}</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================== FOOTER ==================== */}
      <div className="px-6 py-5 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <button
            type="button"
            onClick={() => setReportConfig({
              reportType: 'compliance',
              startDate: '',
              endDate: '',
              department: '',
              format: 'pdf',
            })}
            className="
              inline-flex items-center justify-center gap-2
              px-6 py-3
              bg-white hover:bg-gray-50
              text-gray-700 font-semibold
              rounded-xl
              border border-gray-200
              shadow-md shadow-black/5
              hover:shadow-lg hover:shadow-black/10
              transition-all duration-300
            "
          >
            Reset
          </button>
          <button
            onClick={handleGenerate}
            disabled={loading || !reportConfig.startDate || !reportConfig.endDate}
            className="
              group inline-flex items-center justify-center gap-2
              px-8 py-3
              bg-teal-600 hover:bg-teal-700
              text-white font-semibold
              rounded-xl
              shadow-lg shadow-teal-600/25
              hover:shadow-xl hover:shadow-teal-600/30
              transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating...
              </>
            ) : (
              <>
                <DownloadIcon />
                Generate Report
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;