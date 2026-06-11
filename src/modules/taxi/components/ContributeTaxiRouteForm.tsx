import { useState } from 'react';
import { TaxiRouteBuilder } from './TaxiRouteBuilder';
import { TaxiPricingScreen } from './TaxiPricingScreen';
import { TaxiAvailabilityScreen } from './TaxiAvailabilityScreen';
import { TaxiSuccessScreen } from './TaxiSuccessScreen';
import type { Stop, AvailabilityWindow } from '../types/taxi.types';
import { taxiService } from '../services/taxi.service';

interface ContributeTaxiRouteFormProps {
    onClose: () => void;
    onSuccess: () => void;
    initialCoordinates?: { lat: number; lng: number };
}

type Screen = 'builder' | 'pricing' | 'availability' | 'success';

export function ContributeTaxiRouteForm({ onClose, onSuccess, initialCoordinates }: ContributeTaxiRouteFormProps) {
    const [screen, setScreen] = useState<Screen>('builder');
    const [routeName, setRouteName] = useState('');
    const [stops, setStops] = useState<Stop[]>([]);
    const [routeId, setRouteId] = useState<number | null>(null);

    const handleBuilderNext = (name: string, allStops: Stop[]) => {
        setRouteName(name);
        setStops(allStops);
        setScreen('pricing');
    };

    const handlePricingNext = (id: number) => {
        setRouteId(id);
        setScreen('availability');
    };

    const handleAvailabilityNext = async (windows: AvailabilityWindow[]) => {
        if (!routeId) {
            setScreen('success');
            return;
        }

        try {
            for (const window of windows) {
                await taxiService.addAvailabilityWindow({
                    routeId,
                    dayOfWeek: window.dayOfWeek,
                    startMinutes: window.startMinutes,
                    endMinutes: window.endMinutes,
                    isAvailable: window.isAvailable,
                });
            }
        } catch (error) {
            console.error('Error adding availability windows:', error);
        }

        setScreen('success');
    };

    const handleCreateAnother = () => {
        setRouteName('');
        setStops([]);
        setRouteId(null);
        setScreen('builder');
    };

    const handleFinalClose = () => {
        onSuccess();
        onClose();
    };

    if (screen === 'builder') {
        return (
            <TaxiRouteBuilder
                onClose={onClose}
                onNext={handleBuilderNext}
                initialCoordinates={initialCoordinates}
            />
        );
    }

    if (screen === 'pricing') {
        return (
            <TaxiPricingScreen
                routeName={routeName}
                stops={stops}
                onClose={onClose}
                onNext={handlePricingNext}
                onBack={() => setScreen('builder')}
            />
        );
    }

    if (screen === 'availability') {
        return (
            <TaxiAvailabilityScreen
                routeName={routeName}
                routeId={routeId!}
                onClose={onClose}
                onNext={handleAvailabilityNext}
                onBack={() => setScreen('pricing')}
            />
        );
    }

    return (
        <TaxiSuccessScreen
            routeName={routeName}
            stopCount={stops.length}
            onClose={handleFinalClose}
            onCreateAnother={handleCreateAnother}
        />
    );
}
