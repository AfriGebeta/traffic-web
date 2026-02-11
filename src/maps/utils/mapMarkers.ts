import type { GebetaMapRef } from '@gebeta/tiles';
import type { Coordinates } from '../hooks/useGeolocation';

export function addLocationMarker(
  mapRef: GebetaMapRef,
  location: Coordinates
): void {
  mapRef.clearMarkers();

  mapRef.addImageMarker(
    location,
    '/pin.svg',
    [30, 30],
    () => {
      console.log('User location marker clicked!');
    },
    10,
    '<b>Your Location</b>'
  );
}
