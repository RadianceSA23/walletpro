import { api } from '../../../shared/services/api';
import { AuthResponse } from '../types/auth.types';

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<{ data: AuthResponse }>('/auth/login', { email, password });
  const authData = response.data.data;

  // Persist access token in localStorage
  localStorage.setItem('access_token', authData.accessToken);
  localStorage.setItem('user_profile', JSON.stringify(authData.user));

  return authData;
};

export const logoutUser = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
  } catch (e) {
    // Ignore error on token expiration
  } finally {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_profile');
  }
};
