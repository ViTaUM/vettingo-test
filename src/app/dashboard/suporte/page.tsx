'use client';

import ContactSupportForm from '@/components/dashboard/support/contact-support-form';
import FAQSection from '@/components/dashboard/support/faq-section';
import SupportTicketCard from '@/components/dashboard/support/support-ticket-card';
import SearchField from '@/components/form/search-field';
import FormSelect from '@/components/form/select';
import UIButton from '@/components/ui/button';
import { PetDataLoading } from '@/components/ui/pet-data-loading';
import { BookOpen, Filter, HelpCircle, MessageCircle, Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

// Dados mockados para tickets de suporte
const mockTickets: SupportTicket[] = [
  {
    id: 1,
    title: 'Problema ao agendar consulta',
    description: 'Não consigo agendar uma consulta para meu cachorro. O sistema mostra erro.',
    status: 'open' as TicketStatus,
    priority: 'high' as TicketPriority,
    category: 'appointment' as TicketCategory,
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-16T14:20:00'),
    assignedTo: 'Suporte Técnico',
    lastResponse: 'Estamos investigando o problema. Em breve entraremos em contato.',
    responseTime: '2 horas',
  },
  {
    id: 2,
    title: 'Dúvida sobre vacinação',
    description: 'Gostaria de saber quais vacinas meu gato precisa tomar.',
    status: 'resolved' as TicketStatus,
    priority: 'medium' as TicketPriority,
    category: 'health' as TicketCategory,
    createdAt: new Date('2024-01-10T09:15:00'),
    updatedAt: new Date('2024-01-12T16:45:00'),
    assignedTo: 'Dr. Maria Silva',
    lastResponse: 'Aqui está o calendário de vacinação para gatos...',
    responseTime: '1 dia',
  },
  {
    id: 3,
    title: 'Erro no cadastro de pet',
    description: 'Ao tentar cadastrar meu pet, o sistema não aceita a foto.',
    status: 'in_progress' as TicketStatus,
    priority: 'low' as TicketPriority,
    category: 'technical' as TicketCategory,
    createdAt: new Date('2024-01-18T15:45:00'),
    updatedAt: new Date('2024-01-19T11:30:00'),
    assignedTo: 'Suporte Técnico',
    lastResponse: 'Verificamos o problema. É um bug conhecido que será corrigido na próxima atualização.',
    responseTime: '4 horas',
  },
  {
    id: 4,
    title: 'Cancelamento de consulta',
    description: 'Preciso cancelar uma consulta agendada para amanhã.',
    status: 'closed' as TicketStatus,
    priority: 'high' as TicketPriority,
    category: 'appointment' as TicketCategory,
    createdAt: new Date('2024-01-05T08:20:00'),
    updatedAt: new Date('2024-01-05T10:15:00'),
    assignedTo: 'Atendimento',
    lastResponse: 'Consulta cancelada com sucesso. Reembolso processado.',
    responseTime: '30 minutos',
  },
  {
    id: 5,
    title: 'Dúvida sobre plano premium',
    description: 'Quais são os benefícios do plano premium?',
    status: 'open' as TicketStatus,
    priority: 'medium' as TicketPriority,
    category: 'billing' as TicketCategory,
    createdAt: new Date('2024-01-20T12:00:00'),
    updatedAt: new Date('2024-01-20T12:00:00'),
    assignedTo: 'Comercial',
    lastResponse: null,
    responseTime: null,
  },
];

// Dados mockados para FAQ
const mockFAQ = [
  {
    id: 1,
    question: 'Como agendar uma consulta veterinária?',
    answer:
      'Para agendar uma consulta, acesse a seção "Busca" no menu principal, encontre um veterinário próximo e clique em "Agendar Consulta". Você pode filtrar por especialidade, localização e disponibilidade.',
    category: 'appointment',
    helpful: 45,
    notHelpful: 2,
  },
  {
    id: 2,
    question: 'Posso cancelar uma consulta?',
    answer:
      'Sim, você pode cancelar consultas até 48 horas antes do horário agendado. Acesse "Minhas Consultas" e clique em "Cancelar". Cancelamentos com menos de 48h podem ter taxa de cancelamento.',
    category: 'appointment',
    helpful: 38,
    notHelpful: 5,
  },
  {
    id: 3,
    question: 'Como cadastrar meu pet?',
    answer:
      'Vá em "Meus Pets" no dashboard e clique em "Adicionar Pet". Preencha as informações básicas como nome, tipo, raça e data de nascimento. Você pode adicionar uma foto opcional.',
    category: 'pets',
    helpful: 52,
    notHelpful: 1,
  },
  {
    id: 4,
    question: 'Quais métodos de pagamento são aceitos?',
    answer:
      'Aceitamos cartões de crédito e débito (Visa, Mastercard, Elo), PIX e boleto bancário. Todos os pagamentos são processados de forma segura.',
    category: 'billing',
    helpful: 41,
    notHelpful: 3,
  },
  {
    id: 5,
    question: 'Como funciona o plano premium?',
    answer:
      'O plano premium oferece consultas ilimitadas, prioridade no atendimento, descontos em medicamentos e acesso a especialistas. O valor é cobrado mensalmente.',
    category: 'billing',
    helpful: 29,
    notHelpful: 8,
  },
  {
    id: 6,
    question: 'Posso alterar meus dados pessoais?',
    answer:
      'Sim, acesse "Configurações" no seu dashboard e clique em "Informações Pessoais". Você pode alterar nome, email, telefone e outras informações de contato.',
    category: 'account',
    helpful: 35,
    notHelpful: 4,
  },
];

type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
type TicketPriority = 'low' | 'medium' | 'high';
type TicketCategory = 'appointment' | 'health' | 'technical' | 'billing' | 'account' | 'pets';

interface SupportTicket {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  category: TicketCategory;
  createdAt: Date;
  updatedAt: Date;
  assignedTo: string;
  lastResponse: string | null;
  responseTime: string | null;
}

export default function SuportePage() {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<SupportTicket[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState<'tickets' | 'faq' | 'contact'>('tickets');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Simular carregamento da API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setTickets(mockTickets);
        setFilteredTickets(mockTickets);
      } catch {
        toast.error('Erro ao carregar dados de suporte');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let filtered = tickets;

    if (searchQuery) {
      filtered = filtered.filter(
        (ticket) =>
          ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ticket.description.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (filterStatus) {
      filtered = filtered.filter((ticket) => ticket.status === filterStatus);
    }

    if (filterPriority) {
      filtered = filtered.filter((ticket) => ticket.priority === filterPriority);
    }

    if (filterCategory) {
      filtered = filtered.filter((ticket) => ticket.category === filterCategory);
    }

    setFilteredTickets(filtered);
  }, [tickets, searchQuery, filterStatus, filterPriority, filterCategory]);

  const getTicketStats = () => {
    const stats = {
      total: tickets.length,
      open: tickets.filter((t) => t.status === 'open').length,
      inProgress: tickets.filter((t) => t.status === 'in_progress').length,
      resolved: tickets.filter((t) => t.status === 'resolved').length,
    };
    return stats;
  };

  const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'open', label: 'Aberto' },
    { value: 'in_progress', label: 'Em Andamento' },
    { value: 'resolved', label: 'Resolvido' },
    { value: 'closed', label: 'Fechado' },
  ];

  const priorityOptions = [
    { value: '', label: 'Todas as prioridades' },
    { value: 'low', label: 'Baixa' },
    { value: 'medium', label: 'Média' },
    { value: 'high', label: 'Alta' },
  ];

  const categoryOptions = [
    { value: '', label: 'Todas as categorias' },
    { value: 'appointment', label: 'Agendamento' },
    { value: 'health', label: 'Saúde' },
    { value: 'technical', label: 'Técnico' },
    { value: 'billing', label: 'Pagamento' },
    { value: 'account', label: 'Conta' },
    { value: 'pets', label: 'Pets' },
  ];

  const handleNewTicket = () => {
    setActiveTab('contact');
  };

  const stats = getTicketStats();

  if (loading) {
    return <PetDataLoading type="general" size="lg" inline={true} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Suporte</h1>
          <p className="mt-2 text-gray-600">Central de ajuda, tickets de suporte e FAQ</p>
        </div>
        <UIButton onClick={handleNewTicket} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Novo Ticket
        </UIButton>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-500">Total de Tickets</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.open}</div>
          <div className="text-sm text-gray-500">Em Aberto</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
          <div className="text-sm text-gray-500">Em Andamento</div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
          <div className="text-sm text-gray-500">Resolvidos</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('tickets')}
            className={`border-b-2 px-1 py-2 text-sm font-medium ${
              activeTab === 'tickets'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}>
            <MessageCircle className="mr-2 inline h-4 w-4" />
            Meus Tickets ({tickets.length})
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`border-b-2 px-1 py-2 text-sm font-medium ${
              activeTab === 'faq'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}>
            <BookOpen className="mr-2 inline h-4 w-4" />
            FAQ ({mockFAQ.length})
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`border-b-2 px-1 py-2 text-sm font-medium ${
              activeTab === 'contact'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}>
            <HelpCircle className="mr-2 inline h-4 w-4" />
            Contatar Suporte
          </button>
        </nav>
      </div>

      {/* Conteúdo das Tabs */}
      {activeTab === 'tickets' && (
        <div className="space-y-6">
          {/* Filtros */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="flex-1">
                <SearchField
                  name="search"
                  placeholder="Buscar por título ou descrição..."
                  initialValue={searchQuery}
                  onChange={(value) => setSearchQuery(value)}
                />
              </div>
              <div className="flex items-center gap-3">
                <UIButton
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className={showFilters ? 'border-blue-300 bg-blue-50' : ''}>
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                </UIButton>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 border-t border-gray-200 pt-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <FormSelect
                    label="Status"
                    name="status"
                    value={filterStatus}
                    options={statusOptions}
                    onChange={(value) => setFilterStatus(value)}
                  />
                  <FormSelect
                    label="Prioridade"
                    name="priority"
                    value={filterPriority}
                    options={priorityOptions}
                    onChange={(value) => setFilterPriority(value)}
                  />
                  <FormSelect
                    label="Categoria"
                    name="category"
                    value={filterCategory}
                    options={categoryOptions}
                    onChange={(value) => setFilterCategory(value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Lista de Tickets */}
          {filteredTickets.length === 0 ? (
            <div className="py-12 text-center">
              {tickets.length === 0 ? (
                <div className="mx-auto max-w-md">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <MessageCircle className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-gray-900">Nenhum ticket encontrado</h3>
                  <p className="mb-6 text-gray-500">
                    Você ainda não criou nenhum ticket de suporte. Clique em &quot;Novo Ticket&quot; para começar.
                  </p>
                  <UIButton onClick={handleNewTicket} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Primeiro Ticket
                  </UIButton>
                </div>
              ) : (
                <div className="mx-auto max-w-md">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-gray-900">Nenhum ticket encontrado</h3>
                  <p className="mb-6 text-gray-500">Tente ajustar os filtros ou buscar por outros termos.</p>
                  <UIButton
                    variant="outline"
                    onClick={() => {
                      setSearchQuery('');
                      setFilterStatus('');
                      setFilterPriority('');
                      setFilterCategory('');
                    }}>
                    Limpar Filtros
                  </UIButton>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <SupportTicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          )}

          {/* Resultados */}
          {filteredTickets.length > 0 && (
            <div className="text-center text-sm text-gray-500">
              Mostrando {filteredTickets.length} de {tickets.length} ticket{tickets.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}

      {activeTab === 'faq' && <FAQSection faqItems={mockFAQ} />}

      {activeTab === 'contact' && <ContactSupportForm />}
    </div>
  );
}
