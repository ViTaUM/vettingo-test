'use client';

import LoginForm from '@/components/auth/login-form';
import MyLink from '@/components/link';
import { Award, Clock, Heart, MapPin, PawPrint, Shield, Star } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Login() {
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    { icon: Shield, text: 'Segurança de nível bancário', color: 'text-emerald-500' },
    { icon: Clock, text: 'Resposta em até 48 horas', color: 'text-purple-500' },
    { icon: PawPrint, text: 'Especialidades diversas', color: 'text-emerald-500' },
    { icon: Star, text: 'Sistema de avaliações', color: 'text-blue-500' },
    { icon: MapPin, text: 'Busca por localização', color: 'text-emerald-500' },
    { icon: Award, text: 'Profissionais verificados', color: 'text-purple-500' },
    { icon: Heart, text: 'Amor pelos animais', color: 'text-blue-500' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <main className="flex min-h-screen flex-col justify-center bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-12 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 animate-pulse rounded-full bg-blue-200/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full bg-emerald-200/20 blur-3xl delay-1000" />
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="group relative">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 to-emerald-600 opacity-75 blur-lg transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-emerald-600 shadow-lg">
              <PawPrint className="h-8 w-8 animate-pulse text-white" />
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <h1 className="animate-in slide-in-from-top-4 text-3xl font-bold text-gray-900 duration-500">
            Bem-vindo de volta
          </h1>
          <p className="animate-in slide-in-from-top-4 mt-2 text-sm text-gray-600 delay-200 duration-500">
            Entre na sua conta para acessar sua área veterinária
          </p>
        </div>

        {/* Feature showcase */}
        <div className="mt-4 flex justify-center">
          <div className="relative h-8 w-64 rounded-full bg-white/80 px-4 py-2 shadow-lg backdrop-blur-sm">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={`absolute inset-0 flex items-center justify-center space-x-1 transition-all duration-500 ${
                    index === currentFeature ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                  }`}>
                  <Icon className={`h-4 w-4 ${feature.color}`} />
                  <span className="text-xs text-gray-600">{feature.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="group relative">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600/10 to-emerald-600/10 opacity-0 blur-xl transition-opacity duration-500" />
          <div className="relative rounded-lg border border-gray-200 bg-white/90 px-4 py-8 shadow-xl backdrop-blur-sm transition-all duration-300 sm:px-10">
            <LoginForm />

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">Ou</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <MyLink
                  className="text-sm font-medium text-blue-600 transition-all duration-300 hover:text-emerald-600"
                  size="sm"
                  always-active
                  href="/esqueci-minha-senha">
                  <span className="relative">
                    Esqueceu sua senha?
                    <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-600 to-emerald-600 transition-all duration-300 hover:w-full" />
                  </span>
                </MyLink>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="text-center">
                <span className="text-sm text-gray-600">
                  Não tem uma conta?{' '}
                  <MyLink
                    className="font-medium text-blue-600 transition-all duration-300 hover:text-emerald-600"
                    size="sm"
                    always-active
                    href="/cadastre-se">
                    <span className="relative">
                      Cadastre-se gratuitamente
                      <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 bg-gradient-to-r from-blue-600 to-emerald-600 transition-all duration-300 hover:w-full" />
                    </span>
                  </MyLink>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
