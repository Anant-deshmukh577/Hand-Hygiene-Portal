import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  RefreshControl,
  Alert,
  ActivityIndicator,
  TextInput,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { rewardService } from '../../services/rewardService';

const COLORS = {
  emerald: { primary: '#059669', light: '#ecfdf5', muted: 'rgba(5,150,105,0.08)', ring: '#a7f3d0', gradient: ['#059669', '#047857'] },
  indigo: { primary: '#6366f1', light: '#eef2ff', muted: 'rgba(99,102,241,0.08)', ring: '#c7d2fe', gradient: ['#6366f1', '#4f46e5'] },
  amber: { primary: '#f59e0b', light: '#fffbeb', muted: 'rgba(245,158,11,0.08)', ring: '#fde68a', gradient: ['#f59e0b', '#d97706'] },
  rose: { primary: '#f43f5e', light: '#fff1f2', muted: 'rgba(244,63,94,0.08)', ring: '#fecdd3', gradient: ['#f43f5e', '#e11d48'] },
  violet: { primary: '#8b5cf6', light: '#f5f3ff', muted: 'rgba(139,92,246,0.08)', ring: '#ddd6fe', gradient: ['#8b5cf6', '#7c3aed'] },
  cyan: { primary: '#06b6d4', light: '#ecfeff', muted: 'rgba(6,182,212,0.08)', ring: '#a5f3fc', gradient: ['#06b6d4', '#0891b2'] },
};

const ManageRewardsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [rewards, setRewards] = useState([]);
  const [pendingRewards, setPendingRewards] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedUserReward, setSelectedUserReward] = useState(null);
  const [approvalType, setApprovalType] = useState('');
  const [approvalNotes, setApprovalNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  const [newReward, setNewReward] = useState({
    title: '',
    description: '',
    pointsRequired: '',
    icon: '🎁',
  });
  const [formErrors, setFormErrors] = useState({});

  const emojiOptions = [
    '🎁', '🎀', '🎉', '🎊', '🎈', '🎆', '🎇', '✨', '💝', '🎗️',
    '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '👑', '💎', '💍', '📜',
    '⭐', '🌟', '💫', '✨', '🌠', '⚡', '🔥', '💥', '🎯', '🎪',
    '☕', '🍕', '🍔', '🍟', '🍿', '🍩', '🍪', '🍰', '🧁', '🍦',
    '🥤', '🧃', '🍹', '🥗', '🍱', '🍜', '🍝', '🍛', '🍲', '🥘',
    '💰', '💵', '💴', '💶', '💷', '💳', '🪙', '💸', '🤑', '💲',
    '🎮', '🎲', '🎰', '🎳', '🎯', '🎪', '🎭', '🎬', '🎤', '🎧',
    '🎸', '🎹', '🎺', '🎻', '🥁', '🎨', '🖼️', '📚', '📖', '✏️',
    '✈️', '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒',
    '🚐', '🚛', '🚜', '🏍️', '🛵', '🚲', '🛴', '🛹', '🚁', '🛩️',
    '⛵', '🚤', '⛴️', '🛳️', '🚢', '🏖️', '🏝️', '🏔️', '⛰️', '🏕️',
    '⌚', '📱', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '📷', '📹', '🎥',
    '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '⏰', '⏱️', '⏲️',
    '🌸', '🌺', '🌻', '🌷', '🌹', '🥀', '🌼', '🌱', '🌿', '🍀',
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯',
    '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆',
    '❤️', '💛', '💚', '💙', '💜', '🧡', '🖤', '🤍', '🤎', '💕',
    '💖', '💗', '💓', '💞', '💝', '❣️', '💟', '☮️', '✝️', '☪️',
    '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈',
    '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓',
  ];

  useEffect(() => {
    loadRewards();
    loadPendingRewards();
  }, []);

  const loadRewards = async () => {
    try {
      setLoading(true);
      const response = await rewardService.getRewards();
      setRewards(response.rewards || []);
    } catch (error) {
      console.error('Error loading rewards:', error);
      Alert.alert('Error', 'Failed to load rewards');
    } finally {
      setLoading(false);
    }
  };

  const loadPendingRewards = async () => {
    try {
      const response = await rewardService.getPendingRewards();
      setPendingRewards(response.rewards || []);
    } catch (error) {
      console.error('Error loading pending rewards:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadRewards(), loadPendingRewards()]);
    setRefreshing(false);
  };

  const handleAddReward = async () => {
    const errors = {};
    if (!newReward.title.trim()) errors.title = 'Title required';
    if (!newReward.pointsRequired || parseInt(newReward.pointsRequired) <= 0) {
      errors.pointsRequired = 'Valid points required';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await rewardService.createReward({
        ...newReward,
        pointsRequired: parseInt(newReward.pointsRequired),
      });
      setRewards([response.reward, ...rewards]);
      setShowAddModal(false);
      setNewReward({
        title: '',
        description: '',
        pointsRequired: '',
        icon: '🎁',
      });
      setFormErrors({});
      Alert.alert('Success', 'Reward added successfully');
    } catch (error) {
      console.error('Error adding reward:', error);
      Alert.alert('Error', error.message || 'Failed to add reward');
    }
  };

  const handleUpdateReward = async () => {
    if (!selectedReward) return;

    const errors = {};
    if (!selectedReward.title.trim()) errors.title = 'Title required';
    if (!selectedReward.pointsRequired || parseInt(selectedReward.pointsRequired) <= 0) {
      errors.pointsRequired = 'Valid points required';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const response = await rewardService.updateReward(selectedReward._id, {
        title: selectedReward.title,
        description: selectedReward.description,
        pointsRequired: parseInt(selectedReward.pointsRequired),
        icon: selectedReward.icon,
      });
      setRewards(rewards.map(r => r._id === selectedReward._id ? response.reward : r));
      setShowEditModal(false);
      setSelectedReward(null);
      setFormErrors({});
      Alert.alert('Success', 'Reward updated successfully');
    } catch (error) {
      console.error('Error updating reward:', error);
      Alert.alert('Error', 'Failed to update reward');
    }
  };

  const handleDelete = async (rewardId) => {
    const reward = rewards.find(r => r._id === rewardId);

    Alert.alert(
      'Delete Reward',
      `Are you sure you want to delete "${reward.title}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await rewardService.deleteReward(rewardId);
              setRewards(rewards.filter(r => r._id !== rewardId));
              Alert.alert('Success', 'Reward deleted successfully');
            } catch (error) {
              console.error('Error deleting reward:', error);
              Alert.alert('Error', error.message || 'Failed to delete reward');
            }
          },
        },
      ]
    );
  };

  const handleOpenApprovalModal = (userReward, type) => {
    setSelectedUserReward(userReward);
    setApprovalType(type);
    setApprovalNotes('');
    setShowApprovalModal(true);
  };

  const handleCloseApprovalModal = () => {
    setShowApprovalModal(false);
    setSelectedUserReward(null);
    setApprovalNotes('');
    setApprovalType('');
  };

  const handleConfirmApproval = async () => {
    if (!selectedUserReward) return;

    if (approvalType === 'reject' && !approvalNotes.trim()) {
      Alert.alert('Error', 'Please provide a reason for rejection');
      return;
    }

    setProcessing(true);
    try {
      if (approvalType === 'approve') {
        await rewardService.approveReward(selectedUserReward._id, approvalNotes);
        Alert.alert('Success', 'Reward approved successfully! Reward code generated.');
      } else {
        const response = await rewardService.rejectReward(selectedUserReward._id, approvalNotes);
        Alert.alert('Success', `Reward rejected. ${response.refundedPoints} points refunded to user.`);
      }
      await loadPendingRewards();
      handleCloseApprovalModal();
    } catch (error) {
      console.error('Error processing reward:', error);
      Alert.alert('Error', error.message || 'Failed to process reward');
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const stats = {
    total: rewards.length,
    active: rewards.filter(r => r.isActive !== false).length,
    totalClaims: rewards.reduce((sum, r) => sum + (r.claimedCount || 0), 0),
    pending: pendingRewards.length,
  };

  const getTierColor = (points) => {
    if (points >= 500) return { ...COLORS.violet, label: 'Legendary', icon: 'trophy' };
    if (points >= 300) return { ...COLORS.amber, label: 'Epic', icon: 'star' };
    if (points >= 150) return { ...COLORS.indigo, label: 'Rare', icon: 'diamond' };
    return { ...COLORS.cyan, label: 'Common', icon: 'gift' };
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
          Loading Rewards...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.amber.primary} />
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
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
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
                  Manage Rewards
                </Text>
                <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
                  Set up rewards and incentives
                </Text>
              </View>
            </View>
            <Pressable
              onPress={() => setShowAddModal(true)}
              className="active:scale-95"
            >
              <View
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.3)',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Ionicons name="add-circle" size={16} color="white" />
                <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 12 }}>
                  Add
                </Text>
              </View>
            </Pressable>
          </View>
        </LinearGradient>

        {/* Stats - Premium Cards */}
        <View style={{ paddingHorizontal: 20, marginTop: -20, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {[
              { label: 'Pending', value: stats.pending, icon: 'time', color: COLORS.amber },
              { label: 'Total Rewards', value: stats.total, icon: 'gift', color: COLORS.cyan },
              { label: 'Active', value: stats.active, icon: 'checkmark-circle', color: COLORS.emerald },
              { label: 'Total Claims', value: stats.totalClaims, icon: 'people', color: COLORS.violet },
            ].map((stat, index) => (
              <View
                key={index}
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
                    backgroundColor: stat.color.muted,
                    borderWidth: 1,
                    borderColor: stat.color.light,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 10,
                  }}
                >
                  <Ionicons name={stat.icon} size={18} color={stat.color.primary} />
                </View>
                <Text style={{ fontSize: 24, fontWeight: '800', color: stat.color.primary, letterSpacing: -1 }}>
                  {stat.value}
                </Text>
                <Text style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tab Selector */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', backgroundColor: '#f8fafc', borderRadius: 16, padding: 4, gap: 4 }}>
            <Pressable
              onPress={() => setActiveTab('pending')}
              className="active:scale-98"
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: activeTab === 'pending' ? '#ffffff' : 'transparent',
                shadowColor: activeTab === 'pending' ? '#0f172a' : 'transparent',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: activeTab === 'pending' ? 0.08 : 0,
                shadowRadius: 8,
                elevation: activeTab === 'pending' ? 2 : 0,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Ionicons
                  name="time"
                  size={16}
                  color={activeTab === 'pending' ? COLORS.amber.primary : '#64748b'}
                />
                <Text style={{
                  fontSize: 13,
                  fontWeight: '700',
                  color: activeTab === 'pending' ? COLORS.amber.primary : '#64748b'
                }}>
                  Pending
                </Text>
                {pendingRewards.length > 0 && (
                  <View style={{
                    backgroundColor: activeTab === 'pending' ? COLORS.amber.primary : '#94a3b8',
                    borderRadius: 9999,
                    minWidth: 20,
                    height: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 6,
                  }}>
                    <Text style={{ fontSize: 11, fontWeight: '800', color: '#ffffff' }}>
                      {pendingRewards.length}
                    </Text>
                  </View>
                )}
              </View>
            </Pressable>
            <Pressable
              onPress={() => setActiveTab('catalog')}
              className="active:scale-98"
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor: activeTab === 'catalog' ? '#ffffff' : 'transparent',
                shadowColor: activeTab === 'catalog' ? '#0f172a' : 'transparent',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: activeTab === 'catalog' ? 0.08 : 0,
                shadowRadius: 8,
                elevation: activeTab === 'catalog' ? 2 : 0,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Ionicons
                  name="grid"
                  size={16}
                  color={activeTab === 'catalog' ? COLORS.cyan.primary : '#64748b'}
                />
                <Text style={{
                  fontSize: 13,
                  fontWeight: '700',
                  color: activeTab === 'catalog' ? COLORS.cyan.primary : '#64748b'
                }}>
                  Catalog
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* Content based on active tab */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 24 }}>
          {activeTab === 'pending' ? (
            // Pending Rewards Tab
            pendingRewards.length === 0 ? (
              <View
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: '#f1f5f9',
                  padding: 32,
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: COLORS.emerald.muted,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  <Ionicons name="checkmark-circle" size={40} color={COLORS.emerald.primary} />
                </View>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#1e293b', marginBottom: 8 }}>
                  All Caught Up!
                </Text>
                <Text style={{ fontSize: 13, color: '#64748b', textAlign: 'center' }}>
                  No pending reward approvals at the moment.
                </Text>
              </View>
            ) : (
              pendingRewards.map((userReward) => (
                <View
                  key={userReward._id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: '#f1f5f9',
                    marginBottom: 16,
                    overflow: 'hidden',
                    shadowColor: '#0f172a',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.04,
                    shadowRadius: 8,
                    elevation: 2,
                  }}
                >
                  {/* Amber indicator bar */}
                  <LinearGradient
                    colors={COLORS.amber.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ height: 4 }}
                  />

                  <View style={{ padding: 16 }}>
                    {/* Reward Header */}
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14, gap: 12 }}>
                      <View
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 16,
                          backgroundColor: COLORS.amber.muted,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text style={{ fontSize: 32 }}>{userReward.reward?.icon || '🎁'}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 16, fontWeight: '800', color: '#1e293b', marginBottom: 4 }}>
                          {userReward.reward?.title || 'Reward'}
                        </Text>
                        <View
                          style={{
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            borderRadius: 9999,
                            backgroundColor: COLORS.amber.muted,
                            borderWidth: 1,
                            borderColor: COLORS.amber.light,
                            alignSelf: 'flex-start',
                          }}
                        >
                          <Text style={{ fontSize: 10, fontWeight: '700', color: COLORS.amber.primary }}>
                            PENDING APPROVAL
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* User Details */}
                    <View style={{ backgroundColor: '#f8fafc', borderRadius: 12, padding: 12, marginBottom: 14 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 }}>
                        <Ionicons name="person" size={16} color={COLORS.indigo.primary} />
                        <Text style={{ fontSize: 14, fontWeight: '700', color: '#1e293b' }}>
                          {userReward.user?.name || 'Unknown'}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 8 }}>
                        <Ionicons name="mail" size={16} color='#64748b' />
                        <Text style={{ fontSize: 12, color: '#64748b' }}>
                          {userReward.user?.email || 'N/A'}
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Ionicons name="business" size={16} color='#64748b' />
                        <Text style={{ fontSize: 12, color: '#64748b' }}>
                          {userReward.user?.department || 'N/A'}
                        </Text>
                      </View>
                    </View>

                    {/* Points and Date */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 }}>
                      <View>
                        <Text style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Points Spent</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <Ionicons name="star" size={16} color={COLORS.amber.primary} />
                          <Text style={{ fontSize: 18, fontWeight: '800', color: COLORS.amber.primary }}>
                            {userReward.pointsSpent}
                          </Text>
                        </View>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>Claimed On</Text>
                        <Text style={{ fontSize: 12, fontWeight: '600', color: '#1e293b' }}>
                          {formatDate(userReward.claimedAt)}
                        </Text>
                      </View>
                    </View>

                    {/* Action Buttons */}
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                      <Pressable
                        onPress={() => handleOpenApprovalModal(userReward, 'approve')}
                        className="active:opacity-70"
                        style={{
                          flex: 1,
                          backgroundColor: COLORS.emerald.primary,
                          paddingVertical: 12,
                          borderRadius: 12,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                        }}
                      >
                        <Ionicons name="checkmark-circle" size={18} color="white" />
                        <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 14 }}>
                          Approve
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => handleOpenApprovalModal(userReward, 'reject')}
                        className="active:opacity-70"
                        style={{
                          flex: 1,
                          backgroundColor: '#ffffff',
                          borderWidth: 2,
                          borderColor: COLORS.rose.primary,
                          paddingVertical: 12,
                          borderRadius: 12,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                        }}
                      >
                        <Ionicons name="close-circle" size={18} color={COLORS.rose.primary} />
                        <Text style={{ color: COLORS.rose.primary, fontWeight: '700', fontSize: 14 }}>
                          Reject
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
              ))
            )
          ) : (
            // Rewards Catalog Tab
            rewards.length === 0 ? (
              <View
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: '#f1f5f9',
                  padding: 32,
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: COLORS.amber.muted,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  <Ionicons name="gift" size={40} color={COLORS.amber.primary} />
                </View>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#1e293b', marginBottom: 8 }}>
                  No rewards available
                </Text>
                <Text style={{ fontSize: 13, color: '#64748b', textAlign: 'center', marginBottom: 20 }}>
                  Create your first reward to motivate staff members
                </Text>
                <Pressable
                  onPress={() => setShowAddModal(true)}
                  className="active:scale-95"
                >
                  <LinearGradient
                    colors={COLORS.amber.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      borderRadius: 14,
                      paddingHorizontal: 24,
                      paddingVertical: 12,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <Ionicons name="add-circle" size={18} color="white" />
                    <Text style={{ color: '#ffffff', fontWeight: '700', fontSize: 14 }}>
                      Create First Reward
                    </Text>
                  </LinearGradient>
                </Pressable>
              </View>
            ) : (
              rewards.map((reward) => {
                const tier = getTierColor(reward.pointsRequired);
                return (
                  <View
                    key={reward._id}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: '#f1f5f9',
                      marginBottom: 16,
                      overflow: 'hidden',
                      shadowColor: '#0f172a',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.04,
                      shadowRadius: 8,
                      elevation: 2,
                    }}
                  >
                    {/* Color Bar */}
                    <LinearGradient
                      colors={tier.gradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={{ height: 4 }}
                    />

                    {/* Reward Content */}
                    <View style={{ padding: 16 }}>
                      {/* Header with Icon */}
                      <View style={{ alignItems: 'center', marginBottom: 14 }}>
                        <LinearGradient
                          colors={tier.gradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={{
                            width: 80,
                            height: 80,
                            borderRadius: 20,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 12,
                          }}
                        >
                          <Text style={{ fontSize: 48 }}>{reward.icon || '🎁'}</Text>
                        </LinearGradient>
                        <Text style={{ fontSize: 18, fontWeight: '800', color: '#1e293b', textAlign: 'center', marginBottom: 6 }}>
                          {reward.title}
                        </Text>
                        {reward.description && (
                          <Text style={{ fontSize: 13, color: '#64748b', textAlign: 'center', lineHeight: 18 }} numberOfLines={2}>
                            {reward.description}
                          </Text>
                        )}
                      </View>

                      {/* Points Badge */}
                      <View style={{ alignItems: 'center', marginBottom: 14 }}>
                        <View
                          style={{
                            paddingHorizontal: 16,
                            paddingVertical: 10,
                            borderRadius: 14,
                            backgroundColor: tier.muted,
                            borderWidth: 1,
                            borderColor: tier.light,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 6,
                          }}
                        >
                          <Ionicons name="star" size={18} color={tier.primary} />
                          <Text style={{ fontSize: 18, fontWeight: '800', color: tier.primary }}>
                            {reward.pointsRequired} points
                          </Text>
                        </View>
                      </View>

                      {/* Tier & Stats Row */}
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, paddingHorizontal: 8 }}>
                        <View
                          style={{
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 9999,
                            backgroundColor: tier.muted,
                            borderWidth: 1,
                            borderColor: tier.light,
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <Ionicons name={tier.icon} size={12} color={tier.primary} />
                          <Text style={{ fontSize: 11, fontWeight: '700', color: tier.primary, letterSpacing: 0.5 }}>
                            {tier.label.toUpperCase()}
                          </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <Ionicons name="people" size={14} color="#64748b" />
                          <Text style={{ fontSize: 12, color: '#64748b', fontWeight: '600' }}>
                            {reward.claimedCount || 0} claims
                          </Text>
                        </View>
                      </View>

                      {/* Status Badge */}
                      <View style={{ alignItems: 'center', marginBottom: 14 }}>
                        <View
                          style={{
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                            borderRadius: 9999,
                            backgroundColor: reward.isActive !== false ? COLORS.emerald.muted : '#f1f5f9',
                            borderWidth: 1,
                            borderColor: reward.isActive !== false ? COLORS.emerald.light : '#e2e8f0',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <Ionicons
                            name={reward.isActive !== false ? 'checkmark-circle' : 'close-circle'}
                            size={12}
                            color={reward.isActive !== false ? COLORS.emerald.primary : '#64748b'}
                          />
                          <Text
                            style={{
                              fontSize: 11,
                              fontWeight: '700',
                              color: reward.isActive !== false ? COLORS.emerald.primary : '#64748b',
                              letterSpacing: 0.5,
                            }}
                          >
                            {reward.isActive !== false ? 'ACTIVE' : 'INACTIVE'}
                          </Text>
                        </View>
                      </View>

                      {/* Actions */}
                      <View style={{ flexDirection: 'row', gap: 10 }}>
                        <Pressable
                          onPress={() => {
                            setSelectedReward(reward);
                            setShowEditModal(true);
                          }}
                          className="active:opacity-70"
                          style={{
                            flex: 1,
                            backgroundColor: COLORS.indigo.muted,
                            borderWidth: 1,
                            borderColor: COLORS.indigo.light,
                            paddingVertical: 10,
                            borderRadius: 12,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                          }}
                        >
                          <Ionicons name="create" size={16} color={COLORS.indigo.primary} />
                          <Text style={{ color: COLORS.indigo.primary, fontWeight: '700', fontSize: 13 }}>
                            Edit
                          </Text>
                        </Pressable>
                        <Pressable
                          onPress={() => handleDelete(reward._id)}
                          className="active:opacity-70"
                          style={{
                            backgroundColor: COLORS.rose.muted,
                            borderWidth: 1,
                            borderColor: COLORS.rose.light,
                            paddingHorizontal: 14,
                            paddingVertical: 10,
                            borderRadius: 12,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Ionicons name="trash-outline" size={16} color={COLORS.rose.primary} />
                        </Pressable>
                      </View>
                    </View>
                  </View>
                );
              })
            )
          )}
        </View>
      </ScrollView>

      {/* Add Reward Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 max-h-[90%]">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-gray-900">Add New Reward</Text>
              <Pressable onPress={() => setShowAddModal(false)} className="active:opacity-70">
                <Text className="text-gray-500 text-2xl">×</Text>
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Icon Selection */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Choose Icon</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={{ marginHorizontal: -6 }}
                  contentContainerStyle={{ paddingHorizontal: 6 }}
                >
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: emojiOptions.length / 3 * 56, gap: 8 }}>
                    {emojiOptions.map((emoji, index) => (
                      <Pressable
                        key={`emoji-add-${index}`}
                        onPress={() => setNewReward({ ...newReward, icon: emoji })}
                        className="active:scale-95"
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 12,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderWidth: 2,
                          borderColor: newReward.icon === emoji ? COLORS.amber.primary : '#e2e8f0',
                          backgroundColor: newReward.icon === emoji ? COLORS.amber.light : '#ffffff',
                        }}
                      >
                        <Text className="text-2xl">{emoji}</Text>
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
                <Text className="text-xs text-gray-500 mt-2 text-center">← Swipe to see more emojis →</Text>
              </View>

              {/* Title */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Reward Title *</Text>
                <TextInput
                  placeholder="e.g., Coffee Voucher"
                  value={newReward.title}
                  onChangeText={(text) => setNewReward({ ...newReward, title: text })}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                />
                {formErrors.title && (
                  <Text className="text-red-600 text-xs mt-1">{formErrors.title}</Text>
                )}
              </View>

              {/* Description */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Description</Text>
                <TextInput
                  placeholder="Describe the reward..."
                  value={newReward.description}
                  onChangeText={(text) => setNewReward({ ...newReward, description: text })}
                  multiline
                  numberOfLines={3}
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                  style={{ textAlignVertical: 'top' }}
                />
              </View>

              {/* Points Required */}
              <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-700 mb-2">Points Required *</Text>
                <TextInput
                  placeholder="e.g., 100"
                  value={newReward.pointsRequired}
                  onChangeText={(text) => setNewReward({ ...newReward, pointsRequired: text })}
                  keyboardType="number-pad"
                  className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                />
                {formErrors.pointsRequired && (
                  <Text className="text-red-600 text-xs mt-1">{formErrors.pointsRequired}</Text>
                )}
              </View>

              {/* Preview */}
              <View className="p-4 bg-gray-50 rounded-xl border border-gray-200 mb-6">
                <Text className="text-xs font-semibold text-gray-500 mb-3">PREVIEW</Text>
                <View className="items-center">
                  <View className="w-16 h-16 rounded-2xl bg-amber-50 items-center justify-center mb-2">
                    <Text className="text-4xl">{newReward.icon}</Text>
                  </View>
                  <Text className="font-bold text-gray-900 mb-1">
                    {newReward.title || 'Reward Title'}
                  </Text>
                  <Text className="text-sm text-gray-500 text-center mb-2">
                    {newReward.description || 'Reward description'}
                  </Text>
                  <Text className="text-amber-600 font-bold">
                    {newReward.pointsRequired || '0'} points
                  </Text>
                </View>
              </View>

              {/* Buttons */}
              <View className="flex-row gap-3">
                <Pressable
                  onPress={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-100 py-3 rounded-lg active:opacity-70"
                >
                  <Text className="text-gray-700 font-semibold text-center">Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={handleAddReward}
                  className="flex-1 bg-amber-600 py-3 rounded-lg active:opacity-70"
                >
                  <Text className="text-white font-semibold text-center">Add Reward</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Edit Reward Modal */}
      {selectedReward && (
        <Modal
          visible={showEditModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowEditModal(false)}
        >
          <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-white rounded-t-3xl p-6 max-h-[90%]">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-xl font-bold text-gray-900">Edit Reward</Text>
                <Pressable onPress={() => setShowEditModal(false)} className="active:opacity-70">
                  <Text className="text-gray-500 text-2xl">×</Text>
                </Pressable>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Icon Selection */}
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">Choose Icon</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ marginHorizontal: -6 }}
                    contentContainerStyle={{ paddingHorizontal: 6 }}
                  >
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: emojiOptions.length / 3 * 56, gap: 8 }}>
                      {emojiOptions.map((emoji, index) => (
                        <Pressable
                          key={`emoji-edit-${index}`}
                          onPress={() => setSelectedReward({ ...selectedReward, icon: emoji })}
                          className="active:scale-95"
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 2,
                            borderColor: selectedReward.icon === emoji ? COLORS.amber.primary : '#e2e8f0',
                            backgroundColor: selectedReward.icon === emoji ? COLORS.amber.light : '#ffffff',
                          }}
                        >
                          <Text className="text-2xl">{emoji}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </ScrollView>
                  <Text className="text-xs text-gray-500 mt-2 text-center">← Swipe to see more emojis →</Text>
                </View>

                {/* Title */}
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">Reward Title *</Text>
                  <TextInput
                    placeholder="e.g., Coffee Voucher"
                    value={selectedReward.title}
                    onChangeText={(text) => setSelectedReward({ ...selectedReward, title: text })}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                  />
                  {formErrors.title && (
                    <Text className="text-red-600 text-xs mt-1">{formErrors.title}</Text>
                  )}
                </View>

                {/* Description */}
                <View className="mb-4">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">Description</Text>
                  <TextInput
                    placeholder="Describe the reward..."
                    value={selectedReward.description || ''}
                    onChangeText={(text) => setSelectedReward({ ...selectedReward, description: text })}
                    multiline
                    numberOfLines={3}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                    style={{ textAlignVertical: 'top' }}
                  />
                </View>

                {/* Points Required */}
                <View className="mb-6">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">Points Required *</Text>
                  <TextInput
                    placeholder="e.g., 100"
                    value={String(selectedReward.pointsRequired)}
                    onChangeText={(text) => setSelectedReward({ ...selectedReward, pointsRequired: text })}
                    keyboardType="number-pad"
                    className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                  />
                  {formErrors.pointsRequired && (
                    <Text className="text-red-600 text-xs mt-1">{formErrors.pointsRequired}</Text>
                  )}
                </View>

                {/* Buttons */}
                <View className="flex-row gap-3">
                  <Pressable
                    onPress={() => setShowEditModal(false)}
                    className="flex-1 bg-gray-100 py-3 rounded-lg active:opacity-70"
                  >
                    <Text className="text-gray-700 font-semibold text-center">Cancel</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleUpdateReward}
                    className="flex-1 bg-amber-600 py-3 rounded-lg active:opacity-70"
                  >
                    <Text className="text-white font-semibold text-center">Update Reward</Text>
                  </Pressable>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      {/* Approval Modal */}
      {showApprovalModal && selectedUserReward && (
        <Modal
          visible={showApprovalModal}
          animationType="slide"
          transparent={true}
          onRequestClose={handleCloseApprovalModal}
        >
          <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-white rounded-t-3xl p-6 max-h-[85%]">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-xl font-bold text-gray-900">
                  {approvalType === 'approve' ? 'Approve Reward' : 'Reject Reward'}
                </Text>
                <Pressable onPress={handleCloseApprovalModal} className="active:opacity-70">
                  <Text className="text-gray-500 text-2xl">×</Text>
                </Pressable>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Status Card */}
                <View
                  style={{
                    padding: 16,
                    borderRadius: 16,
                    backgroundColor: approvalType === 'approve' ? COLORS.emerald.muted : COLORS.rose.muted,
                    borderWidth: 1,
                    borderColor: approvalType === 'approve' ? COLORS.emerald.light : COLORS.rose.light,
                    marginBottom: 16,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        backgroundColor: approvalType === 'approve' ? COLORS.emerald.light : COLORS.rose.light,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Ionicons
                        name={approvalType === 'approve' ? 'checkmark-circle' : 'close-circle'}
                        size={24}
                        color={approvalType === 'approve' ? COLORS.emerald.primary : COLORS.rose.primary}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: '#1e293b', marginBottom: 4 }}>
                        {approvalType === 'approve' ? 'Approving Reward' : 'Rejecting Reward'}
                      </Text>
                      <Text style={{ fontSize: 14, fontWeight: '600', color: '#1e293b', marginBottom: 2 }}>
                        {selectedUserReward.user?.name}
                      </Text>
                      <Text style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>
                        {selectedUserReward.reward?.title}
                      </Text>
                      <View
                        style={{
                          paddingHorizontal: 10,
                          paddingVertical: 6,
                          borderRadius: 8,
                          backgroundColor: approvalType === 'approve' ? COLORS.emerald.light : COLORS.rose.light,
                          alignSelf: 'flex-start',
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <Ionicons name="star" size={14} color={approvalType === 'approve' ? COLORS.emerald.primary : COLORS.rose.primary} />
                        <Text
                          style={{
                            fontSize: 13,
                            fontWeight: '700',
                            color: approvalType === 'approve' ? COLORS.emerald.primary : COLORS.rose.primary,
                          }}
                        >
                          {selectedUserReward.pointsSpent} points
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Refund Warning (for rejection) */}
                {approvalType === 'reject' && (
                  <View
                    style={{
                      padding: 14,
                      backgroundColor: COLORS.amber.muted,
                      borderWidth: 1,
                      borderColor: COLORS.amber.light,
                      borderRadius: 12,
                      marginBottom: 16,
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      gap: 10,
                    }}
                  >
                    <View
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        backgroundColor: COLORS.amber.light,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Ionicons name="arrow-undo" size={16} color={COLORS.amber.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: '#1e293b', marginBottom: 2 }}>
                        Points Will Be Refunded
                      </Text>
                      <Text style={{ fontSize: 12, color: '#64748b' }}>
                        {selectedUserReward.pointsSpent} points will be returned to the user's account.
                      </Text>
                    </View>
                  </View>
                )}

                {/* Notes Input */}
                <View className="mb-6">
                  <Text className="text-sm font-semibold text-gray-700 mb-2">
                    Notes {approvalType === 'reject' ? <Text className="text-red-600">*</Text> : <Text className="text-gray-400">(Optional)</Text>}
                  </Text>
                  <TextInput
                    placeholder={`Enter ${approvalType === 'approve' ? 'approval' : 'rejection'} notes...`}
                    value={approvalNotes}
                    onChangeText={setApprovalNotes}
                    multiline
                    numberOfLines={3}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3"
                    style={{ textAlignVertical: 'top' }}
                  />
                  {approvalType === 'reject' && !approvalNotes.trim() && (
                    <Text className="text-red-600 text-xs mt-2">
                      Please provide a reason for rejection
                    </Text>
                  )}
                </View>

                {/* Action Buttons */}
                <View className="flex-row gap-3">
                  <Pressable
                    onPress={handleCloseApprovalModal}
                    disabled={processing}
                    className="flex-1 bg-gray-100 py-3 rounded-lg active:opacity-70"
                  >
                    <Text className="text-gray-700 font-semibold text-center">Cancel</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleConfirmApproval}
                    disabled={processing || (approvalType === 'reject' && !approvalNotes.trim())}
                    className={`flex-1 py-3 rounded-lg active:opacity-70 ${
                      approvalType === 'approve' ? 'bg-green-600' : 'bg-red-600'
                    }`}
                    style={{
                      opacity: processing || (approvalType === 'reject' && !approvalNotes.trim()) ? 0.5 : 1,
                    }}
                  >
                    <Text className="text-white font-semibold text-center">
                      {processing ? 'Processing...' : `Confirm ${approvalType === 'approve' ? 'Approval' : 'Rejection'}`}
                    </Text>
                  </Pressable>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default ManageRewardsScreen;