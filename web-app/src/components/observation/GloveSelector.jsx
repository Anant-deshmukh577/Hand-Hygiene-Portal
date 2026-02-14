/* --- SVG Icons --- */
const GloveOnIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
  </svg>
);

const GloveOffIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
  </svg>
);

const HandIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
  </svg>
);

const CheckIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const GloveSelector = ({ 
  selected, 
  onChange, 
  disabled = false,
  error,
  label = "Glove Status",
  showHint = true,
  variant = 'cards' // 'cards' or 'buttons'
}) => {

  const options = [
    {
      value: 'on',
      label: 'Gloves On',
      description: 'Healthcare worker is wearing gloves',
      icon: <GloveOnIcon />,
      color: 'teal',
      bgSelected: 'bg-teal-50 border-teal-500 ring-teal-500/20',
      bgUnselected: 'bg-white border-gray-200 hover:border-teal-300 hover:bg-teal-50/30',
      iconBg: 'bg-teal-100 text-teal-600',
      iconBgSelected: 'bg-teal-600 text-white',
    },
    {
      value: 'off',
      label: 'Gloves Off',
      description: 'Healthcare worker is not wearing gloves',
      icon: <GloveOffIcon />,
      color: 'gray',
      bgSelected: 'bg-gray-100 border-gray-500 ring-gray-500/20',
      bgUnselected: 'bg-white border-gray-200 hover:border-gray-400 hover:bg-gray-50',
      iconBg: 'bg-gray-100 text-gray-500',
      iconBgSelected: 'bg-gray-600 text-white',
    },
  ];

  // Button variant (compact)
  if (variant === 'buttons') {
    return (
      <div className="space-y-2">
        {/* Label */}
        <label className="block text-sm font-semibold text-gray-900">
          {label}
        </label>

        {/* Button Group */}
        <div className="inline-flex rounded-xl bg-gray-100 p-1">
          {options.map((option) => {
            const isSelected = selected === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(option.value)}
                disabled={disabled}
                className={`
                  relative flex items-center gap-2 px-4 py-2.5 rounded-lg
                  text-sm font-medium
                  transition-all duration-200
                  ${isSelected 
                    ? 'bg-white text-gray-900 shadow-md' 
                    : 'text-gray-600 hover:text-gray-900'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <span className={isSelected ? 'text-teal-600' : 'text-gray-400'}>
                  {option.icon}
                </span>
                {option.label}
              </button>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }

  // Card variant (default)
  return (
    <div className="space-y-3">
      
      {/* ==================== LABEL ==================== */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600">
          <HandIcon />
        </div>
        <label className="block text-sm font-semibold text-gray-900">
          {label}
        </label>
      </div>

      {/* ==================== OPTIONS CONTAINER ==================== */}
      <div className={`
        p-4 rounded-2xl border-2 transition-all duration-300
        ${error 
          ? 'border-red-300 bg-red-50/30' 
          : 'border-gray-100 bg-gradient-to-br from-gray-50 to-white'
        }
        ${disabled ? 'opacity-60 pointer-events-none' : ''}
      `}>
        
        {/* Options Grid */}
        <div className="grid grid-cols-2 gap-4">
          {options.map((option) => {
            const isSelected = selected === option.value;
            
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(option.value)}
                disabled={disabled}
                className={`
                  group relative p-5 rounded-xl border-2 text-center
                  transition-all duration-300
                  ${isSelected 
                    ? `${option.bgSelected} ring-2 shadow-lg` 
                    : option.bgUnselected
                  }
                  ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                  hover:shadow-md hover:-translate-y-0.5
                `}
              >
                {/* Selected Check Indicator */}
                {isSelected && (
                  <div className={`
                    absolute top-3 right-3 
                    ${option.value === 'on' ? 'text-teal-600' : 'text-gray-600'}
                  `}>
                    <CheckIcon />
                  </div>
                )}

                {/* Icon */}
                <div className={`
                  w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4
                  transition-all duration-300 shadow-lg
                  ${isSelected ? option.iconBgSelected : option.iconBg}
                  ${isSelected 
                    ? (option.value === 'on' ? 'shadow-teal-500/30' : 'shadow-gray-500/30')
                    : 'shadow-black/5'
                  }
                  ${!isSelected ? 'group-hover:scale-110' : ''}
                `}>
                  {option.icon}
                </div>

                {/* Label */}
                <h4 className={`
                  text-base font-bold mb-1
                  ${isSelected ? 'text-gray-900' : 'text-gray-700'}
                `}>
                  {option.label}
                </h4>

                {/* Description */}
                <p className="text-xs text-gray-500 leading-relaxed">
                  {option.description}
                </p>

                {/* Custom Radio Indicator */}
                <div className="mt-4 flex justify-center">
                  <div className={`
                    w-5 h-5 rounded-full border-2 
                    flex items-center justify-center
                    transition-all duration-300
                    ${isSelected 
                      ? (option.value === 'on' 
                          ? 'border-teal-600 bg-teal-600' 
                          : 'border-gray-600 bg-gray-600'
                        )
                      : 'border-gray-300 bg-white'
                    }
                  `}>
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Status Summary */}
        {selected && (
          <div className={`
            mt-4 p-3 rounded-xl flex items-center justify-center gap-3
            ${selected === 'on' 
              ? 'bg-teal-50 border border-teal-200' 
              : 'bg-gray-100 border border-gray-200'
            }
          `}>
            <div className={`
              w-8 h-8 rounded-lg flex items-center justify-center
              ${selected === 'on' ? 'bg-teal-600 text-white' : 'bg-gray-500 text-white'}
            `}>
              {selected === 'on' ? <ShieldIcon /> : <GloveOffIcon className="h-4 w-4" />}
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Current Status
              </p>
              <p className={`text-sm font-bold ${selected === 'on' ? 'text-teal-700' : 'text-gray-700'}`}>
                {selected === 'on' ? 'Gloves On - Protected' : 'Gloves Off - Unprotected'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ==================== ERROR MESSAGE ==================== */}
      {error && (
        <div className="flex items-center gap-2 text-red-600">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* ==================== HINT TEXT ==================== */}
      {showHint && (
        <p className="text-xs text-gray-500">
          Indicate whether the healthcare worker was wearing gloves during the observation.
        </p>
      )}
    </div>
  );
};

export default GloveSelector;