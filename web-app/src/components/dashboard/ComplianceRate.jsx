import ProgressBar, { CircularProgress } from '../common/ProgressBar';
import Badge from '../common/Badge';

const ComplianceRate = ({ 
  rate = 0, 
  target = 90, 
  breakdown = [],
  variant = 'default', // 'default' | 'compact' | 'detailed'
  showTrend = false,
  trend = null, // { value: '+5%', type: 'positive' }
  period = 'This Month',
  className = '',
}) => {

  // Get color based on percentage
  const getRateColor = (percentage) => {
    if (percentage >= 90) return 'green';
    if (percentage >= 75) return 'amber';
    return 'red';
  };

  // Get status text
  const getStatusText = (percentage) => {
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 75) return 'Good';
    if (percentage >= 50) return 'Needs Improvement';
    return 'Critical';
  };

  // Get status badge variant
  const getStatusBadge = (percentage) => {
    if (percentage >= 90) return 'success';
    if (percentage >= 75) return 'warning';
    return 'danger';
  };

  const rateColor = getRateColor(rate);

  // Color configurations
  const colorClasses = {
    green: {
      text: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-500',
    },
    amber: {
      text: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: 'text-amber-500',
    },
    red: {
      text: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-500',
    },
  };

  const currentColors = colorClasses[rateColor] || colorClasses.green;

  // Trend Icon
  const TrendIcon = ({ type }) => {
    if (type === 'positive') {
      return (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      );
    }
    if (type === 'negative') {
      return (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      );
    }
    return null;
  };

  // WHO Moment Icons
  const getMomentIcon = (momentNumber) => {
    const icons = {
      1: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.05 4.575a1.575 1.575 0 10-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 013.15 0v1.5m-3.15 0l.075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 013.15 0V15M6.9 7.575a1.575 1.575 0 10-3.15 0v8.175a6.75 6.75 0 006.75 6.75h2.018a5.25 5.25 0 003.712-1.538l1.732-1.732a5.25 5.25 0 001.538-3.712l.003-2.024a.668.668 0 01.198-.471 1.575 1.575 0 10-2.228-2.228 3.818 3.818 0 00-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0116.35 15" />
        </svg>
      ),
      2: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5" />
        </svg>
      ),
      3: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2.25c0 0-6.75 8.25-6.75 12a6.75 6.75 0 1013.5 0c0-3.75-6.75-12-6.75-12z" />
        </svg>
      ),
      4: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      ),
      5: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" />
        </svg>
      ),
    };
    return icons[momentNumber] || icons[1];
  };

  // Compact Variant
  if (variant === 'compact') {
    return (
      <div className={`bg-white rounded-2xl border border-gray-100 p-4 shadow-sm ${className}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Compliance Rate</p>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-bold ${currentColors.text}`}>
                {rate}%
              </span>
              {showTrend && trend && (
                <span className={`
                  inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-xs font-medium
                  ${trend.type === 'positive' ? 'bg-green-50 text-green-600' : ''}
                  ${trend.type === 'negative' ? 'bg-red-50 text-red-600' : ''}
                `}>
                  <TrendIcon type={trend.type} />
                  {trend.value}
                </span>
              )}
            </div>
          </div>
          <CircularProgress 
            percentage={rate} 
            size="small" 
            color={rateColor}
            showLabel={false}
          />
        </div>
      </div>
    );
  }

  // Detailed Variant
  if (variant === 'detailed') {
    return (
      <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${className}`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Compliance Rate</h3>
              <p className="text-sm text-gray-500">{period}</p>
            </div>
            <Badge variant={getStatusBadge(rate)}>
              {getStatusText(rate)}
            </Badge>
          </div>

          {/* Main Rate Display */}
          <div className="flex items-center gap-6">
            <CircularProgress 
              percentage={rate} 
              size="large" 
              color={rateColor}
              label="Overall"
            />
            
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-2">
                <span className={`text-4xl font-bold ${currentColors.text}`}>
                  {rate}%
                </span>
                {showTrend && trend && (
                  <span className={`
                    inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium
                    ${trend.type === 'positive' ? 'bg-green-50 text-green-600' : ''}
                    ${trend.type === 'negative' ? 'bg-red-50 text-red-600' : ''}
                    ${trend.type === 'neutral' ? 'bg-gray-50 text-gray-600' : ''}
                  `}>
                    <TrendIcon type={trend.type} />
                    {trend.value}
                  </span>
                )}
              </div>
              
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Target:</span>
                  <span className="font-medium text-gray-900">{target}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Gap:</span>
                  <span className={`font-medium ${rate >= target ? 'text-green-600' : 'text-red-600'}`}>
                    {rate >= target ? '+' : ''}{rate - target}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown Section */}
        {breakdown.length > 0 && (
          <div className="p-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <svg className="h-4 w-4 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              WHO 5 Moments Breakdown
            </h4>
            
            <div className="space-y-4">
              {breakdown.map((item, index) => {
                const itemColor = getRateColor(item.rate);
                const itemColorClasses = colorClasses[itemColor];
                
                return (
                  <div key={index} className="group">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-8 h-8 rounded-lg flex items-center justify-center
                          ${itemColorClasses.bg} ${itemColorClasses.icon}
                        `}>
                          {getMomentIcon(index + 1)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.moment}</p>
                          {item.observations && (
                            <p className="text-xs text-gray-500">{item.observations} observations</p>
                          )}
                        </div>
                      </div>
                      <span className={`text-lg font-bold ${itemColorClasses.text}`}>
                        {item.rate}%
                      </span>
                    </div>
                    <ProgressBar 
                      percentage={item.rate} 
                      color={itemColor}
                      size="small"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default Variant
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 p-6 shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${currentColors.bg} flex items-center justify-center`}>
            <svg className={`h-5 w-5 ${currentColors.icon}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Compliance Rate</h3>
            <p className="text-sm text-gray-500">{period}</p>
          </div>
        </div>
        {showTrend && trend && (
          <span className={`
            inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium
            ${trend.type === 'positive' ? 'bg-green-50 text-green-600' : ''}
            ${trend.type === 'negative' ? 'bg-red-50 text-red-600' : ''}
            ${trend.type === 'neutral' ? 'bg-gray-50 text-gray-600' : ''}
          `}>
            <TrendIcon type={trend.type} />
            {trend.value}
          </span>
        )}
      </div>
      
      {/* Overall Rate */}
      <div className="mb-6">
        <div className="flex items-end justify-between mb-3">
          <div>
            <p className="text-sm text-gray-500 mb-1">Overall Compliance</p>
            <span className={`text-4xl font-bold ${currentColors.text}`}>
              {rate}%
            </span>
          </div>
          <Badge variant={getStatusBadge(rate)} size="small">
            {getStatusText(rate)}
          </Badge>
        </div>
        
        {/* Progress Bar */}
        <div className="relative">
          <ProgressBar 
            percentage={rate} 
            color={rateColor}
            size="large"
          />
          {/* Target Marker */}
          <div 
            className="absolute top-0 h-full w-0.5 bg-gray-800"
            style={{ left: `${target}%` }}
          >
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
              <span className="text-xs text-gray-600 bg-white px-1 rounded">
                Target: {target}%
              </span>
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-between mt-3 text-sm">
          <span className="text-gray-500">
            {rate >= target ? (
              <span className="text-green-600 font-medium">✓ Above target</span>
            ) : (
              <span className="text-amber-600 font-medium">{target - rate}% below target</span>
            )}
          </span>
        </div>
      </div>

      {/* Breakdown by WHO Moments */}
      {breakdown.length > 0 && (
        <div className="pt-4 border-t border-gray-100">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">
            Breakdown by WHO Moments
          </h4>
          <div className="space-y-4">
            {breakdown.map((item, index) => {
              const itemColor = getRateColor(item.rate);
              const itemColorClasses = colorClasses[itemColor];
              
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`
                        w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center
                        ${itemColorClasses.bg} ${itemColorClasses.text}
                      `}>
                        {index + 1}
                      </span>
                      <span className="text-sm text-gray-700">{item.moment}</span>
                    </div>
                    <span className={`text-sm font-semibold ${itemColorClasses.text}`}>
                      {item.rate}%
                    </span>
                  </div>
                  <ProgressBar 
                    percentage={item.rate} 
                    color={itemColor}
                    size="small"
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Compact Compliance Stats Row
export const ComplianceStatsRow = ({ stats = [] }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const color = stat.rate >= 90 ? 'green' : stat.rate >= 75 ? 'amber' : 'red';
        const colorClasses = {
          green: 'text-green-600 bg-green-50',
          amber: 'text-amber-600 bg-amber-50',
          red: 'text-red-600 bg-red-50',
        };
        
        return (
          <div 
            key={index}
            className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm"
          >
            <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
            <div className="flex items-center justify-between">
              <span className={`text-xl font-bold ${colorClasses[color].split(' ')[0]}`}>
                {stat.rate}%
              </span>
              {stat.trend && (
                <span className={`
                  text-xs font-medium px-1.5 py-0.5 rounded
                  ${stat.trend.startsWith('+') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}
                `}>
                  {stat.trend}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Mini Compliance Indicator
export const ComplianceIndicator = ({ rate = 0, size = 'medium' }) => {
  const color = rate >= 90 ? 'green' : rate >= 75 ? 'amber' : 'red';
  
  const sizes = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-12 h-12 text-sm',
    large: 'w-16 h-16 text-lg',
  };

  const colorClasses = {
    green: 'bg-green-100 text-green-700 ring-green-500',
    amber: 'bg-amber-100 text-amber-700 ring-amber-500',
    red: 'bg-red-100 text-red-700 ring-red-500',
  };

  return (
    <div className={`
      ${sizes[size] || sizes.medium}
      ${colorClasses[color]}
      rounded-full font-bold
      flex items-center justify-center
      ring-2 ring-offset-2
    `}>
      {rate}%
    </div>
  );
};

export default ComplianceRate;