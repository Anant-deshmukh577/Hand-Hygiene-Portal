const Radio = ({ 
  label, 
  name, 
  value, 
  checked, 
  onChange, 
  disabled = false,
  size = 'medium',
  description = '',
  error = '',
  className = '',
}) => {

  // Size configurations
  const sizes = {
    small: {
      radio: 'w-4 h-4',
      dot: 'w-1.5 h-1.5',
      label: 'text-sm',
      description: 'text-xs',
    },
    medium: {
      radio: 'w-5 h-5',
      dot: 'w-2 h-2',
      label: 'text-sm',
      description: 'text-xs',
    },
    large: {
      radio: 'w-6 h-6',
      dot: 'w-2.5 h-2.5',
      label: 'text-base',
      description: 'text-sm',
    },
  };

  const currentSize = sizes[size] || sizes.medium;

  return (
    <div className={className}>
      <label className={`
        inline-flex items-start gap-3 
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        group
      `}>
        {/* Custom Radio */}
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            type="radio"
            name={name}
            value={value}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="sr-only peer"
          />
          
          {/* Radio Circle */}
          <div className={`
            ${currentSize.radio}
            rounded-full border-2
            flex items-center justify-center
            transition-all duration-200
            ${checked
              ? 'border-teal-600 bg-white'
              : `border-gray-300 bg-white ${!disabled ? 'group-hover:border-teal-400' : ''}`
            }
            ${!disabled ? 'peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-teal-500' : ''}
            ${error ? 'border-red-500' : ''}
          `}>
            {/* Inner Dot */}
            <span className={`
              ${currentSize.dot}
              rounded-full bg-teal-600
              transform transition-all duration-200
              ${checked ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
            `} />
          </div>
        </div>

        {/* Label & Description */}
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <span className={`
                ${currentSize.label} 
                font-medium text-gray-700
                ${!disabled ? 'group-hover:text-gray-900' : ''}
                transition-colors duration-200
              `}>
                {label}
              </span>
            )}
            {description && (
              <span className={`${currentSize.description} text-gray-500 mt-0.5`}>
                {description}
              </span>
            )}
          </div>
        )}
      </label>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-xs text-red-600 flex items-center gap-1 ml-8">
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

// Radio Group Component
export const RadioGroup = ({
  label,
  name,
  options = [],
  value,
  onChange,
  direction = 'vertical', // 'vertical' | 'horizontal'
  disabled = false,
  error = '',
  required = false,
  size = 'medium',
  className = '',
}) => {

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Group Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Options */}
      <div className={`
        ${direction === 'horizontal' 
          ? 'flex flex-wrap gap-6' 
          : 'space-y-3'
        }
      `}>
        {options.map((option) => (
          <Radio
            key={option.value}
            name={name}
            value={option.value}
            label={option.label}
            description={option.description}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            disabled={disabled || option.disabled}
            size={size}
          />
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

// Card Radio Component
export const CardRadio = ({
  label,
  description,
  icon,
  name,
  value,
  checked,
  onChange,
  disabled = false,
  badge = null,
}) => {
  return (
    <label className={`
      relative flex items-start gap-4 p-4
      bg-white rounded-xl border-2 
      transition-all duration-200
      ${disabled 
        ? 'cursor-not-allowed opacity-50' 
        : 'cursor-pointer hover:border-teal-300'
      }
      ${checked 
        ? 'border-teal-500 bg-teal-50/50 ring-1 ring-teal-500' 
        : 'border-gray-200'
      }
    `}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only"
      />

      {/* Icon */}
      {icon && (
        <div className={`
          flex-shrink-0 w-10 h-10 rounded-xl 
          flex items-center justify-center
          transition-colors duration-200
          ${checked 
            ? 'bg-teal-100 text-teal-600' 
            : 'bg-gray-100 text-gray-500'
          }
        `}>
          {icon}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {label && (
            <p className={`
              font-medium 
              ${checked ? 'text-teal-700' : 'text-gray-900'}
            `}>
              {label}
            </p>
          )}
          {badge && badge}
        </div>
        {description && (
          <p className="text-sm text-gray-500 mt-0.5">
            {description}
          </p>
        )}
      </div>

      {/* Radio Indicator */}
      <div className={`
        flex-shrink-0 w-5 h-5 rounded-full border-2
        flex items-center justify-center
        transition-all duration-200
        ${checked 
          ? 'border-teal-600' 
          : 'border-gray-300'
        }
      `}>
        <span className={`
          w-2.5 h-2.5 rounded-full bg-teal-600
          transition-all duration-200
          ${checked ? 'scale-100' : 'scale-0'}
        `} />
      </div>
    </label>
  );
};

// Card Radio Group
export const CardRadioGroup = ({
  label,
  name,
  options = [],
  value,
  onChange,
  columns = 1, // 1 | 2 | 3 | 4
  disabled = false,
  error = '',
  required = false,
  className = '',
}) => {

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={className}>
      {/* Group Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Cards Grid */}
      <div className={`grid ${gridCols[columns] || gridCols[1]} gap-3`}>
        {options.map((option) => (
          <CardRadio
            key={option.value}
            name={name}
            value={option.value}
            label={option.label}
            description={option.description}
            icon={option.icon}
            badge={option.badge}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            disabled={disabled || option.disabled}
          />
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-xs text-red-600 flex items-center gap-1">
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

// Button Radio Group (Segmented Control Style)
export const ButtonRadioGroup = ({
  name,
  options = [],
  value,
  onChange,
  size = 'medium',
  fullWidth = false,
  disabled = false,
  className = '',
}) => {

  const sizes = {
    small: 'px-3 py-1.5 text-xs',
    medium: 'px-4 py-2 text-sm',
    large: 'px-5 py-2.5 text-base',
  };

  return (
    <div className={`
      inline-flex rounded-xl overflow-hidden border border-gray-200 bg-gray-50 p-1
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `}>
      {options.map((option, index) => (
        <button
          key={option.value}
          type="button"
          onClick={() => !disabled && !option.disabled && onChange(option.value)}
          disabled={disabled || option.disabled}
          className={`
            ${sizes[size] || sizes.medium}
            font-medium rounded-lg
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1
            ${fullWidth ? 'flex-1' : ''}
            ${value === option.value
              ? 'bg-white text-teal-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }
            ${disabled || option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {option.icon && (
            <span className="mr-2">{option.icon}</span>
          )}
          {option.label}
        </button>
      ))}
    </div>
  );
};

// Inline Radio Pills
export const RadioPills = ({
  name,
  options = [],
  value,
  onChange,
  size = 'medium',
  color = 'teal',
  disabled = false,
  className = '',
}) => {

  const sizes = {
    small: 'px-3 py-1 text-xs',
    medium: 'px-4 py-1.5 text-sm',
    large: 'px-5 py-2 text-base',
  };

  const colors = {
    teal: {
      selected: 'bg-teal-600 text-white border-teal-600',
      unselected: 'bg-white text-gray-600 border-gray-300 hover:border-teal-400 hover:text-teal-600',
    },
    gray: {
      selected: 'bg-gray-800 text-white border-gray-800',
      unselected: 'bg-white text-gray-600 border-gray-300 hover:border-gray-400',
    },
  };

  const currentColor = colors[color] || colors.teal;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => !disabled && !option.disabled && onChange(option.value)}
          disabled={disabled || option.disabled}
          className={`
            ${sizes[size] || sizes.medium}
            font-medium rounded-full border-2
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-1
            ${value === option.value
              ? currentColor.selected
              : currentColor.unselected
            }
            ${disabled || option.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default Radio;