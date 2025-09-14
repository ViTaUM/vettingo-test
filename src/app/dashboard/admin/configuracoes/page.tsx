'use client';

import { useCallback } from 'react';
import PersonalInfoForm from '@/components/dashboard/settings/personal-info-form';
import NotificationPreferencesForm from '@/components/dashboard/settings/notification-preferences-form';
import toast from 'react-hot-toast';

export default function AdminConfiguracoesPage() {
  // Mock user data - in production this would come from auth context
  const personalInfo = {
    firstName: 'Admin',
    lastName: 'Sistema',
    wantsNewsletter: true,
  };

  const handleMessage = useCallback((newMessage: { type: 'success' | 'error'; text: string }) => {
    if (newMessage.type === 'success') {
      toast.success(newMessage.text);
    } else {
      toast.error(newMessage.text);
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
        <p className="text-gray-600">Gerencie suas informações pessoais e preferências de notificação.</p>
      </div>

      {/* Personal Information */}
      <PersonalInfoForm initialData={personalInfo} onMessage={handleMessage} />

      {/* Notification Preferences */}
      <NotificationPreferencesForm onMessage={handleMessage} />
    </div>
  );
}
