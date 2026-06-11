import { Button } from '@/components/ui/button';
import { colors } from '@/shared/theme/colors';

interface TaxiSuccessScreenProps {
    routeName: string;
    stopCount: number;
    onClose: () => void;
    onCreateAnother: () => void;
}

export function TaxiSuccessScreen({ routeName, stopCount, onClose, onCreateAnother }: TaxiSuccessScreenProps) {
    return (
        <div className="fixed inset-0 bg-white bg-opacity-95 backdrop-blur-sm flex items-center justify-center z-[2000] p-4">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 p-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Route created</h2>

                <div className="bg-gray-50 rounded p-4 mb-6">
                    <p className="font-medium text-gray-900">{routeName}</p>
                    <p className="text-sm text-gray-600 mt-1">{stopCount} stops</p>
                </div>

                <div className="space-y-3">
                    <Button
                        type="button"
                        onClick={onCreateAnother}
                        style={{ backgroundColor: colors.primary.main }}
                        className="w-full text-white"
                    >
                        Create Another Route
                    </Button>
                    <Button
                        type="button"
                        onClick={onClose}
                        variant="outline"
                        className="w-full"
                    >
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
}
