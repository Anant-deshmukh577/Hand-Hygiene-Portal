import { useState, useMemo } from 'react';
import ObservationCard from './ObservationCard';
import Badge from '../common/Badge';

/* --- SVG Icons --- */
const CalendarIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ClipboardListIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const InboxIcon = () => (
  <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
  </svg>
);

const SearchIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const ChevronUpIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircleIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LoaderIcon = () => (
  <svg className="animate-spin h-8 w-8" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const ObservationHistoryList = ({ 
  observations = [], 
  loading = false,
  showFilters = true,
  showStats = true,
  onDelete,
  title = "Observation History"
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedDates, setExpandedDates] = useState({});
  const [viewMode, setViewMode] = useState('detailed'); // 'detailed' or 'compact'

  // Filter observations
  const filteredObservations = useMemo(() => {
    return observations.filter(obs => {
      const matchesSearch = 
        obs.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obs.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        obs.whoMoment?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        filterStatus === 'all' ||
        (filterStatus === 'compliant' && (obs.adherence === 'adherence' || obs.adherence === 'compliant')) ||
        (filterStatus === 'non-compliant' && (obs.adherence === 'non_compliant' || obs.adherence === 'missed'));
      
      return matchesSearch && matchesStatus;
    });
  }, [observations, searchTerm, filterStatus]);

  // Group observations by date
  const groupedByDate = useMemo(() => {
    return filteredObservations.reduce((acc, obs) => {
      const date = new Date(obs.createdAt).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(obs);
      return acc;
    }, {});
  }, [filteredObservations]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = filteredObservations.length;
    const compliant = filteredObservations.filter(o => 
      o.adherence === 'adherence' || o.adherence === 'compliant' || o.adherence === 'hand_rub' || o.adherence === 'hand_wash'
    ).length;
    const complianceRate = total > 0 ? Math.round((compliant / total) * 100) : 0;
    
    return { total, compliant, complianceRate };
  }, [filteredObservations]);

  // Toggle date expansion
  const toggleDate = (date) => {
    setExpandedDates(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  // Check if date is expanded (default to true)
  const isExpanded = (date) => {
    return expandedDates[date] !== false;
  };

  // Format relative date
  const getRelativeDate = (dateStr) => {
    const date = new Date(dateStr.split(',').pop()?.trim() || dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return null;
  };

  // Loading State
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 p-12">
        <div className="flex flex-col items-center justify-center">
          <div className="text-teal-600 mb-4">
            <LoaderIcon />
          </div>
          <p className="text-gray-500 font-medium">Loading observations...</p>
        </div>
      </div>
    );
  }

  // Empty State
  if (!observations || observations.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 rounded-3xl bg-gray-100 flex items-center justify-center mb-6">
            <InboxIcon className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Observations Yet</h3>
          <p className="text-gray-500 max-w-md mb-6">
            Start recording hand hygiene observations to see them appear here. 
            Your observation history will be organized by date.
          </p>
          <a 
            href="/observation-entry"
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-lg shadow-teal-600/25 transition-all duration-300"
          >
            <ClipboardListIcon className="h-5 w-5" />
            Record First Observation
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* ==================== HEADER & FILTERS ==================== */}
      {showFilters && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 p-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Title & Stats */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/30">
                <ClipboardListIcon />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                <p className="text-sm text-gray-500">
                  {filteredObservations.length} observation{filteredObservations.length !== 1 ? 's' : ''} recorded
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  placeholder="Search observations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="
                    w-full sm:w-64 pl-10 pr-4 py-2.5
                    bg-gray-50 border border-gray-200 rounded-xl
                    text-gray-900 placeholder:text-gray-400
                    focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white
                    transition-all duration-200
                  "
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FilterIcon />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="
                    w-full sm:w-48 pl-10 pr-10 py-2.5
                    bg-gray-50 border border-gray-200 rounded-xl
                    text-gray-900
                    focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white
                    transition-all duration-200
                    appearance-none cursor-pointer
                  "
                >
                  <option value="all">All Status</option>
                  <option value="compliant">Compliant Only</option>
                  <option value="non-compliant">Non-Compliant Only</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                  <ChevronDownIcon />
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('detailed')}
                  className={`
                    px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                    ${viewMode === 'detailed' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                    }
                  `}
                >
                  Detailed
                </button>
                <button
                  onClick={() => setViewMode('compact')}
                  className={`
                    px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                    ${viewMode === 'compact' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                    }
                  `}
                >
                  Compact
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          {showStats && (
            <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-gray-100">
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <p className="text-2xl font-bold text-teal-600">{stats.total}</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <p className="text-2xl font-bold text-green-600">{stats.compliant}</p>
                <p className="text-xs text-gray-500">Compliant</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-center gap-1">
                  <p className={`text-2xl font-bold ${stats.complianceRate >= 90 ? 'text-green-600' : stats.complianceRate >= 75 ? 'text-amber-600' : 'text-red-600'}`}>
                    {stats.complianceRate}%
                  </p>
                  <TrendingUpIcon className={stats.complianceRate >= 75 ? 'text-green-500' : 'text-red-500'} />
                </div>
                <p className="text-xs text-gray-500">Compliance Rate</p>
              </div>
            </div>
          )}

          {/* Active Filters */}
          {(searchTerm || filterStatus !== 'all') && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">Filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-teal-50 text-teal-700 text-sm font-medium rounded-lg">
                  "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="ml-1 hover:text-teal-900">
                    <XCircleIcon />
                  </button>
                </span>
              )}
              {filterStatus !== 'all' && (
                <span className={`
                  inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium rounded-lg
                  ${filterStatus === 'compliant' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}
                `}>
                  {filterStatus === 'compliant' ? <CheckCircleIcon /> : <XCircleIcon />}
                  {filterStatus}
                  <button onClick={() => setFilterStatus('all')} className="ml-1 hover:opacity-70">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              <button
                onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==================== NO RESULTS ==================== */}
      {filteredObservations.length === 0 && observations.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <SearchIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h4>
            <p className="text-gray-500 max-w-md">
              No observations match your current filters. Try adjusting your search or filter criteria.
            </p>
            <button
              onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}
              className="mt-4 text-teal-600 hover:text-teal-700 font-medium hover:underline"
            >
              Clear filters
            </button>
          </div>
        </div>
      )}

      {/* ==================== GROUPED OBSERVATIONS ==================== */}
      <div className="space-y-6">
        {Object.entries(groupedByDate).map(([date, dateObservations]) => {
          const relativeDate = getRelativeDate(date);
          const expanded = isExpanded(date);
          
          return (
            <div 
              key={date} 
              className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 overflow-hidden"
            >
              {/* Date Header */}
              <button
                onClick={() => toggleDate(date)}
                className="
                  w-full px-6 py-4 
                  flex items-center justify-between
                  bg-gradient-to-r from-gray-50 to-white
                  border-b border-gray-100
                  hover:from-gray-100 hover:to-gray-50
                  transition-colors duration-200
                "
              >
                <div className="flex items-center gap-4">
                  {/* Calendar Icon */}
                  <div className={`
                    w-12 h-12 rounded-xl flex flex-col items-center justify-center
                    ${relativeDate === 'Today' 
                      ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/30' 
                      : relativeDate === 'Yesterday'
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-gray-100 text-gray-600'
                    }
                  `}>
                    <CalendarIcon className="h-5 w-5" />
                  </div>
                  
                  {/* Date Text */}
                  <div className="text-left">
                    {relativeDate && (
                      <Badge variant={relativeDate === 'Today' ? 'primary' : 'secondary'} size="small">
                        {relativeDate}
                      </Badge>
                    )}
                    <h3 className="text-base font-bold text-gray-900 mt-1">{date}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Count Badge */}
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-3 py-1 bg-teal-50 text-teal-700 text-sm font-bold rounded-lg">
                      {dateObservations.length}
                    </span>
                    <span className="text-sm text-gray-500 hidden sm:block">
                      observation{dateObservations.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  {/* Expand/Collapse Icon */}
                  <div className={`
                    w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center
                    transition-transform duration-200
                    ${expanded ? '' : '-rotate-180'}
                  `}>
                    <ChevronUpIcon className="text-gray-500" />
                  </div>
                </div>
              </button>

              {/* Observations List */}
              <div className={`
                transition-all duration-300 ease-in-out overflow-hidden
                ${expanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}
              `}>
                <div className="p-4 sm:p-6 space-y-4">
                  {dateObservations.map((observation, index) => (
                    <ObservationCard
                      key={observation.id || observation._id || index}
                      observation={observation}
                      index={index}
                      onDelete={onDelete}
                      variant={viewMode}
                    />
                  ))}
                </div>

                {/* Date Summary Footer */}
                <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      {dateObservations.filter(o => 
                        o.adherence === 'adherence' || o.adherence === 'compliant'
                      ).length} compliant of {dateObservations.length} total
                    </span>
                    <span>
                      {Math.round(
                        (dateObservations.filter(o => 
                          o.adherence === 'adherence' || o.adherence === 'compliant'
                        ).length / dateObservations.length) * 100
                      )}% compliance rate
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ==================== LOAD MORE (Optional) ==================== */}
      {Object.keys(groupedByDate).length > 0 && (
        <div className="text-center pt-4">
          <p className="text-sm text-gray-500">
            Showing {filteredObservations.length} observations across {Object.keys(groupedByDate).length} day{Object.keys(groupedByDate).length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default ObservationHistoryList;