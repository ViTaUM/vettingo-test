import SpotlightCard from '@/components/ui/spotlight-card';
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
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Appointment {
  id: string;
  petName: string;
  petAvatar?: string;
  veterinarianName: string;
  veterinarianAvatar?: string;
  clinicName: string;
  clinicAddress: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending';
  type: string;
  notes?: string;
  price: number;
  emergency: boolean;
}

interface AppointmentCardProps {
  appointment: Appointment;
  viewMode: 'grid' | 'list';
}

export default function AppointmentCard({ appointment, viewMode }: AppointmentCardProps) {
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

  const statusConfig = getStatusConfig(appointment.status);
  const StatusIcon = statusConfig.icon;

  if (viewMode === 'list') {
    return (
      <Link href={`/dashboard/usuario/consultas/${appointment.id}`} className="block">
        <SpotlightCard
          className="group relative rounded-lg border border-gray-200 bg-white p-4 transition-all duration-300 hover:shadow-md"
          spotlightColor="blue">
          <div className="flex items-center space-x-4">
            {/* Status Badge */}
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full ${statusConfig.bgColor} ${statusConfig.borderColor} border`}>
              <StatusIcon className={`h-6 w-6 ${statusConfig.color}`} />
            </div>

            {/* Pet Info */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                {appointment.petAvatar ? (
                  <Image
                    src={appointment.petAvatar}
                    alt={appointment.petName}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-100"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-emerald-100 ring-2 ring-blue-100">
                    <Stethoscope className="h-5 w-5 text-blue-600" />
                  </div>
                )}
                {appointment.emergency && (
                  <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500">
                    <AlertTriangle className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{appointment.petName}</h3>
                <p className="text-sm text-gray-600">{appointment.type}</p>
              </div>
            </div>

            {/* Veterinarian Info */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                {appointment.veterinarianAvatar ? (
                  <Image
                    src={appointment.veterinarianAvatar}
                    alt={appointment.veterinarianName}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-100"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-blue-100 ring-2 ring-gray-100">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{appointment.veterinarianName}</h4>
                <p className="text-sm text-gray-600">{appointment.clinicName}</p>
              </div>
            </div>

            {/* Date and Time */}
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="mr-1 h-4 w-4" />
                  {formatDate(appointment.date)}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="mr-1 h-4 w-4" />
                  {formatTime(appointment.time)}
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="ml-auto text-right">
              <div className="font-semibold text-gray-900">{formatPrice(appointment.price)}</div>
              <div className="text-sm text-gray-500">{statusConfig.label}</div>
            </div>
          </div>
        </SpotlightCard>
      </Link>
    );
  }

  // Grid view (default)
  return (
    <Link href={`/dashboard/usuario/consultas/${appointment.id}`} className="block">
      <SpotlightCard
        className="group relative rounded-lg border border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-md"
        spotlightColor="blue">
        {/* Header com status e emergência */}
        <div className="mb-4 flex items-start justify-between">
          <div
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
            <StatusIcon className="mr-1 h-3 w-3" />
            {statusConfig.label}
          </div>
          {appointment.emergency && (
            <div className="flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-600">
              <AlertTriangle className="mr-1 h-3 w-3" />
              Emergência
            </div>
          )}
        </div>

        {/* Pet e Veterinário */}
        <div className="mb-4 flex items-start space-x-4">
          {/* Pet */}
          <div className="relative">
            {appointment.petAvatar ? (
              <Image
                src={appointment.petAvatar}
                alt={appointment.petName}
                width={48}
                height={48}
                className="h-12 w-12 rounded-full object-cover ring-2 ring-blue-100"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-emerald-100 ring-2 ring-blue-100">
                <Stethoscope className="h-6 w-6 text-blue-600" />
              </div>
            )}
          </div>

          {/* Veterinário */}
          <div className="relative">
            {appointment.veterinarianAvatar ? (
              <Image
                src={appointment.veterinarianAvatar}
                alt={appointment.veterinarianName}
                width={48}
                height={48}
                className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-100"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-blue-100 ring-2 ring-gray-100">
                <User className="h-6 w-6 text-gray-600" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-bold text-gray-900">{appointment.petName}</h3>
            <p className="text-sm text-gray-600">{appointment.type}</p>
            <p className="text-xs text-gray-500">{appointment.veterinarianName}</p>
          </div>
        </div>

        {/* Informações detalhadas */}
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <Calendar className="mr-2 h-4 w-4 text-gray-400" />
            <span className="text-gray-600">Data:</span>
            <span className="ml-auto font-medium text-gray-900">{formatDate(appointment.date)}</span>
          </div>

          <div className="flex items-center text-sm">
            <Clock className="mr-2 h-4 w-4 text-gray-400" />
            <span className="text-gray-600">Horário:</span>
            <span className="ml-auto font-medium text-gray-900">{formatTime(appointment.time)}</span>
          </div>

          <div className="flex items-center text-sm">
            <MapPin className="mr-2 h-4 w-4 text-gray-400" />
            <span className="text-gray-600">Clínica:</span>
            <span className="ml-auto truncate font-medium text-gray-900">{appointment.clinicName}</span>
          </div>

          {appointment.notes && (
            <div className="border-t border-gray-100 pt-2">
              <p className="line-clamp-2 text-xs text-gray-600">{appointment.notes}</p>
            </div>
          )}

          <div className="border-t border-gray-100 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Valor:</span>
              <span className="font-bold text-gray-900">{formatPrice(appointment.price)}</span>
            </div>
          </div>
        </div>
      </SpotlightCard>
    </Link>
  );
}
