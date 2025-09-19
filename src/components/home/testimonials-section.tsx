'use client';

import SpotlightCard from '@/components/ui/spotlight-card';
import { ArrowRight, CheckCircle, Crown, MapPin, Star, Users } from 'lucide-react';
import Link from 'next/link';

const benefits = [
  {
    icon: Users,
    title: 'Perfil profissional destacado',
    description: 'Destaque seus serviços e especializações com um perfil completo e personalizado',
    color: 'blue'
  },
  {
    icon: CheckCircle,
    title: 'Avaliações e feedback',
    description: 'Construa sua reputação profissional com sistema de avaliações',
    color: 'yellow'
  },
  {
    icon: MapPin,
    title: 'Múltiplos locais de atendimento',
    description: 'Gerencie diferentes clínicas e locais de trabalho',
    color: 'purple'
  },
  {
    icon: Star,
    title: 'Relatórios avançados',
    description: 'Acompanhe métricas e performance do seu negócio',
    color: 'orange'
  }
];

export default function TestimonialsSection() {
  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      emerald: 'from-emerald-500 to-emerald-600',
      yellow: 'from-yellow-500 to-yellow-600',
      purple: 'from-purple-500 to-purple-600',
      green: 'from-green-500 to-green-600',
      orange: 'from-orange-500 to-orange-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 h-64 w-64 -translate-x-32 -translate-y-32 rounded-full bg-blue-100 opacity-30"></div>
        <div className="absolute right-0 bottom-0 h-64 w-64 translate-x-32 translate-y-32 rounded-full bg-emerald-100 opacity-30"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600">
              <Crown className="h-6 w-6 text-white" />
            </div>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Recursos{' '}
            <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Exclusivos
            </span>
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Descubra todas as ferramentas que a Vettingo oferece para impulsionar seu negócio veterinário.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div key={index} className="group">
              <SpotlightCard
                className="border border-gray-200 bg-white transition-all duration-300"
                spotlightColor={benefit.color}>
                
                {/* Icon */}
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${getColorClasses(benefit.color)} text-white transition-all duration-300`}>
                  <benefit.icon className="h-6 w-6" />
                </div>

                {/* Title */}
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{benefit.title}</h3>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed">{benefit.description}</p>
              </SpotlightCard>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="mx-auto max-w-4xl">
            <SpotlightCard className="border border-gray-200 bg-white p-8" spotlightColor="purple">
              <div className="grid items-center gap-8 lg:grid-cols-2">
                {/* Content */}
                <div className="text-center lg:text-left">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700">
                    <Crown className="h-4 w-4" />
                    Plano Profissional
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-gray-900">
                    Comece a crescer seu negócio hoje
                  </h3>
                  <p className="mb-6 text-gray-600">
                    Junte-se a milhares de veterinários que já estão usando a Vettingo para expandir seus negócios e melhorar o atendimento aos seus pacientes.
                  </p>
                  
                  {/* Features */}
                  <div className="mb-6 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      Ativação em até 48 horas
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      Suporte prioritário
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                      Sem taxas de cancelamento
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-gray-900">R$ 49,90</div>
                    <div className="text-sm text-gray-500">por mês</div>
                  </div>
                  
                  <Link
                    href="/planos"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 px-8 py-3 text-white font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-300"
                  >
                    Ver Todos os Planos
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                    
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </div>
    </section>
  );
}
