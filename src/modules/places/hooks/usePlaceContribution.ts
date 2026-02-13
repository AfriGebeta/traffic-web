import { useState } from 'react';
import { placeService } from '../services/place.service';
import type { PlaceType } from '../types/place.types';

interface ContributeData {
    name: string;
    type: PlaceType;
    lat: number;
    lng: number;
    description: string;
    images: string[];
}

export function usePlaceContribution() {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const submitPlace = async (data: ContributeData, onSuccess: () => void) => {
        setError('');
        setSubmitting(true);

        try {
            await placeService.contributePlace(data);
            onSuccess();
        } catch (err) {
            setError('Failed to submit place. Please try again.');
            console.error('Submit error:', err);
        } finally {
            setSubmitting(false);
        }
    };

    return {
        submitting,
        error,
        submitPlace,
        setError,
    };
}
