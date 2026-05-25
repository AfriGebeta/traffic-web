import { useState } from 'react';
import { X, Upload, MapPin, CheckCircle } from 'lucide-react';
import GebetaMap from '@gebeta/tiles';
import { Button } from '@/components/ui/button';
import { Field, FieldLabel, FieldDescription } from '@/components/ui/field';
import { colors } from '@/shared/theme/colors';
import { useImageUpload } from '@/modules/places/hooks/useImageUpload';
import { useMapMarker } from '@/modules/places/hooks/useMapMarker';
import { useIncidentContribution } from '../hooks/useIncidentContribution';
import { useIncidentTypes } from '../hooks/useIncidentTypes';

interface ContributeIncidentFormProps {
    onClose: () => void;
    onSuccess: () => void;
    initialCoordinates?: { lat: number; lng: number };
}

const apiKey = import.meta.env.VITE_GEBETA_API_KEY;

export function ContributeIncidentForm({ onClose, onSuccess, initialCoordinates }: ContributeIncidentFormProps) {
    const [typeId, setTypeId] = useState('');
    const [otherLabel, setOtherLabel] = useState('');
    const [description, setDescription] = useState('');

    const { types, loading: typesLoading, error: typesError } = useIncidentTypes();
    const { mapRef, coordinates, confirmed, confirmCenter, resetLocation } = useMapMarker(initialCoordinates);
    const { images, uploading, error: uploadError, handleUpload, removeImage } = useImageUpload('incidents');
    const { submitting, error: submitError, submitIncident, setError } = useIncidentContribution();

    const error = typesError || uploadError || submitError;
    const selectedTypeId = typeId || types[0]?.id || '';
    const selectedType = types.find(t => t.id === selectedTypeId);
    const isOther = selectedType?.label?.toLowerCase() === 'other' || selectedType?.name?.toLowerCase() === 'other';

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!coordinates || !confirmed) {
            setError('Please confirm a location on the map');
            return;
        }

        if (!selectedTypeId) {
            setError('Please select an incident type');
            return;
        }

        if (isOther && !otherLabel.trim()) {
            setError('Please describe the type of incident');
            return;
        }

        const fullDescription = isOther && otherLabel.trim()
            ? `[${otherLabel.trim()}] ${description}`.trim()
            : description;

        await submitIncident(
            {
                lat: coordinates.lat,
                lng: coordinates.lng,
                typeId: selectedTypeId,
                description: fullDescription,
                image: images,
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
                    <h2 className="text-2xl font-semibold text-gray-800">Report an Incident</h2>
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
                                    <FieldLabel htmlFor="type">Incident Type</FieldLabel>
                                    <select
                                        id="type"
                                        value={selectedTypeId}
                                        onChange={(e) => {
                                            setTypeId(e.target.value);
                                            setOtherLabel('');
                                        }}
                                        disabled={typesLoading || types.length === 0}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#fde2aeff] focus:shadow-[0_1px_3px_0_#fde2aeff] disabled:bg-gray-50"
                                    >
                                        {typesLoading && <option value="">Loading types...</option>}
                                        {!typesLoading && types.length === 0 && (
                                            <option value="">No types available</option>
                                        )}
                                        {types.map((t) => (
                                            <option key={t.id} value={t.id}>{t.label}</option>
                                        ))}
                                    </select>
                                </Field>

                                {isOther && (
                                    <Field>
                                        <FieldLabel htmlFor="otherLabel">Specify Incident Type</FieldLabel>
                                        <input
                                            id="otherLabel"
                                            type="text"
                                            placeholder="e.g. Road flooding, fallen tree…"
                                            value={otherLabel}
                                            onChange={(e) => setOtherLabel(e.target.value)}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#fde2aeff] focus:shadow-[0_1px_3px_0_#fde2aeff]"
                                        />
                                        <FieldDescription>Tell us what kind of incident this is</FieldDescription>
                                    </Field>
                                )}

                                <Field>
                                    <FieldLabel htmlFor="description">Description</FieldLabel>
                                    <textarea
                                        id="description"
                                        placeholder="Car accident on Bole Road"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={4}
                                        required
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
                                    <FieldDescription>Upload photos of the incident (optional)</FieldDescription>
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
                                disabled={submitting || uploading || !confirmed || typesLoading || types.length === 0}
                                style={{ backgroundColor: colors.primary.main }}
                                className="flex-1 text-white disabled:opacity-50"
                            >
                                {submitting ? 'Submitting...' : 'Report Incident'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
