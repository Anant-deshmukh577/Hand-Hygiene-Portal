import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useUIStore } from '../../stores/uiStore';
import { getInitials } from '../../utils/helpers';

/* --- SVG Icons --- */
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const ClipboardListIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const GiftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const BuildingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const TargetIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Sidebar = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const canRecordObservations = user?.role === 'auditor' || user?.role === 'admin';

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    ...(canRecordObservations ? [{ path: '/observation-entry', label: 'New Observation', icon: <PlusIcon /> }] : []),
    { path: '/observation-history', label: 'Observation History', icon: <ClipboardListIcon /> },
    { path: '/leaderboard', label: 'Leaderboard', icon: <TrophyIcon /> },
    { path: '/rewards', label: 'Rewards', icon: <GiftIcon /> },
    { path: '/profile', label: 'Profile', icon: <UserIcon /> },
    { path: '/reports', label: 'Reports', icon: <ChartIcon /> },
    { path: '/settings', label: 'Settings', icon: <SettingsIcon /> },
  ];

  const adminMenuItems = [
    { path: '/admin/dashboard', label: 'Admin Dashboard', icon: <ShieldIcon /> },
    { path: '/admin/users', label: 'Manage Users', icon: <UsersIcon /> },
    { path: '/admin/wards', label: 'Manage Wards', icon: <BuildingIcon /> },
    { path: '/admin/rewards', label: 'Manage Rewards', icon: <TargetIcon /> },
  ];

  const auditorMenuItems = [
    { path: '/auditor/dashboard', label: 'Auditor Dashboard', icon: <EyeIcon /> },
  ];

  const getLinkClasses = (path) => `
    flex items-center gap-3 px-4 py-3 mx-3 rounded-xl text-sm font-medium transition-all duration-200
    ${isActive(path) 
      ? isDark 
        ? 'bg-teal-900/50 text-teal-400 border-l-4 border-teal-500 ml-0 pl-5'
        : 'bg-teal-50 text-teal-700 border-l-4 border-teal-600 ml-0 pl-5' 
      : isDark
        ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }
  `;

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] w-72 
        ${isDark ? 'bg-gray-900 border-r border-gray-800' : 'bg-white border-r border-gray-200'}
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        overflow-y-auto
        shadow-lg
      `}>
        
        {/* Close Button (Mobile) */}
        <button
          onClick={toggleSidebar}
          className={`absolute top-4 right-4 p-2 rounded-lg lg:hidden transition-colors ${
            isDark ? 'text-gray-400 hover:bg-gray-800 hover:text-gray-200' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
          }`}
        >
          <CloseIcon />
        </button>

        {/* User Info Card */}
        <div className={`p-6 border-b ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 text-white flex items-center justify-center text-lg font-bold shadow-lg shadow-teal-500/30 overflow-hidden">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                getInitials(user?.name || 'User')
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold truncate ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                {user?.name || 'User'}
              </h3>
              <p className={`text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {user?.designation || 'Staff'}
              </p>
              {user?.role && (
                <span className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 text-[10px] font-semibold rounded-full uppercase ${
                  isDark ? 'bg-teal-900/50 text-teal-400' : 'bg-teal-50 text-teal-700'
                }`}>
                  {user.role}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="py-4">
          {/* Main Menu Label */}
          <div className="px-6 py-2">
            <span className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Main Menu
            </span>
          </div>

          {/* Menu Items */}
          <div className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                className={getLinkClasses(item.path)}
              >
                <span className={`${isActive(item.path) ? 'text-teal-600' : 'text-gray-400'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
                {item.path === '/observation-entry' && (
                  <span className="ml-auto px-2 py-0.5 bg-teal-100 text-teal-700 text-[10px] font-semibold rounded-full">
                    NEW
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Admin Section */}
          {user?.role === 'admin' && (
            <>
              <div className="px-6 py-2 mt-6">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Admin
                </span>
              </div>
              <div className="space-y-1">
                {adminMenuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                    className={getLinkClasses(item.path)}
                  >
                    <span className={`${isActive(item.path) ? 'text-teal-600' : 'text-gray-400'}`}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* Auditor Section */}
          {user?.role === 'auditor' && (
            <>
              <div className="px-6 py-2 mt-6">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Auditor
                </span>
              </div>
              <div className="space-y-1">
                {auditorMenuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                    className={getLinkClasses(item.path)}
                  >
                    <span className={`${isActive(item.path) ? 'text-teal-600' : 'text-gray-400'}`}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </nav>

        {/* Bottom Section */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 border-t ${
          isDark ? 'border-gray-800 bg-gray-800/50' : 'border-gray-100 bg-gray-50/50'
        }`}>
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>System Online</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;