import Button from '../common/Button';
import Badge from '../common/Badge';

/* --- SVG Icons --- */
const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const GiftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const RewardCard = ({ reward, userPoints, onClaim, loading, featured = false }) => {
  const canClaim = userPoints >= reward.pointsRequired && !reward.claimed;
  const pointsNeeded = reward.pointsRequired - userPoints;
  const progressPercentage = Math.min((userPoints / reward.pointsRequired) * 100, 100);

  // Reward tier configuration
  const getTierConfig = (points) => {
    if (points >= 500) return { 
      tier: 'Legendary', 
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-600',
      badgeColor: 'bg-purple-100 text-purple-700',
    };
    if (points >= 200) return { 
      tier: 'Epic', 
      gradient: 'from-amber-500 to-orange-500',
      bgGradient: 'from-amber-50 to-orange-50',
      borderColor: 'border-amber-200',
      textColor: 'text-amber-600',
      badgeColor: 'bg-amber-100 text-amber-700',
    };
    if (points >= 100) return { 
      tier: 'Rare', 
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-600',
      badgeColor: 'bg-blue-100 text-blue-700',
    };
    return { 
      tier: 'Common', 
      gradient: 'from-teal-500 to-green-500',
      bgGradient: 'from-teal-50 to-green-50',
      borderColor: 'border-teal-200',
      textColor: 'text-teal-600',
      badgeColor: 'bg-teal-100 text-teal-700',
    };
  };

  const tierConfig = getTierConfig(reward.pointsRequired);

  return (
    <div className={`
      group relative bg-white rounded-2xl border overflow-hidden
      transition-all duration-300
      ${reward.claimed 
        ? 'opacity-75 border-gray-200' 
        : `${tierConfig.borderColor} shadow-lg shadow-black/8 hover:shadow-xl hover:shadow-black/15 hover:-translate-y-1`
      }
      ${featured ? 'ring-2 ring-amber-400 ring-offset-2' : ''}
    `}>
      
      {/* Featured Badge */}
      {featured && !reward.claimed && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-full shadow-lg">
            <SparklesIcon />
            Featured
          </span>
        </div>
      )}

      {/* Claimed Overlay */}
      {reward.claimed && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
          <div className="bg-green-100 rounded-full p-4 shadow-lg">
            <CheckIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>
      )}

      {/* Gradient Top Banner */}
      <div className={`h-2 bg-gradient-to-r ${tierConfig.gradient}`} />

      {/* Content */}
      <div className="p-5 sm:p-6">
        
        {/* Tier Badge */}
        <div className="flex justify-center mb-4">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full ${tierConfig.badgeColor}`}>
            <StarIcon />
            {tierConfig.tier}
          </span>
        </div>

        {/* Icon */}
        <div className={`
          w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 
          rounded-2xl bg-gradient-to-br ${tierConfig.bgGradient}
          flex items-center justify-center
          text-4xl sm:text-5xl
          shadow-sm border ${tierConfig.borderColor}
          group-hover:scale-105 transition-transform duration-300
          ${reward.claimed ? 'grayscale' : ''}
        `}>
          {reward.icon}
        </div>

        {/* Title */}
        <h3 className={`
          text-lg sm:text-xl font-bold text-center mb-2
          ${reward.claimed ? 'text-gray-500' : 'text-gray-900'}
        `} title={reward.title}>
          {reward.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-500 text-center mb-4 line-clamp-2" title={reward.description}>
          {reward.description}
        </p>

        {/* Points Required Box */}
        <div className={`
          p-4 rounded-xl mb-4
          bg-gradient-to-r ${tierConfig.bgGradient}
          border ${tierConfig.borderColor}
        `}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 flex items-center gap-1">
              <StarIcon className={tierConfig.textColor} />
              Points Required
            </span>
            <span className={`text-xl font-bold ${tierConfig.textColor}`}>
              {reward.pointsRequired.toLocaleString()}
            </span>
          </div>

          {/* Progress Bar (only show if not claimed) */}
          {!reward.claimed && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Your Points: {userPoints.toLocaleString()}</span>
                <span>{Math.round(progressPercentage)}%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${tierConfig.gradient} rounded-full transition-all duration-500`}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Stock/Availability (optional) */}
        {reward.stock !== undefined && !reward.claimed && (
          <div className="flex items-center justify-center gap-2 mb-4 text-sm">
            <span className={`
              w-2 h-2 rounded-full
              ${reward.stock > 5 ? 'bg-green-500' : reward.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}
            `} />
            <span className="text-gray-500">
              {reward.stock > 0 ? `${reward.stock} left in stock` : 'Out of stock'}
            </span>
          </div>
        )}

        {/* Action Button / Status */}
        {reward.claimed ? (
          <div className="flex items-center justify-center gap-2 py-3 bg-green-50 rounded-xl border border-green-200">
            <CheckIcon className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-green-700">Claimed</span>
          </div>
        ) : canClaim ? (
          <button
            onClick={() => onClaim(reward.id)}
            disabled={loading || reward.stock === 0}
            className={`
              w-full inline-flex items-center justify-center gap-2
              px-6 py-3.5 
              bg-gradient-to-r ${tierConfig.gradient}
              text-white font-semibold rounded-xl
              shadow-lg hover:shadow-xl
              focus:outline-none focus:ring-2 focus:ring-offset-2
              transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed
              hover:scale-[1.02] active:scale-[0.98]
            `}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Claiming...
              </>
            ) : (
              <>
                <GiftIcon />
                Claim Reward
              </>
            )}
          </button>
        ) : (
          <div className="space-y-2">
            <button
              disabled
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-100 text-gray-500 font-medium rounded-xl border border-gray-200 cursor-not-allowed"
            >
              <LockIcon />
              Locked
            </button>
            <p className="text-center text-xs text-gray-500">
              Need <span className={`font-semibold ${tierConfig.textColor}`}>{pointsNeeded.toLocaleString()}</span> more points
            </p>
          </div>
        )}
      </div>

      {/* Bottom accent line on hover */}
      {!reward.claimed && (
        <div className={`
          h-1 bg-gradient-to-r ${tierConfig.gradient}
          transform scale-x-0 group-hover:scale-x-100
          transition-transform duration-300 origin-left
        `} />
      )}
    </div>
  );
};

export default RewardCard;