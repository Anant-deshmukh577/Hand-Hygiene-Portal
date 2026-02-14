import { useState } from 'react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  success = false,
  hint = '',
  icon = null,
  iconPosition = 'left',
  size = 'medium',
  clearable = false,
  onClear,
  prefix = '',
  suffix = '',
  className = '',
  ...props
}) => {

  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Size styles
  const sizes = {
    small: {
      input: 'px-3 py-2 text-sm',
      label: 'text-xs',
      icon: 'h-4 w-4',
      iconPadding: icon && iconPosition === 'left' ? 'pl-9' : icon && iconPosition === 'right' ? 'pr-9' : '',
    },
    medium: {
      input: 'px-4 py-2.5 text-sm',
      label: 'text-sm',
      icon: 'h-5 w-5',
      iconPadding: icon && iconPosition === 'left' ? 'pl-11' : icon && iconPosition === 'right' ? 'pr-11' : '',
    },
    large: {
      input: 'px-4 py-3 text-base',
      label: 'text-base',
      icon: 'h-5 w-5',
      iconPadding: icon && iconPosition === 'left' ? 'pl-12' : icon && iconPosition === 'right' ? 'pr-12' : '',
    },
  };

  const currentSize = sizes[size] || sizes.medium;

  // Icons
  const EyeIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  const EyeOffIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );

  const ClearIcon = () => (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  const CheckIcon = () => (
    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const ErrorIcon = () => (
    <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  // Determine input type for password toggle
  const inputType = type === 'password' && showPassword ? 'text' : type;

  // Border color based on state
  const getBorderClass = () => {
    if (error) return 'border-red-300 focus:border-red-500 focus:ring-red-500';
    if (success) return 'border-green-300 focus:border-green-500 focus:ring-green-500';
    if (isFocused) return 'border-teal-500 ring-2 ring-teal-500/20';
    return 'border-gray-300 hover:border-gray-400 focus:border-teal-500 focus:ring-teal-500';
  };

  return (
    <div className={`mb-4 ${className}`}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={name}
          className={`block ${currentSize.label} font-medium text-gray-700 mb-1.5`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Prefix */}
        {prefix && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="text-gray-500 text-sm">{prefix}</span>
          </div>
        )}

        {/* Left Icon */}
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className={`${currentSize.icon} text-gray-400`}>
              {icon}
            </span>
          </div>
        )}

        {/* Input Field */}
        <input
          type={inputType}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full
            ${currentSize.input}
            ${currentSize.iconPadding}
            ${prefix ? 'pl-8' : ''}
            ${suffix || type === 'password' || clearable || error || success ? 'pr-10' : ''}
            bg-white
            border rounded-xl
            ${getBorderClass()}
            placeholder-gray-400
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${error ? 'pr-10' : ''}
            ${success ? 'pr-10' : ''}
          `}
          {...props}
        />

        {/* Right Side Icons/Elements */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-1">
          {/* Clear Button */}
          {clearable && value && !disabled && (
            <button
              type="button"
              onClick={onClear}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ClearIcon />
            </button>
          )}

          {/* Password Toggle */}
          {type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          )}

          {/* Success Icon */}
          {success && !error && <CheckIcon />}

          {/* Error Icon */}
          {error && <ErrorIcon />}

          {/* Right Icon */}
          {icon && iconPosition === 'right' && !error && !success && (
            <span className={`${currentSize.icon} text-gray-400`}>
              {icon}
            </span>
          )}

          {/* Suffix */}
          {suffix && (
            <span className="text-gray-500 text-sm">{suffix}</span>
          )}
        </div>
      </div>

      {/* Hint Text */}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-gray-500 flex items-center gap-1">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {hint}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}

      {/* Success Message */}
      {success && typeof success === 'string' && (
        <p className="mt-1.5 text-xs text-green-600 flex items-center gap-1">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {success}
        </p>
      )}
    </div>
  );
};

// Textarea Component
export const Textarea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  hint = '',
  rows = 4,
  maxLength,
  showCount = false,
  resize = 'vertical', // 'none' | 'vertical' | 'horizontal' | 'both'
  className = '',
  ...props
}) => {

  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize',
  };

  return (
    <div className={`mb-4 ${className}`}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Textarea */}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={`
          w-full px-4 py-3 text-sm
          bg-white border rounded-xl
          ${error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
            : 'border-gray-300 hover:border-gray-400 focus:border-teal-500 focus:ring-teal-500'
          }
          placeholder-gray-400
          transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-offset-0
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          ${resizeClasses[resize] || resizeClasses.vertical}
        `}
        {...props}
      />

      {/* Footer: Hint/Error + Character Count */}
      <div className="flex items-center justify-between mt-1.5">
        <div>
          {hint && !error && (
            <p className="text-xs text-gray-500">{hint}</p>
          )}
          {error && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          )}
        </div>
        {showCount && maxLength && (
          <span className={`text-xs ${value?.length >= maxLength ? 'text-red-500' : 'text-gray-400'}`}>
            {value?.length || 0}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

// Search Input Component
export const SearchInput = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Search...',
  size = 'medium',
  loading = false,
  clearable = true,
  className = '',
}) => {

  const sizes = {
    small: 'px-3 py-2 text-sm pl-9',
    medium: 'px-4 py-2.5 text-sm pl-10',
    large: 'px-4 py-3 text-base pl-11',
  };

  const SearchIcon = () => (
    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );

  const LoadingSpinner = () => (
    <svg className="animate-spin h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Icon */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        {loading ? <LoadingSpinner /> : <SearchIcon />}
      </div>

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`
          w-full
          ${sizes[size] || sizes.medium}
          ${value && clearable ? 'pr-10' : 'pr-4'}
          bg-white border border-gray-300 rounded-xl
          placeholder-gray-400
          transition-all duration-200
          hover:border-gray-400
          focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20
        `}
      />

      {/* Clear Button */}
      {clearable && value && (
        <button
          type="button"
          onClick={() => onChange({ target: { value: '' } })}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

// Input with Label and Icon (commonly used pattern)
export const IconInput = ({
  label,
  icon,
  ...props
}) => {
  return (
    <Input
      label={label}
      icon={icon}
      iconPosition="left"
      {...props}
    />
  );
};

export default Input;