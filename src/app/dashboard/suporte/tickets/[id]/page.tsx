'use client';

import UIButton from '@/components/ui/button';
import { PetDataLoading } from '@/components/ui/pet-data-loading';
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle,
    Clock,
    FileText,
    Mail,
    MessageCircle,
    Send,
    Star,
    XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

// Dados mockados (mesmos da página principal)
const mockTickets: SupportTicket[] = [
  {
    id: 1,
    title: 'Problema ao agendar consulta',
    description:
      'Não consigo agendar uma consulta para meu cachorro. O sistema mostra erro quando tento confirmar o agendamento. Já tentei em diferentes horários e com diferentes veterinários, mas o problema persiste.',
    status: 'open',
    priority: 'high',
    category: 'appointment',
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-16T14:20:00'),
    assignedTo: 'Suporte Técnico',
    lastResponse: 'Estamos investigando o problema. Em breve entraremos em contato.',
    responseTime: '2 horas',
    messages: [
      {
        id: 1,
        sender: 'user',
        message:
          'Não consigo agendar uma consulta para meu cachorro. O sistema mostra erro quando tento confirmar o agendamento.',
        timestamp: new Date('2024-01-15T10:30:00'),
      },
      {
        id: 2,
        sender: 'support',
        message:
          'Olá! Obrigado por entrar em contato. Estamos investigando o problema. Pode me informar qual erro específico está aparecendo?',
        timestamp: new Date('2024-01-15T12:30:00'),
      },
      {
        id: 3,
        sender: 'user',
        message: 'Aparece "Erro interno do servidor" em uma caixa vermelha.',
        timestamp: new Date('2024-01-16T09:15:00'),
      },
      {
        id: 4,
        sender: 'support',
        message: 'Entendi. Estamos investigando o problema. Em breve entraremos em contato com uma solução.',
        timestamp: new Date('2024-01-16T14:20:00'),
      },
    ],
  },
  {
    id: 2,
    title: 'Dúvida sobre vacinação',
    description: 'Gostaria de saber quais vacinas meu gato precisa tomar.',
    status: 'resolved',
    priority: 'medium',
    category: 'health',
    createdAt: new Date('2024-01-10T09:15:00'),
    updatedAt: new Date('2024-01-12T16:45:00'),
    assignedTo: 'Dr. Maria Silva',
    lastResponse: 'Aqui está o calendário de vacinação para gatos...',
    responseTime: '1 dia',
    messages: [
      {
        id: 1,
        sender: 'user',
        message: 'Gostaria de saber quais vacinas meu gato precisa tomar.',
        timestamp: new Date('2024-01-10T09:15:00'),
      },
      {
        id: 2,
        sender: 'support',
        message:
          'Olá! Aqui está o calendário de vacinação para gatos:\n\n- 6-8 semanas: Primeira dose da tríplice felina\n- 10-12 semanas: Segunda dose da tríplice felina\n- 14-16 semanas: Terceira dose da tríplice felina + antirrábica\n- Anualmente: Reforço da tríplice felina + antirrábica\n\nRecomendo agendar uma consulta para avaliação individual do seu gato.',
        timestamp: new Date('2024-01-12T16:45:00'),
      },
    ],
  },
  {
    id: 3,
    title: 'Erro no cadastro de pet',
    description: 'Ao tentar cadastrar meu pet, o sistema não aceita a foto.',
    status: 'in_progress',
    priority: 'low',
    category: 'technical',
    createdAt: new Date('2024-01-18T15:45:00'),
    updatedAt: new Date('2024-01-19T11:30:00'),
    assignedTo: 'Suporte Técnico',
    lastResponse: 'Verificamos o problema. É um bug conhecido que será corrigido na próxima atualização.',
    responseTime: '4 horas',
    messages: [
      {
        id: 1,
        sender: 'user',
        message: 'Ao tentar cadastrar meu pet, o sistema não aceita a foto.',
        timestamp: new Date('2024-01-18T15:45:00'),
      },
      {
        id: 2,
        sender: 'support',
        message: 'Pode me informar qual formato de arquivo está tentando enviar?',
        timestamp: new Date('2024-01-19T08:30:00'),
      },
      {
        id: 3,
        sender: 'user',
        message: 'Estou tentando enviar uma foto JPG de 2MB.',
        timestamp: new Date('2024-01-19T10:15:00'),
      },
      {
        id: 4,
        sender: 'support',
        message:
          'Verificamos o problema. É um bug conhecido que será corrigido na próxima atualização. Por enquanto, tente redimensionar a imagem para menos de 1MB.',
        timestamp: new Date('2024-01-19T11:30:00'),
      },
    ],
  },
];

interface TicketMessage {
  id: number;
  sender: 'user' | 'support';
  message: string;
  timestamp: Date;
}

interface SupportTicket {
  id: number;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  category: 'appointment' | 'health' | 'technical' | 'billing' | 'account' | 'pets';
  createdAt: Date;
  updatedAt: Date;
  assignedTo: string;
  lastResponse: string | null;
  responseTime: string | null;
  messages: TicketMessage[];
}

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);

        // Simular carregamento da API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const foundTicket = mockTickets.find((t) => t.id === ticketId);
        if (foundTicket) {
          setTicket(foundTicket);
        } else {
          toast.error('Ticket não encontrado');
          router.push('/dashboard/suporte');
        }
      } catch {
        toast.error('Erro inesperado ao carregar ticket');
        router.push('/dashboard/suporte');
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId, router]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusConfig = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open':
        return {
          label: 'Aberto',
          color: 'text-orange-600 bg-orange-50 border-orange-200',
          icon: AlertCircle,
        };
      case 'in_progress':
        return {
          label: 'Em Andamento',
          color: 'text-blue-600 bg-blue-50 border-blue-200',
          icon: Clock,
        };
      case 'resolved':
        return {
          label: 'Resolvido',
          color: 'text-green-600 bg-green-50 border-green-200',
          icon: CheckCircle,
        };
      case 'closed':
        return {
          label: 'Fechado',
          color: 'text-gray-600 bg-gray-50 border-gray-200',
          icon: XCircle,
        };
    }
  };

  const getPriorityConfig = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'low':
        return {
          label: 'Baixa',
          color: 'text-green-600 bg-green-50 border-green-200',
        };
      case 'medium':
        return {
          label: 'Média',
          color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
        };
      case 'high':
        return {
          label: 'Alta',
          color: 'text-red-600 bg-red-50 border-red-200',
        };
    }
  };

  const getCategoryConfig = (category: SupportTicket['category']) => {
    switch (category) {
      case 'appointment':
        return {
          label: 'Agendamento',
          color: 'text-blue-600 bg-blue-50 border-blue-200',
        };
      case 'health':
        return {
          label: 'Saúde',
          color: 'text-green-600 bg-green-50 border-green-200',
        };
      case 'technical':
        return {
          label: 'Técnico',
          color: 'text-purple-600 bg-purple-50 border-purple-200',
        };
      case 'billing':
        return {
          label: 'Pagamento',
          color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
        };
      case 'account':
        return {
          label: 'Conta',
          color: 'text-gray-600 bg-gray-50 border-gray-200',
        };
      case 'pets':
        return {
          label: 'Pets',
          color: 'text-pink-600 bg-pink-50 border-pink-200',
        };
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // Simular envio de mensagem
    toast.success('Mensagem enviada com sucesso!');
    setNewMessage('');
  };

  if (loading) {
    return <PetDataLoading type="general" size="lg" inline={true} />;
  }

  if (!ticket) {
    return null;
  }

  const statusConfig = getStatusConfig(ticket.status);
  const priorityConfig = getPriorityConfig(ticket.priority);
  const categoryConfig = getCategoryConfig(ticket.category);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/suporte">
            <UIButton variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </UIButton>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Ticket #{ticket.id}</h1>
            <p className="text-gray-600">{ticket.title}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${statusConfig.color}`}>
            <StatusIcon className="mr-1 h-4 w-4" />
            {statusConfig.label}
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Informações principais */}
        <div className="space-y-6 lg:col-span-2">
          {/* Detalhes do Ticket */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Detalhes do Ticket</h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">{ticket.title}</h3>
                <p className="mt-1 text-gray-600">{ticket.description}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${priorityConfig.color}`}>
                  <Star className="mr-1 h-3 w-3" />
                  {priorityConfig.label}
                </span>
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${categoryConfig.color}`}>
                  {categoryConfig.label}
                </span>
              </div>
            </div>
          </div>

          {/* Conversa */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Conversa</h2>

            <div className="max-h-96 space-y-4 overflow-y-auto">
              {ticket.messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-xs rounded-lg px-4 py-2 lg:max-w-md ${
                      message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
                    }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                    <p className={`mt-1 text-xs ${message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                      {formatDate(message.timestamp)} às {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Nova mensagem */}
            {ticket.status !== 'closed' && (
              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="flex space-x-3">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    rows={3}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                  />
                  <UIButton
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="self-end bg-blue-600 hover:bg-blue-700">
                    <Send className="h-4 w-4" />
                  </UIButton>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status da Conta */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Informações do Ticket</h2>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <div className="flex items-center">
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${statusConfig.color}`}>
                    <StatusIcon className="mr-1 h-3 w-3" />
                    {statusConfig.label}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Prioridade</span>
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${priorityConfig.color}`}>
                  <Star className="mr-1 h-3 w-3" />
                  {priorityConfig.label}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Categoria</span>
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${categoryConfig.color}`}>
                  {categoryConfig.label}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Atendente</span>
                <span className="text-sm font-medium text-gray-900">{ticket.assignedTo}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Criado em</span>
                <span className="text-sm font-medium text-gray-900">{formatDate(ticket.createdAt)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Última atualização</span>
                <span className="text-sm font-medium text-gray-900">{formatDate(ticket.updatedAt)}</span>
              </div>

              {ticket.responseTime && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tempo de resposta</span>
                  <span className="text-sm font-medium text-gray-900">{ticket.responseTime}</span>
                </div>
              )}
            </div>
          </div>

          {/* Contato do Suporte */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Contato do Suporte</h2>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-600">suporte@vettingo.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Horário</p>
                  <p className="text-sm text-gray-600">Seg-Sex, 8h-18h</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ações */}
          {ticket.status !== 'closed' && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Ações</h2>

              <div className="space-y-3">
                <UIButton variant="outline" className="w-full justify-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Anexar Arquivo
                </UIButton>

                <UIButton variant="outline" className="w-full justify-center">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Solicitar Atualização
                </UIButton>

                <UIButton variant="outline" className="w-full justify-center text-red-600 hover:text-red-700">
                  <XCircle className="mr-2 h-4 w-4" />
                  Fechar Ticket
                </UIButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
