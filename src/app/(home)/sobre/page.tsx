import SpotlightCard from '@/components/ui/spotlight-card';
import { Award, CheckCircle, Eye, Heart, MapPin, PawPrint, Star, Target, Users } from 'lucide-react';

export default function SobrePage() {
  const stats = [
    { number: '+1000', label: 'Veterinários cadastrados' },
    { number: '+50k', label: 'Pets atendidos' },
    { number: '4.8★', label: 'Avaliação média' },
    { number: 'Sempre', label: 'Suporte disponível' },
  ];

  const values = [
    {
      icon: Heart,
      title: 'Amor pelos Animais',
      description: 'Somos apaixonados por pets e acreditamos que cada animal merece o melhor cuidado possível.',
      color: 'pink',
    },
    {
      icon: CheckCircle,
      title: 'Confiabilidade',
      description: 'Todos os veterinários são verificados e possuem registros profissionais válidos.',
      color: 'emerald',
    },
    {
      icon: Star,
      title: 'Excelência',
      description: 'Buscamos constantemente a melhoria da experiência para tutores e veterinários.',
      color: 'blue',
    },
    {
      icon: Users,
      title: 'Comunidade',
      description: 'Criamos uma rede colaborativa entre tutores e profissionais veterinários.',
      color: 'purple',
    },
  ];

  const features = [
    {
      icon: MapPin,
      title: 'Busca por Localização',
      description: 'Encontre veterinários próximos a você com facilidade e rapidez.',
    },
    {
      icon: Award,
      title: 'Profissionais Verificados',
      description: 'Todos os veterinários passam por verificação de credenciais.',
    },
    {
      icon: Star,
      title: 'Sistema de Avaliações',
      description: 'Avaliações reais de tutores para decisões mais seguras.',
    },
    {
      icon: PawPrint,
      title: 'Especialidades Diversas',
      description: 'De clínica geral a especialidades como cardiologia e dermatologia.',
    },
    {
      icon: Users,
      title: 'Suporte Dedicado',
      description: 'Nossa equipe está sempre pronta para ajudar você e seu pet.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-emerald-100 opacity-30 md:-top-20 md:-right-20"></div>
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-100 opacity-30 md:-bottom-20 md:-left-20"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="mb-16 text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-blue-600">
                <PawPrint className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
              Sobre a{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Vettingo
              </span>
            </h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600">
              Conectando tutores apaixonados aos melhores cuidados veterinários. Criamos uma ponte de confiança entre
              quem ama e quem cuida dos pets.
            </p>
          </div>

          {/* Stats */}
          <div className="mx-auto mb-16 grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-gray-900 md:text-3xl">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl space-y-16">
            {/* Mission Section */}
            <div className="relative">
              <div className="rounded-3xl border border-gray-200 bg-white p-8 md:p-12">
                <div className="flex flex-col items-start gap-8 md:flex-row">
                  <div className="flex-shrink-0">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                      <Target className="h-8 w-8" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="mb-6 text-3xl font-bold text-gray-900">Nossa Missão</h2>
                    <p className="mb-6 text-lg leading-relaxed text-gray-600">
                      Simplificar e fortalecer a conexão entre tutores de animais de estimação e médicos veterinários
                      qualificados. Acreditamos que todo pet merece acesso fácil e rápido aos melhores cuidados de
                      saúde.
                    </p>
                    <p className="leading-relaxed text-gray-600">
                      Trabalhamos incansavelmente para tornar essa busca mais eficiente, transparente e confiável.
                      Queremos ser a ponte que une quem ama e cuida dos animais aos profissionais dedicados a garantir
                      seu bem-estar.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vision Section */}
            <div className="relative">
              <div className="rounded-3xl border border-gray-200 bg-white p-8 md:p-12">
                <div className="flex flex-col items-start gap-8 md:flex-row-reverse">
                  <div className="flex-shrink-0">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                      <Eye className="h-8 w-8" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="mb-6 text-3xl font-bold text-gray-900">Nossa Visão</h2>
                    <p className="mb-6 text-lg leading-relaxed text-gray-600">
                      Ser a plataforma de referência número um no Brasil para a busca de serviços veterinários.
                      Almejamos construir uma comunidade engajada onde tutores encontrem não apenas profissionais, mas
                      também informações relevantes e confiáveis.
                    </p>
                    <p className="leading-relaxed text-gray-600">
                      Buscamos inovar constantemente, incorporando tecnologias que facilitem o dia a dia de tutores e
                      veterinários, promovendo uma relação de confiança e cuidado mútuo.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Values Section */}
            <div className="relative">
              <div className="mb-12 text-center">
                <h2 className="mb-4 text-3xl font-bold text-gray-900">Nossos Valores</h2>
                <p className="mx-auto max-w-2xl text-lg text-gray-600">
                  Os princípios que guiam cada decisão e ação da Vettingo
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {values.map((value, index) => (
                  <div key={index} className="group">
                    <SpotlightCard
                      className="h-full border border-gray-200 bg-white text-center"
                      spotlightColor={value.color}>
                      <div
                        className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${
                          value.color === 'pink'
                            ? 'bg-pink-100 text-pink-600 group-hover:bg-pink-600 group-hover:text-white'
                            : value.color === 'emerald'
                              ? 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white'
                              : value.color === 'blue'
                                ? 'bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'
                                : 'bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white'
                        } transition-all duration-300`}>
                        <value.icon className="h-6 w-6" />
                      </div>
                      <h3 className="mb-3 font-semibold text-gray-900">{value.title}</h3>
                      <p className="text-sm leading-relaxed text-gray-600">{value.description}</p>
                    </SpotlightCard>
                  </div>
                ))}
              </div>
            </div>

            {/* Features Section */}
            <div className="relative">
              <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-white md:p-12">
                <div className="relative z-10">
                  <div className="mb-12 text-center">
                    <h2 className="mb-4 text-3xl font-bold">Por que escolher a Vettingo?</h2>
                    <p className="mx-auto max-w-2xl text-lg text-gray-300">
                      Entendemos a importância do vínculo entre um tutor e seu animal de estimação. Por isso, oferecemos
                      a melhor experiência para ambos os lados.
                    </p>
                  </div>

                  <div className="grid gap-8 md:grid-cols-2">
                    {features.map((feature, index) => (
                      <div key={index} className="group">
                        <SpotlightCard className="border-white/20 bg-white/10 backdrop-blur-sm">
                          <div className="text-center">
                            <div className="mb-4 flex justify-center">
                              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 text-white transition-all duration-300 group-hover:bg-white group-hover:text-gray-900">
                                <feature.icon className="h-8 w-8" />
                              </div>
                            </div>
                            <h3 className="mb-3 text-lg font-semibold text-white">{feature.title}</h3>
                            <p className="text-sm leading-relaxed text-gray-300">{feature.description}</p>
                          </div>
                        </SpotlightCard>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* History Section */}
            <div className="relative">
              <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center md:p-12">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-blue-600">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                </div>

                <h2 className="mb-6 text-3xl font-bold text-gray-900">Nossa História</h2>
                <p className="mx-auto mb-8 max-w-4xl text-lg leading-relaxed text-gray-600">
                  A Vettingo nasceu da necessidade percebida por seus fundadores, amantes de animais e profissionais da
                  área de tecnologia, de criar uma solução centralizada e confiável para a busca por cuidados
                  veterinários.
                </p>
                <p className="mx-auto max-w-4xl leading-relaxed text-gray-600">
                  Observando as dificuldades enfrentadas por tutores para encontrar o profissional ideal e a necessidade
                  dos veterinários de ampliar seu alcance, a ideia tomou forma. Desde o início, nosso foco tem sido em
                  construir uma plataforma robusta, fácil de usar e que realmente faça a diferença na vida de pets,
                  tutores e veterinários.
                </p>

                <div className="mt-12 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gradient-to-r from-emerald-50 to-blue-50 p-4">
                  <PawPrint className="h-5 w-5 text-emerald-600" />
                  <span className="font-semibold text-gray-900">Juntos, cuidamos melhor dos nossos pets! 🐾</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
