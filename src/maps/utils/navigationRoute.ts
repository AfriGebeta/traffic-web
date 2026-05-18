import { decodePolyline } from '@/shared/utils/polyline';
import type { NavigationLeg } from '../navigation/types';

export function decodeRouteCoordinates(legs: NavigationLeg[]): [number, number][] {
  const coordinates: [number, number][] = [];

  for (const leg of legs) {
    if (!leg.shape) continue;
    const decoded = decodePolyline(leg.shape, 6);
    coordinates.push(...decoded.map(([lat, lon]) => [lon, lat] as [number, number]));
  }

  return coordinates;
}

export function lngLatToApi([lng, lat]: [number, number]): [number, number] {
  return [lat, lng];
}

export function latLngToMap(lat: number, lng: number): [number, number] {
  return [lng, lat];
}
