import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { apiClient } from '../api/client';

interface UploadResult {
  url: string;
  key: string;
}

export function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  async function pickImage(options?: {
    allowsMultipleSelection?: boolean;
    mediaTypes?: ImagePicker.MediaTypeOptions;
  }): Promise<string[]> {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: options?.mediaTypes ?? ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: options?.allowsMultipleSelection ?? false,
      quality: 0.8,
    });

    if (result.canceled) return [];
    return result.assets.map((asset) => asset.uri);
  }

  async function takePhoto(): Promise<string | null> {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return null;

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
    });

    if (result.canceled) return null;
    return result.assets[0]?.uri ?? null;
  }

  async function compressImage(uri: string): Promise<string> {
    const manipulated = await ImageManipulator.manipulateAsync(
      uri,
      [{ resize: { width: 2048 } }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );
    return manipulated.uri;
  }

  async function uploadImage(uri: string): Promise<UploadResult> {
    setUploading(true);
    setProgress(0);

    try {
      // Compress first
      const compressedUri = await compressImage(uri);

      // Get presigned URL
      const { data: presignedData } = await apiClient.post('/media/upload-url', {
        contentType: 'image/jpeg',
      });
      const { uploadUrl, key, publicUrl } = presignedData.data;

      // Upload to S3
      const fileResponse = await fetch(compressedUri);
      const blob = await fileResponse.blob();

      await fetch(uploadUrl, {
        method: 'PUT',
        body: blob,
        headers: { 'Content-Type': 'image/jpeg' },
      });

      // Confirm upload
      await apiClient.post('/media/confirm', { key });

      setProgress(100);
      return { url: publicUrl, key };
    } finally {
      setUploading(false);
    }
  }

  async function uploadMultiple(uris: string[]): Promise<UploadResult[]> {
    const results: UploadResult[] = [];
    for (let i = 0; i < uris.length; i++) {
      const result = await uploadImage(uris[i]!);
      results.push(result);
      setProgress(((i + 1) / uris.length) * 100);
    }
    return results;
  }

  return { pickImage, takePhoto, uploadImage, uploadMultiple, uploading, progress };
}
