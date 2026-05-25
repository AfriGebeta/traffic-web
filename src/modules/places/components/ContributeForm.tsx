import { useState } from 'react';
import { X, Upload, MapPin, CheckCircle } from 'lucide-react';
import GebetaMap from '@gebeta/tiles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel, FieldDescription } from '@/components/ui/field';
import { colors } from '@/shared/theme/colors';
import type { PlaceType } from '../types/place.types';
import { useImageUpload } from '../hooks/useImageUpload';
import { useMapMarker } from '../hooks/useMapMarker';
import { usePlaceContribution } from '../hooks/usePlaceContribution';

interface ContributeFormProps {
    onClose: () => void;
    onSuccess: () => void;
    initialCoordinates?: { lat: number; lng: number };
}

const PLACE_TYPES: { value: PlaceType; label: string }[] = [
    { value: 'gas_station', label: 'Gas Station' },
    { value: 'taxi_station', label: 'Taxi Station' },
    { value: 'repair_shop', label: 'Repair Shop' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'parking', label: 'Parking' },
    { value: 'hospital', label: 'Hospital' },
    { value: 'other', label: 'Other' },
];

const apiKey = import.meta.env.VITE_GEBETA_API_KEY;

export function ContributeForm({ onClose, onSuccess, initialCoordinates }: ContributeFormProps) {
    const [name, setName] = useState('');
    const [type, setType] = useState<PlaceType | ''>('');
    const [otherLabel, setOtherLabel] = useState('');
    const [description, setDescription] = useState('');

    const { mapRef, coordinates, confirmed, confirmCenter, resetLocation } = useMapMarker(initialCoordinates);
    const { images, uploading, error: uploadError, handleUpload, removeImage } = useImageUpload();
    const { submitting, error: submitError, submitPlace, setError } = usePlaceContribution();

    const error = uploadError || submitError;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!type) {
            setError('Please select a place type');
            return;
        }

        if (type === 'other' && !otherLabel.trim()) {
            setError('Please specify the type of place');
            return;
        }

        if (!coordinates || !confirmed) {
            setError('Please confirm a location on the map');
            return;
        }

        const fullDescription = type === 'other' && otherLabel.trim()
            ? `[${otherLabel.trim()}] ${description}`.trim()
            : description;

        await submitPlace(
            {
                name,
                type,
                lat: coordinates.lat,
                lng: coordinates.lng,
                description: fullDescription,
                images,
            },
            onSuccess
        );
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleUpload(e.target.files);
    };

    return (
        <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-[2000] p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-100">
                <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold text-gray-800">Contribute a Place</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} className="text-gray-600" />
                    </button>
                </div>

                <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <Field>
                                    <FieldLabel htmlFor="name">Place Name</FieldLabel>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Shell Gas Station"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="focus:!border-[#fde2aeff] focus:!shadow-[0_1px_3px_0_#fde2aeff] focus-visible:!ring-0"
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="type">Place Type</FieldLabel>
                                    <select
                                        id="type"
                                        value={type}
                                        onChange={(e) => {
                                            setType(e.target.value as PlaceType);
                                            setOtherLabel('');
                                        }}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#fde2aeff] focus:shadow-[0_1px_3px_0_#fde2aeff]"
                                    >
                                        <option value="" disabled>Select a type…</option>
                                        {PLACE_TYPES.map(pt => (
                                            <option key={pt.value} value={pt.value}>{pt.label}</option>
                                        ))}
                                    </select>
                                </Field>

                                {type === 'other' && (
                                    <Field>
                                        <FieldLabel htmlFor="otherLabel">Specify Place Type</FieldLabel>
                                        <input
                                            id="otherLabel"
                                            type="text"
                                            placeholder="e.g. Car wash, Pharmacy…"
                                            value={otherLabel}
                                            onChange={(e) => setOtherLabel(e.target.value)}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#fde2aeff] focus:shadow-[0_1px_3px_0_#fde2aeff]"
                                        />
                                        <FieldDescription>Tell us what kind of place this is</FieldDescription>
                                    </Field>
                                )}

                                <Field>
                                    <FieldLabel htmlFor="description">Description (optional)</FieldLabel>
                                    <textarea
                                        id="description"
                                        placeholder="24/7 gas station with convenience store"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#fde2aeff] focus:shadow-[0_1px_3px_0_#fde2aeff]"
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel>Images</FieldLabel>
                                    <div className="space-y-2">
                                        <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition-all">
                                            <Upload size={20} className="text-gray-500" />
                                            <span className="text-sm text-gray-600">
                                                {uploading ? 'Uploading...' : 'Click to upload images'}
                                            </span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleImageUpload}
                                                disabled={uploading}
                                                className="hidden"
                                            />
                                        </label>

                                        {images.length > 0 && (
                                            <div className="grid grid-cols-3 gap-2">
                                                {images.map((img, index) => (
                                                    <div key={index} className="relative group">
                                                        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                                                            <MapPin size={24} className="text-gray-400" />
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeImage(index)}
                                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                        <p className="text-xs text-gray-500 mt-1 truncate">{img.split('/').pop()}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <FieldDescription>Upload photos of the place (optional)</FieldDescription>
                                </Field>
                            </div>

                            <div className="space-y-4">
                                <Field>
                                    <FieldLabel>Location</FieldLabel>
                                    <div className="space-y-2">
                                        <div className="relative h-64 rounded-lg overflow-hidden border-2 border-gray-200">
                                            <GebetaMap
                                                ref={mapRef}
                                                apiKey={apiKey}
                                                center={initialCoordinates
                                                    ? [initialCoordinates.lng, initialCoordinates.lat]
                                                    : [38.7578, 8.9806]}
                                                zoom={initialCoordinates ? 15 : 12}
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 10 }}>
                                                <img
                                                    src="/assets/location-pin.svg"
                                                    style={{ width: 32, height: 32, transform: 'translateY(-50%)' }}
                                                    alt="location pin"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={confirmCenter}
                                                className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md border-2 text-sm font-medium transition-all"
                                                style={confirmed
                                                    ? { borderColor: colors.primary.main, color: colors.primary.main, backgroundColor: '#fff8ee' }
                                                    : { borderColor: '#d1d5db', color: '#374151' }
                                                }
                                            >
                                                <CheckCircle size={16} />
                                                {confirmed ? 'Confirmed' : 'Confirm Location'}
                                            </button>
                                            {confirmed && (
                                                <button
                                                    type="button"
                                                    onClick={resetLocation}
                                                    className="py-2 px-4 rounded-md border-2 border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
                                                >
                                                    Change
                                                </button>
                                            )}
                                        </div>

                                        {coordinates && confirmed && (
                                            <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                                <div>Latitude: {coordinates.lat.toFixed(6)}</div>
                                                <div>Longitude: {coordinates.lng.toFixed(6)}</div>
                                            </div>
                                        )}
                                    </div>
                                    <FieldDescription>
                                        Pan the map to your location, then confirm
                                    </FieldDescription>
                                </Field>
                            </div>
                        </div>

                        {error && (
                            <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                                {error}
                            </div>
                        )}

                        <div className="flex gap-3 pt-6 mt-6 border-t border-gray-100">
                            <Button
                                type="button"
                                onClick={onClose}
                                variant="outline"
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={submitting || uploading || !confirmed}
                                style={{ backgroundColor: colors.primary.main }}
                                className="flex-1 text-white disabled:opacity-50"
                            >
                                {submitting ? 'Submitting...' : 'Submit Place'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
