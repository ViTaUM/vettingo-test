'use client';

import { useDashboard } from '@/lib/contexts/dashboard-context';
import { StatGrid } from '@/components/dashboard/stats';
import { QuickActions } from '@/components/dashboard/quick-actions';
import {
  Users,
  Stethoscope,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Shield,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface AdminStats {
  totalUsuarios: number;
  totalVeterinarios: number;
  consultasHoje: number;
  sistemaStatus: 'online' | 'manutencao' | 'offline';
  usuariosAtivos: UsuarioAtivo[];
  alertas: Alerta[];
  metricas: Metrica[];
}

interface UsuarioAtivo {
  id: number;
  nome: string;
  email: string;
  tipo: 'USER' | 'VETERINARIAN';
  ultimoAcesso: string;
}

interface Alerta {
  id: number;
  tipo: 'info' | 'warning' | 'error';
  titulo: string;
  descricao: string;
  timestamp: string;
}

interface Metrica {
  periodo: string;
  usuarios: number;
  consultas: number;
  receita: number;
}

export default function AdminDashboardPage() {
  const { user } = useDashboard();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados
    const loadStats = async () => {
      // TODO: Substituir por chamada real à API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStats({
        totalUsuarios: 1247,
        totalVeterinarios: 89,
        consultasHoje: 234,
        sistemaStatus: 'online',
        usuariosAtivos: [
          {
            id: 1,
            nome: 'Maria Silva',
            email: 'maria@email.com',
            tipo: 'USER',
            ultimoAcesso: '2 min atrás',
          },
          {
            id: 2,
            nome: 'Dr. João Santos',
            email: 'joao@email.com',
            tipo: 'VETERINARIAN',
            ultimoAcesso: '5 min atrás',
          },
          {
            id: 3,
            nome: 'Ana Costa',
            email: 'ana@email.com',
            tipo: 'USER',
            ultimoAcesso: '10 min atrás',
          },
        ],
        alertas: [
          {
            id: 1,
            tipo: 'warning',
            titulo: 'Uso elevado do servidor',
            descricao: 'CPU em 85% de uso nas últimas 2 horas',
            timestamp: '15 min atrás',
          },
          {
            id: 2,
            tipo: 'info',
            titulo: 'Novo veterinário cadastrado',
            descricao: 'Dr. Carlos Oliveira completou o cadastro',
            timestamp: '1 hora atrás',
          },
          {
            id: 3,
            tipo: 'error',
            titulo: 'Falha no pagamento',
            descricao: '3 tentativas de pagamento falharam hoje',
            timestamp: '2 horas atrás',
          },
        ],
        metricas: [
          { periodo: 'Hoje', usuarios: 324, consultas: 234, receita: 12450 },
          { periodo: 'Ontem', usuarios: 298, consultas: 187, receita: 9870 },
          { periodo: 'Esta semana', usuarios: 2156, consultas: 1543, receita: 87650 },
          { periodo: 'Mês passado', usuarios: 8934, consultas: 6234, receita: 345670 },
        ],
      });
      setLoading(false);
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 rounded bg-gray-200"></div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 rounded-lg bg-gray-200"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-600 bg-green-100';
      case 'manutencao':
        return 'text-yellow-600 bg-yellow-100';
      case 'offline':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getAlertIcon = (tipo: string) => {
    switch (tipo) {
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo 🛡️</h1>
          <p className="text-gray-600">
            Bem-vindo, {user.firstName || 'Administrador'}! Gerencie a plataforma Vettingo.
          </p>
        </div>
        <div
          className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(stats?.sistemaStatus || 'offline')}`}>
          <div className="mr-2 h-2 w-2 rounded-full bg-current"></div>
          Sistema{' '}
          {stats?.sistemaStatus === 'online'
            ? 'Online'
            : stats?.sistemaStatus === 'manutencao'
              ? 'Manutenção'
              : 'Offline'}
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions
        title="Ações Administrativas"
        actions={[
          {
            href: '/dashboard/admin/usuarios',
            icon: Users,
            iconColor: 'text-blue-600',
            bgColor: 'bg-blue-50',
            hoverBgColor: 'hover:bg-blue-100',
            title: 'Usuários',
            description: 'Gerenciar contas',
          },
          {
            href: '/dashboard/admin/solicitacoes',
            icon: Stethoscope,
            iconColor: 'text-green-600',
            bgColor: 'bg-green-50',
            hoverBgColor: 'hover:bg-green-100',
            title: 'Veterinários',
            description: 'Aprovar cadastros',
          },
          {
            href: '/dashboard/admin/relatorios',
            icon: BarChart3,
            iconColor: 'text-purple-600',
            bgColor: 'bg-purple-50',
            hoverBgColor: 'hover:bg-purple-100',
            title: 'Relatórios',
            description: 'Analytics detalhados',
          },
          {
            href: '/dashboard/admin/configuracoes',
            icon: Shield,
            iconColor: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            hoverBgColor: 'hover:bg-yellow-100',
            title: 'Sistema',
            description: 'Configurações',
          },
        ]}
        columns={4}
      />

      {/* Stats Cards */}
      <StatGrid
        stats={[
          {
            icon: Users,
            iconColor: 'text-blue-600',
            iconBgColor: 'bg-blue-100',
            label: 'Total Usuários',
            value: stats?.totalUsuarios || 0,
          },
          {
            icon: Stethoscope,
            iconColor: 'text-green-600',
            iconBgColor: 'bg-green-100',
            label: 'Veterinários',
            value: stats?.totalVeterinarios || 0,
          },
          {
            icon: TrendingUp,
            iconColor: 'text-purple-600',
            iconBgColor: 'bg-purple-100',
            label: 'Consultas Hoje',
            value: stats?.consultasHoje || 0,
          },
          {
            icon: Activity,
            iconColor: 'text-orange-600',
            iconBgColor: 'bg-orange-100',
            label: 'Sistema',
            value: stats?.sistemaStatus === 'online' ? 'Online' : 'Offline',
          },
        ]}
        columns={4}
      />
      {/* Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Usuários Ativos */}
        <div className="rounded-lg bg-white shadow">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Usuários Ativos</h2>
            <Link href="/dashboard/admin/usuarios" className="text-sm text-blue-600 hover:text-blue-500">
              Ver todos
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats?.usuariosAtivos.map((usuario) => (
                <div key={usuario.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                  <div>
                    <p className="font-medium text-gray-900">{usuario.nome}</p>
                    <p className="text-sm text-gray-600">{usuario.email}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        usuario.tipo === 'VETERINARIAN' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                      {usuario.tipo === 'VETERINARIAN' ? 'Veterinário' : 'Tutor'}
                    </span>
                    <p className="mt-1 text-sm text-gray-500">{usuario.ultimoAcesso}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alertas do Sistema */}
        <div className="rounded-lg bg-white shadow">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Alertas do Sistema</h2>
            <Link href="/dashboard/admin/sistema" className="text-sm text-blue-600 hover:text-blue-500">
              Ver todos
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats?.alertas.map((alerta) => (
                <div key={alerta.id} className="flex items-start rounded-lg bg-gray-50 p-4">
                  <div className="mt-0.5 mr-3">{getAlertIcon(alerta.tipo)}</div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{alerta.titulo}</p>
                    <p className="mt-1 text-sm text-gray-600">{alerta.descricao}</p>
                    <p className="mt-2 text-xs text-gray-500">{alerta.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Métricas */}
      <div className="rounded-lg bg-white shadow">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Métricas da Plataforma</h2>
          <Link href="/dashboard/admin/relatorios" className="text-sm text-blue-600 hover:text-blue-500">
            Ver relatórios
          </Link>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Período
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Usuários
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Consultas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Receita
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {stats?.metricas.map((metrica, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">{metrica.periodo}</td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                      {metrica.usuarios.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                      {metrica.consultas.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                      R$ {metrica.receita.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
