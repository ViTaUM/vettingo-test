'use client';

import { PetDataLoading } from '@/components/ui/pet-data-loading';
import SpotlightCard from '@/components/ui/spotlight-card';
import CreateReviewForm from '@/components/veterinarian/create-review-form';
import AppointmentModal from '@/components/veterinarian/appointment-modal';
import { useAuthStatus } from '@/hooks/use-auth-status';
import { getVeterinarianDashboardClient } from '@/lib/api/vet-work-locations';
import {
    AlertTriangle,
    ArrowLeft,
    Calendar,
    Clock,
    Home,
    MapPin,
    MessageSquare,
    Star,
    Stethoscope
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface VeterinarianData {
  id: number;
  name: string;
  avatar?: string | null;
  bio?: string;
  domiciliaryattendance: boolean;
  emergencialattendance: boolean;
  address: string;
  number: string;
  complement?: string;
  neighborhood: string;
  zipcode: string;
  schedule: string; // JSON string
}

interface ReviewData {
  id: number;
  veterinarianId: number;
  anonymous: boolean;
  authorName?: string;
  authorAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardVeterinarianPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [veterinarianData, setVeterinarianData] = useState<VeterinarianData[]>([]);
  const [reviewsData, setReviewsData] = useState<ReviewData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedWorkLocation, setSelectedWorkLocation] = useState<VeterinarianData | null>(null);
  
  const { isAuthenticated, isUser } = useAuthStatus();

  // Extrair parâmetros da URL
  const vetId = params.id as string;
  const cityId = searchParams.get('cityId');

  useEffect(() => {
    const loadVeterinarianData = async () => {
      if (!vetId || !cityId) {
        toast.error('Parâmetros inválidos');
        return;
      }

      try {
        setLoading(true);
        
        const response = await getVeterinarianDashboardClient(Number(vetId), Number(cityId));
        
        if (response.success && response.data) {
          setVeterinarianData(response.data.veterinarian);
          setReviewsData(response.data.review);
        } else {
          toast.error(response.error || 'Erro ao carregar dados do veterinário');
        }
        
      } catch (error) {
        toast.error('Erro ao carregar dados do veterinário');
      } finally {
        setLoading(false);
      }
    };

    loadVeterinarianData();
  }, [vetId, cityId]);

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    toast.success('Avaliação enviada com sucesso!');
  };

  const handleAppointmentSuccess = () => {
    setShowAppointmentModal(false);
    // Aqui você pode adicionar lógica para atualizar a lista de agendamentos se necessário
  };

  // Parse do schedule JSON
  const parseSchedule = (scheduleJson: string) => {
    try {
      const parsed = JSON.parse(scheduleJson);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch {
      return [];
    }
  };

  // Converter schedule para formato do modal
  const getScheduleForModal = (scheduleJson: string): Array<{dayName: string; hours: string}> => {
    try {
      const parsed = parseSchedule(scheduleJson);
      if (!Array.isArray(parsed)) return [];
      
      const result: Array<{dayName: string; hours: string}> = [];
      
      for (const item of parsed) {
        if (item && typeof item === 'object') {
          const dayName = Object.keys(item)[0];
          const hours = item[dayName];
          if (dayName) {
            result.push({
              dayName: dayName,
              hours: String(hours || '')
            });
          }
        }
      }
      
      return result;
    } catch {
      return [];
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-16">
          <PetDataLoading type="veterinarians" size="lg" inline={true} showProgress={true} />
          <p className="mt-4 text-gray-600">Carregando dados do veterinário...</p>
        </div>
      </div>
    );
  }

  if (!veterinarianData.length) {
    return (
      <div className="space-y-6">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Veterinário não encontrado</h1>
          <Link 
            href="/dashboard/usuario/agendamento"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-white font-medium hover:bg-blue-700 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao agendamento
          </Link>
        </div>
      </div>
    );
  }

  // Usar o primeiro veterinário dos dados (pode haver múltiplos locais)
  const mainVet = veterinarianData[0];
  const fullName = `Dr. ${mainVet.name}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-emerald-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4 mb-6">
          <Link 
            href="/dashboard/usuario/agendamento"
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao agendamento
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 items-center">
          {/* Avatar */}
          <div className="lg:col-span-1 flex justify-center">
            <div className="relative h-24 w-24 lg:h-32 lg:w-32">
              {mainVet.avatar ? (
                <img
                  src={mainVet.avatar}
                  alt={fullName}
                  className="h-full w-full rounded-2xl object-cover"
                />
              ) : (
                <div className="h-full w-full rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white text-2xl lg:text-3xl font-bold">
                  {mainVet.name.charAt(0)}
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-2 text-white">
            <h1 className="text-2xl lg:text-3xl font-bold mb-3">{fullName}</h1>
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{mainVet.neighborhood}</span>
              </div>
            </div>
            
            {mainVet.bio && (
              <p className="text-base text-white/90 leading-relaxed max-w-2xl">
                {mainVet.bio}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
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
              {mainVet.domiciliaryattendance && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <Home className="h-5 w-5 text-emerald-600" />
                  <div>
                    <h3 className="font-semibold text-emerald-900 text-sm">Atendimento Domiciliar</h3>
                    <p className="text-xs text-emerald-700">Visita na sua casa</p>
                  </div>
                </div>
              )}

              {mainVet.emergencialattendance && (
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
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                <MapPin className="h-4 w-4 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Locais de Atendimento</h2>
            </div>

            <div className="space-y-4">
              {veterinarianData.map((location) => (
                <div key={location.id} className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{location.name}</h3>
                    <button
                      onClick={() => {
                        // Definir o local selecionado e abrir modal
                        setSelectedWorkLocation(location);
                        setShowAppointmentModal(true);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Agendar Aqui
                    </button>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-3">
                    <p>{location.address}, {location.number}</p>
                    {location.complement && <p>{location.complement}</p>}
                    <p>{location.neighborhood} - CEP: {location.zipcode}</p>
                  </div>

                  {/* Schedule */}
                  {location.schedule && (
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm mb-2">Horários:</h4>
                      <div className="flex flex-wrap gap-2">
                        {parseSchedule(location.schedule).map((item: any, index: number) => {
                          const dayName = Object.keys(item)[0];
                          const hours = item[dayName];
                          return (
                            <div key={index} className="flex items-center gap-2 bg-blue-50 px-2 py-1 rounded text-xs">
                              <Clock className="h-3 w-3 text-blue-600" />
                              <span className="font-medium text-blue-900">{dayName}:</span>
                              <span className="text-blue-700">{hours}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </SpotlightCard>

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
                  veterinarianId={mainVet.id}
                  onSuccess={handleReviewSuccess}
                  onCancel={() => setShowReviewForm(false)}
                />
              </div>
            )}

            {/* Reviews List */}
            {reviewsData.length > 0 ? (
              <div className="space-y-4">
                {reviewsData.map((review) => (
                  <div key={review.id} className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {review.anonymous ? '?' : review.authorName?.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {review.anonymous ? 'Usuário Anônimo' : review.authorName}
                          </p>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
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
          {/* Quick Actions */}
          <SpotlightCard className="border border-gray-200 bg-white" spotlightColor="blue">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <h3 className="text-base font-bold text-gray-900">Agendar Consulta</h3>
            </div>

            <div className="space-y-2">
              <button 
                onClick={() => {
                  // Usar o primeiro local como padrão
                  if (veterinarianData.length > 0) {
                    setSelectedWorkLocation(veterinarianData[0]);
                    setShowAppointmentModal(true);
                  }
                }}
                disabled={veterinarianData.length === 0}
                className="w-full bg-blue-600 text-white py-2 px-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
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
                <span className="font-semibold text-sm">{veterinarianData.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Avaliações</span>
                <span className="font-semibold text-sm">{reviewsData.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Atendimento domiciliar</span>
                <span className="font-semibold text-sm">
                  {mainVet.domiciliaryattendance ? 'Sim' : 'Não'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Atendimento emergencial</span>
                <span className="font-semibold text-sm">
                  {mainVet.emergencialattendance ? 'Sim' : 'Não'}
                </span>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>

      {/* Appointment Modal */}
      {selectedWorkLocation && (
        <AppointmentModal
          isOpen={showAppointmentModal}
          onClose={() => {
            setShowAppointmentModal(false);
            setSelectedWorkLocation(null);
          }}
          onSuccess={handleAppointmentSuccess}
          vetId={selectedWorkLocation.id} // Usar o ID do local de trabalho
          vetName={`${fullName} - ${selectedWorkLocation.name}`}
          availableSchedule={getScheduleForModal(selectedWorkLocation.schedule || '[]')}
        />
      )}
    </div>
  );
} 