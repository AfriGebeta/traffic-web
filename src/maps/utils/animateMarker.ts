export function animateMarkerAlongRoute({
  map,
  coordinates,
  duration = 6000,
  onUpdate,
  easing = easeInOutCubic,
}: {
  map: any;
  coordinates: [number, number][];
  duration?: number;
  onUpdate: (position: [number, number], bearing: number) => void;
  easing?: (t: number) => number;
}) {
  let startTime: number | null = null;
  let frameId: number;

  function frame(time: number) {
    if (!startTime) startTime = time;
    const progress = Math.min((time - startTime) / duration, 1);
    const eased = easing(progress);
    const i = eased * (coordinates.length - 1);
    const idx = Math.floor(i);
    const t = i - idx;
    const p1 = coordinates[idx];
    const p2 = coordinates[idx + 1] || p1;
    const lng = lerp(p1[0], p2[0], t);
    const lat = lerp(p1[1], p2[1], t);
    const current: [number, number] = [lng, lat];
    
    const bearing = calculateBearing(p1, p2);
    onUpdate(current, bearing);

    if (progress < 1) {
      frameId = requestAnimationFrame(frame);
    }
  }

  frameId = requestAnimationFrame(frame);

  // Cleanup function
  return () => cancelAnimationFrame(frameId);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function calculateBearing(
  start: [number, number],
  end: [number, number]
) {
  const startLng = (start[0] * Math.PI) / 180;
  const startLat = (start[1] * Math.PI) / 180;
  const endLng = (end[0] * Math.PI) / 180;
  const endLat = (end[1] * Math.PI) / 180;

  const y = Math.sin(endLng - startLng) * Math.cos(endLat);
  const x =
    Math.cos(startLat) * Math.sin(endLat) -
    Math.sin(startLat) * Math.cos(endLat) * Math.cos(endLng - startLng);

  const bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360;
}
