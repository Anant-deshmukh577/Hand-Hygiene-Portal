import { useEffect, useState } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import Checkbox from '../common/Checkbox';
import Badge from '../common/Badge';
import WHOMomentSelector from './WHOMomentSelector';
import HygieneStatusSelector from './HygieneStatusSelector';
import ActionSelector from './ActionSelector';
import GloveSelector from './GloveSelector';
import RiskFactors from './RiskFactors';
import { useNotification } from '../../context/NotificationContext';
import { userService } from '../../services/userService';
import { DEPARTMENTS, DESIGNATIONS } from '../../utils/constants';
import { calculateObservationPoints } from '../../utils/scoreCalculator';

/* --- SVG Icons --- */
const ClipboardListIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
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

const BriefcaseIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const UserCheckIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 11l2 2 4-4" />
  </svg>
);

const LoaderIcon = () => (
  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
  </svg>
);

const ClearIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ObservationForm = ({ sessionId, onSubmit, loading }) => {
  const { showError } = useNotification();
  const [staffUsers, setStaffUsers] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [staffSearchQuery, setStaffSearchQuery] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  // Timer states for hand hygiene compliance
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerMethod, setTimerMethod] = useState(''); // 'alcohol_rub' or 'soap_water'
  const [completedTime, setCompletedTime] = useState(null);

  const [formData, setFormData] = useState({
    identifyStaff: false,
    observedStaff: '',
    department: '',
    designation: '',
    whoMoment: '',
    adherence: '',
    action: '',
    remarks: '',
    glove: 'off',
    riskFactors: {
      jewellery: false,
      watch: false,
      ring: false,
      long_nails: false,
    },
    hygieneSteps: {
      rub_palm_to_palm: false,
      rub_right_dorsum_left_palm: false,
      rub_palm_to_palm_interlaced: false,
      rub_backs_fingers: false,
      rub_thumb_rotation: false,
      rub_fingers_rotation: false,
    },
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchStaff = async () => {
      setLoadingStaff(true);
      try {
        const response = await userService.getStaffUsers();
        setStaffUsers(response.users || []);
      } catch (error) {
        showError(error?.message || 'Failed to load staff users');
      } finally {
        setLoadingStaff(false);
      }
    };
    fetchStaff();
  }, [showError]);

  // Timer countdown effect
  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive]);

  // Timer control functions
  const startTimer = (method) => {
    setTimerMethod(method);
    setTimerActive(true);
    setTimerSeconds(0);
    setCompletedTime(null);
  };

  const stopTimer = () => {
    setTimerActive(false);
    setCompletedTime(timerSeconds);
    
    // Auto-calculate adherence based on time and method
    const adherence = calculateAdherence(timerMethod, timerSeconds);
    setFormData(prev => ({ ...prev, adherence: adherence.value, action: adherence.action }));
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTimerSeconds(0);
    setTimerMethod('');
    setCompletedTime(null);
  };

  // Calculate adherence based on method and time
  const calculateAdherence = (method, seconds) => {
    if (!method) return { value: '', action: '' };

    const timeRanges = {
      alcohol_rub: { min: 20, max: 30 },
      soap_water: { min: 40, max: 60 },
    };

    const range = timeRanges[method];
    const action = method === 'alcohol_rub' ? 'rub' : 'wash';
    
    if (seconds >= range.min && seconds <= range.max) {
      // Full compliance - within optimal range
      return {
        value: 'adherence',
        action: action,
        points: 2,
        status: 'Full Compliance'
      };
    } else if (seconds >= (range.min - 5) && seconds <= (range.max + 10)) {
      // Partial compliance - slightly outside range
      return {
        value: 'partial',
        action: action,
        points: 1,
        status: 'Partial Compliance'
      };
    } else {
      // Missed - too short or too long
      return {
        value: 'missed',
        action: action,
        points: 0,
        status: 'Missed'
      };
    }
  };

  // Get compliance status for display
  const getComplianceStatus = () => {
    if (!completedTime || !timerMethod) return null;
    return calculateAdherence(timerMethod, completedTime);
  };

  const handleChange = (name, value) => {
    setFormData(prev => {
      if (name === 'identifyStaff' && !value) {
        return {
          ...prev,
          [name]: value,
          observedStaff: '',
        };
      }
      return {
        ...prev,
        [name]: value,
      };
    });
    if (name === 'identifyStaff' && !value) {
      setStaffSearchQuery('');
    }
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (formData.identifyStaff && !formData.observedStaff) {
      newErrors.observedStaff = 'Staff selection is required';
    }
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.designation) newErrors.designation = 'Designation is required';
    if (!formData.whoMoment) newErrors.whoMoment = 'WHO Moment is required';
    if (!formData.adherence) newErrors.adherence = 'Hygiene status is required';
    if (!formData.action) newErrors.action = 'Action is required';
    
    // Check if timer was used but not completed
    if (timerMethod && !completedTime) {
      newErrors.timer = 'Please complete the timer before submitting';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...formData,
        sessionId,
        duration: completedTime || 0,
      });
      // Reset form
      setFormData({
        identifyStaff: false,
        observedStaff: '',
        department: '',
        designation: '',
        whoMoment: '',
        adherence: '',
        action: '',
        remarks: '',
        glove: 'off',
        riskFactors: {
          jewellery: false,
          watch: false,
          ring: false,
          long_nails: false,
        },
        hygieneSteps: {
          rub_palm_to_palm: false,
          rub_right_dorsum_left_palm: false,
          rub_palm_to_palm_interlaced: false,
          rub_backs_fingers: false,
          rub_thumb_rotation: false,
          rub_fingers_rotation: false,
        },
      });
      setErrors({});
      resetTimer(); // Reset timer
      setStaffSearchQuery('');
    }
  };

  const handleStaffSelect = (value) => {
    const selected = staffUsers.find(user => user._id === value);
    setFormData(prev => ({
      ...prev,
      observedStaff: value,
      department: selected?.department || prev.department,
      designation: selected?.designation || prev.designation,
    }));
    if (errors.observedStaff) {
      setErrors(prev => ({
        ...prev,
        observedStaff: '',
      }));
    }
  };

  const handleClearForm = () => {
    setFormData({
      identifyStaff: false,
      observedStaff: '',
      department: '',
      designation: '',
      whoMoment: '',
      adherence: '',
      action: '',
      remarks: '',
      glove: 'off',
      riskFactors: {
        jewellery: false,
        watch: false,
        ring: false,
        long_nails: false,
      },
      hygieneSteps: {
        rub_palm_to_palm: false,
        rub_right_dorsum_left_palm: false,
        rub_palm_to_palm_interlaced: false,
        rub_backs_fingers: false,
        rub_thumb_rotation: false,
        rub_fingers_rotation: false,
      },
    });
    setErrors({});
    resetTimer(); // Reset timer
  };

  const departmentOptions = (DEPARTMENTS || []).map(dept => ({
    value: dept,
    label: dept,
  }));

  const designationOptions = (DESIGNATIONS || []).map(desig => ({
    value: desig,
    label: desig,
  }));

  const filteredStaff = staffSearchQuery
    ? staffUsers.filter(user =>
        (user.name || '').toLowerCase().includes(staffSearchQuery.toLowerCase())
      )
    : staffUsers;
  const selectedStaff = staffUsers.find(user => user._id === formData.observedStaff);
  const staffOptions = filteredStaff.map(user => ({
    value: user._id,
    label: `${user.name} (${user.department || 'N/A'} - ${user.designation || 'N/A'})`,
  }));

  // Calculate form progress
  const calculateProgress = () => {
    const fields = ['department', 'designation', 'whoMoment', 'adherence', 'action'];
    const filledFields = fields.filter(field => formData[field]).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const progress = calculateProgress();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* ==================== FORM CARD ==================== */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 overflow-hidden">
        
        {/* ==================== HEADER ==================== */}
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-teal-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/30">
                <ClipboardListIcon />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Observation Entry</h3>
                <p className="text-sm text-gray-500">Record a new hand hygiene observation</p>
              </div>
            </div>
            
            {/* Progress Indicator */}
            <div className="hidden sm:flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{progress}%</p>
                <p className="text-xs text-gray-500">Complete</p>
              </div>
              <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ==================== FORM CONTENT ==================== */}
        <div className="p-6 space-y-8">

          {/* ===== SECTION 1: STAFF IDENTIFICATION ===== */}
          <div className="space-y-4">
            {/* Section Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <UsersIcon className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Staff Information</h4>
                <p className="text-xs text-gray-500">Identify the observed healthcare worker</p>
              </div>
              <Badge variant="info" size="small">Step 1</Badge>
            </div>

            {/* Identify Staff Toggle */}
            <div className={`
              p-4 rounded-xl border-2 transition-all duration-300
              ${formData.identifyStaff 
                ? 'bg-teal-50 border-teal-200' 
                : 'bg-gray-50 border-gray-100 hover:border-gray-200'
              }
            `}>
              <label className="flex items-center gap-4 cursor-pointer">
                <div className={`
                  relative w-12 h-7 rounded-full transition-colors duration-300
                  ${formData.identifyStaff ? 'bg-teal-600' : 'bg-gray-300'}
                `}>
                  <div className={`
                    absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md
                    transition-transform duration-300
                    ${formData.identifyStaff ? 'translate-x-5' : 'translate-x-0'}
                  `} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Identify Staff Member</p>
                  <p className="text-sm text-gray-500">
                    {formData.identifyStaff 
                      ? 'Staff identification enabled - select from registered users'
                      : 'Enable to link observation to a specific staff member'
                    }
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.identifyStaff}
                  onChange={(e) => handleChange('identifyStaff', e.target.checked)}
                  disabled={loading}
                  className="sr-only"
                />
                {formData.identifyStaff && (
                  <CheckCircleIcon className="text-teal-600" />
                )}
              </label>
            </div>

            {/* Staff Selection */}
            {formData.identifyStaff && (
              <div className="animate-fadeIn">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Select Staff Member <span className="text-red-500">*</span>
                </label>
                <div className="relative mb-3">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <SearchIcon />
                  </div>
                  <input
                    type="text"
                    value={staffSearchQuery}
                    onChange={(e) => setStaffSearchQuery(e.target.value)}
                    disabled={loading || loadingStaff}
                    placeholder="Search staff by name..."
                    className={`
                      w-full pl-12 pr-12 py-3
                      bg-white border rounded-xl
                      text-gray-900
                      focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                      transition-all duration-200
                      ${errors.observedStaff ? 'border-red-300 bg-red-50' : 'border-gray-200'}
                    `}
                  />
                  {staffSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setStaffSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-4 text-gray-400 hover:text-gray-600"
                    >
                      <ClearIcon />
                    </button>
                  )}
                </div>
                {staffSearchQuery && filteredStaff.length === 0 && (
                  <p className="text-sm text-gray-500 mb-3">
                    No staff found matching "{staffSearchQuery}"
                  </p>
                )}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <UserCheckIcon />
                  </div>
                  <select
                    value={formData.observedStaff}
                    onChange={(e) => handleStaffSelect(e.target.value)}
                    disabled={loading || loadingStaff}
                    className={`
                      w-full pl-12 pr-10 py-3
                      bg-white border rounded-xl
                      text-gray-900
                      focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                      transition-all duration-200
                      appearance-none cursor-pointer
                      ${errors.observedStaff ? 'border-red-300 bg-red-50' : 'border-gray-200'}
                      ${loadingStaff ? 'animate-pulse' : ''}
                    `}
                  >
                    <option value="">
                      {loadingStaff ? 'Loading staff...' : 'Select a staff member'}
                    </option>
                    {staffOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                    {loadingStaff ? <LoaderIcon /> : <ChevronDownIcon />}
                  </div>
                </div>
                {errors.observedStaff && (
                  <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    {errors.observedStaff}
                  </p>
                )}
              </div>
            )}

            {/* Department & Designation Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Department */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Department <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <BuildingIcon />
                  </div>
                  <select
                    value={formData.department}
                    onChange={(e) => handleChange('department', e.target.value)}
                    disabled={loading || (formData.identifyStaff && Boolean(formData.department))}
                    className={`
                      w-full pl-12 pr-10 py-3
                      bg-white border rounded-xl
                      text-gray-900
                      focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                      transition-all duration-200
                      appearance-none cursor-pointer
                      disabled:bg-gray-100 disabled:cursor-not-allowed
                      ${errors.department ? 'border-red-300 bg-red-50' : 'border-gray-200'}
                    `}
                  >
                    <option value="">Select department</option>
                    {departmentOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                    <ChevronDownIcon />
                  </div>
                </div>
                {formData.identifyStaff && formData.observedStaff && selectedStaff && !selectedStaff.department && (
                  <p className="mt-2 text-xs text-amber-600">
                    Selected staff has no department on record. Please choose manually.
                  </p>
                )}
                {errors.department && (
                  <p className="mt-2 text-sm text-red-600">{errors.department}</p>
                )}
              </div>

              {/* Designation */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Designation <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <BriefcaseIcon />
                  </div>
                  <select
                    value={formData.designation}
                    onChange={(e) => handleChange('designation', e.target.value)}
                    disabled={loading || (formData.identifyStaff && Boolean(formData.designation))}
                    className={`
                      w-full pl-12 pr-10 py-3
                      bg-white border rounded-xl
                      text-gray-900
                      focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500
                      transition-all duration-200
                      appearance-none cursor-pointer
                      disabled:bg-gray-100 disabled:cursor-not-allowed
                      ${errors.designation ? 'border-red-300 bg-red-50' : 'border-gray-200'}
                    `}
                  >
                    <option value="">Select designation</option>
                    {designationOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
                    <ChevronDownIcon />
                  </div>
                </div>
                {formData.identifyStaff && formData.observedStaff && selectedStaff && !selectedStaff.designation && (
                  <p className="mt-2 text-xs text-amber-600">
                    Selected staff has no designation on record. Please choose manually.
                  </p>
                )}
                {errors.designation && (
                  <p className="mt-2 text-sm text-red-600">{errors.designation}</p>
                )}
              </div>
            </div>
          </div>

          {/* ===== DIVIDER ===== */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-sm font-medium text-gray-500">
                Observation Details
              </span>
            </div>
          </div>

          {/* ===== SECTION 2: GLOVE STATUS (Moved up to match Android) ===== */}
          <GloveSelector
            selected={formData.glove}
            onChange={(value) => handleChange('glove', value)}
          />

          {/* ===== SECTION 3: WHO MOMENT WITH TIMER ===== */}
          <div className="space-y-4">
            {/* Section Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center text-cyan-600">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">WHO 5 Moments</h4>
                <p className="text-xs text-gray-500">Select the appropriate hand hygiene moment</p>
              </div>
              <Badge variant="info" size="small">Step 2</Badge>
            </div>

            <WHOMomentSelector
              selected={formData.whoMoment}
              onChange={(value) => {
                handleChange('whoMoment', value);
                resetTimer(); // Reset timer when changing moment
              }}
              error={errors.whoMoment}
            />

            {/* Hand Hygiene Timer - Only show when WHO moment is selected */}
            {formData.whoMoment && (
              <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h5 className="font-bold text-indigo-900">Hand Hygiene Timer</h5>
                    <p className="text-sm text-indigo-700">Track compliance time accurately</p>
                  </div>
                </div>

                {/* Method Selection */}
                {!timerActive && !completedTime && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700 mb-3">Select hand hygiene method:</p>
                    
                    {/* Alcohol Hand Rub */}
                    <button
                      type="button"
                      onClick={() => startTimer('alcohol_rub')}
                      className="w-full flex items-center justify-between p-4 bg-white hover:bg-green-50 rounded-xl border-2 border-green-200 hover:border-green-400 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                          🧴
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-gray-900">Alcohol Hand Rub</p>
                          <p className="text-sm text-gray-600">Required: 20-30 seconds</p>
                        </div>
                      </div>
                      <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>

                    {/* Soap & Water */}
                    <button
                      type="button"
                      onClick={() => startTimer('soap_water')}
                      className="w-full flex items-center justify-between p-4 bg-white hover:bg-cyan-50 rounded-xl border-2 border-cyan-200 hover:border-cyan-400 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                          🧼
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-gray-900">Soap & Water</p>
                          <p className="text-sm text-gray-600">Required: 40-60 seconds</p>
                        </div>
                      </div>
                      <svg className="h-8 w-8 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Timer Display - Active */}
                {timerActive && (
                  <div className="text-center space-y-4">
                    <p className="text-sm font-medium text-indigo-700">
                      {timerMethod === 'alcohol_rub' ? '🧴 Alcohol Hand Rub' : '🧼 Soap & Water'}
                    </p>
                    
                    {/* Timer Circle */}
                    <div className="flex justify-center">
                      <div className={`
                        w-32 h-32 rounded-full flex flex-col items-center justify-center
                        bg-white border-8 transition-colors duration-300
                        ${timerSeconds >= (timerMethod === 'alcohol_rub' ? 20 : 40) 
                          ? 'border-green-500' 
                          : 'border-amber-500'
                        }
                      `}>
                        <span className="text-5xl font-black text-indigo-600">{timerSeconds}</span>
                        <span className="text-xs text-gray-500 mt-1">seconds</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Min: {timerMethod === 'alcohol_rub' ? '20s' : '40s'}</span>
                        <span>Max: {timerMethod === 'alcohol_rub' ? '30s' : '60s'}</span>
                      </div>
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            timerSeconds >= (timerMethod === 'alcohol_rub' ? 20 : 40)
                              ? 'bg-green-500'
                              : 'bg-amber-500'
                          }`}
                          style={{
                            width: `${Math.min((timerSeconds / (timerMethod === 'alcohol_rub' ? 30 : 60)) * 100, 100)}%`
                          }}
                        />
                      </div>
                    </div>

                    {/* Stop Button */}
                    <button
                      type="button"
                      onClick={stopTimer}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                      </svg>
                      Stop Timer
                    </button>

                    {/* 6 Steps Checklist - visible during active timer */}
                    <div className="w-full mt-4 p-4 bg-white/80 rounded-xl border border-indigo-100">
                      <h6 className="text-sm font-bold text-indigo-900 mb-3 flex items-center gap-2">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                        6 Steps Checklist (+1 pt each)
                      </h6>
                      <div className="space-y-2">
                        {[
                          { key: 'rub_palm_to_palm', label: 'Rub hands palm to palm' },
                          { key: 'rub_right_dorsum_left_palm', label: 'Right palm over left dorsum with interlaced fingers and vice versa' },
                          { key: 'rub_palm_to_palm_interlaced', label: 'Palm to palm with fingers interlaced' },
                          { key: 'rub_backs_fingers', label: 'Backs of fingers to opposing palms with fingers interlocked' },
                          { key: 'rub_thumb_rotation', label: 'Rotational rubbing of left thumb clasped in right palm and vice versa' },
                          { key: 'rub_fingers_rotation', label: 'Rotational rubbing, backwards and forwards with clasped fingers of right hand in left palm and vice versa' },
                        ].map((step) => (
                          <label
                            key={step.key}
                            className={`flex items-start gap-3 p-2.5 rounded-lg cursor-pointer transition-all duration-200 ${formData.hygieneSteps[step.key] ? 'bg-teal-50 border border-teal-200' : 'bg-gray-50 border border-transparent hover:bg-gray-100'}`}
                          >
                            <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                              formData.hygieneSteps[step.key] ? 'bg-teal-600 border-teal-600' : 'border-gray-300 bg-white'
                            }`}>
                              {formData.hygieneSteps[step.key] && (
                                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span className={`text-sm leading-tight ${formData.hygieneSteps[step.key] ? 'text-teal-800 font-medium' : 'text-gray-700'}`}>
                              {step.label}
                            </span>
                            <input
                              type="checkbox"
                              checked={formData.hygieneSteps[step.key]}
                              onChange={() => handleChange('hygieneSteps', {
                                ...formData.hygieneSteps,
                                [step.key]: !formData.hygieneSteps[step.key],
                              })}
                              className="sr-only"
                            />
                          </label>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {Object.values(formData.hygieneSteps).filter(Boolean).length} / 6 steps checked
                      </p>
                    </div>
                  </div>
                )}

                {/* Timer Result - Completed */}
                {!timerActive && completedTime && (() => {
                  const status = getComplianceStatus();
                  const previewAction = timerMethod === 'alcohol_rub' ? 'rub' : 'wash';
                  const previewPoints = calculateObservationPoints({
                    hygieneSteps: formData.hygieneSteps,
                    action: previewAction,
                    duration: completedTime,
                    riskFactors: formData.riskFactors,
                  });
                  const statusConfig = {
                    'Full Compliance': { 
                      bg: 'bg-green-50', 
                      border: 'border-green-500', 
                      text: 'text-green-700',
                      icon: (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )
                    },
                    'Partial Compliance': { 
                      bg: 'bg-amber-50', 
                      border: 'border-amber-500', 
                      text: 'text-amber-700',
                      icon: (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      )
                    },
                    'Missed': { 
                      bg: 'bg-red-50', 
                      border: 'border-red-500', 
                      text: 'text-red-700',
                      icon: (
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )
                    }
                  };
                  const config = statusConfig[status?.status] || statusConfig['Missed'];

                  return (
                    <div className="space-y-3">
                      <div className={`p-4 ${config.bg} border-2 ${config.border} rounded-xl`}>
                        <div className="flex items-center gap-3 mb-3">
                          <div className={config.text}>
                            {config.icon}
                          </div>
                          <h6 className={`font-bold text-lg ${config.text}`}>{status?.status}</h6>
                        </div>
                        <div className="space-y-2 text-sm text-gray-700">
                          <p><span className="font-semibold">Method:</span> {timerMethod === 'alcohol_rub' ? '🧴 Alcohol Hand Rub' : '🧼 Soap & Water'}</p>
                          <p><span className="font-semibold">Time Completed:</span> {completedTime} seconds</p>
                          <p><span className="font-semibold">Steps Checked:</span> {Object.values(formData.hygieneSteps).filter(Boolean).length} / 6</p>
                          <p className={`font-bold ${config.text}`}>Points Earned: {previewPoints} / 7</p>
                        </div>
                      </div>

                      {/* 6 Steps Checklist - still editable after timer stops */}
                      <div className="p-4 bg-white rounded-xl border border-indigo-100">
                        <h6 className="text-sm font-bold text-indigo-900 mb-3 flex items-center gap-2">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                          </svg>
                          6 Steps Checklist (+1 pt each)
                        </h6>
                        <div className="space-y-2">
                          {[
                            { key: 'rub_palm_to_palm', label: 'Rub hands palm to palm' },
                            { key: 'rub_right_dorsum_left_palm', label: 'Right palm over left dorsum with interlaced fingers and vice versa' },
                            { key: 'rub_palm_to_palm_interlaced', label: 'Palm to palm with fingers interlaced' },
                            { key: 'rub_backs_fingers', label: 'Backs of fingers to opposing palms with fingers interlocked' },
                            { key: 'rub_thumb_rotation', label: 'Rotational rubbing of left thumb clasped in right palm and vice versa' },
                            { key: 'rub_fingers_rotation', label: 'Rotational rubbing, backwards and forwards with clasped fingers of right hand in left palm and vice versa' },
                          ].map((step) => (
                            <label
                              key={step.key}
                              className={`flex items-start gap-3 p-2.5 rounded-lg cursor-pointer transition-all duration-200 ${formData.hygieneSteps[step.key] ? 'bg-teal-50 border border-teal-200' : 'bg-gray-50 border border-transparent hover:bg-gray-100'}`}
                            >
                              <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                                formData.hygieneSteps[step.key] ? 'bg-teal-600 border-teal-600' : 'border-gray-300 bg-white'
                              }`}>
                                {formData.hygieneSteps[step.key] && (
                                  <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                              <span className={`text-sm leading-tight ${formData.hygieneSteps[step.key] ? 'text-teal-800 font-medium' : 'text-gray-700'}`}>
                                {step.label}
                              </span>
                              <input
                                type="checkbox"
                                checked={formData.hygieneSteps[step.key]}
                                onChange={() => handleChange('hygieneSteps', {
                                  ...formData.hygieneSteps,
                                  [step.key]: !formData.hygieneSteps[step.key],
                                })}
                                className="sr-only"
                              />
                            </label>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {Object.values(formData.hygieneSteps).filter(Boolean).length} / 6 steps checked
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={resetTimer}
                        className="w-full py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200"
                      >
                        Reset Timer
                      </button>
                    </div>
                  );
                })()}
              </div>
            )}
            
            {/* Timer Error Message */}
            {errors.timer && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center gap-2 text-red-700">
                  <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">{errors.timer}</span>
                </div>
              </div>
            )}
          </div>

          {/* ===== SECTION 4: HYGIENE STATUS (Only show if timer completed or no timer used) ===== */}
          {(completedTime || !formData.whoMoment) && (
            <div className="space-y-4">
              {/* Section Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Hand Hygiene Status</h4>
                  <p className="text-xs text-gray-500">Adherence level based on observation</p>
                </div>
                <Badge variant="success" size="small">Step 3</Badge>
              </div>

              {/* Show timer result if completed */}
              {completedTime && (() => {
                const status = getComplianceStatus();
                const previewAction = timerMethod === 'alcohol_rub' ? 'rub' : 'wash';
                const previewPoints = calculateObservationPoints({
                  hygieneSteps: formData.hygieneSteps,
                  action: previewAction,
                  duration: completedTime,
                  riskFactors: formData.riskFactors,
                });
                const statusConfig = {
                  'Full Compliance': { 
                    bg: 'bg-green-50', 
                    border: 'border-green-500', 
                    text: 'text-green-700',
                    icon: (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )
                  },
                  'Partial Compliance': { 
                    bg: 'bg-amber-50', 
                    border: 'border-amber-500', 
                    text: 'text-amber-700',
                    icon: (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    )
                  },
                  'Missed': { 
                    bg: 'bg-red-50', 
                    border: 'border-red-500', 
                    text: 'text-red-700',
                    icon: (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )
                  }
                };
                const config = statusConfig[status?.status] || statusConfig['Missed'];

                return (
                  <div className={`p-5 ${config.bg} border-2 ${config.border} rounded-2xl`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className={config.text}>
                        {config.icon}
                      </div>
                      <h6 className={`font-bold text-lg ${config.text}`}>{status?.status}</h6>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Method:</span>
                        <span className="text-gray-900 font-semibold">
                          {timerMethod === 'alcohol_rub' ? '🧴 Alcohol Hand Rub' : '🧼 Soap & Water'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Time Completed:</span>
                        <span className="text-gray-900 font-semibold">{completedTime} seconds</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Steps Checked:</span>
                        <span className="text-gray-900 font-semibold">{Object.values(formData.hygieneSteps).filter(Boolean).length} / 6</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Adherence:</span>
                        <span className={`font-bold ${config.text}`}>
                          {formData.adherence === 'adherence' ? 'Full Adherence' : 
                           formData.adherence === 'partial' ? 'Partial Adherence' : 
                           formData.adherence === 'missed' ? 'Missed' : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="text-gray-600 font-medium">Points Earned:</span>
                        <span className={`font-bold text-lg ${config.text}`}>{previewPoints} / 7</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Manual selection only if no timer was used */}
              {!completedTime && (
                <HygieneStatusSelector
                  selected={formData.adherence}
                  onChange={(value) => handleChange('adherence', value)}
                  error={errors.adherence}
                />
              )}
            </div>
          )}

          {/* ===== SECTION 5: ACTION ===== */}
          <div className="space-y-4">
            {/* Section Header */}
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Action Taken</h4>
                <p className="text-xs text-gray-500">What action was observed</p>
              </div>
              <Badge variant="success" size="small">Step 4</Badge>
            </div>

            <ActionSelector
              selected={formData.action}
              remarks={formData.remarks}
              onActionChange={(value) => handleChange('action', value)}
              onRemarksChange={(value) => handleChange('remarks', value)}
              error={errors.action}
            />
          </div>

          {/* ===== DIVIDER ===== */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-sm font-medium text-gray-500">
                Additional Information
              </span>
            </div>
          </div>

          {/* ===== SECTION 6: RISK FACTORS (Moved above Remarks) ===== */}
          <RiskFactors
            selected={formData.riskFactors}
            onChange={(value) => handleChange('riskFactors', value)}
          />
        </div>

        {/* ==================== FOOTER ==================== */}
        <div className="px-6 py-5 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Progress Summary */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${formData.department ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>Department</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${formData.whoMoment ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>WHO Moment</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${formData.adherence ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span>Status</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleClearForm}
                disabled={loading}
                className="
                  inline-flex items-center justify-center gap-2
                  px-5 py-2.5
                  bg-white hover:bg-gray-50
                  text-gray-700 font-medium
                  rounded-xl
                  border border-gray-200
                  shadow-sm
                  hover:shadow-md
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                <RefreshIcon />
                Clear
              </button>
              <button
                type="submit"
                disabled={loading}
                className="
                  inline-flex items-center justify-center gap-2
                  px-6 py-2.5
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
                    <LoaderIcon />
                    Adding...
                  </>
                ) : (
                  <>
                    <PlusIcon />
                    Add Observation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== QUICK TIP ==================== */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-blue-900">Quick Tip</p>
            <p className="text-sm text-blue-700">
              All required fields are marked with <span className="text-red-500">*</span>. 
              Make sure to select the correct WHO moment for accurate compliance tracking.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ObservationForm;
