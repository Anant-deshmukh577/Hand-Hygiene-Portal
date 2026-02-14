import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../config/firebase';

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

const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
    <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="h-5 w-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const { login, logout, googleLogin, isAuthenticated, user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  const [pendingRedirect, setPendingRedirect] = useState(null);

  useEffect(() => {
    if (pendingRedirect && isAuthenticated && user) {
      navigate(pendingRedirect, { replace: true });
      setPendingRedirect(null);
    }
  }, [isAuthenticated, user, pendingRedirect, navigate]);

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
      const response = await login(formData);
      if (response.user?.role === 'admin') {
        logout();
        showError('Admin accounts must use the Admin Login page.');
        return;
      }
      showSuccess('Login successful!');
      if (response.user?.role === 'auditor') {
        navigate('/auditor/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      showError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const response = await googleLogin(idToken);
      showSuccess('Google login successful!');

      let redirectPath = '/dashboard';
      if (response.user?.role === 'auditor') redirectPath = '/auditor/dashboard';
      else if (response.user?.role === 'admin') redirectPath = '/admin/dashboard';
      setPendingRedirect(redirectPath);
    } catch (error) {
      showError(error.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full bg-white flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl bg-white rounded-2xl overflow-hidden shadow-2xl shadow-gray-400/60">
        <div className="flex flex-col lg:flex-row">
          
          {/* LEFT SIDE - FORM */}
          <div className="w-full lg:w-1/2 px-6 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10 flex flex-col justify-center">
            
            {/* Logo Section */}
            <div className="flex items-center gap-3 mb-6">
              <img 
                src="/AIIMS.png" 
                alt="AIMS Hospital Logo" 
                className="w-10 h-10 object-contain flex-shrink-0" 
              />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">AIMS HOSPITAL</span>
                <span className="font-bold text-gray-900 text-sm">Hand Hygiene Portal</span>
              </div>
            </div>

            {/* Title Section */}
            <div className="mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 leading-tight">
                Keep Hands Clean.<br />
                Keep Patients Safe.
              </h1>
              <p className="text-gray-500 text-sm leading-relaxed">
                Sign in to record your handwash events and earn rewards.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700 block">Hospital Email / Staff ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailIcon />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-2.5 bg-gray-50 border ${errors.email ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-teal-500'} text-gray-900 rounded-lg focus:ring-1 focus:border-teal-600 outline-none transition-all placeholder-gray-400 text-sm`}
                    placeholder="e.g. name@aims.org"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <Link to="/forgot-password" className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-10 py-2.5 bg-gray-50 border ${errors.password ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-teal-500'} text-gray-900 rounded-lg focus:ring-1 focus:border-teal-600 outline-none transition-all placeholder-gray-400 text-sm`}
                    placeholder="Enter your portal password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <EyeIcon />
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex justify-center items-center text-sm mt-4"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  'Sign In to Log Handwash'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-gray-400 uppercase tracking-widest text-xs font-medium">OR</span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-all duration-200 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <GoogleIcon />
                <span>Continue with Google Account</span>
              </button>
              
              <button
                disabled={true}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-500 font-medium py-2.5 px-4 rounded-lg text-sm cursor-not-allowed opacity-60"
              >
                <FacebookIcon />
                <span>Continue with Social Login</span>
              </button>
            </div>

            {/* Footer Link */}
            <div className="mt-6 text-center">
              <span className="text-gray-500 text-sm">New staff member? </span>
              <Link to="/register" className="text-teal-600 font-semibold text-sm hover:text-teal-700 transition-colors">
                Request Portal Access
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE - BANNER */}
          <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#148c9f] via-[#0f6b7a] to-[#0a4a54] flex-col justify-between p-8 text-white relative overflow-hidden">
            
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-72 h-72 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-white rounded-full blur-3xl"></div>
            </div>
            
            {/* Top Content */}
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-3 leading-tight">
                Elevate Hand Hygiene,<br />
                Protect Every Patient.
              </h2>
              <p className="text-white/90 text-sm leading-relaxed max-w-sm">
                Our portal turns every handwash into points and rewards.
              </p>
            </div>

            {/* Video Section - Larger */}
            <div className="relative z-10 py-8 flex-1 flex items-center">
              <div className="rounded-xl overflow-hidden shadow-2xl bg-white/10 w-full">
                <video 
                  className="w-full h-56 object-cover"
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                >
                  <source src="/washing hand.mp4" type="video/mp4" />
                </video>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="relative z-10 space-y-4">
              {/* Testimonial */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex-shrink-0 overflow-hidden">
                  <img src="/default profile.png" alt="Doctor" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">Dr. Anant Deshmukh</p>
                  <p className="text-white/75 text-xs">Infection Control Lead</p>
                </div>
              </div>

              {/* Units List */}
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/60">Used Across Units</p>
                <div className="grid grid-cols-3 gap-2 text-xs text-white">
                  <span className="px-3 py-1.5 bg-white/15 rounded text-center">ICU</span>
                  <span className="px-3 py-1.5 bg-white/15 rounded text-center">Emergency</span>
                  <span className="px-3 py-1.5 bg-white/15 rounded text-center">OT</span>
                  <span className="px-3 py-1.5 bg-white/15 rounded text-center">NICU</span>
                  <span className="px-3 py-1.5 bg-white/15 rounded text-center">OPD</span>
                  <span className="px-3 py-1.5 bg-white/15 rounded text-center">Ward</span>
                  <span className="px-3 py-1.5 bg-white/15 rounded text-center">Dialysis</span>
                  <span className="px-3 py-1.5 bg-white/15 rounded text-center">Pediatric</span>
                  <span className="px-3 py-1.5 bg-white/15 rounded text-center">Radiology</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;