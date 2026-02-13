import { useRef, useState } from 'react';
import GebetaMap from '@gebeta/tiles';
import type { GebetaMapRef } from '@gebeta/tiles';
import { LocationButton } from './LocationButton';
import { SearchBox } from './SearchBox';
import { PlaceModal } from './PlaceModal';
import { NearbyCategories } from '../../modules/nearby/components/NearbyCategories';
import { NearbyPlacesList } from '../../modules/nearby/components/NearbyPlacesList';
import { AuthAvatar } from '../../modules/auth/signup/components/auth-avatar';
import { useGeolocation } from '../hooks/useGeolocation';
import { useSearch } from '../hooks/useSearch';
import { addLocationMarker } from '../utils/mapMarkers';
import { getNavigation } from '../navigation/service';
import { decodePolyline } from '@/shared/utils/polyline';
import { animateMarkerAlongRoute } from '../utils/animateMarker';
import { searchNearbyPlaces } from '../../modules/nearby/services/service';
import { PLACE_CATEGORIES, type CategoryKey } from '../../modules/nearby/types/types';
import type { Place } from '../types/place';
import type { NearbyPlace } from '../../modules/nearby/types/types';
import type { Coordinates } from '../hooks/useGeolocation';

const apiKey = import.meta.env.VITE_GEBETA_API_KEY;

export function Map() {
  const mapRef = useRef<GebetaMapRef>(null);
  const { isLocating, getCurrentLocation } = useGeolocation();
  const { results, isSearching, search, clearResults } = useSearch();
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const animationCleanup = useRef<(() => void) | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const [showNearbyList, setShowNearbyList] = useState(false);

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

  const handleCategorySelect = async (category: CategoryKey) => {
    setSelectedCategory(category);
    setShowNearbyList(true);

    try {
      let location = userLocation;
      if (!location) {
        location = await getCurrentLocation();
        setUserLocation(location);
      }

      const placeType = PLACE_CATEGORIES[category].id;
      const places = await searchNearbyPlaces(location[1], location[0], placeType);
      setNearbyPlaces(places);

      if (mapRef.current) {
        const map = mapRef.current as any;
        map.clearMarkers();
        const markerIcon = PLACE_CATEGORIES[category].markerIcon;

        places.forEach((place) => {
          map.addImageMarker(
            [place.longitude, place.latitude],
            markerIcon,
            [30, 30],
            () => handleNearbyPlaceClick(place),
            10,
            `<b>${place.name}</b>`
          );
        });
      }
    } catch (error) {
      console.error('Error fetching nearby places:', error);
    }
  };

  const handleClearCategory = () => {
    setSelectedCategory(null);
    setNearbyPlaces([]);
    setShowNearbyList(false);

    if (mapRef.current) {
      const map = mapRef.current as any;
      map.clearMarkers();
    }
  };

  const handleNearbyPlaceClick = (place: NearbyPlace) => {
    const placeData: Place = {
      name: place.name,
      latitude: place.latitude,
      longitude: place.longitude,
      City: place.City,
      Country: place.Country,
      type: place.type,
    };
    setSelectedPlace(placeData);
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

      <div className="absolute top-4 left-4 right-12 z-[1000] pointer-events-none">
        <div className="flex flex-col lg:flex-row gap-2">
          {/* Search Box */}
          <div className="w-full lg:w-[30%] pointer-events-auto">
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

            {/* Nearby Places List - under search */}
            {showNearbyList && nearbyPlaces.length > 0 && (
              <div className="mt-2">
                <NearbyPlacesList
                  places={nearbyPlaces}
                  isLoading={false}
                  onPlaceClick={handleNearbyPlaceClick}
                />
              </div>
            )}
          </div>

          {/* Nearby Categories - stays at top right */}
          <div className="w-full lg:flex-1 pointer-events-auto">
            <NearbyCategories
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
              onClearCategory={handleClearCategory}
            />
          </div>
        </div>
      </div>

      <LocationButton onClick={handleLocationClick} isLocating={isLocating} />

      <div className="absolute bottom-4 left-4 z-[1000]">
        <AuthAvatar />
      </div>
    </div>
  );
}
