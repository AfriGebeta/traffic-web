import { useState } from 'react';
import { exploreService } from '../services/explore.service';
import type { ExplorePlace, ExploreCategory } from '../types/types';

export function useExplore() {
    const [places, setPlaces] = useState<Record<ExploreCategory, ExplorePlace[]>>({
        restaurant: [],
        museum: [],
        hotel: [],
        park: [],
        mall: [],
    });
    const [loading, setLoading] = useState<Record<ExploreCategory, boolean>>({
        restaurant: false,
        museum: false,
        hotel: false,
        park: false,
        mall: false,
    });
    const [error, setError] = useState<string>('');

    const fetchPlaces = async (lat: number, lng: number, category: ExploreCategory) => {
        setLoading(prev => ({ ...prev, [category]: true }));
        setError('');

        try {
            const data = await exploreService.getNearbyPlaces(lat, lng, category, 20);
            setPlaces(prev => ({ ...prev, [category]: data }));
        } catch (err) {
            setError('Failed to fetch places');
            console.error('fetchPlaces error:', err);
        } finally {
            setLoading(prev => ({ ...prev, [category]: false }));
        }
    };

    const fetchAllCategories = async (lat: number, lng: number) => {
        const categories: ExploreCategory[] = ['restaurant', 'museum', 'hotel', 'park', 'mall'];
        await Promise.all(categories.map(cat => fetchPlaces(lat, lng, cat)));
    };

    return {
        places,
        loading,
        error,
        fetchPlaces,
        fetchAllCategories,
    };
}
