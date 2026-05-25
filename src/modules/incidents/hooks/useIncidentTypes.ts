import { useEffect, useState } from 'react';
import { incidentService } from '../services/incident.service';
import type { IncidentType } from '../types/incident.types';

export function useIncidentTypes() {
  const [types, setTypes] = useState<IncidentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await incidentService.getTypes();
        if (!cancelled) {
          setTypes(data);
        }
      } catch (err) {
        console.error('Failed to load incident types:', err);
        if (!cancelled) {
          setError('Failed to load incident types. Please try again.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { types, loading, error };
}
