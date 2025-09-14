import HookFormCheckbox from '@/components/form/hook-form-checkbox';
import HookFormField from '@/components/form/hook-form-field';
import HookFormSelect from '@/components/form/hook-form-select';
import HookFormTextarea from '@/components/form/hook-form-textarea';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle, Clock, FileText, Mail, MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as z from 'zod';

const contactSupportSchema = z.object({
  category: z.string().min(1, 'Categoria é obrigatória'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  contactPreference: z.enum(['email', 'phone', 'whatsapp']).default('email'),
  urgent: z.boolean().default(false),
  attachFiles: z.boolean().default(false),
});

export default function ContactSupportForm() {
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSupportSchema),
    defaultValues: {
      category: '',
      priority: 'medium',
      title: '',
      description: '',
      contactPreference: 'email',
      urgent: false,
      attachFiles: false,
    },
  });

  const watchedUrgent = watch('urgent');
  const watchedAttachFiles = watch('attachFiles');

  const categoryOptions = [
    { value: '', label: 'Selecione uma categoria' },
    { value: 'appointment', label: 'Agendamento de Consultas' },
    { value: 'health', label: 'Dúvidas sobre Saúde' },
    { value: 'technical', label: 'Problemas Técnicos' },
    { value: 'billing', label: 'Pagamentos e Faturamento' },
    { value: 'account', label: 'Conta e Configurações' },
    { value: 'pets', label: 'Cadastro de Pets' },
    { value: 'other', label: 'Outros' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Baixa - Não urgente' },
    { value: 'medium', label: 'Média - Normal' },
    { value: 'high', label: 'Alta - Urgente' },
  ];

  const contactOptions = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Telefone' },
    { value: 'whatsapp', label: 'WhatsApp' },
  ];

  const onSubmit = async () => {
    try {
      setLoading(true);

      // Simular envio para API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success('Ticket de suporte criado com sucesso! Em breve entraremos em contato.');

      // Resetar formulário
      reset();
    } catch {
      toast.error('Erro ao criar ticket de suporte');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string | undefined) => {
    switch (priority) {
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
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
            <MessageCircle className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Contatar Suporte</h2>
            <p className="text-sm text-gray-600">Crie um ticket de suporte e nossa equipe entrará em contato</p>
          </div>
        </div>

        {/* Informações de Contato */}
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3">
            <Mail className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Email</p>
              <p className="text-sm text-gray-600">suporte@vettingo.com</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 rounded-lg bg-gray-50 p-3">
            <Clock className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Horário</p>
              <p className="text-sm text-gray-600">Seg-Sex, 8h-18h</p>
            </div>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Categoria e Prioridade */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <HookFormSelect
                label="Categoria *"
                name="category"
                options={categoryOptions}
                control={control}
                error={errors.category?.message}
                required
              />
            </div>

            <div>
              <HookFormSelect
                label="Prioridade"
                name="priority"
                options={priorityOptions}
                control={control}
                error={errors.priority?.message}
              />
              {watch('priority') && (
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${getPriorityColor(watch('priority'))}`}>
                    {priorityOptions.find((opt) => opt.value === watch('priority'))?.label}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Título */}
          <HookFormField
            label="Título do Ticket *"
            name="title"
            type="text"
            placeholder="Descreva brevemente o problema"
            control={control}
            error={errors.title?.message}
            required
          />

          {/* Descrição */}
          <HookFormTextarea
            label="Descrição Detalhada *"
            name="description"
            placeholder="Descreva detalhadamente o problema ou dúvida. Inclua informações relevantes como passos para reproduzir o problema, mensagens de erro, etc."
            control={control}
            error={errors.description?.message}
            rows={6}
            required
          />

          {/* Preferência de Contato */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Preferência de Contato</label>
            <div className="grid gap-3 md:grid-cols-3">
              {contactOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex cursor-pointer items-center space-x-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50">
                  <input
                    type="radio"
                    {...control.register('contactPreference')}
                    value={option.value}
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{option.label}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Opções Adicionais */}
          <div className="space-y-4">
            <HookFormCheckbox
              label="Este é um problema urgente que precisa de atenção imediata"
              name="urgent"
              control={control}
            />

            <HookFormCheckbox
              label="Gostaria de anexar arquivos (screenshots, documentos, etc.)"
              name="attachFiles"
              control={control}
            />
          </div>

          {/* Informações Adicionais */}
          {watchedAttachFiles && (
            <div className="rounded-lg bg-blue-50 p-4">
              <div className="flex items-start space-x-3">
                <FileText className="mt-0.5 h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Anexar Arquivos</h4>
                  <p className="mt-1 text-sm text-blue-700">
                    Após criar o ticket, você poderá anexar arquivos como screenshots, documentos ou imagens que ajudem
                    a entender melhor o problema.
                  </p>
                </div>
              </div>
            </div>
          )}

          {watchedUrgent && (
            <div className="rounded-lg bg-orange-50 p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="mt-0.5 h-5 w-5 text-orange-600" />
                <div>
                  <h4 className="text-sm font-medium text-orange-900">Problema Urgente</h4>
                  <p className="mt-1 text-sm text-orange-700">
                    Problemas urgentes são priorizados pela nossa equipe. Você receberá uma resposta em até 2 horas
                    durante o horário comercial.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Ações */}
          <div className="flex items-center justify-end space-x-3 border-t border-gray-200 pt-6">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? (
                <div className="flex items-center">
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Criando Ticket...
                </div>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Criar Ticket de Suporte
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Dicas */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
          <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
          Dicas para um Atendimento Mais Rápido
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <strong>•</strong> Descreva o problema de forma clara e detalhada
            </p>
            <p className="text-sm text-gray-600">
              <strong>•</strong> Inclua passos para reproduzir o problema
            </p>
            <p className="text-sm text-gray-600">
              <strong>•</strong> Mencione mensagens de erro, se houver
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <strong>•</strong> Anexe screenshots quando relevante
            </p>
            <p className="text-sm text-gray-600">
              <strong>•</strong> Informe seu navegador e sistema operacional
            </p>
            <p className="text-sm text-gray-600">
              <strong>•</strong> Verifique o FAQ antes de criar um ticket
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
