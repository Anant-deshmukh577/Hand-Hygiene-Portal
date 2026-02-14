import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

export const useProfile = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotification();
  const { updateUser } = useAuth();

  // Fetch user profile
  const useUserProfile = (userId) => {
    return useQuery({
      queryKey: ['userProfile', userId],
      queryFn: () => userService.getUserProfile(userId),
      enabled: !!userId,
    });
  };

  // Fetch user stats
  const useUserStats = (userId) => {
    return useQuery({
      queryKey: ['userStats', userId],
      queryFn: () => userService.getUserStats(userId),
      enabled: !!userId,
    });
  };

  // Fetch user activity
  const useUserActivity = (userId) => {
    return useQuery({
      queryKey: ['userActivity', userId],
      queryFn: () => userService.getUserActivity(userId),
      enabled: !!userId,
    });
  };

  // Update profile mutation
  const useUpdateProfile = () => {
    return useMutation({
      mutationFn: ({ userId, data }) => userService.updateProfile(userId, data),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        updateUser(data);
        showSuccess('Profile updated successfully!');
      },
      onError: (error) => {
        showError(error.message || 'Failed to update profile');
      },
    });
  };

  // Change password mutation
  const useChangePassword = () => {
    return useMutation({
      mutationFn: userService.changePassword,
      onSuccess: () => {
        showSuccess('Password changed successfully!');
      },
      onError: (error) => {
        showError(error.message || 'Failed to change password');
      },
    });
  };

  // Upload avatar mutation
  const useUploadAvatar = () => {
    return useMutation({
      mutationFn: ({ userId, file }) => userService.uploadAvatar(userId, file),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        updateUser(data);
        showSuccess('Avatar uploaded successfully!');
      },
      onError: (error) => {
        showError(error.message || 'Failed to upload avatar');
      },
    });
  };

  return {
    useUserProfile,
    useUserStats,
    useUserActivity,
    useUpdateProfile,
    useChangePassword,
    useUploadAvatar,
  };
};