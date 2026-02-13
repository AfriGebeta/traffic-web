import { Compass, Plus } from 'lucide-react';
import { colors } from '@/shared/theme/colors';

export function BottomSheet() {
    return (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[1000]">
            <div className="bg-white rounded-2xl shadow-2xl px-6 py-3 border border-gray-200">
                <div className="flex items-center gap-8">
                    <button
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
    );
}
