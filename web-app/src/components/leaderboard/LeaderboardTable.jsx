import { useState } from 'react';
import Badge from '../common/Badge';

/* --- SVG Icons --- */
const TrophyIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const StarIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const ChartBarIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const UserIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const TrendingDownIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
  </svg>
);

const InboxIcon = () => (
  <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
  </svg>
);

const LoaderIcon = () => (
  <svg className="animate-spin h-8 w-8" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

// Helper function to get initials
const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

// Helper function to get rank styling
const getRankStyle = (rank) => {
  if (rank === 1) {
    return {
      medal: 'bg-gradient-to-br from-yellow-400 to-amber-500',
      bg: 'bg-gradient-to-r from-amber-50 to-white',
      border: 'border-amber-200',
      text: 'text-amber-600',
      shadow: 'shadow-amber-500/20',
      ring: 'ring-amber-500/20',
    };
  }
  if (rank === 2) {
    return {
      medal: 'bg-gradient-to-br from-gray-300 to-gray-400',
      bg: 'bg-gradient-to-r from-gray-50 to-white',
      border: 'border-gray-200',
      text: 'text-gray-600',
      shadow: 'shadow-gray-400/20',
      ring: 'ring-gray-400/20',
    };
  }
  if (rank === 3) {
    return {
      medal: 'bg-gradient-to-br from-amber-600 to-amber-700',
      bg: 'bg-gradient-to-r from-amber-50/50 to-white',
      border: 'border-amber-200/50',
      text: 'text-amber-700',
      shadow: 'shadow-amber-600/20',
      ring: 'ring-amber-600/20',
    };
  }
  return {
    medal: 'bg-gray-100',
    bg: 'bg-white',
    border: 'border-gray-100',
    text: 'text-gray-500',
    shadow: 'shadow-black/5',
    ring: 'ring-gray-200',
  };
};

// RankCard Component (inline styled)
const RankCard = ({ user, rank, isCurrentUser }) => {
  const styles = getRankStyle(rank);
  
  return (
    <div 
      className={`
        group relative p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all duration-300
        hover:shadow-xl hover:-translate-y-0.5
        ${styles.bg} ${styles.border}
        ${isCurrentUser ? `ring-2 ${styles.ring} shadow-lg` : 'shadow-md'}
      `}
    >
      {/* Current User Indicator */}
      {isCurrentUser && (
        <div className="absolute -top-2 -right-2 z-10">
          <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 sm:py-1 bg-teal-600 text-white text-[10px] sm:text-xs font-bold rounded-full shadow-lg shadow-teal-600/30">
            You
          </span>
        </div>
      )}

      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        {/* Rank Medal */}
        <div className={`
          w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center
          ${styles.medal} text-white font-bold text-base sm:text-lg
          shadow-lg ${styles.shadow}
          group-hover:scale-110 transition-transform duration-300
          flex-shrink-0
        `}>
          {rank <= 3 ? (
            <span>{rank}</span>
          ) : (
            <span className="text-gray-600">{rank}</span>
          )}
        </div>

        {/* Avatar */}
        <div className={`
          w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl overflow-hidden
          flex items-center justify-center
          shadow-lg ${styles.shadow}
          ${rank === 1 ? 'bg-gradient-to-br from-amber-500 to-amber-600' :
            rank === 2 ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
            rank === 3 ? 'bg-gradient-to-br from-amber-600 to-amber-700' :
            'bg-gradient-to-br from-teal-500 to-teal-600'}
          text-white font-bold text-sm sm:text-base
          flex-shrink-0
        `}>
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span>{getInitials(user.name)}</span>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1 flex-wrap min-w-0">
            <h4 className={`font-bold text-sm sm:text-base truncate ${isCurrentUser ? 'text-teal-700' : 'text-gray-900'}`} title={user.name}>
              {user.name}
            </h4>
            {rank <= 3 && (
              <Badge 
                variant={rank === 1 ? 'warning' : rank === 2 ? 'secondary' : 'primary'} 
                size="small"
              >
                #{rank}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 min-w-0">
            {user.department && (
              <span className="flex items-center gap-1 truncate min-w-0">
                <BuildingIcon className="flex-shrink-0" />
                <span className="truncate">{user.department}</span>
              </span>
            )}
            {user.designation && (
              <span className="hidden sm:block truncate min-w-0">
                {user.designation}
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
          {/* Compliance Rate */}
          {user.complianceRate !== undefined && (
            <div className="hidden md:flex flex-col items-center px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-50 rounded-lg sm:rounded-xl">
              <div className="flex items-center gap-1">
                <ChartBarIcon className="text-gray-400" />
                <span className={`text-xs sm:text-sm font-bold ${
                  user.complianceRate >= 90 ? 'text-green-600' :
                  user.complianceRate >= 75 ? 'text-amber-600' : 'text-red-600'
                }`}>
                  {user.complianceRate}%
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] text-gray-400 uppercase">Compliance</span>
            </div>
          )}

          {/* Points */}
          <div className={`
            flex flex-col items-center px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl
            ${rank <= 3 ? `${styles.medal}` : 'bg-teal-50 border border-teal-200'}
          `}>
            <div className="flex items-center gap-0.5 sm:gap-1">
              <StarIcon className={rank <= 3 ? 'text-white' : 'text-teal-600'} />
              <span className={`text-base sm:text-lg font-bold ${rank <= 3 ? 'text-white' : 'text-teal-700'}`}>
                {user.totalPoints?.toLocaleString() || user.points?.toLocaleString() || 0}
              </span>
            </div>
            <span className={`text-[9px] sm:text-[10px] uppercase ${rank <= 3 ? 'text-white/80' : 'text-teal-600/70'}`}>
              Points
            </span>
          </div>

          {/* Rank Change Indicator */}
          {user.rankChange !== undefined && user.rankChange !== 0 && (
            <div className={`
              hidden sm:flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-lg text-xs sm:text-sm font-medium
              ${user.rankChange > 0 
                ? 'bg-green-50 text-green-600' 
                : 'bg-red-50 text-red-600'
              }
            `}>
              {user.rankChange > 0 ? (
                <>
                  <TrendingUpIcon />
                  <span>+{user.rankChange}</span>
                </>
              ) : (
                <>
                  <TrendingDownIcon />
                  <span>{user.rankChange}</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Stats Row - Show compliance on mobile */}
      {user.complianceRate !== undefined && (
        <div className="flex md:hidden items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className={`
            flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium
            ${user.complianceRate >= 90 ? 'bg-green-50 text-green-600' :
              user.complianceRate >= 75 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}
          `}>
            <ChartBarIcon />
            <span>{user.complianceRate}% Compliance</span>
          </div>
          
          {user.totalObservations !== undefined && (
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>{user.totalObservations}</span>
            </div>
          )}
        </div>
      )}

      {/* Progress bar for top 10 */}
      {rank <= 10 && user.totalPoints > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{user.totalPoints?.toLocaleString()} pts</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-amber-500' :
                rank === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-400' :
                rank === 3 ? 'bg-gradient-to-r from-amber-600 to-amber-700' :
                'bg-gradient-to-r from-teal-400 to-teal-500'
              }`}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const LeaderboardTable = ({ users = [], currentUserId, loading, title = "Rankings" }) => {
  const [showAll, setShowAll] = useState(false);
  
  const displayedUsers = showAll ? users : users.slice(0, 10);
  const hasMore = users.length > 10;

  // Loading State
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 p-12">
        <div className="flex flex-col items-center justify-center">
          <div className="text-teal-600 mb-4">
            <LoaderIcon />
          </div>
          <p className="text-gray-500 font-medium">Loading rankings...</p>
        </div>
      </div>
    );
  }

  // Empty State
  if (users.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
            <InboxIcon className="text-gray-400" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">No Rankings Yet</h4>
          <p className="text-gray-500 max-w-sm">
            Leaderboard data will appear here once users start earning points through hand hygiene compliance.
          </p>
        </div>
      </div>
    );
  }

  // Find current user's rank
  const currentUserRank = users.findIndex(u => u.id === currentUserId || u._id === currentUserId) + 1;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 overflow-hidden">
      
      {/* ==================== HEADER ==================== */}
      <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
              <TrophyIcon />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">
                {users.length} participant{users.length !== 1 ? 's' : ''} ranked
              </p>
            </div>
          </div>

          {/* Current User Quick View */}
          {currentUserRank > 0 && (
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-teal-50 rounded-xl border border-teal-200">
              <span className="text-sm text-teal-700">Your Rank:</span>
              <span className="text-lg font-bold text-teal-700">#{currentUserRank}</span>
            </div>
          )}
        </div>
      </div>

      {/* ==================== TOP 3 HIGHLIGHT ==================== */}
      {users.length >= 3 && (
        <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-6 bg-gradient-to-b from-amber-50/30 to-white border-b border-gray-100">
          <div className="flex items-end justify-center gap-1.5 sm:gap-2 md:gap-4">
            {/* 2nd Place */}
            <div className="flex flex-col items-center opacity-90 hover:opacity-100 transition-opacity">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white shadow-lg shadow-gray-400/30 mb-1.5 sm:mb-2 overflow-hidden">
                {users[1]?.avatar ? (
                  <img src={users[1].avatar} alt={users[1].name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold text-xs sm:text-sm md:text-base lg:text-lg">{getInitials(users[1]?.name)}</span>
                )}
              </div>
              <p className="text-[9px] sm:text-[10px] md:text-xs font-bold text-gray-600 truncate max-w-[50px] sm:max-w-[60px] md:max-w-[80px] text-center" title={users[1]?.name}>{users[1]?.name}</p>
              <div className="bg-gray-300 text-white text-[9px] sm:text-[10px] md:text-xs font-bold px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full mt-0.5 sm:mt-1">
                {users[1]?.totalPoints || users[1]?.points || 0} pts
              </div>
              <div className="bg-gray-400 w-10 sm:w-12 md:w-16 h-8 sm:h-10 md:h-12 rounded-lg mt-1 sm:mt-2 flex items-center justify-center">
                <span className="text-base sm:text-lg md:text-xl font-bold text-white">2</span>
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center -mt-2 sm:-mt-4">
              <div className="relative">
                <div className="absolute -top-2 sm:-top-3 md:-top-4 left-1/2 -translate-x-1/2">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                </div>
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-white shadow-xl shadow-amber-500/40 mb-1.5 sm:mb-2 overflow-hidden">
                  {users[0]?.avatar ? (
                    <img src={users[0].avatar} alt={users[0].name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-bold text-base sm:text-lg md:text-xl">{getInitials(users[0]?.name)}</span>
                  )}
                </div>
              </div>
              <p className="text-[10px] sm:text-xs md:text-sm font-bold text-amber-700 truncate max-w-[60px] sm:max-w-[70px] md:max-w-[100px] text-center" title={users[0]?.name}>{users[0]?.name}</p>
              <div className="bg-amber-500 text-white text-[10px] sm:text-xs md:text-sm font-bold px-2 sm:px-3 md:px-4 py-0.5 sm:py-1 md:py-1.5 rounded-full mt-0.5 sm:mt-1 shadow-lg shadow-amber-500/30">
                {users[0]?.totalPoints || users[0]?.points || 0} pts
              </div>
              <div className="bg-amber-500 w-14 sm:w-16 md:w-20 h-10 sm:h-12 md:h-16 rounded-lg mt-1 sm:mt-2 flex items-center justify-center shadow-lg shadow-amber-500/30">
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-white">1</span>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center opacity-90 hover:opacity-100 transition-opacity">
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-lg sm:rounded-xl md:rounded-2xl bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white shadow-lg shadow-amber-700/30 mb-1.5 sm:mb-2 overflow-hidden">
                {users[2]?.avatar ? (
                  <img src={users[2].avatar} alt={users[2].name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold text-xs sm:text-sm md:text-base lg:text-lg">{getInitials(users[2]?.name)}</span>
                )}
              </div>
              <p className="text-[9px] sm:text-[10px] md:text-xs font-bold text-amber-700 truncate max-w-[50px] sm:max-w-[60px] md:max-w-[80px] text-center" title={users[2]?.name}>{users[2]?.name}</p>
              <div className="bg-amber-700 text-white text-[9px] sm:text-[10px] md:text-xs font-bold px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full mt-0.5 sm:mt-1">
                {users[2]?.totalPoints || users[2]?.points || 0} pts
              </div>
              <div className="bg-amber-700 w-10 sm:w-12 md:w-16 h-6 sm:h-8 md:h-10 rounded-lg mt-1 sm:mt-2 flex items-center justify-center">
                <span className="text-base sm:text-lg md:text-xl font-bold text-white">3</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== RANKINGS LIST ==================== */}
      <div className="p-3 sm:p-4 md:p-6">
        <div className="space-y-2 sm:space-y-3">
          {displayedUsers.map((user, index) => (
            <RankCard
              key={user.id || user._id || index}
              user={user}
              rank={index + 1}
              isCurrentUser={user.id === currentUserId || user._id === currentUserId}
            />
          ))}
        </div>

        {/* Show More Button */}
        {hasMore && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="
                inline-flex items-center gap-2 px-6 py-3
                bg-gray-50 hover:bg-gray-100
                text-gray-700 font-medium
                rounded-xl border border-gray-200
                transition-all duration-200
              "
            >
              {showAll ? (
                <>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  Show Less
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  Show All ({users.length - 10} more)
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* ==================== FOOTER ==================== */}
      <div className="px-6 py-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500"></div>
              <span>Gold</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-gray-300 to-gray-400"></div>
              <span>Silver</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-600 to-amber-700"></div>
              <span>Bronze</span>
            </div>
          </div>
          
          <p>
            Updated just now
          </p>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardTable;