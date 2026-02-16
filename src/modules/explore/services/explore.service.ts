import { api } from '@/shared/services/api';
import type { ExplorePlace, ExploreCategory } from '../types/types';

interface ReverseGeocodingResponse {
    response: ExplorePlace[];
}

export const exploreService = {
    async getNearbyPlaces(
        lat: number,
        lng: number,
        type: ExploreCategory,
        limit: number = 20
    ): Promise<ExplorePlace[]> {
        try {
            console.log('Fetching places:', { lat, lng, type, limit });
            const response = await api.post<ReverseGeocodingResponse>(
                '/api/navigation/request-revgeocoding',
                {
                    coordinate: { lat, lng },
                    type,
                    cursor: 0,
                    limit,
                }
            );

            const places = response.response || [];
            return places;
        } catch (error) {
            console.error('Error fetching nearby places:', error);
            throw error;
        }
    },
};
