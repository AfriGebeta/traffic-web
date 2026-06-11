import type { Stop, EdgePrice } from '../types/taxi.types';

export function calculateFares(
    stops: Stop[],
    edgePrices: EdgePrice[],
    mainRouteFare: number
): number[] {
    const fares: number[] = [];

    fares.push(0);

    for (let i = 1; i < stops.length; i++) {
        const userFare = edgePrices.find(e => e.from === 0 && e.to === i);

        if (userFare && userFare.cost && parseFloat(userFare.cost) > 0) {
            fares.push(parseFloat(userFare.cost));
        } else {
            const proportionalFare = (mainRouteFare / (stops.length - 1)) * i;
            fares.push(Math.round(proportionalFare * 100) / 100);
        }
    }

    return fares;
}
