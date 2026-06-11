import { X, MapPin, AlertTriangle, Bus } from 'lucide-react';
import { colors } from '@/shared/theme/colors';

interface ContributeChoiceModalProps {
    onClose: () => void;
    onSelectPlace: () => void;
    onSelectIncident: () => void;
    onSelectTaxiRoute: () => void;
}

export function ContributeChoiceModal({ onClose, onSelectPlace, onSelectIncident, onSelectTaxiRoute }: ContributeChoiceModalProps) {
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[2000] p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">What would you like to contribute?</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>

                <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button
                        type="button"
                        onClick={onSelectPlace}
                        className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all text-left"
                    >
                        <div
                            className="w-14 h-14 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: colors.primary.main }}
                        >
                            <MapPin size={28} color="white" />
                        </div>
                        <div className="text-center">
                            <p className="font-semibold text-gray-800">Place</p>
                            <p className="text-sm text-gray-500 mt-1">Add a gas station, restaurant, or other point of interest</p>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={onSelectIncident}
                        className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all text-left"
                    >
                        <div
                            className="w-14 h-14 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: colors.primary.main }}
                        >
                            <AlertTriangle size={28} color="white" />
                        </div>
                        <div className="text-center">
                            <p className="font-semibold text-gray-800">Incident</p>
                            <p className="text-sm text-gray-500 mt-1">Report accidents, hazards, traffic jams, and more</p>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={onSelectTaxiRoute}
                        className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all text-left"
                    >
                        <div
                            className="w-14 h-14 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: colors.primary.main }}
                        >
                            <Bus size={28} color="white" />
                        </div>
                        <div className="text-center">
                            <p className="font-semibold text-gray-800">Taxi Route</p>
                            <p className="text-sm text-gray-500 mt-1">Add taxi or minibus routes with stops and fares</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
