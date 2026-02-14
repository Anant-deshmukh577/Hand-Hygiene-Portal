import { getInitials } from '../../utils/helpers';
import Badge from '../common/Badge';
import Button from '../common/Button';

/* --- SVG Icons --- */
const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PencilIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const BuildingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const ClipboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const VerifiedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
  </svg>
);

const ProfileCard = ({ user, onEditClick, onAvatarUpload }) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onAvatarUpload(file);
    }
  };

  // Get compliance color
  const getComplianceColor = (rate) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 75) return 'text-amber-600';
    return 'text-red-600';
  };

  const getComplianceBg = (rate) => {
    if (rate >= 90) return 'bg-green-50 border-green-100';
    if (rate >= 75) return 'bg-amber-50 border-amber-100';
    return 'bg-red-50 border-red-100';
  };

  return (
    <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl border border-gray-100 shadow-lg shadow-black/8 overflow-hidden">
      
      {/* Cover/Banner Area */}
      <div className="relative h-24 sm:h-32 md:h-40 bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        {/* Edit Banner Button (optional) */}
        <button className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors duration-200">
          <PencilIcon className="text-white" />
        </button>
      </div>

      {/* Profile Content */}
      <div className="relative px-3 sm:px-4 md:px-5 lg:px-6 pb-4 sm:pb-5 md:pb-6">
        
        {/* Avatar Section - Overlapping the banner */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-4 md:gap-5 lg:gap-6 -mt-12 sm:-mt-14 md:-mt-12 mb-4 sm:mb-5 md:mb-6">
          
          {/* Avatar */}
          <div className="relative flex-shrink-0 mx-auto sm:mx-0">
            <div className="w-24 h-24 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-xl sm:rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 text-white flex items-center justify-center text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold overflow-hidden ring-4 ring-white shadow-xl shadow-black/20">
              {user.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                getInitials(user.name)
              )}
            </div>
            
            {/* Camera Upload Button */}
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="avatar-upload"
              className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-lg sm:rounded-xl bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center cursor-pointer ring-2 sm:ring-3 ring-white shadow-lg transition-all duration-200 hover:scale-105"
            >
              <CameraIcon />
            </label>
          </div>

          {/* Name and Role */}
          <div className="flex-1 pt-1 sm:pt-1 md:pt-2 sm:pb-2 min-w-0 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2 md:gap-2 mb-1">
              <h2 className="text-lg sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 break-words max-w-full" title={user.name}>
                {user.name}
              </h2>
              {user.isVerified && <VerifiedIcon />}
              <span className="inline-flex items-center px-2 sm:px-2 md:px-2.5 py-0.5 bg-teal-100 text-teal-700 text-[10px] sm:text-[10px] md:text-xs font-semibold rounded-full uppercase flex-shrink-0">
                {user.role}
              </span>
            </div>
            {(user.designation || user.department) && (
              <p className="text-gray-500 text-xs sm:text-xs md:text-sm lg:text-base break-words" title={`${user.designation || ''}${user.designation && user.department ? ' • ' : ''}${user.department || ''}`}>
                {user.designation}
                {user.designation && user.department && (
                  <span className="mx-1 sm:mx-2 text-gray-300">•</span>
                )}
                {user.department}
              </p>
            )}
          </div>

          {/* Edit Button - Desktop */}
          <div className="hidden sm:block">
            <button
              onClick={onEditClick}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-lg sm:rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 text-xs sm:text-sm"
            >
              <PencilIcon />
              <span className="hidden md:inline">Edit Profile</span>
              <span className="md:hidden">Edit</span>
            </button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-5 md:mb-6">
          <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-xs md:text-sm min-w-0">
            <div className="w-7 h-7 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
              <MailIcon className="text-gray-500" />
            </div>
            <span className="truncate break-all" title={user.email}>{user.email}</span>
          </div>
          
          {user.phone && (
            <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-xs md:text-sm">
              <div className="w-7 h-7 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <PhoneIcon className="text-gray-500" />
              </div>
              <span>{user.phone}</span>
            </div>
          )}
          
          {user.ward && (
            <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-xs md:text-sm min-w-0">
              <div className="w-7 h-7 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <BuildingIcon className="text-gray-500" />
              </div>
              <span className="truncate">{user.ward}</span>
            </div>
          )}
        </div>

        {/* Edit Button - Mobile */}
        <div className="sm:hidden mb-4">
          <button
            onClick={onEditClick}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg shadow-lg shadow-teal-600/25 transition-all duration-200 text-sm"
          >
            <PencilIcon />
            Edit Profile
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5 md:gap-3 pt-4 sm:pt-4 md:pt-6 border-t border-gray-100">
          
          {/* Total Points */}
          <div className="group p-3 sm:p-3 md:p-3 lg:p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg sm:rounded-xl border border-amber-100 hover:shadow-md hover:shadow-amber-100 transition-all duration-200">
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2 mb-1.5 sm:mb-2 md:mb-2">
              <div className="w-7 h-7 sm:w-7 sm:h-7 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-lg bg-amber-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <StarIcon className="text-amber-600 h-4 w-4 sm:h-4 sm:w-4 md:h-4 md:w-4 lg:h-5 lg:w-5" />
              </div>
            </div>
            <p className="text-lg sm:text-xl md:text-xl lg:text-2xl xl:text-3xl font-bold text-amber-600 mb-1 leading-tight">
              {(user.totalPoints || 0).toLocaleString()}
            </p>
            <p className="text-[10px] sm:text-xs md:text-xs text-gray-500">Total Points</p>
          </div>

          {/* Rank */}
          <div className="group p-3 sm:p-3 md:p-3 lg:p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg sm:rounded-xl border border-purple-100 hover:shadow-md hover:shadow-purple-100 transition-all duration-200">
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2 mb-1.5 sm:mb-2 md:mb-2">
              <div className="w-7 h-7 sm:w-7 sm:h-7 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-lg bg-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <TrophyIcon className="text-purple-600 h-4 w-4 sm:h-4 sm:w-4 md:h-4 md:w-4 lg:h-5 lg:w-5" />
              </div>
            </div>
            <p className="text-lg sm:text-xl md:text-xl lg:text-2xl xl:text-3xl font-bold text-purple-600 mb-1 leading-tight">
              #{user.rank || 'N/A'}
            </p>
            <p className="text-[10px] sm:text-xs md:text-xs text-gray-500">Current Rank</p>
          </div>

          {/* Compliance Rate */}
          <div className={`group p-3 sm:p-3 md:p-3 lg:p-4 rounded-lg sm:rounded-xl border hover:shadow-md transition-all duration-200 ${getComplianceBg(user.complianceRate || 0)}`}>
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2 mb-1.5 sm:mb-2 md:mb-2">
              <div className={`w-7 h-7 sm:w-7 sm:h-7 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200 ${
                (user.complianceRate || 0) >= 90 ? 'bg-green-100' :
                (user.complianceRate || 0) >= 75 ? 'bg-amber-100' : 'bg-red-100'
              }`}>
                <ChartIcon className={`${getComplianceColor(user.complianceRate || 0)} h-4 w-4 sm:h-4 sm:w-4 md:h-4 md:w-4 lg:h-5 lg:w-5`} />
              </div>
            </div>
            <p className={`text-lg sm:text-xl md:text-xl lg:text-2xl xl:text-3xl font-bold mb-1 leading-tight ${getComplianceColor(user.complianceRate || 0)}`}>
              {user.complianceRate || 0}%
            </p>
            <p className="text-[10px] sm:text-xs md:text-xs text-gray-500">Compliance</p>
          </div>

          {/* Observations */}
          <div className="group p-3 sm:p-3 md:p-3 lg:p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg sm:rounded-xl border border-teal-100 hover:shadow-md hover:shadow-teal-100 transition-all duration-200">
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2 mb-1.5 sm:mb-2 md:mb-2">
              <div className="w-7 h-7 sm:w-7 sm:h-7 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-lg bg-teal-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <ClipboardIcon className="text-teal-600 h-4 w-4 sm:h-4 sm:w-4 md:h-4 md:w-4 lg:h-5 lg:w-5" />
              </div>
            </div>
            <p className="text-lg sm:text-xl md:text-xl lg:text-2xl xl:text-3xl font-bold text-teal-600 mb-1 leading-tight">
              {(user.totalObservations || 0).toLocaleString()}
            </p>
            <p className="text-[10px] sm:text-xs md:text-xs text-gray-500">Observations</p>
          </div>
        </div>

        {/* Achievement Preview (Optional) */}
        {user.badges && user.badges.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-700">Recent Achievements</h4>
              <button className="text-xs text-teal-600 hover:text-teal-700 font-medium">
                View All →
              </button>
            </div>
            <div className="flex gap-2">
              {user.badges.slice(0, 4).map((badge, index) => (
                <div
                  key={index}
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center text-2xl shadow-sm"
                  title={badge.name}
                >
                  {badge.emoji || '🏆'}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Member Since / Join Date */}
        {user.createdAt && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">
              Member since {new Date(user.createdAt).toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;