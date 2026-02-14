import { create } from 'zustand';

export const useObservationStore = create((set, get) => ({
  // Session data
  currentSession: null,
  observations: [],
  
  // Set current session
  setCurrentSession: (session) => set({ currentSession: session }),
  
  // Clear current session
  clearCurrentSession: () => set({ currentSession: null, observations: [] }),
  
  // Add observation
  addObservation: (observation) => set((state) => ({
    observations: [...state.observations, observation]
  })),
  
  // Update observation
  updateObservation: (id, updatedData) => set((state) => ({
    observations: state.observations.map(obs => 
      obs.id === id ? { ...obs, ...updatedData } : obs
    )
  })),
  
  // Remove observation
  removeObservation: (id) => set((state) => ({
    observations: state.observations.filter(obs => obs.id !== id)
  })),
  
  // Set all observations
  setObservations: (observations) => set({ observations }),
  
  // Get observation by id
  getObservationById: (id) => {
    return get().observations.find(obs => obs.id === id);
  },
}));