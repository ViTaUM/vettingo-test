import SpotlightCard from '@/components/ui/spotlight-card';
import { useSubscriptionPlans } from '@/hooks/use-subscriptions';
import { ArrowRight, Crown, Shield, Star } from 'lucide-react';
import Link from 'next/link';

export default function StatsSection() {
  const { plans, isLoading } = useSubscriptionPlans();

  const getPlanIcon = (slug: string) => {
    switch (slug) {
      case 'BASIC':
        return Shield;
      case 'PREMIUM':
        return Crown;
      case 'ENTERPRISE':
        return Star;
      default:
        return Shield;
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

  if (isLoading) {
    return (
      <section className="relative bg-gray-50 py-16">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/50"></div>
        <div className="relative z-10 container mx-auto px-4">
          <div className="mb-16 text-center">
            <div className="animate-pulse">
              <div className="mx-auto h-12 w-12 rounded-xl bg-gray-200 mb-6"></div>
              <div className="mx-auto h-8 w-64 rounded bg-gray-200 mb-4"></div>
              <div className="mx-auto h-4 w-96 rounded bg-gray-200"></div>
            </div>
          </div>
          <div className="mx-auto grid max-w-6xl gap-6 pt-4 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="rounded-2xl border-2 bg-white p-6 shadow-lg">
                  <div className="h-8 w-3/4 rounded bg-gray-200 mb-4"></div>
                  <div className="h-6 w-1/2 rounded bg-gray-200 mb-6"></div>
                  <div className="space-y-2">
                    <div className="h-4 rounded bg-gray-200"></div>
                    <div className="h-4 w-5/6 rounded bg-gray-200"></div>
                    <div className="h-4 w-4/5 rounded bg-gray-200"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-gray-50 py-16">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/50"></div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="mb-16 text-center">
          <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600">
            <Crown className="h-6 w-6 text-white" />
          </div>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Planos{' '}
            <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Flexíveis
            </span>
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Escolha o plano ideal para o seu negócio. Comece grátis e atualize quando precisar.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 pt-4 md:grid-cols-3">
          {plans.map((plan) => {
            const IconComponent = getPlanIcon(plan.slug);
            const color = getPlanColor(plan.slug);
            const isPopular = plan.slug === 'PREMIUM';

            return (
              <div key={plan.id} className="relative">
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 z-20 -translate-x-1/2 transform">
                    <span className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1 text-xs font-bold text-white shadow-lg">
                      Mais Popular
                    </span>
                  </div>
                )}

                <SpotlightCard
                  className={`relative border-2 bg-white text-center transition-all duration-300 ${
                    isPopular ? 'border-purple-500 shadow-purple-100' : 'border-gray-200'
                  }`}
                  spotlightColor={color}>
                  <div
                    className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r ${getColorClasses(color)} text-white transition-all duration-300`}>
                    <IconComponent className="h-7 w-7" />
                  </div>

                  <h3 className="mb-2 text-lg font-semibold text-gray-900">{plan.name}</h3>

                  <div className="mb-4">
                    <div className="flex items-baseline justify-center">
                      <span className="text-2xl font-bold text-gray-900">{formatPrice(plan.priceMonthly || 0)}</span>
                      <span className="ml-1 text-gray-500">/mês</span>
                    </div>
                  </div>

                  <div className="mb-6 space-y-2">
                    {Array.isArray(plan.features) && plan.features.slice(0, 4).map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <div className={`mr-2 h-1.5 w-1.5 rounded-full bg-${color}-500`}></div>
                        {feature}
                      </div>
                    ))}
                    {Array.isArray(plan.features) && plan.features.length > 4 && (
                      <div className="text-sm text-gray-500">+{plan.features.length - 4} recursos adicionais</div>
                    )}
                  </div>

                  <Link
                    href={`/planos?plan=${plan.slug.toLowerCase()}`}
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 font-medium transition-colors ${
                      isPopular
                        ? `bg-gradient-to-r ${getColorClasses(color)} text-white hover:opacity-90`
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}>
                    {isPopular ? 'Escolher Plano' : 'Ver Detalhes'}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </SpotlightCard>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="mx-auto inline-flex max-w-2xl flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-white/80 p-6 backdrop-blur-sm sm:flex-row">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600">
              <Crown className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="font-semibold text-gray-900">Quer ver todos os planos?</p>
              <p className="text-sm text-gray-600">Compare recursos e preços detalhadamente</p>
            </div>
            <Link
              href="/planos"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700 sm:w-auto">
              Ver Todos os Planos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
