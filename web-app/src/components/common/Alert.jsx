const Alert = ({ type = 'info', message, onClose }) => {
  
  // Icon components for each alert type
  const icons = {
    success: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    error: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  // Tailwind classes for each alert type (matching teal theme)
  const styles = {
    success: {
      container: 'bg-green-50 border-green-200 text-green-800',
      icon: 'text-green-500',
      closeBtn: 'text-green-500 hover:bg-green-100 hover:text-green-700',
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: 'text-red-500',
      closeBtn: 'text-red-500 hover:bg-red-100 hover:text-red-700',
    },
    warning: {
      container: 'bg-amber-50 border-amber-200 text-amber-800',
      icon: 'text-amber-500',
      closeBtn: 'text-amber-500 hover:bg-amber-100 hover:text-amber-700',
    },
    info: {
      container: 'bg-teal-50 border-teal-200 text-teal-800',
      icon: 'text-teal-500',
      closeBtn: 'text-teal-500 hover:bg-teal-100 hover:text-teal-700',
    },
  };

  const currentStyle = styles[type] || styles.info;
  const currentIcon = icons[type] || icons.info;

  return (
    <div className={`
      flex items-start gap-3 p-4 mb-4 
      border rounded-xl shadow-sm
      ${currentStyle.container}
      animate-in fade-in slide-in-from-top-2 duration-300
    `}>
      {/* Icon */}
      <span className={`flex-shrink-0 mt-0.5 ${currentStyle.icon}`}>
        {currentIcon}
      </span>

      {/* Message */}
      <p className="flex-1 text-sm font-medium leading-relaxed">
        {message}
      </p>

      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className={`
            flex-shrink-0 p-1 rounded-lg 
            transition-colors duration-200
            ${currentStyle.closeBtn}
          `}
          aria-label="Close alert"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Alert;