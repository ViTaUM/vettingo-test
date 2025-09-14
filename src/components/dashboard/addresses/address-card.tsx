import SpotlightCard from '@/components/ui/spotlight-card';
import { UserAddress } from '@/lib/types/api';
import { MapPin, Home, Building, CreditCard, Edit, Trash2, Star, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

interface AddressCardProps {
  address: UserAddress;
  viewMode: 'grid' | 'list';
}

export default function AddressCard({ address, viewMode }: AddressCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'personal':
        return Home;
      case 'work':
        return Building;
      case 'billing':
        return CreditCard;
      default:
        return MapPin;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'personal':
        return 'Pessoal';
      case 'work':
        return 'Trabalho';
      case 'billing':
        return 'Cobrança';
      default:
        return 'Outro';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'personal':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'work':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'billing':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const TypeIcon = getTypeIcon(address.type);
  const typeColor = getTypeColor(address.type);

  if (viewMode === 'list') {
    return (
      <Link href={`/dashboard/usuario/enderecos/${address.id}`} className="block">
        <SpotlightCard
          className="group relative rounded-lg border border-gray-200 bg-white p-4 transition-all duration-300 hover:shadow-md"
          spotlightColor="blue">
          <div className="flex items-center space-x-4">
            {/* Tipo e Status */}
            <div className="flex items-center space-x-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-full border ${typeColor}`}>
                <TypeIcon className="h-6 w-6" />
              </div>
              <div className="flex items-center space-x-2">
                {address.isActive ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </div>
            </div>

            {/* Informações do Endereço */}
            <div className="flex-1">
              <div className="mb-1 flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900">{address.label || getTypeLabel(address.type)}</h3>
                {address.isPrimary && (
                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                    <Star className="mr-1 h-3 w-3" />
                    Principal
                  </span>
                )}
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${typeColor}`}>
                  {getTypeLabel(address.type)}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {address.street}, {address.number}
                {address.complement && ` - ${address.complement}`}
              </p>
              <p className="text-sm text-gray-600">
                {address.neighborhood} - CEP: {address.zipCode}
              </p>
            </div>

            {/* Data de Criação */}
            <div className="text-right">
              <p className="text-xs text-gray-500">Criado em</p>
              <p className="text-sm font-medium text-gray-900">{formatDate(address.createdAt)}</p>
            </div>

            {/* Ações */}
            <div className="flex items-center space-x-1">
              <button className="p-1 text-gray-400 transition-colors hover:text-gray-600">
                <Edit className="h-4 w-4" />
              </button>
              <button className="p-1 text-gray-400 transition-colors hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </SpotlightCard>
      </Link>
    );
  }

  // Grid view (default)
  return (
    <Link href={`/dashboard/usuario/enderecos/${address.id}`} className="block">
      <SpotlightCard
        className="group relative rounded-lg border border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-md"
        spotlightColor="blue">
        {/* Header com tipo e status */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full border ${typeColor}`}>
              <TypeIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{address.label || getTypeLabel(address.type)}</h3>
              <p className="text-sm text-gray-600">{getTypeLabel(address.type)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {address.isPrimary && (
              <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                <Star className="mr-1 h-3 w-3" />
                Principal
              </span>
            )}
            <div className="flex items-center">
              {address.isActive ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
          </div>
        </div>

        {/* Endereço Completo */}
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <MapPin className="mt-0.5 h-4 w-4 text-gray-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {address.street}, {address.number}
              </p>
              {address.complement && <p className="text-sm text-gray-600">{address.complement}</p>}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 text-gray-400">🏘️</div>
            <span className="text-sm text-gray-600">{address.neighborhood}</span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 text-gray-400">📮</div>
            <span className="text-sm text-gray-600">CEP: {address.zipCode}</span>
          </div>
        </div>

        {/* Footer com data e ações */}
        <div className="mt-4 border-t border-gray-100 pt-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Criado em</p>
              <p className="text-sm font-medium text-gray-900">{formatDate(address.createdAt)}</p>
            </div>

            <div className="flex items-center space-x-1">
              <button className="p-1 text-gray-400 transition-colors hover:text-gray-600">
                <Edit className="h-4 w-4" />
              </button>
              <button className="p-1 text-gray-400 transition-colors hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </SpotlightCard>
    </Link>
  );
}
