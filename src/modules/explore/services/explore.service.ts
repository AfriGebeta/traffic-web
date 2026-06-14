import { api } from '@/shared/services/api';
import type { ExplorePlace, ExploreCategory, ReverseGeocodingResponse } from '../types/types';

export const exploreService = {
    async getNearbyPlaces(
        lat: number,
        lng: number,
        category: ExploreCategory,
        size: number = 5
    ): Promise<ExplorePlace[]> {
        try {
            const response = await api.post<ReverseGeocodingResponse>(
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
        } catch (error) {
            console.error('Error fetching nearby places:', error);
            throw error;
        }
    },
};
