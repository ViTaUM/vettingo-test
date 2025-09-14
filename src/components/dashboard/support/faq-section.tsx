import { useState } from 'react';
import { ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, Search, BookOpen } from 'lucide-react';
import SearchField from '@/components/form/search-field';
import FormSelect from '@/components/form/select';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  helpful: number;
  notHelpful: number;
}

interface FAQSectionProps {
  faqItems: FAQItem[];
}

export default function FAQSection({ faqItems }: FAQSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [helpfulVotes, setHelpfulVotes] = useState<Set<number>>(new Set());
  const [notHelpfulVotes, setNotHelpfulVotes] = useState<Set<number>>(new Set());

  const filteredFAQ = faqItems.filter((item) => {
    const matchesSearch =
      searchQuery === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === '' || item.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  const categoryOptions = [
    { value: '', label: 'Todas as categorias' },
    { value: 'appointment', label: 'Agendamento' },
    { value: 'pets', label: 'Pets' },
    { value: 'billing', label: 'Pagamento' },
    { value: 'account', label: 'Conta' },
    { value: 'technical', label: 'Técnico' },
  ];

  const toggleExpanded = (id: number) => {
    setExpandedItems((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]));
  };

  const handleHelpfulVote = (id: number) => {
    if (helpfulVotes.has(id)) {
      setHelpfulVotes((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } else {
      setHelpfulVotes((prev) => new Set([...prev, id]));
      setNotHelpfulVotes((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleNotHelpfulVote = (id: number) => {
    if (notHelpfulVotes.has(id)) {
      setNotHelpfulVotes((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } else {
      setNotHelpfulVotes((prev) => new Set([...prev, id]));
      setHelpfulVotes((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const getCategoryLabel = (category: string) => {
    const option = categoryOptions.find((opt) => opt.value === category);
    return option?.label || category;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'appointment':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pets':
        return 'text-pink-600 bg-pink-50 border-pink-200';
      case 'billing':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'account':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'technical':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <BookOpen className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Perguntas Frequentes</h2>
            <p className="text-sm text-gray-600">Encontre respostas rápidas para as dúvidas mais comuns</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex-1">
            <SearchField
              name="search"
              placeholder="Buscar por pergunta ou resposta..."
              initialValue={searchQuery}
              onChange={(value) => setSearchQuery(value)}
            />
          </div>
          <div className="lg:w-64">
            <FormSelect
              label="Categoria"
              name="category"
              value={filterCategory}
              options={categoryOptions}
              onChange={(value) => setFilterCategory(value)}
            />
          </div>
        </div>
      </div>

      {/* Lista de FAQ */}
      {filteredFAQ.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">Nenhuma pergunta encontrada</h3>
          <p className="mb-6 text-gray-500">Tente ajustar os filtros ou buscar por outros termos.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilterCategory('');
            }}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none">
            Limpar Filtros
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredFAQ.map((item) => {
            const isExpanded = expandedItems.includes(item.id);
            const hasVotedHelpful = helpfulVotes.has(item.id);
            const hasVotedNotHelpful = notHelpfulVotes.has(item.id);

            return (
              <div key={item.id} className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                {/* Pergunta */}
                <button
                  onClick={() => toggleExpanded(item.id)}
                  className="w-full px-6 py-4 text-left transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-inset">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{item.question}</h3>
                      <div className="mt-2 flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${getCategoryColor(item.category)}`}>
                          {getCategoryLabel(item.category)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {item.helpful + (hasVotedHelpful ? 1 : 0)} úteis •{' '}
                          {item.notHelpful + (hasVotedNotHelpful ? 1 : 0)} não úteis
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Resposta */}
                {isExpanded && (
                  <div className="px-6 pb-4">
                    <div className="border-t border-gray-200 pt-4">
                      <p className="mb-4 leading-relaxed text-gray-700">{item.answer}</p>

                      {/* Feedback */}
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">Esta resposta foi útil?</span>
                        <button
                          onClick={() => handleHelpfulVote(item.id)}
                          className={`inline-flex items-center space-x-1 rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                            hasVotedHelpful
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-600'
                          }`}>
                          <ThumbsUp className="h-4 w-4" />
                          <span>Sim</span>
                        </button>
                        <button
                          onClick={() => handleNotHelpfulVote(item.id)}
                          className={`inline-flex items-center space-x-1 rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                            hasVotedNotHelpful
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600'
                          }`}>
                          <ThumbsDown className="h-4 w-4" />
                          <span>Não</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Resultados */}
      {filteredFAQ.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          Mostrando {filteredFAQ.length} de {faqItems.length} pergunta{faqItems.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
