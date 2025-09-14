'use client';

import { useState, useEffect } from 'react';
import { Bell, Save, Mail, Smartphone, MessageSquare } from 'lucide-react';
import FormCheckbox from '@/components/form/checkbox';
import { Button } from '@/components/ui/button';
import { updateUserPreferences, getUserPreferences } from '@/lib/api/users';

export interface NotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  weeklyReports: boolean;
  accountUpdates: boolean;
}

interface NotificationPreferencesFormProps {
  onMessage?: (message: { type: 'success' | 'error'; text: string }) => void;
}

export default function NotificationPreferencesForm({ onMessage }: NotificationPreferencesFormProps) {
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    weeklyReports: true,
    accountUpdates: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadPreferences = async () => {
      const result = await getUserPreferences();
      if (result.success && result.preferences) {
        setPreferences({
          emailNotifications: result.preferences.emailNotifications,
          smsNotifications: result.preferences.smsNotifications,
          pushNotifications: result.preferences.pushNotifications,
          marketingEmails: result.preferences.marketingEmails,
          weeklyReports: result.preferences.weeklyReports,
          accountUpdates: result.preferences.accountUpdates,
        });
      }
      setLoading(false);
    };
    loadPreferences();
  }, []);

  const handlePreferenceChange = (key: keyof NotificationPreferences) => (value: boolean) => {
    setPreferences((prev: NotificationPreferences) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const result = await updateUserPreferences(preferences);

      if (result.success) {
        onMessage?.({ type: 'success', text: 'Preferências de notificação atualizadas com sucesso!' });
      } else {
        onMessage?.({ type: 'error', text: result.error || 'Erro ao atualizar preferências' });
      }
    } catch {
      onMessage?.({ type: 'error', text: 'Erro ao atualizar preferências de notificação' });
    }
    setSaving(false);
  };

  const notificationGroups = [
    {
      title: 'Notificações Gerais',
      icon: <Bell className="h-5 w-5 text-blue-600" />,
      items: [
        {
          key: 'emailNotifications' as keyof NotificationPreferences,
          label: 'Notificações por email',
          description: 'Receber notificações importantes por email',
          icon: <Mail className="h-5 w-5 text-blue-500" />,
        },
        {
          key: 'smsNotifications' as keyof NotificationPreferences,
          label: 'Notificações por SMS',
          description: 'Receber lembretes e avisos urgentes via SMS',
          icon: <Smartphone className="h-5 w-5 text-green-500" />,
        },
        {
          key: 'pushNotifications' as keyof NotificationPreferences,
          label: 'Notificações push',
          description: 'Receber notificações push no navegador',
          icon: <MessageSquare className="h-5 w-5 text-purple-500" />,
        },
      ],
    },
    {
      title: 'Comunicações',
      icon: <Mail className="h-5 w-5 text-orange-600" />,
      items: [
        {
          key: 'marketingEmails' as keyof NotificationPreferences,
          label: 'Emails promocionais',
          description: 'Receber ofertas e novidades sobre o Vettingo',
          icon: <Mail className="h-5 w-5 text-orange-500" />,
        },
        {
          key: 'weeklyReports' as keyof NotificationPreferences,
          label: 'Relatórios semanais',
          description: 'Resumo semanal das atividades',
          icon: <Bell className="h-5 w-5 text-blue-500" />,
        },
        {
          key: 'accountUpdates' as keyof NotificationPreferences,
          label: 'Atualizações da conta',
          description: 'Mudanças importantes na sua conta',
          icon: <Bell className="h-5 w-5 text-red-500" />,
        },
      ],
    },
  ];

  return (
    <div className="rounded-lg bg-white shadow">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center">
          <Bell className="mr-3 h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">Preferências de Notificação</h2>
        </div>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="animate-pulse space-y-8">
            {[...Array(2)].map((_, groupIndex) => (
              <div key={groupIndex} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <div className="mb-6 flex items-center border-b border-gray-300 pb-3">
                  <div className="h-8 w-8 rounded-lg bg-gray-200"></div>
                  <div className="ml-3 h-5 w-32 rounded bg-gray-200"></div>
                </div>
                <div className="space-y-4">
                  {[...Array(3)].map((_, itemIndex) => (
                    <div key={itemIndex} className="rounded-lg bg-white p-4 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="mt-1 h-4 w-4 rounded bg-gray-200"></div>
                          <div className="flex-1">
                            <div className="h-4 w-48 rounded bg-gray-200"></div>
                            <div className="mt-1 h-3 w-64 rounded bg-gray-200"></div>
                          </div>
                        </div>
                        <div className="ml-4 h-5 w-5 rounded bg-gray-200"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="space-y-8">
              {notificationGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <div className="mb-6 flex items-center border-b border-gray-300 pb-3">
                    <div className="rounded-lg bg-white p-2 shadow-sm">{group.icon}</div>
                    <h3 className="ml-3 text-base font-semibold text-gray-900">{group.title}</h3>
                  </div>
                  <div className="space-y-3">
                    {group.items.map((item) => (
                      <div
                        key={item.key}
                        onClick={() => handlePreferenceChange(item.key)(!preferences[item.key])}
                        className="cursor-pointer rounded-lg bg-white p-4 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow-md active:scale-[0.99]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">{item.icon}</div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">{item.label}</div>
                              <div className="mt-1 text-sm text-gray-600">{item.description}</div>
                            </div>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <FormCheckbox
                              label=""
                              name={item.key}
                              value={preferences[item.key]}
                              onChange={handlePreferenceChange(item.key)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Button
                onClick={handleSubmit}
                disabled={saving}
                loading={saving}
                variant="solid"
                size="md"
                className="bg-blue-600 hover:bg-blue-700">
                <Save className="mr-2 h-4 w-4" />
                {saving ? 'Salvando...' : 'Salvar Preferências'}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
