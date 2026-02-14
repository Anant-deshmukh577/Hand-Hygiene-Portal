import { useState } from 'react';
import Badge from '../common/Badge';

/* --- SVG Icons --- */
const TrophyIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const UsersIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const StarIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const ChartBarIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const InboxIcon = () => (
  <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
  </svg>
);

// Medal icons for top 3
const GoldMedalIcon = () => (
  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
    <span className="text-white font-bold text-sm">1</span>
  </div>
);

const SilverMedalIcon = () => (
  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center shadow-lg shadow-gray-400/30">
    <span className="text-white font-bold text-sm">2</span>
  </div>
);

const BronzeMedalIcon = () => (
  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-700/30">
    <span className="text-white font-bold text-sm">3</span>
  </div>
);

const DepartmentRanking = ({ departments = [], title = "Department Rankings", showHeader = true }) => {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  // Empty State
  if (departments.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <InboxIcon className="text-gray-400" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-1">No Department Data</h4>
          <p className="text-gray-500 max-w-sm">
            Department rankings will appear here once data is available.
          </p>
        </div>
      </div>
    );
  }

  const sortedDepartments = [...departments].sort((a, b) => b.averagePoints - a.averagePoints);
  const maxPoints = Math.max(...sortedDepartments.map(d => d.averagePoints || 0));

  // Get rank styling
  const getRankStyle = (index) => {
    if (index === 0) {
      return {
        badge: 'bg-gradient-to-r from-yellow-400 to-amber-500',
        text: 'text-amber-600',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        progress: 'from-yellow-400 to-amber-500',
        shadow: 'shadow-amber-500/20',
      };
    }
    if (index === 1) {
      return {
        badge: 'bg-gradient-to-r from-gray-300 to-gray-400',
        text: 'text-gray-600',
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        progress: 'from-gray-300 to-gray-400',
        shadow: 'shadow-gray-400/20',
      };
    }
    if (index === 2) {
      return {
        badge: 'bg-gradient-to-r from-amber-600 to-amber-700',
        text: 'text-amber-700',
        bg: 'bg-amber-50/50',
        border: 'border-amber-200/50',
        progress: 'from-amber-600 to-amber-700',
        shadow: 'shadow-amber-600/20',
      };
    }
    return {
      badge: 'bg-gray-200',
      text: 'text-gray-500',
      bg: 'bg-white',
      border: 'border-gray-100',
      progress: 'from-teal-400 to-teal-500',
      shadow: 'shadow-teal-500/10',
    };
  };

  // Get medal component
  const getMedal = (index) => {
    if (index === 0) return <GoldMedalIcon />;
    if (index === 1) return <SilverMedalIcon />;
    if (index === 2) return <BronzeMedalIcon />;
    return (
      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
        <span className="text-gray-500 font-bold text-sm">{index + 1}</span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 overflow-hidden">
      
      {/* ==================== HEADER ==================== */}
      {showHeader && (
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
                <TrophyIcon />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500">Ranked by average points per staff</p>
              </div>
            </div>
            
            {/* View Toggle */}
            <div className="hidden sm:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`
                  px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                  ${viewMode === 'list' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`
                  px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200
                  ${viewMode === 'grid' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                Cards
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TOP 3 PODIUM (Optional Visual) ==================== */}
      {sortedDepartments.length >= 3 && (
        <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-6 bg-gradient-to-b from-amber-50/50 to-white border-b border-gray-100">
          <div className="flex items-end justify-center gap-1.5 sm:gap-2 md:gap-4">
            {/* 2nd Place */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white shadow-lg shadow-gray-400/30 mb-1.5 sm:mb-2">
                <BuildingIcon className="h-6 w-6 sm:h-7 sm:h-7 md:h-8 md:w-8" />
              </div>
              <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-lg px-1.5 sm:px-2 py-2 sm:py-3 w-20 sm:w-24 text-center overflow-hidden">
                <p className="text-[10px] sm:text-xs font-bold text-gray-600 truncate px-0.5 sm:px-1" title={sortedDepartments[1]?.name}>{sortedDepartments[1]?.name}</p>
                <p className="text-base sm:text-lg font-bold text-gray-700">{sortedDepartments[1]?.averagePoints?.toFixed(1)}</p>
                <p className="text-[9px] sm:text-[10px] text-gray-500">points</p>
              </div>
              <div className="bg-gray-300 w-20 sm:w-24 h-12 sm:h-16 rounded-b-lg flex items-center justify-center">
                <span className="text-xl sm:text-2xl font-bold text-white">2</span>
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center -mt-2 sm:-mt-4">
              <div className="relative">
                <div className="absolute -top-2 sm:-top-3 left-1/2 -translate-x-1/2">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </div>
                <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white shadow-xl shadow-amber-500/40 mb-1.5 sm:mb-2">
                  <BuildingIcon className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10" />
                </div>
              </div>
              <div className="bg-gradient-to-br from-amber-400 to-amber-500 rounded-t-lg px-1.5 sm:px-2 py-2 sm:py-3 w-24 sm:w-28 text-center overflow-hidden">
                <p className="text-[10px] sm:text-xs font-bold text-amber-900 truncate px-0.5 sm:px-1" title={sortedDepartments[0]?.name}>{sortedDepartments[0]?.name}</p>
                <p className="text-lg sm:text-xl font-bold text-white">{sortedDepartments[0]?.averagePoints?.toFixed(1)}</p>
                <p className="text-[9px] sm:text-[10px] text-amber-100">points</p>
              </div>
              <div className="bg-amber-500 w-24 sm:w-28 h-16 sm:h-20 rounded-b-lg flex items-center justify-center">
                <span className="text-2xl sm:text-3xl font-bold text-white">1</span>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white shadow-lg shadow-amber-700/30 mb-1.5 sm:mb-2">
                <BuildingIcon className="h-6 w-6 sm:h-7 sm:h-7 md:h-8 md:w-8" />
              </div>
              <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-t-lg px-1.5 sm:px-2 py-2 sm:py-3 w-20 sm:w-24 text-center overflow-hidden">
                <p className="text-[10px] sm:text-xs font-bold text-amber-100 truncate px-0.5 sm:px-1" title={sortedDepartments[2]?.name}>{sortedDepartments[2]?.name}</p>
                <p className="text-base sm:text-lg font-bold text-white">{sortedDepartments[2]?.averagePoints?.toFixed(1)}</p>
                <p className="text-[9px] sm:text-[10px] text-amber-200">points</p>
              </div>
              <div className="bg-amber-700 w-20 sm:w-24 h-10 sm:h-12 rounded-b-lg flex items-center justify-center">
                <span className="text-xl sm:text-2xl font-bold text-white">3</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== LIST VIEW ==================== */}
      {viewMode === 'list' && (
        <div className="p-3 sm:p-4 md:p-6">
          <div className="space-y-3 sm:space-y-4">
            {sortedDepartments.map((dept, index) => {
              const styles = getRankStyle(index);
              const progressPercentage = maxPoints > 0 ? (dept.averagePoints / maxPoints) * 100 : 0;

              return (
                <div 
                  key={dept.name || dept._id || index}
                  className={`
                    group relative p-3 sm:p-4 rounded-xl border transition-all duration-300
                    hover:shadow-lg hover:-translate-y-0.5
                    ${styles.bg} ${styles.border}
                  `}
                >
                  <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                    {/* Rank Medal */}
                    {getMedal(index)}

                    {/* Department Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <h4 className="font-semibold text-sm sm:text-base text-gray-900 truncate" title={dept.name}>
                            {dept.name}
                          </h4>
                          {index < 3 && (
                            <Badge 
                              variant={index === 0 ? 'warning' : index === 1 ? 'secondary' : 'primary'} 
                              size="small"
                            >
                              Top {index + 1}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
                          {/* Staff Count */}
                          <div className="hidden sm:flex items-center gap-1 sm:gap-1.5 text-gray-500 whitespace-nowrap">
                            <UsersIcon />
                            <span className="text-xs sm:text-sm">{dept.totalStaff || 0} staff</span>
                          </div>
                          
                          {/* Points */}
                          <div className={`flex items-center gap-1 ${styles.text} font-bold whitespace-nowrap`}>
                            <StarIcon />
                            <span className="text-base sm:text-lg">{dept.averagePoints?.toFixed(1) || 0}</span>
                            <span className="text-[10px] sm:text-xs font-medium opacity-70">pts</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="relative h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${styles.progress} rounded-full transition-all duration-500 ease-out`}
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>

                      {/* Additional Stats (Mobile) */}
                      <div className="flex sm:hidden items-center gap-3 sm:gap-4 mt-2 text-[11px] sm:text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <UsersIcon />
                          {dept.totalStaff || 0} staff
                        </span>
                        {dept.complianceRate && (
                          <span className="flex items-center gap-1">
                            <TrendingUpIcon />
                            {dept.complianceRate}% compliance
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Hover Indicator */}
                  <div className={`
                    absolute left-0 top-0 bottom-0 w-1 rounded-l-xl 
                    bg-gradient-to-b ${styles.progress}
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300
                  `} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================== GRID VIEW ==================== */}
      {viewMode === 'grid' && (
        <div className="p-3 sm:p-4 md:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {sortedDepartments.map((dept, index) => {
              const styles = getRankStyle(index);
              const progressPercentage = maxPoints > 0 ? (dept.averagePoints / maxPoints) * 100 : 0;

              return (
                <div 
                  key={dept.name || dept._id || index}
                  className={`
                    group relative rounded-xl sm:rounded-2xl border overflow-hidden
                    transition-all duration-300
                    hover:shadow-xl hover:-translate-y-1
                    ${styles.bg} ${styles.border}
                  `}
                >
                  {/* Gradient Header */}
                  <div className={`h-1.5 sm:h-2 bg-gradient-to-r ${styles.progress}`} />

                  <div className="p-4 sm:p-5">
                    {/* Rank & Medal */}
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      {getMedal(index)}
                      <div className={`
                        px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-bold
                        ${index < 3 ? `bg-gradient-to-r ${styles.progress} text-white` : 'bg-gray-100 text-gray-600'}
                      `}>
                        #{index + 1}
                      </div>
                    </div>

                    {/* Department Name */}
                    <h4 className="font-bold text-gray-900 text-base sm:text-lg mb-1 truncate" title={dept.name}>
                      {dept.name}
                    </h4>

                    {/* Stats */}
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-500">
                        <UsersIcon />
                        <span>{dept.totalStaff || 0}</span>
                      </div>
                      {dept.complianceRate && (
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-green-600">
                          <TrendingUpIcon />
                          <span>{dept.complianceRate}%</span>
                        </div>
                      )}
                    </div>

                    {/* Points */}
                    <div className={`
                      p-2.5 sm:p-3 rounded-lg sm:rounded-xl text-center
                      ${index < 3 ? `bg-gradient-to-r ${styles.progress}` : 'bg-gray-100'}
                    `}>
                      <p className={`text-xl sm:text-2xl font-bold ${index < 3 ? 'text-white' : 'text-gray-700'}`}>
                        {dept.averagePoints?.toFixed(1) || 0}
                      </p>
                      <p className={`text-[10px] sm:text-xs ${index < 3 ? 'text-white/80' : 'text-gray-500'}`}>
                        avg. points
                      </p>
                    </div>

                    {/* Progress Indicator */}
                    <div className="mt-3 sm:mt-4">
                      <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500 mb-1">
                        <span>Progress to #1</span>
                        <span>{progressPercentage.toFixed(0)}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${styles.progress} rounded-full transition-all duration-500`}
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================== FOOTER STATS ==================== */}
      <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600">
                <BuildingIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-gray-900">{departments.length}</p>
                <p className="text-[10px] sm:text-xs text-gray-500">Departments</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                <StarIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-gray-900">
                  {(departments.reduce((sum, d) => sum + (d.averagePoints || 0), 0) / departments.length).toFixed(1)}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500">Avg. Points</p>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center gap-1.5 sm:gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <UsersIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-gray-900">
                  {departments.reduce((sum, d) => sum + (d.totalStaff || 0), 0)}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-500">Total Staff</p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1 sm:gap-1.5">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500"></div>
              <span className="text-[10px] sm:text-xs text-gray-500">Gold</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-gray-300 to-gray-400"></div>
              <span className="text-[10px] sm:text-xs text-gray-500">Silver</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gradient-to-r from-amber-600 to-amber-700"></div>
              <span className="text-[10px] sm:text-xs text-gray-500">Bronze</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentRanking;