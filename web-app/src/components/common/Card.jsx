const Card = ({ 
  children, 
  title, 
  subtitle,
  footer, 
  onClick,
  variant = 'default',
  padding = 'medium',
  hover = false,
  border = true,
  shadow = 'sm',
  rounded = 'xl',
  headerAction = null,
  icon = null,
  badge = null,
  className = '',
}) => {

  // Variant styles
  const variants = {
    default: 'bg-white',
    gray: 'bg-gray-50',
    teal: 'bg-teal-50 border-teal-100',
    success: 'bg-green-50 border-green-100',
    warning: 'bg-amber-50 border-amber-100',
    danger: 'bg-red-50 border-red-100',
    info: 'bg-blue-50 border-blue-100',
    gradient: 'bg-gradient-to-br from-teal-50 to-white',
  };

  // Padding styles
  const paddings = {
    none: 'p-0',
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8',
  };

  // Shadow styles
  const shadows = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md shadow-black/5',
    lg: 'shadow-lg shadow-black/10',
    xl: 'shadow-xl shadow-black/15',
  };

  // Rounded styles
  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-lg',
    md: 'rounded-xl',
    xl: 'rounded-2xl',
    full: 'rounded-3xl',
  };

  const currentVariant = variants[variant] || variants.default;
  const currentPadding = paddings[padding] || paddings.medium;
  const currentShadow = shadows[shadow] || shadows.sm;
  const currentRounded = roundedStyles[rounded] || roundedStyles.xl;

  return (
    <div 
      onClick={onClick}
      className={`
        ${currentVariant}
        ${currentPadding}
        ${currentShadow}
        ${currentRounded}
        ${border ? 'border border-gray-100' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${hover ? 'hover:shadow-lg hover:shadow-black/10 hover:-translate-y-1 hover:border-teal-200' : ''}
        transition-all duration-300
        ${className}
      `}
    >
      {/* Card Header */}
      {(title || subtitle || headerAction || icon || badge) && (
        <div className={`flex items-start justify-between gap-4 ${children ? 'mb-4' : ''}`}>
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Icon */}
            {icon && (
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center">
                {icon}
              </div>
            )}
            
            {/* Title & Subtitle */}
            <div className="flex-1 min-w-0">
              {title && (
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {title}
                  </h3>
                  {badge && badge}
                </div>
              )}
              {subtitle && (
                <p className="text-sm text-gray-500 mt-0.5 truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          
          {/* Header Action */}
          {headerAction && (
            <div className="flex-shrink-0">
              {headerAction}
            </div>
          )}
        </div>
      )}

      {/* Card Content */}
      {children && (
        <div className="text-gray-600">
          {children}
        </div>
      )}

      {/* Card Footer */}
      {footer && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          {footer}
        </div>
      )}
    </div>
  );
};

// Stat Card Component
export const StatCard = ({
  title,
  value,
  change,
  changeType = 'neutral', // 'positive', 'negative', 'neutral'
  icon,
  iconColor = 'teal',
  subtitle,
  onClick,
}) => {

  const iconColors = {
    teal: 'bg-teal-100 text-teal-600',
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    amber: 'bg-amber-100 text-amber-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
    rose: 'bg-rose-100 text-rose-600',
  };

  const changeColors = {
    positive: 'text-green-600 bg-green-50',
    negative: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50',
  };

  const changeIcons = {
    positive: (
      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    ),
    negative: (
      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    ),
    neutral: null,
  };

  return (
    <Card 
      onClick={onClick} 
      hover={!!onClick}
      className="relative overflow-hidden"
    >
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-teal-50 to-transparent rounded-bl-full opacity-50" />
      
      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          {/* Icon */}
          {icon && (
            <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${iconColors[iconColor] || iconColors.teal} flex items-center justify-center`}>
              {icon}
            </div>
          )}
          
          {/* Change Badge */}
          {change && (
            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full ${changeColors[changeType]}`}>
              {changeIcons[changeType]}
              {change}
            </span>
          )}
        </div>

        {/* Value */}
        <div className="mt-4">
          <p className="text-3xl font-bold text-gray-900">
            {value}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {title}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

// Feature Card Component
export const FeatureCard = ({
  title,
  description,
  icon,
  iconColor = 'teal',
  onClick,
}) => {

  const iconColors = {
    teal: 'bg-teal-100 text-teal-600 group-hover:bg-teal-200',
    green: 'bg-green-100 text-green-600 group-hover:bg-green-200',
    blue: 'bg-blue-100 text-blue-600 group-hover:bg-blue-200',
    amber: 'bg-amber-100 text-amber-600 group-hover:bg-amber-200',
    red: 'bg-red-100 text-red-600 group-hover:bg-red-200',
    purple: 'bg-purple-100 text-purple-600 group-hover:bg-purple-200',
    rose: 'bg-rose-100 text-rose-600 group-hover:bg-rose-200',
  };

  return (
    <div 
      onClick={onClick}
      className={`
        group bg-white rounded-2xl p-6 
        border border-gray-100 
        shadow-lg shadow-black/5 
        hover:shadow-xl hover:shadow-black/10 
        hover:border-teal-200 hover:-translate-y-2 
        transition-all duration-300
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      {/* Icon */}
      {icon && (
        <div className={`
          inline-flex items-center justify-center 
          w-14 h-14 rounded-2xl mb-5 
          transition-colors duration-200
          ${iconColors[iconColor] || iconColors.teal}
        `}>
          {icon}
        </div>
      )}

      {/* Title */}
      {title && (
        <h3 className="text-lg font-bold text-gray-900 mb-3">
          {title}
        </h3>
      )}

      {/* Description */}
      {description && (
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

// Profile Card Component
export const ProfileCard = ({
  name,
  role,
  department,
  avatar,
  stats = [],
  actions,
  onClick,
}) => {

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Card onClick={onClick} hover={!!onClick} className="text-center">
      {/* Avatar */}
      <div className="flex justify-center mb-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-teal-500/30 overflow-hidden">
          {avatar ? (
            <img 
              src={avatar} 
              alt={name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            getInitials(name)
          )}
        </div>
      </div>

      {/* Info */}
      <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
      {role && (
        <p className="text-sm text-gray-500 mt-1">{role}</p>
      )}
      {department && (
        <span className="inline-flex items-center px-2.5 py-1 mt-2 bg-teal-50 text-teal-700 text-xs font-semibold rounded-full">
          {department}
        </span>
      )}

      {/* Stats */}
      {stats.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      {actions && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          {actions}
        </div>
      )}
    </Card>
  );
};

// Empty State Card
export const EmptyCard = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <Card className="text-center py-12">
      {/* Icon */}
      {icon && (
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
            {icon}
          </div>
        </div>
      )}

      {/* Title */}
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
      )}

      {/* Description */}
      {description && (
        <p className="text-gray-500 mb-6 max-w-sm mx-auto">
          {description}
        </p>
      )}

      {/* Action */}
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </Card>
  );
};

export default Card;