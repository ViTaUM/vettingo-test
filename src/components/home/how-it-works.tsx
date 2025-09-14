import SpotlightCard from '@/components/ui/spotlight-card';
import { ArrowRight, Crown, PawPrint, Search, Star } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    icon: Search,
    title: 'Busque',
    description: 'Encontre veterinários por região, especialidade ou avaliações dos usuários.',
    color: 'blue',
  },
  {
    icon: Star,
    title: 'Compare',
    description: 'Veja avaliações, especialidades e disponibilidade para escolher o melhor profissional.',
    color: 'emerald',
  },
  {
    icon: PawPrint,
    title: 'Agende',
    description: 'Marque consultas diretamente pela plataforma de forma rápida e segura.',
    color: 'blue',
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600">
              <PawPrint className="h-6 w-6 text-white" />
            </div>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Como Funciona</h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Encontrar e agendar consultas com veterinários qualificados nunca foi tão fácil. Siga estes simples passos.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="absolute top-8 left-full z-0 hidden h-0.5 w-full bg-gradient-to-r from-gray-200 to-gray-200 md:block">
                  <div className="absolute top-1/2 right-0 -translate-y-1/2 transform">
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              )}

              <div className="group relative z-10">
                <div className="absolute -top-3 -right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-emerald-600 text-sm font-bold text-white shadow-lg">
                  {index + 1}
                </div>

                <SpotlightCard
                  className="border border-gray-200 bg-white text-center transition-all duration-300"
                  spotlightColor={step.color}>
                  {/* Icon */}
                  <div
                    className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${
                      step.color === 'blue'
                        ? 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                        : 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white'
                    } transition-all duration-300`}>
                    <step.icon className="h-8 w-8" />
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-gray-900">{step.title}</h3>
                  <p className="leading-relaxed text-gray-600">{step.description}</p>
                </SpotlightCard>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="mx-auto inline-flex max-w-2xl flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50 p-6 sm:flex-row">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600">
              <Crown className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="font-semibold text-gray-900">Você é veterinário?</h3>
              <p className="text-sm text-gray-600">Cadastre-se e comece a receber pacientes hoje mesmo</p>
            </div>
            <Link
              href="/planos"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 font-medium text-white transition-all duration-300 hover:from-purple-700 hover:to-blue-700 sm:w-auto">
              Ver Planos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
