import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useUIStore } from '../../stores/uiStore';
import { getInitials } from '../../utils/helpers';

/* --- SVG Icons --- */
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isLandingPage = location.pathname === '/';
  const isTransparent = isLandingPage && !scrolled && !isAuthenticated;

  // Landing page section links
  const landingNavLinks = [
    { name: 'Features', href: '#features' },
    { name: 'WHO Guidelines', href: '#who-guidelines' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ];

  // Handle scroll to section - FIXED
  const handleScrollToSection = (e, href) => {
    e.preventDefault();
    
    // If not on landing page, navigate there first
    if (!isLandingPage) {
      navigate('/');
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        scrollToElement(href);
      }, 100);
    } else {
      scrollToElement(href);
    }
    
    setMobileMenuOpen(false);
  };

  // Helper function to scroll to element
  const scrollToElement = (href) => {
    const sectionId = href.replace('#', '');
    const element = document.getElementById(sectionId);
    
    if (element) {
      const navbarHeight = 64; // 16 * 4 = 64px (h-16)
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 50);
      
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setHidden(false);
    lastScrollY.current = 0;
  }, [location]);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
  };

  const isActive = (path) => location.pathname === path;

  const getDashboardPath = () => {
    if (user?.role === 'admin') return '/admin/dashboard';
    if (user?.role === 'auditor') return '/auditor/dashboard';
    return '/dashboard';
  };

  const navLinkClass = (path) => `
    flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
    ${isActive(path) 
      ? isTransparent 
        ? 'bg-white/20 text-gray-900' 
        : 'bg-teal-50 text-teal-700'
      : isTransparent 
        ? 'text-gray-700 hover:bg-white/50 hover:text-gray-900' 
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }
  `;

  const navbarClasses = `
    fixed top-0 left-0 right-0 z-50 
    transition-all duration-300 ease-in-out
    ${hidden ? '-translate-y-full' : 'translate-y-0'}
    ${isTransparent 
      ? 'bg-transparent' 
      : isDark
        ? 'bg-gray-900/95 backdrop-blur-md shadow-sm border-b border-gray-800'
        : 'bg-white/95 backdrop-blur-md shadow-sm'
    }
  `;

  return (
    <nav className={navbarClasses}>
      <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24">
        <div className="flex justify-between items-center h-16">
          
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {/* Single hamburger button for toggling sidebar - visible on all screens when authenticated */}
            {isAuthenticated && (
              <button
                onClick={toggleSidebar}
                aria-pressed={sidebarOpen}
                aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                className={`p-2 rounded-lg transition-colors ${
                  isTransparent 
                    ? 'text-gray-700 hover:bg-white/50' 
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            )}
            
            <Link to="/" className="flex items-center gap-3 group">
              <div className={`p-1.5 rounded-xl transition-all duration-200 ${
                isTransparent ? 'bg-white/80 shadow-sm' : 'bg-white shadow-sm'
              }`}>
                <img 
                  src="/AIIMS.png" 
                  alt="AIMS Hospital Logo" 
                  className="w-8 h-8 sm:w-9 sm:h-9 object-contain" 
                />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className={`text-[10px] uppercase tracking-wider font-medium leading-tight transition-colors ${
                  isTransparent ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  AIMS HOSPITAL
                </span>
                <span className="font-bold text-gray-900 text-sm leading-tight">
                  Hand Hygiene Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Center Section - Landing Page Nav Links - CHANGED HOVER */}
          {isLandingPage && !isAuthenticated && (
            <div className="hidden md:flex items-center gap-1">
              {landingNavLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleScrollToSection(e, link.href)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isTransparent 
                      ? 'text-gray-700 hover:bg-teal-50 hover:text-teal-700' 
                      : 'text-gray-600 hover:bg-teal-50 hover:text-teal-700'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </div>
          )}

          {/* Center Section - Authenticated Nav Links */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-1">
              <Link to={getDashboardPath()} className={navLinkClass(getDashboardPath())}>
                <HomeIcon />
                <span>Dashboard</span>
              </Link>
              <Link to="/leaderboard" className={navLinkClass('/leaderboard')}>
                <TrophyIcon />
                <span>Leaderboard</span>
              </Link>
              <Link to="/profile" className={navLinkClass('/profile')}>
                <UserIcon />
                <span>Profile</span>
              </Link>
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isTransparent 
                  ? 'text-gray-700 hover:bg-white/50' 
                  : isDark
                    ? 'text-amber-400 hover:bg-gray-700 hover:text-amber-300'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>

            {isAuthenticated ? (
              <>
                <button className={`relative p-2 rounded-lg transition-colors ${
                  isTransparent 
                    ? 'text-gray-700 hover:bg-white/50' 
                    : isDark
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                }`}>
                  <BellIcon />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-800"></span>
                </button>

                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className={`flex items-center gap-2 p-1.5 pr-3 rounded-full transition-all duration-200 ${
                      isTransparent 
                        ? 'bg-white/80 hover:bg-white border border-gray-200/50' 
                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 text-white flex items-center justify-center text-xs font-bold overflow-hidden shadow-sm">
                      {user?.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        getInitials(user?.name || 'User')
                      )}
                    </div>
                    
                    <div className="hidden sm:flex flex-col items-start">
                      <span className="text-sm font-medium text-gray-700 leading-tight">
                        {user?.name?.split(' ')[0] || 'User'}
                      </span>
                      <span className="text-[10px] text-gray-400 capitalize leading-tight">
                        {user?.role || 'Staff'}
                      </span>
                    </div>
                    
                    <ChevronDownIcon className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        {user?.role && (
                          <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-teal-50 text-teal-700 text-[10px] font-medium rounded-full uppercase">
                            <ShieldIcon />
                            {user.role}
                          </span>
                        )}
                      </div>
                      
                      <div className="py-2">
                        <Link 
                          to={getDashboardPath()}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <HomeIcon />
                          Dashboard
                        </Link>
                        <Link 
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <UserIcon />
                          My Profile
                        </Link>
                        <Link 
                          to="/settings"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <SettingsIcon />
                          Settings
                        </Link>
                      </div>
                      
                      <div className="border-t border-gray-100 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogoutIcon />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>


              </>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Mobile menu button for landing page */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className={`md:hidden p-2 rounded-lg transition-colors ${
                    isTransparent 
                      ? 'text-gray-700 hover:bg-white/50' 
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  }`}
                >
                  {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                </button>
                
                <Link 
                  to="/login" 
                  className={`hidden sm:block px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isTransparent 
                      ? 'text-gray-700 hover:bg-white/50 hover:text-gray-900' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Login
                </Link>
                <Link 
                  to="/admin-login" 
                  className={`hidden sm:flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isTransparent 
                      ? 'text-gray-700 hover:bg-white/50 hover:text-gray-900' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <ShieldIcon />
                  Admin
                </Link>
                <Link 
                  to="/register"
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden transition-all duration-200 ${
          isTransparent 
            ? 'bg-white/95 backdrop-blur-md' 
            : 'bg-white'
        }`}>
          <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-24 py-3">
            <div className="space-y-1">
              {/* Landing page mobile links - CHANGED HOVER */}
              {isLandingPage && !isAuthenticated && (
                <>
                  {landingNavLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleScrollToSection(e, link.href)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                    >
                      {link.name}
                    </a>
                  ))}
                  <div className="pt-2 mt-2 border-t border-gray-100 space-y-1">
                    <Link 
                      to="/login"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      Login
                    </Link>
                    <Link 
                      to="/admin-login"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <ShieldIcon />
                      Admin Login
                    </Link>
                  </div>
                </>
              )}

              {/* Authenticated mobile links - includes all sidebar items */}
              {isAuthenticated && (
                <>
                  <Link 
                    to={getDashboardPath()} 
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive(getDashboardPath()) 
                        ? 'bg-teal-50 text-teal-700' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <HomeIcon />
                    Dashboard
                  </Link>
                  <Link 
                    to="/observation-entry" 
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/observation-entry') 
                        ? 'bg-teal-50 text-teal-700' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Observation
                  </Link>
                  <Link 
                    to="/observation-history" 
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/observation-history') 
                        ? 'bg-teal-50 text-teal-700' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    Observation History
                  </Link>
                  <Link 
                    to="/leaderboard" 
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/leaderboard') 
                        ? 'bg-teal-50 text-teal-700' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <TrophyIcon />
                    Leaderboard
                  </Link>
                  <Link 
                    to="/rewards" 
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/rewards') 
                        ? 'bg-teal-50 text-teal-700' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                    Rewards
                  </Link>
                  <Link 
                    to="/profile" 
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/profile') 
                        ? 'bg-teal-50 text-teal-700' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <UserIcon />
                    Profile
                  </Link>
                  <Link 
                    to="/reports" 
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/reports') 
                        ? 'bg-teal-50 text-teal-700' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Reports
                  </Link>
                  <Link 
                    to="/settings" 
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/settings') 
                        ? 'bg-teal-50 text-teal-700' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <SettingsIcon />
                    Settings
                  </Link>
                  
                  <div className="pt-2 mt-2 border-t border-gray-100">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogoutIcon />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;