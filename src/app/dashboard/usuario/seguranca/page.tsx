'use client';

import PasswordChangeForm from '@/components/dashboard/security/password-change-form';
import { useCallback } from 'react';
import toast from 'react-hot-toast';

export default function SegurancaPage() {
  const handleMessage = useCallback((newMessage: { type: 'success' | 'error'; text: string }) => {
    if (newMessage.type === 'success') {
      toast.success(newMessage.text);
    } else {
      toast.error(newMessage.text);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Segurança</h1>
        <p className="text-gray-600">Gerencie sua senha.</p>
      </div>
      <PasswordChangeForm onMessage={handleMessage} />
    </div>
  );
}
