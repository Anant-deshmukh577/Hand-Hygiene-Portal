import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/* --- SVG Icons --- */
const PlusIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const ClipboardListIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const TrophyIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const GiftIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

const ChartIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const QuickActions = ({ 
  variant = 'default', // 'default' | 'compact' | 'list'
  showHeader = true,
  className = '',
}) => {
  const { user } = useAuth();
  const canRecordObservations = user?.role === 'auditor' || user?.role === 'admin';

  const actions = [
    ...(canRecordObservations ? [{
      title: 'New Observation',
      description: 'Record a new hand hygiene observation',
      icon: <PlusIcon />,
      link: '/observation-entry',
      color: 'teal',
      badge: 'Primary',
    }] : [{
      title: 'Observation History',
      description: 'Review your recorded observations',
      icon: <ClipboardListIcon />,
      link: '/observation-history',
      color: 'teal',
    }]),
    {
      title: 'View Leaderboard',
      description: 'Check your ranking and top performers',
      icon: <TrophyIcon />,
      link: '/leaderboard',
      color: 'amber',
    },
    {
      title: 'My Rewards',
      description: 'View your points and claim rewards',
      icon: <GiftIcon />,
      link: '/rewards',
      color: 'green',
    },
    {
      title: 'Reports',
      description: 'View compliance reports and statistics',
      icon: <ChartIcon />,
      link: '/reports',
      color: 'blue',
    },
  ];

  // Color configurations
  const colorClasses = {
    teal: {
      iconBg: 'bg-teal-100 text-teal-600 group-hover:bg-teal-600 group-hover:text-white',
      border: 'border-teal-100 hover:border-teal-300',
      gradient: 'from-teal-500 to-teal-600',
      badge: 'bg-teal-100 text-teal-700',
    },
    amber: {
      iconBg: 'bg-amber-100 text-amber-600 group-hover:bg-amber-500 group-hover:text-white',
      border: 'border-amber-100 hover:border-amber-300',
      gradient: 'from-amber-400 to-amber-500',
      badge: 'bg-amber-100 text-amber-700',
    },
    green: {
      iconBg: 'bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white',
      border: 'border-green-100 hover:border-green-300',
      gradient: 'from-green-500 to-green-600',
      badge: 'bg-green-100 text-green-700',
    },
    blue: {
      iconBg: 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
      border: 'border-blue-100 hover:border-blue-300',
      gradient: 'from-blue-500 to-blue-600',
      badge: 'bg-blue-100 text-blue-700',
    },
    purple: {
      iconBg: 'bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white',
      border: 'border-purple-100 hover:border-purple-300',
      gradient: 'from-purple-500 to-purple-600',
      badge: 'bg-purple-100 text-purple-700',
    },
  };

  // Compact Variant
  if (variant === 'compact') {
    return (
      <div className={`bg-white rounded-2xl border border-gray-100 p-4 shadow-sm ${className}`}>
        {showHeader && (
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h3>
        )}
        <div className="flex flex-wrap gap-2">
          {actions.map((action, index) => {
            const colors = colorClasses[action.color] || colorClasses.teal;
            return (
              <Link
                key={index}
                to={action.link}
                className={`
                  inline-flex items-center gap-2 px-3 py-2 
                  bg-gray-50 hover:bg-gray-100 
                  text-gray-700 text-sm font-medium
                  rounded-xl transition-all duration-200
                  hover:shadow-sm
                `}
              >
                <span className={`p-1 rounded-lg ${colors.iconBg.split(' ').slice(0, 2).join(' ')}`}>
                  {action.icon}
                </span>
                {action.title}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  // List Variant
  if (variant === 'list') {
    return (
      <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${className}`}>
        {showHeader && (
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
        )}
        <div className="divide-y divide-gray-100">
          {actions.map((action, index) => {
            const colors = colorClasses[action.color] || colorClasses.teal;
            return (
              <Link
                key={index}
                to={action.link}
                className="group flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center
                  transition-colors duration-200
                  ${colors.iconBg}
                `}>
                  {action.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900 group-hover:text-teal-600 transition-colors">
                      {action.title}
                    </h4>
                    {action.badge && (
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${colors.badge}`}>
                        {action.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{action.description}</p>
                </div>
                <ArrowRightIcon className="text-gray-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all duration-200" />
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  // Default Grid Variant
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 p-6 shadow-sm ${className}`}>
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <svg className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              <p className="text-sm text-gray-500">Get things done faster</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const colors = colorClasses[action.color] || colorClasses.teal;
          return (
            <Link 
              key={index} 
              to={action.link}
              className="group"
            >
              <div className={`
                relative overflow-hidden
                p-5 rounded-2xl border-2
                bg-white hover:bg-gray-50
                ${colors.border}
                transition-all duration-300
                hover:shadow-lg hover:shadow-black/5
                hover:-translate-y-1
              `}>
                {/* Icon */}
                <div className={`
                  w-12 h-12 rounded-xl mb-4
                  flex items-center justify-center
                  transition-all duration-300
                  ${colors.iconBg}
                `}>
                  {action.icon}
                </div>

                {/* Badge */}
                {action.badge && (
                  <span className={`
                    absolute top-4 right-4
                    px-2 py-0.5 text-[10px] font-semibold rounded-full
                    ${colors.badge}
                  `}>
                    {action.badge}
                  </span>
                )}

                {/* Content */}
                <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-teal-600 transition-colors">
                  {action.title}
                </h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {action.description}
                </p>

                {/* Arrow */}
                <div className="mt-4 flex items-center text-sm font-medium text-gray-400 group-hover:text-teal-600 transition-colors">
                  <span className="mr-2">Go</span>
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

// Single Action Card (for individual use)
export const ActionCard = ({
  title,
  description,
  icon,
  link,
  color = 'teal',
  badge = null,
  onClick,
  disabled = false,
}) => {
  const colorClasses = {
    teal: {
      iconBg: 'bg-teal-100 text-teal-600 group-hover:bg-teal-600 group-hover:text-white',
      border: 'border-teal-100 hover:border-teal-300',
      badge: 'bg-teal-100 text-teal-700',
    },
    amber: {
      iconBg: 'bg-amber-100 text-amber-600 group-hover:bg-amber-500 group-hover:text-white',
      border: 'border-amber-100 hover:border-amber-300',
      badge: 'bg-amber-100 text-amber-700',
    },
    green: {
      iconBg: 'bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white',
      border: 'border-green-100 hover:border-green-300',
      badge: 'bg-green-100 text-green-700',
    },
    blue: {
      iconBg: 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
      border: 'border-blue-100 hover:border-blue-300',
      badge: 'bg-blue-100 text-blue-700',
    },
    red: {
      iconBg: 'bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white',
      border: 'border-red-100 hover:border-red-300',
      badge: 'bg-red-100 text-red-700',
    },
  };

  const colors = colorClasses[color] || colorClasses.teal;

  const CardContent = () => (
    <div className={`
      relative overflow-hidden group
      p-5 rounded-2xl border-2
      bg-white hover:bg-gray-50
      ${colors.border}
      transition-all duration-300
      hover:shadow-lg hover:shadow-black/5
      hover:-translate-y-1
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    `}>
      {/* Icon */}
      <div className={`
        w-12 h-12 rounded-xl mb-4
        flex items-center justify-center
        transition-all duration-300
        ${colors.iconBg}
      `}>
        {icon}
      </div>

      {/* Badge */}
      {badge && (
        <span className={`
          absolute top-4 right-4
          px-2 py-0.5 text-[10px] font-semibold rounded-full
          ${colors.badge}
        `}>
          {badge}
        </span>
      )}

      {/* Content */}
      <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-teal-600 transition-colors">
        {title}
      </h4>
      <p className="text-sm text-gray-500 leading-relaxed">
        {description}
      </p>

      {/* Arrow */}
      <div className="mt-4 flex items-center text-sm font-medium text-gray-400 group-hover:text-teal-600 transition-colors">
        <span className="mr-2">Go</span>
        <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );

  if (onClick) {
    return (
      <button onClick={onClick} disabled={disabled} className="w-full text-left">
        <CardContent />
      </button>
    );
  }

  if (link) {
    return (
      <Link to={link}>
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
};

// Quick Action Button (inline button style)
export const QuickActionButton = ({
  title,
  icon,
  link,
  color = 'teal',
  onClick,
  size = 'medium',
}) => {
  const sizes = {
    small: 'px-3 py-2 text-sm',
    medium: 'px-4 py-2.5 text-sm',
    large: 'px-5 py-3 text-base',
  };

  const colorClasses = {
    teal: 'bg-teal-50 text-teal-700 hover:bg-teal-100 border-teal-200',
    amber: 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200',
    green: 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200',
    blue: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200',
    gray: 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200',
  };

  const classes = `
    inline-flex items-center gap-2
    ${sizes[size] || sizes.medium}
    ${colorClasses[color] || colorClasses.teal}
    font-medium rounded-xl border
    transition-all duration-200
    hover:shadow-sm
  `;

  if (onClick) {
    return (
      <button onClick={onClick} className={classes}>
        {icon}
        {title}
      </button>
    );
  }

  return (
    <Link to={link} className={classes}>
      {icon}
      {title}
    </Link>
  );
};

// Floating Action Button
export const FloatingActionButton = ({
  icon,
  link,
  onClick,
  label = '',
  color = 'teal',
  position = 'bottom-right', // 'bottom-right' | 'bottom-left' | 'bottom-center'
}) => {
  const positions = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
  };

  const colorClasses = {
    teal: 'bg-teal-600 hover:bg-teal-700 shadow-teal-600/30',
    green: 'bg-green-600 hover:bg-green-700 shadow-green-600/30',
    blue: 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30',
    amber: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30',
  };

  const ButtonContent = () => (
    <div className={`
      ${label ? 'px-5 py-3' : 'p-4'}
      ${colorClasses[color] || colorClasses.teal}
      text-white rounded-full
      shadow-lg hover:shadow-xl
      transition-all duration-300
      flex items-center gap-2
      group
    `}>
      <span className="w-6 h-6 group-hover:scale-110 transition-transform">
        {icon}
      </span>
      {label && (
        <span className="font-medium">{label}</span>
      )}
    </div>
  );

  const wrapperClasses = `fixed ${positions[position]} z-40`;

  if (onClick) {
    return (
      <button onClick={onClick} className={wrapperClasses}>
        <ButtonContent />
      </button>
    );
  }

  return (
    <Link to={link} className={wrapperClasses}>
      <ButtonContent />
    </Link>
  );
};

export default QuickActions;