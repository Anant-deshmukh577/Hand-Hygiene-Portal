import { formatDateTime } from '../../utils/helpers';
import Badge from '../common/Badge';

/* --- SVG Icons --- */
const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
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

const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const GiftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

const KeyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);

const PinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);

const EmptyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const ActivityHistory = ({ activities = [], maxItems = 10, showViewAll = false, onViewAll }) => {
  
  // Activity type configurations
  const activityConfig = {
    observation: {
      icon: <ClipboardIcon />,
      bgColor: 'bg-teal-100',
      iconColor: 'text-teal-600',
      borderColor: 'border-l-teal-500',
    },
    badge: {
      icon: <TrophyIcon />,
      bgColor: 'bg-amber-100',
      iconColor: 'text-amber-600',
      borderColor: 'border-l-amber-500',
    },
    rank: {
      icon: <ChartIcon />,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      borderColor: 'border-l-purple-500',
    },
    reward: {
      icon: <GiftIcon />,
      bgColor: 'bg-rose-100',
      iconColor: 'text-rose-600',
      borderColor: 'border-l-rose-500',
    },
    login: {
      icon: <KeyIcon />,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      borderColor: 'border-l-blue-500',
    },
    default: {
      icon: <PinIcon />,
      bgColor: 'bg-gray-100',
      iconColor: 'text-gray-600',
      borderColor: 'border-l-gray-500',
    },
  };

  const getActivityConfig = (type) => {
    return activityConfig[type] || activityConfig.default;
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

  // Empty State
  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/8 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <ClockIcon className="text-teal-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <p className="text-sm text-gray-500">Your latest actions and updates</p>
            </div>
          </div>
        </div>

        {/* Empty State Content */}
        <div className="p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400">
            <EmptyIcon />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">No recent activities</h4>
          <p className="text-gray-500 text-sm max-w-xs mx-auto">
            Your activities will appear here once you start recording observations or earning rewards.
          </p>
        </div>
      </div>
    );
  }

  const displayedActivities = activities.slice(0, maxItems);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/8 overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <ClockIcon className="text-teal-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <p className="text-sm text-gray-500">Your latest actions and updates</p>
            </div>
          </div>

          {/* Activity count badge */}
          <span className="hidden sm:inline-flex items-center px-3 py-1 bg-teal-50 text-teal-700 text-xs font-semibold rounded-full">
            {activities.length} {activities.length === 1 ? 'activity' : 'activities'}
          </span>
        </div>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-gray-100">
        {displayedActivities.map((activity, index) => {
          const config = getActivityConfig(activity.type);
          
          return (
            <div
              key={index}
              className={`
                group px-6 py-4 flex items-start gap-4
                border-l-4 ${config.borderColor}
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
                      {activity.title}
                    </h4>
                    <p className="text-gray-500 text-sm mt-0.5 line-clamp-2">
                      {activity.description}
                    </p>
                  </div>

                  {/* Timestamp */}
                  <span className="flex-shrink-0 text-xs text-gray-400 whitespace-nowrap">
                    {getRelativeTime(activity.createdAt)}
                  </span>
                </div>

                {/* Optional metadata/tags */}
                {activity.metadata && (
                  <div className="flex items-center gap-2 mt-2">
                    {activity.metadata.points && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-semibold rounded-full">
                        +{activity.metadata.points} pts
                      </span>
                    )}
                    {activity.metadata.ward && (
                      <span className="inline-flex items-center px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-medium rounded-full">
                        {activity.metadata.ward}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer - View All Button */}
      {showViewAll && activities.length > maxItems && (
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={onViewAll}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all duration-200"
          >
            View All Activities
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      )}

      {/* Today indicator line (optional visual enhancement) */}
      {displayedActivities.length > 0 && (
        <div className="px-6 py-3 border-t border-gray-100 bg-gradient-to-r from-teal-50/50 to-green-50/50">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>
              {displayedActivities.length === 1 
                ? 'Latest activity shown' 
                : `Showing ${displayedActivities.length} most recent activities`
              }
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityHistory;