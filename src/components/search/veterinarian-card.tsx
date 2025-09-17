import { VeterinarianSearchResult } from '@/lib/types/api';
import {
    AlertTriangle,
    Calendar,
    Clock,
    ExternalLink,
    Home,
    MapPin,
    Shield,
    Star,
    Users
} from 'lucide-react';

interface VeterinarianCardProps {
  veterinarian: VeterinarianSearchResult;
}

export default function VeterinarianCard({ veterinarian }: VeterinarianCardProps) {
  // Extrair primeiro e último nome do nome completo
  const nameParts = veterinarian.name?.split(' ') || [];
  const firstName = nameParts[0] || '';
  const lastName = nameParts[nameParts.length - 1] || '';
  const fullName = `Dr. ${veterinarian.name}`;
  
  // Mapear campos do backend para os esperados pelo componente
  const providesEmergencyService = veterinarian.emergencial || veterinarian.providesEmergencyService || false;
  const providesHomeService = veterinarian.domiciliary || veterinarian.providesHomeService || false;
  const workLocationsCount = parseInt(veterinarian.workLocationsCount || '1') || 1;
  const isCurrentlyAttending = veterinarian.isCurrentlyAttending || false;

  // Gerar iniciais do nome
  const getInitials = () => {
    if (firstName && lastName && firstName !== lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`;
    } else if (firstName) {
      const parts = veterinarian.name?.split(' ') || [];
      if (parts.length >= 2) {
        return `${parts[0].charAt(0)}${parts[1].charAt(0)}`;
      }
      return firstName.charAt(0);
    }
    return 'V';
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:border-blue-300">
      {/* Status Badge */}
      {isCurrentlyAttending && (
        <div className="absolute right-3 top-3 z-10">
          <div className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            Atendendo
          </div>
        </div>
      )}

      {/* Header with Avatar */}
      <div className="relative bg-gradient-to-br from-blue-50 to-emerald-50 p-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="relative h-16 w-16 flex-shrink-0">
            {veterinarian.avatar ? (
              <img
                src={veterinarian.avatar}
                alt={fullName}
                className="h-full w-full rounded-xl object-cover"
              />
            ) : (
              <div className="h-full w-full rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white text-lg font-bold">
                {getInitials()}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600">
              {fullName}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
              <Shield className="h-3 w-3" />
              <span className="font-medium">CRMV {veterinarian.crmv}</span>
            </div>
            
            {/* Work Locations Count */}
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
              <MapPin className="h-3 w-3" />
              <span>{workLocationsCount} local{workLocationsCount !== 1 ? 'es' : ''} de atendimento</span>
            </div>

            {/* Address if available */}
            {veterinarian.address && (
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{veterinarian.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Bio */}
        {veterinarian.bio && (
          <p className="mb-3 line-clamp-2 text-xs text-gray-600 leading-relaxed">
            {veterinarian.bio}
          </p>
        )}

        {/* Services */}
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {providesHomeService && (
              <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                <Home className="h-3 w-3" />
                Atende em domicílio
              </div>
            )}
            
            {providesEmergencyService && (
              <div className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                <AlertTriangle className="h-3 w-3" />
                Emergência 24h
              </div>
            )}

            {veterinarian.website && (
              <div className="flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                <ExternalLink className="h-3 w-3" />
                Website
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-3 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-2">
            <Calendar className="h-3 w-3 text-blue-600" />
            <div>
              <div className="text-xs text-gray-500">Disponível</div>
              <div className="text-xs font-medium text-gray-900">
                {isCurrentlyAttending ? 'Agora' : 'Agende'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 p-2">
            <Users className="h-3 w-3 text-emerald-600" />
            <div>
              <div className="text-xs text-gray-500">Locais</div>
              <div className="text-xs font-medium text-gray-900">{workLocationsCount}</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Ver perfil completo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              <div className="h-5 w-5 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center">
                <Star className="h-2.5 w-2.5 text-blue-600" />
              </div>
              <div className="h-5 w-5 rounded-full bg-emerald-100 border-2 border-white flex items-center justify-center">
                <Clock className="h-2.5 w-2.5 text-emerald-600" />
              </div>
            </div>
            <ExternalLink className="h-3 w-3 text-gray-400 transition-colors group-hover:text-blue-600" />
          </div>
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-emerald-500/0 transition-all duration-300 group-hover:from-blue-500/5 group-hover:to-emerald-500/5 pointer-events-none"></div>
    </div>
  );
}
