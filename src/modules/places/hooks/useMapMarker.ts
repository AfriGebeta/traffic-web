import { useState, useRef } from 'react';
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
    const [confirmed, setConfirmed] = useState(!!initialCoordinates);

    const confirmCenter = () => {
        if (mapRef.current) {
            const map = mapRef.current as any;
            const mapInstance = map.getMapInstance();
            if (mapInstance?.getCenter) {
                const center = mapInstance.getCenter();
                setCoordinates({ lat: center.lat, lng: center.lng });
                setConfirmed(true);
            }
        }
    };

    const resetLocation = () => {
        setConfirmed(false);
        setCoordinates(null);
    };

    return {
        mapRef,
        coordinates,
        confirmed,
        confirmCenter,
        resetLocation,
    };
}
