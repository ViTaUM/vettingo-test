'use client';

import { Button } from '@/components/ui/button';
import { compressImage, processImageUpload } from '@/utils/image-upload';
import { Camera, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  label?: string;
  value?: string;
  onChange?: (base64: string) => void;
  onRemove?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  aspectRatio?: 'square' | 'circle';
  className?: string;
  placeholder?: string;
}

export default function ImageUpload({
  label,
  value,
  onChange,
  onRemove,
  disabled = false,
  size = 'md',
  aspectRatio = 'circle',
  className = '',
  placeholder = 'Escolher Imagem',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32',
  };

  const aspectClasses = {
    square: 'rounded-lg',
    circle: 'rounded-full',
  };

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !onChange) return;

      setUploading(true);
      try {
        const result = await processImageUpload(file);
        const compressedBase64 = await compressImage(result.base64);
        onChange(compressedBase64);
        toast.success('Imagem processada com sucesso!');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Erro ao processar imagem');
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
      toast.success('Imagem removida');
    }
  }, [onRemove]);

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="flex items-center space-x-4">
        <div className="relative">
          {value ? (
            <div className="relative">
              <Image
                src={value}
                alt="Preview"
                width={96}
                height={96}
                className={`${sizeClasses[size]} ${aspectClasses[aspectRatio]} border-2 border-gray-200 object-cover`}
              />
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
            <div
              className={`${sizeClasses[size]} ${aspectClasses[aspectRatio]} flex items-center justify-center border-2 border-dashed border-gray-300 bg-gray-100`}>
              <Camera className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <label className={`cursor-pointer ${uploading || disabled ? 'pointer-events-none' : ''}`}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading || disabled}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={uploading || disabled}
              className="pointer-events-none">
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? 'Processando...' : placeholder}
            </Button>
          </label>
          <p className="text-xs text-gray-500">PNG, JPG, GIF, WebP até 5MB</p>
        </div>
      </div>
    </div>
  );
} 