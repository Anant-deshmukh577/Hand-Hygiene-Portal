import { useState } from 'react';

// Check Icon Component
const CheckIcon = ({ className }) => (
  <svg 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
    strokeWidth={3}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

// Indeterminate Icon Component (minus)
const IndeterminateIcon = ({ className }) => (
  <svg 
    className={className} 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor"
    strokeWidth={3}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
  </svg>
);

const Checkbox = ({ 
  label, 
  name, 
  checked, 
  onChange, 
  disabled = false,
  size = 'medium',
  variant = 'default',
  description = '',
  error = '',
  indeterminate = false,
}) => {

  // Size styles
  const sizes = {
    small: {
      box: 'w-4 h-4',
      icon: 'h-2.5 w-2.5',
      label: 'text-sm',
      description: 'text-xs',
    },
    medium: {
      box: 'w-5 h-5',
      icon: 'h-3 w-3',
      label: 'text-sm',
      description: 'text-xs',
    },
    large: {
      box: 'w-6 h-6',
      icon: 'h-4 w-4',
      label: 'text-base',
      description: 'text-sm',
    },
  };

  // Variant styles
  const variants = {
    default: {
      checked: 'bg-teal-600 border-teal-600',
      unchecked: 'bg-white border-gray-300 hover:border-teal-500',
      focus: 'focus:ring-teal-500',
    },
    success: {
      checked: 'bg-green-600 border-green-600',
      unchecked: 'bg-white border-gray-300 hover:border-green-500',
      focus: 'focus:ring-green-500',
    },
    danger: {
      checked: 'bg-red-600 border-red-600',
      unchecked: 'bg-white border-gray-300 hover:border-red-500',
      focus: 'focus:ring-red-500',
    },
  };

  const currentSize = sizes[size] || sizes.medium;
  const currentVariant = variants[variant] || variants.default;

  return (
    <div className="relative">
      <label className={`
        inline-flex items-start gap-3 
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        group
      `}>
        {/* Custom Checkbox */}
        <div className="relative flex items-center justify-center mt-0.5">
          <input
            type="checkbox"
            name={name}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="sr-only peer"
          />
          
          {/* Checkbox Box */}
          <div className={`
            ${currentSize.box}
            rounded-md border-2
            flex items-center justify-center
            transition-all duration-200
            ${checked || indeterminate
              ? currentVariant.checked
              : `${currentVariant.unchecked} ${!disabled ? 'group-hover:border-teal-400' : ''}`
            }
            ${!disabled ? `peer-focus:ring-2 peer-focus:ring-offset-2 ${currentVariant.focus}` : ''}
            ${error ? 'border-red-500' : ''}
          `}>
            {/* Check/Indeterminate Icon */}
            <span className={`
              transform transition-all duration-200
              ${checked || indeterminate ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
            `}>
              {indeterminate ? (
                <IndeterminateIcon className={`${currentSize.icon} text-white`} />
              ) : (
                <CheckIcon className={`${currentSize.icon} text-white`} />
              )}
            </span>
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

// Checkbox Group Component
export const CheckboxGroup = ({
  label,
  options = [],
  selectedValues = [],
  onChange,
  direction = 'vertical', // 'vertical' | 'horizontal'
  disabled = false,
  error = '',
}) => {

  const handleChange = (value) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <div className="space-y-2">
      {/* Group Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      {/* Options */}
      <div className={`
        ${direction === 'horizontal' 
          ? 'flex flex-wrap gap-4' 
          : 'space-y-3'
        }
      `}>
        {options.map((option) => (
          <Checkbox
            key={option.value}
            name={option.value}
            label={option.label}
            description={option.description}
            checked={selectedValues.includes(option.value)}
            onChange={() => handleChange(option.value)}
            disabled={disabled || option.disabled}
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

// Toggle/Switch Component
export const Toggle = ({
  label,
  name,
  checked,
  onChange,
  disabled = false,
  size = 'medium',
  description = '',
}) => {

  const sizes = {
    small: {
      track: 'w-8 h-4',
      thumb: 'w-3 h-3',
      translate: 'translate-x-4',
      label: 'text-sm',
    },
    medium: {
      track: 'w-11 h-6',
      thumb: 'w-5 h-5',
      translate: 'translate-x-5',
      label: 'text-sm',
    },
    large: {
      track: 'w-14 h-7',
      thumb: 'w-6 h-6',
      translate: 'translate-x-7',
      label: 'text-base',
    },
  };

  const currentSize = sizes[size] || sizes.medium;

  return (
    <label className={`
      inline-flex items-center gap-3 
      ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
      group
    `}>
      {/* Toggle Switch */}
      <div className="relative">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only peer"
        />
        
        {/* Track */}
        <div className={`
          ${currentSize.track}
          rounded-full
          transition-colors duration-300
          ${checked 
            ? 'bg-teal-600' 
            : 'bg-gray-200 group-hover:bg-gray-300'
          }
          peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-teal-500
        `} />
        
        {/* Thumb */}
        <div className={`
          absolute top-0.5 left-0.5
          ${currentSize.thumb}
          bg-white rounded-full shadow-md
          transition-transform duration-300
          ${checked ? currentSize.translate : 'translate-x-0'}
        `} />
      </div>

      {/* Label & Description */}
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className={`
              ${currentSize.label} 
              font-medium text-gray-700
              group-hover:text-gray-900
              transition-colors duration-200
            `}>
              {label}
            </span>
          )}
          {description && (
            <span className="text-xs text-gray-500 mt-0.5">
              {description}
            </span>
          )}
        </div>
      )}
    </label>
  );
};

// Card Checkbox (Selectable Card)
export const CardCheckbox = ({
  label,
  description,
  icon,
  checked,
  onChange,
  disabled = false,
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
        type="checkbox"
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
        {label && (
          <p className={`
            font-medium 
            ${checked ? 'text-teal-700' : 'text-gray-900'}
          `}>
            {label}
          </p>
        )}
        {description && (
          <p className="text-sm text-gray-500 mt-0.5">
            {description}
          </p>
        )}
      </div>

      {/* Check Indicator */}
      <div className={`
        flex-shrink-0 w-5 h-5 rounded-full border-2
        flex items-center justify-center
        transition-all duration-200
        ${checked 
          ? 'bg-teal-600 border-teal-600' 
          : 'border-gray-300'
        }
      `}>
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
    </label>
  );
};

export default Checkbox;