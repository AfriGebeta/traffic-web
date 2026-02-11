import { useRef, useState } from 'react';
import GebetaMap from '@gebeta/tiles';
import type { GebetaMapRef } from '@gebeta/tiles';
import { LocationButton } from './LocationButton';
import { SearchBox } from './SearchBox';
import { PlaceModal } from './PlaceModal';
import { useGeolocation } from '../hooks/useGeolocation';
import { useSearch } from '../hooks/useSearch';
import { addLocationMarker } from '../utils/mapMarkers';
import { getNavigation } from '../navigation/service';
import { decodePolyline } from '@/shared/utils/polyline';
import { animateMarkerAlongRoute } from '../utils/animateMarker';
import type { Place } from '../types/place';
import type { Coordinates } from '../hooks/useGeolocation';

const apiKey = import.meta.env.VITE_GEBETA_API_KEY;

export function Map() {
  const mapRef = useRef<GebetaMapRef>(null);
  const { isLocating, getCurrentLocation } = useGeolocation();
  const { results, isSearching, search, clearResults } = useSearch();
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const animationCleanup = useRef<(() => void) | null>(null);

  const handleLocationClick = async () => {
    try {
      const location = await getCurrentLocation();
      setUserLocation(location);

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
    if (animationCleanup.current) {
      animationCleanup.current();
      animationCleanup.current = null;
    }

    if (mapRef.current) {
      const map = mapRef.current as any;
      map.clearMarkers();
      map.clearRoute();
      map.clearPaths();
    }

    setSelectedPlace(null);
  };

  const handleDirections = async () => {
    if (!selectedPlace) return;

    try {
      let origin = userLocation;

      if (!origin) {
        origin = await getCurrentLocation();
        setUserLocation(origin);
      }

      const originLatLon: [number, number] = [origin[1], origin[0]];
      const destination: [number, number] = [selectedPlace.latitude, selectedPlace.longitude];

      const response = await getNavigation(originLatLon, destination);

      if (response.data?.trip?.legs?.[0]?.shape && mapRef.current) {
        const encodedShape = response.data.trip.legs[0].shape;
        const decodedCoordinates = decodePolyline(encodedShape, 6);

        const routeCoordinates: [number, number][] = decodedCoordinates.map(
          ([lat, lon]) => [lon, lat]
        );

        const map = mapRef.current as any;
        map.addPath(routeCoordinates, '#ffa500', 5);

        // Add animated marker
        map.clearMarkers();

        // Start animation
        if (animationCleanup.current) {
          animationCleanup.current();
        }

        const cleanup = animateMarkerAlongRoute({
          map,
          coordinates: routeCoordinates,
          duration: 10000,
          onUpdate: (position) => {
            map.clearMarkers();
            map.addImageMarker(
              position,
              '/pin.svg',
              [30, 30],
              () => { },
              10,
              ''
            );
          },
        });

        animationCleanup.current = cleanup;
      }
    } catch (error) {
      console.error('Navigation error:', error);
      alert('Unable to get directions. Please try again.');
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
