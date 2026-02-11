import { useState, useCallback } from 'react';

export type Coordinates = [number, number];

interface GeolocationState {
    isLocating: boolean;
    error: string | null;
}

export function useGeolocation() {
    const [state, setState] = useState<GeolocationState>({
        isLocating: false,
        error: null,
    });

    const getCurrentLocation = useCallback(
        (): Promise<Coordinates> => {
            return new Promise((resolve, reject) => {
                if (!('geolocation' in navigator)) {
                    const error = 'geolocation is not supported by your browser.';
                    setState({ isLocating: false, error });
                    reject(new Error(error));
                    return;
                }

                setState({ isLocating: true, error: null });

                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { longitude, latitude } = position.coords;
                        setState({ isLocating: false, error: null });
                        resolve([longitude, latitude]);
                    },
                    (error) => {
                        const errorMessage = 'unable to get your location. please enable location services.';
                        setState({ isLocating: false, error: errorMessage });
                        reject(error);
                    }
                );
            });
        },
        []
    );

    return {
        ...state,
        getCurrentLocation,
    };
}
