'use client';

import { City, State } from '@/lib/types/api';
import { ArrowRight, Crown, PawPrint } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import LocationSelector from '../form/location-selector';
import UIButton from '../ui/button';

type HeroProps = {
  states: State[];
  cities: City[];
  selectedState?: State;
  selectedCity?: City;
  onStateChange: (stateId: string) => void;
  onCityChange: (cityId: string) => void;
  isLoadingCities: boolean;
  handleSearch: () => void;
  isLoadingUserLocation: boolean;
};

export default function Hero({
  states,
  cities,
  selectedState,
  selectedCity,
  onStateChange,
  onCityChange,
  isLoadingCities,
  handleSearch,
  isLoadingUserLocation,
}: HeroProps) {
  return (
    <section className="relative flex min-h-screen items-center bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-100 opacity-50"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-emerald-100 opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-gradient-to-r from-blue-200 to-emerald-200 opacity-30"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Logo/Brand */}
            <div className="flex justify-center lg:justify-start">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-600 shadow-lg">
                <PawPrint className="h-8 w-8 text-white" />
              </div>
            </div>

            {/* Headlines */}
            <div className="space-y-4">
              <h1 className="text-4xl leading-tight font-bold text-gray-900 md:text-5xl lg:text-6xl">
                Encontre o{' '}
                <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  veterinário ideal
                </span>{' '}
                para o seu pet
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-gray-600 lg:mx-0">
                Conectamos você aos melhores profissionais veterinários da sua região, com avaliações reais e
                agendamento simplificado para o cuidado completo do seu animal de estimação.
              </p>
            </div>

            {/* Search Card */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl backdrop-blur-sm md:p-8">
              <div className="space-y-6">
                <div className="text-left">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">Onde você está procurando?</h3>
                  <p className="text-sm text-gray-600">
                    Selecione sua localização para encontrar veterinários próximos
                  </p>
                </div>

                <LocationSelector
                  required
                  states={states}
                  cities={cities}
                  selectedState={selectedState}
                  selectedCity={selectedCity}
                  onStateChange={onStateChange}
                  onCityChange={onCityChange}
                  isLoadingCities={isLoadingCities}
                />

                <UIButton
                  loading={isLoadingUserLocation || isLoadingCities}
                  variant="solid"
                  size="lg"
                  className="w-full transform border-0 bg-gradient-to-r from-blue-600 to-emerald-600 shadow-lg transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-emerald-700"
                  onClick={handleSearch}>
                  {isLoadingCities
                    ? 'Buscando cidades...'
                    : isLoadingUserLocation
                      ? 'Detectando localização...'
                      : 'Buscar Veterinários'}
                </UIButton>
              </div>
            </div>

            {/* Veterinarian CTA */}
            <div className="rounded-2xl border border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50 p-4 md:p-6">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                <div className="flex items-center gap-4 text-center sm:text-left">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-blue-600">
                    <Crown className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Você é veterinário?</h3>
                    <p className="text-sm text-gray-600">Cadastre-se e comece a receber pacientes</p>
                  </div>
                </div>
                <Link
                  href="/planos"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 font-medium text-white transition-all duration-300 hover:from-purple-700 hover:to-blue-700 sm:w-auto">
                  Ver Planos
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative order-first lg:order-last">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Floating Cards - Ajustadas para mobile */}
              <div className="absolute -top-4 -left-2 z-20 rotate-3 transform rounded-xl bg-white p-3 shadow-lg lg:-top-8 lg:-left-8 lg:p-4">
                <div className="flex items-center gap-2 lg:gap-3">
                  <div className="rounded-full bg-green-100 p-1.5 lg:p-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 lg:h-3 lg:w-3"></div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold lg:text-sm">Busca rápida</p>
                    <p className="hidden text-xs text-gray-500 lg:block">Encontre veterinários</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-2 -bottom-4 z-20 -rotate-3 transform rounded-xl bg-white p-3 shadow-lg lg:-right-8 lg:-bottom-8 lg:p-4">
                <div className="flex items-center gap-2 lg:gap-3">
                  <div className="rounded-full bg-blue-100 p-1.5 lg:p-2">
                    <PawPrint className="h-3 w-3 text-blue-600 lg:h-4 lg:w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold lg:text-sm">Avaliações reais</p>
                    <p className="hidden text-xs text-gray-500 lg:block">De outros tutores</p>
                  </div>
                </div>
              </div>

              {/* Main Image */}
              <div className="relative z-10 transform rounded-2xl bg-white p-3 shadow-2xl lg:p-4">
                <Image
                  src="/margot2.jpg"
                  alt="Veterinário cuidando de um pet"
                  width={700}
                  height={600}
                  className="h-auto w-full rounded-xl object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
