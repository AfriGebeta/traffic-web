export interface Place {
  name: string;
  latitude: number;
  longitude: number;
  Country: string;
  City: string;
  type: string;
}

export interface GeocodingResponse {
  response: Place[];
}
