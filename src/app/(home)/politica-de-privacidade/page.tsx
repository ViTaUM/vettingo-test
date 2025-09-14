import { Calendar, Eye, FileText, Lock, PawPrint, Shield, Users } from 'lucide-react';

export default function PoliticaPrivacidadePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-100 opacity-30"></div>
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-emerald-100 opacity-30"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="mb-16 text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-600">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
              Política de{' '}
              <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                Privacidade
              </span>
            </h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600">
              Na Vettingo, valorizamos sua privacidade e estamos comprometidos em proteger suas informações pessoais.
              Esta Política explica como coletamos, usamos e protegemos seus dados.
            </p>
          </div>

          {/* Key Stats */}
          <div className="mx-auto mb-16 grid max-w-2xl grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">100%</div>
              <div className="text-sm text-gray-600">Conformidade LGPD</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">48h</div>
              <div className="text-sm text-gray-600">Tempo de resposta</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">256-bit</div>
              <div className="text-sm text-gray-600">Criptografia SSL</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl space-y-16">
            {/* Data Collection Section */}
            <div className="relative">
              <div className="rounded-3xl border border-gray-200 bg-white p-8 md:p-12">
                <div className="flex flex-col items-start gap-8 md:flex-row">
                  <div className="flex-shrink-0">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                      <FileText className="h-8 w-8" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="mb-6 text-3xl font-bold text-gray-900">Coleta de Informações</h2>
                    <p className="mb-6 text-lg leading-relaxed text-gray-600">
                      Coletamos informações fornecidas por você durante o uso do Aplicativo Vettingo, incluindo:
                    </p>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                            <Users className="h-3 w-3 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Dados Pessoais</h4>
                            <p className="text-sm text-gray-600">
                              Nome, CPF, RG, endereço, documentos profissionais, e-mail e senha
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                            <Eye className="h-3 w-3 text-emerald-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Dados de Perfil</h4>
                            <p className="text-sm text-gray-600">Preferências, configurações e histórico de uso</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                            <Calendar className="h-3 w-3 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Dados Automáticos</h4>
                            <p className="text-sm text-gray-600">
                              IP, navegador, sistema operacional e dados de dispositivo
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                            <PawPrint className="h-3 w-3 text-emerald-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Dados Veterinários</h4>
                            <p className="text-sm text-gray-600">
                              Especializações, disponibilidade e dados profissionais
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-6">
                      <p className="mb-2 font-medium text-blue-900">Finalidade da Coleta</p>
                      <p className="text-blue-800">
                        Essas informações são coletadas para fornecer, manter, proteger e melhorar o Aplicativo, além de
                        desenvolver novos recursos e serviços.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Usage Section */}
            <div className="relative">
              <div className="rounded-3xl border border-gray-200 bg-white p-8 md:p-12">
                <div className="flex flex-col items-start gap-8 md:flex-row-reverse">
                  <div className="flex-shrink-0">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                      <Shield className="h-8 w-8" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="mb-6 text-3xl font-bold text-gray-900">Uso e Compartilhamento de Dados</h2>
                    <p className="mb-6 text-lg leading-relaxed text-gray-600">
                      Utilizamos suas informações para melhorar sua experiência no Aplicativo e garantir a segurança dos
                      serviços.
                    </p>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="rounded-xl bg-gray-50 p-6">
                        <h4 className="mb-3 font-semibold text-gray-900">✅ O que fazemos</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                          <li>• Personalizar sua experiência</li>
                          <li>• Melhorar nossos serviços</li>
                          <li>• Garantir segurança da plataforma</li>
                          <li>• Facilitar conexões veterinárias</li>
                        </ul>
                      </div>
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
                        <h4 className="mb-3 font-semibold text-emerald-900">🛡️ O que NÃO fazemos</h4>
                        <ul className="space-y-2 text-sm text-emerald-800">
                          <li>• Vender dados para terceiros</li>
                          <li>• Compartilhar sem consentimento</li>
                          <li>• Usar para marketing externo</li>
                          <li>• Acessar dados desnecessários</li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-6">
                      <p className="mb-2 font-medium text-emerald-900">Conformidade LGPD</p>
                      <p className="text-emerald-800">
                        Estamos em total conformidade com a Lei Geral de Proteção de Dados (LGPD) e respeitamos todos os
                        seus direitos sobre seus dados pessoais.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Measures Section */}
            <div className="relative">
              <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-white md:p-12">
                {/* Background decoration */}

                <div className="relative z-10">
                  <div className="mb-12 text-center">
                    <div className="mb-6 flex justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                        <Lock className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <h2 className="mb-4 text-3xl font-bold">Medidas de Segurança</h2>
                    <p className="mx-auto max-w-2xl text-lg text-gray-300">
                      Implementamos medidas de segurança físicas, técnicas e administrativas para proteger suas
                      informações pessoais contra acesso não autorizado.
                    </p>
                  </div>

                  <div className="grid gap-8 md:grid-cols-2">
                    {[
                      {
                        icon: Lock,
                        title: 'Criptografia Avançada',
                        description:
                          'Utilizamos criptografia SSL 256-bit para proteger todos os dados em trânsito e em repouso.',
                      },
                      {
                        icon: Shield,
                        title: 'Conformidade Legal',
                        description:
                          'Seguimos rigorosamente as diretrizes da LGPD e melhores práticas de segurança internacional.',
                      },
                      {
                        icon: Eye,
                        title: 'Monitoramento 24/7',
                        description:
                          'Sistemas de monitoramento contínuo para detectar e prevenir atividades suspeitas.',
                      },
                      {
                        icon: Users,
                        title: 'Acesso Controlado',
                        description:
                          'Acesso restrito aos dados apenas para pessoal autorizado e necessário para operações.',
                      },
                    ].map((item, index) => (
                      <div key={index} className="group">
                        <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/20">
                          <div className="text-center">
                            <div className="mb-4 flex justify-center">
                              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 text-white transition-all duration-300 group-hover:bg-white group-hover:text-gray-900">
                                <item.icon className="h-8 w-8" />
                              </div>
                            </div>
                            <h3 className="mb-3 text-lg font-semibold text-white">{item.title}</h3>
                            <p className="text-sm leading-relaxed text-gray-300">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Updates and Contact Section */}
            <div className="relative">
              <div className="rounded-3xl border border-gray-200 bg-white p-8 text-center md:p-12">
                <div className="mb-6 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-600">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                </div>

                <h2 className="mb-6 text-3xl font-bold text-gray-900">Atualizações da Política</h2>
                <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-gray-600">
                  Reservamo-nos o direito de modificar esta Política de Privacidade a qualquer momento. Alterações
                  significativas serão comunicadas de forma destacada. O uso contínuo do Aplicativo após tais alterações
                  constituirá seu consentimento para os novos termos.
                </p>

                <div className="inline-flex flex-col items-center gap-4 rounded-xl border border-gray-200 bg-gradient-to-r from-blue-50 to-emerald-50 p-6">
                  <div className="flex items-center gap-2">
                    <PawPrint className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">Precisa de ajuda?</span>
                  </div>
                  <p className="text-gray-600">
                    Entre em contato conosco em{' '}
                    <a
                      href="mailto:contato@vettingo.com"
                      className="font-semibold text-blue-600 transition-colors duration-200 hover:text-blue-700">
                      contato@vettingo.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
