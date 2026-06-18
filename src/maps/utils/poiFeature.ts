
interface QueryablePoint {
  x: number;
  y: number;
}

interface QueryableMap {
  queryRenderedFeatures: (point: QueryablePoint) => MapFeature[] | undefined;
}

interface MapFeature {
  properties?: Record<string, unknown> | null;
  geometry?: {
    type?: string;
    coordinates?: unknown;
  };
}

export interface PoiHit {
  name: string;
  category: string;
  lng: number;
  lat: number;
}

const NAME_KEYS = ["name", "name:latin", "name:en", "name_en", "name:am"];
const CATEGORY_KEYS = ["subclass", "class", "category", "type"];

function pickString(
  props: Record<string, unknown>,
  keys: string[],
): string | null {
  for (const key of keys) {
    const value = props[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

export function findPoiAtPoint(
  map: QueryableMap,
  point: QueryablePoint,
  fallback: [number, number],
): PoiHit | null {
  const features = map.queryRenderedFeatures(point);
  if (!features?.length) return null;

  for (const feature of features) {
    const props = feature.properties ?? {};
    const name = pickString(props, NAME_KEYS);
    if (!name) continue;

    let [lng, lat] = fallback;
    const coords = feature.geometry?.coordinates;
    if (
      feature.geometry?.type === "Point" &&
      Array.isArray(coords) &&
      typeof coords[0] === "number" &&
      typeof coords[1] === "number"
    ) {
      [lng, lat] = coords as [number, number];
    }

    return {
      name,
      category: pickString(props, CATEGORY_KEYS) ?? "place",
      lng,
      lat,
    };
  }

  return null;
}
