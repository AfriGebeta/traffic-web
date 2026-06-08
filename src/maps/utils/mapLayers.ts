interface MapLibreMap {
    addSource: (id: string, config: any) => void;
    addLayer: (config: any) => void;
    getSource: (id: string) => any;
    removeLayer: (id: string) => void;
    removeSource: (id: string) => void;
}

export function addDashedRoute(
    mapInstance: MapLibreMap,
    coordinates: [number, number][],
    color: string,
    width: number,
    sourceId: string = 'dashed-route',
    layerId: string = 'dashed-route-layer'
) {
    try {
        if (mapInstance.getSource(sourceId)) {
            mapInstance.removeLayer(layerId);
            mapInstance.removeSource(sourceId);
        }
    } catch (e) {
    }

    mapInstance.addSource(sourceId, {
        type: 'geojson',
        data: {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'LineString',
                coordinates: coordinates,
            },
        },
    });

    mapInstance.addLayer({
        id: layerId,
        type: 'line',
        source: sourceId,
        layout: {
            'line-join': 'round',
            'line-cap': 'round',
        },
        paint: {
            'line-color': color,
            'line-width': width,
            'line-dasharray': [1, 3],
            'line-opacity': 1,
        },
    });
}

export function removeDashedRoute(
    mapInstance: MapLibreMap,
    sourceId: string = 'dashed-route',
    layerId: string = 'dashed-route-layer'
) {
    try {
        if (mapInstance.getSource(sourceId)) {
            mapInstance.removeLayer(layerId);
            mapInstance.removeSource(sourceId);
        }
    } catch (e) {
  }
}
