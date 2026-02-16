import { useState, useEffect, useRef } from 'react';
import type { GebetaMapRef } from '@gebeta/tiles';

interface Coordinates {
    lat: number;
    lng: number;
}

export function useMapMarker(initialCoordinates?: Coordinates) {
    const mapRef = useRef<GebetaMapRef>(null);
    const [coordinates, setCoordinates] = useState<Coordinates | null>(
        initialCoordinates || null
    );

    useEffect(() => {
        if (mapRef.current && coordinates) {
            const map = mapRef.current as any;
            map.clearMarkers();
            map.addImageMarker(
                [coordinates.lng, coordinates.lat],
                '/pin.svg',
                [30, 30],
                () => console.log('Marker clicked!'),
                10,
                '<b>Selected Location</b>'
            );
        }
    }, [coordinates]);

    const handleMapClick = (lngLat: [number, number]) => {
        const [lng, lat] = lngLat;
        setCoordinates({ lat, lng });
    };

    return {
        mapRef,
        coordinates,
        handleMapClick,
    };
}
