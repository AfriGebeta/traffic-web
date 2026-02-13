import { api } from '@/shared/services/api';
import type { AuthResponse, RegisterRequest } from '../types/signup.types';

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/api/users/register', data);
  
  if (response.token) {
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
  }
  
  return response;
}

export function logout(): void {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
}

export function getStoredUser() {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
}

export function getStoredToken(): string | null {
  return localStorage.getItem('auth_token');
}
