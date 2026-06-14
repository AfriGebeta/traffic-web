export interface NearbyPlace {
    id?: string;
    name: string;
    latitude: number;
    longitude: number;
    type: string;
    Country: string;
    City: string;
    image?: string;
}

export interface NearbyRequest {
    coordinate: {
        lat: number;
        lng: number;
    };
    category: string;
    size?: number;
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

export interface NearbyResponse {
    response?: {
        query: string;
        results: RevGeocodingResult[];
    };
}

export const PLACE_CATEGORIES = {
    restaurants: {
        id: 'restaurant',
        label: 'Restaurants',
        markerIcon: '/assets/restaurant.png'
    },
    gas: {
        id: 'gas station',
        label: 'Gas Stations',
        markerIcon: '/assets/gas-station.png'
    },
    parking: {
        id: 'parking',
        label: 'Parking',
        markerIcon: '/assets/parking.png'
    },
    hospital: {
        id: 'hospital',
        label: 'Hospitals',
        markerIcon: '/assets/hospital.png'
    },
    repair: {
        id: 'car repair',
        label: 'Repair Shops',
        markerIcon: '/assets/repair-shop.png'
    },
} as const;

export type CategoryKey = keyof typeof PLACE_CATEGORIES;
