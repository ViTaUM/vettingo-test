'use client';

import { useEffect } from 'react';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';

interface MessageBannerProps {
  message: {
    type: 'success' | 'error';
    text: string;
  } | null;
  onClose?: () => void;
  autoHide?: boolean;
  duration?: number;
}

export default function MessageBanner({ message, onClose, autoHide = false, duration = 5000 }: MessageBannerProps) {
  // Auto-hide functionality usando useEffect
  useEffect(() => {
    if (message && autoHide && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [message, autoHide, onClose, duration]);

  if (!message) return null;

  return (
    <div
      className={`rounded-lg p-4 ${
        message.type === 'success'
          ? 'border border-green-200 bg-green-50 text-green-700'
          : 'border border-red-200 bg-red-50 text-red-700'
      }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {message.type === 'success' ? (
            <CheckCircle className="mr-2 h-5 w-5" />
          ) : (
            <AlertTriangle className="mr-2 h-5 w-5" />
          )}
          <span>{message.text}</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-3 inline-flex h-6 w-6 items-center justify-center rounded-full opacity-70 hover:opacity-100">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
