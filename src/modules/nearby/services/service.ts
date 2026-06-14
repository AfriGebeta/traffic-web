import { api } from '@/shared/services/api';
import type { NearbyResponse, NearbyPlace } from '../types/types';

export async function searchNearbyPlaces(
  lat: number,
  lng: number,
  category: string,
  size: number = 5
): Promise<NearbyPlace[]> {

  const response = await api.post<NearbyResponse>(
    '/api/navigation/request-revgeocoding',
    {
      coordinate: { lat, lng },
      category,
      size,
    }
  );

  const results = response.response?.results ?? [];

  return results.map((result) => ({
    id: result.id,
    name: result.name,
    latitude: result.location.lat,
    longitude: result.location.lng,
    type: result.category,
    City: result.address?.city ?? '',
    Country: result.address?.country ?? '',
  }));
}
