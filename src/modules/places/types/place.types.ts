export type PlaceType = 
  | 'gas_station' 
  | 'taxi_station' 
  | 'repair_shop' 
  | 'restaurant' 
  | 'parking' 
  | 'hospital' 
  | 'other';

export interface PlaceContributionRequest {
  name: string;
  type: PlaceType;
  lat: number;
  lng: number;
  description: string;
  images: string[];
}

export interface Place extends PlaceContributionRequest {
  id: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PresignedUrlResponse {
  objectName: string;
  url: string;
  maxSize: number;
}
