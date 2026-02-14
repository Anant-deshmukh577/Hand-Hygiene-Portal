import { formatDateTime } from '../../utils/helpers';
import Badge from '../common/Badge';

/* --- SVG Icons --- */
const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const TrendUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const TrendDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
  </svg>
);

const ClipboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const GiftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const EmptyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const PointsHistory = ({ history = [], showSummary = true }) => {
  
  // Point source configurations
  const sourceConfig = {
    observation: {
      icon: <ClipboardIcon />,
      bgColor: 'bg-teal-100',
      iconColor: 'text-teal-600',
      label: 'Observation',
    },
    badge: {
      icon: <TrophyIcon />,
      bgColor: 'bg-amber-100',
      iconColor: 'text-amber-600',
      label: 'Badge Earned',
    },
    reward: {
      icon: <GiftIcon />,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      label: 'Reward Redeemed',
    },
    bonus: {
      icon: <SparklesIcon />,
      bgColor: 'bg-rose-100',
      iconColor: 'text-rose-600',
      label: 'Bonus',
    },
    default: {
      icon: <StarIcon />,
      bgColor: 'bg-gray-100',
      iconColor: 'text-gray-600',
      label: 'Points',
    },
  };

  const getSourceConfig = (source) => {
    return sourceConfig[source] || sourceConfig.default;
  };

  // Get relative time
  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDateTime(dateString);
  };

  // Calculate summary stats
  const totalEarned = history.filter(h => h.points > 0).reduce((sum, h) => sum + h.points, 0);
  const totalSpent = history.filter(h => h.points < 0).reduce((sum, h) => sum + Math.abs(h.points), 0);
  const netPoints = totalEarned - totalSpent;

  // Empty State
  if (history.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/8 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <StarIcon className="text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Points History</h3>
              <p className="text-sm text-gray-500">Track your points earnings and spending</p>
            </div>
          </div>
        </div>

        {/* Empty State Content */}
        <div className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-300">
            <EmptyIcon />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">No points history yet</h4>
          <p className="text-gray-500 text-sm max-w-xs mx-auto">
            Start recording observations and earning badges to see your points history here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/8 overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <StarIcon className="text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Points History</h3>
              <p className="text-sm text-gray-500">Track your points earnings and spending</p>
            </div>
          </div>

          {/* Total Points Badge */}
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-100">
            <StarIcon className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-semibold text-amber-700">
              {history.length} transactions
            </span>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      {showSummary && (
        <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendUpIcon className="text-green-500" />
                <span className="text-xs text-gray-500">Earned</span>
              </div>
              <p className="text-lg font-bold text-green-600">+{totalEarned.toLocaleString()}</p>
            </div>
            <div className="text-center border-x border-gray-200">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendDownIcon className="text-red-500" />
                <span className="text-xs text-gray-500">Spent</span>
              </div>
              <p className="text-lg font-bold text-red-600">-{totalSpent.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <StarIcon className="h-4 w-4 text-amber-500" />
                <span className="text-xs text-gray-500">Net</span>
              </div>
              <p className={`text-lg font-bold ${netPoints >= 0 ? 'text-amber-600' : 'text-red-600'}`}>
                {netPoints >= 0 ? '+' : ''}{netPoints.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* History List */}
      <div className="divide-y divide-gray-100">
        {history.map((item, index) => {
          const config = getSourceConfig(item.source);
          const isPositive = item.points > 0;
          
          return (
            <div
              key={index}
              className={`
                group px-6 py-4 flex items-center gap-4
                bg-white hover:bg-gray-50/50
                transition-all duration-200
              `}
            >
              {/* Icon */}
              <div className={`
                flex-shrink-0 w-10 h-10 rounded-xl
                ${config.bgColor} ${config.iconColor}
                flex items-center justify-center
                group-hover:scale-105 transition-transform duration-200
              `}>
                {config.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                      {item.description}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-400">
                        {getRelativeTime(item.createdAt)}
                      </span>
                      {item.source && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className={`text-xs px-1.5 py-0.5 rounded ${config.bgColor} ${config.iconColor}`}>
                            {config.label}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Points Badge */}
                  <div className={`
                    flex-shrink-0 flex items-center gap-1.5 
                    px-3 py-1.5 rounded-xl font-bold text-sm
                    ${isPositive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                    }
                  `}>
                    {isPositive ? (
                      <TrendUpIcon />
                    ) : (
                      <TrendDownIcon />
                    )}
                    <span>
                      {isPositive ? '+' : ''}{item.points.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100 bg-gradient-to-r from-amber-50/50 to-yellow-50/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Showing {history.length} transactions</span>
          </div>
          
          {/* Legend */}
          <div className="hidden sm:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-green-100"></div>
              <span className="text-gray-500">Earned</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-red-100"></div>
              <span className="text-gray-500">Spent</span>
            </div>
          </div>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="px-6 pb-6">
        <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <SparklesIcon className="h-4 w-4 text-amber-600" />
            </div>
            <p className="text-sm text-amber-800">
              {totalEarned >= 500 
                ? '🌟 Amazing! You\'re a top performer with over 500 points earned!' 
                : totalEarned >= 100 
                  ? '⭐ Great progress! Keep up the good work to earn more points!'
                  : '💫 Every observation counts! Keep recording to earn more points.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointsHistory;