import { useState } from 'react';
import { Compass, Plus } from 'lucide-react';
import { colors } from '@/shared/theme/colors';
import { ContributeForm } from '@/modules/places/components/ContributeForm';
import { ContributeIncidentForm } from '@/modules/incidents/components/ContributeIncidentForm';
import { ContributeChoiceModal } from '@/shared/components/ContributeChoiceModal';
import { ExploreDrawer } from '@/modules/explore/components/ExploreDrawer';

type ContributeView = 'choice' | 'place' | 'incident' | null;

interface BottomSheetProps {
    userLocation: [number, number] | null;
    onExplorePlaceClick: (place: any) => void;
}

export function BottomSheet({ userLocation, onExplorePlaceClick }: BottomSheetProps) {
    const [contributeView, setContributeView] = useState<ContributeView>(null);
    const [showExploreDrawer, setShowExploreDrawer] = useState(false);
    const [exploreLocation, setExploreLocation] = useState<{ lat: number; lng: number } | null>(null);

    const initialCoordinates = userLocation
        ? { lng: userLocation[0], lat: userLocation[1] }
        : undefined;

    const closeContribute = () => setContributeView(null);

    const handlePlaceSuccess = () => {
        closeContribute();
        alert('Place submitted successfully!');
    };

    const handleIncidentSuccess = () => {
        closeContribute();
        alert('Incident reported successfully!');
    };

    const handleExploreClick = () => {
        if (!userLocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const loc = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    setExploreLocation(loc);
                    setShowExploreDrawer(true);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setShowExploreDrawer(true);
                }
            );
        } else {
            const loc = { lng: userLocation[0], lat: userLocation[1] };
            setExploreLocation(loc);
            setShowExploreDrawer(true);
        }
    };

    const handlePlaceClick = (place: any) => {
        onExplorePlaceClick(place);
        setShowExploreDrawer(false);
    };

    return (
        <>
            <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[1000]">
                <div className="bg-white rounded-2xl shadow-2xl px-6 py-3 border border-gray-200">
                    <div className="flex items-center gap-8">
                        <button
                            onClick={handleExploreClick}
                            className="flex flex-col items-center gap-1 transition-all"
                        >
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
                                style={{ backgroundColor: colors.primary.main }}
                            >
                                <Compass size={20} color="white" />
                            </div>
                            <span className="text-xs text-gray-700">Explore</span>
                        </button>

                        <button
                            onClick={() => setContributeView('choice')}
                            className="flex flex-col items-center gap-1 transition-all"
                        >
                            <div
                                className="w-12 h-12 rounded-full flex items-center justify-center transition-all"
                                style={{ backgroundColor: colors.primary.main }}
                            >
                                <Plus size={20} color="white" />
                            </div>
                            <span className="text-xs text-gray-700">Contribute</span>
                        </button>
                    </div>
                </div>
            </div>

            {contributeView === 'choice' && (
                <ContributeChoiceModal
                    onClose={closeContribute}
                    onSelectPlace={() => setContributeView('place')}
                    onSelectIncident={() => setContributeView('incident')}
                />
            )}

            {contributeView === 'place' && (
                <ContributeForm
                    onClose={closeContribute}
                    onSuccess={handlePlaceSuccess}
                    initialCoordinates={initialCoordinates}
                />
            )}

            {contributeView === 'incident' && (
                <ContributeIncidentForm
                    onClose={closeContribute}
                    onSuccess={handleIncidentSuccess}
                    initialCoordinates={initialCoordinates}
                />
            )}

            <ExploreDrawer
                open={showExploreDrawer}
                onOpenChange={setShowExploreDrawer}
                userLocation={exploreLocation}
                onPlaceClick={handlePlaceClick}
            />
        </>
    );
}
