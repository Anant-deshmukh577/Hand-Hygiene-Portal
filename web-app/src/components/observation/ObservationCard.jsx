import { calculateObservationPoints } from '../../utils/scoreCalculator';
import Badge from '../common/Badge';

/* --- SVG Icons --- */
const ClipboardListIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const StarIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const HandRaisedIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ExclamationCircleIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircleIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const UserIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ShieldExclamationIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
  </svg>
);

const ChatBubbleIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const ObservationCard = ({ 
  observation, 
  index, 
  onDelete,
  onEdit,
  showActions = true,
  variant = 'default' // 'default', 'compact', 'detailed'
}) => {
  const points = calculateObservationPoints ? calculateObservationPoints(observation) : observation.points || 0;
  
  // Get adherence styling
  const getAdherenceConfig = (adherence) => {
    if (adherence === 'adherence' || adherence === 'compliant' || adherence === 'hand_rub' || adherence === 'hand_wash') {
      return {
        variant: 'success',
        icon: <CheckCircleIcon />,
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-700',
        iconBg: 'bg-green-100 text-green-600',
        gradient: 'from-green-500 to-emerald-600',
      };
    }
    if (adherence === 'partial' || adherence === 'gloves_only') {
      return {
        variant: 'warning',
        icon: <ExclamationCircleIcon />,
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-700',
        iconBg: 'bg-amber-100 text-amber-600',
        gradient: 'from-amber-500 to-orange-600',
      };
    }
    return {
      variant: 'error',
      icon: <XCircleIcon />,
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      iconBg: 'bg-red-100 text-red-600',
      gradient: 'from-red-500 to-rose-600',
    };
  };

  const adherenceConfig = getAdherenceConfig(observation.adherence);

  // Format WHO moment display
  const formatWhoMoment = (moment) => {
    if (!moment) return 'N/A';
    // Convert "moment_1" to "Moment 1" or handle full names
    if (typeof moment === 'string') {
      return moment.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    return moment;
  };

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-teal-200 hover:shadow-md transition-all duration-200">
        {/* Index Badge */}
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
          {index + 1}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span className="text-sm font-medium text-gray-900 truncate" title={observation.department}>
              {observation.department}
            </span>
            <span className="text-gray-300 flex-shrink-0">•</span>
            <span className="text-sm text-gray-500 truncate" title={formatWhoMoment(observation.whoMoment)}>
              {formatWhoMoment(observation.whoMoment)}
            </span>
          </div>
        </div>

        {/* Status & Points */}
        <div className="flex items-center gap-2">
          <Badge variant={adherenceConfig.variant} size="small">
            {observation.adherence}
          </Badge>
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-teal-50 text-teal-700 text-sm font-bold rounded-lg">
            <StarIcon className="h-3 w-3" />
            {points}
          </span>
        </div>

        {/* Delete */}
        {showActions && onDelete && (
          <button
            onClick={() => onDelete(observation.id)}
            className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
          >
            <TrashIcon />
          </button>
        )}
      </div>
    );
  }

  // Default/Detailed variant
  return (
    <div className={`
      group relative bg-white rounded-2xl border border-gray-100 
      shadow-lg shadow-black/5 
      hover:shadow-xl hover:border-teal-200 
      transition-all duration-300 overflow-hidden
    `}>
      
      {/* Left Border Indicator */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${adherenceConfig.gradient}`} />

      {/* ==================== HEADER ==================== */}
      <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-start justify-between gap-4">
          {/* Left: Title & Info */}
          <div className="flex items-start gap-3">
            {/* Index Badge */}
            <div className={`
              flex-shrink-0 w-10 h-10 rounded-xl 
              bg-gradient-to-br ${adherenceConfig.gradient}
              flex items-center justify-center 
              text-white font-bold text-sm
              shadow-lg
            `}
            style={{
              boxShadow: adherenceConfig.variant === 'success' 
                ? '0 10px 15px -3px rgba(22, 163, 74, 0.3)'
                : adherenceConfig.variant === 'warning'
                  ? '0 10px 15px -3px rgba(217, 119, 6, 0.3)'
                  : '0 10px 15px -3px rgba(220, 38, 38, 0.3)'
            }}
            >
              #{index + 1}
            </div>

            {/* Title & Location */}
            <div className="min-w-0">
              <h4 className="font-bold text-gray-900 mb-1">
                Observation #{index + 1}
              </h4>
              <div className="flex items-center gap-3 text-sm text-gray-500 min-w-0">
                <span className="flex items-center gap-1 truncate min-w-0">
                  <BuildingIcon className="flex-shrink-0" />
                  <span className="truncate">{observation.department || 'N/A'}</span>
                </span>
                {observation.designation && (
                  <>
                    <span className="text-gray-300 flex-shrink-0">•</span>
                    <span className="flex items-center gap-1 truncate min-w-0">
                      <UserIcon className="flex-shrink-0" />
                      <span className="truncate">{observation.designation}</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: Points & Actions */}
          <div className="flex items-center gap-2">
            {/* Points Badge */}
            <div className={`
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl
              bg-gradient-to-r ${adherenceConfig.gradient}
              text-white font-bold text-sm
              shadow-lg
            `}>
              <StarIcon />
              {points} pts
            </div>

            {/* Delete Button */}
            {showActions && onDelete && (
              <button
                onClick={() => onDelete(observation.id)}
                className="
                  p-2 rounded-xl
                  text-gray-400 hover:text-red-600
                  hover:bg-red-50
                  opacity-0 group-hover:opacity-100
                  transition-all duration-200
                "
                title="Delete observation"
              >
                <TrashIcon />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ==================== CONTENT ==================== */}
      <div className="p-5">
        
        {/* Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {/* WHO Moment */}
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
              WHO Moment
            </p>
            <p className="text-sm font-semibold text-gray-900 truncate">
              {formatWhoMoment(observation.whoMoment)}
            </p>
          </div>

          {/* Action */}
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Action
            </p>
            <p className="text-sm font-semibold text-gray-900 uppercase">
              {observation.action || 'N/A'}
            </p>
          </div>

          {/* Glove Status */}
          <div className="p-3 bg-gray-50 rounded-xl">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Glove Status
            </p>
            <div className="flex items-center gap-1">
              <HandRaisedIcon className={observation.glove === 'on' ? 'text-teal-600' : 'text-gray-400'} />
              <span className="text-sm font-semibold text-gray-900 uppercase">
                {observation.glove || 'N/A'}
              </span>
            </div>
          </div>

          {/* Adherence Status */}
          <div className={`p-3 rounded-xl ${adherenceConfig.bg} border ${adherenceConfig.border}`}>
            <p className={`text-[10px] font-semibold ${adherenceConfig.text} uppercase tracking-wider mb-1`}>
              Status
            </p>
            <div className="flex items-center gap-1.5">
              <span className={adherenceConfig.text}>
                {adherenceConfig.icon}
              </span>
              <Badge variant={adherenceConfig.variant} size="small">
                {observation.adherence?.charAt(0).toUpperCase() + observation.adherence?.slice(1) || 'N/A'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Remarks */}
        {observation.remarks && (
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 flex-shrink-0">
                <ChatBubbleIcon />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Remarks
                </p>
                <p className="text-sm text-gray-700 italic leading-relaxed">
                  "{observation.remarks}"
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Risk Factors */}
        {observation.riskFactors && Object.values(observation.riskFactors).some(val => val) && (
          <div className="p-4 bg-red-50 rounded-xl border border-red-100">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                <ShieldExclamationIcon />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-2">
                  Risk Factors Identified
                </p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(observation.riskFactors)
                    .filter(([, value]) => value)
                    .map(([key]) => (
                      <Badge key={key} variant="error" size="small">
                        {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==================== FOOTER (Optional) ==================== */}
      {observation.createdAt && (
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <ClockIcon />
              <span>
                {new Date(observation.createdAt).toLocaleString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            {observation.observedBy && (
              <span className="flex items-center gap-1">
                <UserIcon />
                {observation.observedBy}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ObservationCard;