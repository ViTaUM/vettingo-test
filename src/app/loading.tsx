import { Heart, Stethoscope } from 'lucide-react';

export default function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="text-center">
        {/* Logo animado */}
        <div className="relative mb-8">
          <div className="flex items-center justify-center gap-3">
            <div className="relative">
              <Stethoscope className="h-12 w-12 animate-pulse text-blue-600" />
              <Heart className="absolute -top-1 -right-1 h-6 w-6 animate-bounce text-emerald-500" />
            </div>
          </div>
          <h1 className="mt-4 bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-2xl font-bold text-transparent">
            Vettingo
          </h1>
        </div>

        {/* Animação de loading */}
        <div className="mb-4 flex items-center justify-center gap-1">
          <div className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-emerald-500"></div>
        </div>

        <p className="text-sm font-medium text-gray-600">Conectando você ao melhor cuidado veterinário</p>
      </div>
    </div>
  );
}
