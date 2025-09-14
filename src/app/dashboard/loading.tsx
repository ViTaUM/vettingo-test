import { Settings, Shield, User } from 'lucide-react';

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="text-center">
        {/* Ícones animados do dashboard */}
        <div className="relative mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className="relative">
              <div className="animate-pulse rounded-full bg-blue-100 p-3">
                <Settings className="h-8 w-8 animate-spin text-blue-600 [animation-duration:3s]" />
              </div>
            </div>
            <div className="relative">
              <div className="animate-pulse rounded-full bg-emerald-100 p-3 [animation-delay:0.2s]">
                <Shield className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
            <div className="relative">
              <div className="animate-pulse rounded-full bg-blue-100 p-3 [animation-delay:0.4s]">
                <User className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Barra de progresso animada */}
        <div className="mx-auto mb-6 w-64">
          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div className="h-full animate-pulse rounded-full bg-gradient-to-r from-blue-600 to-emerald-600"></div>
          </div>
        </div>

        {/* Texto com gradiente */}
        <h2 className="mb-2 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-lg font-semibold text-transparent">
          Preparando seu Dashboard
        </h2>
        <p className="text-sm text-gray-600">Carregando suas informações...</p>
      </div>
    </div>
  );
}
