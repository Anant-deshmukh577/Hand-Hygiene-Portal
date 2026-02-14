import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import { authService } from '../../services/authService';

/* --- SVG Icons --- */
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const KeyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const { showSuccess, showError } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.forgotPassword(email);
      setSent(true);
      showSuccess('Password reset link sent to your email!');
    } catch (error) {
      showError(error.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  // Success State
  if (sent) {
    return (
      <div className="flex-1 w-full bg-white flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          
          {/* Card Container */}
          <div className="bg-white rounded-2xl shadow-2xl shadow-gray-400/60 overflow-hidden px-6 py-8 sm:px-8 sm:py-10">
            
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

            {/* Success Content */}
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center">
                  <CheckCircleIcon />
                </div>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Check Your Email
              </h1>
              
              <p className="text-gray-500 text-sm leading-relaxed mb-2">
                We've sent a password reset link to
              </p>
              
              <p className="text-teal-600 font-semibold text-sm mb-6">
                {email}
              </p>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 mb-6">
                <p className="text-xs text-gray-500">
                  Didn't receive the email? Check your spam folder or make sure you entered the correct email address.
                </p>
              </div>

              <Link 
                to="/login"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex justify-center items-center gap-2 text-sm"
              >
                <ArrowLeftIcon />
                Back to Login
              </Link>
            </div>

            {/* Resend Link */}
            <div className="mt-6 text-center">
              <span className="text-gray-500 text-sm">Didn't get the email? </span>
              <button 
                onClick={() => setSent(false)}
                className="text-teal-600 font-semibold text-sm hover:text-teal-700 transition-colors"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form State
  return (
    <div className="flex-1 w-full bg-white flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-2xl shadow-gray-400/60 overflow-hidden px-6 py-8 sm:px-8 sm:py-10">
          
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
            <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center">
              <KeyIcon />
            </div>
          </div>

          {/* Title Section */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 leading-tight">
              Forgot Password?
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              No worries! Enter your email and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700 block">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <MailIcon />
                </div>
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className={`w-full pl-11 pr-4 py-3 bg-gray-50 border ${
                    error ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-teal-500 focus:border-teal-600'
                  } text-gray-900 rounded-lg focus:ring-1 outline-none transition-all placeholder-gray-400 text-sm`}
                  placeholder="e.g. name@aims.org"
                />
              </div>
              {error && <p className="text-red-500 text-xs">{error}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center text-sm mt-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          {/* Back to Login Link */}
          <div className="mt-6 text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 text-teal-600 font-semibold text-sm hover:text-teal-700 transition-colors"
            >
              <ArrowLeftIcon />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;