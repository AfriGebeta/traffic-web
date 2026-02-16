import { MapPin } from 'lucide-react';
import type { ExplorePlace } from '../types/types';

interface PlaceCardProps {
    place: ExplorePlace;
    onClick?: () => void;
}

export function PlaceCard({ place, onClick }: PlaceCardProps) {
    return (
        <div
            onClick={onClick}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
        >
            <div className="aspect-video bg-gray-100 flex items-center justify-center">
                <MapPin size={48} className="text-gray-300" />
            </div>
            <div className="p-3">
                <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">
                    {place.name}
                </h3>
                <p className="text-xs text-gray-500">
                    {place.City}, {place.Country}
                </p>
            </div>
        </div>
    );
}
