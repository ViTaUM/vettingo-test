'use server';

/**
 * API para upload de arquivos
 */

interface UploadAvatarRequest {
  entityType: 'user' | 'pet' | 'veterinarian';
  entityId: number;
  fileBase64: string;
  filename: string;
}

interface UploadAvatarResponse {
  message: string;
  url: string;
  filename: string;
  key: string;
  service: 'spaces' | 'mock';
}

/**
 * Converte File para base64
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * Faz upload de avatar
 */
export async function uploadAvatar(
  entityType: 'user' | 'pet' | 'veterinarian',
  entityId: number,
  file: File,
): Promise<UploadAvatarResponse> {
  try {
    const fileBase64 = await fileToBase64(file);

    const payload: UploadAvatarRequest = {
      entityType,
      entityId,
      fileBase64,
      filename: file.name,
    };

    const response = await fetch('/api/upload/avatar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erro no upload: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro no upload de avatar:', error);
    throw error;
  }
}
