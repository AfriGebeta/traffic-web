import { X } from 'lucide-react';
import type { Place } from '../types/place';
import { colors } from '@/shared/theme/colors';

interface PlaceModalProps {
  place: Place;
  onClose: () => void;
  onDirections: () => void;
}

export function PlaceModal({ place, onClose, onDirections }: PlaceModalProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="relative p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900 pr-8">{place.name}</h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 hover:bg-gray-100 rounded-full p-1 transition-colors"
        >
          <X size={18} className="text-gray-700" />
        </button>
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-start gap-2">
          <span className="text-xs font-medium text-gray-500 min-w-20">Type:</span>
          <span className="text-xs text-gray-900">{place.type}</span>
        </div>
        
        <div className="flex items-start gap-2">
          <span className="text-xs font-medium text-gray-500 min-w-20">City:</span>
          <span className="text-xs text-gray-900">{place.City}</span>
        </div>
        
        <div className="flex items-start gap-2">
          <span className="text-xs font-medium text-gray-500 min-w-20">Country:</span>
          <span className="text-xs text-gray-900">{place.Country}</span>
        </div>
        
        <div className="flex items-start gap-2">
          <span className="text-xs font-medium text-gray-500 min-w-20">Coordinates:</span>
          <span className="text-xs text-gray-900">
            {place.latitude.toFixed(6)}, {place.longitude.toFixed(6)}
          </span>
        </div>
      </div>

      <div className="p-4 pt-2">
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
      </div>
    </div>
  );
}
