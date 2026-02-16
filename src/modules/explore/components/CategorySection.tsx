import { ChevronRight } from 'lucide-react';
import { PlaceCard } from './PlaceCard';
import { colors } from '@/shared/theme/colors';
import type { ExplorePlace } from '../types/types';

interface CategorySectionProps {
    title: string;
    places: ExplorePlace[];
    loading: boolean;
    onSeeMore: () => void;
    onPlaceClick: (place: ExplorePlace) => void;
}

export function CategorySection({
    title,
    places,
    loading,
    onSeeMore,
    onPlaceClick,
}: CategorySectionProps) {
    const displayPlaces = places.slice(0, 2);

    if (loading) {
        return (
            <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    {[1, 2].map(i => (
                        <div key={i} className="bg-gray-100 rounded-lg h-40 animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    if (places.length === 0) {
        return null;
    }

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                <button
                    onClick={onSeeMore}
                    className="flex items-center gap-1 text-sm font-medium transition-colors"
                    style={{ color: colors.primary.main }}
                >
                    See More
                    <ChevronRight size={16} />
                </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
                {displayPlaces.map((place, index) => (
                    <PlaceCard
                        key={index}
                        place={place}
                        onClick={() => onPlaceClick(place)}
                    />
                ))}
            </div>
        </div>
    );
}
