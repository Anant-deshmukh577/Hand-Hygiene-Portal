import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rewardService } from '../services/rewardService';
import { useNotification } from '../context/NotificationContext';

export const useRewards = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotification();

  // Fetch user rewards
  const useUserRewards = (userId) => {
    return useQuery({
      queryKey: ['userRewards', userId],
      queryFn: () => rewardService.getUserRewards(userId),
      enabled: !!userId,
    });
  };

  // Fetch available rewards
  const useAvailableRewards = () => {
    return useQuery({
      queryKey: ['availableRewards'],
      queryFn: rewardService.getAvailableRewards,
    });
  };

  // Fetch user badges
  const useUserBadges = (userId) => {
    return useQuery({
      queryKey: ['userBadges', userId],
      queryFn: () => rewardService.getUserBadges(userId),
      enabled: !!userId,
    });
  };

  // Fetch points history
  const usePointsHistory = (userId) => {
    return useQuery({
      queryKey: ['pointsHistory', userId],
      queryFn: () => rewardService.getPointsHistory(userId),
      enabled: !!userId,
    });
  };

  // Claim reward mutation
  const useClaimReward = () => {
    return useMutation({
      mutationFn: rewardService.claimReward,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['userRewards'] });
        queryClient.invalidateQueries({ queryKey: ['availableRewards'] });
        showSuccess('Reward claimed successfully!');
      },
      onError: (error) => {
        showError(error.message || 'Failed to claim reward');
      },
    });
  };

  return {
    useUserRewards,
    useAvailableRewards,
    useUserBadges,
    usePointsHistory,
    useClaimReward,
  };
};