'use client';

import { PetDataLoading } from '@/components/ui/pet-data-loading';
import SpotlightCard from '@/components/ui/spotlight-card';
import CreateReviewForm from '@/components/veterinarian/create-review-form';
import ReviewsList from '@/components/veterinarian/reviews-list';
import WorkLocationsList from '@/components/veterinarian/work-locations-list';
import { useAuthStatus } from '@/hooks/use-auth-status';
import { Veterinarian, VeterinarianWorkLocation } from '@/lib/types/api';
import { VetReviewsResponse } from '@/lib/api/vet-reviews';
import {
    AlertTriangle,
    ArrowLeft,
    Award,
    Calendar,
    ExternalLink,
    Home,
    Mail,
    MapPin,
    MessageSquare,
    Phone,
    Shield,
    Star,
    Stethoscope
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

// Dados mockados para evitar erro de hidratação
const mockVeterinarian: Veterinarian = {
  id: 2,
  userId: 2,
  bio: 'Veterinário especializado em clínica geral e cirurgia de pequenos animais. Formado pela Universidade Federal de Viçosa, com mais de 10 anos de experiência no atendimento de cães e gatos. Apaixonado por ajudar os pets e suas famílias.',
  crmv: '12345-MG',
  crmvStateId: 13,
  phoneId: 1,
  professionalEmailId: 1,
  providesEmergencyService: true,
  providesHomeService: true,
  isActive: true,
  createdAt: '2023-01-15T10:00:00Z',
  updatedAt: '2024-01-15T10:00:00Z',
  firstName: 'Carlos',
  lastName: 'Oliveira',
  avatar: undefined,
  website: 'https://www.drcarlosoliveira.com.br',
  profilePhotos: undefined,
  deletedAt: undefined,
  city: {
    id: 1,
    name: 'Belo Horizonte',
    active: true,
    stateId: 13,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  state: {
    id: 13,
    name: 'Minas Gerais',
    uf: 'MG',
    active: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  emails: [
    {
      id: 1,
      userId: 2,
      email: 'carlos.oliveira@vet.com',
      isActive: true,
      isPrimary: true,
      isPublic: true,
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2024-01-15')
    }
  ],
  phones: [
    {
      id: 1,
      userId: 2,
      ddi: '+55',
      ddd: '31',
      number: '99999-9999',
      isActive: true,
      isPrimary: true,
      isPublic: true,
      isWhatsApp: true,
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2024-01-15'),
      deletedAt: null
    }
  ],
  specializations: [
    {
      id: 1,
      name: 'Clínica Geral',
      description: 'Atendimento geral para cães e gatos',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2024-01-01'),
      deletedAt: null,
      specializations: []
    },
    {
      id: 2,
      name: 'Cirurgia',
      description: 'Procedimentos cirúrgicos em pequenos animais',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2024-01-01'),
      deletedAt: null,
      specializations: []
    },
    {
      id: 3,
      name: 'Dermatologia',
      description: 'Tratamento de doenças de pele',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2024-01-01'),
      deletedAt: null,
      specializations: []
    }
  ]
};

// Dados mockados para reviews
const mockReviewsData: VetReviewsResponse = {
  data: [
    {
      id: 1,
      veterinarianId: 2,
      anonymous: false,
      authorName: 'Maria Silva',
      authorAvatar: undefined,
      rating: 5,
      comment: 'Excelente atendimento! Dr. Carlos foi muito atencioso com minha gatinha. Recomendo muito!',
      createdAt: '2024-01-10T14:30:00Z',
      updatedAt: '2024-01-10T14:30:00Z'
    },
    {
      id: 2,
      veterinarianId: 2,
      anonymous: false,
      authorName: 'João Santos',
      authorAvatar: undefined,
      rating: 4,
      comment: 'Muito bom veterinário, cuidou muito bem do meu cachorro. Ambiente limpo e organizado.',
      createdAt: '2024-01-08T10:15:00Z',
      updatedAt: '2024-01-08T10:15:00Z'
    },
    {
      id: 3,
      veterinarianId: 2,
      anonymous: true,
      rating: 5,
      comment: 'Profissional competente e carinhoso com os animais. Preços justos.',
      createdAt: '2024-01-05T16:45:00Z',
      updatedAt: '2024-01-05T16:45:00Z'
    }
  ],
  meta: {
    page: 1,
    perPage: 5,
    total: 3,
    totalPages: 1
  }
};

// Dados mockados para work locations
const mockWorkLocations: VeterinarianWorkLocation[] = [
  {
    id: 1,
    veterinarianId: 2,
    stateId: 13,
    cityId: 1,
    name: 'Clínica Veterinária Pet Care',
    address: 'Rua das Flores, 123',
    number: '123',
    complement: 'Sala 101',
    neighborhood: 'Centro',
    zipCode: '30110-000',
    latitude: -19.9191,
    longitude: -43.9386,
    isActive: true,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 2,
    veterinarianId: 2,
    stateId: 13,
    cityId: 1,
    name: 'Hospital Veterinário Animal Life',
    address: 'Avenida Brasil, 456',
    number: '456',
    complement: null,
    neighborhood: 'Savassi',
    zipCode: '30112-000',
    latitude: -19.9245,
    longitude: -43.9352,
    isActive: true,
    createdAt: new Date('2023-02-01'),
    updatedAt: new Date('2024-01-20')
  }
];

export default function VeterinarianDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [veterinarian, setVeterinarian] = useState<Veterinarian | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewsPage, setReviewsPage] = useState(1);
  
  const { isAuthenticated, isUser } = useAuthStatus();
  
  // Usar dados mockados em vez dos hooks que fazem requisições à API
  const reviewsData = mockReviewsData;
  const reviewsLoading = false;
  const workLocations = mockWorkLocations;
  const workLocationsLoading = false;
  const workLocationsError = null;

  useEffect(() => {
    const loadVeterinarian = async () => {
      if (!params.id) return;

      try {
        setLoading(true);
        
        // Simular carregamento da API com dados mockados
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Usar dados mockados para evitar erro de hidratação
        setVeterinarian(mockVeterinarian);
        
      } catch {
        toast.error('Erro ao carregar dados do veterinário');
        router.push('/busca');
      } finally {
        setLoading(false);
      }
    };

    loadVeterinarian();
  }, [params.id, router]);

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    // refetchReviews(); // Removido pois estamos usando dados mockados
    toast.success('Avaliação enviada com sucesso!');
  };

  const handleWorkLocationFiltersChange = (filters: {
    active?: boolean;
    orderBy?: 'name' | 'createdAt' | 'updatedAt';
    orderDirection?: 'asc' | 'desc';
  }) => {
   /* setWorkLocationFilters(prev => ({
      ...prev,
      ...filters,
      active: filters.active ?? prev.active,
      orderBy: filters.orderBy ?? prev.orderBy,
      orderDirection: filters.orderDirection ?? prev.orderDirection,
    })); */
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <PetDataLoading type="veterinarians" size="lg" inline={true} showProgress={true} />
            <p className="mt-4 text-gray-600">Carregando dados do veterinário...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!veterinarian) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Veterinário não encontrado</h1>
            <Link 
              href="/busca"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Voltar à busca
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const fullName = `Dr. ${veterinarian.firstName} ${veterinarian.lastName}`;
  const primaryPhone = veterinarian.phones?.find(phone => phone.isPublic && phone.isPrimary);
  const primaryEmail = veterinarian.emails?.find(email => email.isPublic && email.isPrimary);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-emerald-600 py-12">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-emerald-600/20"></div>
        
        <div className="relative z-10 container mx-auto px-4">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              href="/busca"
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Voltar à busca
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 items-center">
            {/* Avatar */}
            <div className="lg:col-span-1 flex justify-center">
              <div className="relative h-24 w-24 lg:h-32 lg:w-32">
                <div className="h-full w-full rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white text-2xl lg:text-3xl font-bold">
                  {veterinarian.firstName?.charAt(0)}{veterinarian.lastName?.charAt(0)}
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="lg:col-span-2 text-white">
              <h1 className="text-2xl lg:text-3xl font-bold mb-3">{fullName}</h1>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="font-medium text-sm">CRMV {veterinarian.crmv}</span>
                </div>
                {veterinarian.city && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{veterinarian.city.name}</span>
                  </div>
                )}
              </div>
              
              {veterinarian.bio && (
                <p className="text-base text-white/90 leading-relaxed max-w-2xl">
                  {veterinarian.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Services */}
              <SpotlightCard className="border border-gray-200 bg-white" spotlightColor="blue">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Stethoscope className="h-4 w-4 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Serviços Oferecidos</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  {veterinarian.providesHomeService && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                      <Home className="h-5 w-5 text-emerald-600" />
                      <div>
                        <h3 className="font-semibold text-emerald-900 text-sm">Atendimento Domiciliar</h3>
                        <p className="text-xs text-emerald-700">Visita na sua casa</p>
                      </div>
                    </div>
                  )}

                  {veterinarian.providesEmergencyService && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-200">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <div>
                        <h3 className="font-semibold text-red-900 text-sm">Atendimento de Emergência</h3>
                        <p className="text-xs text-red-700">Atendimento de emergência</p>
                      </div>
                    </div>
                  )}
                </div>
              </SpotlightCard>

              {/* Work Locations */}
              <SpotlightCard className="border border-gray-200 bg-white">
                <WorkLocationsList
                  locations={workLocations || []}
                  loading={workLocationsLoading}
                  error={workLocationsError}
                  onFiltersChange={handleWorkLocationFiltersChange}
                />
              </SpotlightCard>

              {/* Specializations */}
              {veterinarian.specializations && veterinarian.specializations.length > 0 && (
                <SpotlightCard className="border border-gray-200 bg-white" spotlightColor="orange">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center">
                      <Award className="h-4 w-4 text-orange-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Especializações</h2>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {veterinarian.specializations.map((category) => (
                      <span
                        key={category.id}
                        className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800">
                        {category.name}
                      </span>
                    ))}
                  </div>
                </SpotlightCard>
              )}

              {/* Reviews Section */}
              <SpotlightCard className="border border-gray-200 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                      <Star className="h-4 w-4 text-yellow-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Avaliações</h2>
                  </div>
                  
                  {isAuthenticated && isUser && (
                    <button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      <MessageSquare className="h-4 w-4" />
                      {showReviewForm ? 'Cancelar' : 'Avaliar'}
                    </button>
                  )}
                </div>

                {/* Review Form */}
                {showReviewForm && isAuthenticated && isUser && (
                  <div className="mb-6">
                    <CreateReviewForm
                      veterinarianId={veterinarian.id}
                      onSuccess={handleReviewSuccess}
                      onCancel={() => setShowReviewForm(false)}
                    />
                  </div>
                )}

                {/* Reviews List */}
                {reviewsLoading ? (
                  <div className="text-center py-8">
                    <PetDataLoading type="veterinarians" size="md" inline={true} />
                    <p className="mt-2 text-sm text-gray-600">Carregando avaliações...</p>
                  </div>
                ) : reviewsData ? (
                  <ReviewsList
                    reviews={reviewsData.data}
                    total={reviewsData.meta.total}
                    currentPage={reviewsPage}
                    totalPages={reviewsData.meta.totalPages}
                    onPageChange={setReviewsPage}
                  />
                ) : (
                  <div className="text-center py-8">
                    <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <Star className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma avaliação ainda</h3>
                    <p className="text-gray-600 text-sm">Seja o primeiro a avaliar este veterinário!</p>
                  </div>
                )}
              </SpotlightCard>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              {/* Contact Info */}
              <SpotlightCard className="border border-gray-200 bg-white" spotlightColor="emerald">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Phone className="h-4 w-4 text-emerald-600" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">Contato</h3>
                </div>

                <div className="space-y-3">
                  {primaryPhone && (
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                      <Phone className="h-4 w-4 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {primaryPhone.ddi} {primaryPhone.ddd} {primaryPhone.number}
                        </p>
                        {primaryPhone.isWhatsApp && (
                          <span className="text-xs text-emerald-600 font-medium">WhatsApp</span>
                        )}
                      </div>
                    </div>
                  )}

                  {primaryEmail && (
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                      <Mail className="h-4 w-4 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{primaryEmail.email}</p>
                      </div>
                    </div>
                  )}

                  {veterinarian.website && (
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                      <ExternalLink className="h-4 w-4 text-gray-600" />
                      <div>
                        <a 
                          href={veterinarian.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:text-blue-700 text-sm">
                          Visitar site
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </SpotlightCard>

              {/* Quick Actions */}
              <SpotlightCard className="border border-gray-200 bg-white" spotlightColor="blue">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">Agendar Consulta</h3>
                </div>

                <div className="space-y-2">
                  <button className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
                    Agendar Consulta
                  </button>
                  <button className="w-full bg-emerald-600 text-white py-2 px-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors text-sm">
                    Solicitar Orçamento
                  </button>
                </div>
              </SpotlightCard>

              {/* Stats */}
              <SpotlightCard className="border border-gray-200 bg-white" spotlightColor="purple">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                    <Star className="h-4 w-4 text-purple-600" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">Informações</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Locais de atendimento</span>
                    <span className="font-semibold text-sm">{workLocations?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Especializações</span>
                    <span className="font-semibold text-sm">{veterinarian.specializations?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Ativo desde</span>
                    <span className="font-semibold text-sm">
                      {new Date(veterinarian.createdAt).getFullYear()}
                    </span>
                  </div>
                </div>
              </SpotlightCard>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 