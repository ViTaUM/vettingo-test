import SpotlightCard from '@/components/ui/spotlight-card';
import {
  MessageCircle,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  XCircle,
  Star,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

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
}

interface SupportTicketCardProps {
  ticket: SupportTicket;
}

export default function SupportTicketCard({ ticket }: SupportTicketCardProps) {
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

  const statusConfig = getStatusConfig(ticket.status);
  const priorityConfig = getPriorityConfig(ticket.priority);
  const categoryConfig = getCategoryConfig(ticket.category);
  const StatusIcon = statusConfig.icon;

  return (
    <Link href={`/dashboard/suporte/tickets/${ticket.id}`} className="block">
      <SpotlightCard
        className="group relative rounded-lg border border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-md"
        spotlightColor="blue">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
              {ticket.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-gray-600">{ticket.description}</p>
          </div>

          <div className="flex items-center space-x-2">
            <span
              className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${statusConfig.color}`}>
              <StatusIcon className="mr-1 h-3 w-3" />
              {statusConfig.label}
            </span>
          </div>
        </div>

        {/* Badges */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
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

        {/* Informações */}
        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Atendente</p>
              <p className="text-sm font-medium text-gray-900">{ticket.assignedTo}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Criado em</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(ticket.createdAt)} às {formatTime(ticket.createdAt)}
              </p>
            </div>
          </div>

          {ticket.responseTime && (
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Tempo de resposta</p>
                <p className="text-sm font-medium text-gray-900">{ticket.responseTime}</p>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <MessageCircle className="h-4 w-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Última atualização</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(ticket.updatedAt)} às {formatTime(ticket.updatedAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Última resposta */}
        {ticket.lastResponse && (
          <div className="mt-4 rounded-lg bg-gray-50 p-3">
            <p className="mb-1 text-xs text-gray-500">Última resposta:</p>
            <p className="line-clamp-2 text-sm text-gray-700">{ticket.lastResponse}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <span>Ticket #{ticket.id}</span>
          </div>

          <div className="flex items-center space-x-1 text-blue-600 transition-colors group-hover:text-blue-700">
            <span className="text-sm font-medium">Ver detalhes</span>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </SpotlightCard>
    </Link>
  );
}
