import { FileText, User, Shield, PawPrint, CheckCircle, AlertTriangle, Scale, Clock } from 'lucide-react';

export default function TermosUsoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-emerald-100 opacity-30"></div>
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-blue-100 opacity-30"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="mb-16 text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-blue-600">
                <Scale className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
              Termos de{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">Uso</span>
            </h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600">
              Bem-vindo(a) ao Vettingo! Estes Termos de Uso estabelecem as condições para a utilização do nosso
              Aplicativo. Leia atentamente antes de usar.
            </p>
          </div>

          {/* Key Info */}
          <div className="mx-auto mb-16 grid max-w-2xl grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">+18</div>
              <div className="text-sm text-gray-600">Idade mínima</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">24/7</div>
              <div className="text-sm text-gray-600">Suporte legal</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">2025</div>
              <div className="text-sm text-gray-600">Última atualização</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl space-y-16">
            {/* Consent Section */}
            <div className="relative">
              <div className="rounded-3xl border border-gray-200 bg-white p-8 md:p-12">
                <div className="flex flex-col items-start gap-8 md:flex-row">
                  <div className="flex-shrink-0">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                      <CheckCircle className="h-8 w-8" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="mb-6 text-3xl font-bold text-gray-900">Consentimento e Uso</h2>
                    <p className="mb-6 text-lg leading-relaxed text-gray-600">
                      Ao utilizar o Aplicativo Vettingo, você concorda com a coleta e uso de seus dados pessoais
                      conforme nossa Política de Privacidade.
                    </p>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                            <User className="h-3 w-3 text-emerald-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Requisitos de Idade</h4>
                            <p className="text-sm text-gray-600">
                              Você deve ser maior de 18 anos para usar o aplicativo
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                            <Shield className="h-3 w-3 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Capacidade Legal</h4>
                            <p className="text-sm text-gray-600">Não possuir impedimentos legais para contratar</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100">
                            <PawPrint className="h-3 w-3 text-emerald-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Uso Pessoal</h4>
                            <p className="text-sm text-gray-600">O acesso é pessoal e intransferível</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
                            <FileText className="h-3 w-3 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Concordância</h4>
                            <p className="text-sm text-gray-600">Aceita todos os termos e condições</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-6">
                      <p className="mb-2 font-medium text-emerald-900">Importante</p>
                      <p className="text-emerald-800">
                        Ao prosseguir com o uso do aplicativo, você confirma ter lido, compreendido e concordado com
                        todos os termos apresentados neste documento.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* User Responsibilities Section */}
            <div className="relative">
              <div className="rounded-3xl border border-gray-200 bg-white p-8 md:p-12">
                <div className="flex flex-col items-start gap-8 md:flex-row-reverse">
                  <div className="flex-shrink-0">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                      <User className="h-8 w-8" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="mb-6 text-3xl font-bold text-gray-900">Responsabilidades do Usuário</h2>
                    <p className="mb-6 text-lg leading-relaxed text-gray-600">
                      Você é responsável por fornecer informações verdadeiras e precisas no Aplicativo.
                    </p>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="rounded-xl border border-green-200 bg-green-50 p-6">
                        <h4 className="mb-3 flex items-center gap-2 font-semibold text-green-900">
                          <CheckCircle className="h-5 w-5" />
                          Você DEVE
                        </h4>
                        <ul className="space-y-2 text-sm text-green-800">
                          <li>• Fornecer informações verdadeiras e atualizadas</li>
                          <li>• Manter a confidencialidade da sua conta</li>
                          <li>• Usar o aplicativo de forma ética e legal</li>
                          <li>• Respeitar outros usuários e veterinários</li>
                          <li>• Reportar problemas ou irregularidades</li>
                        </ul>
                      </div>
                      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
                        <h4 className="mb-3 flex items-center gap-2 font-semibold text-red-900">
                          <AlertTriangle className="h-5 w-5" />
                          Você NÃO DEVE
                        </h4>
                        <ul className="space-y-2 text-sm text-red-800">
                          <li>• Fornecer documentos ou dados falsos</li>
                          <li>• Realizar engenharia reversa</li>
                          <li>• Acessar áreas restritas sem autorização</li>
                          <li>• Usar para atividades ilegais</li>
                          <li>• Compartilhar credenciais de acesso</li>
                        </ul>
                      </div>
                    </div>

                    <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6">
                      <p className="mb-2 font-medium text-red-900">⚠️ Consequências</p>
                      <p className="text-red-800">
                        Qualquer dado ou documento falso pode resultar na exclusão imediata da sua conta e, se
                        aplicável, notificação às autoridades competentes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Responsibilities Section */}
            <div className="relative">
              <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 text-white md:p-12">
                {/* Background decoration */}

                <div className="relative z-10">
                  <div className="mb-12 text-center">
                    <div className="mb-6 flex justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                        <Shield className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <h2 className="mb-4 text-3xl font-bold">Responsabilidades da Vettingo</h2>
                    <p className="mx-auto max-w-2xl text-lg text-gray-300">
                      Nos comprometemos a proteger seus dados e oferecer um ambiente seguro para o uso do Aplicativo.
                    </p>
                  </div>

                  <div className="grid gap-8 md:grid-cols-3">
                    {[
                      {
                        icon: Shield,
                        title: 'Proteção de Dados',
                        description:
                          'Implementamos medidas de segurança robustas para proteger suas informações pessoais.',
                      },
                      {
                        icon: FileText,
                        title: 'Gerenciamento de Dados',
                        description:
                          'Permitimos alterações nos seus dados e excluímos informações ao encerrar sua conta.',
                      },
                      {
                        icon: AlertTriangle,
                        title: 'Notificação de Violações',
                        description: 'Em caso de violação de segurança, notificaremos usuários afetados e autoridades.',
                      },
                    ].map((item, index) => (
                      <div key={index} className="group">
                        <div className="rounded-xl border border-white/20 bg-white/10 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:bg-white/20">
                          <div className="mb-4 flex justify-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-white/20 text-white transition-all duration-300 group-hover:bg-white group-hover:text-gray-900">
                              <item.icon className="h-8 w-8" />
                            </div>
                          </div>
                          <h3 className="mb-3 text-lg font-semibold text-white">{item.title}</h3>
                          <p className="text-sm leading-relaxed text-gray-300">{item.description}</p>
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
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-blue-600">
                    <Clock className="h-8 w-8 text-white" />
                  </div>
                </div>

                <h2 className="mb-6 text-3xl font-bold text-gray-900">Alterações e Contato</h2>
                <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-gray-600">
                  Podemos modificar estes Termos a qualquer momento, e alterações significativas serão comunicadas. O
                  uso contínuo do Aplicativo constitui aceitação dos novos termos.
                </p>

                <div className="mb-8 grid gap-8 md:grid-cols-2">
                  <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
                    <h4 className="mb-3 font-semibold text-blue-900">📧 Dúvidas ou Sugestões</h4>
                    <p className="mb-3 text-blue-800">Entre em contato conosco:</p>
                    <a
                      href="mailto:contato@vettingo.com"
                      className="font-semibold text-blue-600 transition-colors duration-200 hover:text-blue-700">
                      contato@vettingo.com
                    </a>
                  </div>
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6">
                    <h4 className="mb-3 font-semibold text-emerald-900">📅 Última Atualização</h4>
                    <p className="text-emerald-800">01 de Maio de 2025</p>
                    <p className="mt-2 text-sm text-emerald-700">Versão 2.0 dos Termos de Uso</p>
                  </div>
                </div>

                <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gradient-to-r from-emerald-50 to-blue-50 p-4">
                  <PawPrint className="h-5 w-5 text-emerald-600" />
                  <span className="font-semibold text-gray-900">
                    Obrigado por confiar na Vettingo para cuidar do seu pet! 🐾
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
