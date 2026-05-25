
import { useRef, useState, useEffect, useCallback } from "react";
import GebetaMap from "@gebeta/tiles";
import type { GebetaMapRef } from "@gebeta/tiles";
import { LocationButton } from "./LocationButton";
import { MapStyleButton } from "./MapStyleButton";
import { SearchBox } from "./SearchBox";
import { PlaceModal } from "./PlaceModal";
import { DirectionsPanel } from "./DirectionsPanel";
import { NearbyCategories } from "../../modules/nearby/components/NearbyCategories";
import { NearbyPlacesList } from "../../modules/nearby/components/NearbyPlacesList";
import { AuthAvatar } from "../../modules/auth/signup/components/auth-avatar";
import { BottomSheet } from "../../shared/components/BottomSheet";
import { useGeolocation } from "../hooks/useGeolocation";
import { useSearch } from "../hooks/useSearch";
import { addLocationMarker } from "../utils/mapMarkers";
import { getNavigation } from "../navigation/service";
import type { Waypoint } from "../navigation/types";
import { decodeRouteCoordinates, lngLatToApi, latLngToMap } from "../utils/navigationRoute";
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

async function processGebetaStyle(styleUrl: string, apiKey: string) {
  const response = await fetch(styleUrl);
  const style = await response.json();

  //replacing 
  if (style.sources) {
    Object.keys(style.sources).forEach(sourceKey => {
      const source = style.sources[sourceKey];

      if (source.tiles && Array.isArray(source.tiles)) {
        source.tiles = source.tiles.map((tile: string) => {
          const processed = tile.replace('~~TILE_ENDPOINT~~', 'https://tiles.gebeta.app/tiles');
          const separator = processed.includes('?') ? '&' : '?';
          return `${processed}${separator}apiKey=${apiKey}`;
        });
      }

      if (source.url) {
        source.url = source.url.replace('~~TILE_ENDPOINT~~', 'https://tiles.gebeta.app/tiles');
        const separator = source.url.includes('?') ? '&' : '?';
        source.url = `${source.url}${separator}apiKey=${apiKey}`;
      }
    });
  }


  if (style.glyphs) {
    style.glyphs = style.glyphs.replace('~~TILE_ENDPOINT~~', 'https://tiles.gebeta.app/tiles');
  }

  if (style.sprite) {
    style.sprite = style.sprite.replace('~~TILE_ENDPOINT~~', 'https://tiles.gebeta.app/tiles');
  }

  return style;
}

interface MapLibreInstance {
  flyTo: (options: {
    center: [number, number];
    zoom: number;
    essential: boolean;
    speed: number;
    curve: number;
  }) => void;
  setStyle: (styleUrl: string | Record<string, unknown>) => void;
  getCanvas?: () => HTMLCanvasElement;
}

interface MapInstance {
  getMapInstance: () => MapLibreInstance;
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
  const {
    results: waypointSearchResults,
    isSearching: isWaypointSearching,
    search: searchWaypoint,
    clearResults: clearWaypointSearch,
  } = useSearch();
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [isDirectionsActive, setIsDirectionsActive] = useState(false);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [isAddingStop, setIsAddingStop] = useState(false);
  const [isPickingOnMap, setIsPickingOnMap] = useState(false);
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const animationCleanup = useRef<(() => void) | null>(null);
  const waypointsRef = useRef<Waypoint[]>([]);
  const isPickingOnMapRef = useRef(false);

  const selectedPlaceRef = useRef<Place | null>(null);
  const userLocationRef = useRef<Coordinates | null>(null);

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
          "/assets/location-pin.svg",
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

  const clearRouteFromMap = useCallback(() => {
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
  }, []);

  const stopRouteAnimation = useCallback(() => {
    if (animationCleanup.current) {
      animationCleanup.current();
      animationCleanup.current = null;
    }
  }, []);

  const resetDirectionsUi = useCallback(() => {
    setIsAddingStop(false);
    setIsPickingOnMap(false);
    clearWaypointSearch();
  }, [clearWaypointSearch]);

  const handleCloseModal = () => {
    clearRouteFromMap();
    setIsDirectionsActive(false);
    setWaypoints([]);
    resetDirectionsUi();
    setSelectedPlace(null);
  };

  const handleCloseDirections = () => {
    clearRouteFromMap();
    setIsDirectionsActive(false);
    setWaypoints([]);
    resetDirectionsUi();
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
        () => { },
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
        () => { },
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

  const drawRouteMarkers = useCallback(
    (
      map: MapInstance,
      origin: Coordinates,
      stops: Waypoint[],
      destination: Place,
    ) => {
      map.addImageMarker(
        origin,
        "/pin.svg",
        [30, 30],
        () => {},
        10,
        "Your Location",
      );

      stops.forEach((wp, index) => {
        const label = wp.name || `Stop ${index + 1}`;
        map.addImageMarker(
          latLngToMap(wp.lat, wp.lng),
          "/assets/location-pin-2.png",
          [30, 30],
          () => {},
          10,
          `<b>${label}</b>`,
        );
      });

      map.addImageMarker(
        latLngToMap(destination.latitude, destination.longitude),
        "/assets/location-pin.svg",
        [30, 30],
        () => {},
        10,
        `<b>${destination.name}</b>`,
      );
    },
    [],
  );

  const fetchAndDrawRoute = useCallback(
    async (stops: Waypoint[]) => {
      const destination = selectedPlaceRef.current;
      if (!destination || !mapRef.current) return;

      setIsRouteLoading(true);

      try {
        let origin = userLocationRef.current;

        if (!origin) {
          origin = await getCurrentLocation();
          setUserLocation(origin);
          userLocationRef.current = origin;
        }

        const originApi = lngLatToApi(origin);
        const destinationApi: [number, number] = [
          destination.latitude,
          destination.longitude,
        ];
        const waypointsApi = stops.map(
          (wp) => [wp.lat, wp.lng] as [number, number],
        );

        const response = await getNavigation(
          originApi,
          destinationApi,
          waypointsApi,
        );

        const legs = response.data?.trip?.legs;
        if (!legs?.length) return;

        const routeCoordinates = decodeRouteCoordinates(legs);
        if (routeCoordinates.length === 0) return;

        const map = mapRef.current as unknown as MapInstance;
        map.clearMarkers();
        map.clearPaths();
        map.addPath(routeCoordinates, "#ffa500", 5);

        drawRouteMarkers(map, origin, stops, destination);

        if (animationCleanup.current) {
          animationCleanup.current();
          animationCleanup.current = null;
        }

        const cleanup = animateMarkerAlongRoute({
          map,
          coordinates: routeCoordinates,
          duration: 10000,
          onUpdate: (position) => {
            map.clearMarkers();
            drawRouteMarkers(map, origin!, stops, destination);
            map.addImageMarker(
              position,
              "/pin.svg",
              [30, 30],
              () => {},
              20,
              "",
            );
          },
        });

        animationCleanup.current = cleanup;
      } catch (error) {
        console.error("Navigation error:", error);
        alert("Unable to get directions. Please try again.");
      } finally {
        setIsRouteLoading(false);
      }
    },
    [getCurrentLocation, drawRouteMarkers],
  );

  useEffect(() => { waypointsRef.current = waypoints; }, [waypoints]);
  useEffect(() => { isPickingOnMapRef.current = isPickingOnMap; }, [isPickingOnMap]);
  useEffect(() => { selectedPlaceRef.current = selectedPlace; }, [selectedPlace]);
  useEffect(() => { userLocationRef.current = userLocation; }, [userLocation]);

  const appendWaypoint = useCallback(
    (waypoint: Waypoint) => {
      const updated = [...waypointsRef.current, waypoint];
      setWaypoints(updated);
      waypointsRef.current = updated;
      resetDirectionsUi();

      if (mapRef.current) {
        const map = mapRef.current as unknown as MapInstance;
        const label = waypoint.name || `Stop ${updated.length}`;
        map.addImageMarker(
          latLngToMap(waypoint.lat, waypoint.lng),
          "/assets/location-pin-2.png",
          [30, 30],
          () => {},
          15,
          `<b>${label}</b>`,
        );
      }

      void fetchAndDrawRoute(updated);
    },
    [fetchAndDrawRoute, resetDirectionsUi],
  );

  const handleDirections = async () => {
    if (!selectedPlace) return;

    selectedPlaceRef.current = selectedPlace;
    setIsDirectionsActive(true);
    setWaypoints([]);
    waypointsRef.current = [];
    resetDirectionsUi();
    await fetchAndDrawRoute([]);
  };

  const handleAddStopClick = () => {
    stopRouteAnimation();
    setIsAddingStop(true);
    setIsPickingOnMap(false);
    clearWaypointSearch();
  };

  const handleCancelAddStop = () => {
    resetDirectionsUi();
  };

  const handlePickOnMap = () => {
    stopRouteAnimation();
    setIsPickingOnMap(true);
  };

  const flyToCoords = useCallback((lng: number, lat: number) => {
    if (!mapRef.current) return;
    const map = mapRef.current as unknown as MapInstance;
    const mapInstance = map.getMapInstance();
    if (mapInstance?.flyTo) {
      mapInstance.flyTo({
        center: [lng, lat],
        zoom: 15,
        essential: true,
        speed: 1.8,
        curve: 1,
      });
    }
  }, []);

  const handleWaypointSelect = (place: Place) => {
    flyToCoords(place.longitude, place.latitude);
    appendWaypoint({
      id: crypto.randomUUID(),
      lat: place.latitude,
      lng: place.longitude,
      name: place.name,
    });
  };

  const handleRemoveWaypoint = (id: string) => {
    const updated = waypoints.filter((w) => w.id !== id);
    setWaypoints(updated);
    waypointsRef.current = updated;
    void fetchAndDrawRoute(updated);
  };

  const handleGebetaMapClick = useCallback(
    (lngLat: [number, number]) => {
      if (!isPickingOnMapRef.current) return;
      const [lng, lat] = lngLat;
      flyToCoords(lng, lat);
      appendWaypoint({
        id: crypto.randomUUID(),
        lat,
        lng,
      });
    },
    [appendWaypoint, flyToCoords],
  );

  useEffect(() => {
    if (!mapRef.current) return;

    const map = mapRef.current as unknown as MapInstance;
    const canvas = map.getMapInstance()?.getCanvas?.();
    if (!canvas) return;

    canvas.style.cursor = isPickingOnMap ? "crosshair" : "";

    return () => {
      canvas.style.cursor = "";
    };
  }, [isPickingOnMap]);

  const handleStyleChange = async (styleUrl: string) => {
    setMapStyle(styleUrl);

    if (mapRef.current) {
      const map = mapRef.current as unknown as MapInstance;
      const mapInstance = map.getMapInstance();

      if (mapInstance && mapInstance.setStyle) {
        let actualStyleUrl =
          styleUrl === "default"
            ? "https://tiles.gebeta.app/styles/standard/style.json"
            : styleUrl;

        if (actualStyleUrl.includes('tiles.gebeta.app/styles')) {
          try {
            const processedStyle = await processGebetaStyle(actualStyleUrl, apiKey);
            mapInstance.setStyle(processedStyle);
          } catch (error) {
            console.error("Error processing style:", error);
          }
        } else {
          mapInstance.setStyle(actualStyleUrl);
        }
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
        onMapClick={handleGebetaMapClick}
      />

      <div className="pointer-events-none">
        <div className="flex flex-col lg:flex-row lg:items-start gap-2">
          <div className="">
            <div className="absolute top-4 left-4 right-18 md:right-12 pointer-events-auto z-[500]">
              <SearchBox
                onPlaceSelect={handlePlaceSelect}
                isSearching={isSearching}
                results={results}
                onSearch={search}
                onClear={clearResults}
              />
            </div>

            <div className="absolute top-16 md:top-[12px] left-0 md:left-[460px] right-0 md:right-12 mt-2 pointer-events-auto z-[500]">
              <NearbyCategories
                selectedCategory={selectedCategory}
                onCategorySelect={handleCategorySelect}
                onClearCategory={handleClearCategory}
              />
            </div>

            {selectedPlace && (
              <div className="absolute top-[72px] left-4 right-4 md:left-4 md:right-auto md:w-[440px] pointer-events-auto z-[500]">
                {isDirectionsActive ? (
                  <DirectionsPanel
                    destination={selectedPlace}
                    waypoints={waypoints}
                    isAddingStop={isAddingStop}
                    isPickingOnMap={isPickingOnMap}
                    isLoading={isRouteLoading}
                    waypointSearchResults={waypointSearchResults}
                    isWaypointSearching={isWaypointSearching}
                    onAddStopClick={handleAddStopClick}
                    onCancelAddStop={handleCancelAddStop}
                    onWaypointSearch={searchWaypoint}
                    onWaypointSelect={handleWaypointSelect}
                    onPickOnMap={handlePickOnMap}
                    onRemoveWaypoint={handleRemoveWaypoint}
                    onClose={handleCloseDirections}
                  />
                ) : (
                  <PlaceModal
                    place={selectedPlace}
                    onClose={handleCloseModal}
                    onDirections={handleDirections}
                  />
                )}
              </div>
            )}

            {showNearbyList && nearbyPlaces.length > 0 && !selectedPlace && (
              <div className="absolute top-[72px] left-4 right-4 md:left-4 md:right-auto md:w-[440px] pointer-events-auto z-[500]">
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

      <div className="absolute top-4 right-4 z-[500]">
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
