'use client';

import { useSubscriptionPlans } from '@/hooks/use-subscriptions';
import { ArrowRight, Check, Crown, Shield, Star } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function PlanosPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const { plans, isLoading, error } = useSubscriptionPlans();

  const getPlanIcon = (slug: string) => {
    switch (slug) {
      case 'BASIC':
        return <Shield className="h-6 w-6" />;
      case 'PREMIUM':
        return <Crown className="h-6 w-6" />;
      case 'ENTERPRISE':
        return <Star className="h-6 w-6" />;
      default:
        return <Shield className="h-6 w-6" />;
    }
  };

  const getPlanColor = (slug: string) => {
    switch (slug) {
      case 'BASIC':
        return 'blue';
      case 'PREMIUM':
        return 'purple';
      case 'ENTERPRISE':
        return 'emerald';
      default:
        return 'blue';
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Grátis';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price / 100);
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      purple: 'from-purple-500 to-purple-600',
      emerald: 'from-emerald-500 to-emerald-600',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getBorderColor = (color: string) => {
    const colors = {
      blue: 'border-blue-200',
      purple: 'border-purple-200',
      emerald: 'border-emerald-200',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="mx-auto h-8 w-64 rounded bg-gray-200 mb-4"></div>
              <div className="mx-auto h-4 w-96 rounded bg-gray-200"></div>
            </div>
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl border-2 bg-white p-6 shadow-lg">
                <div className="h-8 w-3/4 rounded bg-gray-200 mb-4"></div>
                <div className="h-6 w-1/2 rounded bg-gray-200 mb-6"></div>
                <div className="space-y-2">
                  <div className="h-4 rounded bg-gray-200"></div>
                  <div className="h-4 w-5/6 rounded bg-gray-200"></div>
                  <div className="h-4 w-4/5 rounded bg-gray-200"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Erro ao carregar planos</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-emerald-600 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="mb-4 text-3xl font-bold text-white">Escolha o Plano Ideal para Você</h1>
            <p className="mx-auto max-w-2xl text-lg text-white/90">
              Planos flexíveis que crescem junto com seu negócio. Comece grátis e atualize quando precisar.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Toggle */}
      <section className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex justify-center">
            <div className="rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
              <div className="flex">
                <button
                  onClick={() => setSelectedPeriod('monthly')}
                  className={`rounded-lg px-6 py-2 text-sm font-medium transition-colors ${
                    selectedPeriod === 'monthly' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}>
                  Mensal
                </button>
                <button
                  onClick={() => setSelectedPeriod('yearly')}
                  className={`rounded-lg px-6 py-2 text-sm font-medium transition-colors ${
                    selectedPeriod === 'yearly' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
                  }`}>
                  Anual
                  <span className="ml-1 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">-17%</span>
                </button>
              </div>
            </div>
          </div>

          {/* Plans Grid */}
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-3">
            {plans.map((plan) => {
              const color = getPlanColor(plan.slug);
              const icon = getPlanIcon(plan.slug);
              const isPopular = plan.slug === 'PREMIUM';
              
              return (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl border-2 bg-white p-6 shadow-lg transition-all hover:shadow-xl ${
                    isPopular ? `border-${color}-500 shadow-${color}-100` : getBorderColor(color)
                  }`}>
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 transform">
                      <span className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1 text-xs font-bold text-white">
                        Mais Popular
                      </span>
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="mb-6 text-center">
                    <div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${getColorClasses(color)} mb-4 text-white`}>
                      {icon}
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900">{plan.name}</h3>
                    <p className="text-sm text-gray-600">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-6 text-center">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900">
                        {selectedPeriod === 'monthly' 
                          ? formatPrice(plan.priceMonthly || 0)
                          : formatPrice(plan.priceYearly || 0)
                        }
                      </span>
                      <span className="ml-1 text-gray-500">
                        /{selectedPeriod === 'monthly' ? 'mês' : 'ano'}
                      </span>
                    </div>
                    {selectedPeriod === 'yearly' && plan.priceYearly && plan.priceMonthly && (
                      <p className="mt-1 text-sm text-green-600">
                        Economia de {formatPrice((plan.priceMonthly * 12) - plan.priceYearly)} por ano
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <div className="mb-8 space-y-3">
                    <h4 className="font-semibold text-gray-900">Incluído no plano:</h4>
                    <ul className="space-y-2">
                      {Array.isArray(plan.features) && plan.features.length > 0 ? (
                        plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start text-sm text-gray-600">
                            <Check className="mt-0.5 mr-3 h-4 w-4 flex-shrink-0 text-green-500" />
                            {feature}
                          </li>
                        ))
                      ) : (
                        <li className="text-sm text-gray-500 italic">
                          Recursos não disponíveis
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={`/cadastre-se?plan=${plan.slug}&period=${selectedPeriod}`}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 font-medium transition-colors ${
                      isPopular
                        ? `bg-gradient-to-r ${getColorClasses(color)} text-white hover:opacity-90`
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}>
                    {isPopular ? 'Começar Agora' : 'Escolher Plano'}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Compare os Recursos</h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              Veja em detalhes o que cada plano oferece para ajudar você a escolher o melhor para seu negócio.
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Recurso</th>
                    {plans.map((plan) => (
                      <th key={plan.id} className="px-6 py-4 text-center font-semibold text-gray-900">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Array.isArray(plans[0]?.features) && plans[0]?.features.map((feature, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-sm text-gray-600">{feature}</td>
                      {plans.map((plan) => (
                        <td key={plan.id} className="px-6 py-4 text-center">
                          {Array.isArray(plan.features) && plan.features[index] ? (
                            <span className="font-semibold text-green-600">✓</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Perguntas Frequentes</h2>
          </div>

          <div className="mx-auto max-w-3xl space-y-6">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="mb-2 font-semibold text-gray-900">Posso mudar de plano a qualquer momento?</h3>
              <p className="text-sm text-gray-600">
                Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As mudanças são aplicadas
                imediatamente e o valor é ajustado proporcionalmente.
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="mb-2 font-semibold text-gray-900">Existe período de teste gratuito?</h3>
              <p className="text-sm text-gray-600">
                Oferecemos 7 dias de teste gratuito em todos os planos. Você pode cancelar a qualquer momento durante o
                período de teste.
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="mb-2 font-semibold text-gray-900">Como funciona o suporte?</h3>
              <p className="text-sm text-gray-600">
                O suporte varia conforme o plano: Básico (email), Profissional (prioritário) e Empresarial (chat e telefone).
              </p>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <h3 className="mb-2 font-semibold text-gray-900">Posso cancelar minha assinatura?</h3>
              <p className="text-sm text-gray-600">
                Sim, você pode cancelar sua assinatura a qualquer momento através da sua conta. O acesso será mantido
                até o final do período pago.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-emerald-600 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold text-white">Pronto para começar?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-white/90">
            Junte-se a milhares de veterinários que já estão usando nossa plataforma para gerenciar seus negócios de
            forma mais eficiente.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/cadastre-se"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3 font-medium text-blue-600 transition-colors hover:bg-gray-100">
              Começar Grátis
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white px-8 py-3 font-medium text-white transition-colors hover:bg-white hover:text-blue-600">
              Falar com Vendas
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
