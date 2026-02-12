import { MapPin } from 'lucide-react';
import type { NearbyPlace } from '../types/types';

interface NearbyPlacesListProps {
  places: NearbyPlace[];
  isLoading: boolean;
  onPlaceClick: (place: NearbyPlace) => void;
}

export function NearbyPlacesList({
  places,
  isLoading,
  onPlaceClick,
}: NearbyPlacesListProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-4 text-center">
        <div className="text-sm text-gray-500">Loading nearby places...</div>
      </div>
    );
  }

  if (places.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-4 text-center">
        <div className="text-sm text-gray-500">No places found nearby</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md max-h-96 overflow-y-auto">
      {places.map((place, index) => (
        <div
          key={`${place.name}-${index}`}
          onClick={() => onPlaceClick(place)}
          className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0 first:rounded-t-2xl last:rounded-b-2xl"
        >
          <MapPin size={18} className="text-gray-600 flex-shrink-0 mt-1" />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {place.name}
            </div>
            <div className="text-xs text-gray-600 truncate">
              {place.City}, {place.Country}
            </div>
            <div className="text-xs text-gray-500 mt-1">{place.type}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
