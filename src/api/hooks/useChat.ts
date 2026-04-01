import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { apiClient } from '../client';
import type { Conversation, Message, ApiResponse } from '../types';

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<Conversation[]>>('/conversations');
      return data.data!;
    },
    refetchInterval: 30000, // Poll every 30s as fallback to Socket.io
  });
}

export function useMessages(conversationId: string) {
  return useInfiniteQuery({
    queryKey: ['messages', conversationId],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      if (pageParam) params.set('cursor', pageParam);
      const { data } = await apiClient.get<
        ApiResponse<{ items: Message[]; cursor: string | null; hasMore: boolean }>
      >(`/conversations/${conversationId}/messages?${params.toString()}`);
      return data.data!;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.cursor : undefined),
    enabled: !!conversationId,
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      conversationId,
      content,
      type = 'text',
    }: {
      conversationId: string;
      content: string;
      type?: 'text' | 'image' | 'video';
    }) => {
      const { data } = await apiClient.post<ApiResponse<Message>>(
        `/conversations/${conversationId}/messages`,
        { content, type }
      );
      return data.data!;
    },
    onSuccess: (_, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      const { data } = await apiClient.post<ApiResponse<Conversation>>('/conversations', {
        userId,
      });
      return data.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

export function useMarkConversationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (conversationId: string) => {
      await apiClient.patch(`/conversations/${conversationId}/read`);
    },
    onSuccess: (_, conversationId) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}
