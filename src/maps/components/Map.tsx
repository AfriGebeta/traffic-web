import { useRef } from 'react';
import GebetaMap from '@gebeta/tiles';
import type { GebetaMapRef } from '@gebeta/tiles';
import { LocationButton } from './LocationButton';
import { useGeolocation } from '../hooks/useGeolocation';
import { addLocationMarker } from '../utils/mapMarkers';

const apiKey = import.meta.env.VITE_GEBETA_API_KEY;

export function Map() {
  const mapRef = useRef<GebetaMapRef>(null);
  const { isLocating, getCurrentLocation } = useGeolocation();

  const handleLocationClick = async () => {
    try {
      const location = await getCurrentLocation();
      
      if (mapRef.current) {
        addLocationMarker(mapRef.current, location);
      }
    } catch (error) {
      console.error('error getting location:', error);
      alert('unable to get your location. please enable location services.');
    }
  };

  return (
    <div style={{ height: '100vh', width: '100vw', overflow: 'hidden', position: 'relative' }}>
      <GebetaMap
        ref={mapRef}
        apiKey={apiKey}
        center={[38.7578, 8.9806]}
        zoom={12}
      />
      
      <LocationButton onClick={handleLocationClick} isLocating={isLocating} />
    </div>
  );
}
