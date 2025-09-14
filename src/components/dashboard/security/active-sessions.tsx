'use client';

import { useState, useEffect } from 'react';
import { Monitor, Smartphone, Clock, MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getActiveSessionsAction, revokeSessionAction } from '@/lib/api/auth';

export interface ActiveSession {
  id: string;
  device: string;
  location: string;
  lastAccess: string;
  current: boolean;
}

interface ActiveSessionsProps {
  onMessage?: (message: { type: 'success' | 'error'; text: string }) => void;
}

export default function ActiveSessions({ onMessage }: ActiveSessionsProps) {
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSessions = async () => {
      const result = await getActiveSessionsAction();
      if (result.success) {
        setSessions(result.sessions || []);
      }
      setLoading(false);
    };

    loadSessions();
  }, []);

  const handleRevokeSession = async (sessionId: string) => {
    const result = await revokeSessionAction(sessionId);

    if (result.success) {
      setSessions((prevSessions) => prevSessions.filter((s) => s.id !== sessionId));
      onMessage?.({ type: 'success', text: 'Sessão revogada com sucesso!' });
    } else {
      onMessage?.({ type: 'error', text: result.error || 'Erro ao revogar sessão' });
    }
  };
  const getDeviceIcon = (device: string) => {
    if (
      device.toLowerCase().includes('mobile') ||
      device.toLowerCase().includes('iphone') ||
      device.toLowerCase().includes('android')
    ) {
      return <Smartphone className="h-5 w-5 text-gray-500" />;
    }
    return <Monitor className="h-5 w-5 text-gray-500" />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };

  return (
    <div className="rounded-lg bg-white shadow">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center">
          <Monitor className="mr-3 h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">Sessões Ativas</h2>
        </div>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-200"></div>
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="py-8 text-center">
            <Monitor className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">Nenhuma sessão ativa</h3>
            <p className="text-gray-500">Você não possui sessões ativas no momento.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
                <div className="flex items-center">
                  {getDeviceIcon(session.device)}
                  <div className="ml-3">
                    <div className="flex items-center">
                      <p className="font-medium text-gray-900">{session.device}</p>
                      {session.current && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                          Atual
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="mr-1 h-4 w-4" />
                      {session.location}
                      <Clock className="mr-1 ml-3 h-4 w-4" />
                      {formatDate(session.lastAccess)}
                    </div>
                  </div>
                </div>
                {!session.current && (
                  <Button
                    onClick={() => handleRevokeSession(session.id)}
                    variant="outline"
                    size="sm"
                    className="border-red-300 bg-white text-red-700 hover:bg-red-50">
                    <X className="mr-1 h-4 w-4" />
                    Revogar
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
