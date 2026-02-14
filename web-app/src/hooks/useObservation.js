import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { observationService } from '../services/observationService';
import { useNotification } from '../context/NotificationContext';

export const useObservation = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useNotification();

  // Fetch all observations
  const useObservations = (filters = {}) => {
    return useQuery({
      queryKey: ['observations', filters],
      queryFn: () => observationService.getObservations(filters),
    });
  };

  // Fetch single observation
  const useObservationById = (id) => {
    return useQuery({
      queryKey: ['observation', id],
      queryFn: () => observationService.getObservationById(id),
      enabled: !!id,
    });
  };

  // Create observation mutation
  const useCreateObservation = () => {
    return useMutation({
      mutationFn: observationService.createObservation,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['observations'] });
        showSuccess('Observation recorded successfully!');
      },
      onError: (error) => {
        showError(error.message || 'Failed to create observation');
      },
    });
  };

  // Update observation mutation
  const useUpdateObservation = () => {
    return useMutation({
      mutationFn: ({ id, data }) => observationService.updateObservation(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['observations'] });
        showSuccess('Observation updated successfully!');
      },
      onError: (error) => {
        showError(error.message || 'Failed to update observation');
      },
    });
  };

  // Delete observation mutation
  const useDeleteObservation = () => {
    return useMutation({
      mutationFn: observationService.deleteObservation,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['observations'] });
        showSuccess('Observation deleted successfully!');
      },
      onError: (error) => {
        showError(error.message || 'Failed to delete observation');
      },
    });
  };

  return {
    useObservations,
    useObservationById,
    useCreateObservation,
    useUpdateObservation,
    useDeleteObservation,
  };
};
