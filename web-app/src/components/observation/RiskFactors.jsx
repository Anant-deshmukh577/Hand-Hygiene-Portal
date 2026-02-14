import { RISK_FACTORS } from '../../utils/constants';

/* --- SVG Icons --- */
const ShieldExclamationIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
  </svg>
);

const ExclamationTriangleIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

const RingIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
  </svg>
);

const WatchIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const ScissorsIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
  </svg>
);

const MinusIcon = () => (
  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
  </svg>
);

// Get icon for risk factor
const getRiskFactorIcon = (id) => {
  const icons = {
    jewellery: <SparklesIcon />,
    watch: <WatchIcon />,
    ring: <RingIcon />,
    long_nails: <ScissorsIcon />,
    artificial_nails: <ScissorsIcon />,
    nail_polish: <SparklesIcon />,
  };
  return icons[id] || <ExclamationTriangleIcon />;
};

// Get color for risk factor
const getRiskFactorColor = (id) => {
  const colors = {
    jewellery: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      selectedBg: 'bg-purple-100',
      selectedBorder: 'border-purple-500',
      icon: 'bg-purple-100 text-purple-600',
      iconSelected: 'bg-purple-600 text-white',
      check: 'bg-purple-600',
      ring: 'ring-purple-500/20',
    },
    watch: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      selectedBg: 'bg-blue-100',
      selectedBorder: 'border-blue-500',
      icon: 'bg-blue-100 text-blue-600',
      iconSelected: 'bg-blue-600 text-white',
      check: 'bg-blue-600',
      ring: 'ring-blue-500/20',
    },
    ring: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      selectedBg: 'bg-amber-100',
      selectedBorder: 'border-amber-500',
      icon: 'bg-amber-100 text-amber-600',
      iconSelected: 'bg-amber-600 text-white',
      check: 'bg-amber-600',
      ring: 'ring-amber-500/20',
    },
    long_nails: {
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      selectedBg: 'bg-rose-100',
      selectedBorder: 'border-rose-500',
      icon: 'bg-rose-100 text-rose-600',
      iconSelected: 'bg-rose-600 text-white',
      check: 'bg-rose-600',
      ring: 'ring-rose-500/20',
    },
  };
  return colors[id] || colors.long_nails;
};

const RiskFactors = ({ 
  selected = {}, 
  onChange,
  disabled = false,
  showPoints = true,
  variant = 'cards' // 'cards', 'list', 'compact'
}) => {

  // Default risk factors if not imported
  const riskFactors = RISK_FACTORS || [
    { id: 'jewellery', label: 'Wearing Jewellery' },
    { id: 'watch', label: 'Wearing Watch' },
    { id: 'ring', label: 'Wearing Ring(s)' },
    { id: 'long_nails', label: 'Long Nails' },
  ];

  const handleCheckboxChange = (factorId) => {
    const updatedFactors = {
      ...selected,
      [factorId]: !selected[factorId],
    };
    onChange(updatedFactors);
  };

  // Count selected risk factors
  const selectedCount = Object.values(selected).filter(Boolean).length;

  // Compact List Variant
  if (variant === 'list') {
    return (
      <div className="space-y-3">
        {/* Label */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
            <ShieldExclamationIcon className="h-4 w-4" />
          </div>
          <label className="block text-sm font-semibold text-gray-900">
            Risk Factors
          </label>
          {selectedCount > 0 && (
            <span className="inline-flex items-center px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
              {selectedCount} selected
            </span>
          )}
        </div>

        {/* List Container */}
        <div className={`
          rounded-xl border overflow-hidden
          ${disabled ? 'opacity-60 pointer-events-none' : ''}
        `}>
          {riskFactors.map((factor, index) => {
            const isSelected = selected[factor.id] || false;
            const isLast = index === riskFactors.length - 1;
            
            return (
              <label
                key={factor.id}
                className={`
                  flex items-center justify-between p-4 cursor-pointer
                  transition-all duration-200
                  ${!isLast ? 'border-b border-gray-100' : ''}
                  ${isSelected 
                    ? 'bg-red-50' 
                    : 'bg-white hover:bg-gray-50'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-5 h-5 rounded border-2 flex items-center justify-center
                    transition-all duration-200
                    ${isSelected 
                      ? 'bg-red-600 border-red-600' 
                      : 'border-gray-300 bg-white'
                    }
                  `}>
                    {isSelected && <CheckIcon className="text-white" />}
                  </div>
                  <span className={`font-medium ${isSelected ? 'text-red-700' : 'text-gray-700'}`}>
                    {factor.label}
                  </span>
                </div>
                
                {showPoints && (
                  <span className="text-xs text-red-500 font-medium">-1 pt</span>
                )}
                
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleCheckboxChange(factor.id)}
                  disabled={disabled}
                  className="sr-only"
                />
              </label>
            );
          })}
        </div>

        {/* Helper Text */}
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <ExclamationTriangleIcon className="h-3 w-3" />
          Risk factors deduct 1 point each from the observation score
        </p>
      </div>
    );
  }

  // Cards Variant (Default)
  return (
    <div className="space-y-4">
      
      {/* ==================== HEADER ==================== */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-red-500/30">
            <ShieldExclamationIcon />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900">
              Risk Factors
            </label>
            <p className="text-xs text-gray-500">Identify any infection control violations</p>
          </div>
        </div>
        
        {/* Selected Count Badge */}
        {selectedCount > 0 && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 text-sm font-bold rounded-xl">
              <ExclamationTriangleIcon className="h-4 w-4" />
              {selectedCount} Risk{selectedCount !== 1 ? 's' : ''} Identified
            </span>
          </div>
        )}
      </div>

      {/* ==================== OPTIONS CONTAINER ==================== */}
      <div className={`
        p-5 rounded-2xl border-2 transition-all duration-300
        ${selectedCount > 0 
          ? 'border-red-200 bg-gradient-to-br from-red-50/50 to-white' 
          : 'border-gray-100 bg-gradient-to-br from-gray-50 to-white'
        }
        ${disabled ? 'opacity-60 pointer-events-none' : ''}
      `}>
        
        {/* Options Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {riskFactors.map((factor) => {
            const isSelected = selected[factor.id] || false;
            const colors = getRiskFactorColor(factor.id);
            
            return (
              <label
                key={factor.id}
                className={`
                  group relative flex flex-col items-center p-4 rounded-xl border-2 
                  cursor-pointer transition-all duration-300
                  ${isSelected 
                    ? `${colors.selectedBg} ${colors.selectedBorder} ring-2 ${colors.ring} shadow-lg` 
                    : `${colors.bg} ${colors.border} hover:shadow-md hover:-translate-y-0.5`
                  }
                `}
              >
                {/* Selected Indicator */}
                {isSelected && (
                  <div className={`absolute top-2 right-2 w-5 h-5 rounded-full ${colors.check} flex items-center justify-center`}>
                    <CheckIcon className="text-white" />
                  </div>
                )}

                {/* Icon */}
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center mb-3
                  transition-all duration-300 shadow-lg
                  ${isSelected ? colors.iconSelected : colors.icon}
                  ${!isSelected ? 'group-hover:scale-110' : ''}
                `}>
                  {getRiskFactorIcon(factor.id)}
                </div>

                {/* Label */}
                <span className={`
                  text-sm font-semibold text-center leading-tight
                  ${isSelected ? 'text-gray-900' : 'text-gray-700'}
                `}>
                  {factor.label}
                </span>

                {/* Points Indicator */}
                {showPoints && (
                  <span className={`
                    mt-2 inline-flex items-center gap-0.5 text-xs font-medium
                    ${isSelected ? 'text-red-600' : 'text-gray-400'}
                  `}>
                    <MinusIcon />
                    1 pt
                  </span>
                )}

                {/* Hidden Checkbox */}
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleCheckboxChange(factor.id)}
                  disabled={disabled}
                  className="sr-only"
                />
              </label>
            );
          })}
        </div>

        {/* Selected Summary */}
        {selectedCount > 0 && (
          <div className="mt-5 p-4 bg-red-50 rounded-xl border border-red-100">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                <ExclamationTriangleIcon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-800">
                  {selectedCount} Risk Factor{selectedCount !== 1 ? 's' : ''} Selected
                </p>
                <p className="text-xs text-red-600 mt-0.5">
                  Total deduction: -{selectedCount} point{selectedCount !== 1 ? 's' : ''}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {Object.entries(selected)
                    .filter(([, value]) => value)
                    .map(([key]) => {
                      const factor = riskFactors.find(f => f.id === key);
                      return (
                        <span 
                          key={key}
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-md"
                        >
                          {getRiskFactorIcon(key)}
                          {factor?.label}
                        </span>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Risks Selected */}
        {selectedCount === 0 && (
          <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">No Risk Factors</p>
                <p className="text-xs text-green-600">No point deductions applied</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================== HELPER TEXT ==================== */}
      <div className="flex items-start gap-2 text-xs text-gray-500">
        <svg className="h-4 w-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p>
          Select any risk factors observed during the hand hygiene moment. Each risk factor deducts 1 point from the total observation score.
        </p>
      </div>
    </div>
  );
};

export default RiskFactors;