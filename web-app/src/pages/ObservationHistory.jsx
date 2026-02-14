import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { observationService } from '../services/observationService';
import ObservationHistoryList from '../components/observation/ObservationHistory';
import { PageLoader } from '../components/common/Loader';
import Badge from '../components/common/Badge';
import { WARDS, DEPARTMENTS, ADHERENCE_OPTIONS } from '../utils/constants';

/* --- SVG Icons --- */
const ClipboardListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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

const MinusCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ObservationHistory = () => {
  const { user } = useAuth();
  const { showError } = useNotification();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [observations, setObservations] = useState([]);
  const [filteredObservations, setFilteredObservations] = useState([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    ward: '',
    department: '',
    adherence: '',
    searchTerm: '',
  });

  const fetchObservations = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      if (!user?.id) {
        setObservations([]);
        setFilteredObservations([]);
        return;
      }

      const canViewAll = user?.role === 'auditor' || user?.role === 'admin';
      const response = canViewAll
        ? await observationService.getObservations({ limit: 100 })
        : await observationService.getObservationsByUser(user.id, { limit: 100 });
      const fetchedObservations = (response.observations || []).map(obs => ({
        id: obs._id,
        department: obs.department,
        designation: obs.designation,
        whoMoment: obs.whoMoment,
        adherence: obs.adherence,
        action: obs.action,
        glove: obs.glove,
        remarks: obs.remarks || '',
        riskFactors: obs.riskFactors || {},
        ward: obs.ward,
        createdAt: obs.createdAt,
      }));

      setObservations(fetchedObservations);
      setFilteredObservations(fetchedObservations);
      setLastUpdated(new Date());
    } catch (error) {
      showError(error.message || 'Failed to load observations');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showError, user?.id, user?.role]);

  const applyFilters = useCallback(() => {
    let filtered = [...observations];

    if (filters.startDate) {
      filtered = filtered.filter(obs => 
        new Date(obs.createdAt) >= new Date(filters.startDate)
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(obs => 
        new Date(obs.createdAt) <= new Date(filters.endDate + 'T23:59:59')
      );
    }
    if (filters.ward) {
      filtered = filtered.filter(obs => obs.ward === filters.ward);
    }
    if (filters.department) {
      filtered = filtered.filter(obs => obs.department === filters.department);
    }
    if (filters.adherence) {
      filtered = filtered.filter(obs => obs.adherence === filters.adherence);
    }
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(obs => 
        (obs.department || '').toLowerCase().includes(searchLower) ||
        (obs.designation || '').toLowerCase().includes(searchLower) ||
        (obs.remarks || '').toLowerCase().includes(searchLower)
      );
    }

    setFilteredObservations(filtered);
  }, [filters, observations]);

  useEffect(() => {
    if (user?.id) {
      fetchObservations();
    }
  }, [user?.id, fetchObservations]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleRefresh = () => {
    if (!refreshing) {
      fetchObservations(true);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      ward: '',
      department: '',
      adherence: '',
      searchTerm: '',
    });
  };

  const hasActiveFilters = Object.values(filters).some(val => val !== '');

  const wardOptions = [
    { value: '', label: 'All Wards' },
    ...WARDS.map(ward => ({ value: ward, label: ward }))
  ];

  const departmentOptions = [
    { value: '', label: 'All Departments' },
    ...DEPARTMENTS.map(dept => ({ value: dept, label: dept }))
  ];

  const adherenceOptions = [
    { value: '', label: 'All Status' },
    ...ADHERENCE_OPTIONS.map(opt => ({ value: opt.value, label: opt.label }))
  ];

  // Stats
  const stats = {
    total: filteredObservations.length,
    adherence: filteredObservations.filter(o => o.adherence === 'adherence').length,
    partial: filteredObservations.filter(o => o.adherence === 'partial').length,
    missed: filteredObservations.filter(o => o.adherence === 'missed').length,
  };

  const complianceRate = stats.total > 0
    ? Math.round((stats.adherence / stats.total) * 100)
    : 0;

  if (loading) {
    return <PageLoader text="Loading observation history..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
                <ClipboardListIcon />
              </div>
              
              {/* Title */}
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                  Observation History
                </h1>
                <p className="text-gray-500">
                  View and filter hand hygiene observations
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Last Updated */}
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                <CalendarIcon />
                <span>Updated {lastUpdated.toLocaleTimeString()}</span>
              </div>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className={`
                  inline-flex items-center gap-2 px-4 py-2.5
                  bg-white border border-gray-200 rounded-xl
                  text-sm font-medium text-gray-700
                  hover:bg-gray-50 hover:border-gray-300
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <RefreshIcon className={refreshing ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>

              {/* User Role Badge */}
              <Badge variant="primary" size="medium">
                {user?.role || 'Staff'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <ClipboardListIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">{stats.adherence}</p>
                <p className="text-xs text-gray-500">Adherence</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <ExclamationIcon className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{stats.partial}</p>
                <p className="text-xs text-gray-500">Partial</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                <MinusCircleIcon className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">{stats.missed}</p>
                <p className="text-xs text-gray-500">Missed</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <p className={`text-2xl font-bold ${
                  complianceRate >= 90 ? 'text-green-600' :
                  complianceRate >= 75 ? 'text-amber-600' : 'text-red-600'
                }`}>
                  {complianceRate}%
                </p>
                <p className="text-xs text-gray-500">Compliance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/8 overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <FilterIcon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                  <p className="text-sm text-gray-500">
                    {hasActiveFilters 
                      ? `${filteredObservations.length} of ${observations.length} observations shown`
                      : `Showing all ${observations.length} observations`
                    }
                  </p>
                </div>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl border border-gray-200 shadow-sm hover:shadow transition-all duration-200"
                >
                  <XIcon />
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              {/* Search */}
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Search
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="searchTerm"
                    value={filters.searchTerm}
                    onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                    placeholder="Search by department, designation, or remarks..."
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

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
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
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
                    className="w-full appearance-none px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer"
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
                    className="w-full appearance-none px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer"
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

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Status
                </label>
                <div className="relative">
                  <select
                    name="adherence"
                    value={filters.adherence}
                    onChange={(e) => handleFilterChange('adherence', e.target.value)}
                    className="w-full appearance-none px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                  >
                    {adherenceOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDownIcon className="text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Observations List */}
        <ObservationHistoryList 
          observations={filteredObservations}
          loading={loading}
        />

      </div>
    </div>
  );
};

export default ObservationHistory;