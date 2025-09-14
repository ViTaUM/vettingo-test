'use client';

import { useState, useEffect } from 'react';
import FormSelect from '@/components/form/select';
import UIButton from '@/components/ui/button';
import { useLoadingContext } from '@/components/ui/loading-provider';
import { LoadingInline } from '@/components/ui/loading-inline';
import ExportModal from '@/components/dashboard/export-modal';
import {
  Users,
  Stethoscope,
  PawPrint,
  Calendar,
  MessageCircle,
  DollarSign,
  Download,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  MapPin,
  Activity,
  Shield,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  exportData,
  ExportData,
  formatCurrencyForExport,
  formatNumberForExport,
  generateFilename,
} from '@/utils/export';

interface ReportData {
  // Métricas Gerais
  totalUsers: number;
  totalVeterinarians: number;
  totalPets: number;
  totalAppointments: number;
  totalRevenue: number;
  activeUsers: number;

  // Crescimento
  newUsersThisMonth: number;
  newVeterinariansThisMonth: number;
  newPetsThisMonth: number;
  appointmentsThisMonth: number;
  revenueThisMonth: number;

  // Aprovações
  pendingVeterinarianApprovals: number;
  approvedVeterinariansThisMonth: number;
  rejectedVeterinariansThisMonth: number;

  // Suporte
  totalSupportTickets: number;
  resolvedTicketsThisMonth: number;
  averageResponseTime: number;
  openTickets: number;

  // Consultas
  appointmentsToday: number;
  appointmentsThisWeek: number;
  completedAppointments: number;
  cancelledAppointments: number;

  // Avaliações
  averageRating: number;
  totalReviews: number;
  positiveReviews: number;
  negativeReviews: number;

  // Dados por Período
  monthlyData: MonthlyData[];
  weeklyData: WeeklyData[];

  // Top Performers
  topVeterinarians: TopVeterinarian[];
  topCities: TopCity[];
  popularPetTypes: PopularPetType[];
}

interface MonthlyData {
  month: string;
  users: number;
  veterinarians: number;
  appointments: number;
  revenue: number;
}

interface WeeklyData {
  week: string;
  appointments: number;
  newUsers: number;
  revenue: number;
}

interface TopVeterinarian {
  id: number;
  name: string;
  appointments: number;
  rating: number;
  revenue: number;
  city: string;
}

interface TopCity {
  city: string;
  state: string;
  users: number;
  veterinarians: number;
  appointments: number;
}

interface PopularPetType {
  type: string;
  count: number;
  percentage: number;
}

export default function AdminRelatoriosPage() {
  const { startLoading, stopLoading } = useLoadingContext();
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        startLoading('admin-reports-page', {
          type: 'data',
          message: 'Carregando relatórios...',
          size: 'lg',
          inline: true,
        });

        // Simular carregamento da API
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setReportData({
          // Métricas Gerais
          totalUsers: 1247,
          totalVeterinarians: 89,
          totalPets: 2156,
          totalAppointments: 8923,
          totalRevenue: 456789,
          activeUsers: 892,

          // Crescimento
          newUsersThisMonth: 156,
          newVeterinariansThisMonth: 12,
          newPetsThisMonth: 234,
          appointmentsThisMonth: 1234,
          revenueThisMonth: 67890,

          // Aprovações
          pendingVeterinarianApprovals: 8,
          approvedVeterinariansThisMonth: 15,
          rejectedVeterinariansThisMonth: 3,

          // Suporte
          totalSupportTickets: 456,
          resolvedTicketsThisMonth: 89,
          averageResponseTime: 2.5,
          openTickets: 23,

          // Consultas
          appointmentsToday: 45,
          appointmentsThisWeek: 234,
          completedAppointments: 8234,
          cancelledAppointments: 156,

          // Avaliações
          averageRating: 4.7,
          totalReviews: 1234,
          positiveReviews: 1189,
          negativeReviews: 45,

          // Dados por Período
          monthlyData: [
            { month: 'Jan', users: 1200, veterinarians: 85, appointments: 8500, revenue: 420000 },
            { month: 'Fev', users: 1250, veterinarians: 87, appointments: 8700, revenue: 435000 },
            { month: 'Mar', users: 1300, veterinarians: 89, appointments: 8900, revenue: 445000 },
            { month: 'Abr', users: 1350, veterinarians: 91, appointments: 9100, revenue: 455000 },
            { month: 'Mai', users: 1400, veterinarians: 93, appointments: 9300, revenue: 465000 },
            { month: 'Jun', users: 1450, veterinarians: 95, appointments: 9500, revenue: 475000 },
          ],
          weeklyData: [
            { week: 'Sem 1', appointments: 1200, newUsers: 45, revenue: 120000 },
            { week: 'Sem 2', appointments: 1250, newUsers: 52, revenue: 125000 },
            { week: 'Sem 3', appointments: 1300, newUsers: 48, revenue: 130000 },
            { week: 'Sem 4', appointments: 1350, newUsers: 55, revenue: 135000 },
          ],

          // Top Performers
          topVeterinarians: [
            { id: 1, name: 'Dr. Carlos Silva', appointments: 156, rating: 4.9, revenue: 15600, city: 'São Paulo' },
            { id: 2, name: 'Dra. Ana Santos', appointments: 142, rating: 4.8, revenue: 14200, city: 'Rio de Janeiro' },
            { id: 3, name: 'Dr. João Costa', appointments: 128, rating: 4.7, revenue: 12800, city: 'Belo Horizonte' },
            { id: 4, name: 'Dra. Maria Lima', appointments: 115, rating: 4.9, revenue: 11500, city: 'Curitiba' },
            { id: 5, name: 'Dr. Pedro Oliveira', appointments: 98, rating: 4.6, revenue: 9800, city: 'Porto Alegre' },
          ],
          topCities: [
            { city: 'São Paulo', state: 'SP', users: 456, veterinarians: 34, appointments: 2345 },
            { city: 'Rio de Janeiro', state: 'RJ', users: 234, veterinarians: 18, appointments: 1234 },
            { city: 'Belo Horizonte', state: 'MG', users: 189, veterinarians: 12, appointments: 987 },
            { city: 'Curitiba', state: 'PR', users: 156, veterinarians: 10, appointments: 756 },
            { city: 'Porto Alegre', state: 'RS', users: 134, veterinarians: 8, appointments: 623 },
          ],
          popularPetTypes: [
            { type: 'Cachorro', count: 1456, percentage: 67.5 },
            { type: 'Gato', count: 623, percentage: 28.9 },
            { type: 'Ave', count: 45, percentage: 2.1 },
            { type: 'Outros', count: 32, percentage: 1.5 },
          ],
        });
      } catch {
        toast.error('Erro ao carregar relatórios');
      } finally {
        stopLoading('admin-reports-page');
      }
    };

    fetchReportData();
  }, [startLoading, stopLoading]);

  const formatCurrency = (value: number) => {
    if (!value || isNaN(value)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const handleExport = async (format: 'csv' | 'xlsx') => {
    if (!reportData) {
      toast.error('Nenhum dado disponível para exportação');
      return;
    }

    try {
      startLoading('export-reports', {
        type: 'data',
        message: 'Preparando exportação...',
        size: 'lg',
        inline: true,
      });

      // Prepara os dados para exportação
      const exportDataConfig: ExportData = {
        headers: ['Métrica', 'Valor', 'Crescimento Mensal', 'Descrição'],
        rows: [
          [
            'Total de Usuários',
            formatNumberForExport(reportData.totalUsers),
            `+${formatNumberForExport(reportData.newUsersThisMonth)}`,
            'Usuários cadastrados na plataforma',
          ],
          [
            'Total de Veterinários',
            formatNumberForExport(reportData.totalVeterinarians),
            `+${formatNumberForExport(reportData.newVeterinariansThisMonth)}`,
            'Veterinários aprovados',
          ],
          [
            'Total de Pets',
            formatNumberForExport(reportData.totalPets),
            `+${formatNumberForExport(reportData.newPetsThisMonth)}`,
            'Pets cadastrados',
          ],
          [
            'Total de Consultas',
            formatNumberForExport(reportData.totalAppointments),
            `+${formatNumberForExport(reportData.appointmentsThisMonth)}`,
            'Consultas realizadas',
          ],
          [
            'Receita Total',
            formatCurrencyForExport(reportData.totalRevenue),
            `+${formatCurrencyForExport(reportData.revenueThisMonth)}`,
            'Receita total da plataforma',
          ],
          ['Usuários Ativos', formatNumberForExport(reportData.activeUsers), '', 'Usuários ativos no período'],
          [
            'Aprovações Pendentes',
            formatNumberForExport(reportData.pendingVeterinarianApprovals),
            '',
            'Veterinários aguardando aprovação',
          ],
          [
            'Aprovados (Mês)',
            formatNumberForExport(reportData.approvedVeterinariansThisMonth),
            '',
            'Veterinários aprovados este mês',
          ],
          [
            'Rejeitados (Mês)',
            formatNumberForExport(reportData.rejectedVeterinariansThisMonth),
            '',
            'Veterinários rejeitados este mês',
          ],
          ['Tickets Suporte', formatNumberForExport(reportData.totalSupportTickets), '', 'Total de tickets de suporte'],
          [
            'Tickets Resolvidos',
            formatNumberForExport(reportData.resolvedTicketsThisMonth),
            '',
            'Tickets resolvidos este mês',
          ],
          ['Tempo Médio Resposta', `${reportData.averageResponseTime}h`, '', 'Tempo médio de resposta do suporte'],
          ['Tickets Abertos', formatNumberForExport(reportData.openTickets), '', 'Tickets em aberto'],
          ['Consultas Hoje', formatNumberForExport(reportData.appointmentsToday), '', 'Consultas agendadas para hoje'],
          [
            'Consultas Semana',
            formatNumberForExport(reportData.appointmentsThisWeek),
            '',
            'Consultas agendadas esta semana',
          ],
          [
            'Consultas Concluídas',
            formatNumberForExport(reportData.completedAppointments),
            '',
            'Consultas já realizadas',
          ],
          ['Consultas Canceladas', formatNumberForExport(reportData.cancelledAppointments), '', 'Consultas canceladas'],
          ['Avaliação Média', `${reportData.averageRating}/5.0`, '', 'Avaliação média dos veterinários'],
          ['Total de Avaliações', formatNumberForExport(reportData.totalReviews), '', 'Total de avaliações recebidas'],
          [
            'Avaliações Positivas',
            formatNumberForExport(reportData.positiveReviews),
            '',
            'Avaliações positivas (4-5 estrelas)',
          ],
          [
            'Avaliações Negativas',
            formatNumberForExport(reportData.negativeReviews),
            '',
            'Avaliações negativas (1-3 estrelas)',
          ],
        ],
        sheetName: 'Relatório Geral',
      };

      const filename = generateFilename('relatorio-vettingo', format);

      await exportData(exportDataConfig, { format, filename });

      toast.success(`Relatório exportado com sucesso!`);
    } catch (error) {
      console.error('Erro na exportação:', error);
      toast.error('Erro ao exportar relatório');
    } finally {
      stopLoading('export-reports');
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star key={i} className={`h-4 w-4 ${i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />,
      );
    }
    return stars;
  };

  if (!reportData) {
    return (
      <LoadingInline id="admin-reports-page">
        <div className="space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-64 rounded bg-gray-200"></div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-32 rounded-lg bg-gray-200"></div>
              ))}
            </div>
          </div>
        </div>
      </LoadingInline>
    );
  }

  return (
    <LoadingInline id="admin-reports-page">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Relatórios e Analytics</h1>
            <p className="mt-2 text-gray-600">Acompanhe o desempenho da plataforma Vettingo</p>
          </div>
          <div className="flex items-center gap-3">
            <FormSelect
              label="Período"
              name="period"
              value={selectedPeriod}
              options={[
                { value: '7', label: 'Últimos 7 dias' },
                { value: '30', label: 'Últimos 30 dias' },
                { value: '90', label: 'Últimos 90 dias' },
                { value: '365', label: 'Último ano' },
              ]}
              onChange={(value) => setSelectedPeriod(value)}
            />
            <UIButton variant="outline" size="sm" onClick={() => setIsExportModalOpen(true)}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </UIButton>
          </div>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(reportData.totalUsers)}</p>
                <p className="text-sm text-green-600">+{formatNumber(reportData.newUsersThisMonth)} este mês</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Veterinários</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(reportData.totalVeterinarians)}</p>
                <p className="text-sm text-green-600">+{formatNumber(reportData.newVeterinariansThisMonth)} este mês</p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <Stethoscope className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Consultas</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(reportData.totalAppointments)}</p>
                <p className="text-sm text-green-600">+{formatNumber(reportData.appointmentsThisMonth)} este mês</p>
              </div>
              <div className="rounded-full bg-purple-100 p-3">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Total</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(reportData.totalRevenue)}</p>
                <p className="text-sm text-green-600">+{formatCurrency(reportData.revenueThisMonth)} este mês</p>
              </div>
              <div className="rounded-full bg-yellow-100 p-3">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Métricas Secundárias */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center space-x-2">
              <PawPrint className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Pets Cadastrados</p>
                <p className="text-lg font-bold text-gray-900">{formatNumber(reportData.totalPets)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Tickets Suporte</p>
                <p className="text-lg font-bold text-gray-900">{formatNumber(reportData.totalSupportTickets)}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Avaliação Média</p>
                <p className="text-lg font-bold text-gray-900">{reportData.averageRating}/5.0</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Usuários Ativos</p>
                <p className="text-lg font-bold text-gray-900">{formatNumber(reportData.activeUsers)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Seções de Relatórios */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Aprovações de Veterinários */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Aprovações de Veterinários</h3>
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-yellow-50 p-4">
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-gray-900">Pendentes</p>
                    <p className="text-sm text-gray-600">Aguardando aprovação</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-yellow-600">{reportData.pendingVeterinarianApprovals}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-green-50 p-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Aprovados</p>
                    <p className="text-sm text-gray-600">Este mês</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-green-600">{reportData.approvedVeterinariansThisMonth}</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-red-50 p-4">
                <div className="flex items-center space-x-3">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium text-gray-900">Rejeitados</p>
                    <p className="text-sm text-gray-600">Este mês</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-red-600">{reportData.rejectedVeterinariansThisMonth}</span>
              </div>
            </div>
          </div>

          {/* Suporte */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Suporte ao Cliente</h3>
              <MessageCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tickets Abertos</span>
                <span className="font-semibold text-gray-900">{reportData.openTickets}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Resolvidos (mês)</span>
                <span className="font-semibold text-gray-900">{reportData.resolvedTicketsThisMonth}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tempo Médio Resposta</span>
                <span className="font-semibold text-gray-900">{reportData.averageResponseTime}h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avaliação Positiva</span>
                <span className="font-semibold text-gray-900">{reportData.positiveReviews}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Veterinários */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Top Veterinários</h3>
            <UIButton variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              Ver Todos
            </UIButton>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Veterinário
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Cidade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Consultas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Avaliação
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                    Receita
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {reportData.topVeterinarians.map((vet) => (
                  <tr key={vet.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{vet.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{vet.city}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{vet.appointments}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {renderStars(vet.rating)}
                        <span className="ml-2 text-sm text-gray-900">{vet.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(vet.revenue)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cidades e Tipos de Pet */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Top Cidades */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Top Cidades</h3>
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <div className="space-y-3">
              {reportData.topCities.map((city, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <div>
                    <p className="font-medium text-gray-900">
                      {city.city}, {city.state}
                    </p>
                    <p className="text-sm text-gray-600">{city.veterinarians} veterinários</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatNumber(city.users)} usuários</p>
                    <p className="text-sm text-gray-600">{formatNumber(city.appointments)} consultas</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tipos de Pet */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Tipos de Pet</h3>
              <PawPrint className="h-5 w-5 text-green-600" />
            </div>
            <div className="space-y-3">
              {reportData.popularPetTypes.map((petType, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{petType.type}</span>
                  <div className="flex items-center space-x-2">
                    <div className="h-2 w-24 rounded-full bg-gray-200">
                      <div className="h-2 rounded-full bg-blue-600" style={{ width: `${petType.percentage}%` }}></div>
                    </div>
                    <span className="text-sm text-gray-600">{petType.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Exportação */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onExport={handleExport}
        title="Exportar Relatório"
        description="Escolha o formato de exportação para baixar os dados do relatório"
      />
    </LoadingInline>
  );
}
