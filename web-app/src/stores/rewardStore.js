import { create } from 'zustand';

export const useRewardStore = create((set) => ({
  // User rewards data
  totalPoints: 0,
  badges: [],
  pointsHistory: [],
  availableRewards: [],
  
  // Set total points
  setTotalPoints: (points) => set({ totalPoints: points }),
  
  // Add points
  addPoints: (points) => set((state) => ({
    totalPoints: state.totalPoints + points
  })),
  
  // Set badges
  setBadges: (badges) => set({ badges }),
  
  // Add badge
  addBadge: (badge) => set((state) => ({
    badges: [...state.badges, badge]
  })),
  
  // Set points history
  setPointsHistory: (history) => set({ pointsHistory: history }),
  
  // Set available rewards
  setAvailableRewards: (rewards) => set({ availableRewards: rewards }),
}));