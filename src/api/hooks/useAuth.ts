import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../client';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types';

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: User }>('/auth/me');
      return data.data;
    },
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: LoginRequest) => {
      const { data } = await apiClient.post<{ success: boolean; data: AuthResponse }>(
        '/auth/login',
        body
      );
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data.user);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: RegisterRequest) => {
      const { data } = await apiClient.post<{ success: boolean; data: AuthResponse }>(
        '/auth/register',
        body
      );
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['currentUser'], data.user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/auth/logout');
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
