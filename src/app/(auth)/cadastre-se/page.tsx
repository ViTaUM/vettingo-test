'use client';

import RegisterForm from '@/components/auth/register-form';
import MyLink from '@/components/link';
import { Award, Clock, MapPin, PawPrint, Shield, Star, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Register() {
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    { icon: Shield, text: 'Segurança de nível bancário', color: 'text-green-500' },
    { icon: Users, text: 'Mais de 10.000 veterinários cadastrados', color: 'text-blue-500' },
    { icon: Clock, text: 'Resposta em até 48 horas', color: 'text-purple-500' },
    { icon: PawPrint, text: 'Especialidades diversas', color: 'text-orange-500' },
    { icon: Star, text: 'Sistema de avaliações', color: 'text-yellow-500' },
    { icon: MapPin, text: 'Busca por localização', color: 'text-indigo-500' },
    { icon: Award, text: 'Profissionais verificados', color: 'text-emerald-500' },
    { icon: TrendingUp, text: 'Aumento da base de clientes', color: 'text-pink-500' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <main className="flex min-h-screen flex-col justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-12 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 animate-pulse rounded-full bg-blue-200/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 animate-pulse rounded-full bg-purple-200/20 blur-3xl delay-1000" />
      </div>

      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="flex justify-center">
          <div className="group relative">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 opacity-75 blur-lg transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
              <PawPrint className="h-8 w-8 animate-pulse text-white" />
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <h1 className="animate-in slide-in-from-top-4 text-3xl font-bold text-gray-900 duration-500 sm:text-4xl">
            Crie sua conta na Vettingo
          </h1>
          <p className="animate-in slide-in-from-top-4 mt-2 text-lg text-gray-600 delay-200 duration-500">
            Conecte-se com veterinários ou ofereça seus serviços profissionais
          </p>
        </div>

        {/* Feature showcase */}
        <div className="mt-4 flex justify-center">
          <div className="relative h-8 w-80 rounded-full bg-white/80 px-4 py-2 shadow-lg backdrop-blur-sm">
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

      <div className="relative z-10 mt-8 sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="group relative">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative rounded-xl border border-gray-200 bg-white/90 p-8 shadow-xl backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
            <RegisterForm />

            {/* Link para Login */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <div className="text-center">
                <span className="text-sm text-gray-600">
                  Já tem uma conta?{' '}
                  <MyLink
                    className="font-medium text-blue-600 transition-all duration-300 hover:text-blue-500"
                    size="sm"
                    always-active
                    href="/login">
                    <span className="relative">
                      Faça login aqui
                      <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 bg-blue-500 transition-all duration-300 hover:w-full" />
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
