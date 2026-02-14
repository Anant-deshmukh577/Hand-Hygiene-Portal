const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  disabled = false,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
}) => {

  // Loading Spinner Component
  const LoadingSpinner = () => (
    <svg 
      className="animate-spin h-4 w-4" 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  // Variant styles (matching your teal theme)
  const variants = {
    primary: `
      bg-teal-600 text-white 
      hover:bg-teal-700 
      focus:ring-teal-500
      shadow-sm hover:shadow-md shadow-teal-600/20 hover:shadow-teal-600/30
    `,
    secondary: `
      bg-gray-100 text-gray-700 
      hover:bg-gray-200 
      focus:ring-gray-400
      border border-gray-200
    `,
    success: `
      bg-green-600 text-white 
      hover:bg-green-700 
      focus:ring-green-500
      shadow-sm hover:shadow-md shadow-green-600/20 hover:shadow-green-600/30
    `,
    danger: `
      bg-red-600 text-white 
      hover:bg-red-700 
      focus:ring-red-500
      shadow-sm hover:shadow-md shadow-red-600/20 hover:shadow-red-600/30
    `,
    warning: `
      bg-amber-500 text-white 
      hover:bg-amber-600 
      focus:ring-amber-400
      shadow-sm hover:shadow-md shadow-amber-500/20 hover:shadow-amber-500/30
    `,
    info: `
      bg-blue-600 text-white 
      hover:bg-blue-700 
      focus:ring-blue-500
      shadow-sm hover:shadow-md shadow-blue-600/20 hover:shadow-blue-600/30
    `,
    outline: `
      bg-transparent text-teal-600 
      border-2 border-teal-600 
      hover:bg-teal-50 
      focus:ring-teal-500
    `,
    outlineGray: `
      bg-transparent text-gray-600 
      border border-gray-300 
      hover:bg-gray-50 hover:text-gray-900
      focus:ring-gray-400
    `,
    ghost: `
      bg-transparent text-gray-600 
      hover:bg-gray-100 hover:text-gray-900
      focus:ring-gray-400
    `,
    link: `
      bg-transparent text-teal-600 
      hover:text-teal-700 hover:underline
      focus:ring-teal-500
      p-0 shadow-none
    `,
  };

  // Size styles
  const sizes = {
    small: 'px-3 py-1.5 text-xs gap-1.5',
    medium: 'px-4 py-2.5 text-sm gap-2',
    large: 'px-6 py-3 text-base gap-2.5',
    xl: 'px-8 py-4 text-lg gap-3',
  };

  // Icon sizes based on button size
  const iconSizes = {
    small: 'h-3.5 w-3.5',
    medium: 'h-4 w-4',
    large: 'h-5 w-5',
    xl: 'h-6 w-6',
  };

  const currentVariant = variants[variant] || variants.primary;
  const currentSize = sizes[size] || sizes.medium;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center
        ${currentSize}
        ${currentVariant}
        font-semibold rounded-xl
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none
        ${fullWidth ? 'w-full' : ''}
        ${loading ? 'cursor-wait' : ''}
      `}
    >
      {/* Loading Spinner or Left Icon */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        icon && iconPosition === 'left' && (
          <span className={iconSizes[size] || iconSizes.medium}>
            {icon}
          </span>
        )
      )}

      {/* Button Text */}
      <span>{loading ? 'Loading...' : children}</span>

      {/* Right Icon */}
      {!loading && icon && iconPosition === 'right' && (
        <span className={iconSizes[size] || iconSizes.medium}>
          {icon}
        </span>
      )}
    </button>
  );
};

// Icon Button (square button with only icon)
export const IconButton = ({ 
  icon, 
  onClick, 
  variant = 'ghost', 
  size = 'medium',
  disabled = false,
  label = '',
}) => {

  const variants = {
    primary: 'bg-teal-600 text-white hover:bg-teal-700 focus:ring-teal-500',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:ring-gray-400',
    ghostTeal: 'bg-transparent text-teal-600 hover:bg-teal-50 hover:text-teal-700 focus:ring-teal-500',
  };

  const sizes = {
    small: 'p-1.5',
    medium: 'p-2',
    large: 'p-3',
  };

  const iconSizes = {
    small: 'h-4 w-4',
    medium: 'h-5 w-5',
    large: 'h-6 w-6',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`
        inline-flex items-center justify-center
        ${sizes[size] || sizes.medium}
        ${variants[variant] || variants.ghost}
        rounded-lg
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      <span className={iconSizes[size] || iconSizes.medium}>
        {icon}
      </span>
    </button>
  );
};

// Button Group Component
export const ButtonGroup = ({ children, className = '' }) => {
  return (
    <div className={`inline-flex rounded-xl overflow-hidden shadow-sm ${className}`}>
      {children}
    </div>
  );
};

// Grouped Button (for use inside ButtonGroup)
export const GroupedButton = ({ 
  children, 
  onClick, 
  active = false,
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 text-sm font-medium
        border-r border-gray-200 last:border-r-0
        transition-all duration-200
        focus:outline-none focus:z-10
        disabled:opacity-50 disabled:cursor-not-allowed
        ${active 
          ? 'bg-teal-600 text-white' 
          : 'bg-white text-gray-700 hover:bg-gray-50'
        }
      `}
    >
      {children}
    </button>
  );
};

export default Button;