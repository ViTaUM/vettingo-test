'use client';

import { useState, useEffect } from 'react';
import { Shield, Key, CheckCircle, Activity, AlertTriangle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSecurityLogsAction } from '@/lib/api/auth';

export interface SecurityLog {
  id: number;
  type: string;
  description: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
}

interface SecurityLogsProps {
  showExportButton?: boolean;
  onMessage?: (message: { type: 'success' | 'error'; text: string }) => void;
}

export default function SecurityLogs({ showExportButton = false, onMessage }: SecurityLogsProps) {
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      const result = await getSecurityLogsAction();
      if (result.success) {
        setLogs(result.logs || []);
      }
      setLoading(false);
    };

    loadLogs();
  }, []);

  const handleExportLogs = () => {
    const csvContent = [
      'Data,Tipo,Descrição,IP,User Agent',
      ...logs.map(
        (log) => `"${log.createdAt}","${log.type}","${log.description}","${log.ipAddress}","${log.userAgent}"`,
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `log-seguranca-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onMessage?.({ type: 'success', text: 'Log de segurança exportado com sucesso!' });
  };
  const getLogIcon = (type: string) => {
    switch (type) {
      case 'login':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'logout':
        return <Activity className="h-5 w-5 text-blue-500" />;
      case 'password_change':
        return <Key className="h-5 w-5 text-orange-500" />;
      case 'failed_login':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Shield className="h-5 w-5 text-gray-500" />;
    }
  };

  const getLogTypeText = (type: string) => {
    switch (type) {
      case 'login':
        return 'Login realizado';
      case 'logout':
        return 'Logout realizado';
      case 'password_change':
        return 'Senha alterada';
      case 'failed_login':
        return 'Tentativa de login falhada';
      default:
        return 'Atividade de segurança';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  };

  const truncateUserAgent = (userAgent: string, maxLength: number = 50) => {
    return userAgent.length > maxLength ? userAgent.substring(0, maxLength) + '...' : userAgent;
  };

  return (
    <div className="rounded-lg bg-white shadow">
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Shield className="mr-3 h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">Log de Segurança</h2>
          </div>
          {showExportButton && (
            <Button
              onClick={handleExportLogs}
              variant="outline"
              size="sm"
              className="border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          )}
        </div>
      </div>
      <div className="p-6">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-lg bg-gray-200"></div>
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="py-8 text-center">
            <Shield className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">Nenhuma atividade registrada</h3>
            <p className="text-gray-500">Suas atividades de segurança aparecerão aqui.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.slice(0, 10).map((log) => (
              <div key={log.id} className="flex items-start rounded-lg bg-gray-50 p-4">
                <div className="mt-0.5 mr-3">{getLogIcon(log.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{getLogTypeText(log.type)}</p>
                    <time className="text-xs text-gray-500">{formatDate(log.createdAt)}</time>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{log.description}</p>
                  <div className="mt-2 text-xs text-gray-500">
                    IP: {log.ipAddress} • {truncateUserAgent(log.userAgent)}
                  </div>
                </div>
              </div>
            ))}
            {logs.length > 10 && (
              <div className="text-center">
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-500">
                  Ver mais atividades ({logs.length - 10} restantes)
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
