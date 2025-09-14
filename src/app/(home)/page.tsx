'use client';

import CTASection from '@/components/home/cta-section';
import Hero from '@/components/home/hero';
import HowItWorks from '@/components/home/how-it-works';
import QuickFAQSection from '@/components/home/quick-faq-section';
import SpecialtiesSection from '@/components/home/specialties-section';
import StatsSection from '@/components/home/stats-section';
import TestimonialsSection from '@/components/home/testimonials-section';
import { useStates } from '@/hooks/use-states';
import { useUserLocation } from '@/hooks/use-user-location';
import { getCities } from '@/lib/api/resources';
import { City, State } from '@/lib/types/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import toast from 'react-hot-toast';

export default function Home() {
  const router = useRouter();
  const states = useStates();
  const location = useUserLocation();
  const [cities, setCities] = useState<City[]>([]);
  const [selectedState, setSelectedState] = useState<State>();
  const [selectedCity, setSelectedCity] = useState<City>();
  const [isLoadingCities, startCitiesTransition] = useTransition();

  const handleStateChange = (value: string) => {
    if (isNaN(Number(value))) return;
    const state = states.find((s) => s.id === Number(value));
    if (!state) return;
    setSelectedState(state);
  };

  const handleCityChange = (value: string) => {
    if (isNaN(Number(value))) return;
    const city = cities.find((c) => c.id === Number(value));
    if (!city) return;
    setSelectedCity(city);
  };

  useEffect(() => {
    if (!selectedState) return;
    const fetchCitiesData = async () => {
      const cities = await getCities(selectedState.id);
      if (cities.success) setCities(cities.cities || []);
      else toast.error('Não foi possível buscar as cidades');
    };
    setCities([]);
    startCitiesTransition(() => fetchCitiesData());
  }, [selectedState]);

  const handleSearch = () => {
    if (!selectedState) {
      toast.error('Selecione um estado');
      return;
    }

    if (!selectedCity) {
      toast.error('Selecione uma cidade');
      return;
    }

    router.push(`/busca?estado=${selectedState.id}&cidade=${selectedCity.id}`);
  };

  useEffect(() => {
    if (!location.state) return;
    setSelectedState(location.state);
  }, [location.state]);

  useEffect(() => {
    if (!location.city || !location.state || !selectedState) return;
    if (location.state.id !== selectedState.id) return;
    setSelectedCity(location.city);
  }, [location.city, location.state, selectedState]);


  return (
    <div className="relative overflow-hidden">
      <Hero
        states={states}
        cities={cities}
        selectedState={selectedState}
        selectedCity={selectedCity}
        onStateChange={handleStateChange}
        onCityChange={handleCityChange}
        isLoadingCities={isLoadingCities}
        handleSearch={handleSearch}
        isLoadingUserLocation={location.isLoading}
      />

      <HowItWorks />
      <StatsSection />
      <SpecialtiesSection />
      <TestimonialsSection />
      <QuickFAQSection />
      <CTASection />
    </div>
  );
}
