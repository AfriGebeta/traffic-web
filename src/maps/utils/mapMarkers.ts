import type { GebetaMapRef } from '@gebeta/tiles';
import type { Coordinates } from '../hooks/useGeolocation';

export function addLocationMarker(
  mapRef: GebetaMapRef,
  location: Coordinates,
  label: string = 'Your Location',
  markerIcon: string = '/pin.svg'
): void {
  mapRef.clearMarkers();

  mapRef.addImageMarker(
    location,
    markerIcon,
    [30, 30],
    () => {
      console.log('Marker clicked!');
    },
    10,
    `<b>${label}</b>`
  );
}
