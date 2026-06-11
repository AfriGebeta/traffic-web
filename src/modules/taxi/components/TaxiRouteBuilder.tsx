import { useState, useRef, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import GebetaMap from '@gebeta/tiles';
import { Input } from '@/components/ui/input';
import { colors } from '@/shared/theme/colors';
import type { Stop, TaxiNode } from '../types/taxi.types';
import { taxiService } from '../services/taxi.service';
import { calculateDistance, formatDistance } from '../utils/distance';

interface TaxiRouteBuilderProps {
    onClose: () => void;
    onNext: (routeName: string, stops: Stop[]) => void;
    initialCoordinates?: { lat: number; lng: number };
}

const apiKey = import.meta.env.VITE_GEBETA_API_KEY;

export function TaxiRouteBuilder({ onClose, onNext, initialCoordinates }: TaxiRouteBuilderProps) {
    const [routeName, setRouteName] = useState('');
    const [startStation, setStartStation] = useState<Stop | null>(null);
    const [intermediateStops, setIntermediateStops] = useState<Stop[]>([]);
    const [endStation, setEndStation] = useState<Stop | null>(null);

    const [pickingFor, setPickingFor] = useState<'start' | 'intermediate' | 'end' | null>(null);
    const [showNameDialog, setShowNameDialog] = useState(false);
    const [pendingLocation, setPendingLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [tempName, setTempName] = useState('');
    const [tempType, setTempType] = useState<'station' | 'stop'>('station');

    const [allStations, setAllStations] = useState<TaxiNode[]>([]);
    const [nearbySuggestions, setNearbySuggestions] = useState<(TaxiNode & { distance: number })[]>([]);
    const [filteredSuggestions, setFilteredSuggestions] = useState<(TaxiNode & { distance: number })[]>([]);

    const mapRef = useRef<any>(null);

    const canProceed = routeName.trim() && startStation && endStation;

    useEffect(() => {
        const loadStations = async () => {
            try {
                const stations = await taxiService.getAllNodes(1000);
                setAllStations(stations);

                if (mapRef.current && stations.length > 0) {
                    const map = mapRef.current as any;
                    stations.forEach((station) => {
                        map.addImageMarker?.(
                            [station.lng, station.lat],
                            '/assets/minibus-selected.png',
                            [24, 24],
                            () => { },
                            5,
                            `<b>${station.name}</b><br/>${station.nodeType}`
                        );
                    });
                }
            } catch (error) {
                console.error('Failed to load stations:', error);
            }
        };

        loadStations();
    }, []);

    const handleMapClick = () => {
        if (!pickingFor || !mapRef.current) return;

        const map = mapRef.current as any;
        const mapInstance = map.getMapInstance?.();
        if (!mapInstance) return;

        const center = mapInstance.getCenter();
        const location = { lat: center.lat, lng: center.lng };
        setPendingLocation(location);

        const nearby = allStations
            .map((station) => ({
                ...station,
                distance: calculateDistance(location.lat, location.lng, station.lat, station.lng),
            }))
            .filter((station) => station.distance <= 1000)
            .sort((a, b) => a.distance - b.distance);

        setNearbySuggestions(nearby);
        setFilteredSuggestions(nearby.slice(0, 5));
        setTempName('');
        setTempType('station');
        setShowNameDialog(true);
    };

    const handleNameChange = (value: string) => {
        setTempName(value);

        if (value.trim()) {
            const filtered = nearbySuggestions
                .filter((station) => station.name.toLowerCase().includes(value.toLowerCase()))
                .slice(0, 5);
            setFilteredSuggestions(filtered);
        } else {
            setFilteredSuggestions(nearbySuggestions.slice(0, 5));
        }
    };

    const selectExistingStation = (station: TaxiNode & { distance: number }) => {
        const stop: Stop = {
            id: crypto.randomUUID(),
            name: station.name,
            lat: station.lat,
            lng: station.lng,
            type: station.nodeType,
            existingNodeId: station.id,
            isExisting: true,
        };

        if (pickingFor === 'start') setStartStation(stop);
        else if (pickingFor === 'intermediate') setIntermediateStops([...intermediateStops, stop]);
        else if (pickingFor === 'end') setEndStation(stop);

        setShowNameDialog(false);
        setPendingLocation(null);
        setPickingFor(null);
        setFilteredSuggestions([]);
    };

    const confirmLocation = () => {
        if (!pendingLocation || !tempName.trim() || !pickingFor) return;

        const newStop: Stop = {
            id: crypto.randomUUID(),
            name: tempName.trim(),
            lat: pendingLocation.lat,
            lng: pendingLocation.lng,
            type: tempType,
            isExisting: false,
        };

        if (pickingFor === 'start') setStartStation(newStop);
        else if (pickingFor === 'intermediate') setIntermediateStops([...intermediateStops, newStop]);
        else if (pickingFor === 'end') setEndStation(newStop);

        setShowNameDialog(false);
        setPendingLocation(null);
        setPickingFor(null);
        setFilteredSuggestions([]);
    };

    const removeIntermediateStop = (index: number) => {
        setIntermediateStops(intermediateStops.filter((_, i) => i !== index));
    };

    const handleNext = () => {
        if (!canProceed) return;
        const allStops = [startStation, ...intermediateStops, endStation].filter(Boolean) as Stop[];
        onNext(routeName, allStops);
    };

    return (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-[2000] p-4">
            <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-xl border border-gray-200">
                <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Add Route</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Step 1 of 3</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full">
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>

                <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="p-6">
                        <div className="grid lg:grid-cols-2 gap-6">
                            {/* Left column */}
                            <div className="space-y-5">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Route name</label>
                                    <Input
                                        type="text"
                                        placeholder="Bole → Megenagna"
                                        value={routeName}
                                        onChange={(e) => setRouteName(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-medium text-gray-700">Start</label>
                                        {!startStation && (
                                            <button
                                                type="button"
                                                onClick={() => setPickingFor('start')}
                                                className="text-sm font-medium text-orange-600 hover:text-orange-700"
                                            >
                                                + Add
                                            </button>
                                        )}
                                    </div>
                                    {startStation ? (
                                        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-300 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                <div>
                                                    <p className="font-medium text-sm">{startStation.name}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {startStation.type} {startStation.isExisting && '• Existing'}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setStartStation(null)}
                                                className="text-gray-400 hover:text-red-500"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-500">
                                            Not set
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-medium text-gray-700">Stops ({intermediateStops.length})</label>
                                        <button
                                            type="button"
                                            onClick={() => setPickingFor('intermediate')}
                                            className="text-sm font-medium text-orange-600 hover:text-orange-700"
                                        >
                                            + Add
                                        </button>
                                    </div>
                                    {intermediateStops.length > 0 ? (
                                        <div className="space-y-2 max-h-40 overflow-y-auto">
                                            {intermediateStops.map((stop, index) => (
                                                <div key={stop.id} className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-200 rounded-lg">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                                                        <div>
                                                            <p className="font-medium text-sm">{stop.name}</p>
                                                            {stop.isExisting && <p className="text-xs text-gray-500">Existing</p>}
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeIntermediateStop(index)}
                                                        className="text-gray-400 hover:text-red-500"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-3 border border-dashed border-gray-300 rounded-lg text-center text-xs text-gray-500">
                                            Optional
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-medium text-gray-700">End</label>
                                        {!endStation && (
                                            <button
                                                type="button"
                                                onClick={() => setPickingFor('end')}
                                                className="text-sm font-medium text-orange-600 hover:text-orange-700"
                                            >
                                                + Add
                                            </button>
                                        )}
                                    </div>
                                    {endStation ? (
                                        <div className="flex items-center justify-between p-3 bg-red-50 border border-red-300 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                                <div>
                                                    <p className="font-medium text-sm">{endStation.name}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {endStation.type} {endStation.isExisting && '• Existing'}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setEndStation(null)}
                                                className="text-gray-400 hover:text-red-500"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-500">
                                            Not set
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">Pick on map</label>
                                <div className="relative h-[450px] rounded-lg overflow-hidden border border-gray-200">
                                    <GebetaMap
                                        ref={mapRef}
                                        apiKey={apiKey}
                                        center={initialCoordinates ? [initialCoordinates.lng, initialCoordinates.lat] : [38.7578, 8.9806]}
                                        zoom={initialCoordinates ? 15 : 12}
                                    />
                                    {pickingFor && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 10 }}>
                                            <img
                                                src="/assets/location-pin.svg"
                                                style={{ width: 32, height: 32, transform: 'translateY(-50%)' }}
                                                alt="Pin"
                                            />
                                        </div>
                                    )}
                                </div>

                                {pickingFor && (
                                    <div className="mt-3">
                                        <p className="text-xs text-gray-600 mb-2">Move map, then confirm</p>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={handleMapClick}
                                                style={{ backgroundColor: colors.primary.main }}
                                                className="flex-1 px-3 py-2 rounded-lg text-white text-sm font-medium"
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setPickingFor(null)}
                                                className="px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 p-4 flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleNext}
                        disabled={!canProceed}
                        style={{ backgroundColor: canProceed ? colors.primary.main : '#d1d5db' }}
                        className="flex-1 px-4 py-2.5 rounded-lg text-white text-sm font-medium disabled:cursor-not-allowed"
                    >
                        Continue
                    </button>
                </div>
            </div>

            {showNameDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2100] p-4">
                    <div className="bg-white rounded-xl p-5 max-w-sm w-full shadow-2xl">
                        <h3 className="text-lg font-bold mb-4">Stop details</h3>

                        {filteredSuggestions.length > 0 && (
                            <div className="mb-3">
                                <p className="text-xs font-medium text-gray-700 mb-2">Nearby stations</p>
                                <div className="space-y-1 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-1">
                                    {filteredSuggestions.map((station) => (
                                        <button
                                            key={station.id}
                                            type="button"
                                            onClick={() => selectExistingStation(station)}
                                            className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm"
                                        >
                                            <p className="font-medium text-gray-900">{station.name}</p>
                                            <p className="text-xs text-gray-500">
                                                {station.nodeType} • {formatDistance(station.distance)} away
                                                {station.routeName && ` • ${station.routeName}`}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Or create new:</p>
                            </div>
                        )}

                        <div className="mb-3">
                            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Name</label>
                            <Input
                                type="text"
                                placeholder="Megenagna"
                                value={tempName}
                                onChange={(e) => handleNameChange(e.target.value)}
                                autoFocus
                            />
                        </div>

                        <div className="mb-4">
                            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Type</label>
                            <select
                                value={tempType}
                                onChange={(e) => setTempType(e.target.value as 'station' | 'stop')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            >
                                <option value="station">Station</option>
                                <option value="stop">Stop</option>
                            </select>
                        </div>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => { setShowNameDialog(false); setPendingLocation(null); setFilteredSuggestions([]); }}
                                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmLocation}
                                disabled={!tempName.trim()}
                                style={{ backgroundColor: tempName.trim() ? colors.primary.main : '#d1d5db' }}
                                className="flex-1 px-3 py-2 rounded-lg text-white text-sm font-medium disabled:cursor-not-allowed"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
