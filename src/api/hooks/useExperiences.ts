import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { apiClient } from '../client';
import type { Experience, ExperienceSlot, ApiResponse } from '../types';

export function useExperience(id: string) {
  return useQuery({
    queryKey: ['experience', id],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<Experience>>(
        `/experiences/${id}?include=host,reviews,availability`
      );
      return data.data!;
    },
    enabled: !!id,
  });
}

export function useExperienceAvailability(id: string, from: string, to: string) {
  return useQuery({
    queryKey: ['experienceAvailability', id, from, to],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<ExperienceSlot[]>>(
        `/experiences/${id}/availability?from=${from}&to=${to}`
      );
      return data.data!;
    },
    enabled: !!id && !!from && !!to,
  });
}

export function useSearchExperiences(filters: {
  cityId?: string;
  category?: string;
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  isFree?: boolean;
}) {
  return useInfiniteQuery({
    queryKey: ['experiences', 'search', filters],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      if (filters.cityId) params.set('cityId', filters.cityId);
      if (filters.category) params.set('category', filters.category);
      if (filters.query) params.set('q', filters.query);
      if (filters.minPrice !== undefined) params.set('minPrice', String(filters.minPrice));
      if (filters.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice));
      if (filters.isFree !== undefined) params.set('isFree', String(filters.isFree));
      if (pageParam) params.set('cursor', pageParam);

      const { data } = await apiClient.get<
        ApiResponse<{ items: Experience[]; cursor: string | null; hasMore: boolean }>
      >(`/experiences?${params.toString()}`);
      return data.data!;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.cursor : undefined),
  });
}

export function useSaveExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (experienceId: string) => {
      await apiClient.post(`/experiences/${experienceId}/save`);
    },
    onSuccess: (_, experienceId) => {
      queryClient.invalidateQueries({ queryKey: ['experience', experienceId] });
      queryClient.invalidateQueries({ queryKey: ['savedExperiences'] });
    },
  });
}

export function useSavedExperiences() {
  return useQuery({
    queryKey: ['savedExperiences'],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<Experience[]>>('/experiences/saved');
      return data.data!;
    },
  });
}
