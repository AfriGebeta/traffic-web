export type ExploreCategory = 'restaurant' | 'museum' | 'hotel' | 'park' | 'mall';

export interface ExplorePlace {
    name: string;
    latitude: number;
    longitude: number;
    Country: string;
    City: string;
    type: string;
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

