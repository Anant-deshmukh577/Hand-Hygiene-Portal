/* --- SVG Icons --- */
const TrendUpIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
  </svg>
);

const TrendDownIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
  </svg>
);

const TrendNeutralIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  color = 'teal',
  variant = 'default', // 'default' | 'minimal' | 'gradient' | 'outlined'
  size = 'medium', // 'small' | 'medium' | 'large'
  subtitle = '',
  progress = null, // { value: 75, max: 100 }
  onClick,
  className = '',
}) => {

  // Color configurations
  const colors = {
    teal: {
      iconBg: 'bg-teal-100',
      iconText: 'text-teal-600',
      valueText: 'text-teal-600',
      gradient: 'from-teal-500 to-teal-600',
      border: 'border-teal-200',
      progressBg: 'bg-teal-100',
      progressBar: 'bg-teal-600',
    },
    green: {
      iconBg: 'bg-green-100',
      iconText: 'text-green-600',
      valueText: 'text-green-600',
      gradient: 'from-green-500 to-green-600',
      border: 'border-green-200',
      progressBg: 'bg-green-100',
      progressBar: 'bg-green-600',
    },
    blue: {
      iconBg: 'bg-blue-100',
      iconText: 'text-blue-600',
      valueText: 'text-blue-600',
      gradient: 'from-blue-500 to-blue-600',
      border: 'border-blue-200',
      progressBg: 'bg-blue-100',
      progressBar: 'bg-blue-600',
    },
    amber: {
      iconBg: 'bg-amber-100',
      iconText: 'text-amber-600',
      valueText: 'text-amber-600',
      gradient: 'from-amber-400 to-amber-500',
      border: 'border-amber-200',
      progressBg: 'bg-amber-100',
      progressBar: 'bg-amber-500',
    },
    red: {
      iconBg: 'bg-red-100',
      iconText: 'text-red-600',
      valueText: 'text-red-600',
      gradient: 'from-red-500 to-red-600',
      border: 'border-red-200',
      progressBg: 'bg-red-100',
      progressBar: 'bg-red-600',
    },
    purple: {
      iconBg: 'bg-purple-100',
      iconText: 'text-purple-600',
      valueText: 'text-purple-600',
      gradient: 'from-purple-500 to-purple-600',
      border: 'border-purple-200',
      progressBg: 'bg-purple-100',
      progressBar: 'bg-purple-600',
    },
    gray: {
      iconBg: 'bg-gray-100',
      iconText: 'text-gray-600',
      valueText: 'text-gray-900',
      gradient: 'from-gray-500 to-gray-600',
      border: 'border-gray-200',
      progressBg: 'bg-gray-100',
      progressBar: 'bg-gray-600',
    },
  };

  // Size configurations
  const sizes = {
    small: {
      padding: 'p-4',
      valueSize: 'text-2xl',
      titleSize: 'text-xs',
      iconSize: 'w-10 h-10',
      iconInner: 'h-5 w-5',
    },
    medium: {
      padding: 'p-6',
      valueSize: 'text-3xl',
      titleSize: 'text-sm',
      iconSize: 'w-12 h-12',
      iconInner: 'h-6 w-6',
    },
    large: {
      padding: 'p-8',
      valueSize: 'text-4xl',
      titleSize: 'text-base',
      iconSize: 'w-14 h-14',
      iconInner: 'h-7 w-7',
    },
  };

  const currentColor = colors[color] || colors.teal;
  const currentSize = sizes[size] || sizes.medium;

  // Trend configurations
  const getTrendConfig = () => {
    if (trend === 'up') {
      return {
        icon: <TrendUpIcon />,
        color: 'text-green-600 bg-green-50',
      };
    }
    if (trend === 'down') {
      return {
        icon: <TrendDownIcon />,
        color: 'text-red-600 bg-red-50',
      };
    }
    return {
      icon: <TrendNeutralIcon />,
      color: 'text-gray-600 bg-gray-50',
    };
  };

  const trendConfig = getTrendConfig();

  // Gradient Variant
  if (variant === 'gradient') {
    return (
      <div 
        onClick={onClick}
        className={`
          relative overflow-hidden
          ${currentSize.padding} rounded-2xl
          bg-gradient-to-br ${currentColor.gradient}
          text-white shadow-lg
          ${onClick ? 'cursor-pointer hover:shadow-xl hover:-translate-y-1' : ''}
          transition-all duration-300
          ${className}
        `}
      >
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative flex justify-between items-start">
          <div className="flex-1">
            <p className={`${currentSize.titleSize} text-white/80 mb-2`}>
              {title}
            </p>
            <h2 className={`${currentSize.valueSize} font-bold mb-1`}>
              {value}
            </h2>
            {subtitle && (
              <p className="text-sm text-white/70">{subtitle}</p>
            )}
            {trend && trendValue && (
              <div className="flex items-center gap-1.5 mt-3">
                <span className="flex items-center gap-1 px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                  {trendConfig.icon}
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          
          {icon && (
            <div className={`${currentSize.iconSize} rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0`}>
              <span className={currentSize.iconInner}>{icon}</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {progress && (
          <div className="mt-4">
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white/60 rounded-full transition-all duration-500"
                style={{ width: `${(progress.value / progress.max) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Outlined Variant
  if (variant === 'outlined') {
    return (
      <div 
        onClick={onClick}
        className={`
          ${currentSize.padding} rounded-2xl
          bg-white border-2 ${currentColor.border}
          ${onClick ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1' : ''}
          transition-all duration-300
          ${className}
        `}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <p className={`${currentSize.titleSize} text-gray-500 mb-2`}>
              {title}
            </p>
            <h2 className={`${currentSize.valueSize} font-bold ${currentColor.valueText} mb-1`}>
              {value}
            </h2>
            {subtitle && (
              <p className="text-sm text-gray-500">{subtitle}</p>
            )}
            {trend && trendValue && (
              <div className="flex items-center gap-1.5 mt-3">
                <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${trendConfig.color}`}>
                  {trendConfig.icon}
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          
          {icon && (
            <div className={`${currentSize.iconSize} rounded-xl ${currentColor.iconBg} ${currentColor.iconText} flex items-center justify-center flex-shrink-0`}>
              <span className={currentSize.iconInner}>{icon}</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {progress && (
          <div className="mt-4">
            <div className={`h-2 ${currentColor.progressBg} rounded-full overflow-hidden`}>
              <div 
                className={`h-full ${currentColor.progressBar} rounded-full transition-all duration-500`}
                style={{ width: `${(progress.value / progress.max) * 100}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-400">{progress.value}</span>
              <span className="text-xs text-gray-400">{progress.max}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Minimal Variant
  if (variant === 'minimal') {
    return (
      <div 
        onClick={onClick}
        className={`
          p-4 rounded-xl
          bg-gray-50 hover:bg-gray-100
          ${onClick ? 'cursor-pointer' : ''}
          transition-all duration-200
          ${className}
        `}
      >
        <div className="flex items-center gap-4">
          {icon && (
            <div className={`w-10 h-10 rounded-lg ${currentColor.iconBg} ${currentColor.iconText} flex items-center justify-center flex-shrink-0`}>
              <span className="h-5 w-5">{icon}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-0.5">{title}</p>
            <div className="flex items-center gap-2">
              <span className={`text-xl font-bold ${currentColor.valueText}`}>{value}</span>
              {trend && trendValue && (
                <span className={`flex items-center gap-0.5 text-xs font-medium ${trendConfig.color} px-1.5 py-0.5 rounded`}>
                  {trendConfig.icon}
                  {trendValue}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default Variant
  return (
    <div 
      onClick={onClick}
      className={`
        ${currentSize.padding} rounded-2xl
        bg-white border border-gray-100 shadow-sm
        ${onClick ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-teal-200' : ''}
        transition-all duration-300
        ${className}
      `}
    >
      {/* Decorative Element */}
      <div className={`absolute top-0 right-0 w-24 h-24 ${currentColor.iconBg} rounded-bl-full opacity-30 -z-10`} />

      <div className="flex justify-between items-start">
        <div className="flex-1">
          <p className={`${currentSize.titleSize} text-gray-500 mb-2`}>
            {title}
          </p>
          <h2 className={`${currentSize.valueSize} font-bold text-gray-900 mb-1`}>
            {value}
          </h2>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
          {trend && trendValue && (
            <div className="flex items-center gap-1.5 mt-3">
              <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${trendConfig.color}`}>
                {trendConfig.icon}
                {trendValue}
              </span>
              <span className="text-xs text-gray-400">vs last period</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className={`${currentSize.iconSize} rounded-xl ${currentColor.iconBg} ${currentColor.iconText} flex items-center justify-center flex-shrink-0`}>
            <span className={currentSize.iconInner}>{icon}</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {progress && (
        <div className="mt-4">
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-500">Progress</span>
            <span className="text-xs font-medium text-gray-700">
              {Math.round((progress.value / progress.max) * 100)}%
            </span>
          </div>
          <div className={`h-2 ${currentColor.progressBg} rounded-full overflow-hidden`}>
            <div 
              className={`h-full ${currentColor.progressBar} rounded-full transition-all duration-500`}
              style={{ width: `${(progress.value / progress.max) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Stats Grid Component
export const StatsGrid = ({ stats = [], columns = 4, className = '' }) => {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5',
  };

  return (
    <div className={`grid ${gridCols[columns] || gridCols[4]} gap-4 lg:gap-6 ${className}`}>
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
};

// Mini Stats Card (for inline use)
export const MiniStatsCard = ({
  title,
  value,
  icon,
  color = 'teal',
  className = '',
}) => {
  const colors = {
    teal: 'bg-teal-50 text-teal-700 border-teal-100',
    green: 'bg-green-50 text-green-700 border-green-100',
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    red: 'bg-red-50 text-red-700 border-red-100',
    gray: 'bg-gray-50 text-gray-700 border-gray-100',
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border ${colors[color]} ${className}`}>
      {icon && <span className="h-4 w-4">{icon}</span>}
      <span className="text-sm font-medium">{title}:</span>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
};

// Comparison Stats Card
export const ComparisonStatsCard = ({
  title,
  currentValue,
  previousValue,
  currentLabel = 'Current',
  previousLabel = 'Previous',
  icon,
  color = 'teal',
  className = '',
}) => {
  const colors = {
    teal: { iconBg: 'bg-teal-100', iconText: 'text-teal-600' },
    green: { iconBg: 'bg-green-100', iconText: 'text-green-600' },
    blue: { iconBg: 'bg-blue-100', iconText: 'text-blue-600' },
    amber: { iconBg: 'bg-amber-100', iconText: 'text-amber-600' },
  };

  const currentColor = colors[color] || colors.teal;
  const change = currentValue - previousValue;
  const changePercent = previousValue > 0 ? Math.round((change / previousValue) * 100) : 0;

  return (
    <div className={`p-6 bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-gray-700">{title}</h4>
        {icon && (
          <div className={`w-10 h-10 rounded-xl ${currentColor.iconBg} ${currentColor.iconText} flex items-center justify-center`}>
            {icon}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">{currentLabel}</p>
          <p className="text-2xl font-bold text-gray-900">{currentValue}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">{previousLabel}</p>
          <p className="text-2xl font-bold text-gray-400">{previousValue}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <span className={`
            inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold
            ${change >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}
          `}>
            {change >= 0 ? <TrendUpIcon /> : <TrendDownIcon />}
            {change >= 0 ? '+' : ''}{change} ({changePercent}%)
          </span>
          <span className="text-xs text-gray-400">vs {previousLabel.toLowerCase()}</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;