const Badge = ({ children, variant = 'default', size = 'medium', dot = false, icon = null }) => {
  
  // Tailwind classes for each variant (matching your teal theme)
  const variants = {
    default: 'bg-gray-100 text-gray-700 border-gray-200',
    primary: 'bg-teal-100 text-teal-700 border-teal-200',
    success: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    danger: 'bg-red-100 text-red-700 border-red-200',
    info: 'bg-blue-100 text-blue-700 border-blue-200',
    purple: 'bg-purple-100 text-purple-700 border-purple-200',
    rose: 'bg-rose-100 text-rose-700 border-rose-200',
  };

  // Solid variants (filled background)
  const solidVariants = {
    default: 'bg-gray-500 text-white',
    primary: 'bg-teal-600 text-white',
    success: 'bg-green-600 text-white',
    warning: 'bg-amber-500 text-white',
    danger: 'bg-red-600 text-white',
    info: 'bg-blue-600 text-white',
    purple: 'bg-purple-600 text-white',
    rose: 'bg-rose-600 text-white',
  };

  // Dot colors for status indicator
  const dotColors = {
    default: 'bg-gray-500',
    primary: 'bg-teal-500',
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    info: 'bg-blue-500',
    purple: 'bg-purple-500',
    rose: 'bg-rose-500',
  };

  // Size classes
  const sizes = {
    small: 'px-2 py-0.5 text-[10px]',
    medium: 'px-2.5 py-1 text-xs',
    large: 'px-3 py-1.5 text-sm',
  };

  const currentVariant = variants[variant] || variants.default;
  const currentDotColor = dotColors[variant] || dotColors.default;
  const currentSize = sizes[size] || sizes.medium;

  return (
    <span className={`
      inline-flex items-center gap-1.5
      ${currentSize}
      ${currentVariant}
      font-semibold rounded-full
      border
      transition-all duration-200
    `}>
      {/* Optional Dot Indicator */}
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${currentDotColor} ${variant === 'success' ? 'animate-pulse' : ''}`} />
      )}
      
      {/* Optional Icon */}
      {icon && (
        <span className="flex-shrink-0">
          {icon}
        </span>
      )}
      
      {/* Badge Text */}
      {children}
    </span>
  );
};

// Solid Badge variant component
export const SolidBadge = ({ children, variant = 'default', size = 'medium', icon = null }) => {
  
  const solidVariants = {
    default: 'bg-gray-500 text-white',
    primary: 'bg-teal-600 text-white',
    success: 'bg-green-600 text-white',
    warning: 'bg-amber-500 text-white',
    danger: 'bg-red-600 text-white',
    info: 'bg-blue-600 text-white',
    purple: 'bg-purple-600 text-white',
    rose: 'bg-rose-600 text-white',
  };

  const sizes = {
    small: 'px-2 py-0.5 text-[10px]',
    medium: 'px-2.5 py-1 text-xs',
    large: 'px-3 py-1.5 text-sm',
  };

  const currentVariant = solidVariants[variant] || solidVariants.default;
  const currentSize = sizes[size] || sizes.medium;

  return (
    <span className={`
      inline-flex items-center gap-1.5
      ${currentSize}
      ${currentVariant}
      font-semibold rounded-full
      shadow-sm
      transition-all duration-200
    `}>
      {icon && (
        <span className="flex-shrink-0">
          {icon}
        </span>
      )}
      {children}
    </span>
  );
};

// Outline Badge variant component
export const OutlineBadge = ({ children, variant = 'default', size = 'medium' }) => {
  
  const outlineVariants = {
    default: 'border-gray-300 text-gray-600',
    primary: 'border-teal-500 text-teal-600',
    success: 'border-green-500 text-green-600',
    warning: 'border-amber-500 text-amber-600',
    danger: 'border-red-500 text-red-600',
    info: 'border-blue-500 text-blue-600',
    purple: 'border-purple-500 text-purple-600',
    rose: 'border-rose-500 text-rose-600',
  };

  const sizes = {
    small: 'px-2 py-0.5 text-[10px]',
    medium: 'px-2.5 py-1 text-xs',
    large: 'px-3 py-1.5 text-sm',
  };

  const currentVariant = outlineVariants[variant] || outlineVariants.default;
  const currentSize = sizes[size] || sizes.medium;

  return (
    <span className={`
      inline-flex items-center gap-1.5
      ${currentSize}
      ${currentVariant}
      bg-transparent border-2
      font-semibold rounded-full
      transition-all duration-200
    `}>
      {children}
    </span>
  );
};

export default Badge;