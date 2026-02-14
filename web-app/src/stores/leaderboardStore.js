import { create } from 'zustand';

export const useLeaderboardStore = create((set) => ({
  // Leaderboard data
  leaderboard: [],
  timePeriod: 'weekly',
  department: 'all',
  ward: 'all',
  
  // Set leaderboard
  setLeaderboard: (data) => set({ leaderboard: data }),
  
  // Set filters
  setTimePeriod: (period) => set({ timePeriod: period }),
  setDepartment: (dept) => set({ department: dept }),
  setWard: (ward) => set({ ward: ward }),
  
  // Reset filters
  resetFilters: () => set({
    timePeriod: 'weekly',
    department: 'all',
    ward: 'all',
  }),
}));