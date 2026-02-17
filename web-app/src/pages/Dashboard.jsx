import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { reportService } from '../services/reportService';
import { leaderboardService } from '../services/leaderboardService';
import { userService } from '../services/userService';
import { healthService } from '../services/healthService';
import { useNotification } from '../context/NotificationContext';
import StatsCard from '../components/dashboard/StatsCard';
import RecentActivities from '../components/dashboard/RecentActivities';
import QuickActions from '../components/dashboard/QuickActions';
import WeeklyChart from '../components/dashboard/WeeklyChart';
import ComplianceRate from '../components/dashboard/ComplianceRate';
import Loader, { PageLoader } from '../components/common/Loader';
import Badge from '../components/common/Badge';

/* --- SVG Icons --- */
const ClipboardIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const StarIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const TrophyIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const ServerIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const WaveIcon = () => (
  <svg className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
  </svg>
);

const Dashboard = () => {
  const { user, refreshUser } = useAuth();
  const { showError } = useNotification();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalObservations: 0,
    complianceRate: 0,
    totalPoints: 0,
    rank: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [complianceBreakdown, setComplianceBreakdown] = useState([]);
  const [apiStatus, setApiStatus] = useState({ status: 'checking', timestamp: null });
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const userId = user?.id || user?._id;

  const fetchDashboardData = useCallback(async (currentUserId, isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      // Fetch user stats
      const userStatsResponse = await userService.getUserStats(currentUserId);
      const userStats = userStatsResponse.stats || {};

      // Fetch user rank
      let userRank = 0;
      try {
        const rankResponse = await leaderboardService.getUserRank(currentUserId);
        userRank = rankResponse.rank || 0;
      } catch (error) {
        console.error('Failed to fetch user rank', error);
      }

      setStats({
        totalObservations: user?.totalObservations || userStats.totalObservations || 0,
        complianceRate: user?.complianceRate || userStats.complianceRate || 0,
        totalPoints: user?.totalPoints || userStats.totalPoints || 0,
        rank: userRank,
      });

      // Fetch recent activity
      try {
        const activityResponse = await userService.getUserActivity(currentUserId);
        const activities = (activityResponse.activities || []).map(activity => ({
          title: activity.source === 'observation' ? 'Hand Hygiene Observation' : activity.type,
          description: activity.description,
          type: activity.source === 'observation' 
            ? (activity.isCompliant ? 'compliant' : 'non-compliant')
            : 'default',
          createdAt: activity.createdAt,
        }));
        setRecentActivities(activities.length > 0 ? activities : [
          { 
            title: 'Welcome!', 
            description: 'Start recording observations to see your activity', 
            type: 'notification',
            createdAt: new Date().toISOString() 
          }
        ]);
      } catch (error) {
        console.error('Failed to fetch recent activity', error);
        setRecentActivities([]);
      }

      // Fetch weekly trends
      try {
        const trendsResponse = await reportService.getTrendReport({ days: 7 });
        const trends = trendsResponse.trends || [];
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weeklyFormatted = trends.map(t => ({
          day: dayNames[new Date(t.date).getDay()],
          observations: t.observations,
          compliance: t.compliance,
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
      } catch (error) {
        console.error('Failed to fetch weekly trends', error);
        setWeeklyData([]);
      }

      // Fetch compliance breakdown by WHO moments
      try {
        const complianceResponse = await reportService.getComplianceReport();
        const whoMoments = complianceResponse.report?.whoMoments || [];
        const breakdown = whoMoments.map(m => ({
          moment: m.moment,
          rate: parseFloat(m.complianceRate) || 0,
        }));
        setComplianceBreakdown(breakdown.length > 0 ? breakdown : [
          { moment: 'Before touching patient', rate: 0 },
          { moment: 'Before aseptic procedure', rate: 0 },
          { moment: 'After body fluid exposure', rate: 0 },
          { moment: 'After touching patient', rate: 0 },
          { moment: 'After touching surroundings', rate: 0 },
        ]);
      } catch (error) {
        console.error('Failed to fetch compliance breakdown', error);
        setComplianceBreakdown([]);
      }

      // Fetch API health status
      try {
        const healthResponse = await healthService.getHealth();
        setApiStatus({
          status: healthResponse?.success ? 'online' : 'offline',
          timestamp: healthResponse?.timestamp || null,
        });
      } catch (error) {
        console.error('Failed to fetch API health status', error);
        setApiStatus({ status: 'offline', timestamp: null });
      }

      setLastUpdated(new Date());

    } catch (error) {
      showError(error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showError, user]);

  useEffect(() => {
    if (userId) {
      fetchDashboardData(userId);
    }
  }, [userId, fetchDashboardData]);

  // Update stats when user data changes (e.g., after claiming reward)
  useEffect(() => {
    if (user) {
      console.log('[Dashboard] User data changed, updating stats');
      console.log('[Dashboard] New user.totalPoints:', user.totalPoints);
      setStats(prev => ({
        ...prev,
        totalPoints: user.totalPoints || prev.totalPoints,
        totalObservations: user.totalObservations || prev.totalObservations,
        complianceRate: user.complianceRate || prev.complianceRate,
      }));
    }
  }, [user?.totalPoints, user?.totalObservations, user?.complianceRate]);

  // Handle refresh
  const handleRefresh = async () => {
    if (userId && !refreshing) {
      // Refresh user data from backend first
      try {
        await refreshUser();
      } catch (error) {
        console.error('Failed to refresh user data:', error);
      }
      // Then refresh dashboard data
      await fetchDashboardData(userId, true);
    }
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Get first name
  const firstName = user?.name?.split(' ')[0] || 'User';

  // Loading State
  if (loading) {
    return <PageLoader text="Loading your dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 text-white flex items-center justify-center text-xl font-bold shadow-lg shadow-teal-500/30 overflow-hidden">
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
                  Here's your hand hygiene compliance overview
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
                  focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <RefreshIcon className={refreshing ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>

              {/* Role Badge */}
              {user?.role && (
                <Badge variant="primary" size="medium">
                  {user.role}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 mb-8">
          <StatsCard
            title="Total Observations"
            value={stats.totalObservations.toLocaleString()}
            icon={<ClipboardIcon />}
            trend="up"
            trendValue="+12 this week"
            color="teal"
          />
          <StatsCard
            title="Compliance Rate"
            value={`${stats.complianceRate}%`}
            icon={<CheckCircleIcon />}
            trend={stats.complianceRate >= 90 ? 'up' : stats.complianceRate >= 75 ? 'neutral' : 'down'}
            trendValue={stats.complianceRate >= 90 ? 'Excellent!' : stats.complianceRate >= 75 ? 'Good' : 'Needs attention'}
            color={stats.complianceRate >= 90 ? 'green' : stats.complianceRate >= 75 ? 'amber' : 'red'}
            progress={{ value: stats.complianceRate, max: 100 }}
          />
          <StatsCard
            title="Total Points"
            value={stats.totalPoints.toLocaleString()}
            icon={<StarIcon />}
            trend="up"
            trendValue="+24 points"
            color="amber"
          />
          <StatsCard
            title="Your Rank"
            value={stats.rank > 0 ? `#${stats.rank}` : '-'}
            icon={<TrophyIcon />}
            trend="up"
            trendValue="Up 2 positions"
            color="purple"
          />
          <StatsCard
            title="API Status"
            value={
              apiStatus.status === 'online' ? 'Online' : 
              apiStatus.status === 'offline' ? 'Offline' : 'Checking'
            }
            icon={<ServerIcon />}
            trend={apiStatus.status === 'online' ? 'up' : apiStatus.status === 'offline' ? 'down' : 'neutral'}
            trendValue={
              apiStatus.timestamp 
                ? `Last: ${new Date(apiStatus.timestamp).toLocaleTimeString()}` 
                : 'Checking...'
            }
            color={
              apiStatus.status === 'online' ? 'green' : 
              apiStatus.status === 'offline' ? 'red' : 'gray'
            }
            variant="minimal"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <QuickActions />
        </div>

        {/* Charts and Activities Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Weekly Chart - Full Width on mobile, 2 cols on xl */}
          <div className="xl:col-span-2">
            <WeeklyChart 
              data={weeklyData}
              title="Weekly Performance"
              subtitle="Observations and compliance trends for the past 7 days"
              showChartTypeToggle
            />
          </div>

          {/* Compliance Rate */}
          <div className="xl:col-span-1">
            <ComplianceRate 
              rate={stats.complianceRate}
              target={90}
              breakdown={complianceBreakdown}
              period="This Month"
              showTrend
              trend={{ 
                value: '+5%', 
                type: stats.complianceRate >= 90 ? 'positive' : 'neutral' 
              }}
            />
          </div>
        </div>

        {/* Recent Activities */}
        <div className="mb-8">
          <RecentActivities 
            activities={recentActivities}
            maxItems={6}
            showViewAll
            onViewAll={() => navigate('/profile')}
          />
        </div>

        {/* Bottom Stats Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Performance Summary</h3>
            <Badge variant="primary">This Week</Badge>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-3xl font-bold text-teal-600 mb-1">
                {stats.totalObservations}
              </p>
              <p className="text-sm text-gray-500">Total Observations</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className={`text-3xl font-bold mb-1 ${
                stats.complianceRate >= 90 ? 'text-green-600' : 
                stats.complianceRate >= 75 ? 'text-amber-600' : 'text-red-600'
              }`}>
                {stats.complianceRate}%
              </p>
              <p className="text-sm text-gray-500">Compliance Rate</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-3xl font-bold text-amber-600 mb-1">
                {stats.totalPoints}
              </p>
              <p className="text-sm text-gray-500">Points Earned</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-3xl font-bold text-purple-600 mb-1">
                #{stats.rank || '-'}
              </p>
              <p className="text-sm text-gray-500">Current Rank</p>
            </div>
          </div>

          {/* Motivational Message */}
          <div className="mt-6 p-4 bg-gradient-to-r from-teal-50 to-green-50 rounded-xl border border-teal-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                {stats.complianceRate >= 90 ? (
                  <svg className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {stats.complianceRate >= 90 
                    ? '🎉 Excellent work! You\'re a hand hygiene champion!' 
                    : stats.complianceRate >= 75 
                      ? '💪 Great progress! Keep up the good work!' 
                      : '🎯 Room for improvement. Every wash counts!'}
                </p>
                <p className="text-sm text-gray-600 mt-0.5">
                  {stats.complianceRate >= 90 
                    ? 'Your compliance rate is above the target. Keep maintaining this standard!' 
                    : `You're ${90 - stats.complianceRate}% away from the 90% target. You can do it!`}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;