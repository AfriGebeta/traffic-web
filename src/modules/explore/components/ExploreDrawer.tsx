import { useEffect, useState } from 'react';
import {  X } from 'lucide-react';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';
import { CategorySection } from './CategorySection';
import { CategoryListView } from './CategoryListView';
import { useExplore } from '../hooks/useExplore';
import { EXPLORE_CATEGORIES } from '../types/types';
import type { ExplorePlace, ExploreCategory } from '../types/types';

interface ExploreDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    userLocation: { lat: number; lng: number } | null;
    onPlaceClick: (place: ExplorePlace) => void;
}

export function ExploreDrawer({
    open,
    onOpenChange,
    userLocation,
    onPlaceClick,
}: ExploreDrawerProps) {
    const { places, loading, fetchAllCategories } = useExplore();
    const [selectedCategory, setSelectedCategory] = useState<ExploreCategory | null>(null);

    useEffect(() => {
        console.log('ExploreDrawer useEffect:', { open, userLocation });
        if (open && userLocation) {
            console.log('Calling fetchAllCategories with:', userLocation);
            fetchAllCategories(userLocation.lat, userLocation.lng);
        }
    }, [open, userLocation]);

    const handleSeeMore = (categoryId: ExploreCategory) => {
        setSelectedCategory(categoryId);
    };

    const handleBack = () => {
        setSelectedCategory(null);
    };

    const getCategoryLabel = (categoryId: ExploreCategory) => {
        return EXPLORE_CATEGORIES.find(cat => cat.id === categoryId)?.label || '';
    };

    return (
        <Drawer open={open} onOpenChange={onOpenChange} direction="left">
            <DrawerContent className="h-full w-[90vw] max-w-md z-[2000]">
                {selectedCategory ? (
                    <CategoryListView
                        title={`${getCategoryLabel(selectedCategory)} Nearby`}
                        places={places[selectedCategory]}
                        onBack={handleBack}
                        onPlaceClick={onPlaceClick}
                    />
                ) : (
                    <>
                        <DrawerHeader className="border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <DrawerTitle className="text-xl font-semibold">
                                        Explore Nearby
                                    </DrawerTitle>
                                </div>
                                <DrawerClose asChild>
                                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                        <X size={20} className="text-gray-600" />
                                    </button>
                                </DrawerClose>
                            </div>
                        </DrawerHeader>

                        <div className="overflow-y-auto p-4 no-scrollbar">
                            {EXPLORE_CATEGORIES.map(category => (
                                <CategorySection
                                    key={category.id}
                                    title={`${category.label} Nearby`}
                                    places={places[category.id]}
                                    loading={loading[category.id]}
                                    onSeeMore={() => handleSeeMore(category.id)}
                                    onPlaceClick={onPlaceClick}
                                />
                            ))}

                            {!userLocation && (
                                <div className="text-center py-8 text-gray-500">
                                    <p>Enable location to explore nearby places</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    );
}
