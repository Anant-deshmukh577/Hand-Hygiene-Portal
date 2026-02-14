import { WHO_MOMENTS } from '../../utils/constants';

/* --- SVG Icons --- */
const HandRaisedIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
  </svg>
);

const BeakerIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
  </svg>
);

const DropletIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2.25c0 0-6.75 8.25-6.75 12a6.75 6.75 0 1013.5 0c0-3.75-6.75-12-6.75-12z" />
  </svg>
);

const UserCheckIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
  </svg>
);

const HandWashIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
  </svg>
);

const CheckIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const ExclamationIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

// Get moment-specific styling
const getMomentConfig = (id) => {
  const configs = {
    1: {
      icon: <HandRaisedIcon />,
      color: 'teal',
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      selectedBg: 'bg-teal-100',
      selectedBorder: 'border-teal-500',
      iconBg: 'bg-teal-100 text-teal-600',
      iconBgSelected: 'bg-teal-600 text-white',
      gradient: 'from-teal-500 to-emerald-600',
      ring: 'ring-teal-500/20',
    },
    2: {
      icon: <BeakerIcon />,
      color: 'blue',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      selectedBg: 'bg-blue-100',
      selectedBorder: 'border-blue-500',
      iconBg: 'bg-blue-100 text-blue-600',
      iconBgSelected: 'bg-blue-600 text-white',
      gradient: 'from-blue-500 to-indigo-600',
      ring: 'ring-blue-500/20',
    },
    3: {
      icon: <DropletIcon />,
      color: 'rose',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      selectedBg: 'bg-rose-100',
      selectedBorder: 'border-rose-500',
      iconBg: 'bg-rose-100 text-rose-600',
      iconBgSelected: 'bg-rose-600 text-white',
      gradient: 'from-rose-500 to-pink-600',
      ring: 'ring-rose-500/20',
    },
    4: {
      icon: <UserCheckIcon />,
      color: 'amber',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      selectedBg: 'bg-amber-100',
      selectedBorder: 'border-amber-500',
      iconBg: 'bg-amber-100 text-amber-600',
      iconBgSelected: 'bg-amber-600 text-white',
      gradient: 'from-amber-500 to-orange-600',
      ring: 'ring-amber-500/20',
    },
    5: {
      icon: <BuildingIcon />,
      color: 'purple',
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      selectedBg: 'bg-purple-100',
      selectedBorder: 'border-purple-500',
      iconBg: 'bg-purple-100 text-purple-600',
      iconBgSelected: 'bg-purple-600 text-white',
      gradient: 'from-purple-500 to-violet-600',
      ring: 'ring-purple-500/20',
    },
  };
  return configs[id] || configs[1];
};

const WHOMomentSelector = ({ 
  selected, 
  onChange, 
  error,
  disabled = false,
  variant = 'cards' // 'cards', 'list', 'compact'
}) => {

  // Default WHO moments if not imported
  const whoMoments = WHO_MOMENTS || [
    { id: 1, value: 'moment_1', label: 'Before touching a patient' },
    { id: 2, value: 'moment_2', label: 'Before aseptic procedure' },
    { id: 3, value: 'moment_3', label: 'After body fluid exposure risk' },
    { id: 4, value: 'moment_4', label: 'After touching a patient' },
    { id: 5, value: 'moment_5', label: 'After touching patient surroundings' },
  ];

  // List Variant (Compact)
  if (variant === 'list') {
    return (
      <div className="space-y-3">
        {/* Label */}
        <label className="block text-sm font-semibold text-gray-900">
          WHO 5 Moment <span className="text-red-500">*</span>
        </label>

        {/* List Container */}
        <div className={`
          rounded-2xl border-2 overflow-hidden
          ${error ? 'border-red-300 bg-red-50/30' : 'border-gray-100'}
          ${disabled ? 'opacity-60 pointer-events-none' : ''}
        `}>
          {whoMoments.map((moment, index) => {
            const config = getMomentConfig(moment.id);
            const isSelected = selected === moment.value;
            const isLast = index === whoMoments.length - 1;

            return (
              <button
                key={moment.value}
                type="button"
                onClick={() => onChange(moment.value)}
                disabled={disabled}
                className={`
                  w-full flex items-center gap-4 p-4
                  transition-all duration-200
                  ${!isLast ? 'border-b border-gray-100' : ''}
                  ${isSelected 
                    ? `${config.selectedBg}` 
                    : 'bg-white hover:bg-gray-50'
                  }
                `}
              >
                {/* Radio Indicator */}
                <div className={`
                  w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0
                  transition-all duration-200
                `}
                style={{
                  borderColor: isSelected ? (config.color === 'teal' ? '#0d9488' : config.color === 'blue' ? '#2563eb' : config.color === 'rose' ? '#e11d48' : config.color === 'amber' ? '#d97706' : '#9333ea') : '#d1d5db',
                  backgroundColor: isSelected ? (config.color === 'teal' ? '#0d9488' : config.color === 'blue' ? '#2563eb' : config.color === 'rose' ? '#e11d48' : config.color === 'amber' ? '#d97706' : '#9333ea') : 'white',
                }}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>

                {/* Moment Number */}
                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0
                  ${isSelected ? config.iconBgSelected : config.iconBg}
                `}>
                  {moment.id}
                </div>

                {/* Label */}
                <span className={`text-left font-medium ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                  {moment.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-red-600">
            <ExclamationIcon />
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
            WHO 5 Moment <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-gray-500">Select the critical hand hygiene moment</p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {whoMoments.map((moment) => {
            const config = getMomentConfig(moment.id);
            const isSelected = selected === moment.value;
            
            return (
              <button
                key={moment.value}
                type="button"
                onClick={() => onChange(moment.value)}
                disabled={disabled}
                className={`
                  group relative p-4 rounded-xl border-2 text-center
                  transition-all duration-300
                  ${isSelected 
                    ? `${config.selectedBg} ${config.selectedBorder} ring-2 ${config.ring} shadow-lg` 
                    : `${config.bg} ${config.border} hover:shadow-md hover:-translate-y-0.5`
                  }
                  ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                {/* Selected Check Indicator */}
                {isSelected && (
                  <div className={`
                    absolute top-2 right-2 
                    ${config.color === 'teal' ? 'text-teal-600' : 
                      config.color === 'blue' ? 'text-blue-600' : 
                      config.color === 'rose' ? 'text-rose-600' : 
                      config.color === 'amber' ? 'text-amber-600' : 'text-purple-600'}
                  `}>
                    <CheckIcon />
                  </div>
                )}

                {/* Moment Number Badge */}
                <div className={`
                  absolute -top-3 left-1/2 -translate-x-1/2
                  w-8 h-8 rounded-full flex items-center justify-center
                  text-white font-bold text-sm
                  shadow-lg
                  bg-gradient-to-br ${config.gradient}
                `}
                style={{
                  boxShadow: config.color === 'teal' ? '0 10px 15px -3px rgba(13, 148, 136, 0.3)' :
                             config.color === 'blue' ? '0 10px 15px -3px rgba(37, 99, 235, 0.3)' :
                             config.color === 'rose' ? '0 10px 15px -3px rgba(225, 29, 72, 0.3)' :
                             config.color === 'amber' ? '0 10px 15px -3px rgba(217, 119, 6, 0.3)' :
                             '0 10px 15px -3px rgba(147, 51, 234, 0.3)'
                }}
                >
                  {moment.id}
                </div>

                {/* Icon */}
                <div className={`
                  w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-3 mt-2
                  transition-all duration-300 shadow-lg
                  ${isSelected ? config.iconBgSelected : config.iconBg}
                  ${!isSelected ? 'group-hover:scale-110' : ''}
                `}>
                  {config.icon}
                </div>

                {/* Label */}
                <p className={`
                  text-sm font-semibold leading-tight
                  ${isSelected ? 'text-gray-900' : 'text-gray-700'}
                `}>
                  {moment.label}
                </p>

                {/* Custom Radio Indicator */}
                <div className="mt-3 flex justify-center">
                  <div className={`
                    w-5 h-5 rounded-full border-2 
                    flex items-center justify-center
                    transition-all duration-300
                  `}
                  style={{
                    borderColor: isSelected ? 
                      (config.color === 'teal' ? '#0d9488' : 
                       config.color === 'blue' ? '#2563eb' : 
                       config.color === 'rose' ? '#e11d48' : 
                       config.color === 'amber' ? '#d97706' : '#9333ea') : '#d1d5db',
                    backgroundColor: isSelected ? 
                      (config.color === 'teal' ? '#0d9488' : 
                       config.color === 'blue' ? '#2563eb' : 
                       config.color === 'rose' ? '#e11d48' : 
                       config.color === 'amber' ? '#d97706' : '#9333ea') : 'white',
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
            ${getMomentConfig(
              whoMoments.find(m => m.value === selected)?.id
            ).selectedBg}
            ${getMomentConfig(
              whoMoments.find(m => m.value === selected)?.id
            ).selectedBorder}
          `}>
            <div className={`
              w-10 h-10 rounded-xl flex items-center justify-center
              ${getMomentConfig(
                whoMoments.find(m => m.value === selected)?.id
              ).iconBgSelected}
            `}>
              {getMomentConfig(
                whoMoments.find(m => m.value === selected)?.id
              ).icon}
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Selected WHO Moment
              </p>
              <p className="text-sm font-bold text-gray-900">
                Moment {whoMoments.find(m => m.value === selected)?.id}: {whoMoments.find(m => m.value === selected)?.label}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ==================== ERROR MESSAGE ==================== */}
      {error && (
        <div className="flex items-center gap-2 text-red-600">
          <ExclamationIcon />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* ==================== HELPER TEXT ==================== */}
      <p className="text-xs text-gray-500 flex items-center gap-1">
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Select the appropriate WHO 5 Moment based on when the observation occurred in the care workflow
      </p>
    </div>
  );
};

export default WHOMomentSelector;