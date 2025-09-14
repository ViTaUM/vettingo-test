'use client';

import SpotlightCard from '@/components/ui/spotlight-card';
import { ChevronDown, HelpCircle, Mail, MessageCircle, PawPrint, Users } from 'lucide-react';
import Link from 'next/link';

const faqData = {
  tutores: [
    {
      question: 'Como encontro um veterinário na minha região?',
      answer:
        'Utilizar a Vettingo para encontrar profissionais veterinários é simples. Na página inicial ou na seção de busca, você pode inserir sua localização (cidade ou CEP) e aplicar filtros adicionais, como especialidade desejada ou tipo de animal atendido. Nossa plataforma exibirá uma lista de veterinários que correspondem aos seus critérios, juntamente com informações de perfil, avaliações e opções de contato.',
    },
    {
      question: 'Como funciona o agendamento de consultas?',
      answer:
        'Atualmente, a Vettingo foca em facilitar a busca e a conexão entre tutores e veterinários. O agendamento de consultas deve ser realizado diretamente com o profissional ou clínica escolhida, utilizando as informações de contato (telefone, website, etc.) disponíveis no perfil do veterinário em nossa plataforma. Futuramente, planejamos integrar funcionalidades de agendamento direto.',
    },
    {
      question: 'Posso ver as avaliações de outros usuários sobre os veterinários?',
      answer:
        'Sim! Acreditamos na transparência e na troca de experiências. Nos perfis dos veterinários cadastrados, você encontrará uma seção de avaliações deixadas por outros tutores que já utilizaram os serviços daquele profissional. Isso pode ajudar você a tomar uma decisão mais informada ao escolher o melhor cuidado para o seu pet.',
    },
    {
      question: 'A Vettingo é gratuita para tutores de pets?',
      answer:
        'Sim, o uso da plataforma Vettingo para buscar e encontrar veterinários é totalmente gratuito para os tutores de animais de estimação. Nosso objetivo é ser a ponte que conecta você aos melhores profissionais da área.',
    },
    {
      question: 'Como posso avaliar um veterinário após a consulta?',
      answer:
        'Após utilizar os serviços de um veterinário encontrado através da Vettingo, você pode deixar sua avaliação no perfil do profissional. Acesse o perfil do veterinário e procure pela seção de avaliações. Sua experiência ajuda outros tutores a tomar decisões mais informadas.',
    },
  ],
  veterinarios: [
    {
      question: 'Como posso me cadastrar como veterinário na Vettingo?',
      answer:
        'Ficamos felizes com seu interesse em fazer parte da nossa rede! Para se cadastrar, acesse a opção "Cadastre-se" ou "Sou Veterinário" em nosso site. Você precisará preencher um formulário com suas informações profissionais, incluindo CRMV, especialidades, dados de contato e informações sobre sua clínica ou local de atendimento. Após a verificação, seu perfil estará ativo para ser encontrado por tutores.',
    },
    {
      question: 'Como gerencio meu perfil e minhas informações na plataforma?',
      answer:
        'Após o cadastro e login, você terá acesso a um painel de controle exclusivo para veterinários. Neste painel, você poderá atualizar suas informações pessoais, dados de contato, descrição profissional (bio), adicionar ou remover especialidades, gerenciar seus endereços de atendimento e interagir com as avaliações recebidas.',
    },
    {
      question: 'Quanto custa para ter um perfil na Vettingo?',
      answer:
        'O cadastro básico na Vettingo é gratuito! Você pode criar seu perfil, adicionar suas informações profissionais e ser encontrado por tutores sem nenhum custo. Oferecemos também planos premium com recursos adicionais como destaque do perfil e ferramentas de gestão avançadas.',
    },
    {
      question: 'Como aumentar minha visibilidade na plataforma?',
      answer:
        'Para aumentar sua visibilidade, mantenha seu perfil sempre atualizado com informações completas, fotos profissionais e descrição detalhada dos seus serviços. Responda rapidamente aos contatos e incentive seus clientes satisfeitos a deixarem avaliações positivas. Considere também nossos planos premium para maior destaque.',
    },
  ],
  geral: [
    {
      question: 'Como entro em contato com o suporte da Vettingo?',
      answer:
        'Se você tiver dúvidas, sugestões ou precisar de ajuda com a plataforma, pode entrar em contato conosco através da nossa página "Contato". Lá você encontrará as opções disponíveis, como formulário de contato, e-mail e WhatsApp para suporte direto.',
    },
    {
      question: 'A Vettingo está disponível em todo o Brasil?',
      answer:
        'Sim! A Vettingo atende todo o território nacional. Nosso banco de dados inclui veterinários de todas as regiões do Brasil, desde grandes centros urbanos até cidades menores. Se você é veterinário em uma região com poucos profissionais cadastrados, sua participação é ainda mais valiosa!',
    },
    {
      question: 'Como posso sugerir melhorias para a plataforma?',
      answer:
        'Adoramos receber feedback dos nossos usuários! Você pode enviar sugestões através do nosso formulário de contato, e-mail ou redes sociais. Sua opinião é fundamental para continuarmos melhorando a experiência de tutores e veterinários na plataforma.',
    },
  ],
};

function DisclosureItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300">
      <summary className="flex cursor-pointer list-none items-center justify-between p-6 font-semibold text-gray-900 transition-colors duration-200 hover:bg-gray-50">
        <span className="flex-1 pr-4">{question}</span>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
          <ChevronDown className="h-4 w-4 transition-transform duration-300 group-open:rotate-180" />
        </div>
      </summary>
      <div className="px-6 pb-6">
        <div className="border-t border-gray-100 pt-4">
          <p className="leading-relaxed text-gray-600">{answer}</p>
        </div>
      </div>
    </details>
  );
}

export default function FAQPage() {
  const categories = [
    {
      id: 'tutores',
      title: 'Para Tutores de Pets',
      icon: PawPrint,
      description: 'Dúvidas sobre como encontrar e escolher veterinários',
      color: 'blue',
      data: faqData.tutores,
    },
    {
      id: 'veterinarios',
      title: 'Para Veterinários',
      icon: Users,
      description: 'Informações sobre cadastro e gestão do perfil profissional',
      color: 'emerald',
      data: faqData.veterinarios,
    },
    {
      id: 'geral',
      title: 'Perguntas Gerais',
      icon: HelpCircle,
      description: 'Dúvidas gerais sobre a plataforma e suporte',
      color: 'purple',
      data: faqData.geral,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-100 opacity-30 md:-top-20 md:-right-20"></div>
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-emerald-100 opacity-30 md:-bottom-20 md:-left-20"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="mb-16 text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-600">
                <HelpCircle className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
              Perguntas{' '}
              <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                Frequentes
              </span>
            </h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600">
              Encontre respostas para as dúvidas mais comuns sobre a utilização da plataforma Vettingo, tanto para
              tutores quanto para veterinários.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="mx-auto mb-16 grid max-w-2xl grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">48h</div>
              <div className="text-sm text-gray-600">Tempo de resposta</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">+15</div>
              <div className="text-sm text-gray-600">Perguntas respondidas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">100%</div>
              <div className="text-sm text-gray-600">Respostas atualizadas</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl space-y-16">
            {categories.map((category) => (
              <div key={category.id} className="relative">
                {/* Category Header */}
                <div className="mb-8">
                  <div className="mb-4 flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                        category.color === 'blue'
                          ? 'bg-blue-100 text-blue-600'
                          : category.color === 'emerald'
                            ? 'bg-emerald-100 text-emerald-600'
                            : 'bg-purple-100 text-purple-600'
                      } `}>
                      <category.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
                      <p className="text-gray-600">{category.description}</p>
                    </div>
                  </div>
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                  {category.data.map((item, index) => (
                    <DisclosureItem key={`${category.id}-${index}`} question={item.question} answer={item.answer} />
                  ))}
                </div>
              </div>
            ))}

            {/* Contact CTA */}
            <div className="relative">
              <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-white md:p-12">
                <div className="relative z-10 text-center">
                  <div className="mb-6 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                      <MessageCircle className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  <h2 className="mb-4 text-3xl font-bold">Não encontrou sua resposta?</h2>
                  <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300">
                    Nossa equipe de suporte está pronta para ajudar você com qualquer dúvida específica.
                  </p>

                  <div className="mx-auto grid max-w-2xl gap-6 md:grid-cols-3">
                    <Link href={'mailto:contato@vettingo.com'} target="_blank">
                      <SpotlightCard className="border border-white/20 bg-white/10 text-center backdrop-blur-sm">
                        <div className="mb-3 flex justify-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                            <Mail className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <p className="text-sm text-gray-300">E-mail</p>
                        <p className="font-medium text-white">contato@vettingo.com</p>
                      </SpotlightCard>
                    </Link>
                    <Link href={'/contato'} className="no-underline">
                      <SpotlightCard className="border border-white/20 bg-white/10 text-center backdrop-blur-sm">
                        <div className="mb-3 flex justify-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                            <MessageCircle className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <p className="text-sm text-gray-300">Formulário</p>
                        <p className="font-medium text-white">Página de Contato</p>
                      </SpotlightCard>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
