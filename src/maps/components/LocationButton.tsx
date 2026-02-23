import { Crosshair } from 'lucide-react';

interface LocationButtonProps {
    onClick: () => void;
    isLocating: boolean;
}

export function LocationButton({ onClick, isLocating }: LocationButtonProps) {
    return (
        <>
            <button
                onClick={onClick}
                disabled={isLocating}
                className="location-button lg:!bottom-[76px]"
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
                    cursor: isLocating ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                    zIndex: 1100,
                }}
                onMouseEnter={(e) => {
                    if (!isLocating) {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                        e.currentTarget.style.transform = 'scale(1.05)';
                    }
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.transform = 'scale(1)';
                }}
            >
                <Crosshair
                    size={20}
                    color={isLocating ? '#9ca3af' : '#374151'}
                    style={{
                        animation: isLocating ? 'spin 1s linear infinite' : 'none'
                    }}
                />
            </button>

            <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </>
    );
}
