import { useState, useEffect } from 'react';

/**
 * Clean Splash Screen Component
 * Centered logo with minimal design
 */
const SplashScreen = ({ onComplete, minDuration = 2500 }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Show content with slight delay
    const contentTimer = setTimeout(() => setShowContent(true), 100);

    // Animate progress smoothly
    const duration = minDuration - 400;
    const increment = 100 / (duration / 30);
    
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(prev + increment, 100);
      });
    }, 30);

    // Complete splash
    const completeTimer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => onComplete?.(), 400);
    }, minDuration);

    return () => {
      clearInterval(timer);
      clearTimeout(contentTimer);
      clearTimeout(completeTimer);
    };
  }, [minDuration, onComplete]);

  return (
    <div 
      className={`
        fixed inset-0 z-[9999] 
        flex flex-col items-center justify-center
        bg-gradient-to-br from-gray-50 via-white to-teal-50/30
        transition-opacity duration-400 ease-out
        ${fadeOut ? 'opacity-0' : 'opacity-100'}
      `}
    >
      {/* ==================== SUBTLE BACKGROUND ==================== */}
      
      {/* Soft gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-100/50 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-50/80 rounded-full blur-[100px]" />
      </div>

      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* ==================== MAIN CONTENT ==================== */}
      <div 
        className={`
          relative z-10 flex flex-col items-center px-6
          transition-all duration-500 ease-out
          ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}
      >
        
        {/* Big Centered Logo */}
        <div className="relative mb-8">
          {/* Subtle glow behind logo */}
          <div className="absolute inset-0 -m-6 bg-teal-100/40 rounded-full blur-3xl" />
          
          {/* Logo Container */}
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-white rounded-3xl p-4 sm:p-5 md:p-6 shadow-xl shadow-black/10 border border-gray-100">
            <img 
              src="/AIIMS.png" 
              alt="AIIMS" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Title Text */}
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            AIIMS Hand Hygiene Portal
          </h1>
        </div>

        {/* Bold Loading Bar */}
        <div className="w-72 sm:w-80 md:w-96">
          {/* Progress Bar */}
          <div className="h-2.5 sm:h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-teal-600 to-teal-500 rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Progress Text */}
          <div className="flex justify-center mt-3">
            <span className="text-gray-500 text-sm font-medium">
              Loading... {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>

      {/* ==================== FOOTER ==================== */}
      <div className="absolute bottom-8 sm:bottom-10 text-center">
        <p className="text-gray-400 text-xs sm:text-sm font-medium">
          © 2026 All India Institute of Medical Sciences
        </p>
      </div>
    </div>
  );
};

export default SplashScreen;