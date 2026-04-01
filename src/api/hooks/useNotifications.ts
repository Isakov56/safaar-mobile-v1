import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { Notification, ApiResponse } from '../types';

export function useNotifications(category?: string) {
  return useInfiniteQuery({
    queryKey: ['notifications', category],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      if (category && category !== 'all') params.set('category', category);
      if (pageParam) params.set('cursor', pageParam);
      const { data } = await apiClient.get<
        ApiResponse<{ items: Notification[]; cursor: string | null; hasMore: boolean }>
      >(`/notifications?${params.toString()}`);
      return data.data!;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.cursor : undefined),
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: ['notificationUnreadCount'],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<{ count: number }>>(
        '/notifications/unread-count'
      );
      return data.data!.count;
    },
    refetchInterval: 30000,
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await apiClient.patch('/notifications/read');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.setQueryData(['notificationUnreadCount'], 0);
    },
  });
}
