import { ACTION_OPTIONS } from '../../utils/constants';

/* --- SVG Icons --- */
const CheckCircleIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircleIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ClipboardCheckIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const HandRaisedIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
  </svg>
);

const ExclamationIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const PencilIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

// Action option icons and colors
const getActionConfig = (value) => {
  const configs = {
    'compliant': {
      icon: <CheckCircleIcon />,
      color: 'green',
      bgSelected: 'bg-green-50 border-green-500 ring-green-500/20',
      bgUnselected: 'bg-white border-gray-200 hover:border-green-300 hover:bg-green-50/30',
      iconBg: 'bg-green-100 text-green-600',
      iconBgSelected: 'bg-green-600 text-white',
      radioColor: 'text-green-600',
    },
    'non_compliant': {
      icon: <XCircleIcon />,
      color: 'red',
      bgSelected: 'bg-red-50 border-red-500 ring-red-500/20',
      bgUnselected: 'bg-white border-gray-200 hover:border-red-300 hover:bg-red-50/30',
      iconBg: 'bg-red-100 text-red-600',
      iconBgSelected: 'bg-red-600 text-white',
      radioColor: 'text-red-600',
    },
    'missed': {
      icon: <ExclamationIcon />,
      color: 'amber',
      bgSelected: 'bg-amber-50 border-amber-500 ring-amber-500/20',
      bgUnselected: 'bg-white border-gray-200 hover:border-amber-300 hover:bg-amber-50/30',
      iconBg: 'bg-amber-100 text-amber-600',
      iconBgSelected: 'bg-amber-600 text-white',
      radioColor: 'text-amber-600',
    },
    'gloves_only': {
      icon: <HandRaisedIcon />,
      color: 'blue',
      bgSelected: 'bg-blue-50 border-blue-500 ring-blue-500/20',
      bgUnselected: 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50/30',
      iconBg: 'bg-blue-100 text-blue-600',
      iconBgSelected: 'bg-blue-600 text-white',
      radioColor: 'text-blue-600',
    },
  };
  return configs[value] || configs['compliant'];
};

const ActionSelector = ({ 
  selected, 
  remarks, 
  onActionChange, 
  onRemarksChange, 
  error,
  disabled = false,
  showRemarks = true,
  label = "Action Taken"
}) => {

  // Default action options if not imported
  const actionOptions = ACTION_OPTIONS || [
    { value: 'compliant', label: 'Compliant' },
    { value: 'non_compliant', label: 'Non-Compliant' },
    { value: 'missed', label: 'Missed Opportunity' },
    { value: 'gloves_only', label: 'Gloves Only' },
  ];

  return (
    <div className="space-y-4">
      
      {/* ==================== LABEL ==================== */}
      <label className="block text-sm font-semibold text-gray-900">
        {label} <span className="text-red-500">*</span>
      </label>

      {/* ==================== MAIN CONTAINER ==================== */}
      <div className={`
        p-5 rounded-2xl border-2 transition-all duration-300
        ${error 
          ? 'border-red-300 bg-red-50/30' 
          : 'border-gray-100 bg-gradient-to-br from-gray-50 to-white'
        }
        ${disabled ? 'opacity-60 pointer-events-none' : ''}
      `}>
        
        {/* ==================== ACTION OPTIONS GRID ==================== */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {actionOptions.map((option) => {
            const config = getActionConfig(option.value);
            const isSelected = selected === option.value;
            
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onActionChange(option.value)}
                disabled={disabled}
                className={`
                  group relative p-4 rounded-xl border-2 text-left
                  transition-all duration-300
                  ${isSelected 
                    ? `${config.bgSelected} ring-2 shadow-lg` 
                    : config.bgUnselected
                  }
                  ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                  hover:shadow-md
                `}
              >
                {/* Selected Indicator */}
                {isSelected && (
                  <div className={`absolute top-2 right-2 ${config.radioColor}`}>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}

                {/* Icon */}
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center mb-3
                  transition-all duration-300
                  ${isSelected ? config.iconBgSelected : config.iconBg}
                  ${!isSelected ? 'group-hover:scale-110' : ''}
                `}>
                  {config.icon}
                </div>

                {/* Label */}
                <p className={`
                  text-sm font-semibold
                  ${isSelected ? 'text-gray-900' : 'text-gray-700'}
                `}>
                  {option.label}
                </p>

                {/* Radio Indicator (Custom) */}
                <div className={`
                  absolute bottom-3 right-3 
                  w-4 h-4 rounded-full border-2
                  transition-all duration-300
                  ${isSelected 
                    ? `${config.radioColor} border-current bg-current` 
                    : 'border-gray-300 bg-white'
                  }
                `}>
                  {isSelected && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* ==================== DIVIDER ==================== */}
        {showRemarks && (
          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-gradient-to-r from-gray-50 to-white text-sm font-medium text-gray-500">
                Additional Notes
              </span>
            </div>
          </div>
        )}

        {/* ==================== REMARKS TEXTAREA ==================== */}
        {showRemarks && (
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Remarks / Action Taken
            </label>
            <div className="relative">
              <div className="absolute top-3 left-4 text-gray-400 pointer-events-none">
                <PencilIcon />
              </div>
              <textarea
                value={remarks || ''}
                onChange={(e) => onRemarksChange(e.target.value)}
                placeholder="Add any additional notes, observations, or corrective actions taken..."
                rows={3}
                disabled={disabled}
                className={`
                  w-full pl-12 pr-4 py-3
                  bg-white border border-gray-200 rounded-xl
                  text-gray-900 placeholder:text-gray-400
                  focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                  transition-all duration-200
                  resize-none
                  ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
                `}
              />
            </div>
            
            {/* Character Count (Optional) */}
            {remarks && remarks.length > 0 && (
              <div className="flex justify-end mt-1">
                <span className="text-xs text-gray-400">
                  {remarks.length} characters
                </span>
              </div>
            )}
          </div>
        )}

        {/* ==================== SELECTED ACTION SUMMARY ==================== */}
        {selected && (
          <div className={`
            mt-4 p-3 rounded-xl border
            ${getActionConfig(selected).bgSelected.split(' ')[0]} 
            ${getActionConfig(selected).bgSelected.split(' ')[1]}
          `}>
            <div className="flex items-center gap-3">
              <div className={`
                w-8 h-8 rounded-lg flex items-center justify-center
                ${getActionConfig(selected).iconBgSelected}
              `}>
                {getActionConfig(selected).icon}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Selected Action
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {actionOptions.find(o => o.value === selected)?.label}
                </p>
              </div>
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

      {/* ==================== HELP TEXT ==================== */}
      <p className="text-xs text-gray-500">
        Select the appropriate action based on the hand hygiene observation. Add remarks for non-compliant or missed opportunities.
      </p>
    </div>
  );
};

export default ActionSelector;