import { api } from '@/shared/services/api';
import type { PresignedUrlResponse } from '../types/place.types';

export const uploadToMinio = async (
  file: File,
  prefix: string = 'places'
): Promise<string> => {
  const presignedData = await api.post<PresignedUrlResponse>(
    '/api/uploads/presigned',
    {
      prefix,
      filename: file.name,
    }
  );

  const uploadResponse = await fetch(presignedData.url, {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  if (!uploadResponse.ok) {
    throw new Error('Failed to upload image');
  }

  return presignedData.objectName;
};
