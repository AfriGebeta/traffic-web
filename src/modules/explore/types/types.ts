export type ExploreCategory = 'restaurant' | 'museum' | 'hotel' | 'park' | 'mall';

export interface ExplorePlace {
    id?: string;
    name: string;
    latitude: number;
    longitude: number;
    Country: string;
    City: string;
    type: string;
}

export interface RevGeocodingResult {
    id: string;
    name: string;
    display_name: string;
    category: string;
    location: {
        lat: number;
        lng: number;
    };
    address: {
        city?: string;
        country?: string;
        country_code?: string;
    };
}

export interface ReverseGeocodingResponse {
    response?: {
        query: string;
        results: RevGeocodingResult[];
    };
}

export interface ExploreCategoryConfig {
    id: ExploreCategory;
    label: string;
}

export const EXPLORE_CATEGORIES: ExploreCategoryConfig[] = [
    { id: 'restaurant', label: 'Restaurants' },
    { id: 'museum', label: 'Museums' },
    { id: 'hotel', label: 'Hotels' },
    { id: 'park', label: 'Parks' },
    { id: 'mall', label: 'Malls' },
];

