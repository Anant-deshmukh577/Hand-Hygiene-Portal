import { Link } from 'react-router-dom';

/* --- SVG Icons --- */
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50/30 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-lg text-center">
        
        {/* 404 Illustration */}
        <div className="mb-8">
          {/* Search Icon with Animation */}
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400 mb-6 animate-pulse">
            <SearchIcon />
          </div>

          {/* 404 Number */}
          <div className="relative">
            <h1 className="text-8xl sm:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-600">
              404
            </h1>
            {/* Shadow Effect */}
            <div className="absolute inset-0 text-8xl sm:text-9xl font-bold text-teal-500/10 blur-sm -z-10">
              404
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Page Not Found
          </h2>
          <p className="text-gray-500 text-base sm:text-lg max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist or has been moved to a different location.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl shadow-lg shadow-teal-600/25 hover:shadow-xl hover:shadow-teal-600/30 transition-all duration-300"
          >
            <HomeIcon />
            Go to Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border border-gray-200 shadow-md shadow-black/5 hover:shadow-lg hover:shadow-black/10 transition-all duration-300"
          >
            <ArrowLeftIcon />
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Here are some helpful links instead:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link 
              to="/dashboard" 
              className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
            >
              Dashboard
            </Link>
            <span className="text-gray-300">•</span>
            <Link 
              to="/leaderboard" 
              className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
            >
              Leaderboard
            </Link>
            <span className="text-gray-300">•</span>
            <Link 
              to="/rewards" 
              className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
            >
              Rewards
            </Link>
            <span className="text-gray-300">•</span>
            <Link 
              to="/login" 
              className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8">
          <p className="text-xs text-gray-400">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;