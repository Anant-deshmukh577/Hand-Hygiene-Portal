import { useState, useEffect } from 'react';
import SplashScreen from './components/common/SplashScreen';

/**
 * App Initializer - Wraps the main app with a splash screen
 * Shown only on first load of the session
 */
const AppInitializer = ({ children }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    // Check if splash was already shown in this session
    const splashShown = sessionStorage.getItem('splashShown');
    if (splashShown) {
      setShowSplash(false);
      setIsFirstLoad(false);
    }
  }, []);

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem('splashShown', 'true');
  };

  // If not first load, skip splash entirely
  if (!isFirstLoad) {
    return children;
  }

  return (
    <>
      {showSplash && (
        <SplashScreen 
          onComplete={handleSplashComplete} 
          minDuration={2500}
        />
      )}
      <div className={showSplash ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}>
        {children}
      </div>
    </>
  );
};

export default AppInitializer;
