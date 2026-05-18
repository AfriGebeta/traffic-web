import { useState } from 'react';
import { incidentService } from '../services/incident.service';

interface ReportData {
  lat: number;
  lng: number;
  typeId: string;
  description: string;
  image: string[];
}

export function useIncidentContribution() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const submitIncident = async (data: ReportData, onSuccess: () => void) => {
    setError('');
    setSubmitting(true);

    try {
      await incidentService.reportIncident(data);
      onSuccess();
    } catch (err) {
      setError('Failed to report incident. Please try again.');
      console.error('Submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return {
    submitting,
    error,
    submitIncident,
    setError,
  };
}
