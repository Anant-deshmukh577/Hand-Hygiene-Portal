import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotification } from '../context/NotificationContext';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Checkbox from '../components/common/Checkbox';
import Select from '../components/common/Select';

const SETTINGS_STORAGE_KEY = 'aiims_user_settings';

const DEFAULT_NOTIFICATION_SETTINGS = {
  emailNotifications: true,
  badgeAlerts: true,
  leaderboardUpdates: false,
  weeklyReports: true,
};

const DEFAULT_PREFERENCES = {
  language: 'en',
  dateFormat: 'dd/mm/yyyy',
  timeZone: 'Asia/Kolkata',
};

const getLocale = (language) => (language === 'hi' ? 'hi-IN' : 'en-IN');

/* --- SVG Icons --- */
const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const PaletteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
  </svg>
);

const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const Settings = () => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const [notificationSettings, setNotificationSettings] = useState(DEFAULT_NOTIFICATION_SETTINGS);
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        if (parsed.notificationSettings) {
          setNotificationSettings(parsed.notificationSettings);
        }
        if (parsed.preferences) {
          setPreferences(parsed.preferences);
        }
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }, []);

  useEffect(() => {
    const lang = preferences.language === 'hi' ? 'hi' : 'en';
    document.documentElement.setAttribute('lang', lang);
  }, [preferences.language]);

  const handleNotificationChange = (name) => {
    setNotificationSettings(prev => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const handlePreferenceChange = (name, value) => {
    setPreferences(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const settingsToSave = {
        notificationSettings,
        preferences,
      };
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settingsToSave));
      const lang = preferences.language === 'hi' ? 'hi' : 'en';
      document.documentElement.setAttribute('lang', lang);
      showSuccess('Settings saved successfully!');
    } catch (error) {
      showError(error.message || 'Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleResetToDefaults = () => {
    const confirmReset = window.confirm('Are you sure you want to reset all settings to defaults?');
    if (confirmReset) {
      setNotificationSettings(DEFAULT_NOTIFICATION_SETTINGS);
      setPreferences(DEFAULT_PREFERENCES);
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
      showSuccess('Settings reset to defaults');
    }
  };

  const handleClearCache = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const settings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      localStorage.clear();
      if (token) {
        localStorage.setItem('token', token);
      }
      if (settings) {
        localStorage.setItem(SETTINGS_STORAGE_KEY, settings);
      }
      showSuccess('Cache cleared successfully!');
    } catch (error) {
      showError(error.message || 'Failed to clear cache');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadData = async () => {
    setDownloadLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/reports/export/csv`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to download data');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `my_data_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showSuccess('Data downloaded successfully!');
    } catch (error) {
      showError(error.message || 'Failed to download data');
    } finally {
      setDownloadLoading(false);
    }
  };

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'Hindi' },
  ];

  const dateFormatOptions = [
    { value: 'dd/mm/yyyy', label: 'DD/MM/YYYY' },
    { value: 'mm/dd/yyyy', label: 'MM/DD/YYYY' },
    { value: 'yyyy-mm-dd', label: 'YYYY-MM-DD' },
  ];

  const timeZoneOptions = [
    { value: 'Asia/Kolkata', label: 'IST (Asia/Kolkata)' },
    { value: 'America/New_York', label: 'EST (America/New_York)' },
    { value: 'Europe/London', label: 'GMT (Europe/London)' },
  ];

  const getMemberSinceDate = () => {
    if (user?.createdAt) {
      return new Date(user.createdAt).toLocaleDateString(getLocale(preferences.language), { 
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: preferences.timeZone,
      });
    }
    return 'Not available';
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <SettingsIcon />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Settings
              </h1>
              <p className="text-gray-500 mt-1">
                Manage your account preferences and settings
              </p>
            </div>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Left Column - Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Account Settings */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center">
                    <UserIcon />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
                    <p className="text-sm text-gray-500">Your account information</p>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 space-y-6">
                <div className="flex items-start justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Account Type</p>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-3 py-1 bg-teal-50 text-teal-700 text-sm font-semibold rounded-full uppercase">
                        {user?.role || 'STAFF'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Email Address</p>
                    <p className="text-base text-gray-900 font-medium">{user?.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start justify-between py-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">Member Since</p>
                    <p className="text-base text-gray-900 font-medium">{getMemberSinceDate()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Appearance */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                    <PaletteIcon />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Appearance</h2>
                    <p className="text-sm text-gray-500">Customize your visual experience</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${theme === 'light' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'} flex items-center justify-center`}>
                      {theme === 'light' ? <SunIcon /> : <MoonIcon />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Theme Mode</p>
                      <p className="text-sm text-gray-500">
                        Current: <span className="font-medium capitalize">{theme}</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                  >
                    Toggle Theme
                  </button>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <BellIcon />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                    <p className="text-sm text-gray-500">Manage your notification preferences</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <Checkbox
                  label="Email Notifications"
                  name="emailNotifications"
                  checked={notificationSettings.emailNotifications}
                  onChange={() => handleNotificationChange('emailNotifications')}
                />
                <Checkbox
                  label="Badge Achievement Alerts"
                  name="badgeAlerts"
                  checked={notificationSettings.badgeAlerts}
                  onChange={() => handleNotificationChange('badgeAlerts')}
                />
                <Checkbox
                  label="Leaderboard Updates"
                  name="leaderboardUpdates"
                  checked={notificationSettings.leaderboardUpdates}
                  onChange={() => handleNotificationChange('leaderboardUpdates')}
                />
                <Checkbox
                  label="Weekly Compliance Reports"
                  name="weeklyReports"
                  checked={notificationSettings.weeklyReports}
                  onChange={() => handleNotificationChange('weeklyReports')}
                />
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                    <GlobeIcon />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Preferences</h2>
                    <p className="text-sm text-gray-500">Language and regional settings</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <Select
                  label="Language"
                  name="language"
                  value={preferences.language}
                  onChange={(e) => handlePreferenceChange('language', e.target.value)}
                  options={languageOptions}
                />
                <Select
                  label="Date Format"
                  name="dateFormat"
                  value={preferences.dateFormat}
                  onChange={(e) => handlePreferenceChange('dateFormat', e.target.value)}
                  options={dateFormatOptions}
                />
                <Select
                  label="Time Zone"
                  name="timeZone"
                  value={preferences.timeZone}
                  onChange={(e) => handlePreferenceChange('timeZone', e.target.value)}
                  options={timeZoneOptions}
                />
              </div>
            </div>

            {/* Data & Privacy */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                    <ShieldIcon />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Data & Privacy</h2>
                    <p className="text-sm text-gray-500">Manage your data and privacy</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Clear Cache */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                      <TrashIcon />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">Clear Cache</h3>
                      <p className="text-sm text-gray-600">
                        Clear all cached data from your browser to free up space
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleClearCache}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <TrashIcon />
                    Clear Cache
                  </button>
                </div>

                {/* Download Data */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                      <DownloadIcon />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">Download My Data</h3>
                      <p className="text-sm text-gray-600">
                        Download all your observation data and statistics as CSV
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleDownloadData}
                    disabled={downloadLoading}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <DownloadIcon />
                    {downloadLoading ? 'Downloading...' : 'Download Data'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Quick Actions & Info */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Save Settings Card */}
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg shadow-teal-500/30">
              <div className="mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
                  <SettingsIcon />
                </div>
                <h3 className="text-lg font-semibold mb-2">Save Your Changes</h3>
                <p className="text-teal-50 text-sm">
                  Don't forget to save your settings before leaving this page
                </p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handleSaveSettings}
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-teal-600 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving...' : 'Save Settings'}
                </button>
                
                <button
                  onClick={handleResetToDefaults}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-200"
                >
                  <RefreshIcon />
                  Reset to Defaults
                </button>
              </div>
            </div>

            {/* Help Card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                If you're having trouble with settings, check our help center or contact support.
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium text-sm transition-colors"
              >
                Visit Help Center
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>

            {/* Privacy Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-900 mb-1">Privacy Notice</h4>
                  <p className="text-sm text-amber-800">
                    Your settings are stored locally and are not shared with third parties.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;