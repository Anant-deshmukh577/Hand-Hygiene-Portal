import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { leaderboardService } from '../../services/leaderboardService';
import { WeeklyPerformanceChart } from '../../components/charts/Charts';
import { API_BASE_URL } from '../../utils/constants';

const COLORS = {
  emerald: { primary: '#059669', light: '#ecfdf5', muted: 'rgba(5,150,105,0.08)', ring: '#a7f3d0', gradient: ['#059669', '#047857'] },
  indigo: { primary: '#6366f1', light: '#eef2ff', muted: 'rgba(99,102,241,0.08)', ring: '#c7d2fe', gradient: ['#6366f1', '#4f46e5'] },
  amber: { primary: '#f59e0b', light: '#fffbeb', muted: 'rgba(245,158,11,0.08)', ring: '#fde68a', gradient: ['#f59e0b', '#d97706'] },
  rose: { primary: '#f43f5e', light: '#fff1f2', muted: 'rgba(244,63,94,0.08)', ring: '#fecdd3', gradient: ['#f43f5e', '#e11d48'] },
  violet: { primary: '#8b5cf6', light: '#f5f3ff', muted: 'rgba(139,92,246,0.08)', ring: '#ddd6fe', gradient: ['#8b5cf6', '#7c3aed'] },
  cyan: { primary: '#06b6d4', light: '#ecfeff', muted: 'rgba(6,182,212,0.08)', ring: '#a5f3fc', gradient: ['#06b6d4', '#0891b2'] },
};

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }) => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalObservations: 0,
    complianceRate: 0,
    totalPoints: 0,
    rank: 0,
  });

  const userId = user?.id || user?._id;
  const firstName = user?.name?.split(' ')[0] || 'User';

  // Debug: Log avatar changes
  useEffect(() => {
    console.log('[Dashboard] User avatar updated:', user?.avatar);
  }, [user?.avatar]);

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      // Use user data from context as fallback
      const userObservations = user?.totalObservations || 0;
      const userCompliance = user?.complianceRate || 0;
      const userPoints = user?.totalPoints || 0;

      // Try to fetch fresh stats from API
      let apiStats = null;
      try {
        const userStatsResponse = await userService.getUserStats(userId);
        apiStats = userStatsResponse.stats || userStatsResponse;
      } catch (error) {
        console.log('Could not fetch user stats from API, using context data');
      }

      // Try to fetch user rank
      let userRank = 0;
      try {
        const rankResponse = await leaderboardService.getUserRank(userId);
        userRank = rankResponse.rank || 0;
      } catch (error) {
        console.log('Could not fetch user rank');
      }

      setStats({
        totalObservations: apiStats?.totalObservations || userObservations,
        complianceRate: apiStats?.complianceRate || userCompliance,
        totalPoints: apiStats?.totalPoints || userPoints,
        rank: userRank,
      });
    } catch (error) {
      console.error('Failed to load dashboard data', error);
      // Use fallback data from user context
      setStats({
        totalObservations: user?.totalObservations || 0,
        complianceRate: user?.complianceRate || 0,
        totalPoints: user?.totalPoints || 0,
        rank: 0,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId, user]);

  useEffect(() => {
    if (userId) {
      fetchDashboardData();
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
  const onRefresh = async () => {
    if (userId && !refreshing) {
      // Refresh user data from backend first
      try {
        await refreshUser();
      } catch (error) {
        console.error('Failed to refresh user data:', error);
      }
      // Then refresh dashboard data
      await fetchDashboardData(true);
    }
  };

  // Quick actions based on role
  const canRecordObservations = user?.role === 'auditor' || user?.role === 'admin';

  const quickActions = [
    ...(canRecordObservations ? [{
      title: 'New Observation',
      description: 'Record hand hygiene',
      icon: 'add-circle',
      color: '#0d9488',
      bgColor: '#f0fdfa',
      onPress: () => navigation.navigate('ObservationEntry'),
    }] : []),
    {
      title: 'History',
      description: 'View observations',
      icon: 'list',
      color: '#3b82f6',
      bgColor: '#eff6ff',
      onPress: () => navigation.navigate('ObservationHistory'),
    },
    {
      title: 'Leaderboard',
      description: 'Check rankings',
      icon: 'trophy',
      color: '#f59e0b',
      bgColor: '#fffbeb',
      onPress: () => navigation.navigate('Leaderboard'),
    },
    {
      title: 'Rewards',
      description: 'View points',
      icon: 'gift',
      color: '#10b981',
      bgColor: '#f0fdf4',
      onPress: () => navigation.navigate('Rewards'),
    },
  ];

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' }}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: COLORS.cyan.muted,
            borderWidth: 2,
            borderColor: COLORS.cyan.ring,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          <ActivityIndicator size="large" color={COLORS.cyan.primary} />
        </View>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#64748b', letterSpacing: 0.3 }}>
          Loading Dashboard...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.cyan.primary}
          />
        }
      >
        {/* Premium Header with Gradient */}
        <LinearGradient
          colors={COLORS.cyan.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingHorizontal: 20,
            paddingTop: 60,
            paddingBottom: 32,
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            {/* Profile Image */}
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderWidth: 2,
                borderColor: 'rgba(255,255,255,0.3)',
                overflow: 'hidden',
              }}
            >
              {user?.avatar ? (
                <Image
                  key={user.avatar} // Force re-render when avatar changes
                  source={{ uri: user.avatar }}
                  style={{ 
                    width: 48, 
                    height: 48,
                    borderRadius: 24,
                  }}
                  resizeMode="cover"
                />
              ) : (
                <Ionicons name="person" size={24} color="white" />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 24, fontWeight: '800', color: '#ffffff', letterSpacing: -0.5 }}>
                {getGreeting()}, {firstName}!
              </Text>
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
                Here's your compliance overview
              </Text>
            </View>
          </View>

          {/* Role Badge */}
          {user?.role && (
            <View
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 9999,
                alignSelf: 'flex-start',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.3)',
              }}
            >
              <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 12, textTransform: 'capitalize', letterSpacing: 0.5 }}>
                {user.role}
              </Text>
            </View>
          )}
        </LinearGradient>

        {/* Stats Grid - Premium Cards */}
        <View style={{ paddingHorizontal: 20, marginTop: -20, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {/* Total Observations */}
            <View
              style={{
                flex: 1,
                minWidth: '45%',
                backgroundColor: '#ffffff',
                borderRadius: 18,
                padding: 16,
                borderWidth: 1,
                borderColor: '#f1f5f9',
                shadowColor: '#0f172a',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: COLORS.cyan.muted,
                  borderWidth: 1,
                  borderColor: COLORS.cyan.light,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                }}
              >
                <Ionicons name="clipboard-outline" size={18} color={COLORS.cyan.primary} />
              </View>
              <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.cyan.primary, letterSpacing: -1 }}>
                {stats.totalObservations}
              </Text>
              <Text style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                Observations
              </Text>
            </View>

            {/* Compliance Rate */}
            <View
              style={{
                flex: 1,
                minWidth: '45%',
                backgroundColor: '#ffffff',
                borderRadius: 18,
                padding: 16,
                borderWidth: 1,
                borderColor: '#f1f5f9',
                shadowColor: '#0f172a',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: stats.complianceRate >= 90 ? COLORS.emerald.muted : stats.complianceRate >= 75 ? COLORS.amber.muted : COLORS.rose.muted,
                  borderWidth: 1,
                  borderColor: stats.complianceRate >= 90 ? COLORS.emerald.light : stats.complianceRate >= 75 ? COLORS.amber.light : COLORS.rose.light,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                }}
              >
                <Ionicons 
                  name="checkmark-circle-outline" 
                  size={18} 
                  color={stats.complianceRate >= 90 ? COLORS.emerald.primary : stats.complianceRate >= 75 ? COLORS.amber.primary : COLORS.rose.primary}
                />
              </View>
              <Text style={{ 
                fontSize: 24, 
                fontWeight: '800', 
                color: stats.complianceRate >= 90 ? COLORS.emerald.primary : stats.complianceRate >= 75 ? COLORS.amber.primary : COLORS.rose.primary,
                letterSpacing: -1 
              }}>
                {stats.complianceRate}%
              </Text>
              <Text style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                Compliance
              </Text>
            </View>

            {/* Total Points */}
            <View
              style={{
                flex: 1,
                minWidth: '45%',
                backgroundColor: '#ffffff',
                borderRadius: 18,
                padding: 16,
                borderWidth: 1,
                borderColor: '#f1f5f9',
                shadowColor: '#0f172a',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: COLORS.amber.muted,
                  borderWidth: 1,
                  borderColor: COLORS.amber.light,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                }}
              >
                <Ionicons name="star-outline" size={18} color={COLORS.amber.primary} />
              </View>
              <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.amber.primary, letterSpacing: -1 }}>
                {stats.totalPoints}
              </Text>
              <Text style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                Points
              </Text>
            </View>

            {/* Rank */}
            <View
              style={{
                flex: 1,
                minWidth: '45%',
                backgroundColor: '#ffffff',
                borderRadius: 18,
                padding: 16,
                borderWidth: 1,
                borderColor: '#f1f5f9',
                shadowColor: '#0f172a',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: COLORS.violet.muted,
                  borderWidth: 1,
                  borderColor: COLORS.violet.light,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                }}
              >
                <Ionicons name="trophy-outline" size={18} color={COLORS.violet.primary} />
              </View>
              <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.violet.primary, letterSpacing: -1 }}>
                {stats.rank > 0 ? `#${stats.rank}` : '-'}
              </Text>
              <Text style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                Rank
              </Text>
            </View>
          </View>
        </View>

        {/* Compliance Progress Bar */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <View
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 20,
              padding: 16,
              borderWidth: 1,
              borderColor: '#f1f5f9',
              shadowColor: '#0f172a',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.06,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#1e293b' }}>
                Compliance Progress
              </Text>
              <Text style={{ 
                fontSize: 14, 
                fontWeight: '800', 
                color: stats.complianceRate >= 90 ? COLORS.emerald.primary :
                       stats.complianceRate >= 75 ? COLORS.amber.primary : COLORS.rose.primary
              }}>
                {stats.complianceRate}%
              </Text>
            </View>
            
            {/* Progress Bar */}
            <View style={{ height: 12, backgroundColor: '#f1f5f9', borderRadius: 9999, overflow: 'hidden', marginBottom: 8 }}>
              <View 
                style={{ 
                  height: '100%', 
                  borderRadius: 9999,
                  backgroundColor: stats.complianceRate >= 90 ? COLORS.emerald.primary :
                                   stats.complianceRate >= 75 ? COLORS.amber.primary : COLORS.rose.primary,
                  width: `${stats.complianceRate}%` 
                }}
              />
            </View>

            {/* Target Line */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 11, color: '#94a3b8' }}>0%</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#94a3b8', marginRight: 4 }} />
                <Text style={{ fontSize: 11, color: '#94a3b8' }}>Target: 90%</Text>
              </View>
              <Text style={{ fontSize: 11, color: '#94a3b8' }}>100%</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <View
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 20,
              padding: 16,
              borderWidth: 1,
              borderColor: '#f1f5f9',
              shadowColor: '#0f172a',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.06,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: COLORS.cyan.muted,
                  borderWidth: 1,
                  borderColor: COLORS.cyan.light,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}
              >
                <Ionicons name="flash" size={20} color={COLORS.cyan.primary} />
              </View>
              <View>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#1e293b', letterSpacing: -0.3 }}>Quick Actions</Text>
                <Text style={{ fontSize: 12, color: '#64748b' }}>Get things done faster</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {quickActions.map((action, index) => (
                <Pressable
                  key={index}
                  onPress={action.onPress}
                  style={{
                    width: '48%',
                    backgroundColor: '#f8fafc',
                    borderRadius: 16,
                    borderWidth: 2,
                    borderColor: '#f1f5f9',
                    padding: 14,
                    marginBottom: 12,
                  }}
                  className="active:opacity-70"
                >
                  <View 
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      backgroundColor: action.bgColor,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 10,
                    }}
                  >
                    <Ionicons name={action.icon} size={24} color={action.color} />
                  </View>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#1e293b', marginBottom: 4 }}>
                    {action.title}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#64748b' }}>
                    {action.description}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* Motivational Message */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <View
            style={{
              backgroundColor: stats.complianceRate >= 90 ? COLORS.emerald.light : 
                             stats.complianceRate >= 75 ? COLORS.amber.light : COLORS.indigo.light,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: stats.complianceRate >= 90 ? COLORS.emerald.ring : 
                          stats.complianceRate >= 75 ? COLORS.amber.ring : COLORS.indigo.ring,
              padding: 16,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: stats.complianceRate >= 90 ? COLORS.emerald.muted : 
                                   stats.complianceRate >= 75 ? COLORS.amber.muted : COLORS.indigo.muted,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}
              >
                <Ionicons 
                  name={stats.complianceRate >= 90 ? 'checkmark-circle' :
                        stats.complianceRate >= 75 ? 'trending-up' : 'bulb'}
                  size={20} 
                  color={stats.complianceRate >= 90 ? COLORS.emerald.primary :
                         stats.complianceRate >= 75 ? COLORS.amber.primary : COLORS.indigo.primary} 
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '700',
                    color: stats.complianceRate >= 90 ? COLORS.emerald.primary :
                           stats.complianceRate >= 75 ? COLORS.amber.primary : COLORS.indigo.primary,
                    marginBottom: 4,
                  }}
                >
                  {stats.complianceRate >= 90 
                    ? '🎉 Excellent work! You\'re a hand hygiene champion!' 
                    : stats.complianceRate >= 75 
                      ? '💪 Great progress! Keep up the good work!' 
                      : 'Room for improvement. Every wash counts!'}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: stats.complianceRate >= 90 ? '#047857' :
                           stats.complianceRate >= 75 ? '#d97706' : '#4f46e5',
                    lineHeight: 18,
                  }}
                >
                  {stats.complianceRate >= 90 
                    ? 'Your compliance rate is above the target. Keep maintaining this standard!' 
                    : `You're ${90 - stats.complianceRate}% away from the 90% target. You can do it!`}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Performance Summary */}
        <View style={{ paddingHorizontal: 20, marginTop: 24, marginBottom: 24 }}>
          <View
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 20,
              padding: 16,
              borderWidth: 1,
              borderColor: '#f1f5f9',
              shadowColor: '#0f172a',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.06,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: '#1e293b', letterSpacing: -0.3 }}>
                Performance Summary
              </Text>
              <View
                style={{
                  backgroundColor: COLORS.cyan.muted,
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  borderRadius: 9999,
                  borderWidth: 1,
                  borderColor: COLORS.cyan.light,
                }}
              >
                <Text style={{ fontSize: 10, fontWeight: '700', color: COLORS.cyan.primary, letterSpacing: 0.5 }}>
                  THIS WEEK
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              <View style={{ width: '48%', marginBottom: 12 }}>
                <View
                  style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: 14,
                    padding: 12,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.cyan.primary, marginBottom: 4 }}>
                    {stats.totalObservations}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#64748b', textAlign: 'center' }}>
                    Total Observations
                  </Text>
                </View>
              </View>

              <View style={{ width: '48%', marginBottom: 12 }}>
                <View
                  style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: 14,
                    padding: 12,
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: '800',
                      color: stats.complianceRate >= 90 ? COLORS.emerald.primary :
                             stats.complianceRate >= 75 ? COLORS.amber.primary : COLORS.rose.primary,
                      marginBottom: 4,
                    }}
                  >
                    {stats.complianceRate}%
                  </Text>
                  <Text style={{ fontSize: 11, color: '#64748b', textAlign: 'center' }}>
                    Compliance Rate
                  </Text>
                </View>
              </View>

              <View style={{ width: '48%' }}>
                <View
                  style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: 14,
                    padding: 12,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.amber.primary, marginBottom: 4 }}>
                    {stats.totalPoints}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#64748b', textAlign: 'center' }}>
                    Points Earned
                  </Text>
                </View>
              </View>

              <View style={{ width: '48%' }}>
                <View
                  style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: 14,
                    padding: 12,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.violet.primary, marginBottom: 4 }}>
                    #{stats.rank || '-'}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#64748b', textAlign: 'center' }}>
                    Current Rank
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Weekly Performance Chart */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 20,
              padding: 16,
              borderWidth: 1,
              borderColor: '#f1f5f9',
              shadowColor: '#0f172a',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.06,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: COLORS.cyan.muted,
                  borderWidth: 1,
                  borderColor: COLORS.cyan.light,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}
              >
                <Ionicons name="trending-up" size={20} color={COLORS.cyan.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#1e293b', letterSpacing: -0.3 }}>
                  Weekly Performance
                </Text>
                <Text style={{ fontSize: 12, color: '#64748b' }}>
                  Last 7 days trend
                </Text>
              </View>
            </View>
            
            <WeeklyPerformanceChart />
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;
