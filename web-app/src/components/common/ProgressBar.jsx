const ProgressBar = ({ 
  percentage = 0, 
  color = 'teal',
  size = 'medium', // 'small' | 'medium' | 'large'
  showLabel = false,
  labelPosition = 'right', // 'right' | 'top' | 'inside'
  animated = false,
  striped = false,
  label = '',
  variant = 'default', // 'default' | 'gradient' | 'segments'
  className = '',
}) => {

  const validPercentage = Math.min(100, Math.max(0, percentage));

  // Size configurations
  const sizes = {
    small: 'h-1.5',
    medium: 'h-2.5',
    large: 'h-4',
  };

  // Color configurations
  const colors = {
    teal: {
      bar: 'bg-teal-600',
      gradient: 'bg-gradient-to-r from-teal-500 to-teal-600',
      text: 'text-teal-600',
    },
    green: {
      bar: 'bg-green-600',
      gradient: 'bg-gradient-to-r from-green-500 to-green-600',
      text: 'text-green-600',
    },
    blue: {
      bar: 'bg-blue-600',
      gradient: 'bg-gradient-to-r from-blue-500 to-blue-600',
      text: 'text-blue-600',
    },
    amber: {
      bar: 'bg-amber-500',
      gradient: 'bg-gradient-to-r from-amber-400 to-amber-500',
      text: 'text-amber-600',
    },
    red: {
      bar: 'bg-red-600',
      gradient: 'bg-gradient-to-r from-red-500 to-red-600',
      text: 'text-red-600',
    },
    purple: {
      bar: 'bg-purple-600',
      gradient: 'bg-gradient-to-r from-purple-500 to-purple-600',
      text: 'text-purple-600',
    },
    gray: {
      bar: 'bg-gray-600',
      gradient: 'bg-gradient-to-r from-gray-500 to-gray-600',
      text: 'text-gray-600',
    },
  };

  const currentSize = sizes[size] || sizes.medium;
  const currentColor = colors[color] || colors.teal;

  // Determine bar color based on variant
  const getBarColor = () => {
    if (variant === 'gradient') return currentColor.gradient;
    return currentColor.bar;
  };

  // Label text
  const labelText = label || `${validPercentage}%`;

  return (
    <div className={`${className}`}>
      {/* Top Label */}
      {showLabel && labelPosition === 'top' && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-medium text-gray-700">{label || 'Progress'}</span>
          <span className={`text-sm font-semibold ${currentColor.text}`}>
            {validPercentage}%
          </span>
        </div>
      )}

      {/* Progress Bar Container */}
      <div className="relative">
        <div className={`
          w-full ${currentSize} 
          bg-gray-100 rounded-full 
          overflow-hidden
        `}>
          {/* Progress Fill */}
          <div 
            className={`
              ${currentSize} rounded-full
              ${getBarColor()}
              transition-all duration-500 ease-out
              ${striped ? 'bg-stripes' : ''}
              ${animated ? 'animate-progress-stripes' : ''}
              relative
            `}
            style={{ width: `${validPercentage}%` }}
          >
            {/* Inside Label */}
            {showLabel && labelPosition === 'inside' && size === 'large' && validPercentage >= 10 && (
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                {validPercentage}%
              </span>
            )}
          </div>
        </div>

        {/* Right Label */}
        {showLabel && labelPosition === 'right' && (
          <span className={`
            absolute -right-12 top-1/2 -translate-y-1/2
            text-xs font-semibold ${currentColor.text}
          `}>
            {validPercentage}%
          </span>
        )}
      </div>
    </div>
  );
};

// Circular Progress
export const CircularProgress = ({
  percentage = 0,
  size = 'medium', // 'small' | 'medium' | 'large' | 'xl'
  color = 'teal',
  showLabel = true,
  strokeWidth = 8,
  label = '',
  className = '',
}) => {

  const validPercentage = Math.min(100, Math.max(0, percentage));

  // Size configurations
  const sizes = {
    small: { width: 48, fontSize: 'text-xs' },
    medium: { width: 80, fontSize: 'text-lg' },
    large: { width: 120, fontSize: 'text-2xl' },
    xl: { width: 160, fontSize: 'text-3xl' },
  };

  // Color configurations
  const colors = {
    teal: 'text-teal-600 stroke-teal-600',
    green: 'text-green-600 stroke-green-600',
    blue: 'text-blue-600 stroke-blue-600',
    amber: 'text-amber-500 stroke-amber-500',
    red: 'text-red-600 stroke-red-600',
    purple: 'text-purple-600 stroke-purple-600',
  };

  const currentSize = sizes[size] || sizes.medium;
  const currentColor = colors[color] || colors.teal;

  const radius = (currentSize.width - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (validPercentage / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        className="transform -rotate-90"
        width={currentSize.width}
        height={currentSize.width}
      >
        {/* Background Circle */}
        <circle
          className="stroke-gray-100"
          strokeWidth={strokeWidth}
          fill="none"
          r={radius}
          cx={currentSize.width / 2}
          cy={currentSize.width / 2}
        />
        {/* Progress Circle */}
        <circle
          className={`${currentColor} transition-all duration-500 ease-out`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          r={radius}
          cx={currentSize.width / 2}
          cy={currentSize.width / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
      </svg>
      
      {/* Center Label */}
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-bold ${currentSize.fontSize} ${currentColor.split(' ')[0]}`}>
            {validPercentage}%
          </span>
          {label && (
            <span className="text-[10px] text-gray-500 mt-0.5">{label}</span>
          )}
        </div>
      )}
    </div>
  );
};

// Multi-segment Progress Bar
export const SegmentedProgress = ({
  segments = [],
  size = 'medium',
  showLabels = false,
  className = '',
}) => {
  // segments: [{ value: 40, color: 'teal', label: 'Complete' }, ...]

  const sizes = {
    small: 'h-2',
    medium: 'h-3',
    large: 'h-4',
  };

  const colors = {
    teal: 'bg-teal-600',
    green: 'bg-green-600',
    blue: 'bg-blue-600',
    amber: 'bg-amber-500',
    red: 'bg-red-600',
    purple: 'bg-purple-600',
    gray: 'bg-gray-400',
  };

  const total = segments.reduce((acc, seg) => acc + seg.value, 0);

  return (
    <div className={className}>
      {/* Progress Bar */}
      <div className={`flex w-full ${sizes[size] || sizes.medium} bg-gray-100 rounded-full overflow-hidden`}>
        {segments.map((segment, index) => (
          <div
            key={index}
            className={`${colors[segment.color] || colors.gray} transition-all duration-500 first:rounded-l-full last:rounded-r-full`}
            style={{ width: `${(segment.value / total) * 100}%` }}
          />
        ))}
      </div>

      {/* Labels */}
      {showLabels && (
        <div className="flex items-center justify-center gap-4 mt-3">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${colors[segment.color] || colors.gray}`} />
              <span className="text-xs text-gray-600">
                {segment.label} ({segment.value}%)
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Stats Progress Card
export const ProgressCard = ({
  title,
  value,
  target,
  icon,
  color = 'teal',
  trend,
  trendType = 'neutral', // 'positive' | 'negative' | 'neutral'
}) => {

  const percentage = Math.round((value / target) * 100);
  const validPercentage = Math.min(100, Math.max(0, percentage));

  const iconColors = {
    teal: 'bg-teal-100 text-teal-600',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    amber: 'bg-amber-100 text-amber-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
  };

  const trendColors = {
    positive: 'text-green-600 bg-green-50',
    negative: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50',
  };

  const TrendIcon = () => {
    if (trendType === 'positive') {
      return (
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      );
    }
    if (trendType === 'negative') {
      return (
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        {/* Icon */}
        {icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconColors[color]}`}>
            {icon}
          </div>
        )}

        {/* Trend Badge */}
        {trend && (
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded-full ${trendColors[trendType]}`}>
            <TrendIcon />
            {trend}
          </span>
        )}
      </div>

      {/* Title */}
      <p className="text-sm text-gray-500 mb-1">{title}</p>

      {/* Value */}
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        <span className="text-sm text-gray-400">/ {target}</span>
      </div>

      {/* Progress Bar */}
      <ProgressBar
        percentage={validPercentage}
        color={color}
        size="small"
      />

      {/* Percentage Label */}
      <p className="text-xs text-gray-500 mt-2">
        {validPercentage}% of target
      </p>
    </div>
  );
};

// Step Progress
export const StepProgress = ({
  steps = [],
  currentStep = 0,
  variant = 'default', // 'default' | 'numbered' | 'icons'
  className = '',
}) => {

  return (
    <div className={`flex items-center ${className}`}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isLast = index === steps.length - 1;

        return (
          <div key={index} className="flex items-center flex-1 last:flex-none">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center
                font-semibold text-sm transition-all duration-300
                ${isCompleted 
                  ? 'bg-teal-600 text-white' 
                  : isCurrent 
                    ? 'bg-teal-100 text-teal-600 border-2 border-teal-600' 
                    : 'bg-gray-100 text-gray-400'
                }
              `}>
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : variant === 'numbered' ? (
                  index + 1
                ) : step.icon ? (
                  step.icon
                ) : (
                  index + 1
                )}
              </div>
              
              {/* Step Label */}
              <span className={`
                mt-2 text-xs font-medium text-center max-w-[80px]
                ${isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'}
              `}>
                {step.label}
              </span>
            </div>

            {/* Connector Line */}
            {!isLast && (
              <div className={`
                flex-1 h-0.5 mx-2 transition-colors duration-300
                ${isCompleted ? 'bg-teal-600' : 'bg-gray-200'}
              `} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ProgressBar;