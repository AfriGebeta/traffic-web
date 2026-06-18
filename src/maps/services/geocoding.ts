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

interface ReverseGeocodeResponse {
  response?: {
    results?: Array<{
      address?: {
        city?: string;
        country?: string;
      };
    }>;
  };
}

export interface ReverseGeocodeAddress {
  city: string;
  country: string;
}


export async function reverseGeocodeAddress(
  lat: number,
  lng: number,
): Promise<ReverseGeocodeAddress | null> {
  try {
    const data = await api.post<ReverseGeocodeResponse>(
      '/api/navigation/request-revgeocoding',
      {
        coordinate: { lat, lng },
        category: '',
        size: 1,
      },
    );

    const top = data.response?.results?.[0];
    if (!top) return null;

    return {
      city: top.address?.city ?? '',
      country: top.address?.country ?? '',
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
}
