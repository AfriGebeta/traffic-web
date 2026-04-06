import { api } from '@/shared/services/api';
import type { NearbyResponse, NearbyPlace } from '../types/types';

export async function searchNearbyPlaces(
  lat: number,
  lng: number,
  placeType: string,
  cursor: number = 0,
  limit: number = 20
): Promise<NearbyPlace[]> {
  
  const response = await api.post<NearbyResponse>(
    '/api/navigation/request-revgeocoding',
    {
      coordinate: { lat, lng },
      type: placeType,
      cursor,
      limit,
    }
  );


  return response.response || response.results || response.data || [];
}
