import { formatDateTime } from '../../utils/helpers';

/* --- SVG Icons --- */
const ActivityIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ObservationIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const AwardIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const UserIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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

const BellIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const StarIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const EmptyIcon = () => (
  <svg className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const RecentActivities = ({ 
  activities = [],
  variant = 'default', // 'default' | 'compact' | 'timeline'
  showHeader = true,
  maxItems = 10,
  showViewAll = false,
  onViewAll,
  className = '',
}) => {

  // Activity type configurations
  const activityTypes = {
    observation: {
      icon: <ObservationIcon />,
      color: 'teal',
      bgColor: 'bg-teal-100',
      textColor: 'text-teal-600',
      borderColor: 'border-teal-500',
    },
    compliant: {
      icon: <CheckCircleIcon />,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      borderColor: 'border-green-500',
    },
    'non-compliant': {
      icon: <XCircleIcon />,
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
      borderColor: 'border-red-500',
    },
    reward: {
      icon: <AwardIcon />,
      color: 'amber',
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-600',
      borderColor: 'border-amber-500',
    },
    achievement: {
      icon: <StarIcon />,
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      borderColor: 'border-purple-500',
    },
    user: {
      icon: <UserIcon />,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      borderColor: 'border-blue-500',
    },
    notification: {
      icon: <BellIcon />,
      color: 'gray',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-600',
      borderColor: 'border-gray-400',
    },
    default: {
      icon: <ActivityIcon />,
      color: 'teal',
      bgColor: 'bg-teal-100',
      textColor: 'text-teal-600',
      borderColor: 'border-teal-500',
    },
  };

  // Get activity config
  const getActivityConfig = (type) => {
    return activityTypes[type] || activityTypes.default;
  };

  // Format relative time
  const getRelativeTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDateTime(dateString);
  };

  // Display activities (limited)
  const displayedActivities = activities.slice(0, maxItems);

  // Empty State
  if (activities.length === 0) {
    return (
      <div className={`bg-white rounded-2xl border border-gray-100 p-8 shadow-sm text-center ${className}`}>
        <div className="flex justify-center mb-4">
          <EmptyIcon />
        </div>
        <h4 className="text-gray-900 font-medium mb-1">No recent activities</h4>
        <p className="text-gray-500 text-sm">Activities will appear here once you start recording observations.</p>
      </div>
    );
  }

  // Compact Variant
  if (variant === 'compact') {
    return (
      <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${className}`}>
        {showHeader && (
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-700">Recent Activities</h3>
            {showViewAll && (
              <button 
                onClick={onViewAll}
                className="text-xs text-teal-600 hover:text-teal-700 font-medium"
              >
                View All
              </button>
            )}
          </div>
        )}
        <div className="divide-y divide-gray-50">
          {displayedActivities.map((activity, index) => {
            const config = getActivityConfig(activity.type);
            return (
              <div key={index} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${config.bgColor} ${config.textColor} flex items-center justify-center flex-shrink-0`}>
                    {config.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                    <p className="text-xs text-gray-500">{getRelativeTime(activity.createdAt)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Timeline Variant
  if (variant === 'timeline') {
    return (
      <div className={`bg-white rounded-2xl border border-gray-100 p-6 shadow-sm ${className}`}>
        {showHeader && (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                <ActivityIcon className="text-teal-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Activity Timeline</h3>
                <p className="text-sm text-gray-500">{activities.length} activities</p>
              </div>
            </div>
            {showViewAll && (
              <button 
                onClick={onViewAll}
                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                View All →
              </button>
            )}
          </div>
        )}

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-100" />

          {/* Timeline Items */}
          <div className="space-y-6">
            {displayedActivities.map((activity, index) => {
              const config = getActivityConfig(activity.type);
              return (
                <div key={index} className="relative flex gap-4">
                  {/* Timeline Dot */}
                  <div className={`
                    relative z-10 w-8 h-8 rounded-full 
                    ${config.bgColor} ${config.textColor}
                    flex items-center justify-center flex-shrink-0
                    ring-4 ring-white
                  `}>
                    {config.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900">{activity.title}</p>
                          {activity.description && (
                            <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
                          )}
                          {activity.metadata && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {Object.entries(activity.metadata).map(([key, value]) => (
                                <span 
                                  key={key}
                                  className="inline-flex items-center px-2 py-0.5 bg-white text-xs text-gray-600 rounded-full border border-gray-200"
                                >
                                  {key}: {value}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {getRelativeTime(activity.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Default Variant
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 p-6 shadow-sm ${className}`}>
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <svg className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
              <p className="text-sm text-gray-500">Your latest actions</p>
            </div>
          </div>
          {showViewAll && (
            <button 
              onClick={onViewAll}
              className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
            >
              View All
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      )}
      
      {/* Activities List */}
      <div className="space-y-3">
        {displayedActivities.map((activity, index) => {
          const config = getActivityConfig(activity.type);
          return (
            <div 
              key={index}
              className={`
                group relative
                p-4 rounded-xl
                bg-gray-50 hover:bg-gray-100
                border-l-4 ${config.borderColor}
                transition-all duration-200
              `}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`
                  w-10 h-10 rounded-xl flex-shrink-0
                  ${config.bgColor} ${config.textColor}
                  flex items-center justify-center
                  transition-transform duration-200 group-hover:scale-110
                `}>
                  {config.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">
                        {activity.title}
                      </p>
                      {activity.description && (
                        <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                          {activity.description}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                      {getRelativeTime(activity.createdAt)}
                    </span>
                  </div>

                  {/* Tags/Metadata */}
                  {activity.tags && activity.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {activity.tags.map((tag, tagIndex) => (
                        <span 
                          key={tagIndex}
                          className="inline-flex items-center px-2 py-0.5 bg-white text-xs text-gray-600 rounded-full border border-gray-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More / View All */}
      {activities.length > maxItems && showViewAll && (
        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
          <button 
            onClick={onViewAll}
            className="text-sm text-teal-600 hover:text-teal-700 font-medium"
          >
            View all {activities.length} activities
          </button>
        </div>
      )}
    </div>
  );
};

// Single Activity Item (for individual use)
export const ActivityItem = ({
  title,
  description,
  type = 'default',
  timestamp,
  tags = [],
  onClick,
  className = '',
}) => {
  const activityTypes = {
    observation: { icon: <ObservationIcon />, bgColor: 'bg-teal-100', textColor: 'text-teal-600', borderColor: 'border-teal-500' },
    compliant: { icon: <CheckCircleIcon />, bgColor: 'bg-green-100', textColor: 'text-green-600', borderColor: 'border-green-500' },
    'non-compliant': { icon: <XCircleIcon />, bgColor: 'bg-red-100', textColor: 'text-red-600', borderColor: 'border-red-500' },
    reward: { icon: <AwardIcon />, bgColor: 'bg-amber-100', textColor: 'text-amber-600', borderColor: 'border-amber-500' },
    achievement: { icon: <StarIcon />, bgColor: 'bg-purple-100', textColor: 'text-purple-600', borderColor: 'border-purple-500' },
    default: { icon: <ActivityIcon />, bgColor: 'bg-teal-100', textColor: 'text-teal-600', borderColor: 'border-teal-500' },
  };

  const config = activityTypes[type] || activityTypes.default;

  return (
    <div 
      onClick={onClick}
      className={`
        group p-4 rounded-xl
        bg-gray-50 hover:bg-gray-100
        border-l-4 ${config.borderColor}
        transition-all duration-200
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-xl flex-shrink-0 ${config.bgColor} ${config.textColor} flex items-center justify-center`}>
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900">{title}</p>
              {description && (
                <p className="text-sm text-gray-500 mt-0.5">{description}</p>
              )}
            </div>
            {timestamp && (
              <span className="text-xs text-gray-400 whitespace-nowrap">{timestamp}</span>
            )}
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tags.map((tag, index) => (
                <span key={index} className="inline-flex items-center px-2 py-0.5 bg-white text-xs text-gray-600 rounded-full border border-gray-200">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Activity Feed (infinite scroll style)
export const ActivityFeed = ({
  activities = [],
  loading = false,
  hasMore = false,
  onLoadMore,
  className = '',
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {activities.map((activity, index) => (
        <ActivityItem
          key={index}
          title={activity.title}
          description={activity.description}
          type={activity.type}
          timestamp={activity.createdAt}
          tags={activity.tags}
        />
      ))}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-4">
          <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Load More Button */}
      {!loading && hasMore && (
        <button
          onClick={onLoadMore}
          className="w-full py-3 text-sm text-teal-600 hover:text-teal-700 font-medium hover:bg-teal-50 rounded-xl transition-colors"
        >
          Load More Activities
        </button>
      )}
    </div>
  );
};

export default RecentActivities;