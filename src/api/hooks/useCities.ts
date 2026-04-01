import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { City, CityPulse, ApiResponse } from '../types';

export function useSearchCities(query: string) {
  return useQuery({
    queryKey: ['cities', 'search', query],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<City[]>>(
        `/cities?q=${encodeURIComponent(query)}`
      );
      return data.data!;
    },
    enabled: query.length >= 2,
  });
}

export function useCityPulse(cityId: string) {
  return useQuery({
    queryKey: ['cityPulse', cityId],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<CityPulse>>(
        `/cities/${cityId}/pulse`
      );
      return data.data!;
    },
    enabled: !!cityId,
    staleTime: 60 * 1000, // 60s
  });
}
