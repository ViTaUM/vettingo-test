interface PetDataLoadingProps {
  message?: string;
  subMessage?: string;
  type?: 'pets' | 'veterinarians' | 'appointments' | 'profile' | 'search' | 'general';
  size?: 'sm' | 'md' | 'lg';
  showProgress?: boolean;
  inline?: boolean;
}

const loadingMessages = {
  pets: {
    main: 'Carregando informações dos pets...',
    sub: 'Buscando dados de saúde e histórico 🏥',
    emoji: '🐕',
  },
  veterinarians: {
    main: 'Carregando veterinários...',
    sub: 'Encontrando os melhores profissionais 👩‍⚕️',
    emoji: '🩺',
  },
  appointments: {
    main: 'Carregando consultas...',
    sub: 'Organizando agenda e histórico 📅',
    emoji: '🐱',
  },
  profile: {
    main: 'Carregando perfil...',
    sub: 'Atualizando suas informações 👤',
    emoji: '🐾',
  },
  search: {
    main: 'Procurando resultados...',
    sub: 'Analisando opções disponíveis 🔍',
    emoji: '🐕‍🦺',
  },
  general: {
    main: 'Carregando...',
    sub: 'Processando informações 💙',
    emoji: '🐾',
  },
};

// Animações CSS customizadas
const dataLoadingStyles = `
  @keyframes petWalk {
    0% { transform: translateX(-20px) rotate(-5deg); opacity: 0.3; }
    25% { transform: translateX(-10px) rotate(0deg); opacity: 0.7; }
    50% { transform: translateX(0px) rotate(5deg); opacity: 1; }
    75% { transform: translateX(10px) rotate(0deg); opacity: 0.7; }
    100% { transform: translateX(20px) rotate(-5deg); opacity: 0.3; }
  }
  
  @keyframes dataFlow {
    0% { transform: scaleX(0); opacity: 0; }
    50% { transform: scaleX(1); opacity: 1; }
    100% { transform: scaleX(0); opacity: 0; }
  }
  
  @keyframes pawPulse {
    0%, 100% { transform: scale(1); opacity: 0.4; }
    50% { transform: scale(1.2); opacity: 1; }
  }
  
  @keyframes progressFill {
    0% { width: 0%; }
    25% { width: 30%; }
    50% { width: 65%; }
    75% { width: 85%; }
    100% { width: 100%; }
  }
  
  .pet-walk { animation: petWalk 3s ease-in-out infinite; }
  .data-flow-1 { animation: dataFlow 2s ease-in-out infinite 0.2s; }
  .data-flow-2 { animation: dataFlow 2s ease-in-out infinite 0.6s; }
  .data-flow-3 { animation: dataFlow 2s ease-in-out infinite 1s; }
  .paw-pulse-1 { animation: pawPulse 1.5s ease-in-out infinite; }
  .paw-pulse-2 { animation: pawPulse 1.5s ease-in-out infinite 0.3s; }
  .paw-pulse-3 { animation: pawPulse 1.5s ease-in-out infinite 0.6s; }
  .progress-fill { animation: progressFill 4s ease-out infinite; }
`;

export function PetDataLoading({
  message,
  subMessage,
  type = 'general',
  size = 'md',
  showProgress = true,
  inline = false,
}: PetDataLoadingProps) {
  const config = loadingMessages[type];
  const displayMessage = message || config.main;
  const displaySubMessage = subMessage || config.sub;

  const sizeClasses = {
    sm: {
      container: 'h-32',
      emoji: 'text-2xl',
      title: 'text-sm',
      subtitle: 'text-xs',
      progress: 'h-1',
    },
    md: {
      container: 'h-48',
      emoji: 'text-4xl',
      title: 'text-base',
      subtitle: 'text-sm',
      progress: 'h-2',
    },
    lg: {
      container: 'h-64',
      emoji: 'text-6xl',
      title: 'text-lg',
      subtitle: 'text-base',
      progress: 'h-3',
    },
  };

  const containerClass = inline
    ? `${sizeClasses[size].container} flex items-center justify-center p-6`
    : `min-h-screen flex items-center justify-center p-6`;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: dataLoadingStyles }} />
      <div className={containerClass}>
        <div className="w-full max-w-md text-center">
          {/* Área principal de animação */}
          <div className="relative mb-6">
            {/* Pet caminhando */}
            <div className="mb-4 flex justify-center">
              <span className={`pet-walk ${sizeClasses[size].emoji}`}>{config.emoji}</span>
            </div>

            {/* Linha de dados fluindo */}
            <div className="mb-4 flex justify-center space-x-1">
              <div className="flex space-x-1">
                <span className="data-flow-1 h-2 w-2 rounded-full bg-blue-400"></span>
                <span className="data-flow-2 h-2 w-2 rounded-full bg-emerald-400"></span>
                <span className="data-flow-3 h-2 w-2 rounded-full bg-blue-400"></span>
              </div>
            </div>

            {/* Patinhas pulsantes */}
            <div className="flex justify-center space-x-2">
              <span className="paw-pulse-1 text-gray-400">🐾</span>
              <span className="paw-pulse-2 text-gray-500">🐾</span>
              <span className="paw-pulse-3 text-gray-600">🐾</span>
            </div>
          </div>

          {/* Barra de progresso */}
          {showProgress && (
            <div className="mb-4">
              <div className={`${sizeClasses[size].progress} overflow-hidden rounded-full bg-gray-200`}>
                <div className="progress-fill h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-500"></div>
              </div>
            </div>
          )}

          {/* Mensagens */}
          <div className="space-y-2">
            <h3 className={`${sizeClasses[size].title} font-semibold text-gray-800`}>{displayMessage}</h3>
            <p className={`${sizeClasses[size].subtitle} text-gray-600`}>{displaySubMessage}</p>
          </div>

          {/* Status adicional */}
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></div>
            <span className="text-xs font-medium text-gray-500">Conectado ao sistema Vettingo</span>
          </div>
        </div>
      </div>
    </>
  );
}
