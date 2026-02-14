import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../common/Loader';

/* --- SVG Icons --- */
const ShieldExclamationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const LockClosedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (roles.length > 0 && !roles.includes(user?.role)) {
    // Determine appropriate dashboard based on role
    let dashboardPath = '/dashboard';
    let dashboardLabel = 'Staff Dashboard';
    
    if (user?.role === 'admin') {
      dashboardPath = '/admin/dashboard';
      dashboardLabel = 'Admin Dashboard';
    } else if (user?.role === 'auditor') {
      dashboardPath = '/auditor/dashboard';
      dashboardLabel = 'Auditor Dashboard';
    }
    
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          
          {/* Card Container */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden px-6 py-8 sm:px-8 sm:py-10">
            
            {/* Logo Section */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <img 
                src="/AIIMS.png" 
                alt="AIMS Hospital Logo" 
                className="w-11 h-11 sm:w-12 sm:h-12 object-contain flex-shrink-0" 
              />
              <div className="flex flex-col">
                <span className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-400 font-medium">AIMS HOSPITAL</span>
                <span className="font-bold text-gray-900 text-sm">Hand Hygiene Portal</span>
              </div>
            </div>

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
                <ShieldExclamationIcon />
              </div>
            </div>

            {/* Title Section */}
            <div className="text-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                Access Denied
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed">
                You don't have permission to access this page. This area is restricted to authorized personnel only.
              </p>
            </div>

            {/* Info Box */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100 mb-6">
              <LockClosedIcon />
              <div className="text-xs text-gray-500">
                <p className="font-medium text-gray-600 mb-1">Current Access Level</p>
                <p className="capitalize">{user?.role || 'Unknown'} Account</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link 
                to={dashboardPath}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex justify-center items-center gap-2 text-sm"
              >
                <HomeIcon />
                Go to {dashboardLabel}
              </Link>
              
              <button 
                onClick={() => window.history.back()}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex justify-center items-center gap-2 text-sm border border-gray-200"
              >
                <ArrowLeftIcon />
                Go Back
              </button>
            </div>

            {/* Help Link */}
            <div className="mt-6 text-center">
              <span className="text-gray-500 text-sm">Need access? </span>
              <Link 
                to="/contact" 
                className="text-teal-600 font-semibold text-sm hover:text-teal-700 transition-colors"
              >
                Contact Admin
              </Link>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400">
              This access attempt has been logged for security purposes.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;