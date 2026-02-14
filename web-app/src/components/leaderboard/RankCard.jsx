import Badge from '../common/Badge';
import { getInitials } from '../../utils/helpers';

/* --- SVG Icons --- */
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

const ClipboardListIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
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

const CrownIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

const RankCard = ({ user, rank, isCurrentUser = false, showDetails = true, variant = 'default' }) => {
  
  // Get rank-specific styling
  const getRankStyles = () => {
    if (rank === 1) {
      return {
        container: 'bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border-amber-300',
        medal: 'bg-gradient-to-br from-yellow-400 to-amber-500 shadow-amber-500/40',
        avatar: 'bg-gradient-to-br from-amber-500 to-amber-600 shadow-amber-500/30',
        text: 'text-amber-700',
        points: 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white',
        ring: 'ring-amber-400/30',
        icon: '👑',
        label: 'Champion',
      };
    }
    if (rank === 2) {
      return {
        container: 'bg-gradient-to-r from-gray-50 via-slate-50 to-gray-50 border-gray-300',
        medal: 'bg-gradient-to-br from-gray-300 to-gray-400 shadow-gray-400/40',
        avatar: 'bg-gradient-to-br from-gray-400 to-gray-500 shadow-gray-400/30',
        text: 'text-gray-600',
        points: 'bg-gradient-to-r from-gray-300 to-gray-400 text-white',
        ring: 'ring-gray-400/30',
        icon: '🥈',
        label: 'Runner Up',
      };
    }
    if (rank === 3) {
      return {
        container: 'bg-gradient-to-r from-amber-50/70 via-orange-50/50 to-amber-50/70 border-amber-300/70',
        medal: 'bg-gradient-to-br from-amber-600 to-amber-700 shadow-amber-600/40',
        avatar: 'bg-gradient-to-br from-amber-600 to-amber-700 shadow-amber-600/30',
        text: 'text-amber-700',
        points: 'bg-gradient-to-r from-amber-600 to-amber-700 text-white',
        ring: 'ring-amber-600/30',
        icon: '🥉',
        label: 'Bronze',
      };
    }
    return {
      container: 'bg-white border-gray-100 hover:border-teal-200',
      medal: 'bg-gray-100 text-gray-600',
      avatar: 'bg-gradient-to-br from-teal-500 to-teal-600 shadow-teal-500/30',
      text: 'text-gray-700',
      points: 'bg-teal-50 text-teal-700 border border-teal-200',
      ring: 'ring-teal-500/20',
      icon: null,
      label: null,
    };
  };

  const styles = getRankStyles();

  // Get compliance color
  const getComplianceColor = (rate) => {
    if (rate >= 90) return 'text-green-600 bg-green-50';
    if (rate >= 75) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div 
      className={`
        group relative p-4 sm:p-5 rounded-2xl border-2 
        transition-all duration-300 ease-out
        hover:shadow-xl hover:-translate-y-1
        ${styles.container}
        ${isCurrentUser ? `ring-2 ${styles.ring} shadow-lg` : 'shadow-md shadow-black/5'}
      `}
    >
      {/* Current User Badge */}
      {isCurrentUser && (
        <div className="absolute -top-2.5 -right-2.5 z-10">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-600 text-white text-xs font-bold rounded-full shadow-lg shadow-teal-600/30 animate-pulse">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            You
          </span>
        </div>
      )}

      {/* Top 3 Crown/Label */}
      {rank === 1 && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 hidden sm:block">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs font-bold rounded-full shadow-lg shadow-amber-500/30">
            <CrownIcon />
            Champion
          </span>
        </div>
      )}

      <div className="flex items-center gap-4">
        
        {/* Rank Medal */}
        <div className={`
          relative flex-shrink-0
          w-12 h-12 sm:w-14 sm:h-14 
          rounded-xl flex items-center justify-center
          font-bold text-lg sm:text-xl
          shadow-lg transition-transform duration-300
          group-hover:scale-110
          ${rank <= 3 ? `${styles.medal} text-white` : styles.medal}
        `}>
          {styles.icon ? (
            <span className="text-2xl sm:text-3xl">{styles.icon}</span>
          ) : (
            <span>#{rank}</span>
          )}
          
          {/* Shine effect for top 3 */}
          {rank <= 3 && (
            <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
        </div>

        {/* Avatar */}
        <div className={`
          flex-shrink-0
          w-12 h-12 sm:w-14 sm:h-14 
          rounded-xl overflow-hidden
          flex items-center justify-center
          font-bold text-lg
          shadow-lg
          ${styles.avatar} text-white
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
          <div className="flex items-center gap-2 mb-1 flex-wrap min-w-0">
            <h4 className={`
              font-bold text-base sm:text-lg truncate
              ${isCurrentUser ? 'text-teal-700' : 'text-gray-900'}
            `} title={user.name}>
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
          
          <div className="flex items-center gap-3 text-sm text-gray-500 min-w-0">
            {user.department && (
              <span className="flex items-center gap-1 truncate min-w-0">
                <BuildingIcon className="flex-shrink-0" />
                <span className="truncate">{user.department}</span>
              </span>
            )}
            {user.designation && (
              <span className="hidden sm:block text-gray-400 flex-shrink-0">•</span>
            )}
            {user.designation && (
              <span className="hidden sm:block truncate text-gray-400 min-w-0">
                {user.designation}
              </span>
            )}
          </div>
        </div>

        {/* Stats Section */}
        {showDetails && (
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            
            {/* Points - Always Visible */}
            <div className={`
              flex flex-col items-center justify-center
              px-3 sm:px-4 py-2 rounded-xl
              min-w-[70px] sm:min-w-[80px]
              ${styles.points}
              shadow-lg ${rank <= 3 ? styles.medal.split(' ')[0].replace('bg-', 'shadow-') + '/30' : 'shadow-teal-500/10'}
            `}>
              <div className="flex items-center gap-1">
                <StarIcon />
                <span className="text-lg sm:text-xl font-bold">
                  {user.totalPoints?.toLocaleString() || user.points?.toLocaleString() || 0}
                </span>
              </div>
              <span className={`text-[10px] uppercase tracking-wide ${rank <= 3 ? 'opacity-80' : 'opacity-60'}`}>
                Points
              </span>
            </div>

            {/* Compliance - Hidden on Mobile */}
            {user.complianceRate !== undefined && (
              <div className={`
                hidden md:flex flex-col items-center justify-center
                px-3 py-2 rounded-xl min-w-[70px]
                ${getComplianceColor(user.complianceRate)}
              `}>
                <div className="flex items-center gap-1">
                  <ChartBarIcon />
                  <span className="text-lg font-bold">
                    {user.complianceRate}%
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-wide opacity-60">
                  Compliance
                </span>
              </div>
            )}

            {/* Observations - Hidden on Mobile & Tablet */}
            {user.totalObservations !== undefined && (
              <div className="hidden lg:flex flex-col items-center justify-center px-3 py-2 rounded-xl bg-gray-50 min-w-[70px]">
                <div className="flex items-center gap-1 text-gray-700">
                  <ClipboardListIcon />
                  <span className="text-lg font-bold">
                    {user.totalObservations?.toLocaleString() || 0}
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 uppercase tracking-wide">
                  Observations
                </span>
              </div>
            )}

            {/* Rank Change Indicator */}
            {user.rankChange !== undefined && user.rankChange !== 0 && (
              <div className={`
                hidden sm:flex items-center gap-1 
                px-2 py-1.5 rounded-lg text-sm font-semibold
                ${user.rankChange > 0 
                  ? 'bg-green-50 text-green-600 border border-green-200' 
                  : 'bg-red-50 text-red-600 border border-red-200'
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
        )}
      </div>

      {/* Mobile Stats Row */}
      {showDetails && (
        <div className="flex sm:hidden items-center justify-between mt-4 pt-4 border-t border-gray-100">
          {user.complianceRate !== undefined && (
            <div className={`
              flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium
              ${getComplianceColor(user.complianceRate)}
            `}>
              <ChartBarIcon />
              <span>{user.complianceRate}% Compliance</span>
            </div>
          )}
          
          {user.totalObservations !== undefined && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <ClipboardListIcon />
              <span>{user.totalObservations} observations</span>
            </div>
          )}
        </div>
      )}

      {/* Hover Gradient Border Effect */}
      <div className={`
        absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 
        transition-opacity duration-300 pointer-events-none
        ${rank === 1 ? 'bg-gradient-to-r from-yellow-400/10 via-transparent to-amber-400/10' :
          rank === 2 ? 'bg-gradient-to-r from-gray-300/10 via-transparent to-gray-400/10' :
          rank === 3 ? 'bg-gradient-to-r from-amber-500/10 via-transparent to-amber-600/10' :
          'bg-gradient-to-r from-teal-400/5 via-transparent to-teal-500/5'
        }
      `} />

      {/* Left Border Indicator */}
      <div className={`
        absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl
        transition-all duration-300
        ${rank === 1 ? 'bg-gradient-to-b from-yellow-400 to-amber-500' :
          rank === 2 ? 'bg-gradient-to-b from-gray-300 to-gray-400' :
          rank === 3 ? 'bg-gradient-to-b from-amber-600 to-amber-700' :
          'bg-gradient-to-b from-teal-400 to-teal-500 opacity-0 group-hover:opacity-100'
        }
      `} />
    </div>
  );
};

export default RankCard;