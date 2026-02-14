import { useQuery } from '@tanstack/react-query';
import { leaderboardService } from '../services/leaderboardService';

export const useLeaderboard = () => {
  // Fetch leaderboard data
  const useLeaderboardData = (filters = {}) => {
    return useQuery({
      queryKey: ['leaderboard', filters],
      queryFn: () => leaderboardService.getLeaderboard(filters),
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  // Fetch department rankings
  const useDepartmentRankings = (timePeriod = 'weekly') => {
    return useQuery({
      queryKey: ['departmentRankings', timePeriod],
      queryFn: () => leaderboardService.getDepartmentRankings(timePeriod),
      staleTime: 1000 * 60 * 5,
    });
  };

  // Fetch ward rankings
  const useWardRankings = (timePeriod = 'weekly') => {
    return useQuery({
      queryKey: ['wardRankings', timePeriod],
      queryFn: () => leaderboardService.getWardRankings(timePeriod),
      staleTime: 1000 * 60 * 5,
    });
  };

  // Fetch user rank
  const useUserRank = (userId) => {
    return useQuery({
      queryKey: ['userRank', userId],
      queryFn: () => leaderboardService.getUserRank(userId),
      enabled: !!userId,
    });
  };

  return {
    useLeaderboardData,
    useDepartmentRankings,
    useWardRankings,
    useUserRank,
  };
};