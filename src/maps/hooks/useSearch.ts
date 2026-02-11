import { useState, useCallback } from 'react';
import { searchPlaces } from '../services/geocoding';
import type { Place } from '../types/place';

interface SearchState {
  results: Place[];
  isSearching: boolean;
  error: string | null;
}

export function useSearch() {
  const [state, setState] = useState<SearchState>({
    results: [],
    isSearching: false,
    error: null,
  });

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setState({ results: [], isSearching: false, error: null });
      return;
    }

    setState((prev) => ({ ...prev, isSearching: true, error: null }));

    try {
      const results = await searchPlaces(query);
      setState({ results, isSearching: false, error: null });
    } catch (error) {
      console.error('Search error:', error);
      setState({
        results: [],
        isSearching: false,
        error: 'Failed to search places',
      });
    }
  }, []);

  const clearResults = useCallback(() => {
    setState({ results: [], isSearching: false, error: null });
  }, []);

  return {
    ...state,
    search,
    clearResults,
  };
}
