import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import ProfileCard from '../components/profile/ProfileCard';
import ProfileForm from '../components/profile/ProfileForm';
import ActivityHistory from '../components/profile/ActivityHistory';
import AchievementBadges from '../components/profile/AchievementBadges';
import ChangePassword from '../components/profile/ChangePassword';
import { userService } from '../services/userService';
import { rewardService } from '../services/rewardService';
import { PageLoader } from '../components/common/Loader';
import Badge from '../components/common/Badge';

/* --- SVG Icons --- */
const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const OverviewIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [initialLoading, setInitialLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userActivity, setUserActivity] = useState([]);
  const [userBadges, setUserBadges] = useState([]);

  const userId = user?.id || user?._id;

  const fetchUserData = useCallback(async (isRefresh = false) => {
    if (!userId) return;
    
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setInitialLoading(true);
    }

    try {
      const activity = await userService.getUserActivity(userId);
      setUserActivity(activity.activities || []);

      const badgesResponse = await rewardService.getUserBadges(userId);
      setUserBadges((badgesResponse.badges || []).map(b => ({
        id: b.badge?._id || b.badge,
        name: b.badge?.name,
        emoji: b.badge?.emoji,
        earnedAt: b.earnedAt,
      })));
    } catch (error) {
      showError(error.message || 'Failed to load profile data');
    } finally {
      setInitialLoading(false);
      setRefreshing(false);
    }
  }, [showError, userId]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleRefresh = () => {
    if (!refreshing) {
      fetchUserData(true);
    }
  };

  const handleProfileUpdate = async (data) => {
    setLoading(true);
    try {
      const updated = await userService.updateProfile(userId, data);
      updateUser(updated.user);
      showSuccess('Profile updated successfully');
      setActiveTab('overview');
    } catch (error) {
      showError(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (passwordData) => {
    setLoading(true);
    try {
      await userService.changePassword(passwordData);
      showSuccess('Password changed successfully');
      setActiveTab('overview');
    } catch (error) {
      showError(error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (file) => {
    setLoading(true);
    try {
      const result = await userService.uploadAvatar(userId, file);
      updateUser(result.user);
      showSuccess('Avatar uploaded successfully');
    } catch (error) {
      showError(error.message || 'Failed to upload avatar');
    } finally {
      setLoading(false);
    }
  };

  // Tab configuration
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <OverviewIcon /> },
    { id: 'edit', label: 'Edit Profile', icon: <EditIcon /> },
    { id: 'achievements', label: 'Achievements', icon: <TrophyIcon /> },
    { id: 'activity', label: 'Activity', icon: <ClockIcon /> },
    { id: 'password', label: 'Security', icon: <LockIcon /> },
  ];

  if (initialLoading) {
    return <PageLoader text="Loading your profile..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50/50 w-full overflow-x-hidden">
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-5 md:py-6 lg:py-8">
        
        {/* Header Section */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-3 md:gap-4">
            <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4 min-w-0">
              {/* Icon */}
              <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-500/30 flex-shrink-0">
                <UserIcon />
              </div>
              
              {/* Title */}
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-0.5 sm:mb-0.5 md:mb-1">
                  My Profile
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-gray-500 truncate">
                  Manage your account
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-2 md:gap-3 flex-shrink-0">
              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className={`
                  inline-flex items-center gap-2 px-3 sm:px-3 md:px-4 py-2 sm:py-2 md:py-2.5
                  bg-white border border-gray-200 rounded-lg sm:rounded-xl
                  text-xs sm:text-sm font-medium text-gray-700
                  hover:bg-gray-50 hover:border-gray-300
                  focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <RefreshIcon className={refreshing ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>

              {/* Role Badge */}
              <Badge variant="primary" size="medium">
                {user?.role || 'Staff'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="mb-4 sm:mb-6 md:mb-8 w-full">
          <ProfileCard 
            user={user} 
            onEditClick={() => setActiveTab('edit')}
            onAvatarUpload={handleAvatarUpload}
          />
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl border border-gray-100 shadow-lg shadow-black/8 overflow-hidden mb-4 sm:mb-6 md:mb-8 w-full">
          <div className="border-b border-gray-100 overflow-x-auto scrollbar-hide">
            <div className="flex min-w-max sm:min-w-0 w-full">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative flex-1 min-w-[80px] sm:min-w-[90px] md:min-w-[100px] inline-flex items-center justify-center gap-1.5 sm:gap-2 md:gap-2
                    px-3 sm:px-3 md:px-4 lg:px-6 py-3 sm:py-3 md:py-4 text-xs sm:text-xs md:text-sm font-medium
                    transition-all duration-200
                    ${activeTab === tab.id 
                      ? 'text-teal-600 bg-teal-50/50' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  {/* Icon */}
                  <span className={`${activeTab === tab.id ? 'text-teal-600' : 'text-gray-400'} flex-shrink-0`}>
                    {tab.icon}
                  </span>
                  
                  {/* Label - Always show on mobile, just smaller */}
                  <span className="whitespace-nowrap">{tab.label}</span>

                  {/* Active Indicator */}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-3 sm:p-4 md:p-6 w-full overflow-x-hidden">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Overview Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <AchievementBadges badges={userBadges} />
                  <ActivityHistory activities={userActivity} maxItems={5} showViewAll />
                </div>

                {/* Additional Overview Section */}
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl sm:rounded-2xl border border-teal-100 p-3 sm:p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3 md:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0">
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-teal-800 mb-0.5 sm:mb-1 text-xs sm:text-sm md:text-base">Keep Your Profile Updated</h3>
                      <p className="text-[11px] sm:text-xs md:text-sm text-teal-700">
                        Make sure your contact information and department details are accurate for better team coordination.
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('edit')}
                      className="w-full sm:w-auto px-3 sm:px-4 py-1.5 sm:py-2 md:py-2.5 bg-white hover:bg-teal-50 text-teal-700 text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl border border-teal-200 transition-colors flex-shrink-0"
                    >
                      Edit Profile
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'edit' && (
              <ProfileForm 
                user={user} 
                onSubmit={handleProfileUpdate} 
                onCancel={() => setActiveTab('overview')}
                loading={loading}
              />
            )}

            {activeTab === 'achievements' && (
              <div className="space-y-6">
                <AchievementBadges badges={userBadges} />
                
                {/* Motivation Card */}
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl sm:rounded-2xl border border-amber-100 p-3 sm:p-4 md:p-6">
                  <div className="flex items-start gap-2.5 sm:gap-3 md:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <TrophyIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-amber-600" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-amber-800 mb-0.5 sm:mb-1 text-xs sm:text-sm md:text-base">Earn More Badges!</h3>
                      <p className="text-[11px] sm:text-xs md:text-sm text-amber-700">
                        Keep recording hand hygiene observations to unlock achievement badges and climb the leaderboard.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <ActivityHistory activities={userActivity} />
            )}

            {activeTab === 'password' && (
              <ChangePassword onSubmit={handlePasswordChange} loading={loading} />
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;