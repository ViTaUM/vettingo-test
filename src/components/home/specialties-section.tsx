import { Activity, ArrowRight, Baby, Bone, Brain, Eye, Heart, Scissors, Shield, Stethoscope } from 'lucide-react';
import Link from 'next/link';
import SpecialtyCard from './specialty-card';

const specialties = [
  {
    icon: Heart,
    name: 'Cardiologia',
    description: 'Cuidados especializados para o coração do seu pet',
    color: 'red',
  },
  {
    icon: Brain,
    name: 'Neurologia',
    description: 'Tratamentos avançados para sistema nervoso',
    color: 'purple',
  },
  {
    icon: Bone,
    name: 'Ortopedia',
    description: 'Especialistas em ossos, articulações e músculos',
    color: 'blue',
  },
  {
    icon: Eye,
    name: 'Oftalmologia',
    description: 'Cuidados especializados para os olhos',
    color: 'emerald',
  },
  {
    icon: Scissors,
    name: 'Cirurgia',
    description: 'Procedimentos cirúrgicos de alta complexidade',
    color: 'orange',
  },
  {
    icon: Shield,
    name: 'Imunologia',
    description: 'Prevenção e tratamento de doenças imunológicas',
    color: 'green',
  },
  {
    icon: Baby,
    name: 'Dermatologia',
    description: 'Cuidados especiais para a pele e pelagem',
    color: 'pink',
  },
  {
    icon: Activity,
    name: 'Emergência',
    description: 'Atendimento de urgência e emergência',
    color: 'yellow',
  },
];

export default function SpecialtiesSection() {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
          </div>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Especialidades{' '}
            <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Veterinárias
            </span>
          </h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-600">
            Encontre especialistas qualificados para cada necessidade do seu pet. Nossa rede inclui veterinários de
            todas as especialidades médicas.
          </p>
        </div>

        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-4">
          {specialties.map((specialty, index) => (
            <div key={index} className="group">
              <SpecialtyCard
                icon={specialty.icon}
                name={specialty.name}
                description={specialty.description}
                color={specialty.color}
              />
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-gradient-to-r from-blue-50 to-emerald-50 p-8">
            <div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">Não encontrou a especialidade que procura?</h3>
              <p className="text-gray-600">Nossa rede está em constante crescimento. Entre em contato conosco!</p>
            </div>
            <Link
              href="/busca"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-600 px-6 py-3 text-sm font-medium text-white transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-emerald-700">
              Buscar Especialistas
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
