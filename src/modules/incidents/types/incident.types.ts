export interface IncidentType {
  id: string;
  name: string;
  label: string;
  icon: string | null;
  defaultRadius: number;
  defaultDuration: number;
  severity: number;
  createdAt: string;
  updatedAt: string;
}

export interface IncidentReportRequest {
  lat: number;
  lng: number;
  typeId: string;
  description: string;
  image: string[];
}

export interface Incident {
  id: string;
  lat: number;
  lng: number;
  typeId: string;
  userId: string | null;
  deviceId: string | null;
  image: string[];
  description: string;
  direction: string | null;
  reliability: number;
  upvotes: number;
  downvotes: number;
  confirmed: boolean;
  expiresAt: string | null;
  createdAt: string;
  type: IncidentType;
}
