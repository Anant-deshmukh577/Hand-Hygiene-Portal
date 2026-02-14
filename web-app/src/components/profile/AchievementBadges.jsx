import Badge from '../common/Badge';

/* --- SVG Icons --- */
const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const AchievementBadges = ({ badges = [] }) => {
  const allBadges = [
    { 
      id: 'bronze', 
      name: 'Bronze Badge', 
      emoji: '🥉', 
      threshold: 50,
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-400',
      textColor: 'text-amber-700',
      ringColor: 'ring-amber-400/30',
      shadowColor: 'shadow-amber-500/20',
    },
    { 
      id: 'silver', 
      name: 'Silver Badge', 
      emoji: '🥈', 
      threshold: 100,
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-400',
      textColor: 'text-gray-700',
      ringColor: 'ring-gray-400/30',
      shadowColor: 'shadow-gray-500/20',
    },
    { 
      id: 'gold', 
      name: 'Gold Badge', 
      emoji: '🥇', 
      threshold: 200,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-700',
      ringColor: 'ring-yellow-400/30',
      shadowColor: 'shadow-yellow-500/20',
    },
    { 
      id: 'platinum', 
      name: 'Platinum Badge', 
      emoji: '💎', 
      threshold: 500,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-400',
      textColor: 'text-purple-700',
      ringColor: 'ring-purple-400/30',
      shadowColor: 'shadow-purple-500/20',
    },
  ];

  const earnedBadgeIds = badges.map(b => b.id);

  // Calculate progress
  const totalEarned = earnedBadgeIds.length;
  const totalBadges = allBadges.length;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/8 overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <TrophyIcon className="text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Achievement Badges
              </h3>
              <p className="text-sm text-gray-500">
                Unlock badges by earning points
              </p>
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600">
              {totalEarned}/{totalBadges} Earned
            </span>
            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full transition-all duration-500"
                style={{ width: `${(totalEarned / totalBadges) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="p-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6">
          {allBadges.map((badge) => {
            const isEarned = earnedBadgeIds.includes(badge.id);
            
            return (
              <div
                key={badge.id}
                className={`
                  group relative p-5 sm:p-6 rounded-2xl text-center
                  border-2 transition-all duration-300
                  ${isEarned 
                    ? `${badge.bgColor} ${badge.borderColor} shadow-lg ${badge.shadowColor} hover:shadow-xl hover:-translate-y-1` 
                    : 'bg-gray-50/50 border-gray-200 opacity-60 hover:opacity-80'
                  }
                `}
              >
                {/* Earned indicator ring */}
                {isEarned && (
                  <div className={`absolute inset-0 rounded-2xl ring-4 ${badge.ringColor} pointer-events-none`} />
                )}

                {/* Emoji */}
                <div className={`
                  text-4xl sm:text-5xl mb-3 sm:mb-4
                  transition-transform duration-300
                  ${isEarned ? 'group-hover:scale-110' : 'grayscale'}
                `}>
                  {badge.emoji}
                </div>

                {/* Badge Name */}
                <h4 className={`
                  font-semibold text-sm sm:text-base mb-1 truncate px-1
                  ${isEarned ? badge.textColor : 'text-gray-500'}
                `} title={badge.name}>
                  {badge.name}
                </h4>

                {/* Threshold */}
                <p className="text-xs sm:text-sm text-gray-500 mb-3">
                  {badge.threshold} points required
                </p>

                {/* Status Badge */}
                {isEarned ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                    <CheckIcon />
                    Earned
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-500 text-xs font-semibold rounded-full">
                    <LockIcon />
                    Locked
                  </span>
                )}

                {/* Shine effect for earned badges */}
                {isEarned && (
                  <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer - Motivational message */}
      <div className="px-6 pb-6">
        <div className="p-4 bg-gradient-to-r from-teal-50 to-green-50 rounded-xl border border-teal-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
              <svg className="h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="text-sm text-gray-700">
              {totalEarned === totalBadges 
                ? '🎉 Congratulations! You\'ve earned all badges!' 
                : totalEarned > 0 
                  ? `Keep going! You're ${allBadges.find(b => !earnedBadgeIds.includes(b.id))?.threshold || 0} points away from your next badge.`
                  : 'Start earning points to unlock your first badge!'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementBadges;