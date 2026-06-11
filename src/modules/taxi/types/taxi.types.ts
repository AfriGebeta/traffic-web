export interface TaxiRoute {
    id: number;
    name: string;
    color: string;
    type: 'minibus' | 'taxi';
    geometry: any;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface TaxiNode {
    id: number;
    userId: number | null;
    nodeType: 'station' | 'stop';
    routeName: string;
    name: string;
    lat: number;
    lng: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface TaxiRouteStop {
    id: number;
    routeId: number;
    nodeId: number;
    sequenceIndex: number;
    fareFromStart: number;
    createdAt: string;
    updatedAt: string;
}

export interface Stop {
    id: string;
    name: string;
    lat: number;
    lng: number;
    type: 'station' | 'stop';
    existingNodeId?: number;
    isExisting: boolean;
}

export interface EdgePrice {
    from: number;
    to: number;
    fromName: string;
    toName: string;
    cost: string;
}

export interface AvailabilityWindow {
    routeId?: number;
    dayOfWeek: number;
    startMinutes: number;
    endMinutes: number;
    isAvailable: boolean;
}

export interface AvailabilitySchedule {
    [dayOfWeek: number]: AvailabilityWindow[];
}
