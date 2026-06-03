import type { Costing } from '../navigation/types';
import { colors } from '@/shared/theme/colors';
import { Car, PersonStanding, Bike } from 'lucide-react';

interface NavigationModeSwitchProps {
    selectedMode: Costing;
    onModeChange: (mode: Costing) => void;
}

const modes: { value: Costing; Icon: typeof Car; label: string }[] = [
    { value: 'auto', Icon: Car, label: 'Drive' },
    { value: 'pedestrian', Icon: PersonStanding, label: 'Walk' },
    { value: 'bicycle', Icon: Bike, label: 'Bike' },
];

export function NavigationModeSwitch({
    selectedMode,
    onModeChange,
}: NavigationModeSwitchProps) {
    return (
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
            {modes.map((mode) => {
                const Icon = mode.Icon;
                return (
                    <button
                        key={mode.value}
                        onClick={() => onModeChange(mode.value)}
                        className={`flex-1 flex flex-col items-center gap-0.5 py-2 px-3 rounded-md transition-all text-xs font-medium ${selectedMode === mode.value
                            ? 'bg-white shadow-sm'
                            : 'hover:bg-gray-50'
                            }`}
                        style={{
                            color: selectedMode === mode.value ? colors.primary.main : '#6b7280',
                        }}
                    >
                        <Icon size={18} strokeWidth={2} />
                        <span className="text-[10px]">{mode.label}</span>
                    </button>
                );
            })}
        </div>
    );
}
