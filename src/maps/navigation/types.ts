export type Costing = "auto" | "bicycle" | "pedestrian";

export interface NavigationRequest {
  origin: [number, number];
  destination: [number, number];
  waypoints?: [number, number][];
  costing?: Costing;
}

export interface NavigationLeg {
  shape: string;
  summary: {
    time: number;
    length: number;
  };
}

export interface NavigationResponse {
  data: {
    trip: {
      legs: NavigationLeg[];
    };
  };
}

export interface Waypoint {
  id: string;
  lat: number;
  lng: number;
  name?: string;
}
