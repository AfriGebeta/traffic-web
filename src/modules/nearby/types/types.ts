export interface NearbyPlace {
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
    type: string;
    cursor?: number;
    limit?: number;
}

export interface NearbyResponse {
    response?: NearbyPlace[];
    results?: NearbyPlace[];
    data?: NearbyPlace[];
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
