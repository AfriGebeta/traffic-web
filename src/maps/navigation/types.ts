export interface NavigationRequest {
  origin: [number, number]; 
  destination: [number, number]; 
}

export interface NavigationResponse {
  data: {
    trip: {
      legs: Array<{
        shape: string;
        summary: {
          time: number;
          length: number;
        };
      }>;
    };
  };
}
