'use client';

import SearchFilters from '@/components/search/filters';
import VeterinarianCard from '@/components/search/veterinarian-card';
import { PetDataLoading } from '@/components/ui/pet-data-loading';
import { getCities, getSpecializations, getStates } from '@/lib/api/resources';
import { searchVeterinarians } from '@/lib/api/veterinarians';
import { City, Specialization, SpecializationCategory, State, VeterinarianSearchResult } from '@/lib/types/api';
import { debounce } from 'lodash';
import { Calendar, Filter, MapPin, Search, Sparkles, Stethoscope, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import toast from 'react-hot-toast';

interface Option {
  label: string;
  value: string;
}

const genderOptions: Option[] = [
  { label: 'Masculino', value: 'M' },
  { label: 'Feminino', value: 'F' },
  { label: 'Outro', value: 'O' },
];

export default function AgendamentoPage() {
  const searchParams = useSearchParams();

  const initialCityId = searchParams.get('cidade') ? Number(searchParams.get('cidade')) : null;
  const initialStateId = searchParams.get('estado') ? Number(searchParams.get('estado')) : null;

  // Data states
  const [states, setStates] = useState<State[]>([]);
  const [categories, setCategories] = useState<SpecializationCategory[]>([]);
  const [veterinarians, setVeterinarians] = useState<VeterinarianSearchResult[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  // Filter states
  const [selectedState, setSelectedState] = useState<State>();
  const [selectedCity, setSelectedCity] = useState<City>();
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [selectedEmergency, setSelectedEmergency] = useState<boolean>(false);
  const [selectedHomeVisit, setSelectedHomeVisit] = useState<boolean>(false);
  const [queryName, setQueryName] = useState<string>('');
  const [queryCrmv, setQueryCrmv] = useState<string>('');
  const [selectedAvailableToday, setSelectedAvailableToday] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<SpecializationCategory>();
  const [selectedSpecialization, setSelectedSpecialization] = useState<Specialization>();

  // Loading states
  const [isLoadingCities, startCitiesTransition] = useTransition();
  const [isLoadingVeterinarians, setIsLoadingVeterinarians] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      const [statesResponse, specializationsResponse] = await Promise.all([getStates(), getSpecializations()]);

      if (statesResponse.success && statesResponse.states) {
        setStates(statesResponse.states);
      }

      if (specializationsResponse.success && specializationsResponse.specializations) {
        setCategories(specializationsResponse.specializations);
      }
    };

    loadInitialData();
  }, []);

  // Handle state change
  const handleStateChange = (value: string) => {
    if (isNaN(Number(value))) return;
    const state = states.find((s: State) => s.id === Number(value));
    if (!state) return;
    setSelectedState(state);
    setSelectedCity(undefined); // Reset city when state changes
  };

  // Handle city change
  const handleCityChange = (value: string) => {
    if (isNaN(Number(value))) return;
    const city = cities.find((c: City) => c.id === Number(value));
    if (!city) return;
    setSelectedCity(city);
  };

  // Other handlers
  const handleGenderChange = (value: string) => {
    setSelectedGender(value);
  };

  const handleEmergencyChange = (value: boolean) => {
    setSelectedEmergency(value);
  };

  const handleHomeVisitChange = (value: boolean) => {
    setSelectedHomeVisit(value);
  };

  const handleAvailableTodayChange = (value: boolean) => {
    setSelectedAvailableToday(value);
  };

  const handleQueryNameChange = debounce((value: string) => {
    setQueryName(value);
  }, 500);

  const handleQueryCrmvChange = debounce((value: string) => {
    setQueryCrmv(value);
  }, 500);

  const handleCategoryChange = (value: string) => {
    const category = categories.find((c: SpecializationCategory) => c.id.toString() === value);
    setSelectedCategory(category);
    setSelectedSpecialization(undefined); // Reset specialization when category changes
  };

  const handleSpecializationChange = (value: string) => {
    const specializations = categories.flatMap((c: SpecializationCategory) => c.specializations);
    const specialization = specializations.find((s: Specialization) => s.id.toString() === value);
    setSelectedSpecialization(specialization);
  };

  // Load cities when state changes
  useEffect(() => {
    if (!selectedState) return;

    const loadCities = async () => {
      const response = await getCities(selectedState.id);
      if (response.success && response.cities) {
        setCities(response.cities);
      } else {
        toast.error('Não foi possível buscar as cidades');
      }
    };

    setCities([]);
    startCitiesTransition(() => loadCities());
  }, [selectedState]);

  // Handle initial URL params
  useEffect(() => {
    const handleInitialFilters = async () => {
      if (!initialStateId || !states.length) return;

      const citiesResponse = await getCities(initialStateId);
      if (citiesResponse.success && citiesResponse.cities) {
        setCities(citiesResponse.cities);
        if (initialCityId) {
          const initialCity = citiesResponse.cities.find((c: City) => c.id === initialCityId);
          setSelectedCity(initialCity);
        }
      }

      const state = states.find((s: State) => s.id === initialStateId);
      setSelectedState(state);
    };

    handleInitialFilters();
  }, [initialCityId, initialStateId, states]);

  // Search veterinarians when filters change
  useEffect(() => {
    if (!selectedCity) {
      if (!isInitialLoad) {
        setVeterinarians([]);
      }
      return;
    }

    const searchVets = async () => {
      setIsLoadingVeterinarians(true);

      const params = {
        cityId: selectedCity.id,
        ...(selectedGender && { gender: selectedGender }),
        ...(selectedEmergency && { providesEmergencyService: selectedEmergency }),
        ...(selectedHomeVisit && { providesHomeService: selectedHomeVisit }),
        ...(selectedAvailableToday && { availableToday: selectedAvailableToday }),
        ...(queryName && { name: queryName }),
        ...(queryCrmv && { crmv: queryCrmv }),
        ...(selectedSpecialization && { specializationIds: [selectedSpecialization.id] }),
      };

      const response = await searchVeterinarians(params);

      if (response.success && response.data) {
        setVeterinarians(response.data.data);
      } else {
        setVeterinarians([]);
        if (response.error) {
          toast.error(response.error);
        }
      }

      setIsLoadingVeterinarians(false);
      setIsInitialLoad(false);
    };

    searchVets();
  }, [
    selectedCity,
    selectedGender,
    selectedEmergency,
    selectedHomeVisit,
    selectedAvailableToday,
    queryName,
    queryCrmv,
    selectedSpecialization,
    isInitialLoad,
  ]);

  // Calculate stats
  const currentlyAttending = veterinarians?.filter(v => v.isCurrentlyAttending).length || 0;
  const homeServiceCount = veterinarians?.filter(v => v.providesHomeService).length || 0;
  const emergencyServiceCount = veterinarians?.filter(v => v.providesEmergencyService).length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Agendamento</h1>
            <p className="text-white/90">Encontre o veterinário ideal para o seu pet</p>
          </div>
        </div>

        {/* Stats */}
        {veterinarians?.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <div>
                  <div className="text-lg font-bold">{veterinarians.length}</div>
                  <div className="text-xs text-white/80">Veterinários</div>
                </div>
              </div>
            </div>

            {currentlyAttending > 0 && (
              <div className="bg-emerald-500/20 backdrop-blur-sm rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <div>
                    <div className="text-lg font-bold">{currentlyAttending}</div>
                    <div className="text-xs text-white/80">Atendendo</div>
                  </div>
                </div>
              </div>
            )}

            {homeServiceCount > 0 && (
              <div className="bg-blue-500/20 backdrop-blur-sm rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <div>
                    <div className="text-lg font-bold">{homeServiceCount}</div>
                    <div className="text-xs text-white/80">Domicílio</div>
                  </div>
                </div>
              </div>
            )}

            {emergencyServiceCount > 0 && (
              <div className="bg-red-500/20 backdrop-blur-sm rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <div>
                    <div className="text-lg font-bold">{emergencyServiceCount}</div>
                    <div className="text-xs text-white/80">Emergência</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Filters Sidebar */}
        <div className="lg:col-span-2">
          <div className="sticky top-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-4">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Filter className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">Filtros</h2>
                  <p className="text-xs text-gray-500">Refine sua busca</p>
                </div>
              </div>

              <SearchFilters
                location={{
                  states,
                  cities,
                  selectedState,
                  selectedCity,
                  onStateChange: handleStateChange,
                  onCityChange: handleCityChange,
                  isLoadingCities,
                }}
                gender={{
                  options: genderOptions,
                  selectedGender: selectedGender,
                  onGenderChange: handleGenderChange,
                }}
                emergency={{
                  selectedEmergency,
                  onEmergencyChange: handleEmergencyChange,
                }}
                homeVisit={{
                  selectedHomeVisit,
                  onHomeVisitChange: handleHomeVisitChange,
                }}
                availableToday={{
                  selectedAvailableToday,
                  onAvailableTodayChange: handleAvailableTodayChange,
                }}
                query={{
                  queryName,
                  queryCrmv,
                  onQueryNameChange: handleQueryNameChange,
                  onQueryCrmvChange: handleQueryCrmvChange,
                }}
                specialization={{
                  categories,
                  selectedCategory,
                  onCategoryChange: handleCategoryChange,
                  selectedSpecialization,
                  onSpecializationChange: handleSpecializationChange,
                }}
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-3">
          {isLoadingVeterinarians ? (
            <div className="space-y-6">
              <div className="text-center">
                <PetDataLoading type="veterinarians" size="lg" inline={true} showProgress={true} />
                <p className="mt-4 text-gray-600">Buscando veterinários...</p>
              </div>
            </div>
          ) : veterinarians && veterinarians.length > 0 ? (
            <div className="space-y-4">
              {/* Results Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {veterinarians.length} veterinário{veterinarians.length !== 1 ? 's' : ''} encontrado{veterinarians.length !== 1 ? 's' : ''}
                  </h3>
                  {selectedCity && (
                    <p className="text-gray-600 mt-1 text-sm">
                      em <span className="font-medium text-blue-600">{selectedCity.name}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Results Grid */}
              <div className="grid gap-6 md:grid-cols-2">
                {veterinarians.map((veterinarian) => (
                  <Link
                    key={veterinarian.id}
                    href={`/veterinario/${veterinarian.veterinarianId}`}
                    className="transition-all duration-300">
                    <VeterinarianCard veterinarian={veterinarian} />
                  </Link>
                ))}
              </div>
            </div>
          ) : selectedCity ? (
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900">Nenhum veterinário encontrado</h3>
              <p className="text-gray-600 mb-4 max-w-md mx-auto text-sm">
                Tente ajustar os filtros ou escolher uma cidade diferente para encontrar mais opções.
              </p>
              <button
                onClick={() => {
                  setSelectedCity(undefined);
                  setSelectedState(undefined);
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 transition-colors text-sm">
                <MapPin className="h-4 w-4" />
                Escolher outra cidade
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900">Selecione uma cidade para começar</h3>
              <p className="text-gray-600 max-w-md mx-auto text-sm">
                Escolha um estado e cidade nos filtros para encontrar veterinários próximos a você.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 