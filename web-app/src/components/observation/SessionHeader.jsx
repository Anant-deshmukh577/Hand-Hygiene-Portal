import { useState } from 'react';
import Badge from '../common/Badge';
import { WARDS } from '../../utils/constants';

/* --- SVG Icons --- */
const ClipboardCheckIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const UserIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PlayIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ExclamationIcon = () => (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const LoaderIcon = () => (
  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

const SessionHeader = ({ 
  onSessionCreate, 
  loading = false,
  existingSession = null,
  showTitle = true 
}) => {
  const [sessionData, setSessionData] = useState({
    auditorName: '',
    ward: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSessionData(prev => ({
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

  const validate = () => {
    const newErrors = {};
    if (!sessionData.auditorName.trim()) {
      newErrors.auditorName = 'Auditor name is required';
    }
    if (!sessionData.ward) {
      newErrors.ward = 'Ward is required';
    }
    if (!sessionData.date) {
      newErrors.date = 'Date is required';
    }
    if (!sessionData.time) {
      newErrors.time = 'Time is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSessionCreate(sessionData);
    }
  };

  const wardOptions = (WARDS || []).map(ward => ({
    value: ward,
    label: ward,
  }));

  // Check if form is complete
  const isFormComplete = sessionData.auditorName && sessionData.ward && sessionData.date && sessionData.time;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 overflow-hidden mb-6">
      
      {/* ==================== HEADER ==================== */}
      <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <ClipboardCheckIcon />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Audit Session Details</h3>
              <p className="text-sm text-gray-500">Configure your observation session</p>
            </div>
          </div>
          
          {/* Status Badge */}
          {existingSession ? (
            <Badge variant="success" size="medium">
              <div className="flex items-center gap-1.5">
                <CheckCircleIcon className="h-4 w-4" />
                Session Active
              </div>
            </Badge>
          ) : (
            <Badge variant="secondary" size="medium">
              Not Started
            </Badge>
          )}
        </div>
      </div>

      {/* ==================== FORM CONTENT ==================== */}
      <form onSubmit={handleSubmit} className="p-6">
        
        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          
          {/* Auditor Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Auditor Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <UserIcon />
              </div>
              <input
                type="text"
                name="auditorName"
                value={sessionData.auditorName}
                onChange={handleChange}
                placeholder="Enter your name"
                disabled={loading}
                className={`
                  w-full pl-12 pr-4 py-3
                  bg-white border rounded-xl
                  text-gray-900 placeholder:text-gray-400
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  transition-all duration-200
                  disabled:bg-gray-100 disabled:cursor-not-allowed
                  ${errors.auditorName ? 'border-red-300 bg-red-50' : 'border-gray-200'}
                `}
              />
            </div>
            {errors.auditorName && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <ExclamationIcon />
                {errors.auditorName}
              </p>
            )}
          </div>

          {/* Ward */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Ward <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <BuildingIcon />
              </div>
              <select
                name="ward"
                value={sessionData.ward}
                onChange={handleChange}
                disabled={loading}
                className={`
                  w-full pl-12 pr-10 py-3
                  bg-white border rounded-xl
                  text-gray-900
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  transition-all duration-200
                  appearance-none cursor-pointer
                  disabled:bg-gray-100 disabled:cursor-not-allowed
                  ${errors.ward ? 'border-red-300 bg-red-50' : 'border-gray-200'}
                `}
              >
                <option value="">Select ward</option>
                {wardOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                <ChevronDownIcon />
              </div>
            </div>
            {errors.ward && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <ExclamationIcon />
                {errors.ward}
              </p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <CalendarIcon />
              </div>
              <input
                type="date"
                name="date"
                value={sessionData.date}
                onChange={handleChange}
                disabled={loading}
                className={`
                  w-full pl-12 pr-4 py-3
                  bg-white border rounded-xl
                  text-gray-900
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  transition-all duration-200
                  disabled:bg-gray-100 disabled:cursor-not-allowed
                  ${errors.date ? 'border-red-300 bg-red-50' : 'border-gray-200'}
                `}
              />
            </div>
            {errors.date && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <ExclamationIcon />
                {errors.date}
              </p>
            )}
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Time <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <ClockIcon />
              </div>
              <input
                type="time"
                name="time"
                value={sessionData.time}
                onChange={handleChange}
                disabled={loading}
                className={`
                  w-full pl-12 pr-4 py-3
                  bg-white border rounded-xl
                  text-gray-900
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  transition-all duration-200
                  disabled:bg-gray-100 disabled:cursor-not-allowed
                  ${errors.time ? 'border-red-300 bg-red-50' : 'border-gray-200'}
                `}
              />
            </div>
            {errors.time && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <ExclamationIcon />
                {errors.time}
              </p>
            )}
          </div>
        </div>

        {/* Session Summary Preview */}
        {isFormComplete && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                <ClipboardCheckIcon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-900 mb-2">Session Preview</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <div>
                    <p className="text-blue-600/70 text-xs mb-0.5">Auditor</p>
                    <p className="text-blue-800 font-medium truncate">{sessionData.auditorName}</p>
                  </div>
                  <div>
                    <p className="text-blue-600/70 text-xs mb-0.5">Ward</p>
                    <p className="text-blue-800 font-medium truncate">{sessionData.ward}</p>
                  </div>
                  <div>
                    <p className="text-blue-600/70 text-xs mb-0.5">Date</p>
                    <p className="text-blue-800 font-medium">
                      {new Date(sessionData.date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-600/70 text-xs mb-0.5">Time</p>
                    <p className="text-blue-800 font-medium">{sessionData.time}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            All fields are required to start the session
          </p>
          
          <button
            type="submit"
            disabled={loading || !isFormComplete}
            className="
              inline-flex items-center justify-center gap-2
              px-8 py-3
              bg-blue-600 hover:bg-blue-700
              text-white font-semibold
              rounded-xl
              shadow-lg shadow-blue-600/25
              hover:shadow-xl hover:shadow-blue-600/30
              transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {loading ? (
              <>
                <LoaderIcon />
                Starting Session...
              </>
            ) : (
              <>
                <PlayIcon />
                Start Session
              </>
            )}
          </button>
        </div>
      </form>

      {/* ==================== FOOTER TIP ==================== */}
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="h-3 w-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Quick Tip</p>
            <p className="text-sm text-gray-500 mt-0.5">
              Once started, you can add multiple observations to this session. Session details will be recorded with each observation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionHeader;