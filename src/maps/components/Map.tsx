
import { useRef, useState, useEffect } from "react";
import GebetaMap from "@gebeta/tiles";
import type { GebetaMapRef } from "@gebeta/tiles";
import { LocationButton } from "./LocationButton";
import { MapStyleButton } from "./MapStyleButton";
import { SearchBox } from "./SearchBox";
import { PlaceModal } from "./PlaceModal";
import { NearbyCategories } from "../../modules/nearby/components/NearbyCategories";
import { NearbyPlacesList } from "../../modules/nearby/components/NearbyPlacesList";
import { AuthAvatar } from "../../modules/auth/signup/components/auth-avatar";
import { BottomSheet } from "../../shared/components/BottomSheet";
import { useGeolocation } from "../hooks/useGeolocation";
import { useSearch } from "../hooks/useSearch";
import { addLocationMarker } from "../utils/mapMarkers";
import { getNavigation } from "../navigation/service";
import { decodePolyline } from "@/shared/utils/polyline";
import { animateMarkerAlongRoute } from "../utils/animateMarker";
import { searchNearbyPlaces } from "../../modules/nearby/services/service";
import {
  PLACE_CATEGORIES,
  type CategoryKey,
} from "../../modules/nearby/types/types";
import type { Place } from "../types/place";
import type { NearbyPlace } from "../../modules/nearby/types/types";
import type { Coordinates } from "../hooks/useGeolocation";

const apiKey = import.meta.env.VITE_GEBETA_API_KEY;

interface MapInstance {
  getMapInstance: () => {
    flyTo: (options: {
      center: [number, number];
      zoom: number;
      essential: boolean;
      speed: number;
      curve: number;
    }) => void;
    setStyle: (styleUrl: string) => void;
  };
  clearMarkers: () => void;
  clearRoute: () => void;
  clearPaths: () => void;
  addImageMarker: (
    position: [number, number],
    icon: string,
    size: [number, number],
    onClick: () => void,
    zIndex: number,
    popup: string,
  ) => void;
  addPath: (coordinates: [number, number][], color: string, width: number) => void;
}

export function Map() {
  const mapRef = useRef<GebetaMapRef>(null);
  const { isLocating, getCurrentLocation } = useGeolocation();
  const { results, isSearching, search, clearResults } = useSearch();
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const animationCleanup = useRef<(() => void) | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(
    null,
  );
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const [showNearbyList, setShowNearbyList] = useState(false);
  const [mapStyle, setMapStyle] = useState<string>("default");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lat = params.get("lat");
    const lng = params.get("lng");
    const name = params.get("name");

    if (lat && lng && name) {
      const place: Place = {
        name: decodeURIComponent(name),
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        City: params.get("city") || "",
        Country: params.get("country") || "",
        type: params.get("type") || "place",
      };

      setTimeout(() => {
        setSelectedPlace(place);

        if (mapRef.current) {
          addLocationMarker(
            mapRef.current,
            [place.longitude, place.latitude],
            place.name,
            "/assets/location-pin.svg",
          );
        }
      }, 0);
    }
  }, []);

  const handleLocationClick = async () => {
    try {
      const location = await getCurrentLocation();
      setUserLocation(location);

      if (mapRef.current) {
        const map = mapRef.current as unknown as MapInstance;
        const mapInstance = map.getMapInstance();
        if (mapInstance && mapInstance.flyTo) {
          mapInstance.flyTo({
            center: location,
            zoom: 15,
            essential: true,
            speed: 2,
            curve: 1,
          });
        }

        addLocationMarker(
          mapRef.current,
          location,
          "your Location",
          "/pin.svg",
        );
      }
    } catch (error) {
      console.error("error getting location:", error);
      alert("unable to get your location. please enable location services.");
    }
  };

  const handlePlaceSelect = (place: Place) => {
    if (mapRef.current) {
      const location: [number, number] = [place.longitude, place.latitude];

      const map = mapRef.current as unknown as MapInstance;
      const mapInstance = map.getMapInstance();
      if (mapInstance && mapInstance.flyTo) {
        mapInstance.flyTo({
          center: location,
          zoom: 17,
          essential: true,
          speed: 2,
          curve: 1,
        });
      }

      addLocationMarker(
        mapRef.current,
        location,
        place.name,
        "/assets/location-pin.svg",
      );
      setSelectedPlace(place);
    }
  };

  const handleCloseModal = () => {
    if (animationCleanup.current) {
      animationCleanup.current();
      animationCleanup.current = null;
    }

    if (mapRef.current) {
      const map = mapRef.current as unknown as MapInstance;
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

      const places = await searchNearbyPlaces(
        location[1],
        location[0],
        placeType,
      );
      setNearbyPlaces(places);

      if (mapRef.current) {
        const map = mapRef.current as unknown as MapInstance;
        map.clearMarkers();
        const markerIcon = PLACE_CATEGORIES[category].markerIcon;

        places.forEach((place) => {
          map.addImageMarker(
            [place.longitude, place.latitude],
            markerIcon,
            [30, 30],
            () => handleNearbyPlaceClick(place),
            10,
            `<b>${place.name}</b>`,
          );
        });
      }
    } catch (error) {
      console.error("Error fetching nearby places:", error);
    }
  };

  const handleClearCategory = () => {
    setSelectedCategory(null);
    setNearbyPlaces([]);
    setShowNearbyList(false);

    if (mapRef.current) {
      const map = mapRef.current as unknown as MapInstance;
      map.clearMarkers();
    }
  };

  const handleNearbyPlaceClick = (place: NearbyPlace) => {
    if (mapRef.current) {
      const map = mapRef.current as unknown as MapInstance;

      map.clearMarkers();
      map.addImageMarker(
        [place.longitude, place.latitude],
        "/assets/location-pin.svg",
        [30, 30],
        () => {},
        10,
        `<b>${place.name}</b>`,
      );

      const mapInstance = map.getMapInstance();
      if (mapInstance && mapInstance.flyTo) {
        mapInstance.flyTo({
          center: [place.longitude, place.latitude],
          zoom: 17,
          essential: true,
          speed: 2,
          curve: 1,
        });
      }
    }

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

  const handleExplorePlaceClick = (place: Place) => {
    if (mapRef.current) {
      const map = mapRef.current as unknown as MapInstance;

      const mapInstance = map.getMapInstance();
      if (mapInstance && mapInstance.flyTo) {
        mapInstance.flyTo({
          center: [place.longitude, place.latitude],
          zoom: 17,
          essential: true,
          speed: 2,
          curve: 1,
        });
      }

      map.clearMarkers();

      map.addImageMarker(
        [place.longitude, place.latitude],
        "/assets/location-pin.svg",
        [30, 30],
        () => {},
        10,
        `<b>${place.name}</b>`,
      );
    } else {
      console.error("error!");
    }

    const placeData: Place = {
      name: place.name,
      latitude: place.latitude,
      longitude: place.longitude,
      City: place.City,
      Country: place.Country,
      type: place.type || "explore",
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
      const destination: [number, number] = [
        selectedPlace.latitude,
        selectedPlace.longitude,
      ];

      const response = await getNavigation(originLatLon, destination);

      if (response.data?.trip?.legs?.[0]?.shape && mapRef.current) {
        const encodedShape = response.data.trip.legs[0].shape;
        const decodedCoordinates = decodePolyline(encodedShape, 6);

        const routeCoordinates: [number, number][] = decodedCoordinates.map(
          ([lat, lon]) => [lon, lat],
        );

        const map = mapRef.current as unknown as MapInstance;
        map.addPath(routeCoordinates, "#ffa500", 5);

        map.clearMarkers();

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
              "/pin.svg",
              [30, 30],
              () => {},
              10,
              "",
            );
          },
        });

        animationCleanup.current = cleanup;
      }
    } catch (error) {
      console.error("Navigation error:", error);
      alert("Unable to get directions. Please try again.");
    }
  };

  const handleStyleChange = (styleUrl: string) => {
    setMapStyle(styleUrl);

    if (mapRef.current) {
      const map = mapRef.current as unknown as MapInstance;
      const mapInstance = map.getMapInstance();

      if (mapInstance && mapInstance.setStyle) {
        const actualStyleUrl =
          styleUrl === "default"
            ? "https://tiles.gebeta.app/styles/standard/style.json"
            : styleUrl;

        mapInstance.setStyle(actualStyleUrl);
      } else {
        console.error("Map style not available");
      }
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      <GebetaMap
        ref={mapRef}
        apiKey={apiKey}
        center={[38.7685, 9.0161]}
        zoom={12}
      />

      <div className="z-[1000] pointer-events-none">
        <div className="flex flex-col lg:flex-row lg:items-start gap-2">
          <div className="">
            <div className="absolute top-4 left-4 right-18 md:right-12 pointer-events-auto">
              <SearchBox
                onPlaceSelect={handlePlaceSelect}
                isSearching={isSearching}
                results={results}
                onSearch={search}
                onClear={clearResults}
              />
            </div>

            <div className="absolute top-16 md:top-[12px] left-0 md:left-[460px] right-0 md:right-12 mt-2 pointer-events-auto">
              <NearbyCategories
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
                onClearCategory={handleClearCategory}
              />
            </div>

            {selectedPlace && (
              <div className="absolute top-[72px] left-4 right-4 md:left-4 md:right-auto md:w-[440px] pointer-events-auto">
                <PlaceModal
                  place={selectedPlace}
                  onClose={handleCloseModal}
                  onDirections={handleDirections}
                />
              </div>
            )}

            {showNearbyList && nearbyPlaces.length > 0 && !selectedPlace && (
              <div className="absolute top-[72px] left-4 right-4 md:left-4 md:right-auto md:w-[440px] pointer-events-auto">
                <NearbyPlacesList
                  places={nearbyPlaces}
                  isLoading={false}
                  onPlaceClick={handleNearbyPlaceClick}
                  onClose={handleClearCategory}
                />
              </div>
            )}
          </div>

          <div className="hidden lg:block w-full lg:flex-1 pointer-events-auto">
            <NearbyCategories
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
              onClearCategory={handleClearCategory}
            />
          </div>
        </div>
      </div>

      <LocationButton onClick={handleLocationClick} isLocating={isLocating} />
      <MapStyleButton
        onStyleChange={handleStyleChange}
        currentStyle={mapStyle}
      />

      <div className="absolute top-4 right-4 z-[1000]">
        <AuthAvatar />
      </div>

      <BottomSheet
        userLocation={userLocation}
        onExplorePlaceClick={handleExplorePlaceClick}
      />

      <style>{`
        .maplibregl-ctrl-top-right {
          position: fixed !important;
          top: auto !important;
          bottom: 160px !important;
          right: 15px !important;
        }
        
        @media (min-width: 1024px) {
          .maplibregl-ctrl-top-right {
            bottom: 124px !important;
            right: 15px !important
          }
        }

        .maplibregl-ctrl-bottom-right,
        .maplibregl-ctrl-attrib {
          display: none !important;
        }
      `}</style>
    </div>
  );
}
