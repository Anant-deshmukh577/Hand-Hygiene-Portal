import { useState, useRef, useEffect } from 'react';

const Textarea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  success = false,
  hint = '',
  rows = 4,
  maxLength,
  minLength,
  showCount = false,
  resize = 'vertical', // 'none' | 'vertical' | 'horizontal' | 'both'
  autoResize = false,
  size = 'medium',
  className = '',
  ...props
}) => {

  const textareaRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  // Size configurations
  const sizes = {
    small: {
      textarea: 'px-3 py-2 text-sm',
      label: 'text-xs',
    },
    medium: {
      textarea: 'px-4 py-3 text-sm',
      label: 'text-sm',
    },
    large: {
      textarea: 'px-4 py-3.5 text-base',
      label: 'text-base',
    },
  };

  // Resize configurations
  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize',
  };

  const currentSize = sizes[size] || sizes.medium;

  // Auto resize functionality
  useEffect(() => {
    if (autoResize && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value, autoResize]);

  // Character count
  const charCount = value?.length || 0;
  const isOverLimit = maxLength && charCount > maxLength;
  const isUnderLimit = minLength && charCount < minLength;

  // Border color based on state
  const getBorderClass = () => {
    if (error || isOverLimit) return 'border-red-300 focus:border-red-500 focus:ring-red-500';
    if (success) return 'border-green-300 focus:border-green-500 focus:ring-green-500';
    if (isFocused) return 'border-teal-500 ring-2 ring-teal-500/20';
    return 'border-gray-300 hover:border-gray-400 focus:border-teal-500 focus:ring-teal-500';
  };

  // Icons
  const ErrorIcon = () => (
    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  );

  const SuccessIcon = () => (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const HintIcon = () => (
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

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

      {/* Textarea Container */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={autoResize ? 1 : rows}
          maxLength={maxLength}
          minLength={minLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            w-full
            ${currentSize.textarea}
            bg-white border rounded-xl
            ${getBorderClass()}
            placeholder-gray-400
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-0
            disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
            ${autoResize ? 'resize-none overflow-hidden' : resizeClasses[resize] || resizeClasses.vertical}
          `}
          {...props}
        />

        {/* Status Icon (top right corner) */}
        {(error || success) && (
          <div className="absolute top-3 right-3 pointer-events-none">
            {error && (
              <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {success && !error && (
              <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
        )}
      </div>

      {/* Footer: Hint/Error + Character Count */}
      <div className="flex items-start justify-between mt-1.5 gap-4">
        <div className="flex-1">
          {/* Hint Text */}
          {hint && !error && !success && (
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <HintIcon />
              {hint}
            </p>
          )}

          {/* Error Message */}
          {error && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <ErrorIcon />
              {error}
            </p>
          )}

          {/* Success Message */}
          {success && typeof success === 'string' && !error && (
            <p className="text-xs text-green-600 flex items-center gap-1">
              <SuccessIcon />
              {success}
            </p>
          )}

          {/* Min Length Warning */}
          {minLength && isUnderLimit && !error && (
            <p className="text-xs text-amber-600 flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Minimum {minLength} characters required
            </p>
          )}
        </div>

        {/* Character Count */}
        {showCount && (
          <span className={`
            text-xs flex-shrink-0
            ${isOverLimit 
              ? 'text-red-500 font-medium' 
              : charCount > 0 && maxLength && charCount >= maxLength * 0.9
                ? 'text-amber-500'
                : 'text-gray-400'
            }
          `}>
            {charCount}{maxLength ? `/${maxLength}` : ''}
          </span>
        )}
      </div>
    </div>
  );
};

// Rich Textarea with formatting toolbar (optional)
export const RichTextarea = ({
  label,
  name,
  value,
  onChange,
  placeholder = 'Start typing...',
  required = false,
  disabled = false,
  error,
  hint = '',
  rows = 6,
  maxLength,
  showCount = true,
  className = '',
}) => {

  const textareaRef = useRef(null);

  // Format text helper
  const insertFormat = (before, after = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange({ target: { name, value: newText } });
    
    // Set cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  // Toolbar buttons
  const toolbarButtons = [
    { 
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12h12" />
        </svg>
      ), 
      action: () => insertFormat('**', '**'),
      title: 'Bold'
    },
    { 
      icon: (
        <svg className="h-4 w-4 italic" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 4v3h2.21l-3.42 10H6v3h8v-3h-2.21l3.42-10H18V4h-8z"/>
        </svg>
      ), 
      action: () => insertFormat('_', '_'),
      title: 'Italic'
    },
    { 
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
        </svg>
      ), 
      action: () => insertFormat('• '),
      title: 'Bullet Point'
    },
    { 
      icon: (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      ), 
      action: () => insertFormat('1. '),
      title: 'Numbered List'
    },
  ];

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

      {/* Textarea Container with Toolbar */}
      <div className={`
        border rounded-xl overflow-hidden
        ${error 
          ? 'border-red-300' 
          : 'border-gray-300 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/20'
        }
        transition-all duration-200
      `}>
        {/* Toolbar */}
        <div className="flex items-center gap-1 px-3 py-2 bg-gray-50 border-b border-gray-200">
          {toolbarButtons.map((button, index) => (
            <button
              key={index}
              type="button"
              onClick={button.action}
              disabled={disabled}
              title={button.title}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {button.icon}
            </button>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          className="w-full px-4 py-3 text-sm bg-white border-0 placeholder-gray-400 focus:outline-none resize-y disabled:bg-gray-50 disabled:cursor-not-allowed"
        />

        {/* Footer */}
        <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-t border-gray-200">
          <span className="text-xs text-gray-500">
            {hint || 'Use **text** for bold, _text_ for italic'}
          </span>
          {showCount && (
            <span className={`text-xs ${maxLength && value?.length >= maxLength ? 'text-red-500' : 'text-gray-400'}`}>
              {value?.length || 0}{maxLength ? `/${maxLength}` : ''}
            </span>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

// Expandable Textarea (click to expand)
export const ExpandableTextarea = ({
  label,
  name,
  value,
  onChange,
  placeholder = 'Click to add notes...',
  required = false,
  disabled = false,
  error,
  maxLength,
  showCount = true,
  className = '',
}) => {

  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (isExpanded && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isExpanded]);

  // Collapse when clicking outside (if empty)
  const handleBlur = () => {
    if (!value || value.trim() === '') {
      setIsExpanded(false);
    }
  };

  if (!isExpanded && (!value || value.trim() === '')) {
    return (
      <div className={`mb-4 ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          disabled={disabled}
          className={`
            w-full px-4 py-3 text-left text-sm
            bg-gray-50 border border-dashed border-gray-300 rounded-xl
            text-gray-400 hover:border-teal-400 hover:text-gray-500 hover:bg-gray-100
            transition-all duration-200
            disabled:cursor-not-allowed disabled:opacity-50
          `}
        >
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {placeholder}
          </span>
        </button>
      </div>
    );
  }

  return (
    <Textarea
      ref={textareaRef}
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      error={error}
      maxLength={maxLength}
      showCount={showCount}
      rows={4}
      autoResize
      className={className}
      onBlur={handleBlur}
    />
  );
};

export default Textarea;