import { ADHERENCE_OPTIONS } from '../../utils/constants';

/* --- SVG Icons --- */
const HandWashIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ExclamationCircleIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircleIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DropletIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2.25c0 0-6.75 8.25-6.75 12a6.75 6.75 0 1013.5 0c0-3.75-6.75-12-6.75-12z" />
  </svg>
);

const StarIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

// Get icon and color config based on option value
const getOptionConfig = (value, points) => {
  // Determine by points or value
  if (points >= 2 || value === 'compliant' || value === 'hand_rub' || value === 'hand_wash') {
    return {
      icon: <CheckCircleIcon />,
      color: 'green',
      bgSelected: 'bg-green-50 border-green-500 ring-green-500/20',
      bgUnselected: 'bg-white border-gray-200 hover:border-green-300 hover:bg-green-50/30',
      iconBg: 'bg-green-100 text-green-600',
      iconBgSelected: 'bg-green-600 text-white',
      pointsBg: 'bg-green-100 text-green-700',
      gradient: 'from-green-500 to-emerald-600',
    };
  }
  if (points === 1 || value === 'partial' || value === 'gloves_only') {
    return {
      icon: <ExclamationCircleIcon />,
      color: 'amber',
      bgSelected: 'bg-amber-50 border-amber-500 ring-amber-500/20',
      bgUnselected: 'bg-white border-gray-200 hover:border-amber-300 hover:bg-amber-50/30',
      iconBg: 'bg-amber-100 text-amber-600',
      iconBgSelected: 'bg-amber-600 text-white',
      pointsBg: 'bg-amber-100 text-amber-700',
      gradient: 'from-amber-500 to-orange-600',
    };
  }
  // Non-compliant or 0 points
  return {
    icon: <XCircleIcon />,
    color: 'red',
    bgSelected: 'bg-red-50 border-red-500 ring-red-500/20',
    bgUnselected: 'bg-white border-gray-200 hover:border-red-300 hover:bg-red-50/30',
    iconBg: 'bg-red-100 text-red-600',
    iconBgSelected: 'bg-red-600 text-white',
    pointsBg: 'bg-red-100 text-red-700',
    gradient: 'from-red-500 to-rose-600',
  };
};

const HygieneStatusSelector = ({ 
  selected, 
  onChange, 
  error,
  disabled = false,
  label = "Hand Hygiene Status",
  showPoints = true,
  variant = 'cards' // 'cards', 'list', 'compact'
}) => {

  // Default adherence options if not imported
  const adherenceOptions = ADHERENCE_OPTIONS || [
    { value: 'hand_rub', label: 'Hand Rub (Alcohol-based)', points: 2 },
    { value: 'hand_wash', label: 'Hand Wash (Soap & Water)', points: 2 },
    { value: 'gloves_only', label: 'Gloves Only (No Hand Hygiene)', points: 1 },
    { value: 'missed', label: 'Missed Opportunity', points: 0 },
  ];

  // Compact List Variant
  if (variant === 'list') {
    return (
      <div className="space-y-3">
        {/* Label */}
        <label className="block text-sm font-semibold text-gray-900">
          {label} <span className="text-red-500">*</span>
        </label>

        {/* Options Container */}
        <div className={`
          rounded-2xl border-2 overflow-hidden
          ${error ? 'border-red-300 bg-red-50/30' : 'border-gray-100'}
          ${disabled ? 'opacity-60 pointer-events-none' : ''}
        `}>
          {adherenceOptions.map((option, index) => {
            const config = getOptionConfig(option.value, option.points);
            const isSelected = selected === option.value;
            const isLast = index === adherenceOptions.length - 1;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(option.value)}
                disabled={disabled}
                className={`
                  w-full flex items-center justify-between p-4
                  transition-all duration-200
                  ${!isLast ? 'border-b border-gray-100' : ''}
                  ${isSelected 
                    ? `${config.bgSelected}` 
                    : 'bg-white hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  {/* Radio Indicator */}
                  <div className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center
                    transition-all duration-200
                    ${isSelected 
                      ? `border-${config.color}-600 bg-${config.color}-600` 
                      : 'border-gray-300 bg-white'
                    }
                  `}
                  style={{
                    borderColor: isSelected ? (config.color === 'green' ? '#16a34a' : config.color === 'amber' ? '#d97706' : '#dc2626') : undefined,
                    backgroundColor: isSelected ? (config.color === 'green' ? '#16a34a' : config.color === 'amber' ? '#d97706' : '#dc2626') : undefined,
                  }}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>

                  {/* Label */}
                  <span className={`font-medium ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                    {option.label}
                  </span>
                </div>

                {/* Points Badge */}
                {showPoints && (
                  <span className={`
                    inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-bold
                    ${config.pointsBg}
                  `}>
                    <StarIcon />
                    {option.points} pt{option.points !== 1 ? 's' : ''}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-red-600">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
      </div>
    );
  }

  // Cards Variant (Default)
  return (
    <div className="space-y-4">
      
      {/* ==================== HEADER ==================== */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/30">
          <HandWashIcon />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900">
            {label} <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500">Select the observed hand hygiene practice</p>
        </div>
      </div>

      {/* ==================== OPTIONS CONTAINER ==================== */}
      <div className={`
        p-5 rounded-2xl border-2 transition-all duration-300
        ${error 
          ? 'border-red-300 bg-red-50/30' 
          : 'border-gray-100 bg-gradient-to-br from-gray-50 to-white'
        }
        ${disabled ? 'opacity-60 pointer-events-none' : ''}
      `}>
        
        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {adherenceOptions.map((option) => {
            const config = getOptionConfig(option.value, option.points);
            const isSelected = selected === option.value;
            
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(option.value)}
                disabled={disabled}
                className={`
                  group relative p-5 rounded-xl border-2 text-left
                  transition-all duration-300
                  ${isSelected 
                    ? `${config.bgSelected} ring-2 shadow-lg` 
                    : config.bgUnselected
                  }
                  ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                  hover:shadow-md hover:-translate-y-0.5
                `}
              >
                {/* Selected Check Indicator */}
                {isSelected && (
                  <div className={`
                    absolute top-3 right-3 
                    ${config.color === 'green' ? 'text-green-600' : 
                      config.color === 'amber' ? 'text-amber-600' : 'text-red-600'}
                  `}>
                    <CheckIcon />
                  </div>
                )}

                {/* Points Badge (Top Right) */}
                {showPoints && (
                  <div className={`
                    absolute top-3 ${isSelected ? 'right-10' : 'right-3'}
                    inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold
                    ${config.pointsBg}
                    transition-all duration-200
                  `}>
                    <StarIcon className="h-3 w-3" />
                    {option.points}
                  </div>
                )}

                {/* Icon */}
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center mb-4
                  transition-all duration-300 shadow-lg
                  ${isSelected ? config.iconBgSelected : config.iconBg}
                  ${isSelected 
                    ? `shadow-${config.color}-500/30`
                    : 'shadow-black/5'
                  }
                  ${!isSelected ? 'group-hover:scale-110' : ''}
                `}
                style={{
                  boxShadow: isSelected 
                    ? (config.color === 'green' ? '0 10px 15px -3px rgba(22, 163, 74, 0.3)' : 
                       config.color === 'amber' ? '0 10px 15px -3px rgba(217, 119, 6, 0.3)' :
                       '0 10px 15px -3px rgba(220, 38, 38, 0.3)')
                    : undefined
                }}
                >
                  {config.icon}
                </div>

                {/* Label */}
                <h4 className={`
                  text-sm font-bold mb-1
                  ${isSelected ? 'text-gray-900' : 'text-gray-700'}
                `}>
                  {option.label}
                </h4>

                {/* Points Text */}
                {showPoints && (
                  <p className={`
                    text-xs
                    ${config.color === 'green' ? 'text-green-600' : 
                      config.color === 'amber' ? 'text-amber-600' : 'text-red-600'}
                  `}>
                    {option.points > 0 
                      ? `+${option.points} point${option.points !== 1 ? 's' : ''}`
                      : 'No points'
                    }
                  </p>
                )}

                {/* Custom Radio Indicator */}
                <div className="absolute bottom-4 right-4">
                  <div className={`
                    w-5 h-5 rounded-full border-2 
                    flex items-center justify-center
                    transition-all duration-300
                  `}
                  style={{
                    borderColor: isSelected 
                      ? (config.color === 'green' ? '#16a34a' : config.color === 'amber' ? '#d97706' : '#dc2626')
                      : '#d1d5db',
                    backgroundColor: isSelected 
                      ? (config.color === 'green' ? '#16a34a' : config.color === 'amber' ? '#d97706' : '#dc2626')
                      : 'white',
                  }}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </div>

                {/* Left Border Indicator */}
                <div className={`
                  absolute left-0 top-0 bottom-0 w-1 rounded-l-xl
                  transition-opacity duration-300
                  bg-gradient-to-b ${config.gradient}
                  ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}
                `} />
              </button>
            );
          })}
        </div>

        {/* Selected Summary */}
        {selected && (
          <div className={`
            mt-5 p-4 rounded-xl border flex items-center gap-4
            ${getOptionConfig(selected, adherenceOptions.find(o => o.value === selected)?.points).bgSelected.split(' ')[0]}
            ${getOptionConfig(selected, adherenceOptions.find(o => o.value === selected)?.points).bgSelected.split(' ')[1]}
          `}>
            <div className={`
              w-10 h-10 rounded-xl flex items-center justify-center
              ${getOptionConfig(selected, adherenceOptions.find(o => o.value === selected)?.points).iconBgSelected}
            `}>
              <ShieldCheckIcon />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Selected Status
              </p>
              <p className="text-sm font-bold text-gray-900">
                {adherenceOptions.find(o => o.value === selected)?.label}
              </p>
            </div>
            {showPoints && (
              <div className={`
                px-3 py-1.5 rounded-lg text-sm font-bold
                ${getOptionConfig(selected, adherenceOptions.find(o => o.value === selected)?.points).pointsBg}
              `}>
                {adherenceOptions.find(o => o.value === selected)?.points > 0 
                  ? `+${adherenceOptions.find(o => o.value === selected)?.points} pts`
                  : '0 pts'
                }
              </div>
            )}
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

      {/* ==================== LEGEND ==================== */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Compliant (2 pts)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <span>Partial (1 pt)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Non-Compliant (0 pts)</span>
        </div>
      </div>
    </div>
  );
};

export default HygieneStatusSelector;