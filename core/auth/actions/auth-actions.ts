import { authApi } from '../api/authApi';
import type { LoginCredentials, User } from '../interfaces/user';

export const authActions = {
  async login(credentials: LoginCredentials): Promise<{ token: string; user: User }> {
    try {
      const authResponse = await authApi.login(credentials);

      // After successful login, fetch user data
      // Note: FakeStore API doesn't return user data with token
      // In production, you'd decode JWT or fetch user data
      const user = await authApi.getCurrentUser();

      return {
        token: authResponse.token,
        user,
      };
    } catch (error: any) {
      throw {
        message: error.message || 'Error al iniciar sesión',
        status: error.status,
      };
    }
  },

  async register(credentials: any): Promise<{ token: string; user: User }> {
    try {
      const authResponse = await authApi.register(credentials);
      const user = await authApi.getCurrentUser();

      return {
        token: authResponse.token,
        user,
      };
    } catch (error: any) {
      throw {
        message: error.message || 'Error al registrarse',
        status: error.status,
      };
    }
  },

  async validateToken(): Promise<boolean> {
    try {
      // Try to fetch user data with token
      // Token is automatically injected by httpClient
      await authApi.getCurrentUser();
      return true;
    } catch {
      return false;
    }
  },

  async logout(): Promise<void> {
    // Perform any server-side logout if needed
    return Promise.resolve();
  },
};
