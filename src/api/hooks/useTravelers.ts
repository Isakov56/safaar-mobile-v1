import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { Traveler, ApiResponse } from '../types';

export function useTravelers(filters: {
  cityId?: string;
  from?: string;
  to?: string;
  interests?: string[];
  language?: string;
}) {
  return useQuery({
    queryKey: ['travelers', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters.cityId) params.set('cityId', filters.cityId);
      if (filters.from) params.set('from', filters.from);
      if (filters.to) params.set('to', filters.to);
      if (filters.interests?.length) params.set('interests', filters.interests.join(','));
      if (filters.language) params.set('language', filters.language);

      const { data } = await apiClient.get<ApiResponse<Traveler[]>>(
        `/travelers?${params.toString()}`
      );
      return data.data!;
    },
    enabled: !!filters.cityId,
  });
}

export function useSendConnectionRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      await apiClient.post('/travelers/connections/request', { userId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travelers'] });
    },
  });
}

export function useAcceptConnection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (connectionId: string) => {
      await apiClient.post(`/travelers/connections/${connectionId}/accept`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['travelers'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
