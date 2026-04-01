import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { Booking, CreateBookingRequest, ApiResponse } from '../types';

export function useMyBookings() {
  return useQuery({
    queryKey: ['myBookings'],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<Booking[]>>('/bookings');
      return data.data!;
    },
  });
}

export function useHostBookings() {
  return useQuery({
    queryKey: ['hostBookings'],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<Booking[]>>('/bookings/hosting');
      return data.data!;
    },
  });
}

export function useBooking(id: string) {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<Booking>>(`/bookings/${id}`);
      return data.data!;
    },
    enabled: !!id,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateBookingRequest) => {
      const { data } = await apiClient.post<ApiResponse<Booking>>('/bookings', body);
      return data.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bookingId: string) => {
      const { data } = await apiClient.post<ApiResponse<Booking>>(
        `/bookings/${bookingId}/cancel`
      );
      return data.data!;
    },
    onSuccess: (_, bookingId) => {
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
      queryClient.invalidateQueries({ queryKey: ['myBookings'] });
    },
  });
}
