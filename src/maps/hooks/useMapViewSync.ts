import { useEffect, useRef } from "react";

interface MapLibreInstance {
  on: (event: string, handler: () => void) => void;
  off: (event: string, handler: () => void) => void;
  getCenter: () => { lat: number; lng: number };
  getZoom: () => number;
}

export function useMapViewSync(getMapInstance: () => MapLibreInstance | null) {
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let retries = 0;
    const MAX_RETRIES = 40;

    const tryAttach = () => {
      const map = getMapInstance();
      if (!map) {
        if (retries++ < MAX_RETRIES) {
          setTimeout(tryAttach, 150);
        }
        return;
      }

      const syncUrl = () => {
        // Debounce to one frame — 'move' fires at 60fps while dragging
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
          const { lat, lng } = map.getCenter();
          const zoom = map.getZoom();

          const params = new URLSearchParams(window.location.search);
          params.set("lat", lat.toFixed(6));
          params.set("lon", lng.toFixed(6));
          params.set("z", zoom.toFixed(2));

          const newUrl =
            window.location.pathname +
            "?" +
            params.toString() +
            window.location.hash;
          window.history.replaceState(null, "", newUrl);
        });
      };

      map.on("move", syncUrl);

      return () => {
        map.off("move", syncUrl);
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      };
    };

    const cleanup = tryAttach();
    return () => {
      cleanup?.();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [getMapInstance]);
}