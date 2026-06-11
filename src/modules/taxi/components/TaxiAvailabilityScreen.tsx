import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { colors } from '@/shared/theme/colors';
import type { AvailabilityWindow } from '../types/taxi.types';

interface TaxiAvailabilityScreenProps {
    routeName: string;
    routeId: number;
    onClose: () => void;
    onNext: (windows: AvailabilityWindow[]) => void;
    onBack: () => void;
}

const DAYS = [
    { id: -1, name: 'All Days' },
    { id: 0, name: 'Sunday' },
    { id: 1, name: 'Monday' },
    { id: 2, name: 'Tuesday' },
    { id: 3, name: 'Wednesday' },
    { id: 4, name: 'Thursday' },
    { id: 5, name: 'Friday' },
    { id: 6, name: 'Saturday' },
];

function minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

function timeToMinutes(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

export function TaxiAvailabilityScreen({ routeName, routeId, onClose, onNext, onBack }: TaxiAvailabilityScreenProps) {
    const [windows, setWindows] = useState<AvailabilityWindow[]>([]);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [startTime, setStartTime] = useState('05:00');
    const [endTime, setEndTime] = useState('22:00');
    const [isAvailable, setIsAvailable] = useState(true);
    const [error, setError] = useState('');

    const addWindow = () => {
        if (selectedDay === null) {
            setError('Select a day');
            return;
        }

        const startMinutes = timeToMinutes(startTime);
        const endMinutes = timeToMinutes(endTime);

        if (endMinutes <= startMinutes) {
            setError('End time must be after start time');
            return;
        }

        if (selectedDay === -1) {
            const newWindows = [0, 1, 2, 3, 4, 5, 6].map(day => ({
                routeId,
                dayOfWeek: day,
                startMinutes,
                endMinutes,
                isAvailable,
            }));
            setWindows([...windows, ...newWindows]);
        } else {
            setWindows([...windows, {
                routeId,
                dayOfWeek: selectedDay,
                startMinutes,
                endMinutes,
                isAvailable,
            }]);
        }

        setError('');
        setSelectedDay(null);
        setStartTime('05:00');
        setEndTime('22:00');
        setIsAvailable(true);
    };

    const removeWindow = (index: number) => {
        setWindows(windows.filter((_, i) => i !== index));
    };

    const getDayName = (dayOfWeek: number) => {
        return DAYS.find(d => d.id === dayOfWeek)?.name || '';
    };

    return (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-[2000] p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-xl border border-gray-200">
                <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Operating Times</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Step 3 of 3  {routeName}</p>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full">
                        <X size={20} className="text-gray-600" />
                    </button>
                </div>

                <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                    <div className="p-6 space-y-5">
                        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                            Optional - skip if route runs 24/7
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Day</label>
                                <select
                                    value={selectedDay ?? ''}
                                    onChange={(e) => setSelectedDay(e.target.value ? Number(e.target.value) : null)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                >
                                    <option value="">Select day...</option>
                                    {DAYS.map(day => (
                                        <option key={day.id} value={day.id}>{day.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Start</label>
                                    <input
                                        type="time"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">End</label>
                                    <input
                                        type="time"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isAvailable"
                                    checked={isAvailable}
                                    onChange={(e) => setIsAvailable(e.target.checked)}
                                    className="w-4 h-4 text-orange-500 border-gray-300 rounded"
                                />
                                <label htmlFor="isAvailable" className="text-sm text-gray-700">
                                    Available during this time
                                </label>
                            </div>

                            <button
                                type="button"
                                onClick={addWindow}
                                style={{ backgroundColor: colors.primary.main }}
                                className="w-full px-4 py-2.5 rounded-lg text-white text-sm font-medium flex items-center justify-center gap-2"
                            >
                                <Plus size={16} /> Add Window
                            </button>
                        </div>

                        {windows.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-gray-800">
                                    Time Windows ({windows.length})
                                </h3>
                                {windows.map((window, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white"
                                    >
                                        <div>
                                            <p className="font-medium text-sm">{getDayName(window.dayOfWeek)}</p>
                                            <p className="text-xs text-gray-600">
                                                {minutesToTime(window.startMinutes)} - {minutesToTime(window.endMinutes)}
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeWindow(index)}
                                            className="text-gray-400 hover:text-red-500"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
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
                        onClick={() => onNext(windows)}
                        style={{ backgroundColor: colors.primary.main }}
                        className="flex-1 px-4 py-2.5 rounded-lg text-white text-sm font-medium"
                    >
                        Finish
                    </button>
                </div>
            </div>
        </div>
    );
}
