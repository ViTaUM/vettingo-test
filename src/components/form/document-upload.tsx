'use client';

import { compressImage, processImageUpload } from '@/utils/image-upload';
import { FileText, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

interface DocumentUploadProps {
  label?: string;
  value?: string;
  onChange?: (base64: string) => void;
  onRemove?: () => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export default function DocumentUpload({
  label,
  value,
  onChange,
  onRemove,
  disabled = false,
  className = '',
  placeholder = 'Escolher Documento',
}: DocumentUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !onChange) return;

      setUploading(true);
      try {
        const result = await processImageUpload(file);
        const compressedBase64 = await compressImage(result.base64);
        onChange(compressedBase64);
        toast.success('Documento processado com sucesso!');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Erro ao processar documento');
        console.error('Erro no processamento:', error);
      } finally {
        setUploading(false);
      }
    },
    [onChange],
  );

  const handleRemove = useCallback(() => {
    if (onRemove) {
      onRemove();
      toast.success('Documento removido');
    }
  }, [onRemove]);

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        {value ? (
          <div className="relative">
            <div className="relative h-32 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
              <Image
                src={value}
                alt="Preview do documento"
                fill
                className="object-contain"
              />
            </div>
            {!disabled && (
              <button
                type="button"
                onClick={handleRemove}
                disabled={uploading}
                className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600 disabled:opacity-50">
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ) : (
          <label className={`block cursor-pointer ${uploading || disabled ? 'pointer-events-none' : ''}`}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading || disabled}
            />
            <div className="flex h-32 w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 transition-colors hover:border-gray-300 hover:bg-gray-100">
              <div className="text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                  <FileText className="h-5 w-5 text-gray-500" />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  {uploading ? 'Processando...' : placeholder}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG, GIF, WebP até 5MB
                </p>
              </div>
            </div>
          </label>
        )}
      </div>
    </div>
  );
} 