import { X, Plus, Navigation } from 'lucide-react';
import type { Place } from '../types/place';
import type { Waypoint, Costing } from '../navigation/types';
import { colors } from '@/shared/theme/colors';
import { WaypointSearch } from './WaypointSearch';
import { NavigationModeSwitch } from './NavigationModeSwitch';

interface DirectionsPanelProps {
  destination: Place;
  waypoints: Waypoint[];
  isAddingStop: boolean;
  isPickingOnMap: boolean;
  isLoading: boolean;
  waypointSearchResults: Place[];
  isWaypointSearching: boolean;
  navigationMode: Costing;
  onAddStopClick: () => void;
  onCancelAddStop: () => void;
  onWaypointSearch: (query: string) => void;
  onWaypointSelect: (place: Place) => void;
  onPickOnMap: () => void;
  onRemoveWaypoint: (id: string) => void;
  onNavigationModeChange: (mode: Costing) => void;
  onClose: () => void;
}

export function DirectionsPanel({
  destination,
  waypoints,
  isAddingStop,
  isPickingOnMap,
  isLoading,
  waypointSearchResults,
  isWaypointSearching,
  navigationMode,
  onAddStopClick,
  onCancelAddStop,
  onWaypointSearch,
  onWaypointSelect,
  onPickOnMap,
  onRemoveWaypoint,
  onNavigationModeChange,
  onClose,
}: DirectionsPanelProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex items-center gap-3">
        <Navigation size={18} style={{ color: colors.primary.main }} />
        <h2 className="flex-1 text-base font-bold text-gray-900">Directions</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={18} className="text-gray-500" />
        </button>
      </div>

      <div className="px-4 pt-3 pb-3">
        <NavigationModeSwitch
          selectedMode={navigationMode}
          onModeChange={onNavigationModeChange}
        />
      </div>

      <div className="px-4 pt-1 pb-1">
        <div className="flex items-start gap-3 pb-2">
          <div className="flex flex-col items-center pt-1 shrink-0">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: colors.primary.main }}
            />
            <div className="w-px flex-1 mt-1" style={{ backgroundColor: '#e5e7eb', minHeight: 20 }} />
          </div>
          <div className="flex-1 min-w-0 pb-2">
            <p className="text-xs text-gray-400 leading-none mb-0.5">Origin</p>
            <p className="text-sm font-medium text-gray-900">Your location</p>
          </div>
        </div>

        {waypoints.map((wp, index) => (
          <div key={wp.id} className="flex items-start gap-3 pb-2">
            <div className="flex flex-col items-center pt-1 shrink-0">
              <div className="w-3 h-3 rounded-full bg-orange-400" />
              <div className="w-px flex-1 mt-1 bg-gray-200" style={{ minHeight: 20 }} />
            </div>
            <div className="flex-1 min-w-0 pb-2 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs text-gray-400 leading-none mb-0.5">Stop {index + 1}</p>
                <p className="text-sm font-medium text-gray-900 truncate">
                  {wp.name || `${wp.lat.toFixed(5)}, ${wp.lng.toFixed(5)}`}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onRemoveWaypoint(wp.id)}
                className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition-colors shrink-0 mt-0.5"
                aria-label={`Remove stop ${index + 1}`}
              >
                <X size={15} />
              </button>
            </div>
          </div>
        ))}

        {isAddingStop && (
          <div className="flex items-start gap-3 pb-2">
            <div className="flex flex-col items-center pt-1 shrink-0">
              <div className="w-3 h-3 rounded-full bg-orange-400" />
              <div className="w-px flex-1 mt-1 bg-gray-200" style={{ minHeight: 20 }} />
            </div>
            <div className="flex-1 min-w-0">
              <WaypointSearch
                isSearching={isWaypointSearching}
                results={waypointSearchResults}
                onSearch={onWaypointSearch}
                onSelect={onWaypointSelect}
                onCancel={onCancelAddStop}
                onPickOnMap={onPickOnMap}
                isPickingOnMap={isPickingOnMap}
              />
            </div>
          </div>
        )}

        <div className="flex items-start gap-3 pb-3">
          <div className="flex flex-col items-center pt-1 shrink-0">
            <div className="w-3 h-3 rounded-full bg-red-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 leading-none mb-0.5">Destination</p>
            <p className="text-sm font-medium text-gray-900 truncate">{destination.name}</p>
          </div>
        </div>
      </div>

      {!isAddingStop && (
        <div className="px-4 pb-4">
          <button
            type="button"
            onClick={onAddStopClick}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 border border-dashed border-gray-300 hover:border-orange-400 hover:bg-orange-50 disabled:opacity-50 text-gray-600 hover:text-orange-600 font-medium py-2 px-4 rounded-xl transition-all text-sm"
          >
            <Plus size={16} />
            Add stop
          </button>
        </div>
      )}

      {isLoading && (
        <div className="px-4 pb-3 text-xs text-center text-gray-400">
          Updating route…
        </div>
      )}

      {isPickingOnMap && (
        <div className="mx-4 mb-3 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg text-xs text-orange-700 text-center">
          Click anywhere on the map to place the stop
        </div>
      )}
    </div>
  );
}
