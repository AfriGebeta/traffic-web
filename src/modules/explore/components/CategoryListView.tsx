import { ArrowLeft } from 'lucide-react';
import { PlaceCard } from './PlaceCard';
import type { ExplorePlace } from '../types/types';

interface CategoryListViewProps {
    title: string;
    places: ExplorePlace[];
    onBack: () => void;
    onPlaceClick: (place: ExplorePlace) => void;
}

export function CategoryListView({
    title,
    places,
    onBack,
    onPlaceClick,
}: CategoryListViewProps) {
    return (
        <div className="h-full flex flex-col">
            <div className="border-b border-gray-200 p-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft size={20} className="text-gray-600" />
                    </button>
                    <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                </div>
            </div>

            <div className="overflow-y-auto p-4 no-scrollbar">
                {places.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <p>No places found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {places.map((place, index) => (
                            <PlaceCard
                                key={index}
                                place={place}
                                onClick={() => onPlaceClick(place)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
