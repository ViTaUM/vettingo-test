'use client';

import UIButton from '@/components/ui/button';
import { PetDataLoading } from '@/components/ui/pet-data-loading';
import {
  Calendar,
  Clock,
  MapPin,
  Stethoscope,
  User,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Phone,
  Mail,
  ArrowLeft,
  Edit,
  Trash2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Appointment {
  id: string;
  petName: string;
  petAvatar?: string;
  veterinarianName: string;
  veterinarianAvatar?: string;
  veterinarianPhone?: string;
  veterinarianEmail?: string;
  clinicName: string;
  clinicAddress: string;
  clinicPhone?: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending';
  type: string;
  notes?: string;
  price: number;
  emergency: boolean;
  diagnosis?: string;
  prescription?: string;
  nextAppointment?: string;
}

// Dados mockados (mesmos da página principal)
const mockAppointments: Appointment[] = [
  {
    id: '1',
    petName: 'Thor',
    petAvatar: '/images/cat.jpg',
    veterinarianName: 'Dra. Maria Silva',
    veterinarianAvatar: '/images/margot2.jpg',
    veterinarianPhone: '(11) 99999-9999',
    veterinarianEmail: 'maria.silva@vetcare.com',
    clinicName: 'Clínica Veterinária PetCare',
    clinicAddress: 'Rua das Flores, 123 - Centro, São Paulo - SP',
    clinicPhone: '(11) 3333-4444',
    date: '2024-01-15',
    time: '14:30',
    status: 'scheduled',
    type: 'Consulta de Rotina',
    notes: 'Check-up anual e vacinação. Pet apresentou comportamento normal durante o exame.',
    price: 120.0,
    emergency: false,
  },
  {
    id: '2',
    petName: 'Luna',
    veterinarianName: 'Dr. João Santos',
    veterinarianPhone: '(11) 88888-8888',
    veterinarianEmail: 'joao.santos@vetcenter.com',
    clinicName: 'VetCenter Especializado',
    clinicAddress: 'Av. Principal, 456 - Jardim América, São Paulo - SP',
    clinicPhone: '(11) 2222-3333',
    date: '2024-01-10',
    time: '09:00',
    status: 'completed',
    type: 'Exame de Sangue',
    notes: 'Exames de rotina solicitados para verificar função hepática e renal.',
    diagnosis: 'Todos os parâmetros dentro da normalidade. Pet saudável.',
    prescription: 'Manter alimentação atual. Retorno em 6 meses.',
    price: 85.5,
    emergency: false,
  },
  {
    id: '3',
    petName: 'Max',
    veterinarianName: 'Dra. Ana Costa',
    veterinarianPhone: '(11) 77777-7777',
    veterinarianEmail: 'ana.costa@emergency.com',
    clinicName: 'Clínica 24h PetEmergency',
    clinicAddress: 'Rua da Emergência, 789 - Vila Nova, São Paulo - SP',
    clinicPhone: '(11) 1111-2222',
    date: '2024-01-08',
    time: '22:15',
    status: 'completed',
    type: 'Atendimento de Emergência',
    notes: 'Pet apresentou dor abdominal aguda e vômitos.',
    diagnosis: 'Gastrite aguda. Provavelmente causada por mudança na alimentação.',
    prescription: 'Antiemético por 3 dias. Dieta leve por 48h. Retorno em 1 semana.',
    price: 250.0,
    emergency: true,
  },
];

export default function AppointmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [appointment, setAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        // Simular delay de API
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const foundAppointment = mockAppointments.find((a) => a.id === appointmentId);
        if (foundAppointment) {
          setAppointment(foundAppointment);
        } else {
          toast.error('Consulta não encontrada');
          router.push('/dashboard/usuario/consultas');
        }
      } catch {
        toast.error('Erro ao carregar consulta');
        router.push('/dashboard/usuario/consultas');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [appointmentId, router]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const formatTime = (time: string) => {
    return time;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const getStatusConfig = (status: Appointment['status']) => {
    switch (status) {
      case 'scheduled':
        return {
          label: 'Agendada',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          icon: Calendar,
        };
      case 'completed':
        return {
          label: 'Concluída',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          icon: CheckCircle,
        };
      case 'cancelled':
        return {
          label: 'Cancelada',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          icon: XCircle,
        };
      case 'pending':
        return {
          label: 'Pendente',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          icon: ClockIcon,
        };
    }
  };

  if (loading) {
    return <PetDataLoading type="appointments" size="lg" inline={true} />;
  }

  if (!appointment) {
    return null;
  }

  const statusConfig = getStatusConfig(appointment.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/usuario/consultas">
            <UIButton variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </UIButton>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Detalhes da Consulta</h1>
            <p className="text-gray-600">Informações completas sobre a consulta</p>
          </div>
        </div>

        <div className="flex space-x-2">
          <UIButton variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </UIButton>
          <UIButton variant="outline" size="sm" className="text-red-600 hover:text-red-700">
            <Trash2 className="mr-2 h-4 w-4" />
            Cancelar
          </UIButton>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Informações principais */}
        <div className="space-y-6 lg:col-span-2">
          {/* Status e informações básicas */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <div
                className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                <StatusIcon className="mr-2 h-4 w-4" />
                {statusConfig.label}
              </div>
              {appointment.emergency && (
                <div className="flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-600">
                  <AlertTriangle className="mr-1 h-4 w-4" />
                  Emergência
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Data</p>
                  <p className="font-medium text-gray-900">{formatDate(appointment.date)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Horário</p>
                  <p className="font-medium text-gray-900">{formatTime(appointment.time)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Stethoscope className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Tipo</p>
                  <p className="font-medium text-gray-900">{appointment.type}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="h-5 w-5 text-gray-400">💰</div>
                <div>
                  <p className="text-sm text-gray-600">Valor</p>
                  <p className="font-medium text-gray-900">{formatPrice(appointment.price)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pet e Veterinário */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Participantes</h2>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Pet */}
              <div className="flex items-start space-x-4">
                <div className="relative">
                  {appointment.petAvatar ? (
                    <Image
                      src={appointment.petAvatar}
                      alt={appointment.petName}
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-full object-cover ring-2 ring-blue-100"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-emerald-100 ring-2 ring-blue-100">
                      <Stethoscope className="h-8 w-8 text-blue-600" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{appointment.petName}</h3>
                  <p className="text-sm text-gray-600">Pet</p>
                </div>
              </div>

              {/* Veterinário */}
              <div className="flex items-start space-x-4">
                <div className="relative">
                  {appointment.veterinarianAvatar ? (
                    <Image
                      src={appointment.veterinarianAvatar}
                      alt={appointment.veterinarianName}
                      width={64}
                      height={64}
                      className="h-16 w-16 rounded-full object-cover ring-2 ring-gray-100"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-blue-100 ring-2 ring-gray-100">
                      <User className="h-8 w-8 text-gray-600" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{appointment.veterinarianName}</h3>
                  <p className="text-sm text-gray-600">Veterinário</p>
                </div>
              </div>
            </div>
          </div>

          {/* Clínica */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Local da Consulta</h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900">{appointment.clinicName}</h3>
                <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>{appointment.clinicAddress}</span>
                </div>
                {appointment.clinicPhone && (
                  <div className="mt-1 flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{appointment.clinicPhone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Observações */}
          {appointment.notes && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Observações</h2>
              <p className="text-gray-700">{appointment.notes}</p>
            </div>
          )}

          {/* Diagnóstico (apenas para consultas concluídas) */}
          {appointment.status === 'completed' && appointment.diagnosis && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Diagnóstico</h2>
              <p className="text-gray-700">{appointment.diagnosis}</p>
            </div>
          )}

          {/* Prescrição (apenas para consultas concluídas) */}
          {appointment.status === 'completed' && appointment.prescription && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Prescrição</h2>
              <p className="text-gray-700">{appointment.prescription}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contato do Veterinário */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Contato do Veterinário</h2>

            <div className="space-y-3">
              {appointment.veterinarianPhone && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{appointment.veterinarianPhone}</span>
                </div>
              )}

              {appointment.veterinarianEmail && (
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{appointment.veterinarianEmail}</span>
                </div>
              )}
            </div>
          </div>

          {/* Próxima Consulta */}
          {appointment.nextAppointment && (
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Próxima Consulta</h2>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{formatDate(appointment.nextAppointment)}</p>
                  <p className="text-sm text-gray-600">Retorno agendado</p>
                </div>
              </div>
            </div>
          )}

          {/* Ações Rápidas */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Ações</h2>

            <div className="space-y-3">
              <UIButton className="w-full justify-center">
                <Phone className="mr-2 h-4 w-4" />
                Ligar para Clínica
              </UIButton>

              <UIButton variant="outline" className="w-full justify-center">
                <Mail className="mr-2 h-4 w-4" />
                Enviar Mensagem
              </UIButton>

              {appointment.status === 'scheduled' && (
                <UIButton variant="outline" className="w-full justify-center">
                  <Edit className="mr-2 h-4 w-4" />
                  Reagendar
                </UIButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
