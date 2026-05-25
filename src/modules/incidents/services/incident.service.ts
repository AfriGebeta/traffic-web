import { api } from '@/shared/services/api';
import type { Incident, IncidentReportRequest, IncidentType } from '../types/incident.types';

export const incidentService = {
  async getTypes(): Promise<IncidentType[]> {
    return api.get<IncidentType[]>('/api/incidents/types');
  },

  async reportIncident(data: IncidentReportRequest): Promise<Incident> {
    return api.post<Incident>('/api/incidents/report', data);
  },

  async getIncidents(): Promise<Incident[]> {
    return api.get<Incident[]>('/api/incidents');
  },
};
