import { useState } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { DEPARTMENTS, DESIGNATIONS } from '../../utils/constants';

/* --- SVG Icons --- */
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const BuildingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const BriefcaseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PencilIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const SaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ExclamationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ProfileForm = ({ user, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    department: user.department || '',
    designation: user.designation || '',
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

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

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const departmentOptions = DEPARTMENTS.map(dept => ({
    value: dept,
    label: dept,
  }));

  const designationOptions = DESIGNATIONS.map(desig => ({
    value: desig,
    label: desig,
  }));

  // Check if field is valid (touched and no error)
  const isFieldValid = (name) => touched[name] && !errors[name] && formData[name];

  // Calculate form completion percentage
  const filledFields = Object.values(formData).filter(v => v.trim() !== '').length;
  const totalFields = Object.keys(formData).length;
  const completionPercentage = Math.round((filledFields / totalFields) * 100);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/8 overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
              <PencilIcon className="text-teal-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>
              <p className="text-sm text-gray-500">Update your personal information</p>
            </div>
          </div>

          {/* Completion Indicator */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-gray-500">Completion</p>
              <p className={`text-sm font-semibold ${
                completionPercentage === 100 ? 'text-green-600' : 'text-gray-700'
              }`}>
                {completionPercentage}%
              </p>
            </div>
            <div className="w-12 h-12 relative">
              <svg className="w-12 h-12 transform -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="4"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke={completionPercentage === 100 ? '#10b981' : '#14b8a6'}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${completionPercentage * 1.256} 125.6`}
                  className="transition-all duration-500"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-5">
          
          {/* Personal Information Section */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Personal Information
            </h4>
            
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your full name"
                    className={`
                      w-full pl-10 pr-10 py-3 
                      bg-white border rounded-xl
                      text-gray-900 placeholder-gray-400
                      focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                      transition-all duration-200
                      ${errors.name 
                        ? 'border-red-300 bg-red-50/50' 
                        : isFieldValid('name')
                          ? 'border-green-300 bg-green-50/50'
                          : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  />
                  {isFieldValid('name') && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-500">
                      <CheckCircleIcon />
                    </div>
                  )}
                </div>
                {errors.name && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <ExclamationIcon />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailIcon className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter your email address"
                    className={`
                      w-full pl-10 pr-10 py-3 
                      bg-white border rounded-xl
                      text-gray-900 placeholder-gray-400
                      focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                      transition-all duration-200
                      ${errors.email 
                        ? 'border-red-300 bg-red-50/50' 
                        : isFieldValid('email')
                          ? 'border-green-300 bg-green-50/50'
                          : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  />
                  {isFieldValid('email') && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-500">
                      <CheckCircleIcon />
                    </div>
                  )}
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <ExclamationIcon />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PhoneIcon className="text-gray-400" />
                  </div>
                  <div className="absolute inset-y-0 left-10 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-sm border-r border-gray-200 pr-2">+91</span>
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter 10-digit phone number"
                    maxLength={10}
                    className={`
                      w-full pl-20 pr-10 py-3 
                      bg-white border rounded-xl
                      text-gray-900 placeholder-gray-400
                      focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                      transition-all duration-200
                      ${errors.phone 
                        ? 'border-red-300 bg-red-50/50' 
                        : isFieldValid('phone')
                          ? 'border-green-300 bg-green-50/50'
                          : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  />
                  {isFieldValid('phone') && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-green-500">
                      <CheckCircleIcon />
                    </div>
                  )}
                </div>
                {errors.phone && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <ExclamationIcon />
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
          </div>

          {/* Work Information Section */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Work Information
            </h4>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Department <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BuildingIcon className="text-gray-400" />
                  </div>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`
                      w-full pl-10 pr-10 py-3 
                      bg-white border rounded-xl
                      text-gray-900 
                      focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                      transition-all duration-200
                      appearance-none cursor-pointer
                      ${!formData.department ? 'text-gray-400' : 'text-gray-900'}
                      ${errors.department 
                        ? 'border-red-300 bg-red-50/50' 
                        : isFieldValid('department')
                          ? 'border-green-300 bg-green-50/50'
                          : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <option value="" disabled>Select department</option>
                    {departmentOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    {isFieldValid('department') ? (
                      <CheckCircleIcon className="text-green-500" />
                    ) : (
                      <ChevronDownIcon className="text-gray-400" />
                    )}
                  </div>
                </div>
                {errors.department && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <ExclamationIcon />
                    {errors.department}
                  </p>
                )}
              </div>

              {/* Designation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Designation <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BriefcaseIcon className="text-gray-400" />
                  </div>
                  <select
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`
                      w-full pl-10 pr-10 py-3 
                      bg-white border rounded-xl
                      text-gray-900 
                      focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent
                      transition-all duration-200
                      appearance-none cursor-pointer
                      ${!formData.designation ? 'text-gray-400' : 'text-gray-900'}
                      ${errors.designation 
                        ? 'border-red-300 bg-red-50/50' 
                        : isFieldValid('designation')
                          ? 'border-green-300 bg-green-50/50'
                          : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <option value="" disabled>Select designation</option>
                    {designationOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    {isFieldValid('designation') ? (
                      <CheckCircleIcon className="text-green-500" />
                    ) : (
                      <ChevronDownIcon className="text-gray-400" />
                    )}
                  </div>
                </div>
                {errors.designation && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <ExclamationIcon />
                    {errors.designation}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200"
          >
            <XIcon />
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className={`
              flex-1 sm:flex-none inline-flex items-center justify-center gap-2
              px-8 py-3 
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
                Saving...
              </>
            ) : (
              <>
                <SaveIcon />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>

      {/* Info Footer */}
      <div className="px-6 pb-6">
        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800">Profile Information</p>
              <p className="text-xs text-blue-700 mt-0.5">
                Your profile information is visible to administrators and may be used for identification and communication purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;