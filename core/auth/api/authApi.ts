import { httpClient } from '@/core/common/api/httpClient';
import type { LoginCredentials, AuthResponse, User } from '../interfaces/user';

export const authApi = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return httpClient.post<AuthResponse>('/auth/login', credentials);
  },

  async getCurrentUser(): Promise<User> {
    // FakeStore API doesn't have a /me endpoint
    // We use /users/1 as a placeholder
    // In a real app, you would decode the JWT to get the user ID
    // or use a dedicated /me or /users/current endpoint
    return httpClient.get<User>('/users/1', true);
  },

  async register(credentials: any): Promise<AuthResponse> {
    // Note: FakeStore API doesn't support actual registration
    // This is for demonstration purposes only
    console.warn('FakeStore API does not support real registration');
    return httpClient.post<AuthResponse>('/users', credentials);
  },
};
