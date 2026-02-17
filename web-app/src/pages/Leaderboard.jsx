import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { leaderboardService } from '../services/leaderboardService';
import LeaderboardFilters from '../components/leaderboard/LeaderboardFilters';
import LeaderboardTable from '../components/leaderboard/LeaderboardTable';
import TopPerformers from '../components/leaderboard/TopPerformers';
import DepartmentRanking from '../components/leaderboard/DepartmentRanking';
import Loader, { PageLoader } from '../components/common/Loader';
import Badge from '../components/common/Badge';

/* --- SVG Icons --- */
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

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UsersIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const ChartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const Leaderboard = () => {
  const { user } = useAuth();
  const { showError } = useNotification();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [filters, setFilters] = useState({
    timePeriod: 'weekly',
    department: 'all',
    ward: 'all',
  });

  const fetchLeaderboardData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      // Fetch leaderboard data from API
      const leaderboardResponse = await leaderboardService.getLeaderboard({
        timePeriod: filters.timePeriod,
        department: filters.department !== 'all' ? filters.department : undefined,
        ward: filters.ward !== 'all' ? filters.ward : undefined,
        limit: 20,
      });
      
      const users = (leaderboardResponse.leaderboard || []).map(u => ({
        id: u._id,
        name: u.name,
        department: u.department,
        designation: u.designation,
        // Always show actual totalPoints (includes reward deductions)
        // periodPoints is only used for ranking, not display
        totalPoints: u.totalPoints || 0,
        complianceRate: filters.timePeriod !== 'all_time' ? (u.periodCompliance || 0) : (u.complianceRate || 0),
        totalObservations: filters.timePeriod !== 'all_time' ? (u.periodObservations || 0) : (u.totalObservations || 0),
        avatar: u.avatar,
        rank: u.rank,
      }));
      
      setLeaderboardData(users);

      // Fetch department rankings
      const deptResponse = await leaderboardService.getDepartmentRankings(filters.timePeriod);
      const departments = (deptResponse.rankings || []).map(d => ({
        name: d.name,
        averagePoints: parseFloat(d.averagePoints) || 0,
        totalStaff: d.totalStaff || 0,
        complianceRate: d.complianceRate || 0,
      }));
      
      setDepartmentData(departments);
      setLastUpdated(new Date());
    } catch (error) {
      showError(error.message || 'Failed to load leaderboard data');
      setLeaderboardData([]);
      setDepartmentData([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [showError, filters]);

  useEffect(() => {
    fetchLeaderboardData();
  }, [fetchLeaderboardData]);

  // Refresh leaderboard when user navigates back to this page
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Page became visible, refresh data
        fetchLeaderboardData(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchLeaderboardData]);

  const handleRefresh = () => {
    if (!refreshing) {
      fetchLeaderboardData(true);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Get time period label
  const getTimePeriodLabel = () => {
    const labels = {
      daily: 'Today',
      weekly: 'This Week',
      monthly: 'This Month',
      all_time: 'All Time',
    };
    return labels[filters.timePeriod] || 'This Week';
  };

  // Find current user rank
  const currentUserRank = leaderboardData.find(u => u.id === user?.id)?.rank;

  if (loading) {
    return <PageLoader text="Loading leaderboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
                <TrophyIcon />
              </div>
              
              {/* Title */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Leaderboard
                  </h1>
                  <SparklesIcon />
                </div>
                <p className="text-gray-500">
                  Top performers in hand hygiene compliance
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
                  focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                <RefreshIcon className={refreshing ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>

              {/* Time Period Badge */}
              <Badge variant="primary" size="medium">
                {getTimePeriodLabel()}
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <TrophyIcon className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{leaderboardData.length}</p>
                <p className="text-xs text-gray-500">Participants</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <StarIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {leaderboardData.length > 0 ? leaderboardData[0]?.totalPoints?.toLocaleString() : 0}
                </p>
                <p className="text-xs text-gray-500">Top Score</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                <ChartIcon className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-teal-600">
                  {leaderboardData.length > 0 
                    ? Math.round(leaderboardData.reduce((sum, u) => sum + u.complianceRate, 0) / leaderboardData.length) 
                    : 0}%
                </p>
                <p className="text-xs text-gray-500">Avg Compliance</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <UsersIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {currentUserRank ? `#${currentUserRank}` : '-'}
                </p>
                <p className="text-xs text-gray-500">Your Rank</p>
              </div>
            </div>
          </div>
        </div>

        {/* Your Position Card (if user is in leaderboard) */}
        {currentUserRank && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <TrophyIcon className="h-6 w-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-800 mb-1">Your Current Position</h3>
                  <p className="text-sm text-amber-700">
                    You're ranked <span className="font-bold">#{currentUserRank}</span> out of {leaderboardData.length} participants {getTimePeriodLabel().toLowerCase()}.
                    {currentUserRank <= 3 && ' 🎉 Amazing work!'}
                    {currentUserRank > 3 && currentUserRank <= 10 && ' Keep pushing to reach the top 3!'}
                    {currentUserRank > 10 && ' Every observation counts towards your rank!'}
                  </p>
                </div>
                <div className="text-3xl font-bold text-amber-600">
                  #{currentUserRank}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-8">
          <LeaderboardFilters filters={filters} onChange={handleFilterChange} />
        </div>

        {/* Top Performers */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <StarIcon className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Top Performers</h2>
              <p className="text-sm text-gray-500">Leading the way in hand hygiene excellence</p>
            </div>
          </div>
          <TopPerformers performers={leaderboardData} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Leaderboard Table - Takes 2 columns */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/8 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                      <ChartIcon className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Full Rankings</h2>
                      <p className="text-sm text-gray-500">Complete leaderboard standings</p>
                    </div>
                  </div>
                  <span className="hidden sm:inline-flex items-center px-3 py-1 bg-teal-50 text-teal-700 text-xs font-semibold rounded-full">
                    {leaderboardData.length} participants
                  </span>
                </div>
              </div>
              <div className="p-6">
                <LeaderboardTable 
                  users={leaderboardData}
                  currentUserId={user?.id}
                  loading={loading}
                />
              </div>
            </div>
          </div>

          {/* Department Rankings - Takes 1 column */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/8 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <UsersIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Department Rankings</h2>
                    <p className="text-sm text-gray-500">Team performance comparison</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <DepartmentRanking departments={departmentData} />
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Footer */}
        <div className="mt-8">
          <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-2xl border border-teal-100 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0">
                <svg className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-teal-800 mb-1">Climb the Leaderboard!</h3>
                <p className="text-sm text-teal-700">
                  Record more hand hygiene observations to earn points and improve your ranking. 
                  Every compliant observation counts towards your score and helps maintain a safer environment for patients.
                </p>
              </div>
              <a
                href="/observation-entry"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-xl shadow-lg shadow-teal-600/25 transition-all duration-200"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Record Observation
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Leaderboard;