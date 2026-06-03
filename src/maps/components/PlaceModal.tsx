import { useState } from 'react';
import { X, Share2 } from 'lucide-react';
import type { Place } from '../types/place';
import { getPlaceLatitude, getPlaceLongitude, getPlaceCity, getPlaceCountry, getPlaceType } from '../types/place';
import { colors } from '@/shared/theme/colors';
import { Toast } from '@/components/Toast';

interface PlaceModalProps {
  place: Place;
  onClose: () => void;
  onDirections: () => void;
}

export function PlaceModal({ place, onClose, onDirections }: PlaceModalProps) {
  const [showToast, setShowToast] = useState(false);

  const handleNavigate = () => {
    const params = new URLSearchParams({
      navigate: 'true',
      lat: getPlaceLatitude(place).toString(),
      lng: getPlaceLongitude(place).toString(),
      name: place.name,
      city: getPlaceCity(place),
      country: getPlaceCountry(place),
      type: getPlaceType(place),
    });
    const schemeUrl = `trafficapp://?${params.toString()}`;
    window.location.href = schemeUrl;

    setTimeout(() => {
      setShowToast(true);
    }, 2500);
  };

  const handleShare = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set('lat', getPlaceLatitude(place).toString());
    url.searchParams.set('lng', getPlaceLongitude(place).toString());
    url.searchParams.set('name', encodeURIComponent(place.name));
    url.searchParams.set('city', getPlaceCity(place));
    url.searchParams.set('country', getPlaceCountry(place));
    url.searchParams.set('type', getPlaceType(place));

    const shareUrl = url.toString();

    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Failed to copy link');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="relative p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 pr-8">{place.name}</h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 hover:bg-gray-100 rounded-full p-1 transition-colors z-10 cursor-pointer"
          style={{ pointerEvents: 'auto' }}
        >
          <X size={18} className="text-gray-700" />
        </button>
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-start gap-2">
          <span className="text-xs font-medium text-gray-500 min-w-20">Type:</span>
          <span className="text-xs text-gray-900">{getPlaceType(place)}</span>
        </div>

        <div className="flex items-start gap-2">
          <span className="text-xs font-medium text-gray-500 min-w-20">City:</span>
          <span className="text-xs text-gray-900">{getPlaceCity(place)}</span>
        </div>

        <div className="flex items-start gap-2">
          <span className="text-xs font-medium text-gray-500 min-w-20">Country:</span>
          <span className="text-xs text-gray-900">{getPlaceCountry(place)}</span>
        </div>

        <div className="flex items-start gap-2">
          <span className="text-xs font-medium text-gray-500 min-w-20">Coordinates:</span>
          <span className="text-xs text-gray-900">
            {getPlaceLatitude(place).toFixed(6)}, {getPlaceLongitude(place).toFixed(6)}
          </span>
        </div>
      </div>

      <div className="p-4 pt-2 space-y-2">
        <button
          onClick={onDirections}
          className="w-full text-white font-medium py-2.5 px-4 rounded-xl transition-colors"
          style={{ backgroundColor: colors.primary.main }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.primary.dark;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colors.primary.main;
          }}
        >
          Directions
        </button>

        <button
          onClick={handleNavigate}
          className="w-full text-white font-medium py-2.5 px-4 rounded-xl transition-colors"
          style={{ backgroundColor: colors.primary.main }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.primary.dark;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colors.primary.main;
          }}
        >
          Navigate in App
        </button>

        <button
          onClick={handleShare}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <Share2 size={18} />
          Share
        </button>
      </div>

      {showToast && (
        <Toast
          message="App not installed. Download coming soon!"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
