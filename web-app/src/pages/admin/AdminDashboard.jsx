import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import { reportService } from '../../services/reportService';
import { userService } from '../../services/userService';
import { wardService } from '../../services/wardService';
import StatsCard from '../../components/dashboard/StatsCard';
import WeeklyChart from '../../components/dashboard/WeeklyChart';
import Loader, { PageLoader } from '../../components/common/Loader';
import Badge from '../../components/common/Badge';

/* --- SVG Icons --- */
const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const ClipboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const BuildingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const GiftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

const DocumentReportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const CogIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const AdminDashboard = () => {
  const { showError } = useNotification();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalObservations: 0,
    averageCompliance: 0,
    activeWards: 0,
  });
  const [weeklyData, setWeeklyData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  const fetchAdminDashboardData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      // Fetch dashboard stats
      const statsResponse = await reportService.getDashboardStats();
      const dashboardStats = statsResponse.stats || {};

      // Fetch users count
      let totalUsers = 0;
      try {
        const usersResponse = await userService.getAllUsers({ limit: 1 });
        totalUsers = usersResponse.total || 0;
      } catch {
        totalUsers = 0;
      }

      // Fetch wards count
      let activeWards = 0;
      try {
        const wardsResponse = await wardService.getWards();
        activeWards = (wardsResponse.wards || []).length;
      } catch {
        activeWards = 0;
      }

      setStats({
        totalUsers,
        totalObservations: dashboardStats.totalObservations || 0,
        averageCompliance: Math.round(dashboardStats.complianceRate || 0),
        activeWards,
      });

      // Fetch weekly trends
      const trendsResponse = await reportService.getTrendReport({ days: 7 });
      const trends = trendsResponse.trends || [];
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const weeklyFormatted = trends.map(t => ({
        day: dayNames[new Date(t.date).getDay()],
        observations: t.observations || 0,
        compliance: Math.round(t.compliance || 0),
      }));

      setWeeklyData(weeklyFormatted.length > 0 ? weeklyFormatted : [
        { day: 'Mon', observations: 0, compliance: 0 },
        { day: 'Tue', observations: 0, compliance: 0 },
        { day: 'Wed', observations: 0, compliance: 0 },
        { day: 'Thu', observations: 0, compliance: 0 },
        { day: 'Fri', observations: 0, compliance: 0 },
        { day: 'Sat', observations: 0, compliance: 0 },
        { day: 'Sun', observations: 0, compliance: 0 },
      ]);

      // Fetch recent activities from all users (admin view)
      try {
        // Get all users
        const usersResponse = await userService.getUsers({ limit: 100 });
        const allUsers = usersResponse.users || [];
        
        // Collect activities from all users
        const allActivities = [];
        for (const user of allUsers.slice(0, 10)) { // Limit to first 10 users for performance
          try {
            const activityResponse = await userService.getUserActivity(user._id || user.id);
            const userActivities = (activityResponse.activities || []).map(activity => ({
              ...activity,
              userName: user.name,
            }));
            allActivities.push(...userActivities);
          } catch (error) {
            // Skip if user activity fetch fails
            continue;
          }
        }
        
        // Sort by date and take most recent
        allActivities.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentActivities(allActivities.slice(0, 10));
      } catch (error) {
        console.error('Failed to fetch recent activities', error);
        setRecentActivities([]);
      }

      setLastUpdated(new Date());
    } catch (error) {
      showError(error?.message || 'Failed to load admin dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdminDashboardData();
  }, [showError]);

  const handleRefresh = () => {
    if (!refreshing) {
      fetchAdminDashboardData(true);
    }
  };

  // Quick Actions configuration
  const quickActions = [
    { 
      title: 'Manage Users', 
      description: 'Add, edit, or remove users',
      icon: <UsersIcon />,
      link: '/admin/users', 
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      hoverBg: 'hover:bg-blue-50',
    },
    { 
      title: 'Manage Wards', 
      description: 'Configure hospital wards',
      icon: <BuildingIcon />,
      link: '/admin/wards', 
      gradient: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600',
      hoverBg: 'hover:bg-teal-50',
    },
    { 
      title: 'Manage Rewards', 
      description: 'Set up rewards and incentives',
      icon: <GiftIcon />,
      link: '/admin/rewards', 
      gradient: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      hoverBg: 'hover:bg-amber-50',
    },
    { 
      title: 'View Reports', 
      description: 'Analytics and insights',
      icon: <DocumentReportIcon />,
      link: '/reports', 
      gradient: 'from-rose-500 to-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-600',
      hoverBg: 'hover:bg-rose-50',
    },
  ];

  // Loading State
  if (loading) {
    return <PageLoader text="Loading admin dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Admin Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/30">
                <CogIcon className="h-7 w-7" />
              </div>
              
              {/* Title */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Admin Dashboard
                  </h1>
                  <ShieldIcon className="h-6 w-6" />
                </div>
                <p className="text-gray-500">
                  System overview and management
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Last Updated */}
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                <CalendarIcon />
                <span>Updated {lastUpdated.toLocaleTimeString()}</span>
              </div>

              {/* Refresh Button */}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className={`
                  inline-flex items-center gap-2 px-4 py-2.5
                  bg-white border border-gray-200 rounded-xl
                  text-sm font-medium text-gray-700
                  hover:bg-gray-50 hover:border-gray-300
                  focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <RefreshIcon className={refreshing ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>

              {/* Admin Badge */}
              <Badge variant="primary" size="medium">
                Admin
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <StatsCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon={<UsersIcon />}
            trend="up"
            trendValue="+12 this month"
            color="blue"
          />
          <StatsCard
            title="Total Observations"
            value={stats.totalObservations.toLocaleString()}
            icon={<ClipboardIcon />}
            trend="up"
            trendValue="+324 this week"
            color="teal"
          />
          <StatsCard
            title="Average Compliance"
            value={`${stats.averageCompliance}%`}
            icon={<CheckCircleIcon />}
            trend={stats.averageCompliance >= 90 ? 'up' : stats.averageCompliance >= 75 ? 'neutral' : 'down'}
            trendValue={stats.averageCompliance >= 90 ? 'Excellent!' : '+3% from last week'}
            color={stats.averageCompliance >= 90 ? 'green' : stats.averageCompliance >= 75 ? 'amber' : 'red'}
            progress={{ value: stats.averageCompliance, max: 100 }}
          />
          <StatsCard
            title="Active Wards"
            value={stats.activeWards}
            icon={<BuildingIcon />}
            trend="neutral"
            trendValue="All operational"
            color="purple"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Weekly Chart - Takes 2 columns */}
          <div className="xl:col-span-2">
            <WeeklyChart 
              data={weeklyData}
              title="Weekly Performance Overview"
              subtitle="Observations and compliance trends for the past 7 days"
              showChartTypeToggle
            />
          </div>

          {/* System Status Card */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/8 overflow-hidden h-full">
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <CogIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
                    <p className="text-sm text-gray-500">Real-time health check</p>
                  </div>
                </div>
              </div>

              {/* Status Items */}
              <div className="p-6 space-y-4">
                {[
                  { label: 'API Server', status: 'online', icon: '🟢' },
                  { label: 'Database', status: 'online', icon: '🟢' },
                  { label: 'Authentication', status: 'online', icon: '🟢' },
                  { label: 'File Storage', status: 'online', icon: '🟢' },
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-medium text-gray-700">{item.label}</span>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      item.status === 'online' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {item.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-6 pb-6">
                <div className="p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl border border-green-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm text-green-700">
                      All systems operational
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
              <p className="text-sm text-gray-500">Manage your system settings</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className={`
                  group relative bg-white rounded-2xl border ${action.borderColor}
                  p-6 overflow-hidden
                  shadow-lg shadow-black/8 
                  hover:shadow-xl hover:shadow-black/15 
                  hover:-translate-y-1
                  transition-all duration-300
                `}
              >
                {/* Gradient top line */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${action.gradient}`} />

                {/* Icon */}
                <div className={`
                  w-14 h-14 rounded-2xl ${action.iconBg} ${action.iconColor}
                  flex items-center justify-center mb-4
                  group-hover:scale-110 transition-transform duration-300
                `}>
                  {action.icon}
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-gray-700">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {action.description}
                </p>

                {/* Arrow */}
                <div className={`
                  inline-flex items-center gap-1 text-sm font-medium ${action.iconColor}
                  group-hover:gap-2 transition-all duration-200
                `}>
                  <span>Open</span>
                  <ArrowRightIcon />
                </div>

                {/* Hover gradient overlay */}
                <div className={`
                  absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0
                  group-hover:opacity-5 transition-opacity duration-300
                `} />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity & Alerts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Recent Admin Activity */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/8 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <ClipboardIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                    <p className="text-sm text-gray-500">Latest system actions</p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/profile')}
                  className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                >
                  View All →
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {recentActivities.length > 0 ? (
                recentActivities.slice(0, 4).map((activity, index) => (
                  <div key={index} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      activity.type === 'earned' || activity.source === 'observation' ? 'bg-green-100 text-green-600' :
                      activity.type === 'spent' || activity.source === 'reward' ? 'bg-amber-100 text-amber-600' :
                      activity.source === 'badge' ? 'bg-purple-100 text-purple-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {(activity.type === 'earned' || activity.source === 'observation') && <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                      {(activity.type === 'spent' || activity.source === 'reward') && <GiftIcon className="h-4 w-4" />}
                      {activity.source === 'badge' && <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>}
                      {!activity.source && <ClipboardIcon className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{activity.description}</p>
                      <p className="text-xs text-gray-500">
                        {activity.points > 0 ? `+${activity.points}` : activity.points} points
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      {new Date(activity.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-100 flex items-center justify-center">
                    <ClipboardIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">No recent activity</p>
                  <p className="text-xs text-gray-400 mt-1">Activity will appear here as users interact with the system</p>
                </div>
              )}
            </div>
          </div>

          {/* System Alerts */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/8 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                    <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
                    <p className="text-sm text-gray-500">Important notifications</p>
                  </div>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  All Clear
                </span>
              </div>
            </div>

            <div className="p-6">
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-green-50 flex items-center justify-center">
                  <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No Active Alerts</h4>
                <p className="text-sm text-gray-500">
                  All systems are running smoothly. No issues detected.
                </p>
              </div>
            </div>

            <div className="px-6 pb-6">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-800">Pro Tip</p>
                    <p className="text-xs text-blue-700 mt-0.5">
                      Set up email notifications to receive alerts instantly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;