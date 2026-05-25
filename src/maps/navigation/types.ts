export interface NavigationRequest {
  origin: [number, number];
  destination: [number, number];
  waypoints?: [number, number][];
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
