'use client';

import { City, Specialization, SpecializationCategory, State } from '@/lib/types/api';
import { cn } from '@/utils/cn';
import { MapPin, Search, Shield, Stethoscope, User } from 'lucide-react';
import { useState } from 'react';
import FormCheckbox from '../form/checkbox';
import FormCombobox from '../form/combobox';
import FormField from '../form/field';
import LocationSelector from '../form/location-selector';
import FormSelect from '../form/select';

interface Option {
  label: string;
  value: string;
}

type SearchFilterProps = {
  location: {
    states: State[];
    cities: City[];
    selectedState?: State;
    selectedCity?: City;
    onStateChange: (stateId: string) => void;
    onCityChange: (cityId: string) => void;
    isLoadingCities: boolean;
  };
  gender: {
    options: Option[];
    selectedGender: string;
    onGenderChange: (gender: string) => void;
  };
  emergency: {
    selectedEmergency: boolean;
    onEmergencyChange: (emergency: boolean) => void;
  };
  homeVisit: {
    selectedHomeVisit: boolean;
    onHomeVisitChange: (homeVisit: boolean) => void;
  };
  query: {
    queryName: string;
    queryCrmv: string;
    onQueryNameChange: (value: string, name: string) => void;
    onQueryCrmvChange: (value: string, name: string) => void;
  };
  availableToday: {
    selectedAvailableToday: boolean;
    onAvailableTodayChange: (availableToday: boolean) => void;
  };
  specialization: {
    categories: SpecializationCategory[];
    selectedCategory?: SpecializationCategory;
    onCategoryChange: (value: string) => void;
    selectedSpecialization?: Specialization;
    onSpecializationChange: (value: string) => void;
  };
};

export default function SearchFilters({
  location,
  gender,
  emergency,
  homeVisit,
  query,
  availableToday,
  specialization,
}: SearchFilterProps) {
  const [isHidden, setIsHidden] = useState(false);

  return (
    <div className="space-y-6">
      <div className={cn('flex items-center justify-between', !isHidden ? 'mb-4' : '')}>
        <button className="text-primary text-sm hover:underline md:hidden" onClick={() => setIsHidden((prev) => !prev)}>
          {isHidden ? 'Mostrar filtros' : 'Ocultar filtros'}
        </button>
      </div>

      <div className={cn('space-y-6', isHidden && 'hidden md:block')}>
        {/* Localização */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Localização</h3>
          </div>
          <LocationSelector
            states={location.states}
            cities={location.cities}
            selectedState={location.selectedState}
            selectedCity={location.selectedCity}
            onStateChange={location.onStateChange}
            onCityChange={location.onCityChange}
            isLoadingCities={location.isLoadingCities}
          />
        </div>

        {/* Busca */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Search className="h-4 w-4 text-emerald-600" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Busca</h3>
          </div>
          <div className="space-y-3">
            <FormField
              name="name"
              label="Nome do veterinário"
              type="text"
              value={query.queryName}
              onChange={query.onQueryNameChange}
              placeholder="Digite o nome..."
            />
            <FormField
              name="crmv"
              type="text"
              label="CRMV"
              value={query.queryCrmv}
              onChange={query.onQueryCrmvChange}
              placeholder="Digite o CRMV..."
            />
          </div>
        </div>

        {/* Especialização */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <Stethoscope className="h-4 w-4 text-purple-600" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Especialização</h3>
          </div>
          <div className="space-y-3">
            <FormCombobox
              options={specialization.categories.map((c) => ({
                label: c.name,
                value: c.id.toString(),
              }))}
              name="category"
              onChange={specialization.onCategoryChange}
              value={specialization.selectedCategory?.id.toString()}
              placeholder="Selecione uma categoria..."
            />
            <FormCombobox
              options={
                specialization.selectedCategory?.specializations.map((s: Specialization) => ({
                  label: s.name,
                  value: s.id.toString(),
                })) || []
              }
              name="specialization"
              value={specialization.selectedSpecialization?.id.toString()}
              onChange={specialization.onSpecializationChange}
              disabled={!specialization.selectedCategory}
              placeholder="Selecione uma especialização..."
            />
          </div>
        </div>

        {/* Gênero */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-pink-100 flex items-center justify-center">
              <User className="h-4 w-4 text-pink-600" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Gênero</h3>
          </div>
          <FormSelect
            options={gender.options}
            value={gender.selectedGender}
            onChange={gender.onGenderChange}
            name="gender"
            placeholder="Selecione um gênero"
          />
        </div>

        {/* Serviços */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <Shield className="h-4 w-4 text-orange-600" />
            </div>
            <h3 className="text-sm font-bold text-gray-900">Serviços</h3>
          </div>
          <div className="space-y-3">
            <FormCheckbox
              label="Atendimento de emergência"
              name="emergency"
              value={emergency.selectedEmergency}
              onChange={emergency.onEmergencyChange}
            />
            <FormCheckbox
              label="Atendimento domiciliar"
              name="home_visit"
              value={homeVisit.selectedHomeVisit}
              onChange={homeVisit.onHomeVisitChange}
            />
            <FormCheckbox
              label="Disponível hoje"
              name="available_today"
              value={availableToday.selectedAvailableToday}
              onChange={availableToday.onAvailableTodayChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
