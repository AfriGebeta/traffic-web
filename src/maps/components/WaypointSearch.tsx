import { useState, useRef, useEffect } from 'react';
import { X, Loader2, MapPin, Map } from 'lucide-react';
import type { Place } from '../types/place';

interface WaypointSearchProps {
  isSearching: boolean;
  results: Place[];
  onSearch: (query: string) => void;
  onSelect: (place: Place) => void;
  onCancel: () => void;
  onPickOnMap: () => void;
  isPickingOnMap: boolean;
}

export function WaypointSearch({
  isSearching,
  results,
  onSearch,
  onSelect,
  onCancel,
  onPickOnMap,
  isPickingOnMap,
}: WaypointSearchProps) {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    setShowResults(true);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = window.setTimeout(() => onSearch(value), 350);
  };

  const handleSelect = (place: Place) => {
    setQuery(place.name);
    setShowResults(false);
    onSelect(place);
  };

  return (
    <div ref={containerRef} className="space-y-1.5">
      {/* Input row */}
      <div className="flex items-center gap-1.5">
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => query && setShowResults(true)}
            placeholder="Search for a stop"
            autoFocus
            className="w-full pl-3 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#fde2aeff] focus:shadow-[0_1px_3px_0_#fde2aeff]"
          />
          {isSearching ? (
            <Loader2 size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />
          ) : query ? (
            <button
              type="button"
              onClick={() => { setQuery(''); onSearch(''); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-700 transition-colors shrink-0"
          aria-label="Cancel add stop"
        >
          <X size={15} />
        </button>
      </div>

      {showResults && query && results.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 max-h-44 overflow-y-auto">
          {results.map((place, index) => (
            <button
              key={`${place.id}-${index}`}
              type="button"
              onClick={() => handleSelect(place)}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 first:rounded-t-xl last:rounded-b-xl"
            >
              <MapPin size={14} className="text-gray-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{place.name}</p>
                <p className="text-xs text-gray-500 truncate">
                  {place.display_name || [place.address?.city || place.City, place.address?.country || place.Country].filter(Boolean).join(', ')}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {showResults && query && !isSearching && results.length === 0 && (
        <p className="text-xs text-gray-400 pl-1">No results found</p>
      )}

      <button
        type="button"
        onClick={onPickOnMap}
        className={`flex items-center gap-1.5 text-xs font-medium transition-colors pl-1 ${isPickingOnMap
          ? 'text-orange-600'
          : 'text-gray-500 hover:text-orange-600'
          }`}
      >
        <Map size={13} />
        {isPickingOnMap ? 'Click on the map to place stop…' : 'Choose on map'}
      </button>
    </div>
  );
}
