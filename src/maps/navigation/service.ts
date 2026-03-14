import { api } from '@/shared/services/api';
import type { NavigationResponse } from './types';

export async function getNavigation(
  origin: [number, number],
  destination: [number, number]
): Promise<NavigationResponse> {
  const response = await api.post<NavigationResponse>(
    '/api/navigation/request-navigation',
    {
      origin,
      destination,
    }
  );

  return response;
}
