import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  RefreshControl,
  ActivityIndicator,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { leaderboardService } from '../../services/leaderboardService';

const COLORS = {
  emerald: { primary: '#059669', light: '#ecfdf5', muted: 'rgba(5,150,105,0.08)', ring: '#a7f3d0', gradient: ['#059669', '#047857'] },
  indigo: { primary: '#6366f1', light: '#eef2ff', muted: 'rgba(99,102,241,0.08)', ring: '#c7d2fe', gradient: ['#6366f1', '#4f46e5'] },
  amber: { primary: '#f59e0b', light: '#fffbeb', muted: 'rgba(245,158,11,0.08)', ring: '#fde68a', gradient: ['#f59e0b', '#d97706'] },
  rose: { primary: '#f43f5e', light: '#fff1f2', muted: 'rgba(244,63,94,0.08)', ring: '#fecdd3', gradient: ['#f43f5e', '#e11d48'] },
  violet: { primary: '#8b5cf6', light: '#f5f3ff', muted: 'rgba(139,92,246,0.08)', ring: '#ddd6fe', gradient: ['#8b5cf6', '#7c3aed'] },
  cyan: { primary: '#06b6d4', light: '#ecfeff', muted: 'rgba(6,182,212,0.08)', ring: '#a5f3fc', gradient: ['#06b6d4', '#0891b2'] },
};

const LeaderboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [timePeriod, setTimePeriod] = useState('weekly');

  const userId = user?.id || user?._id;

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Fetch leaderboard data
  const fetchLeaderboardData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const leaderboardResponse = await leaderboardService.getLeaderboard({
        timePeriod,
        limit: 20,
      });

      const users = (leaderboardResponse.leaderboard || []).map((u, index) => ({
        id: u._id,
        name: u.name,
        department: u.department,
        designation: u.designation,
        totalPoints: timePeriod !== 'all_time' ? (u.periodPoints || 0) : (u.totalPoints || 0),
        complianceRate: timePeriod !== 'all_time' ? (u.periodCompliance || 0) : (u.complianceRate || 0),
        totalObservations: timePeriod !== 'all_time' ? (u.periodObservations || 0) : (u.totalObservations || 0),
        avatar: u.avatar,
        rank: index + 1,
      }));

      setLeaderboardData(users);
    } catch (error) {
      console.error('Failed to load leaderboard data', error);
      setLeaderboardData([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [timePeriod]);

  useEffect(() => {
    fetchLeaderboardData();
  }, [fetchLeaderboardData]);

  // Refresh leaderboard when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      // Refresh data when user navigates to this screen
      fetchLeaderboardData(true);
    }, [fetchLeaderboardData])
  );

  // Handle refresh
  const onRefresh = () => {
    if (!refreshing) {
      fetchLeaderboardData(true);
    }
  };

  // Time period options
  const timePeriods = [
    { value: 'daily', label: 'Today' },
    { value: 'weekly', label: 'Week' },
    { value: 'monthly', label: 'Month' },
    { value: 'all_time', label: 'All Time' },
  ];

  // Find current user rank
  const currentUserRank = leaderboardData.find(u => u.id === userId)?.rank;

  // Get rank styling
  const getRankStyle = (rank) => {
    if (rank === 1) return { color: COLORS.amber, icon: 'trophy', medal: '🥇' };
    if (rank === 2) return { color: { ...COLORS.indigo, primary: '#9ca3af' }, icon: 'medal', medal: '🥈' };
    if (rank === 3) return { color: { ...COLORS.amber, primary: '#d97706' }, icon: 'medal', medal: '🥉' };
    return { color: { primary: '#6b7280', muted: 'rgba(107,114,128,0.08)', light: '#f3f4f6' }, icon: 'ellipse', medal: null };
  };

  const getComplianceColor = (rate) => {
    if (rate >= 90) return COLORS.emerald;
    if (rate >= 75) return COLORS.amber;
    return COLORS.rose;
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' }}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: COLORS.amber.muted,
            borderWidth: 2,
            borderColor: COLORS.amber.ring,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}
        >
          <ActivityIndicator size="large" color={COLORS.amber.primary} />
        </View>
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#64748b', letterSpacing: 0.3 }}>
          Loading Leaderboard...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#ffffff' }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={COLORS.amber.primary}
        />
      }
    >
      {/* Premium Header with Gradient */}
      <LinearGradient
        colors={COLORS.amber.gradient}
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
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              backgroundColor: 'rgba(255,255,255,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}
          >
            <Ionicons name="trophy" size={24} color="white" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#ffffff', letterSpacing: -0.5 }}>
              Leaderboard
            </Text>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
              Top performers in compliance
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Time Period Filter - Premium Pills */}
      <View style={{ paddingHorizontal: 20, marginTop: -20, marginBottom: 20 }}>
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {timePeriods.map((period) => (
                <Pressable
                  key={period.value}
                  onPress={() => setTimePeriod(period.value)}
                  className="active:scale-95"
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 9999,
                    backgroundColor: timePeriod === period.value ? COLORS.amber.primary : COLORS.amber.muted,
                    borderWidth: 1,
                    borderColor: timePeriod === period.value ? COLORS.amber.primary : COLORS.amber.light,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: '600',
                      color: timePeriod === period.value ? '#ffffff' : COLORS.amber.primary,
                    }}
                  >
                    {period.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Quick Stats - Premium Cards */}
      <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View
            style={{
              flex: 1,
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
              <Ionicons name="people" size={18} color={COLORS.amber.primary} />
            </View>
            <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.amber.primary, letterSpacing: -1 }}>
              {leaderboardData.length}
            </Text>
            <Text style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
              Participants
            </Text>
          </View>

          <View
            style={{
              flex: 1,
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
                backgroundColor: COLORS.indigo.muted,
                borderWidth: 1,
                borderColor: COLORS.indigo.light,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 10,
              }}
            >
              <Ionicons name="ribbon" size={18} color={COLORS.indigo.primary} />
            </View>
            <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.indigo.primary, letterSpacing: -1 }}>
              {currentUserRank ? `#${currentUserRank}` : '-'}
            </Text>
            <Text style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
              Your Rank
            </Text>
          </View>
        </View>
      </View>

      {/* Your Position Card - Premium */}
      {currentUserRank && (
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <LinearGradient
            colors={[COLORS.amber.light, '#fef3c7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              borderRadius: 20,
              padding: 18,
              borderWidth: 1,
              borderColor: COLORS.amber.ring,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  backgroundColor: '#ffffff',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 14,
                  shadowColor: COLORS.amber.primary,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 6,
                  elevation: 3,
                }}
              >
                <Ionicons name="trophy" size={24} color={COLORS.amber.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#92400e', marginBottom: 4 }}>
                  Your Current Position
                </Text>
                <Text style={{ fontSize: 11, color: '#b45309', lineHeight: 16 }}>
                  Ranked #{currentUserRank} out of {leaderboardData.length}
                  {currentUserRank <= 3 && ' 🎉'}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: '#ffffff',
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 12,
                  shadowColor: COLORS.amber.primary,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: '800', color: COLORS.amber.primary }}>
                  #{currentUserRank}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      )}

      {/* Top 3 Podium - Premium Design */}
      {leaderboardData.length >= 3 && (
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 24,
              padding: 20,
              borderWidth: 1,
              borderColor: '#f1f5f9',
              shadowColor: '#0f172a',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.08,
              shadowRadius: 16,
              elevation: 4,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '800', color: '#1e293b', marginBottom: 20, textAlign: 'center', letterSpacing: -0.3 }}>
              🏆 Top Performers
            </Text>
            
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 8 }}>
              {/* 2nd Place */}
              <View style={{ alignItems: 'center', flex: 1 }}>
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    backgroundColor: '#9ca3af',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 10,
                    borderWidth: 3,
                    borderColor: '#ffffff',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                >
                  {leaderboardData[1]?.avatar ? (
                    <Image
                      source={{ uri: leaderboardData[1].avatar }}
                      style={{ width: '100%', height: '100%', borderRadius: 13 }}
                    />
                  ) : (
                    <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 16 }}>
                      {getInitials(leaderboardData[1]?.name)}
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    backgroundColor: '#e5e7eb',
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    width: '100%',
                    height: 80,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 8,
                  }}
                >
                  <Text style={{ fontSize: 28, marginBottom: 4 }}>🥈</Text>
                  <Text style={{ color: '#374151', fontWeight: '700', fontSize: 11 }} numberOfLines={1}>
                    {leaderboardData[1]?.name?.split(' ')[0]}
                  </Text>
                  <Text style={{ color: '#6b7280', fontSize: 10, fontWeight: '600', marginTop: 2 }}>
                    {leaderboardData[1]?.totalPoints} pts
                  </Text>
                </View>
              </View>

              {/* 1st Place */}
              <View style={{ alignItems: 'center', flex: 1, marginBottom: 16 }}>
                <Text style={{ fontSize: 24, marginBottom: 4 }}>👑</Text>
                <LinearGradient
                  colors={COLORS.amber.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: 68,
                    height: 68,
                    borderRadius: 18,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 10,
                    borderWidth: 4,
                    borderColor: '#ffffff',
                    shadowColor: COLORS.amber.primary,
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                    elevation: 6,
                  }}
                >
                  {leaderboardData[0]?.avatar ? (
                    <Image
                      source={{ uri: leaderboardData[0].avatar }}
                      style={{ width: '100%', height: '100%', borderRadius: 14 }}
                    />
                  ) : (
                    <Text style={{ color: '#ffffff', fontWeight: '800', fontSize: 20 }}>
                      {getInitials(leaderboardData[0]?.name)}
                    </Text>
                  )}
                </LinearGradient>
                <LinearGradient
                  colors={COLORS.amber.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    width: '100%',
                    height: 100,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 8,
                  }}
                >
                  <Text style={{ fontSize: 32, marginBottom: 4 }}>🥇</Text>
                  <Text style={{ color: '#ffffff', fontWeight: '800', fontSize: 12 }} numberOfLines={1}>
                    {leaderboardData[0]?.name?.split(' ')[0]}
                  </Text>
                  <Text style={{ color: '#ffffff', fontSize: 11, fontWeight: '700', marginTop: 2 }}>
                    {leaderboardData[0]?.totalPoints} pts
                  </Text>
                </LinearGradient>
              </View>

              {/* 3rd Place */}
              <View style={{ alignItems: 'center', flex: 1 }}>
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    backgroundColor: '#d97706',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 10,
                    borderWidth: 3,
                    borderColor: '#ffffff',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.15,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                >
                  {leaderboardData[2]?.avatar ? (
                    <Image
                      source={{ uri: leaderboardData[2].avatar }}
                      style={{ width: '100%', height: '100%', borderRadius: 13 }}
                    />
                  ) : (
                    <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 16 }}>
                      {getInitials(leaderboardData[2]?.name)}
                    </Text>
                  )}
                </View>
                <View
                  style={{
                    backgroundColor: '#fde68a',
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    width: '100%',
                    height: 70,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 8,
                    paddingVertical: 6,
                  }}
                >
                  <Text style={{ fontSize: 24, marginBottom: 2 }}>🥉</Text>
                  <Text style={{ color: '#92400e', fontWeight: '700', fontSize: 10 }} numberOfLines={1}>
                    {leaderboardData[2]?.name?.split(' ')[0]}
                  </Text>
                  <Text style={{ color: '#b45309', fontSize: 9, fontWeight: '600', marginTop: 1 }}>
                    {leaderboardData[2]?.totalPoints} pts
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Full Rankings - Premium List */}
      <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
        <View
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 20,
            borderWidth: 1,
            borderColor: '#f1f5f9',
            shadowColor: '#0f172a',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.06,
            shadowRadius: 12,
            elevation: 3,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 14,
              borderBottomWidth: 1,
              borderBottomColor: '#f1f5f9',
              backgroundColor: '#fafafa',
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '800', color: '#1e293b' }}>
              Full Rankings
            </Text>
            <Text style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>
              {leaderboardData.length} participants
            </Text>
          </View>

          {/* Rankings List */}
          {leaderboardData.map((user, index) => {
            const rankStyle = getRankStyle(user.rank);
            const isCurrentUser = user.id === userId;
            const complianceColor = getComplianceColor(user.complianceRate);

            return (
              <View
                key={user.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  borderBottomWidth: index < leaderboardData.length - 1 ? 1 : 0,
                  borderBottomColor: '#f1f5f9',
                  backgroundColor: isCurrentUser ? COLORS.cyan.muted : '#ffffff',
                }}
              >
                {/* Rank Badge */}
                <LinearGradient
                  colors={user.rank <= 3 ? rankStyle.color.gradient : ['#6b7280', '#6b7280']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}
                >
                  {rankStyle.medal ? (
                    <Text style={{ fontSize: 18 }}>{rankStyle.medal}</Text>
                  ) : (
                    <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 13 }}>
                      {user.rank}
                    </Text>
                  )}
                </LinearGradient>

                {/* Avatar */}
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: COLORS.cyan.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                    overflow: 'hidden',
                    borderWidth: 2,
                    borderColor: isCurrentUser ? COLORS.cyan.ring : 'transparent',
                  }}
                >
                  {user.avatar ? (
                    <Image
                      source={{ uri: user.avatar }}
                      style={{ width: '100%', height: '100%' }}
                    />
                  ) : (
                    <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 14 }}>
                      {getInitials(user.name)}
                    </Text>
                  )}
                </View>

                {/* User Info */}
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '700',
                        color: isCurrentUser ? COLORS.cyan.primary : '#1e293b',
                      }}
                      numberOfLines={1}
                    >
                      {user.name}
                    </Text>
                    {isCurrentUser && (
                      <View
                        style={{
                          backgroundColor: COLORS.cyan.primary,
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          borderRadius: 9999,
                          marginLeft: 6,
                        }}
                      >
                        <Text style={{ color: '#ffffff', fontSize: 9, fontWeight: '700' }}>
                          YOU
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text style={{ fontSize: 10, color: '#64748b', marginBottom: 4 }} numberOfLines={1}>
                    {user.department}
                  </Text>
                  <View
                    style={{
                      backgroundColor: complianceColor.muted,
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 6,
                      alignSelf: 'flex-start',
                      borderWidth: 1,
                      borderColor: complianceColor.light,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: '700',
                        color: complianceColor.primary,
                      }}
                    >
                      {user.complianceRate}%
                    </Text>
                  </View>
                </View>

                {/* Points */}
                <View style={{ alignItems: 'flex-end' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                    <Ionicons name="star" size={14} color={COLORS.amber.primary} />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '800',
                        color: COLORS.amber.primary,
                        marginLeft: 4,
                      }}
                    >
                      {user.totalPoints}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 9, color: '#94a3b8', fontWeight: '500' }}>
                    points
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Motivational Footer - Premium */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 32 }}>
        <View
          style={{
            backgroundColor: COLORS.cyan.muted,
            borderRadius: 20,
            padding: 18,
            borderWidth: 1,
            borderColor: COLORS.cyan.light,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <LinearGradient
              colors={COLORS.cyan.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 14,
                shadowColor: COLORS.cyan.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <Ionicons name="flash" size={24} color="white" />
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: COLORS.cyan.primary, marginBottom: 6 }}>
                Climb the Leaderboard!
              </Text>
              <Text style={{ fontSize: 11, color: '#475569', lineHeight: 16 }}>
                Record more observations to earn points and improve your ranking.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default LeaderboardScreen;
