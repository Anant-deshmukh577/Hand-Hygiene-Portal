import { create } from 'zustand';

export const useUIStore = create((set) => ({
  // UI states
  sidebarOpen: false,
  modalOpen: false,
  modalContent: null,
  
  // Sidebar
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  // Modal
  openModal: (content) => set({ modalOpen: true, modalContent: content }),
  closeModal: () => set({ modalOpen: false, modalContent: null }),
}));