'use client';

import { useState, useEffect } from 'react';
import UIButton from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatGrid } from '@/components/dashboard/stats';
import {
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  AlertTriangle,
  Stethoscope,
  Filter,
  RefreshCw,
  ArrowLeft,
  Check,
  X,
} from 'lucide-react';
import Link from 'next/link';

interface SolicitacaoCadastro {
  id: number;
  status: 'PENDENTE' | 'APROVADA' | 'REJEITADA';
  tipo: 'VETERINARIAN';
  dadosUsuario: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthDate: string;
    gender: 'M' | 'F' | 'O';
    cpf: string;
    city: string;
    state: string;
  };
  documentos: {
    rgFrente: string;
    rgVerso: string;
    cmrv: string;
  };
  dataSolicitacao: string;
  observacoes?: string;
}

export default function SolicitacoesPage() {
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoCadastro[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'PENDENTE' | 'APROVADA' | 'REJEITADA'>('PENDENTE');

  useEffect(() => {
    const loadSolicitacoes = async () => {
      // TODO: adicionar a api nessa bomba
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockSolicitacoes: SolicitacaoCadastro[] = [
        {
          id: 1,
          status: 'PENDENTE',
          tipo: 'VETERINARIAN',
          dadosUsuario: {
            firstName: 'Dr. Carlos',
            lastName: 'Oliveira',
            email: 'carlos.oliveira@vetclinic.com',
            phone: '(11) 99988-7766',
            birthDate: '1985-03-15',
            gender: 'M',
            cpf: '123.456.789-00',
            city: 'São Paulo',
            state: 'SP',
          },
          documentos: {
            rgFrente: '/api/documents/rg-frente-1.jpg',
            rgVerso: '/api/documents/rg-verso-1.jpg',
            cmrv: '/api/documents/cmrv-1.jpg',
          },
          dataSolicitacao: '2024-01-15T10:30:00Z',
          observacoes: 'Veterinário com 8 anos de experiência em clínica veterinária',
        },
        {
          id: 2,
          status: 'PENDENTE',
          tipo: 'VETERINARIAN',
          dadosUsuario: {
            firstName: 'Dra. Ana',
            lastName: 'Silva',
            email: 'ana.silva@petcare.com',
            phone: '(21) 98877-6655',
            birthDate: '1990-07-22',
            gender: 'F',
            cpf: '987.654.321-00',
            city: 'Rio de Janeiro',
            state: 'RJ',
          },
          documentos: {
            rgFrente: '/api/documents/rg-frente-2.jpg',
            rgVerso: '/api/documents/rg-verso-2.jpg',
            cmrv: '/api/documents/cmrv-2.jpg',
          },
          dataSolicitacao: '2024-01-14T14:45:00Z',
        },
        {
          id: 3,
          status: 'APROVADA',
          tipo: 'VETERINARIAN',
          dadosUsuario: {
            firstName: 'Dr. João',
            lastName: 'Santos',
            email: 'joao.santos@animalcare.com',
            phone: '(31) 97766-5544',
            birthDate: '1988-11-08',
            gender: 'M',
            cpf: '456.789.123-00',
            city: 'Belo Horizonte',
            state: 'MG',
          },
          documentos: {
            rgFrente: '/api/documents/rg-frente-3.jpg',
            rgVerso: '/api/documents/rg-verso-3.jpg',
            cmrv: '/api/documents/cmrv-3.jpg',
          },
          dataSolicitacao: '2024-01-10T09:15:00Z',
          observacoes: 'Aprovado após verificação dos documentos',
        },
        {
          id: 4,
          status: 'REJEITADA',
          tipo: 'VETERINARIAN',
          dadosUsuario: {
            firstName: 'Dra. Maria',
            lastName: 'Costa',
            email: 'maria.costa@vetcare.com',
            phone: '(41) 96655-4433',
            birthDate: '1992-05-12',
            gender: 'F',
            cpf: '789.123.456-00',
            city: 'Curitiba',
            state: 'PR',
          },
          documentos: {
            rgFrente: '/api/documents/rg-frente-4.jpg',
            rgVerso: '/api/documents/rg-verso-4.jpg',
            cmrv: '/api/documents/cmrv-4.jpg',
          },
          dataSolicitacao: '2024-01-08T16:20:00Z',
          observacoes: 'Documentos ilegíveis ou incompletos',
        },
      ];

      setSolicitacoes(mockSolicitacoes);
      setLoading(false);
    };

    loadSolicitacoes();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <Clock className="mr-1 h-3 w-3" />
            Pendente
          </Badge>
        );
      case 'APROVADA':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="mr-1 h-3 w-3" />
            Aprovada
          </Badge>
        );
      case 'REJEITADA':
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            <XCircle className="mr-1 h-3 w-3" />
            Rejeitada
          </Badge>
        );
      default:
        return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return 'border-yellow-300 bg-white shadow-yellow-200';
      case 'APROVADA':
        return 'border-green-200 bg-green-50 shadow-green-200';
      case 'REJEITADA':
        return 'border-red-200 bg-red-50 shadow-red-200';
      default:
        return 'border-gray-200 bg-white shadow-gray-200';
    }
  };

  const handleAprovar = async (id: number) => {
    // TODO: adicionar a api nessa bomba
    setSolicitacoes((prev) =>
      prev.map((solicitacao) =>
        solicitacao.id === id ? { ...solicitacao, status: 'APROVADA' as const } : solicitacao,
      ),
    );
  };

  const handleRejeitar = async (id: number) => {
    // TODO: adicionar a api nessa bomba
    setSolicitacoes((prev) =>
      prev.map((solicitacao) =>
        solicitacao.id === id ? { ...solicitacao, status: 'REJEITADA' as const } : solicitacao,
      ),
    );
  };

  const filteredSolicitacoes = solicitacoes.filter((solicitacao) => solicitacao.status === filter);

  const stats = {
    total: solicitacoes.length,
    pendentes: solicitacoes.filter((s) => s.status === 'PENDENTE').length,
    aprovadas: solicitacoes.filter((s) => s.status === 'APROVADA').length,
    rejeitadas: solicitacoes.filter((s) => s.status === 'REJEITADA').length,
  };

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
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 rounded-lg bg-gray-200"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/admin">
            <UIButton size="sm" variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </UIButton>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Solicitações de Cadastro 📋</h1>
            <p className="text-gray-600">Gerencie as solicitações de cadastro de veterinários na plataforma Vettingo</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <span className="text-sm text-gray-600">
              {stats.pendentes} solicitaç{stats.pendentes !== 1 ? 'ões' : 'ão'} pendente
              {stats.pendentes !== 1 ? 's' : ''}
            </span>
          </div>
          <UIButton size="sm" variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </UIButton>
        </div>
      </div>

      <StatGrid
        stats={[
          {
            icon: FileText,
            iconColor: 'text-blue-600',
            iconBgColor: 'bg-blue-100',
            label: 'Total de Solicitações',
            value: stats.total,
          },
          {
            icon: Clock,
            iconColor: 'text-yellow-600',
            iconBgColor: 'bg-yellow-100',
            label: 'Pendentes',
            value: stats.pendentes,
          },
          {
            icon: CheckCircle,
            iconColor: 'text-green-600',
            iconBgColor: 'bg-green-100',
            label: 'Aprovadas',
            value: stats.aprovadas,
          },
          {
            icon: XCircle,
            iconColor: 'text-red-600',
            iconBgColor: 'bg-red-100',
            label: 'Rejeitadas',
            value: stats.rejeitadas,
          },
        ]}
        columns={4}
      />

      <div className="rounded-lg bg-white p-6 shadow">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Filtrar por status</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <UIButton
            variant={filter === 'PENDENTE' ? 'solid' : 'outline'}
            size="sm"
            onClick={() => setFilter('PENDENTE')}>
            Pendentes ({stats.pendentes})
          </UIButton>
          <UIButton
            variant={filter === 'APROVADA' ? 'solid' : 'outline'}
            size="sm"
            onClick={() => setFilter('APROVADA')}>
            Aprovadas ({stats.aprovadas})
          </UIButton>
          <UIButton
            variant={filter === 'REJEITADA' ? 'solid' : 'outline'}
            size="sm"
            onClick={() => setFilter('REJEITADA')}>
            Rejeitadas ({stats.rejeitadas})
          </UIButton>
        </div>
      </div>

      <div className="rounded-lg bg-white shadow">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Solicitações de Veterinários</h2>
          <span className="text-sm text-gray-600">
            {filteredSolicitacoes.length} solicitação{filteredSolicitacoes.length !== 1 ? 'ões' : ''} encontrada
            {filteredSolicitacoes.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="p-6">
          {filteredSolicitacoes.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-gray-200 p-8 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">Nenhuma solicitação encontrada</h3>
              <p className="text-gray-600">Não há solicitações com o filtro selecionado.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSolicitacoes.map((solicitacao) => (
                <div
                  key={solicitacao.id}
                  className={`rounded-lg border bg-white p-6 shadow-sm ${getStatusColor(solicitacao.status)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="rounded-lg bg-blue-100 p-2">
                            <Stethoscope className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {solicitacao.dadosUsuario.firstName} {solicitacao.dadosUsuario.lastName}
                            </h3>
                            <p className="text-sm text-gray-600">Veterinário</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {getStatusBadge(solicitacao.status)}
                          <div className="flex items-center space-x-2">
                            {solicitacao.status === 'PENDENTE' && (
                              <>
                                <UIButton
                                  size="sm"
                                  variant="solid"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleAprovar(solicitacao.id)}>
                                  <Check className="mr-1 h-4 w-4" />
                                  Aprovar
                                </UIButton>
                                <UIButton
                                  size="sm"
                                  variant="solid"
                                  className="bg-red-600 hover:bg-red-700"
                                  onClick={() => handleRejeitar(solicitacao.id)}>
                                  <X className="mr-1 h-4 w-4" />
                                  Recusar
                                </UIButton>
                              </>
                            )}
                            <Link href={`/dashboard/admin/solicitacoes/${solicitacao.id}`}>
                              <UIButton size="sm" variant="outline">
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Detalhes
                              </UIButton>
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="mr-2 h-4 w-4" />
                            {solicitacao.dadosUsuario.email}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="mr-2 h-4 w-4" />
                            {solicitacao.dadosUsuario.phone}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="mr-2 h-4 w-4" />
                            {solicitacao.dadosUsuario.city}, {solicitacao.dadosUsuario.state}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="mr-2 h-4 w-4" />
                            Data de Nascimento:{' '}
                            {new Date(solicitacao.dadosUsuario.birthDate).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <User className="mr-2 h-4 w-4" />
                            CPF: {solicitacao.dadosUsuario.cpf}
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="mr-2 h-4 w-4" />
                            Solicitado em: {new Date(solicitacao.dataSolicitacao).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>

                      {solicitacao.observacoes && (
                        <div className="mt-4 rounded-lg bg-gray-50 p-3">
                          <p className="text-sm text-gray-700">
                            <strong>Observações:</strong> {solicitacao.observacoes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
