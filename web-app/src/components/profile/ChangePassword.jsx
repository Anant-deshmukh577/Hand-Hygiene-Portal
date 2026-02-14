import { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';

/* --- SVG Icons --- */
const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const KeyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
  </svg>
);

const ChangePassword = ({ onSubmit, loading }) => {
  const { user } = useAuth();
  const isOAuthUser = user?.googleId || user?.facebookId;
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

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

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validate = () => {
    const newErrors = {};

    // Only require current password for non-OAuth users
    if (!isOAuthUser && !formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // For OAuth users, don't send currentPassword
      const payload = isOAuthUser 
        ? { newPassword: formData.newPassword }
        : { currentPassword: formData.currentPassword, newPassword: formData.newPassword };
      
      onSubmit(payload);
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  };

  // Password strength calculation
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, label: '', color: 'bg-gray-200' };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    const strengths = [
      { score: 0, label: '', color: 'bg-gray-200' },
      { score: 1, label: 'Weak', color: 'bg-red-500' },
      { score: 2, label: 'Fair', color: 'bg-orange-500' },
      { score: 3, label: 'Good', color: 'bg-yellow-500' },
      { score: 4, label: 'Strong', color: 'bg-green-500' },
      { score: 5, label: 'Very Strong', color: 'bg-teal-500' },
    ];

    return strengths[Math.min(score, 5)];
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  // Password requirements
  const requirements = [
    { label: 'At least 8 characters', met: formData.newPassword.length >= 8 },
    { label: 'Contains uppercase letter', met: /[A-Z]/.test(formData.newPassword) },
    { label: 'Contains lowercase letter', met: /[a-z]/.test(formData.newPassword) },
    { label: 'Contains a number', met: /\d/.test(formData.newPassword) },
    { label: 'Contains special character', met: /[^a-zA-Z0-9]/.test(formData.newPassword) },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/8 overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
            <LockIcon className="text-teal-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {isOAuthUser ? 'Set Password' : 'Change Password'}
            </h3>
            <p className="text-sm text-gray-500">
              {isOAuthUser 
                ? 'Create a password to enable email/password login' 
                : 'Update your account password'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-5">
          
          {/* OAuth User Info Banner */}
          {isOAuthUser && (
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-800">Google Account Detected</p>
                  <p className="text-xs text-blue-700 mt-0.5">
                    You signed in with Google. Set a password below to enable email/password login as an alternative.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Current Password - Only for non-OAuth users */}
          {!isOAuthUser && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Current Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyIcon className="text-gray-400" />
                </div>
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                  className={`
                    w-full pl-10 pr-10 py-3 
                    bg-white border rounded-xl
                    text-gray-900 placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                    transition-all duration-200
                    ${errors.currentPassword 
                      ? 'border-red-300 bg-red-50/50' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPasswords.current ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                  <XIcon className="h-3.5 w-3.5" />
                  {errors.currentPassword}
                </p>
              )}
            </div>
          )}

          {/* Divider - Only for non-OAuth users */}
          {!isOAuthUser && (
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-3 text-xs text-gray-500 uppercase tracking-wider">
                  New Password
                </span>
              </div>
            </div>
          )}

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              {isOAuthUser ? 'New Password' : 'New Password'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockIcon className="text-gray-400" />
              </div>
              <input
                type={showPasswords.new ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                className={`
                  w-full pl-10 pr-10 py-3 
                  bg-white border rounded-xl
                  text-gray-900 placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                  transition-all duration-200
                  ${errors.newPassword 
                    ? 'border-red-300 bg-red-50/50' 
                    : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPasswords.new ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                <XIcon className="h-3.5 w-3.5" />
                {errors.newPassword}
              </p>
            )}

            {/* Password Strength Indicator */}
            {formData.newPassword && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-gray-500">Password Strength</span>
                  <span className={`text-xs font-medium ${
                    passwordStrength.score >= 4 ? 'text-green-600' :
                    passwordStrength.score >= 3 ? 'text-yellow-600' :
                    passwordStrength.score >= 2 ? 'text-orange-600' : 'text-red-600'
                  }`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        level <= passwordStrength.score 
                          ? passwordStrength.color 
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ShieldIcon className="text-gray-400" />
              </div>
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                className={`
                  w-full pl-10 pr-10 py-3 
                  bg-white border rounded-xl
                  text-gray-900 placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                  transition-all duration-200
                  ${errors.confirmPassword 
                    ? 'border-red-300 bg-red-50/50' 
                    : formData.confirmPassword && formData.newPassword === formData.confirmPassword
                      ? 'border-green-300 bg-green-50/50'
                      : 'border-gray-200 hover:border-gray-300'
                  }
                `}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPasswords.confirm ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                <XIcon className="h-3.5 w-3.5" />
                {errors.confirmPassword}
              </p>
            )}
            {formData.confirmPassword && formData.newPassword === formData.confirmPassword && (
              <p className="mt-1.5 text-sm text-green-600 flex items-center gap-1">
                <CheckIcon />
                Passwords match
              </p>
            )}
          </div>

          {/* Password Requirements */}
          {formData.newPassword && (
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">
                Password Requirements
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {requirements.map((req, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 text-sm transition-colors duration-200 ${
                      req.met ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    {req.met ? (
                      <CheckIcon className="flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                    )}
                    <span>{req.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className={`
              w-full inline-flex items-center justify-center gap-2
              px-6 py-3.5 
              bg-teal-600 hover:bg-teal-700 
              text-white font-semibold rounded-xl
              shadow-lg shadow-teal-600/25 
              hover:shadow-xl hover:shadow-teal-600/30
              focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
              transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-teal-600
            `}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating Password...
              </>
            ) : (
              <>
                <LockIcon />
                {isOAuthUser ? 'Set Password' : 'Update Password'}
              </>
            )}
          </button>
        </div>
      </form>

      {/* Security Note Footer */}
      <div className="px-6 pb-6">
        <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-100">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <svg className="h-4 w-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-amber-800">Security Tip</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Never share your password with anyone. Use a unique password that you don't use for other accounts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;