import { api } from '@/shared/services/api';
import type { Place, GeocodingResponse } from '../types/place';

export async function searchPlaces(placeName: string): Promise<Place[]> {
  try {
    const data = await api.post<GeocodingResponse>('/api/navigation/request-geocoding', {
      placeName,
    });
    
    return data.response || [];
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}
