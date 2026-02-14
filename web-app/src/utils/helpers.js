const SETTINGS_STORAGE_KEY = 'aiims_user_settings';
const DEFAULT_PREFERENCES = {
  language: 'en',
  dateFormat: 'dd/mm/yyyy',
  timeZone: 'Asia/Kolkata',
};

const getStoredPreferences = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_PREFERENCES;
  }
  try {
    const savedSettings = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!savedSettings) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(savedSettings);
    return {
      ...DEFAULT_PREFERENCES,
      ...(parsed?.preferences || {}),
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
};

const getLocale = (language) => (language === 'hi' ? 'hi-IN' : 'en-IN');

const getDateParts = (date, locale, timeZone) => {
  const formatter = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone,
  });
  const parts = formatter.formatToParts(date);
  const map = {};
  parts.forEach(part => {
    if (part.type !== 'literal') {
      map[part.type] = part.value;
    }
  });
  return map;
};

const buildDateString = (date, dateFormat, locale, timeZone) => {
  const { day, month, year } = getDateParts(date, locale, timeZone);
  switch (dateFormat) {
    case 'mm/dd/yyyy':
      return `${month}/${day}/${year}`;
    case 'yyyy-mm-dd':
      return `${year}-${month}-${day}`;
    default:
      return `${day}/${month}/${year}`;
  }
};

// Format date to readable string
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  const preferences = getStoredPreferences();
  const locale = getLocale(preferences.language);
  return buildDateString(d, preferences.dateFormat, locale, preferences.timeZone);
};

// Format date and time
export const formatDateTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return `${formatDate(d)} ${formatTime(d)}`;
};

// Format time only
export const formatTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  const preferences = getStoredPreferences();
  const locale = getLocale(preferences.language);
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: preferences.timeZone,
  }).format(d);
};

// Truncate text
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Calculate compliance percentage
export const calculateComplianceRate = (total, adherence) => {
  if (total === 0) return 0;
  return ((adherence / total) * 100).toFixed(1);
};

// Get random color for avatar
export const getRandomColor = () => {
  const colors = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Sleep function for delays
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};
