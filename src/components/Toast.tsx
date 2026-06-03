import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ToastProps {
    message: string;
    onClose: () => void;
    duration?: number;
}

export function Toast({ message, onClose, duration = 4000 }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return createPortal(
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] animate-[slideUp_0.3s_ease-out] pointer-events-auto">
            <div className="bg-white text-gray-900 px-4 py-3 rounded-xl shadow-2xl border border-gray-200 flex items-center gap-3 min-w-[300px] max-w-md">
                <p className="text-sm flex-1">{message}</p>
                <button
                    onClick={onClose}
                    className="hover:bg-gray-100 rounded-full p-1 transition-colors"
                >
                    <X size={16} />
                </button>
            </div>
        </div>,
        document.body
    );
}
