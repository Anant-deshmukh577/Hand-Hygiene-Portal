import { useState, useEffect, useCallback } from 'react';
import { useNotification } from '../../context/NotificationContext';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import { DEPARTMENTS, WARDS } from '../../utils/constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { reportService } from '../../services/reportService';
import { observationService } from '../../services/observationService';

/* --- SVG Icons --- */
const ChartBarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const DocumentReportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const ClipboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ExclamationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const EmptyChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const ReportsView = () => {
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showNoDataModal, setShowNoDataModal] = useState(false);
  const [noDataMessage, setNoDataMessage] = useState('');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    department: '',
    ward: '',
  });

  const [summaryStats, setSummaryStats] = useState({
    totalObservations: 0,
    adherenceRate: 0,
    partialRate: 0,
    missedRate: 0,
  });

  const [whoMomentsData, setWhoMomentsData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);

  const COLORS = ['#14b8a6', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#6b7280'];

  const fetchReportData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    }

    try {
      const filterParams = {};
      if (filters.startDate) filterParams.startDate = filters.startDate;
      if (filters.endDate) filterParams.endDate = filters.endDate;
      if (filters.department) filterParams.department = filters.department;
      if (filters.ward) filterParams.ward = filters.ward;

      const statsResponse = await reportService.getDashboardStats(filterParams);
      const stats = statsResponse.stats || {};
      const breakdown = stats.breakdown || {};
      const total = (breakdown.adherence || 0) + (breakdown.partial || 0) + (breakdown.missed || 0);
      
      setSummaryStats({
        totalObservations: stats.totalObservations || 0,
        adherenceRate: total > 0 ? Math.round((breakdown.adherence / total) * 100) : 0,
        partialRate: total > 0 ? Math.round((breakdown.partial / total) * 100) : 0,
        missedRate: total > 0 ? Math.round((breakdown.missed / total) * 100) : 0,
      });

      const complianceResponse = await reportService.getComplianceReport(filterParams);
      const whoMoments = complianceResponse.report?.whoMoments || [];
      const formattedMoments = whoMoments.map(m => ({
        name: m.moment.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        adherence: m.adherence || 0,
        partial: m.partial || 0,
        missed: m.missed || 0,
      }));
      setWhoMomentsData(formattedMoments.length > 0 ? formattedMoments : [
        { name: 'Before Patient', adherence: 0, partial: 0, missed: 0 },
        { name: 'Before Aseptic', adherence: 0, partial: 0, missed: 0 },
        { name: 'After Body Fluid', adherence: 0, partial: 0, missed: 0 },
        { name: 'After Patient', adherence: 0, partial: 0, missed: 0 },
        { name: 'After Surroundings', adherence: 0, partial: 0, missed: 0 },
      ]);

      const obsResponse = await observationService.getObservations({ ...filterParams, limit: 1000 });
      const observations = obsResponse.observations || [];
      const deptCounts = {};
      observations.forEach(obs => {
        const dept = obs.department;
        if (dept) {
          deptCounts[dept] = (deptCounts[dept] || 0) + 1;
        }
      });
      const deptData = Object.entries(deptCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);
      setDepartmentData(deptData.length > 0 ? deptData : []);

    } catch (error) {
      console.error('Failed to fetch report data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  const handleRefresh = () => {
    if (!refreshing) {
      fetchReportData(true);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleExportReport = async (format) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      
      if (filters.startDate) queryParams.append('startDate', filters.startDate);
      if (filters.endDate) queryParams.append('endDate', filters.endDate);
      if (filters.department) queryParams.append('department', filters.department);
      if (filters.ward) queryParams.append('ward', filters.ward);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/reports/export/${format}?${queryParams.toString()}`,
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
          setNoDataMessage(errorData.message || 'No data available for the selected filters.');
          setShowNoDataModal(true);
          return;
        }
        throw new Error(errorData.message || 'Failed to export report');
      }

      if (format === 'pdf') {
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
        a.download = `hand_hygiene_report_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xls' : format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showSuccess(`Report exported as ${format.toUpperCase()}`);
      }
    } catch (error) {
      showError(error.message || 'Failed to export report');
    } finally {
      setLoading(false);
    }
  };

  const departmentOptions = [
    { value: '', label: 'All Departments' },
    ...DEPARTMENTS.map(dept => ({ value: dept, label: dept }))
  ];

  const wardOptions = [
    { value: '', label: 'All Wards' },
    ...WARDS.map(ward => ({ value: ward, label: ward }))
  ];

  const hasActiveFilters = Object.values(filters).some(val => val !== '');

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        
        {/* No Data Modal */}
        <Modal
          isOpen={showNoDataModal}
          onClose={() => setShowNoDataModal(false)}
          title="No Data Available"
        >
          <div className="p-6 text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-400">
              <EmptyChartIcon />
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
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/30">
                <ChartBarIcon />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                  Reports & Analytics
                </h1>
                <p className="text-gray-500">
                  Comprehensive compliance insights
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
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
              <Badge variant="primary" size="medium">
                Analytics
              </Badge>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/8 overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <FilterIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <p className="text-sm text-gray-500">
                  {hasActiveFilters ? 'Custom date range and filters applied' : 'Apply filters to customize your report'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Start Date
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  End Date
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Department
                </label>
                <div className="relative">
                  <select
                    name="department"
                    value={filters.department}
                    onChange={(e) => handleFilterChange('department', e.target.value)}
                    className="w-full appearance-none px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                  >
                    {departmentOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDownIcon className="text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Ward */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Ward
                </label>
                <div className="relative">
                  <select
                    name="ward"
                    value={filters.ward}
                    onChange={(e) => handleFilterChange('ward', e.target.value)}
                    className="w-full appearance-none px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                  >
                    {wardOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDownIcon className="text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Export Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleExportReport('pdf')}
                disabled={loading}
                className={`
                  inline-flex items-center gap-2 px-6 py-3
                  bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl
                  shadow-lg shadow-red-600/25 hover:shadow-xl hover:shadow-red-600/30
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Exporting...
                  </>
                ) : (
                  <>
                    <DocumentReportIcon />
                    Export PDF
                  </>
                )}
              </button>
              <button
                onClick={() => handleExportReport('excel')}
                disabled={loading}
                className={`
                  inline-flex items-center gap-2 px-6 py-3
                  bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl
                  shadow-lg shadow-green-600/25 hover:shadow-xl hover:shadow-green-600/30
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <DownloadIcon />
                Export Excel
              </button>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <ClipboardIcon className="text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Total Observations</p>
            <p className="text-3xl font-bold text-blue-600">{summaryStats.totalObservations}</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircleIcon className="text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Adherence Rate</p>
            <p className="text-3xl font-bold text-green-600">{summaryStats.adherenceRate}%</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <ExclamationIcon className="text-amber-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Partial Adherence</p>
            <p className="text-3xl font-bold text-amber-600">{summaryStats.partialRate}%</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <XCircleIcon className="text-red-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-1">Missed Rate</p>
            <p className="text-3xl font-bold text-red-600">{summaryStats.missedRate}%</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* WHO Moments Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/8 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
              <h3 className="text-lg font-semibold text-gray-900">
                Compliance by WHO 5 Moments
              </h3>
              <p className="text-sm text-gray-500">Adherence breakdown by moment type</p>
            </div>
            <div className="p-4 sm:p-6">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={whoMomentsData} margin={{ top: 5, right: 5, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 10 }} 
                    angle={-20} 
                    textAnchor="end" 
                    height={50}
                    interval={0}
                  />
                  <YAxis tick={{ fontSize: 10 }} width={35} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="adherence" fill="#10b981" name="Adherence" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="partial" fill="#f59e0b" name="Partial" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="missed" fill="#ef4444" name="Missed" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Department Distribution */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/8 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
              <h3 className="text-lg font-semibold text-gray-900">
                Observations by Department
              </h3>
              <p className="text-sm text-gray-500">Distribution across top departments</p>
            </div>
            <div className="p-4 sm:p-6">
              {departmentData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => {
                        const shortName = (name || '').length > 10 ? (name || '').substring(0, 10) + '...' : (name || '');
                        return `${shortName} ${(percent * 100).toFixed(0)}%`;
                      }}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-[280px] text-gray-500">
                  <EmptyChartIcon className="mx-auto mb-3 text-gray-300" />
                  <p className="text-sm font-medium">No department data yet</p>
                  <p className="text-xs mt-1">Observations will appear here once recorded</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/8 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
            <h3 className="text-lg font-semibold text-gray-900">
              Detailed Compliance Breakdown
            </h3>
            <p className="text-sm text-gray-500">Moment-by-moment analysis with percentages</p>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {whoMomentsData.map((moment, index) => {
                const total = moment.adherence + moment.partial + moment.missed;
                const adherencePercent = total > 0 ? (moment.adherence / total) * 100 : 0;
                
                return (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">{moment.name}</span>
                      <span className="text-sm text-gray-500">{total} observations</span>
                    </div>
                    <div className="flex gap-0.5 h-8 rounded-xl overflow-hidden shadow-sm">
                      {total > 0 ? (
                        <>
                          <div 
                            style={{ width: `${(moment.adherence / total) * 100}%` }}
                            className="bg-green-500 transition-all duration-300"
                            title={`Adherence: ${moment.adherence}`}
                          />
                          <div 
                            style={{ width: `${(moment.partial / total) * 100}%` }}
                            className="bg-amber-500 transition-all duration-300"
                            title={`Partial: ${moment.partial}`}
                          />
                          <div 
                            style={{ width: `${(moment.missed / total) * 100}%` }}
                            className="bg-red-500 transition-all duration-300"
                            title={`Missed: ${moment.missed}`}
                          />
                        </>
                      ) : (
                        <div className="w-full bg-gray-200" />
                      )}
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-green-500 rounded-sm"></span>
                        Adherence: {moment.adherence} ({adherencePercent.toFixed(1)}%)
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-amber-500 rounded-sm"></span>
                        Partial: {moment.partial}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-red-500 rounded-sm"></span>
                        Missed: {moment.missed}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReportsView;
