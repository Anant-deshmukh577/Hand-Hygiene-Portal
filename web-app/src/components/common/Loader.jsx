const Loader = ({ 
  size = 'medium', 
  fullScreen = false,
  variant = 'spinner', // 'spinner' | 'dots' | 'pulse' | 'bars' | 'ring'
  color = 'teal',
  text = '',
  overlay = false,
}) => {

  // Size configurations
  const sizes = {
    xs: { spinner: 'w-4 h-4', dots: 'w-1.5 h-1.5', bars: 'w-1 h-4', text: 'text-xs' },
    small: { spinner: 'w-6 h-6', dots: 'w-2 h-2', bars: 'w-1 h-6', text: 'text-sm' },
    medium: { spinner: 'w-10 h-10', dots: 'w-2.5 h-2.5', bars: 'w-1.5 h-8', text: 'text-sm' },
    large: { spinner: 'w-14 h-14', dots: 'w-3 h-3', bars: 'w-2 h-10', text: 'text-base' },
    xl: { spinner: 'w-20 h-20', dots: 'w-4 h-4', bars: 'w-2.5 h-12', text: 'text-lg' },
  };

  // Color configurations
  const colors = {
    teal: { primary: 'border-teal-600', bg: 'bg-teal-600', text: 'text-teal-600' },
    gray: { primary: 'border-gray-600', bg: 'bg-gray-600', text: 'text-gray-600' },
    white: { primary: 'border-white', bg: 'bg-white', text: 'text-white' },
    green: { primary: 'border-green-600', bg: 'bg-green-600', text: 'text-green-600' },
    blue: { primary: 'border-blue-600', bg: 'bg-blue-600', text: 'text-blue-600' },
    red: { primary: 'border-red-600', bg: 'bg-red-600', text: 'text-red-600' },
  };

  const currentSize = sizes[size] || sizes.medium;
  const currentColor = colors[color] || colors.teal;

  // Spinner Loader
  const SpinnerLoader = () => (
    <div className={`
      ${currentSize.spinner}
      border-4 border-gray-200 
      ${currentColor.primary}
      border-t-4 rounded-full
      animate-spin
    `} />
  );

  // Dots Loader
  const DotsLoader = () => (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`
            ${currentSize.dots}
            ${currentColor.bg}
            rounded-full
            animate-bounce
          `}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );

  // Pulse Loader
  const PulseLoader = () => (
    <div className="relative flex items-center justify-center">
      <div className={`
        ${currentSize.spinner}
        ${currentColor.bg}
        rounded-full opacity-75
        animate-ping absolute
      `} />
      <div className={`
        ${currentSize.spinner}
        ${currentColor.bg}
        rounded-full opacity-25
      `} />
    </div>
  );

  // Bars Loader
  const BarsLoader = () => (
    <div className="flex items-end gap-1">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={`
            ${currentSize.bars}
            ${currentColor.bg}
            rounded-sm
            animate-pulse
          `}
          style={{ 
            animationDelay: `${i * 0.15}s`,
            height: `${60 + (i * 10)}%`,
          }}
        />
      ))}
    </div>
  );

  // Ring Loader (modern style)
  const RingLoader = () => (
    <div className="relative">
      <div className={`
        ${currentSize.spinner}
        border-4 border-gray-200
        rounded-full
      `} />
      <div className={`
        ${currentSize.spinner}
        border-4 border-transparent
        ${currentColor.primary}
        border-t-4
        rounded-full
        animate-spin
        absolute top-0 left-0
      `} />
    </div>
  );

  // Render the selected loader variant
  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return <DotsLoader />;
      case 'pulse':
        return <PulseLoader />;
      case 'bars':
        return <BarsLoader />;
      case 'ring':
        return <RingLoader />;
      default:
        return <SpinnerLoader />;
    }
  };

  // Loader content with optional text
  const LoaderContent = () => (
    <div className="flex flex-col items-center justify-center gap-3">
      {renderLoader()}
      {text && (
        <p className={`${currentSize.text} ${currentColor.text} font-medium`}>
          {text}
        </p>
      )}
    </div>
  );

  // Full screen loader
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm">
        <LoaderContent />
      </div>
    );
  }

  // Overlay loader (for containers)
  if (overlay) {
    return (
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl">
        <LoaderContent />
      </div>
    );
  }

  // Inline loader
  return (
    <div className="flex items-center justify-center p-4">
      <LoaderContent />
    </div>
  );
};

// Page Loader (Full page with logo)
export const PageLoader = ({ text = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-teal-50/30">
      {/* Logo */}
      <div className="mb-8">
        <div className="p-3 bg-white rounded-2xl shadow-lg shadow-black/10">
          <img 
            src="/AIIMS.png" 
            alt="AIIMS Logo" 
            className="w-16 h-16 object-contain"
          />
        </div>
      </div>

      {/* Spinner */}
      <div className="relative mb-4">
        <div className="w-12 h-12 border-4 border-gray-200 rounded-full" />
        <div className="w-12 h-12 border-4 border-transparent border-t-teal-600 rounded-full animate-spin absolute top-0 left-0" />
      </div>

      {/* Text */}
      <p className="text-gray-600 font-medium">{text}</p>
      <p className="text-gray-400 text-sm mt-1">Hand Hygiene Portal</p>
    </div>
  );
};

// Skeleton Loader (for content placeholders)
export const Skeleton = ({ 
  variant = 'text', // 'text' | 'circular' | 'rectangular' | 'card'
  width,
  height,
  lines = 1,
  className = '',
}) => {
  const baseClass = 'bg-gray-200 animate-pulse rounded';

  // Text skeleton
  if (variant === 'text') {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${baseClass} h-4 ${i === lines - 1 ? 'w-3/4' : 'w-full'}`}
            style={{ width: i === lines - 1 && width ? width : undefined }}
          />
        ))}
      </div>
    );
  }

  // Circular skeleton (for avatars)
  if (variant === 'circular') {
    return (
      <div 
        className={`${baseClass} rounded-full ${className}`}
        style={{ 
          width: width || '40px', 
          height: height || width || '40px' 
        }}
      />
    );
  }

  // Rectangular skeleton
  if (variant === 'rectangular') {
    return (
      <div 
        className={`${baseClass} rounded-xl ${className}`}
        style={{ 
          width: width || '100%', 
          height: height || '100px' 
        }}
      />
    );
  }

  // Card skeleton
  if (variant === 'card') {
    return (
      <div className={`bg-white rounded-2xl border border-gray-100 p-6 ${className}`}>
        <div className="flex items-center gap-4 mb-4">
          <Skeleton variant="circular" width="48px" />
          <div className="flex-1">
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" className="mt-2" />
          </div>
        </div>
        <Skeleton variant="text" lines={3} />
        <Skeleton variant="rectangular" height="40px" className="mt-4" />
      </div>
    );
  }

  return null;
};

// Button Loader (inline spinner for buttons)
export const ButtonLoader = ({ size = 'small', color = 'white' }) => {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6',
  };

  const colors = {
    white: 'border-white/30 border-t-white',
    teal: 'border-teal-200 border-t-teal-600',
    gray: 'border-gray-300 border-t-gray-600',
  };

  return (
    <div className={`
      ${sizes[size] || sizes.small}
      border-2 rounded-full animate-spin
      ${colors[color] || colors.white}
    `} />
  );
};

// Content Loader (for sections)
export const ContentLoader = ({ 
  rows = 3, 
  showAvatar = false,
  showImage = false,
}) => {
  return (
    <div className="space-y-4 animate-pulse">
      {showImage && (
        <div className="w-full h-48 bg-gray-200 rounded-xl" />
      )}
      
      {showAvatar && (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="h-3 bg-gray-200 rounded w-1/4 mt-2" />
          </div>
        </div>
      )}
      
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div 
            key={i} 
            className={`h-4 bg-gray-200 rounded ${
              i === rows - 1 ? 'w-2/3' : 'w-full'
            }`} 
          />
        ))}
      </div>
    </div>
  );
};

// Table Loader (for table rows)
export const TableLoader = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex items-center gap-4">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <div 
              key={colIndex} 
              className={`h-4 bg-gray-200 rounded flex-1 ${
                colIndex === 0 ? 'w-1/4' : ''
              }`} 
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Loader;