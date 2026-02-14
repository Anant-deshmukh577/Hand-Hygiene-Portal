import { useState, useEffect, useCallback } from 'react';
import { useNotification } from '../../context/NotificationContext';
import { rewardService } from '../../services/rewardService';
import RewardManagement from '../../components/admin/RewardManagement';
import PendingRewardsApproval from '../../components/admin/PendingRewardsApproval';
import Loader, { PageLoader } from '../../components/common/Loader';
import Badge from '../../components/common/Badge';

/* --- SVG Icons --- */
const GiftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const CatalogIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const RefreshIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ManageRewards = () => {
  const { showSuccess, showError } = useNotification();
  const [rewards, setRewards] = useState([]);
  const [pendingRewards, setPendingRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');

  const fetchRewards = useCallback(async () => {
    try {
      const response = await rewardService.getAvailableRewards();
      const fetchedRewards = (response.rewards || []).map(reward => ({
        id: reward._id,
        title: reward.title,
        description: reward.description,
        pointsRequired: reward.pointsRequired,
        icon: reward.icon || '🎁',
        claimedCount: reward.claimedCount || 0,
      }));
      setRewards(fetchedRewards);
    } catch (error) {
      showError(error.message || 'Failed to load rewards');
    }
  }, [showError]);

  const fetchPendingRewards = useCallback(async () => {
    try {
      const response = await rewardService.getPendingRewards();
      setPendingRewards(response.rewards || []);
    } catch (error) {
      showError(error.message || 'Failed to load pending rewards');
    }
  }, [showError]);

  const loadData = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    await Promise.all([fetchRewards(), fetchPendingRewards()]);
    setLoading(false);
    setRefreshing(false);
  }, [fetchRewards, fetchPendingRewards]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = () => {
    if (!refreshing) {
      loadData(true);
    }
  };

  const handleApprove = async (userRewardId, notes) => {
    try {
      await rewardService.approveReward(userRewardId, notes);
      showSuccess('Reward approved successfully! Reward code generated.');
      await fetchPendingRewards();
    } catch (error) {
      showError(error.message || 'Failed to approve reward');
      throw error;
    }
  };

  const handleReject = async (userRewardId, notes) => {
    try {
      const response = await rewardService.rejectReward(userRewardId, notes);
      showSuccess(`Reward rejected. ${response.refundedPoints} points refunded to user.`);
      await fetchPendingRewards();
    } catch (error) {
      showError(error.message || 'Failed to reject reward');
      throw error;
    }
  };

  const handleAdd = async (newReward) => {
    try {
      const response = await rewardService.createReward({
        title: newReward.title,
        description: newReward.description,
        pointsRequired: parseInt(newReward.pointsRequired),
        icon: newReward.icon || '🎁',
      });
      
      const createdReward = response.reward;
      setRewards([...rewards, {
        id: createdReward._id,
        title: createdReward.title,
        description: createdReward.description,
        pointsRequired: createdReward.pointsRequired,
        icon: createdReward.icon || '🎁',
        claimedCount: 0,
      }]);
      showSuccess('Reward added successfully');
    } catch (error) {
      showError(error.message || 'Failed to add reward');
    }
  };

  const handleEdit = async (reward) => {
    try {
      await rewardService.updateReward(reward.id, {
        title: reward.title,
        description: reward.description,
        pointsRequired: reward.pointsRequired,
        icon: reward.icon,
      });
      setRewards(rewards.map(r => r.id === reward.id ? reward : r));
      showSuccess('Reward updated successfully');
    } catch (error) {
      showError(error.message || 'Failed to update reward');
    }
  };

  const handleDelete = async (rewardId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this reward?');
    if (confirmDelete) {
      try {
        await rewardService.deleteReward(rewardId);
        setRewards(rewards.filter(r => r.id !== rewardId));
        showSuccess('Reward deleted successfully');
      } catch (error) {
        showError(error.message || 'Failed to delete reward');
      }
    }
  };

  // Tab configuration
  const tabs = [
    {
      id: 'pending',
      label: 'Pending Approvals',
      icon: <BellIcon />,
      count: pendingRewards.length,
      color: 'amber',
    },
    {
      id: 'catalog',
      label: 'Rewards Catalog',
      icon: <CatalogIcon />,
      count: rewards.length,
      color: 'teal',
    },
  ];

  if (loading) {
    return <PageLoader text="Loading rewards management..." />;
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
                <GiftIcon />
              </div>
              
              {/* Title */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Manage Rewards
                  </h1>
                  <SparklesIcon className="h-6 w-6 text-amber-500" />
                </div>
                <p className="text-gray-500">
                  Approve pending rewards and manage the catalog
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
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

              {/* Add Reward Button (only show on catalog tab) */}
              {activeTab === 'catalog' && (
                <button
                  onClick={() => {/* Handled by RewardManagement component */}}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-xl shadow-lg shadow-amber-600/25 hover:shadow-xl hover:shadow-amber-600/30 transition-all duration-200"
                >
                  <PlusIcon />
                  <span className="hidden sm:inline">Add Reward</span>
                </button>
              )}

              {/* Admin Badge */}
              <Badge variant="primary" size="medium">
                Admin
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <ClockIcon className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{pendingRewards.length}</p>
                <p className="text-xs text-gray-500">Pending</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                <GiftIcon className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-teal-600">{rewards.length}</p>
                <p className="text-xs text-gray-500">Active Rewards</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {rewards.reduce((sum, r) => sum + (r.claimedCount || 0), 0)}
                </p>
                <p className="text-xs text-gray-500">Total Claimed</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <SparklesIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {rewards.length > 0 ? Math.min(...rewards.map(r => r.pointsRequired)) : 0}
                </p>
                <p className="text-xs text-gray-500">Min Points</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/8 overflow-hidden">
          
          {/* Tab Header */}
          <div className="border-b border-gray-100">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative flex-1 sm:flex-none inline-flex items-center justify-center gap-2
                    px-6 py-4 text-sm font-medium
                    transition-all duration-200
                    ${activeTab === tab.id 
                      ? 'text-teal-600' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  {/* Icon */}
                  <span className={activeTab === tab.id ? 'text-teal-600' : 'text-gray-400'}>
                    {tab.icon}
                  </span>
                  
                  {/* Label */}
                  <span className="hidden sm:inline">{tab.label}</span>
                  
                  {/* Count Badge */}
                  {tab.count > 0 && (
                    <span className={`
                      inline-flex items-center justify-center min-w-[20px] h-5 px-1.5
                      text-xs font-semibold rounded-full
                      ${activeTab === tab.id 
                        ? tab.id === 'pending' 
                          ? 'bg-amber-100 text-amber-700' 
                          : 'bg-teal-100 text-teal-700'
                        : 'bg-gray-100 text-gray-600'
                      }
                    `}>
                      {tab.count}
                    </span>
                  )}

                  {/* Active Indicator */}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'pending' ? (
              <div>
                {/* Pending Tab Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                      <BellIcon className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Pending Approvals</h2>
                      <p className="text-sm text-gray-500">
                        {pendingRewards.length} reward{pendingRewards.length !== 1 ? 's' : ''} awaiting approval
                      </p>
                    </div>
                  </div>
                  
                  {pendingRewards.length > 0 && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-100 text-amber-700 text-sm font-semibold rounded-full animate-pulse">
                      <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                      Action Required
                    </span>
                  )}
                </div>

                {/* Pending Rewards Component */}
                {pendingRewards.length > 0 ? (
                  <PendingRewardsApproval
                    pendingRewards={pendingRewards}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    loading={false}
                  />
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-green-50 flex items-center justify-center">
                      <CheckCircleIcon className="h-10 w-10 text-green-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">All Caught Up!</h3>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto">
                      No pending reward approvals at the moment. New requests will appear here.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {/* Catalog Tab Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                      <CatalogIcon className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">Rewards Catalog</h2>
                      <p className="text-sm text-gray-500">
                        {rewards.length} reward{rewards.length !== 1 ? 's' : ''} available
                      </p>
                    </div>
                  </div>
                </div>

                {/* Reward Management Component */}
                <RewardManagement
                  rewards={rewards}
                  onAdd={handleAdd}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-100 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-amber-800 mb-1">How Rewards Work</h3>
                <p className="text-sm text-amber-700">
                  Users earn points through hand hygiene observations. When they have enough points, they can claim rewards from the catalog. 
                  Pending requests need your approval before the reward code is generated.
                </p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-white hover:bg-amber-50 text-amber-700 text-sm font-medium rounded-lg border border-amber-200 transition-colors">
                  View Guide
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ManageRewards;