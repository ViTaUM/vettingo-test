export interface ImageValidationResult {
  isValid: boolean;
  error?: string;
}

export interface ImageUploadResult {
  base64: string;
  fileSize: number;
  mimeType: string;
}

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const SUPPORTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export function validateImage(file: File): ImageValidationResult {
  if (!file) {
    return { isValid: false, error: 'Nenhum arquivo selecionado' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { isValid: false, error: 'Arquivo muito grande. Máximo: 5MB' };
  }

  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: 'Arquivo deve ser uma imagem' };
  }

  if (!SUPPORTED_TYPES.includes(file.type)) {
    return { isValid: false, error: 'Formato de imagem não suportado. Use: JPEG, PNG, GIF ou WebP' };
  }

  return { isValid: true };
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export async function processImageUpload(file: File): Promise<ImageUploadResult> {
  const validation = validateImage(file);
  
  if (!validation.isValid) {
    throw new Error(validation.error);
  }

  const base64 = await fileToBase64(file);

  return {
    base64,
    fileSize: file.size,
    mimeType: file.type,
  };
}

export function compressImage(base64: string, maxWidth = 800, maxHeight = 800): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve(base64);
        return;
      }

      let { width, height } = img;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
      resolve(compressedBase64);
    };

    img.onerror = () => resolve(base64);
    img.src = base64;
  });
} 