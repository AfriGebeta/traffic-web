import { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { colors } from '@/shared/theme/colors';
import type { Stop, EdgePrice } from '../types/taxi.types';
import { taxiService } from '../services/taxi.service';
import { calculateFares } from '../utils/fareCalculator';

interface TaxiPricingScreenProps {
    routeName: string;
    stops: Stop[];
    onClose: () => void;
    onNext: (routeId: number) => void;
    onBack: () => void;
}

export function TaxiPricingScreen({ routeName, stops, onClose, onNext, onBack }: TaxiPricingScreenProps) {
    const [mainRouteFare, setMainRouteFare] = useState('');
    const [edgePrices, setEdgePrices] = useState<EdgePrice[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const updateEdgePrice = (from: number, to: number, cost: string) => {
        const existing = edgePrices.find(e => e.from === from && e.to === to);
        if (existing) {
            setEdgePrices(edgePrices.map(e =>
                e.from === from && e.to === to ? { ...e, cost } : e
            ));
        } else {
            setEdgePrices([...edgePrices, {
                from,
                to,
                fromName: stops[from].name,
                toName: stops[to].name,
                cost,
            }]);
        }
    };

    const handleSubmit = async () => {
        if (!mainRouteFare || parseFloat(mainRouteFare) <= 0) {
            setError('Enter a valid fare');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const route = await taxiService.createRoute({
                name: routeName,
                color: '#f97316',
                type: 'minibus'
            });

            const nodeIds: number[] = [];
            for (const stop of stops) {
                if (stop.existingNodeId) {
                    nodeIds.push(stop.existingNodeId);
                } else {
                    const node = await taxiService.createNode({
                        name: stop.name,
                        lat: stop.lat,
                        lng: stop.lng,
                        nodeType: stop.type,
                        routeName: routeName
                    });
                    nodeIds.push(node.id);
                }
            }

            const fares = calculateFares(stops, edgePrices, parseFloat(mainRouteFare));

            for (let i = 0; i < nodeIds.length; i++) {
                await taxiService.addStopToRoute(route.id, {
                    nodeId: nodeIds[i],
                    fareFromStart: fares[i]
                });
            }

            onNext(route.id);
        } catch (err: any) {
            console.error('Error:', err);
            setError(err.message || 'Failed to create route');
        } finally {
            setLoading(false);
        }
    };

    const getEdgePrice = (from: number, to: number) => {
        return edgePrices.find(e => e.from === from && e.to === to)?.cost || '';
    };

    return (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-[2000] p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-xl border border-gray-200">
                <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Set Prices</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Step 2 of 3 • {routeName}</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full">
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>

                <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="p-6 space-y-5">
                        <div className="border border-gray-300 p-4 rounded-lg">
                            <label className="text-sm font-semibold text-gray-800 mb-3 block">Main route fare</label>
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-gray-700">{stops[0]?.name}</span>
                                <ArrowRight size={16} className="text-gray-400" />
                                <span className="text-sm font-medium text-gray-700">{stops[stops.length - 1]?.name}</span>
                                <Input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="30"
                                    value={mainRouteFare}
                                    onChange={(e) => setMainRouteFare(e.target.value)}
                                    className="w-24"
                                />
                                <span className="text-sm text-gray-600">birr</span>
                            </div>
                        </div>

                        {stops.length > 2 && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-800 mb-1">Intermediate fares</h3>
                                <p className="text-xs text-gray-500 mb-3">Optional - leave empty to auto-calculate</p>

                                <div className="space-y-2">
                                    {stops.slice(0, -1).map((fromStop, fromIndex) => (
                                        <div key={fromIndex}>
                                            {stops.slice(fromIndex + 1).map((toStop, offset) => {
                                                const toIndex = fromIndex + offset + 1;
                                                const isMainRoute = fromIndex === 0 && toIndex === stops.length - 1;

                                                if (isMainRoute) return null;

                                                return (
                                                    <div key={toIndex} className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg">
                                                        <span className="text-xs font-medium text-gray-700 min-w-[100px]">{fromStop.name}</span>
                                                        <ArrowRight size={14} className="text-gray-400 shrink-0" />
                                                        <span className="text-xs font-medium text-gray-700 min-w-[100px]">{toStop.name}</span>
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            min="0"
                                                            placeholder=""
                                                            value={getEdgePrice(fromIndex, toIndex)}
                                                            onChange={(e) => updateEdgePrice(fromIndex, toIndex, e.target.value)}
                                                            className="w-20 h-8 text-sm"
                                                        />
                                                        <span className="text-xs text-gray-500">birr</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
                                {error}
                            </div>
                        )}
                    </div>
                </div>

                <div className="border-t border-gray-200 p-4 flex gap-3">
                    <button
                        type="button"
                        onClick={onBack}
                        className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Back
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading || !mainRouteFare}
                        style={{ backgroundColor: (loading || !mainRouteFare) ? '#d1d5db' : colors.primary.main }}
                        className="flex-1 px-4 py-2.5 rounded-lg text-white text-sm font-medium disabled:cursor-not-allowed"
                    >
                        {loading ? 'Creating...' : 'Continue'}
                    </button>
                </div>
            </div>
        </div>
    );
}
