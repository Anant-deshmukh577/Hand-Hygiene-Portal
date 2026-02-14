import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { rewardService } from '../services/rewardService';
import RewardCard from '../components/rewards/RewardCard';
import PointsHistory from '../components/rewards/PointsHistory';
import AchievementBadges from '../components/profile/AchievementBadges';
import Loader, { PageLoader } from '../components/common/Loader';

/* --- SVG Icons --- */
const GiftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const Rewards = () => {
  const { user, updateUser } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [loading, setLoading] = useState(true);
  const [claimLoading, setClaimLoading] = useState(false);
  const [rewards, setRewards] = useState([]);
  const [pointsHistory, setPointsHistory] = useState([]);
  const [badges, setBadges] = useState([]);

  const userId = user?.id || user?._id;
  const userPoints = user?.totalPoints || 0;

  const fetchRewardsData = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
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
        setRewards(availableRewards);
      }
      
      setRewards(availableRewards);

      // Fetch points history
      try {
        const historyResponse = await rewardService.getPointsHistory(userId);
        setPointsHistory((historyResponse.history || []).map(h => ({
          description: h.description,
          points: h.points,
          createdAt: h.createdAt,
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
          earnedAt: b.earnedAt,
        })));
      } catch {
        setBadges([]);
      }

    } catch (error) {
      showError(error.message || 'Failed to load rewards');
    } finally {
      setLoading(false);
    }
  }, [showError, userId]);

  useEffect(() => {
    if (userId) {
      fetchRewardsData();
    }
  }, [fetchRewardsData, userId]);

  const handleClaimReward = async (rewardId) => {
    setClaimLoading(true);
    try {
      await rewardService.claimReward(rewardId);
      showSuccess('Reward claimed successfully!');
      
      // Update local state
      setRewards(prev => prev.map(r => 
        r.id === rewardId ? { ...r, claimed: true } : r
      ));
      
      // Refresh user data to get updated points
      if (updateUser && user) {
        const reward = rewards.find(r => r.id === rewardId);
        if (reward) {
          updateUser({ ...user, totalPoints: user.totalPoints - reward.pointsRequired });
        }
      }
      
      // Refresh data
      fetchRewardsData();
    } catch (error) {
      showError(error.message || 'Failed to claim reward');
    } finally {
      setClaimLoading(false);
    }
  };

  if (loading) {
    return <PageLoader text="Loading rewards..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
              <GiftIcon />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Rewards & Achievements
              </h1>
              <p className="text-gray-500 mt-1">
                Redeem your points and showcase your achievements
              </p>
            </div>
          </div>
        </div>

        {/* Points Summary Card */}
        <div className="relative bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl p-8 sm:p-10 mb-8 overflow-hidden shadow-xl shadow-teal-500/30">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
          
          {/* Content */}
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <SparklesIcon />
              <span className="text-white text-sm font-semibold">Your Points Balance</span>
            </div>
            
            <div className="mb-4">
              <p className="text-7xl sm:text-8xl font-bold text-white mb-2 tracking-tight">
                {userPoints.toLocaleString()}
              </p>
              <p className="text-teal-50 text-lg">
                Total Points Earned
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <p className="text-3xl font-bold text-white mb-1">{rewards.filter(r => r.claimed).length}</p>
                <p className="text-teal-50 text-sm">Claimed Rewards</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <p className="text-3xl font-bold text-white mb-1">{badges.length}</p>
                <p className="text-teal-50 text-sm">Badges Earned</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <p className="text-3xl font-bold text-white mb-1">{rewards.filter(r => !r.claimed && userPoints >= r.pointsRequired).length}</p>
                <p className="text-teal-50 text-sm">Available Now</p>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Badges Section */}
        {badges.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <TrophyIcon />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Achievement Badges
                </h2>
                <p className="text-gray-500 text-sm">
                  Your earned accomplishments
                </p>
              </div>
            </div>
            <AchievementBadges badges={badges} />
          </div>
        )}

        {/* Available Rewards Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <GiftIcon />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Available Rewards
                </h2>
                <p className="text-gray-500 text-sm">
                  Redeem your points for exclusive rewards
                </p>
              </div>
            </div>
            
            {/* Rewards Count Badge */}
            <span className="hidden sm:inline-flex items-center px-4 py-1.5 bg-teal-100 text-teal-700 text-sm font-semibold rounded-full">
              {rewards.length} Rewards
            </span>
          </div>

          {/* Rewards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {rewards.length > 0 ? (
              rewards.map((reward) => (
                <RewardCard
                  key={reward.id}
                  reward={reward}
                  userPoints={userPoints}
                  onClaim={handleClaimReward}
                  loading={claimLoading}
                />
              ))
            ) : (
              <div className="col-span-full">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center">
                    <GiftIcon />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Rewards Available
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Check back soon! New rewards are added regularly.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Points History Section */}
        <div className="mb-8">
          <PointsHistory history={pointsHistory} />
        </div>

        {/* Motivational Footer Card */}
        <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-2xl border border-teal-100 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Keep Up The Great Work! 🎉
              </h3>
              <p className="text-gray-600">
                Continue maintaining excellent hand hygiene practices to earn more points and unlock exclusive rewards.
              </p>
            </div>
            <div className="flex-shrink-0">
              <div className="text-center px-6 py-3 bg-white rounded-xl border border-teal-200">
                <p className="text-2xl font-bold text-teal-600">{userPoints}</p>
                <p className="text-xs text-gray-500 uppercase tracking-wide">Points</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Rewards;