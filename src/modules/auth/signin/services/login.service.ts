import { api } from '@/shared/services/api';
import type { LoginRequest, LoginResponse, User } from '../types/login.types';

export async function login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/api/users/login', data);

    if (response.token) {
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
    }

    return response;
}

export function getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
}

export function getStoredToken(): string | null {
    return localStorage.getItem('auth_token');
}

export function logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
}
