import { useMemo } from "react";

interface MapView {
  center: [number, number];
  zoom: number;
}

const DEFAULT_CENTER: [number, number] = [38.7685, 9.0161];
const DEFAULT_ZOOM = 12;

export function useMapView(): MapView {
  return useMemo(() => {
    const hash = window.location.hash;
    const hashMatch = hash.match(/#\/@(-?[\d.]+),(-?[\d.]+),([\d.]+)z/);
    if (hashMatch) {
      const lat = parseFloat(hashMatch[1]);
      const lon = parseFloat(hashMatch[2]);
      const zoom = parseFloat(hashMatch[3]);
      if (isFinite(lat) && isFinite(lon) && isFinite(zoom)) {
        return { center: [lon, lat], zoom };
      }
    }

    const params = new URLSearchParams(window.location.search);
    const lat = parseFloat(params.get("lat") ?? "");
    const lon = parseFloat(params.get("lon") ?? params.get("lng") ?? "");
    const zoom = parseFloat(params.get("z") ?? params.get("zoom") ?? "");

    if (isFinite(lat) && isFinite(lon)) {
      return {
        center: [lon, lat],
        zoom: isFinite(zoom) ? zoom : DEFAULT_ZOOM,
      };
    }

    return { center: DEFAULT_CENTER, zoom: DEFAULT_ZOOM };
  }, []);
}