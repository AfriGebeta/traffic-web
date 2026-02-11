import { useRef, useState } from 'react';
import GebetaMap from '@gebeta/tiles';
import type { GebetaMapRef } from '@gebeta/tiles';
import { LocationButton } from './LocationButton';
import { SearchBox } from './SearchBox';
import { PlaceModal } from './PlaceModal';
import { useGeolocation } from '../hooks/useGeolocation';
import { useSearch } from '../hooks/useSearch';
import { addLocationMarker } from '../utils/mapMarkers';
import type { Place } from '../types/place';

const apiKey = import.meta.env.VITE_GEBETA_API_KEY;

export function Map() {
  const mapRef = useRef<GebetaMapRef>(null);
  const { isLocating, getCurrentLocation } = useGeolocation();
  const { results, isSearching, search, clearResults } = useSearch();
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const handleLocationClick = async () => {
    try {
      const location = await getCurrentLocation();

      if (mapRef.current) {
        addLocationMarker(mapRef.current, location, 'your Location', '/pin.svg');
      }
    } catch (error) {
      console.error('error getting location:', error);
      alert('unable to get your location. please enable location services.');
    }
  };

  const handlePlaceSelect = (place: Place) => {
    if (mapRef.current) {
      const location: [number, number] = [place.longitude, place.latitude];
      addLocationMarker(mapRef.current, location, place.name, '/src/assets/location-pin.svg');
      setSelectedPlace(place);
    }
  };

  const handleCloseModal = () => {
    if (mapRef.current) {
      mapRef.current.clearMarkers();
    }
    setSelectedPlace(null);
  };

  const handleDirections = () => {
    if (selectedPlace) {
      alert(`directions to ${selectedPlace.name} -soon`);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      <GebetaMap
        ref={mapRef}
        apiKey={apiKey}
        center={[38.7578, 8.9806]}
        zoom={12}
      />

      <div className="absolute top-4 left-4 w-[calc(100%-5rem)] md:w-[30%] lg:w-[30%] xl:w-[30%] z-[1000]">
        <SearchBox
          onPlaceSelect={handlePlaceSelect}
          isSearching={isSearching}
          results={results}
          onSearch={search}
          onClear={clearResults}
          selectedPlace={selectedPlace}
        />

        {selectedPlace && (
          <div className="mt-2">
            <PlaceModal
              place={selectedPlace}
              onClose={handleCloseModal}
              onDirections={handleDirections}
            />
          </div>
        )}
      </div>

      <LocationButton onClick={handleLocationClick} isLocating={isLocating} />
    </div>
  );
}
