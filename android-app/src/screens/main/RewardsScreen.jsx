import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Pressable,
  Alert,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { rewardService } from '../../services/rewardService';
import Loader from '../../components/common/Loader';

const COLORS = {
  emerald: { primary: '#059669', light: '#ecfdf5', muted: 'rgba(5,150,105,0.08)', ring: '#a7f3d0', gradient: ['#059669', '#047857'] },
  indigo: { primary: '#6366f1', light: '#eef2ff', muted: 'rgba(99,102,241,0.08)', ring: '#c7d2fe', gradient: ['#6366f1', '#4f46e5'] },
  amber: { primary: '#f59e0b', light: '#fffbeb', muted: 'rgba(245,158,11,0.08)', ring: '#fde68a', gradient: ['#f59e0b', '#d97706'] },
  rose: { primary: '#f43f5e', light: '#fff1f2', muted: 'rgba(244,63,94,0.08)', ring: '#fecdd3', gradient: ['#f43f5e', '#e11d48'] },
  violet: { primary: '#8b5cf6', light: '#f5f3ff', muted: 'rgba(139,92,246,0.08)', ring: '#ddd6fe', gradient: ['#8b5cf6', '#7c3aed'] },
  cyan: { primary: '#06b6d4', light: '#ecfeff', muted: 'rgba(6,182,212,0.08)', ring: '#a5f3fc', gradient: ['#06b6d4', '#0891b2'] },
};

const RewardsScreen = () => {
  const { user, updateUser, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [claimLoading, setClaimLoading] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [pointsHistory, setPointsHistory] = useState([]);
  const [badges, setBadges] = useState([]);

  const userId = user?.id;
  const userPoints = user?.totalPoints || 0;

  // Fetch rewards data
  const fetchRewardsData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      if (!userId) return;

      // Fetch available rewards
      const rewardsResponse = await rewardService.getAvailableRewards();
      const availableRewards = (rewardsResponse.rewards || []).map(r => ({
        id: r._id,
        title: r.title,
        description: r.description,
        icon: r.icon || '🎁',
        pointsRequired: r.pointsRequired,
        claimed: false,
      }));

      // Fetch user's claimed rewards
      try {
        const userRewardsResponse = await rewardService.getUserRewards(userId);
        const claimedIds = (userRewardsResponse.rewards || []).map(ur => ur.reward?._id || ur.reward);
        
        // Mark claimed rewards
        availableRewards.forEach(r => {
          if (claimedIds.includes(r.id)) {
            r.claimed = true;
          }
        });
      } catch {
        // If error, just use available rewards
      }

      setRewards(availableRewards);

      // Fetch points history
      try {
        const historyResponse = await rewardService.getPointsHistory(userId);
        setPointsHistory((historyResponse.history || []).map(h => ({
          description: h.description,
          points: h.points,
          createdAt: h.createdAt,
          source: h.source,
        })));
      } catch {
        setPointsHistory([]);
      }

      // Fetch user badges
      try {
        const badgesResponse = await rewardService.getUserBadges(userId);
        setBadges((badgesResponse.badges || []).map(b => ({
          id: b.badge?._id || b.badge,
          name: b.badge?.name,
          emoji: b.badge?.emoji || '🏆',
          earnedAt: b.earnedAt,
        })));
      } catch {
        setBadges([]);
      }

    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to load rewards');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchRewardsData();
    }
  }, [fetchRewardsData, userId]);

  const handleRefresh = () => {
    if (!refreshing) {
      fetchRewardsData(true);
    }
  };

  const handleClaimReward = async (rewardId) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) return;

    Alert.alert(
      'Claim Reward',
      `Claim "${reward.title}" for ${reward.pointsRequired} points?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Claim',
          onPress: async () => {
            console.log('[Rewards] Starting reward claim process for reward:', rewardId);
            console.log('[Rewards] Current user points BEFORE claim:', user?.totalPoints);
            
            setClaimLoading(rewardId);
            try {
              // Step 1: Claim the reward (backend deducts points here)
              console.log('[Rewards] Calling backend to claim reward...');
              const response = await rewardService.claimReward(rewardId);
              console.log('[Rewards] Backend response:', response);
              
              Alert.alert('Success', 'Reward claimed successfully! Pending admin approval.');
              
              // Step 2: Update local rewards state
              setRewards(prev => prev.map(r => 
                r.id === rewardId ? { ...r, claimed: true } : r
              ));
              
              // Step 3: Wait a moment for backend to complete
              console.log('[Rewards] Waiting 500ms for backend to complete...');
              await new Promise(resolve => setTimeout(resolve, 500));
              
              // Step 4: Refresh user data from backend to get accurate points
              console.log('[Rewards] Refreshing user data from backend...');
              try {
                const updatedUser = await refreshUser();
                console.log('[Rewards] User data refreshed successfully');
                console.log('[Rewards] New user points AFTER refresh:', updatedUser?.totalPoints);
                
                if (updatedUser && updatedUser.totalPoints === user?.totalPoints) {
                  console.warn('[Rewards] WARNING: Points did not change after refresh!');
                  console.warn('[Rewards] Expected points to be deducted but they are the same');
                }
              } catch (error) {
                console.error('[Rewards] Failed to refresh user data:', error);
                // Fallback: manually update points
                if (updateUser && user) {
                  console.log('[Rewards] Using fallback: manually deducting points');
                  const newPoints = user.totalPoints - reward.pointsRequired;
                  console.log('[Rewards] Manually setting points to:', newPoints);
                  updateUser({ ...user, totalPoints: newPoints });
                }
              }
              
              // Step 5: Refresh all rewards data
              console.log('[Rewards] Refreshing rewards data...');
              await fetchRewardsData(true);
              console.log('[Rewards] Reward claim process complete');
            } catch (error) {
              console.error('[Rewards] Error during reward claim:', error);
              Alert.alert('Error', error.message || 'Failed to claim reward');
            } finally {
              setClaimLoading(null);
            }
          },
        },
      ]
    );
  };

  // Get badge tier config
  const getBadgeTier = (points) => {
    if (points >= 500) return { tier: 'Legendary', ...COLORS.violet, icon: 'trophy' };
    if (points >= 200) return { tier: 'Epic', ...COLORS.amber, icon: 'star' };
    if (points >= 100) return { tier: 'Rare', ...COLORS.indigo, icon: 'ribbon' };
    return { tier: 'Common', ...COLORS.cyan, icon: 'gift' };
  };

  // Render reward card - Premium
  const renderRewardCard = ({ item }) => {
    const canClaim = userPoints >= item.pointsRequired && !item.claimed;
    const pointsNeeded = item.pointsRequired - userPoints;
    const progressPercentage = Math.min((userPoints / item.pointsRequired) * 100, 100);
    const tierConfig = getBadgeTier(item.pointsRequired);

    return (
      <View
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 24,
          borderWidth: 1,
          borderColor: item.claimed ? '#e2e8f0' : '#f1f5f9',
          padding: 20,
          marginBottom: 16,
          opacity: item.claimed ? 0.7 : 1,
          shadowColor: '#0f172a',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: 3,
        }}
      >
        {/* Tier Badge & Status */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 10,
              backgroundColor: tierConfig.muted,
              borderWidth: 1,
              borderColor: tierConfig.light,
            }}
          >
            <Ionicons name={tierConfig.icon} size={12} color={tierConfig.primary} style={{ marginRight: 4 }} />
            <Text style={{ fontSize: 11, fontWeight: '700', color: tierConfig.primary, letterSpacing: 0.5 }}>
              {tierConfig.tier.toUpperCase()}
            </Text>
          </View>
          {item.claimed && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 10,
                backgroundColor: COLORS.emerald.muted,
                borderWidth: 1,
                borderColor: COLORS.emerald.light,
              }}
            >
              <Ionicons name="checkmark-circle" size={12} color={COLORS.emerald.primary} style={{ marginRight: 4 }} />
              <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.emerald.primary, letterSpacing: 0.5 }}>
                CLAIMED
              </Text>
            </View>
          )}
        </View>

        {/* Icon with Gradient */}
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          <LinearGradient
            colors={tierConfig.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 88,
              height: 88,
              borderRadius: 22,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: tierConfig.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text style={{ fontSize: 44 }}>{item.icon}</Text>
          </LinearGradient>
        </View>

        {/* Title & Description */}
        <Text style={{ fontSize: 18, fontWeight: '800', color: '#1e293b', textAlign: 'center', marginBottom: 8, letterSpacing: -0.5 }}>
          {item.title}
        </Text>
        <Text style={{ fontSize: 13, color: '#64748b', textAlign: 'center', marginBottom: 16, lineHeight: 18 }}>
          {item.description}
        </Text>

        {/* Points Required */}
        <View
          style={{
            backgroundColor: tierConfig.muted,
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: tierConfig.light,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ fontSize: 12, color: '#64748b', fontWeight: '600' }}>Points Required</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="star" size={16} color={tierConfig.primary} style={{ marginRight: 4 }} />
              <Text style={{ fontSize: 22, fontWeight: '800', color: tierConfig.primary, letterSpacing: -1 }}>
                {item.pointsRequired.toLocaleString()}
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          {!item.claimed && (
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={{ fontSize: 11, color: '#64748b' }}>
                  Your Points: {userPoints.toLocaleString()}
                </Text>
                <Text style={{ fontSize: 11, color: tierConfig.primary, fontWeight: '700' }}>
                  {Math.round(progressPercentage)}%
                </Text>
              </View>
              <View style={{ height: 8, backgroundColor: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                <LinearGradient
                  colors={tierConfig.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ height: '100%', width: `${progressPercentage}%`, borderRadius: 4 }}
                />
              </View>
            </View>
          )}
        </View>

        {/* Action Button */}
        {item.claimed ? (
          <View
            style={{
              backgroundColor: COLORS.emerald.muted,
              borderRadius: 14,
              paddingVertical: 14,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: COLORS.emerald.light,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="checkmark-circle" size={18} color={COLORS.emerald.primary} style={{ marginRight: 6 }} />
              <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.emerald.primary }}>
                Claimed
              </Text>
            </View>
          </View>
        ) : canClaim ? (
          <Pressable
            onPress={() => handleClaimReward(item.id)}
            disabled={claimLoading === item.id}
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            })}
          >
            <LinearGradient
              colors={COLORS.emerald.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 14,
                paddingVertical: 14,
                alignItems: 'center',
                shadowColor: COLORS.emerald.primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="gift" size={18} color="#ffffff" style={{ marginRight: 6 }} />
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#ffffff' }}>
                  {claimLoading === item.id ? 'Claiming...' : 'Claim Reward'}
                </Text>
              </View>
            </LinearGradient>
          </Pressable>
        ) : (
          <View>
            <View
              style={{
                backgroundColor: '#f8fafc',
                borderRadius: 14,
                paddingVertical: 14,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#e2e8f0',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="lock-closed" size={18} color="#94a3b8" style={{ marginRight: 6 }} />
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#94a3b8' }}>
                  Locked
                </Text>
              </View>
            </View>
            <Text style={{ textAlign: 'center', fontSize: 11, color: '#94a3b8', marginTop: 8 }}>
              Need {pointsNeeded.toLocaleString()} more points
            </Text>
          </View>
        )}
      </View>
    );
  };

  // Render points history item - Premium
  const renderHistoryItem = ({ item }) => {
    const isPositive = item.points > 0;
    const color = isPositive ? COLORS.emerald : COLORS.rose;
    
    return (
      <View
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 16,
          borderWidth: 1,
          borderColor: '#f1f5f9',
          padding: 16,
          marginBottom: 12,
          shadowColor: '#0f172a',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.03,
          shadowRadius: 4,
          elevation: 1,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#1e293b', marginBottom: 6 }}>
              {item.description}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="time-outline" size={11} color="#94a3b8" style={{ marginRight: 4 }} />
              <Text style={{ fontSize: 11, color: '#94a3b8' }}>
                {new Date(item.createdAt).toLocaleString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </View>
          <View
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 10,
              backgroundColor: color.muted,
              borderWidth: 1,
              borderColor: color.light,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '800', color: color.primary, letterSpacing: -0.5 }}>
              {isPositive ? '+' : ''}{item.points}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
        <Loader />
      </View>
    );
  }

  // Calculate stats
  const totalEarned = pointsHistory.filter(h => h.points > 0).reduce((sum, h) => sum + h.points, 0);
  const totalSpent = pointsHistory.filter(h => h.points < 0).reduce((sum, h) => sum + Math.abs(h.points), 0);
  const claimedCount = rewards.filter(r => r.claimed).length;
  const availableCount = rewards.filter(r => !r.claimed && userPoints >= r.pointsRequired).length;

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.violet.primary}
          />
        }
      >
        {/* Premium Header with Gradient */}
        <LinearGradient
          colors={COLORS.violet.gradient}
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
              <Ionicons name="gift" size={24} color="white" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 24, fontWeight: '800', color: '#ffffff', letterSpacing: -0.5 }}>
                Rewards & Achievements
              </Text>
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
                Redeem points and earn badges
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Stats Grid - Premium Cards */}
        <View style={{ paddingHorizontal: 20, marginTop: -20, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
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
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.06,
                shadowRadius: 12,
                elevation: 3,
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
                <Ionicons name="star" size={18} color={COLORS.violet.primary} />
              </View>
              <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.violet.primary, letterSpacing: -1 }}>
                {userPoints.toLocaleString()}
              </Text>
              <Text style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                Total Points
              </Text>
            </View>

            {/* Claimed Rewards */}
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
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.06,
                shadowRadius: 12,
                elevation: 3,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: COLORS.emerald.muted,
                  borderWidth: 1,
                  borderColor: COLORS.emerald.light,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                }}
              >
                <Ionicons name="gift" size={18} color={COLORS.emerald.primary} />
              </View>
              <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.emerald.primary, letterSpacing: -1 }}>
                {claimedCount}
              </Text>
              <Text style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                Claimed
              </Text>
            </View>

            {/* Badges Earned */}
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
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.06,
                shadowRadius: 12,
                elevation: 3,
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
                <Ionicons name="trophy" size={18} color={COLORS.amber.primary} />
              </View>
              <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.amber.primary, letterSpacing: -1 }}>
                {badges.length}
              </Text>
              <Text style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                Badges
              </Text>
            </View>

            {/* Available Rewards */}
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
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.06,
                shadowRadius: 12,
                elevation: 3,
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
                <Ionicons name="sparkles" size={18} color={COLORS.cyan.primary} />
              </View>
              <Text style={{ fontSize: 24, fontWeight: '800', color: COLORS.cyan.primary, letterSpacing: -1 }}>
                {availableCount}
              </Text>
              <Text style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                Available
              </Text>
            </View>
          </View>
        </View>

        {/* Badges Section - Premium */}
        {badges.length > 0 && (
          <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  backgroundColor: COLORS.amber.muted,
                  borderWidth: 1,
                  borderColor: COLORS.amber.light,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 10,
                }}
              >
                <Ionicons name="trophy" size={16} color={COLORS.amber.primary} />
              </View>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#1e293b', letterSpacing: -0.5 }}>
                Achievement Badges
              </Text>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {badges.map((badge) => (
                <View
                  key={badge.id}
                  style={{
                    width: '30%',
                    backgroundColor: '#ffffff',
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: COLORS.amber.light,
                    padding: 16,
                    alignItems: 'center',
                    shadowColor: '#0f172a',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.04,
                    shadowRadius: 8,
                    elevation: 2,
                  }}
                >
                  <View
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      backgroundColor: COLORS.amber.muted,
                      borderWidth: 1,
                      borderColor: COLORS.amber.light,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 8,
                    }}
                  >
                    <Text style={{ fontSize: 24 }}>{badge.emoji}</Text>
                  </View>
                  <Text style={{ fontSize: 11, color: '#1e293b', fontWeight: '700', textAlign: 'center' }}>
                    {badge.name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Available Rewards - Premium */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                backgroundColor: COLORS.violet.muted,
                borderWidth: 1,
                borderColor: COLORS.violet.light,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 10,
              }}
            >
              <Ionicons name="gift" size={16} color={COLORS.violet.primary} />
            </View>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#1e293b', letterSpacing: -0.5 }}>
              Available Rewards
            </Text>
            <View
              style={{
                marginLeft: 8,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 8,
                backgroundColor: COLORS.violet.muted,
                borderWidth: 1,
                borderColor: COLORS.violet.light,
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.violet.primary }}>
                {rewards.length}
              </Text>
            </View>
          </View>
          {rewards.length > 0 ? (
            <FlatList
              data={rewards}
              renderItem={renderRewardCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <View
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 24,
                borderWidth: 1,
                borderColor: '#f1f5f9',
                padding: 48,
                alignItems: 'center',
                shadowColor: '#0f172a',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: COLORS.violet.muted,
                  borderWidth: 1,
                  borderColor: COLORS.violet.light,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}
              >
                <Ionicons name="gift-outline" size={36} color={COLORS.violet.primary} />
              </View>
              <Text style={{ fontSize: 20, fontWeight: '800', color: '#1e293b', marginBottom: 8 }}>
                No Rewards Available
              </Text>
              <Text style={{ fontSize: 14, color: '#64748b', textAlign: 'center', lineHeight: 20 }}>
                Check back soon! New rewards are added regularly.
              </Text>
            </View>
          )}
        </View>

        {/* Points History - Premium */}
        {pointsHistory.length > 0 && (
          <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    backgroundColor: COLORS.indigo.muted,
                    borderWidth: 1,
                    borderColor: COLORS.indigo.light,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 10,
                  }}
                >
                  <Ionicons name="time" size={16} color={COLORS.indigo.primary} />
                </View>
                <Text style={{ fontSize: 18, fontWeight: '800', color: '#1e293b', letterSpacing: -0.5 }}>
                  Points History
                </Text>
              </View>
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 8,
                  backgroundColor: COLORS.indigo.muted,
                  borderWidth: 1,
                  borderColor: COLORS.indigo.light,
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.indigo.primary }}>
                  {pointsHistory.length}
                </Text>
              </View>
            </View>

            {/* Summary Stats - Premium */}
            <View
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 20,
                borderWidth: 1,
                borderColor: '#f1f5f9',
                padding: 16,
                marginBottom: 16,
                shadowColor: '#0f172a',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      backgroundColor: COLORS.emerald.muted,
                      borderWidth: 1,
                      borderColor: COLORS.emerald.light,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 8,
                    }}
                  >
                    <Ionicons name="arrow-up" size={16} color={COLORS.emerald.primary} />
                  </View>
                  <Text style={{ fontSize: 10, color: '#64748b', marginBottom: 4, fontWeight: '600' }}>
                    Earned
                  </Text>
                  <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.emerald.primary, letterSpacing: -0.5 }}>
                    +{totalEarned.toLocaleString()}
                  </Text>
                </View>
                <View style={{ width: 1, backgroundColor: '#e2e8f0' }} />
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      backgroundColor: COLORS.rose.muted,
                      borderWidth: 1,
                      borderColor: COLORS.rose.light,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 8,
                    }}
                  >
                    <Ionicons name="arrow-down" size={16} color={COLORS.rose.primary} />
                  </View>
                  <Text style={{ fontSize: 10, color: '#64748b', marginBottom: 4, fontWeight: '600' }}>
                    Spent
                  </Text>
                  <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.rose.primary, letterSpacing: -0.5 }}>
                    -{totalSpent.toLocaleString()}
                  </Text>
                </View>
                <View style={{ width: 1, backgroundColor: '#e2e8f0' }} />
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      backgroundColor: COLORS.amber.muted,
                      borderWidth: 1,
                      borderColor: COLORS.amber.light,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 8,
                    }}
                  >
                    <Ionicons name="calculator" size={16} color={COLORS.amber.primary} />
                  </View>
                  <Text style={{ fontSize: 10, color: '#64748b', marginBottom: 4, fontWeight: '600' }}>
                    Net
                  </Text>
                  <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.amber.primary, letterSpacing: -0.5 }}>
                    {(totalEarned - totalSpent).toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>

            {/* History List */}
            <FlatList
              data={pointsHistory.slice(0, 10)}
              renderItem={renderHistoryItem}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* Motivational Footer - Premium */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <LinearGradient
            colors={[COLORS.emerald.primary, COLORS.cyan.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 24,
              padding: 20,
              shadowColor: COLORS.emerald.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 16,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.3)',
                }}
              >
                <Ionicons name="sparkles" size={28} color="white" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#ffffff', marginBottom: 4, letterSpacing: -0.3 }}>
                  Keep Up The Great Work!
                </Text>
                <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.9)', lineHeight: 16 }}>
                  Continue maintaining excellent hand hygiene to earn more points and unlock rewards.
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  );
};

export default RewardsScreen;
