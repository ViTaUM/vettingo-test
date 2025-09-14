'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import UIButton from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatGrid } from '@/components/dashboard/stats';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  FileText,
  Download,
  Eye,
  AlertTriangle,
  Shield,
  Check,
  X,
  Stethoscope,
  RefreshCw,
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
  motivoRejeicao?: string;
}

export default function SolicitacaoDetalhesPage() {
  const params = useParams();
  const [solicitacao, setSolicitacao] = useState<SolicitacaoCadastro | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [motivoRejeicao, setMotivoRejeicao] = useState('');
  const [showRejeicaoModal, setShowRejeicaoModal] = useState(false);

  useEffect(() => {
    const loadSolicitacao = async () => {
      // TODO: Substituir por chamada real à API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockSolicitacao: SolicitacaoCadastro = {
        id: Number(params.id),
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
        observacoes:
          'Veterinário com 8 anos de experiência em clínica veterinária. Especialista em cirurgia de pequenos animais.',
      };

      setSolicitacao(mockSolicitacao);
      setLoading(false);
    };

    loadSolicitacao();
  }, [params.id]);

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

  const handleAprovar = async () => {
    setActionLoading(true);
    // TODO: Implementar chamada à API
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (solicitacao) {
      setSolicitacao({
        ...solicitacao,
        status: 'APROVADA',
      });
    }
    setActionLoading(false);
  };

  const handleRejeitar = async () => {
    if (!motivoRejeicao.trim()) {
      alert('Por favor, informe o motivo da rejeição.');
      return;
    }

    setActionLoading(true);
    // TODO: Implementar chamada à API
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (solicitacao) {
      setSolicitacao({
        ...solicitacao,
        status: 'REJEITADA',
        motivoRejeicao: motivoRejeicao,
      });
    }
    setActionLoading(false);
    setShowRejeicaoModal(false);
    setMotivoRejeicao('');
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
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="h-96 rounded-lg bg-gray-200"></div>
            <div className="h-96 rounded-lg bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!solicitacao) {
    return (
      <div className="rounded-lg bg-white p-8 text-center shadow">
        <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
        <h2 className="mb-2 text-xl font-semibold text-gray-900">Solicitação não encontrada</h2>
        <p className="mb-4 text-gray-600">A solicitação solicitada não foi encontrada.</p>
        <Link href="/dashboard/admin/solicitacoes">
          <UIButton>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar às Solicitações
          </UIButton>
        </Link>
      </div>
    );
  }

  const stats = [
    {
      icon: User,
      iconColor: 'text-blue-600',
      iconBgColor: 'bg-blue-100',
      label: 'Candidato',
      value: `${solicitacao.dadosUsuario.firstName} ${solicitacao.dadosUsuario.lastName}`,
    },
    {
      icon: Calendar,
      iconColor: 'text-green-600',
      iconBgColor: 'bg-green-100',
      label: 'Data da Solicitação',
      value: new Date(solicitacao.dataSolicitacao).toLocaleDateString('pt-BR'),
    },
    {
      icon: MapPin,
      iconColor: 'text-purple-600',
      iconBgColor: 'bg-purple-100',
      label: 'Localização',
      value: `${solicitacao.dadosUsuario.city}, ${solicitacao.dadosUsuario.state}`,
    },
    {
      icon: Stethoscope,
      iconColor: 'text-orange-600',
      iconBgColor: 'bg-orange-100',
      label: 'Status',
      value:
        solicitacao.status === 'PENDENTE' ? 'Pendente' : solicitacao.status === 'APROVADA' ? 'Aprovada' : 'Rejeitada',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/admin/solicitacoes">
            <UIButton variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </UIButton>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Solicitação #{solicitacao.id} 📋</h1>
            <p className="text-gray-600">Detalhes da solicitação de cadastro de veterinário</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {getStatusBadge(solicitacao.status)}
          {solicitacao.status === 'PENDENTE' && (
            <div className="flex space-x-2">
              <UIButton onClick={handleAprovar} disabled={actionLoading} className="bg-green-600 hover:bg-green-700">
                <Check className="mr-2 h-4 w-4" />
                Aprovar
              </UIButton>
              <UIButton
                onClick={() => setShowRejeicaoModal(true)}
                disabled={actionLoading}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50">
                <X className="mr-2 h-4 w-4" />
                Rejeitar
              </UIButton>
            </div>
          )}
          <UIButton size="sm" variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Atualizar
          </UIButton>
        </div>
      </div>

      {/* Stats Cards */}
      <StatGrid stats={stats} columns={4} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Informações do Usuário */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Informações do Candidato</h2>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Veterinário
            </Badge>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {solicitacao.dadosUsuario.firstName} {solicitacao.dadosUsuario.lastName}
              </h3>
              <p className="text-sm text-gray-600">Candidato à plataforma Vettingo</p>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
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
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="mr-2 h-4 w-4" />
                {new Date(solicitacao.dadosUsuario.birthDate).toLocaleDateString('pt-BR')}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Shield className="mr-2 h-4 w-4" />
                CPF: {solicitacao.dadosUsuario.cpf}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <FileText className="mr-2 h-4 w-4" />
                Solicitado em: {new Date(solicitacao.dataSolicitacao).toLocaleDateString('pt-BR')}
              </div>
            </div>

            {solicitacao.observacoes && (
              <div className="mt-4 rounded-lg bg-blue-50 p-4">
                <h4 className="mb-2 font-medium text-blue-900">Observações do Candidato</h4>
                <p className="text-sm text-blue-800">{solicitacao.observacoes}</p>
              </div>
            )}

            {solicitacao.motivoRejeicao && (
              <div className="mt-4 rounded-lg bg-red-50 p-4">
                <h4 className="mb-2 font-medium text-red-900">Motivo da Rejeição</h4>
                <p className="text-sm text-red-800">{solicitacao.motivoRejeicao}</p>
              </div>
            )}
          </div>
        </div>

        {/* Documentos */}
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">Documentos</h2>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {Object.keys(solicitacao.documentos).length} documentos
            </Badge>
          </div>

          <div className="space-y-4">
            {/* RG Frente */}
            <div>
              <h3 className="mb-2 font-medium text-gray-900">RG - Frente</h3>
              <div className="relative">
                <Image
                  src={solicitacao.documentos.rgFrente}
                  alt="RG Frente"
                  width={400}
                  height={192}
                  className="h-48 w-full rounded-lg border object-cover"
                  onError={() => {
                    // Fallback será tratado pelo componente Image
                  }}
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <UIButton size="sm" variant="outline" className="bg-white">
                    <Eye className="h-4 w-4" />
                  </UIButton>
                  <UIButton size="sm" variant="outline" className="bg-white">
                    <Download className="h-4 w-4" />
                  </UIButton>
                </div>
              </div>
            </div>

            {/* RG Verso */}
            <div>
              <h3 className="mb-2 font-medium text-gray-900">RG - Verso</h3>
              <div className="relative">
                <Image
                  src={solicitacao.documentos.rgVerso}
                  alt="RG Verso"
                  width={400}
                  height={192}
                  className="h-48 w-full rounded-lg border object-cover"
                  onError={() => {
                    // Fallback será tratado pelo componente Image
                  }}
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <UIButton size="sm" variant="outline" className="bg-white">
                    <Eye className="h-4 w-4" />
                  </UIButton>
                  <UIButton size="sm" variant="outline" className="bg-white">
                    <Download className="h-4 w-4" />
                  </UIButton>
                </div>
              </div>
            </div>

            {/* CMRV */}
            <div>
              <h3 className="mb-2 font-medium text-gray-900">CMRV (Registro Profissional)</h3>
              <div className="relative">
                <Image
                  src={solicitacao.documentos.cmrv}
                  alt="CMRV"
                  width={400}
                  height={192}
                  className="h-48 w-full rounded-lg border object-cover"
                  onError={() => {
                    // Fallback será tratado pelo componente Image
                  }}
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <UIButton size="sm" variant="outline" className="bg-white">
                    <Eye className="h-4 w-4" />
                  </UIButton>
                  <UIButton size="sm" variant="outline" className="bg-white">
                    <Download className="h-4 w-4" />
                  </UIButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Rejeição */}
      {showRejeicaoModal && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">Rejeitar Solicitação</h3>
            </div>

            <p className="mb-4 text-gray-600">
              Informe o motivo da rejeição para que o candidato possa entender e corrigir os problemas.
            </p>

            <textarea
              value={motivoRejeicao}
              onChange={(e) => setMotivoRejeicao(e.target.value)}
              placeholder="Ex: Documentos ilegíveis, CMRV inválido, informações inconsistentes..."
              className="h-32 w-full resize-none rounded-lg border border-gray-300 p-3"
            />

            <div className="mt-4 flex space-x-3">
              <UIButton
                onClick={handleRejeitar}
                disabled={actionLoading || !motivoRejeicao.trim()}
                className="bg-red-600 hover:bg-red-700">
                <X className="mr-2 h-4 w-4" />
                Confirmar Rejeição
              </UIButton>
              <UIButton
                onClick={() => {
                  setShowRejeicaoModal(false);
                  setMotivoRejeicao('');
                }}
                variant="outline">
                Cancelar
              </UIButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
