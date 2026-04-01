import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { DashboardStats, RevenueDataPoint, Booking, ApiResponse } from '../types';

export function useDashboardStats(period: 'week' | 'month' | 'year') {
  return useQuery({
    queryKey: ['dashboardStats', period],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<DashboardStats>>(
        `/dashboard/stats?period=${period}`
      );
      return data.data!;
    },
  });
}

export function useRevenueChart(from: string, to: string) {
  return useQuery({
    queryKey: ['revenueChart', from, to],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<RevenueDataPoint[]>>(
        `/dashboard/revenue?from=${from}&to=${to}`
      );
      return data.data!;
    },
    enabled: !!from && !!to,
  });
}

export function useTopCustomers(limit = 5) {
  return useQuery({
    queryKey: ['topCustomers', limit],
    queryFn: async () => {
      const { data } = await apiClient.get<
        ApiResponse<Array<{ userId: string; name: string; email: string; totalSpent: number }>>
      >(`/dashboard/top-customers?limit=${limit}`);
      return data.data!;
    },
  });
}

export function useRecentBookings() {
  return useQuery({
    queryKey: ['recentBookings'],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<Booking[]>>(
        '/dashboard/recent-bookings'
      );
      return data.data!;
    },
  });
}
