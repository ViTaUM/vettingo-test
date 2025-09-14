import { ArrowRight, CheckCircle, Crown, Star, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';
import UIButton from '../ui/button';

const benefits = [
  {
    icon: Users,
    title: 'Perfil profissional destacado',
    description: 'Destaque seus serviços e especializações',
  },
  {
    icon: CheckCircle,
    title: 'Avaliações e feedback',
    description: 'Construa sua reputação profissional',
  },
  {
    icon: TrendingUp,
    title: 'Aumento da base de clientes',
    description: 'Alcance mais tutores na sua região',
  },
];

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-600 py-20">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 h-64 w-64 translate-x-32 -translate-y-32 transform rounded-full bg-white/10"></div>
        <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-24 translate-y-24 transform rounded-full bg-white/10"></div>
        <div className="absolute top-1/2 left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-white/5"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Content */}
          <div className="text-center text-white lg:text-left">
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                <Crown className="h-4 w-4" />
                Para Veterinários
              </div>

              {/* Headlines */}
              <div className="space-y-4">
                <h2 className="text-3xl leading-tight font-bold md:text-4xl">
                  Transforme seu negócio veterinário hoje
                </h2>
                <p className="text-lg text-blue-100">
                  Conecte-se com tutores que estão procurando pelos seus serviços. Expanda sua clínica e construa uma
                  presença digital profissional com a Vettingo.
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 py-6">
                <div className="flex items-center gap-2 text-sm text-blue-200">
                  <CheckCircle className="h-4 w-4" />
                  Ativação em até 48h
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-200">
                  <CheckCircle className="h-4 w-4" />
                  Suporte prioritário
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-200">
                  <CheckCircle className="h-4 w-4" />
                  Sem taxas ocultas
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-200">
                  <CheckCircle className="h-4 w-4" />
                  Cancele quando quiser
                </div>
              </div>

              {/* CTA */}
              <div className="space-y-4">
                <Link href="/planos">
                  <UIButton
                    variant="outline"
                    size="lg"
                    className="w-full transform border-white text-gray-600 shadow-lg hover:scale-105 hover:bg-white hover:text-blue-600 lg:w-auto">
                    Ver Planos e Preços
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </UIButton>
                </Link>
                <p className="text-sm text-blue-200">Teste grátis por 7 dias • Comece com R$ 29,90/mês</p>
              </div>
            </div>
          </div>

          {/* Benefits Card */}
          <div className="relative">
            <div className="transform rounded-2xl bg-white p-8 shadow-2xl transition-transform duration-500 hover:rotate-0 lg:rotate-3">
              {/* Header */}
              <div className="mb-8 flex items-center gap-4">
                <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-600 p-3">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Por que escolher a Vettingo?</h3>
                  <p className="text-sm text-gray-600">Vantagens exclusivas para veterinários</p>
                </div>
              </div>

              {/* Benefits List */}
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="group">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
                        <benefit.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="mb-1 font-semibold text-gray-900">{benefit.title}</h4>
                        <p className="text-sm text-gray-600">{benefit.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Plan Highlight */}
              <div className="mt-8 rounded-xl border border-purple-200 bg-purple-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                    <Crown className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-purple-900">Plano Profissional - Mais Popular</p>
                    <p className="text-xs text-purple-700">R$ 49,90/mês com todos os recursos</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-blue-200 opacity-50"></div>
            <div className="absolute -top-6 -right-6 h-16 w-16 rounded-full bg-emerald-200 opacity-50"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
