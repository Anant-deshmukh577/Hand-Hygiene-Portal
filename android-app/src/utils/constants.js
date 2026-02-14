import Constants from 'expo-constants';

const envBaseUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
const resolvedHost =
  Constants.expoConfig?.hostUri?.split(':')[0] ||
  Constants.manifest2?.extra?.expoGo?.developer?.hostUri?.split(':')[0] ||
  Constants.manifest?.debuggerHost?.split(':')[0];
const defaultBaseUrl = resolvedHost ? `http://${resolvedHost}:5000/api` : 'http://10.0.2.2:5000/api';

export const API_BASE_URL = envBaseUrl || defaultBaseUrl;
export const FALLBACK_API_BASE_URL = API_BASE_URL === defaultBaseUrl ? null : defaultBaseUrl;

// Log the API URL being used (for debugging in development only)
if (__DEV__) {
  console.log('[Constants] API_BASE_URL:', API_BASE_URL);
  console.log('[Constants] EXPO_PUBLIC_API_URL:', process.env.EXPO_PUBLIC_API_URL);
}

// For Android emulator: http://10.0.2.2:5000/api (configured in .env)
// For physical device: Update .env with your computer's IP: http://192.168.x.x:5000/api

// WHO 5 Moments of Hand Hygiene
export const WHO_MOMENTS = [
  { id: 1, value: 'before_patient', label: 'Before touching a patient', short: 'Bef.-pt.' },
  { id: 2, value: 'before_aseptic', label: 'Before aseptic procedure', short: 'Bef. asept.' },
  { id: 3, value: 'after_body_fluid', label: 'After body fluid exposure risk', short: 'Aft - b.f.' },
  { id: 4, value: 'after_patient', label: 'After touching a patient', short: 'Aft - pat.' },
  { id: 5, value: 'after_surroundings', label: 'After touching patient surroundings', short: 'After - p. surr.' },
];

// Hand Hygiene Adherence Status
export const ADHERENCE_STATUS = {
  ADHERENCE: 'adherence',
  PARTIAL: 'partial',
  MISSED: 'missed',
};

export const ADHERENCE_OPTIONS = [
  { value: 'adherence', label: 'Adherence', points: 1 },
  { value: 'partial', label: 'Partial Adherence', points: 0.5 },
  { value: 'missed', label: 'Missed', points: 0 },
];

// Hand Hygiene Actions
export const HYGIENE_ACTIONS = {
  RUB: 'rub',
  WASH: 'wash',
};

export const ACTION_OPTIONS = [
  { value: 'rub', label: 'RUB (Alcohol hand rub)' },
  { value: 'wash', label: 'WASH (Soap and water)' },
];

// Glove Status
export const GLOVE_STATUS = {
  ON: 'on',
  OFF: 'off',
};

// Risk Factors
export const RISK_FACTORS = [
  { id: 'jewellery', label: 'Jewellery' },
  { id: 'watch', label: 'Watch' },
  { id: 'ring', label: 'Ring' },
  { id: 'long_nails', label: 'Long Nails' },
];

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  AUDITOR: 'auditor',
  STAFF: 'staff',
};

// Departments
export const DEPARTMENTS = [
  'Medicine',
  'Surgery',
  'Pediatrics',
  'Obstetrics & Gynecology',
  'Orthopedics',
  'ENT',
  'Ophthalmology',
  'Psychiatry',
  'Anesthesia',
  'Radiology',
  'Pathology',
  'Emergency',
  'Housekeeping',
  'Administration',
];

// Designations
export const DESIGNATIONS = [
  'Senior Resident',
  'Junior Resident',
  'Staff Nurse',
  'Nursing Supervisor',
  'Consultant',
  'Professor',
  'Associate Professor',
  'Assistant Professor',
  'Technician',
  'Paramedic',
  'Housekeeping Staff',
];

// Wards
export const WARDS = [
  'ICU',
  'NICU',
  'PICU',
  'OT',
  'General Ward',
  'Private Ward',
  'Emergency',
  'Dialysis',
  'OPD',
];

// Badge Levels
export const BADGE_LEVELS = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
};

// Scoring thresholds
export const BADGE_THRESHOLDS = {
  BRONZE: 50,
  SILVER: 100,
  GOLD: 200,
  PLATINUM: 500,
};

// Time periods for leaderboard
export const TIME_PERIODS = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  ALL_TIME: 'all_time',
};

// Pagination
export const ITEMS_PER_PAGE = 10;
export const LEADERBOARD_ITEMS = 20;
