import { useState } from 'react';
import { uploadToMinio } from '../utils/minio';

export function useImageUpload() {
    const [images, setImages] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        setUploading(true);
        setError('');

        try {
            const uploadPromises = Array.from(files).map(file => uploadToMinio(file, 'places'));
            const objectNames = await Promise.all(uploadPromises);
            setImages(prev => [...prev, ...objectNames]);
        } catch (err) {
            setError('Failed to upload images. Please try again.');
            console.error('Upload error:', err);
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const clearImages = () => {
        setImages([]);
    };

    return {
        images,
        uploading,
        error,
        handleUpload,
        removeImage,
        clearImages,
    };
}
