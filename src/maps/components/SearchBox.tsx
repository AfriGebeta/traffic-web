import { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2, MapPin } from 'lucide-react';
import type { Place } from '../types/place';

interface SearchBoxProps {
    onPlaceSelect: (place: Place) => void;
    isSearching: boolean;
    results: Place[];
    onSearch: (query: string) => void;
    onClear: () => void;
    selectedPlace: Place | null;
}

export function SearchBox({
    onPlaceSelect,
    isSearching,
    results,
    onSearch,
    onClear,
    selectedPlace,
}: SearchBoxProps) {
    const [query, setQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const debounceTimer = useRef<number | undefined>(undefined);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (value: string) => {
        setQuery(value);
        setShowResults(true);

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        debounceTimer.current = setTimeout(() => {
            onSearch(value);
        }, 300);
    };

    const handlePlaceClick = (place: Place) => {
        setQuery(place.name);
        onPlaceSelect(place);
    };

    const handleClear = () => {
        setQuery('');
        setShowResults(false);
        onClear();
    };

    return (
        <div ref={searchRef} className="relative w-full max-w-md">
            <div className="flex items-center bg-white rounded-2xl shadow-md px-4 py-3 gap-3">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onFocus={() => setShowResults(true)}
                    placeholder="Search for places"
                    className="flex-1 border-none outline-none text-sm text-gray-900 min-w-0"
                />
                {isSearching && <Loader2 size={20} className="text-gray-600 animate-spin flex-shrink-0" />}
                {query && !isSearching && (
                    <button
                        onClick={handleClear}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                    >
                        <X size={20} className="text-gray-600" />
                    </button>
                )}
                <Search size={20} className="text-gray-600 flex-shrink-0" />
            </div>

            {showResults && query && !selectedPlace && (
                <>
                    {isSearching ? (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg z-[9999] border border-gray-200 px-4 py-6 text-center">
                            <Loader2 size={24} className="text-gray-400 animate-spin mx-auto" />
                        </div>
                    ) : results && results.length > 0 ? (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg max-h-96 overflow-y-auto z-[9999] border border-gray-200">
                            {results.map((place, index) => (
                                <div
                                    key={`${place.name}-${index}`}
                                    onClick={() => handlePlaceClick(place)}
                                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0 first:rounded-t-2xl last:rounded-b-2xl"
                                >
                                    <MapPin size={18} className="text-gray-600 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-gray-900 truncate">
                                            {place.name}
                                        </div>
                                        <div className="text-xs text-gray-600 truncate">
                                            {place.City}, {place.Country}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg z-[9999] border border-gray-200 px-4 py-6 text-center">
                            <div className="text-sm text-gray-500">No results found</div>
                            <div className="text-xs text-gray-400 mt-1">Try searching for a different place</div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
