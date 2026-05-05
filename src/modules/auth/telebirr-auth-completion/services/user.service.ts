import { api } from '@/shared/services/api';
import type { User } from '../../signin/types/login.types';

export async function updateProfile(id: string, data: Partial<User>) {
    await api.patch<User>(`/api/users/profile/${id}`, data, {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
    });
}