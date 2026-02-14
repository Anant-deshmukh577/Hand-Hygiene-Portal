import { useState } from 'react';
import { TIME_PERIODS, DEPARTMENTS, WARDS } from '../../utils/constants';

/* --- SVG Icons --- */
const FilterIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const LocationIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const XIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const ClockIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LeaderboardFilters = ({ filters, onChange, onReset, loading = false }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const timePeriodOptions = [
    { value: 'daily', label: 'Today', icon: '📅' },
    { value: 'weekly', label: 'This Week', icon: '📆' },
    { value: 'monthly', label: 'This Month', icon: '🗓️' },
    { value: 'all_time', label: 'All Time', icon: '⏳' },
  ];

  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    ...(DEPARTMENTS || []).map(dept => ({ value: dept, label: dept }))
  ];

  const wardOptions = [
    { value: 'all', label: 'All Wards' },
    ...(WARDS || []).map(ward => ({ value: ward, label: ward }))
  ];

  // Check if any filters are active
  const hasActiveFilters = 
    filters.timePeriod !== 'all_time' || 
    filters.department !== 'all' || 
    filters.ward !== 'all';

  // Count active filters
  const activeFilterCount = [
    filters.timePeriod !== 'all_time',
    filters.department !== 'all',
    filters.ward !== 'all',
  ].filter(Boolean).length;

  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      onChange('timePeriod', 'all_time');
      onChange('department', 'all');
      onChange('ward', 'all');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 overflow-hidden mb-6">
      
      {/* ==================== HEADER ==================== */}
      <div 
        className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/30">
              <FilterIcon />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900">Filters</h3>
                {activeFilterCount > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-teal-600 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">
                {hasActiveFilters 
                  ? `${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} applied`
                  : 'Showing all results'
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Reset Button */}
            {hasActiveFilters && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleReset();
                }}
                className="
                  inline-flex items-center gap-1.5 px-3 py-1.5
                  text-sm font-medium text-gray-600 hover:text-gray-900
                  bg-gray-100 hover:bg-gray-200
                  rounded-lg transition-colors duration-200
                "
              >
                <RefreshIcon />
                Reset
              </button>
            )}
            
            {/* Expand/Collapse */}
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg 
                className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ==================== FILTER CONTENT ==================== */}
      <div className={`
        transition-all duration-300 ease-in-out overflow-hidden
        ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
      `}>
        <div className="p-6">
          
          {/* Quick Time Period Buttons */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Time Period
            </label>
            <div className="flex flex-wrap gap-2">
              {timePeriodOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => onChange('timePeriod', option.value)}
                  className={`
                    inline-flex items-center gap-2 px-4 py-2.5
                    text-sm font-medium rounded-xl
                    border-2 transition-all duration-200
                    ${filters.timePeriod === option.value
                      ? 'border-teal-500 bg-teal-50 text-teal-700 ring-2 ring-teal-500/20'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-teal-200 hover:bg-teal-50/50'
                    }
                  `}
                >
                  <span className="text-base">{option.icon}</span>
                  {option.label}
                  {filters.timePeriod === option.value && (
                    <svg className="h-4 w-4 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Dropdown Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Department Select */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Department
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <BuildingIcon />
                </div>
                <select
                  value={filters.department}
                  onChange={(e) => onChange('department', e.target.value)}
                  disabled={loading}
                  className={`
                    w-full pl-12 pr-10 py-3
                    bg-gray-50 border border-gray-200 rounded-xl
                    text-gray-900
                    focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white
                    transition-all duration-200
                    appearance-none cursor-pointer
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${filters.department !== 'all' ? 'border-teal-300 bg-teal-50/50' : ''}
                  `}
                >
                  {departmentOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                  <ChevronDownIcon />
                </div>
                
                {/* Clear button */}
                {filters.department !== 'all' && (
                  <button
                    onClick={() => onChange('department', 'all')}
                    className="absolute inset-y-0 right-10 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <XIcon />
                  </button>
                )}
              </div>
            </div>

            {/* Ward Select */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Ward
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <LocationIcon />
                </div>
                <select
                  value={filters.ward}
                  onChange={(e) => onChange('ward', e.target.value)}
                  disabled={loading}
                  className={`
                    w-full pl-12 pr-10 py-3
                    bg-gray-50 border border-gray-200 rounded-xl
                    text-gray-900
                    focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white
                    transition-all duration-200
                    appearance-none cursor-pointer
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${filters.ward !== 'all' ? 'border-teal-300 bg-teal-50/50' : ''}
                  `}
                >
                  {wardOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                  <ChevronDownIcon />
                </div>
                
                {/* Clear button */}
                {filters.ward !== 'all' && (
                  <button
                    onClick={() => onChange('ward', 'all')}
                    className="absolute inset-y-0 right-10 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    <XIcon />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-gray-500">Active:</span>
                
                {filters.timePeriod !== 'all_time' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-700 text-sm font-medium rounded-lg border border-teal-200">
                    <ClockIcon />
                    {timePeriodOptions.find(o => o.value === filters.timePeriod)?.label}
                    <button 
                      onClick={() => onChange('timePeriod', 'all_time')}
                      className="ml-1 hover:text-teal-900"
                    >
                      <XIcon />
                    </button>
                  </span>
                )}
                
                {filters.department !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-200">
                    <BuildingIcon className="h-4 w-4" />
                    {filters.department}
                    <button 
                      onClick={() => onChange('department', 'all')}
                      className="ml-1 hover:text-blue-900"
                    >
                      <XIcon />
                    </button>
                  </span>
                )}
                
                {filters.ward !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 text-sm font-medium rounded-lg border border-purple-200">
                    <LocationIcon className="h-4 w-4" />
                    {filters.ward}
                    <button 
                      onClick={() => onChange('ward', 'all')}
                      className="ml-1 hover:text-purple-900"
                    >
                      <XIcon />
                    </button>
                  </span>
                )}

                <button
                  onClick={handleReset}
                  className="text-sm text-gray-500 hover:text-gray-700 underline ml-2"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ==================== COLLAPSED SUMMARY ==================== */}
      {!isExpanded && hasActiveFilters && (
        <div className="px-6 py-3 bg-teal-50/50 border-t border-teal-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-teal-700">Filters:</span>
            
            {filters.timePeriod !== 'all_time' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white text-teal-700 text-xs font-medium rounded-md shadow-sm">
                {timePeriodOptions.find(o => o.value === filters.timePeriod)?.icon}
                {timePeriodOptions.find(o => o.value === filters.timePeriod)?.label}
              </span>
            )}
            
            {filters.department !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white text-blue-700 text-xs font-medium rounded-md shadow-sm">
                <BuildingIcon className="h-3 w-3" />
                {filters.department}
              </span>
            )}
            
            {filters.ward !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-white text-purple-700 text-xs font-medium rounded-md shadow-sm">
                <LocationIcon className="h-3 w-3" />
                {filters.ward}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderboardFilters;