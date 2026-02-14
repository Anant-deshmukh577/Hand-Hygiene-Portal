import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

/* --- SVG Icons --- */
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const EyeToggleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const SmallLockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const AuditorLoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const { auditorLogin } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await auditorLogin(formData);
      
      if (response.user?.role !== 'auditor') {
        showError('This account is not an auditor account. Please use the appropriate login page.');
        return;
      }
      showSuccess('Auditor login successful!');
      navigate('/auditor/dashboard');
    } catch (error) {
      showError(error.message || 'Auditor login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

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

          {/* Header with Icon */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 mb-4">
              <EyeIcon />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 leading-tight">
              Auditor Access
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Sign in to record hand hygiene observations
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                Auditor Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <MailIcon />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 bg-gray-50 border ${
                    errors.email 
                      ? 'border-red-400 focus:ring-red-200' 
                      : 'border-gray-200 focus:ring-blue-500 focus:border-blue-600'
                  } text-gray-900 rounded-lg focus:ring-1 outline-none transition-all placeholder-gray-400 text-sm`}
                  placeholder="e.g. auditor@aims.org"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <Link 
                  to="/forgot-password" 
                  className="text-xs font-semibold transition-colors text-blue-600 hover:text-blue-700"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <LockIcon />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-11 py-3 bg-gray-50 border ${
                    errors.password 
                      ? 'border-red-400 focus:ring-red-200' 
                      : 'border-gray-200 focus:ring-blue-500 focus:border-blue-600'
                  } text-gray-900 rounded-lg focus:ring-1 outline-none transition-all placeholder-gray-400 text-sm`}
                  placeholder="Enter your secure password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <EyeToggleIcon />
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center text-sm mt-5"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                'Sign In as Auditor'
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center justify-center gap-2">
              <SmallLockIcon />
              <p className="text-xs text-gray-500">
                This is a secure area. All login attempts are monitored and logged.
              </p>
            </div>
          </div>

          {/* Footer Link */}
          <div className="mt-6 text-center">
            <span className="text-gray-500 text-sm">Staff member? </span>
            <Link 
              to="/login" 
              className="font-semibold text-sm transition-colors text-blue-600 hover:text-blue-700"
            >
              Use Staff Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditorLoginForm;
