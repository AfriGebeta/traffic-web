import { api } from '@/shared/services/api';
import type { NavigationRequest, NavigationResponse } from './types';

export async function getNavigation(
  origin: [number, number],
  destination: [number, number],
  waypoints: [number, number][] = []
): Promise<NavigationResponse> {
  const body: NavigationRequest = { origin, destination };
  if (waypoints.length > 0) {
    body.waypoints = waypoints;
  }

  return api.post<NavigationResponse>('/api/navigation/request-navigation', body);
}
