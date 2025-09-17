'use client';

import SearchFilters from '@/components/search/filters';
import VeterinarianCard from '@/components/search/veterinarian-card';
import { PetDataLoading } from '@/components/ui/pet-data-loading';
import { getCities, getSpecializations, getStates } from '@/lib/api/resources';
import { searchVeterinarians } from '@/lib/api/veterinarians';
import { City, Specialization, SpecializationCategory, State, VeterinarianSearchResult } from '@/lib/types/api';
import { debounce } from 'lodash';
import { Filter, MapPin, Search, Sparkles, Stethoscope, TrendingUp, Users } from 'lucide-react';
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

export default function SearchResults() {
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
        setVeterinarians(response.data);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Enhanced Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-emerald-600 py-12">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-emerald-600/20"></div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="relative z-10 container mx-auto px-4">
          {/* Header Content */}
          <div className="text-center text-white">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
            </div>
            
            <h1 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
              {selectedCity ? (
                <>
                  Veterinários em{' '}
                  <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                    {selectedCity.name}
                  </span>
                </>
              ) : (
                'Buscar Veterinários'
              )}
            </h1>
            
            <p className="mx-auto max-w-3xl text-lg text-white/90 leading-relaxed">
              Encontre veterinários qualificados e especializados para cuidar do seu pet com carinho e profissionalismo.
            </p>

            {/* Enhanced Stats */}
            {veterinarians?.length > 0 && (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold">{veterinarians.length}</div>
                      <div className="text-xs text-white/80">Veterinários</div>
                    </div>
                  </div>
                </div>

                {currentlyAttending > 0 && (
                  <div className="bg-emerald-500/20 backdrop-blur-sm rounded-xl p-3 border border-emerald-300/30">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-emerald-100" />
                      </div>
                      <div>
                        <div className="text-lg font-bold">{currentlyAttending}</div>
                        <div className="text-xs text-emerald-100/80">Atendendo</div>
                      </div>
                    </div>
                  </div>
                )}

                {homeServiceCount > 0 && (
                  <div className="bg-blue-500/20 backdrop-blur-sm rounded-xl p-3 border border-blue-300/30">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-blue-100" />
                      </div>
                      <div>
                        <div className="text-lg font-bold">{homeServiceCount}</div>
                        <div className="text-xs text-blue-100/80">Domicílio</div>
                      </div>
                    </div>
                  </div>
                )}

                {emergencyServiceCount > 0 && (
                  <div className="bg-red-500/20 backdrop-blur-sm rounded-xl p-3 border border-red-300/30">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-red-500/20 flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-red-100" />
                      </div>
                      <div>
                        <div className="text-lg font-bold">{emergencyServiceCount}</div>
                        <div className="text-xs text-red-100/80">Emergência</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 lg:grid-cols-5">
            {/* Enhanced Filters Sidebar */}
            <div className="lg:col-span-2">
              <div className="sticky top-4">
                <div className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm p-4">
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

            {/* Enhanced Results */}
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
                <div className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm p-12 text-center">
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
                <div className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm p-12 text-center">
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
      </section>
    </div>
  );
}
