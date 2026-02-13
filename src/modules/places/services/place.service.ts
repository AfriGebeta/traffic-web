import { api } from '@/shared/services/api';
import type { Place, PlaceContributionRequest } from '../types/place.types';

export const placeService = {
  async contributePlace(data: PlaceContributionRequest): Promise<Place> {
    const response = await api.post<Place>('/api/places', data);
    return response;
  },
};
