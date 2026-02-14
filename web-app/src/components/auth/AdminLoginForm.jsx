import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

/* --- SVG Icons --- */
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

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const ClipboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const SmallLockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const AdminLoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState('admin');

  const { adminLogin, auditorLogin } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  // Dynamic color classes based on login type
  const colors = {
    admin: {
      toggle: 'bg-teal-600 text-white shadow-sm',
      button: 'bg-teal-600 hover:bg-teal-700',
      focusRing: 'focus:ring-teal-500 focus:border-teal-600',
      link: 'text-teal-600 hover:text-teal-700',
    },
    auditor: {
      toggle: 'bg-indigo-600 text-white shadow-sm',
      button: 'bg-indigo-600 hover:bg-indigo-700',
      focusRing: 'focus:ring-indigo-500 focus:border-indigo-600',
      link: 'text-indigo-600 hover:text-indigo-700',
    },
  };

  const currentColors = colors[loginType];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      let response;
      if (loginType === 'admin') {
        response = await adminLogin(formData);
        if (response.user?.role !== 'admin') {
          showError('This account is not an admin account. Please use the regular login page.');
          return;
        }
        showSuccess('Admin login successful!');
        navigate('/admin/dashboard');
      } else {
        response = await auditorLogin(formData);
        if (response.user?.role !== 'auditor') {
          showError('This account is not an auditor account. Please use the appropriate login page.');
          return;
        }
        showSuccess('Auditor login successful!');
        navigate('/auditor/dashboard');
      }
    } catch (error) {
      showError(error.message || `${loginType === 'admin' ? 'Admin' : 'Auditor'} login failed. Please check your credentials.`);
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

          {/* Title Section */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 leading-tight">
              Administrative Access
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Secure login for administrators and auditors
            </p>
          </div>

          {/* Toggle Buttons - Dynamic Colors */}
          <div className="flex gap-2 mb-6 bg-gray-100 p-1.5 rounded-xl">
            <button
              type="button"
              onClick={() => setLoginType('admin')}
              className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                loginType === 'admin'
                  ? currentColors.toggle
                  : 'bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <ShieldIcon />
              <span>Admin</span>
            </button>
            <button
              type="button"
              onClick={() => setLoginType('auditor')}
              className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                loginType === 'auditor'
                  ? currentColors.toggle
                  : 'bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <ClipboardIcon />
              <span>Auditor</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">
                {loginType === 'admin' ? 'Admin Email' : 'Auditor Email'}
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
                      : `border-gray-200 ${currentColors.focusRing}`
                  } text-gray-900 rounded-lg focus:ring-1 outline-none transition-all placeholder-gray-400 text-sm`}
                  placeholder={`e.g. ${loginType}@aims.org`}
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
                  className={`text-xs font-semibold transition-colors ${currentColors.link}`}
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
                      : `border-gray-200 ${currentColors.focusRing}`
                  } text-gray-900 rounded-lg focus:ring-1 outline-none transition-all placeholder-gray-400 text-sm`}
                  placeholder="Enter your secure password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <EyeIcon />
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Login Button - Dynamic Color */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${currentColors.button} text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center text-sm mt-5`}
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                `Sign In as ${loginType === 'admin' ? 'Administrator' : 'Auditor'}`
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

          {/* Footer Link - Dynamic Color */}
          <div className="mt-6 text-center">
            <span className="text-gray-500 text-sm">Staff member? </span>
            <Link 
              to="/login" 
              className={`font-semibold text-sm transition-colors ${currentColors.link}`}
            >
              Use Staff Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginForm;