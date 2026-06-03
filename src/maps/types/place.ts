export interface Place {
  id: string;
  name: string;
  display_name: string;
  category: string;
  location: {
    lat: number;
    lng: number;
  };
  address: {
    city: string;
    country: string;
    country_code: string;
  };
  latitude?: number;
  longitude?: number;
  City?: string;
  Country?: string;
  type?: string;
}

export interface GeocodingResponse {
  response: Place[];
}


export function getPlaceLatitude(place: Place): number {
  return place.location?.lat ?? place.latitude ?? 0;
}

export function getPlaceLongitude(place: Place): number {
  return place.location?.lng ?? place.longitude ?? 0;
}

export function getPlaceCity(place: Place): string {
  return place.address?.city ?? place.City ?? '';
}

export function getPlaceCountry(place: Place): string {
  return place.address?.country ?? place.Country ?? '';
}

export function getPlaceType(place: Place): string {
  return place.category ?? place.type ?? 'place';
}
