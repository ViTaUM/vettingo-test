'use client';

import HookFormField from '@/components/form/hook-form-field';
import HookFormTextarea from '@/components/form/hook-form-textarea';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const contactFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.email('E-mail inválido'),
  subject: z.string().min(1, 'Assunto é obrigatório'),
  message: z.string().min(10, 'Mensagem deve ter pelo menos 10 caracteres'),
});

export default function ContatoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async () => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitStatus('success');
      reset();
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Entre em Contato</h1>
            <p className="mt-4 text-lg text-gray-600">
              Tem alguma dúvida ou sugestão? Estamos aqui para ajudar!
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Informações de Contato</h2>
                <p className="mt-4 text-gray-600">
                  Entre em contato conosco através dos canais abaixo ou preencha o formulário ao lado.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">E-mail</h3>
                    <p className="mt-1 text-gray-600">contato@vettingo.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-8 shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-900">Envie sua Mensagem</h2>
              <p className="mt-2 text-gray-600">Preencha o formulário abaixo e entraremos em contato em breve.</p>

              <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
                <HookFormField
                  label="Nome Completo"
                  name="name"
                  type="text"
                  control={control}
                  error={errors.name?.message}
                  required
                />

                <HookFormField
                  label="E-mail"
                  name="email"
                  type="email"
                  control={control}
                  error={errors.email?.message}
                  required
                />

                <HookFormField
                  label="Assunto"
                  name="subject"
                  type="text"
                  control={control}
                  error={errors.subject?.message}
                  required
                />

                <HookFormTextarea
                  label="Mensagem"
                  name="message"
                  control={control}
                  error={errors.message?.message}
                  required
                  rows={5}
                />

                {submitStatus === 'success' && (
                  <div className="rounded-lg bg-green-50 p-4">
                    <p className="text-sm text-green-800">
                      Mensagem enviada com sucesso! Entraremos em contato em breve.
                    </p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="rounded-lg bg-red-50 p-4">
                    <p className="text-sm text-red-800">
                      Erro ao enviar mensagem. Tente novamente.
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  variant="solid"
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700">
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
