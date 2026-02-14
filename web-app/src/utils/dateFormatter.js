import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';

// Format date to specific format
export const formatDate = (date, formatStr = 'PPP') => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, formatStr);
};

// Get relative time (e.g., "2 hours ago")
export const getRelativeTime = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
};

// Get day label (Today, Yesterday, or date)
export const getDayLabel = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'PPP');
};

// Format time only
export const formatTimeOnly = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'p');
};

// Format for input fields
export const formatForInput = (date) => {
  if (!date) return '';
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, "yyyy-MM-dd'T'HH:mm");
};