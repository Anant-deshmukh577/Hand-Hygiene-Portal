import { useAuth as useAuthContext } from '../context/AuthContext';

// Re-export the auth context hook
export const useAuth = () => {
  return useAuthContext();
};