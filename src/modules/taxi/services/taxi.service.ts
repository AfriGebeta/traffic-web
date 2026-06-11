import type { TaxiRoute, TaxiNode, TaxiRouteStop } from '../types/taxi.types';

const TRAFFIC_API_BASE = import.meta.env.VITE_API_URL;

async function trafficRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${TRAFFIC_API_BASE}${endpoint}`;

    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        const message = `Request failed: ${response.statusText}`;
        throw new Error(message);
    }

    const result = await response.json();
    return result.data || result;
}

export const taxiService = {
    async createRoute(data: { name: string; color: string; type: 'minibus' | 'taxi' }): Promise<TaxiRoute> {
        return trafficRequest<TaxiRoute>('/api/taxi/routes', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    async createNode(data: {
        name: string;
        lat: number;
        lng: number;
        nodeType: 'station' | 'stop';
        routeName: string;
    }): Promise<TaxiNode> {
        return trafficRequest<TaxiNode>('/api/navigation/taxi/contributions/nodes', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    async getNodes(limit = 1000): Promise<TaxiNode[]> {
        return trafficRequest<TaxiNode[]>(`/api/navigation/taxi/contributions/nodes?limit=${limit}`);
    },

    async getAllNodes(limit = 1000): Promise<TaxiNode[]> {
        return trafficRequest<TaxiNode[]>(`/api/navigation/taxi/contributions/nodes?limit=${limit}`);
    },

    async addStopToRoute(routeId: number, data: { nodeId: number; fareFromStart: number }): Promise<TaxiRouteStop> {
        return trafficRequest<TaxiRouteStop>(`/api/taxi/routes/${routeId}/stops`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    async addAvailabilityWindow(data: {
        routeId: number;
        dayOfWeek: number;
        startMinutes: number;
        endMinutes: number;
        isAvailable: boolean;
    }): Promise<any> {
        return trafficRequest<any>('/api/navigation/taxi/availability-windows', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};
