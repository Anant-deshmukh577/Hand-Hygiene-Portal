import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { reportService } from '../../services/reportService';
import StatsCard from '../../components/dashboard/StatsCard';
import WeeklyChart from '../../components/dashboard/WeeklyChart';
import Loader, { PageLoader } from '../../components/common/Loader';
import Badge from '../../components/common/Badge';

/* --- SVG Icons --- */
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const ClipboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DocumentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
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

const WaveIcon = () => (
  <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
  </svg>
);

const AuditorDashboard = () => {
  const { user } = useAuth();
  const { showError } = useNotification();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const [stats, setStats] = useState({
    observationsRecorded: 0,
    avgCompliance: 0,
    sessionsAudited: 0,
    pendingReviews: 0,
  });

  const [weeklyData, setWeeklyData] = useState([]);

  const fetchAuditorDashboardData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      // Fetch dashboard stats from API
      const statsResponse = await reportService.getDashboardStats();
      const dashboardStats = statsResponse.stats || {};
      
      setStats({
        observationsRecorded: dashboardStats.totalObservations || 0,
        avgCompliance: Math.round(dashboardStats.complianceRate || 0),
        sessionsAudited: dashboardStats.totalSessions || 0,
        pendingReviews: 0,
      });

      // Fetch weekly trends from API
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

      setLastUpdated(new Date());
    } catch (error) {
      showError(error?.message || 'Failed to load auditor dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchAuditorDashboardData();
  }, [fetchAuditorDashboardData]);

  const handleRefresh = () => {
    if (!refreshing) {
      fetchAuditorDashboardData(true);
    }
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = user?.name?.split(' ')[0] || 'Auditor';

  // Quick Actions configuration
  const quickActions = [
    { 
      title: 'New Observation', 
      description: 'Record a new hand hygiene observation',
      icon: <PlusIcon />,
      link: '/observation-entry', 
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      badge: 'Primary',
    },
    { 
      title: 'Observation History', 
      description: 'View all recorded observations',
      icon: <ClipboardIcon />,
      link: '/observation-history', 
      gradient: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600',
    },
    { 
      title: 'Reports', 
      description: 'Generate and download reports',
      icon: <ChartIcon />,
      link: '/reports', 
      gradient: 'from-rose-500 to-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-600',
    },
    { 
      title: 'Leaderboard', 
      description: 'View rankings and achievements',
      icon: <TrophyIcon />,
      link: '/leaderboard', 
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
  ];

  if (loading) {
    return <PageLoader text="Loading auditor dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-blue-500/30 overflow-hidden">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  firstName.charAt(0).toUpperCase()
                )}
              </div>
              
              {/* Greeting */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {getGreeting()}, {firstName}!
                  </h1>
                  <WaveIcon />
                </div>
                <p className="text-gray-500">
                  Welcome to your auditor dashboard
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
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <RefreshIcon className={refreshing ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>

              {/* Role Badge */}
              <Badge variant="primary" size="medium">
                Auditor
              </Badge>
            </div>
          </div>
        </div>

        {/* Auditor Info Banner */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <EyeIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-800 mb-1">Auditor Mode Active</h3>
                <p className="text-sm text-blue-700">
                  You can record observations, view reports, and monitor hand hygiene compliance across wards.
                  {stats.pendingReviews > 0 && (
                    <span className="ml-2 text-amber-600 font-medium">
                      • {stats.pendingReviews} pending reviews need attention
                    </span>
                  )}
                </p>
              </div>
              <Link
                to="/observation-entry"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg shadow-blue-600/25 transition-all duration-200"
              >
                <PlusIcon className="h-5 w-5" />
                New Observation
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <StatsCard
            title="Observations Recorded"
            value={stats.observationsRecorded.toLocaleString()}
            icon={<ClipboardIcon />}
            trend="up"
            trendValue="+14 this week"
            color="blue"
          />
          <StatsCard
            title="Average Compliance"
            value={`${stats.avgCompliance}%`}
            icon={<CheckCircleIcon />}
            trend={stats.avgCompliance >= 90 ? 'up' : stats.avgCompliance >= 75 ? 'neutral' : 'down'}
            trendValue={stats.avgCompliance >= 90 ? 'Excellent!' : '+2% from last week'}
            color={stats.avgCompliance >= 90 ? 'green' : stats.avgCompliance >= 75 ? 'amber' : 'red'}
            progress={{ value: stats.avgCompliance, max: 100 }}
          />
          <StatsCard
            title="Sessions Audited"
            value={stats.sessionsAudited.toLocaleString()}
            icon={<DocumentIcon />}
            trend="neutral"
            trendValue="Stable"
            color="teal"
          />
          <StatsCard
            title="Pending Reviews"
            value={stats.pendingReviews}
            icon={<ClockIcon />}
            trend={stats.pendingReviews > 0 ? 'down' : 'up'}
            trendValue={stats.pendingReviews > 0 ? 'Needs attention' : 'All clear!'}
            color={stats.pendingReviews > 0 ? 'amber' : 'green'}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Weekly Chart - Takes 2 columns */}
          <div className="xl:col-span-2">
            <WeeklyChart 
              data={weeklyData}
              title="Weekly Audit Performance"
              subtitle="Your observation and compliance trends for the past 7 days"
              showChartTypeToggle
            />
          </div>

          {/* Today's Summary */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/8 overflow-hidden h-full">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <CalendarIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Today's Summary</h3>
                    <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Today's Observations */}
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <ClipboardIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-700">Observations</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-600">
                    {weeklyData.length > 0 ? weeklyData[weeklyData.length - 1]?.observations || 0 : 0}
                  </span>
                </div>

                {/* Today's Compliance */}
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="font-medium text-gray-700">Compliance</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">
                    {weeklyData.length > 0 ? weeklyData[weeklyData.length - 1]?.compliance || 0 : 0}%
                  </span>
                </div>

                {/* Sessions */}
                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <DocumentIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <span className="font-medium text-gray-700">Sessions</span>
                  </div>
                  <span className="text-2xl font-bold text-purple-600">
                    {Math.floor(Math.random() * 5) + 1}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 pb-6">
                <Link
                  to="/observation-history"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                >
                  View Full History
                  <ArrowRightIcon />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
              <p className="text-sm text-gray-500">Frequently used features</p>
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

                {/* Badge for primary action */}
                {action.badge && (
                  <span className="absolute top-4 right-4 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                    {action.badge}
                  </span>
                )}

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

        {/* Performance Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Performance Summary</h3>
            <Badge variant="primary">This Week</Badge>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-3xl font-bold text-blue-600 mb-1">
                {stats.observationsRecorded}
              </p>
              <p className="text-sm text-gray-500">Observations</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className={`text-3xl font-bold mb-1 ${
                stats.avgCompliance >= 90 ? 'text-green-600' : 
                stats.avgCompliance >= 75 ? 'text-amber-600' : 'text-red-600'
              }`}>
                {stats.avgCompliance}%
              </p>
              <p className="text-sm text-gray-500">Avg Compliance</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-3xl font-bold text-teal-600 mb-1">
                {stats.sessionsAudited}
              </p>
              <p className="text-sm text-gray-500">Sessions</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className={`text-3xl font-bold mb-1 ${stats.pendingReviews > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                {stats.pendingReviews}
              </p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
          </div>

          {/* Motivational Message */}
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                {stats.avgCompliance >= 90 ? (
                  <CheckCircleIcon className="h-5 w-5 text-blue-600" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-blue-600" />
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {stats.avgCompliance >= 90 
                    ? '🌟 Outstanding work! Your audits are making a real difference!' 
                    : stats.avgCompliance >= 75 
                      ? '👍 Great progress! Keep up the consistent auditing!' 
                      : '💪 Every observation counts! Keep recording to improve compliance.'}
                </p>
                <p className="text-sm text-gray-600 mt-0.5">
                  {stats.observationsRecorded > 0 
                    ? `You've recorded ${stats.observationsRecorded} observations this period.`
                    : 'Start recording observations to see your impact.'}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuditorDashboard;