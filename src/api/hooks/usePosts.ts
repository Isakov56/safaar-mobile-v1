import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { apiClient } from '../client';
import type { Post, Comment, ApiResponse } from '../types';

export function useFeed(tab: 'foryou' | 'following' | 'favorites') {
  return useInfiniteQuery({
    queryKey: ['feed', tab],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({ tab });
      if (pageParam) params.set('cursor', pageParam);
      const { data } = await apiClient.get<
        ApiResponse<{ items: Post[]; cursor: string | null; hasMore: boolean }>
      >(`/feed?${params.toString()}`);
      return data.data!;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.cursor : undefined),
  });
}

export function useToggleLike() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (postId: string) => {
      await apiClient.post(`/posts/${postId}/like`);
    },
    onMutate: async (postId) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ['feed'] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

export function usePostComments(postId: string) {
  return useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      if (pageParam) params.set('cursor', pageParam);
      const { data } = await apiClient.get<
        ApiResponse<{ items: Comment[]; cursor: string | null; hasMore: boolean }>
      >(`/posts/${postId}/comments?${params.toString()}`);
      return data.data!;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.cursor : undefined),
    enabled: !!postId,
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ postId, text }: { postId: string; text: string }) => {
      const { data } = await apiClient.post<ApiResponse<Comment>>(
        `/posts/${postId}/comments`,
        { text }
      );
      return data.data!;
    },
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: {
      content: string;
      images: string[];
      location?: string;
      type?: string;
    }) => {
      const { data } = await apiClient.post<ApiResponse<Post>>('/posts', body);
      return data.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
    },
  });
}
