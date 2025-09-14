'use client';

import DeleteAccountForm from '@/components/dashboard/settings/delete-account-form';
import { useCallback } from 'react';
import toast from 'react-hot-toast';

export default function ConfiguracoesPage() {
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
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">Gerencie suas informações pessoais e preferências de notificação.</p>
      </div>

      <DeleteAccountForm onMessage={handleMessage} />
    </div>
  );
}
