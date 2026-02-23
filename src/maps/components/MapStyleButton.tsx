import { useState } from 'react';
import { Layers } from 'lucide-react';

interface MapStyleButtonProps {
  onStyleChange: (styleUrl: string) => void;
  currentStyle: string;
}

const MAP_STYLES = [
  { name: 'Default', value: 'default', image: '/assets/default.JPG' },
  { name: 'Custom', value: '/map-styles/custom.json', image: '/assets/custom.JPG' },
  { name: 'Dark', value: '/map-styles/dark-custom.json', image: '/assets/dark.JPG' },
  { name: 'Satellite', value: '/map-styles/raster.json', image: '/assets/raster.JPG' },
];

export function MapStyleButton({ onStyleChange, currentStyle }: MapStyleButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleStyleSelect = (styleValue: string) => {
    onStyleChange(styleValue);
    setIsOpen(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="map-style-button lg:!bottom-[30px]"
        style={{
          position: 'fixed',
          bottom: '66px',
          right: '20px',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
          zIndex: 1100,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f3f4f6';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'white';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <Layers size={20} color="#374151" />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '66px',
            right: '66px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            padding: '8px',
            minWidth: '180px',
            zIndex: 1001,
          }}
        >
          {MAP_STYLES.map((style) => (
            <button
              key={style.value}
              onClick={() => handleStyleSelect(style.value)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                padding: '8px 12px',
                textAlign: 'left',
                border: 'none',
                backgroundColor: currentStyle === style.value ? '#f3f4f6' : 'transparent',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#374151',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                if (currentStyle !== style.value) {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }
              }}
              onMouseLeave={(e) => {
                if (currentStyle !== style.value) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <img
                src={style.image}
                alt={style.name}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '4px',
                  objectFit: 'cover',
                  border: '1px solid #e5e7eb'
                }}
              />
              <span>{style.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
