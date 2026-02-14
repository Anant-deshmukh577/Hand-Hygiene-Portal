import { useState } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { userService } from '../../services/userService';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import Modal from '../common/Modal';
import Badge from '../common/Badge';

/* --- SVG Icons --- */
const UserPlusIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
  </svg>
);

const UserIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const MailIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const EyeIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const CogIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const ArrowLeftIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const InfoIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AddUserForm = ({ isOpen, onClose, onUserAdded }) => {
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    department: '',
    designation: '',
    role: 'staff',
  });

  const [errors, setErrors] = useState({});

  const departments = [
    { value: 'Medicine', label: 'Medicine' },
    { value: 'Surgery', label: 'Surgery' },
    { value: 'Pediatrics', label: 'Pediatrics' },
    { value: 'Emergency', label: 'Emergency' },
    { value: 'ICU', label: 'ICU' },
    { value: 'NICU', label: 'NICU' },
    { value: 'PICU', label: 'PICU' },
    { value: 'OT', label: 'Operation Theatre (OT)' },
    { value: 'OPD', label: 'OPD' },
    { value: 'Infection Control', label: 'Infection Control' },
    { value: 'Administration', label: 'Administration' },
    { value: 'Other', label: 'Other' },
  ];

  const designations = [
    { value: 'Staff Nurse', label: 'Staff Nurse' },
    { value: 'Senior Nurse', label: 'Senior Nurse' },
    { value: 'Nursing Officer', label: 'Nursing Officer' },
    { value: 'Resident Doctor', label: 'Resident Doctor' },
    { value: 'Senior Resident', label: 'Senior Resident' },
    { value: 'Consultant', label: 'Consultant' },
    { value: 'Professor', label: 'Professor' },
    { value: 'Infection Control Auditor', label: 'Infection Control Auditor' },
    { value: 'System Administrator', label: 'System Administrator' },
    { value: 'Other', label: 'Other' },
  ];

  const roles = [
    { 
      value: 'staff', 
      label: 'Staff',
      description: 'Healthcare Worker - Can view dashboard, claim rewards, see leaderboard',
      icon: <UserIcon />,
      color: 'teal',
    },
    { 
      value: 'auditor', 
      label: 'Auditor',
      description: 'Infection Control - Can record observations and create sessions',
      icon: <EyeIcon />,
      color: 'blue',
    },
    { 
      value: 'admin', 
      label: 'Admin',
      description: 'System Manager - Full system access, can manage everything',
      icon: <CogIcon />,
      color: 'purple',
    },
  ];

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Phone must be 10 digits';
    }

    if (!formData.department) {
      newErrors.department = 'Department is required';
    }

    if (!formData.designation) {
      newErrors.designation = 'Designation is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleRoleSelect = (role) => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    } else {
      showError('Please fix the errors before continuing');
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep2()) {
      showError('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const data = await userService.createUser({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.trim(),
        department: formData.department,
        designation: formData.designation,
        role: formData.role,
      });

      showSuccess(`${formData.role.charAt(0).toUpperCase() + formData.role.slice(1)} user created successfully!`);
      
      resetForm();

      if (onUserAdded && data.user) {
        onUserAdded(data.user);
      }

      onClose();
    } catch (error) {
      showError(error.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      department: '',
      designation: '',
      role: 'staff',
    });
    setErrors({});
    setStep(1);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Get role color classes - matching your design system
  const getRoleColorClasses = (role) => {
    const colorMap = {
      staff: {
        selected: 'border-teal-500 bg-teal-50 ring-2 ring-teal-500/20',
        unselected: 'border-gray-200 bg-white hover:border-teal-200 hover:bg-teal-50/30',
        icon: 'bg-teal-100 text-teal-600',
        iconSelected: 'bg-teal-600 text-white',
        check: 'text-teal-600',
      },
      auditor: {
        selected: 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/20',
        unselected: 'border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/30',
        icon: 'bg-blue-100 text-blue-600',
        iconSelected: 'bg-blue-600 text-white',
        check: 'text-blue-600',
      },
      admin: {
        selected: 'border-purple-500 bg-purple-50 ring-2 ring-purple-500/20',
        unselected: 'border-gray-200 bg-white hover:border-purple-200 hover:bg-purple-50/30',
        icon: 'bg-purple-100 text-purple-600',
        iconSelected: 'bg-purple-600 text-white',
        check: 'text-purple-600',
      },
    };
    return colorMap[role] || colorMap.staff;
  };

  // Password strength calculation
  const getPasswordStrength = (password) => {
    if (!password) return { level: 0, label: '', color: '' };
    if (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      return { level: 100, label: 'Strong', color: 'green' };
    }
    if (password.length >= 8) {
      return { level: 66, label: 'Medium', color: 'amber' };
    }
    return { level: 33, label: 'Weak', color: 'red' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={handleClose} 
      title="Add New User"
      icon={<UserPlusIcon />}
      iconColor="teal"
      size="large"
    >
      {/* ==================== STEP INDICATOR ==================== */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          {/* Step 1 */}
          <div className="flex items-center">
            <div className={`
              w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm
              shadow-lg transition-all duration-300
              ${step >= 1 
                ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-teal-500/30' 
                : 'bg-gray-100 text-gray-400 shadow-black/5'
              }
            `}>
              {step > 1 ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : '1'}
            </div>
            <span className={`ml-3 text-sm font-semibold hidden sm:block ${step >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>
              Basic Info
            </span>
          </div>

          {/* Connector Line */}
          <div className="relative w-20 sm:w-32 mx-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-1 bg-gray-200 rounded-full"></div>
            </div>
            <div 
              className={`absolute inset-0 flex items-center transition-all duration-500`}
              style={{ width: step >= 2 ? '100%' : '0%' }}
            >
              <div className="w-full h-1 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full"></div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-center">
            <div className={`
              w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm
              shadow-lg transition-all duration-300
              ${step >= 2 
                ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-teal-500/30' 
                : 'bg-gray-100 text-gray-400 shadow-black/5'
              }
            `}>
              2
            </div>
            <span className={`ml-3 text-sm font-semibold hidden sm:block ${step >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>
              Details
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* ==================== STEP 1: ROLE & BASIC INFO ==================== */}
        {step === 1 && (
          <div className="space-y-6">
            
            {/* Role Selection Cards */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Select User Role <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {roles.map((role) => {
                  const isSelected = formData.role === role.value;
                  const colorClasses = getRoleColorClasses(role.value);
                  
                  return (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => handleRoleSelect(role.value)}
                      className={`
                        group relative p-5 rounded-2xl border-2 text-left
                        shadow-lg transition-all duration-300
                        hover:-translate-y-1 hover:shadow-xl
                        ${isSelected 
                          ? `${colorClasses.selected} shadow-black/10`
                          : `${colorClasses.unselected} shadow-black/5`
                        }
                      `}
                    >
                      {/* Selected Check Indicator */}
                      {isSelected && (
                        <div className={`absolute top-3 right-3 ${colorClasses.check}`}>
                          <CheckCircleIcon />
                        </div>
                      )}

                      {/* Icon Container */}
                      <div className={`
                        w-12 h-12 rounded-xl flex items-center justify-center mb-4
                        transition-all duration-300
                        ${isSelected ? colorClasses.iconSelected : colorClasses.icon}
                      `}>
                        {role.icon}
                      </div>

                      {/* Label & Description */}
                      <h4 className="font-bold text-gray-900 mb-1.5">{role.label}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                        {role.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divider with Label */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-sm font-medium text-gray-500">
                  User Information
                </span>
              </div>
            </div>

            {/* Name Input */}
            <Input
              label="Full Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Dr. Rajesh Kumar"
              icon={<UserIcon />}
              error={errors.name}
              required
            />

            {/* Email Input */}
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g., rajesh@aiims.edu"
              icon={<MailIcon />}
              error={errors.email}
              hint="This will be used for login"
              required
            />

            {/* Password Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 8 characters"
                error={errors.password}
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                error={errors.confirmPassword}
                required
              />
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-gray-700">Password Strength</p>
                  <span className={`
                    text-xs font-bold px-2 py-0.5 rounded-full
                    ${passwordStrength.color === 'green' ? 'bg-green-100 text-green-700' :
                      passwordStrength.color === 'amber' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'}
                  `}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      passwordStrength.color === 'green' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                      passwordStrength.color === 'amber' ? 'bg-gradient-to-r from-amber-400 to-amber-600' :
                      'bg-gradient-to-r from-red-400 to-red-600'
                    }`}
                    style={{ width: `${passwordStrength.level}%` }}
                  />
                </div>
                <p className="text-[10px] text-gray-500 mt-2">
                  Use 12+ characters with uppercase, numbers, and symbols for a strong password
                </p>
              </div>
            )}

            {/* Step 1 Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handleClose}
                className="
                  inline-flex items-center justify-center gap-2 
                  px-6 py-3 
                  bg-white hover:bg-gray-50 
                  text-gray-700 font-semibold 
                  rounded-xl 
                  border border-gray-200 
                  shadow-md shadow-black/5 
                  hover:shadow-lg hover:shadow-black/10 
                  transition-all duration-300
                "
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleNextStep}
                className="
                  group inline-flex items-center justify-center gap-2 
                  px-6 py-3 
                  bg-teal-600 hover:bg-teal-700 
                  text-white font-semibold 
                  rounded-xl 
                  shadow-lg shadow-teal-600/25 
                  hover:shadow-xl hover:shadow-teal-600/30 
                  transition-all duration-300
                "
              >
                Continue
                <ArrowRightIcon />
              </button>
            </div>
          </div>
        )}

        {/* ==================== STEP 2: ADDITIONAL DETAILS ==================== */}
        {step === 2 && (
          <div className="space-y-6">
            
            {/* Selected Role Summary Card */}
            <div className="p-5 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5">
              <div className="flex items-center gap-4">
                <div className={`
                  w-14 h-14 rounded-2xl flex items-center justify-center
                  shadow-lg transition-all duration-300
                  ${getRoleColorClasses(formData.role).iconSelected}
                  ${formData.role === 'staff' ? 'shadow-teal-500/30' : 
                    formData.role === 'auditor' ? 'shadow-blue-500/30' : 'shadow-purple-500/30'}
                `}>
                  {roles.find(r => r.value === formData.role)?.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-900 text-lg truncate">
                      {formData.name || 'New User'}
                    </span>
                    <Badge 
                      variant={
                        formData.role === 'admin' ? 'purple' : 
                        formData.role === 'auditor' ? 'info' : 'primary'
                      } 
                      size="small"
                    >
                      {formData.role}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 truncate">{formData.email}</p>
                </div>
              </div>
            </div>

            {/* Phone Input */}
            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="10 digits (e.g., 9876543210)"
              icon={<PhoneIcon />}
              error={errors.phone}
              maxLength={10}
              hint="Indian mobile number without country code"
              required
            />

            {/* Department & Designation Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                options={departments}
                placeholder="Select department"
                icon={<BuildingIcon />}
                error={errors.department}
                searchable
                required
              />

              <Select
                label="Designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                options={designations}
                placeholder="Select designation"
                icon={<BriefcaseIcon />}
                error={errors.designation}
                searchable
                required
              />
            </div>

            {/* Role-specific Info Cards */}
            {formData.role === 'admin' && (
              <div className="p-5 bg-gradient-to-br from-purple-50 to-white rounded-2xl border border-purple-100 shadow-lg shadow-purple-500/10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0 shadow-md shadow-purple-500/20">
                    <ShieldIcon className="text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-purple-900 mb-1">Admin Access</h4>
                    <p className="text-sm text-purple-700 leading-relaxed">
                      This user will have full system access including user management, ward management, and reward configuration.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {formData.role === 'auditor' && (
              <div className="p-5 bg-gradient-to-br from-blue-50 to-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-500/10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20">
                    <EyeIcon className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-900 mb-1">Auditor Access</h4>
                    <p className="text-sm text-blue-700 leading-relaxed">
                      This user can create observation sessions, record hand hygiene observations, and view compliance reports.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {formData.role === 'staff' && (
              <div className="p-5 bg-gradient-to-br from-teal-50 to-white rounded-2xl border border-teal-100 shadow-lg shadow-teal-500/10">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0 shadow-md shadow-teal-500/20">
                    <UserIcon className="text-teal-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-teal-900 mb-1">Staff Access</h4>
                    <p className="text-sm text-teal-700 leading-relaxed">
                      This user can view their dashboard, track compliance, claim rewards, and participate in the leaderboard.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handlePrevStep}
                className="
                  inline-flex items-center justify-center gap-2 
                  px-5 py-2.5 
                  text-gray-600 hover:text-gray-900
                  font-medium 
                  rounded-xl 
                  hover:bg-gray-100
                  transition-all duration-200
                "
              >
                <ArrowLeftIcon />
                Back
              </button>
              
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={loading}
                  className="
                    inline-flex items-center justify-center gap-2 
                    px-6 py-3 
                    bg-white hover:bg-gray-50 
                    text-gray-700 font-semibold 
                    rounded-xl 
                    border border-gray-200 
                    shadow-md shadow-black/5 
                    hover:shadow-lg hover:shadow-black/10 
                    transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="
                    group inline-flex items-center justify-center gap-2 
                    px-6 py-3 
                    bg-teal-600 hover:bg-teal-700 
                    text-white font-semibold 
                    rounded-xl 
                    shadow-lg shadow-teal-600/25 
                    hover:shadow-xl hover:shadow-teal-600/30 
                    transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <UserPlusIcon />
                      Create User
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* ==================== FOOTER HELP TEXT ==================== */}
      <div className="mt-8 pt-5 border-t border-gray-100">
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <InfoIcon className="h-4 w-4" />
          <span>An email with login credentials will be sent to the user after account creation.</span>
        </div>
      </div>
    </Modal>
  );
};

export default AddUserForm;