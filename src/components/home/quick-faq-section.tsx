'use client';

import { HelpCircle, Clock, Shield, CreditCard, Users } from 'lucide-react';
import { useState } from 'react';
import FAQCard from '@/components/ui/faq-card';

const faqs = [
  {
    question: 'Como funciona o agendamento de consultas?',
    answer:
      'Você busca veterinários por região ou especialidade, compara perfis e avaliações, e agenda diretamente pela plataforma. É simples, rápido e seguro.',
    icon: Clock,
    color: 'blue',
  },
  {
    question: 'Os veterinários são verificados?',
    answer:
      'Sim! Todos os profissionais passam por um rigoroso processo de verificação de credenciais, incluindo validação do CRMV e experiência profissional.',
    icon: Shield,
    color: 'emerald',
  },
  {
    question: 'Posso cancelar ou reagendar consultas?',
    answer:
      'Claro! Você pode cancelar ou reagendar suas consultas até 2 horas antes do horário marcado, sem nenhuma taxa adicional.',
    icon: Users,
    color: 'purple',
  },
  {
    question: 'Como funciona o pagamento?',
    answer:
      'O pagamento é processado de forma segura pela plataforma. Aceitamos cartões de crédito, PIX e outros métodos populares. Você só paga após a consulta.',
    icon: CreditCard,
    color: 'orange',
  },
];

export default function QuickFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600">
              <HelpCircle className="h-6 w-6 text-white" />
            </div>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Perguntas{' '}
            <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Frequentes
            </span>
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Tire suas principais dúvidas sobre nossa plataforma. Se não encontrar o que procura, nossa equipe está
            sempre pronta para ajudar.
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-6 md:grid-cols-2">
            {faqs.map((faq, index) => (
              <FAQCard
                key={index}
                question={faq.question}
                answer={faq.answer}
                icon={faq.icon}
                color={faq.color}
                controlled={true}
                isOpen={openIndex === index}
                onToggle={() => toggleFAQ(index)}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-gradient-to-r from-blue-50 to-emerald-50 p-8">
            <div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">Ainda tem dúvidas?</h3>
              <p className="text-gray-600">Nossa equipe de suporte está sempre pronta para ajudar você</p>
            </div>
            <div className="flex gap-4">
              <a
                href="/faq"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-all duration-200 hover:scale-105 hover:bg-gray-50">
                Ver todas as FAQ
              </a>
              <a
                href="/contato"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-emerald-700">
                Falar com Suporte
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
