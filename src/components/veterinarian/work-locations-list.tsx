'use client';

import { VeterinarianWorkLocation } from '@/lib/types/api';
import { Building, Calendar, ChevronDown, ChevronUp, Filter, MapPin } from 'lucide-react';
import { useState } from 'react';

interface WorkLocationsListProps {
  locations: VeterinarianWorkLocation[];
  loading: boolean;
  error: string | null;
  onFiltersChange: (filters: {
    active?: boolean;
    orderBy?: 'name' | 'createdAt' | 'updatedAt';
    orderDirection?: 'asc' | 'desc';
  }) => void;
}

export default function WorkLocationsList({ locations, loading, error, onFiltersChange }: WorkLocationsListProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    active: true,
    orderBy: 'name' as 'name' | 'createdAt' | 'updatedAt',
    orderDirection: 'asc' as 'asc' | 'desc',
  });

  const handleFilterChange = (key: string, value: boolean | string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatZipCode = (zipCode: string) => {
    return zipCode.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
          <Building className="h-6 w-6 text-gray-400" />
        </div>
        <p className="text-sm text-gray-600">Carregando locais de trabalho...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
          <MapPin className="h-6 w-6 text-red-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar</h3>
        <p className="text-gray-600 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Filters */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Locais de Trabalho ({locations.length})
          </h3>
          <p className="text-sm text-gray-600">
            {locations.length === 0 ? 'Nenhum local encontrado' : `${locations.length} local${locations.length !== 1 ? 'es' : ''} de atendimento`}
          </p>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <Filter className="h-4 w-4" />
          Filtros
          {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.active.toString()}
                onChange={(e) => handleFilterChange('active', e.target.value === 'true')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="true">Ativos</option>
                <option value="false">Inativos</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Ordenar por
              </label>
              <select
                value={filters.orderBy}
                onChange={(e) => handleFilterChange('orderBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="name">Nome</option>
                <option value="createdAt">Data de criação</option>
                <option value="updatedAt">Data de atualização</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Direção
              </label>
              <select
                value={filters.orderDirection}
                onChange={(e) => handleFilterChange('orderDirection', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="asc">Crescente</option>
                <option value="desc">Decrescente</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Locations List */}
      {locations.length === 0 ? (
        <div className="text-center py-8">
          <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Building className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum local de trabalho</h3>
          <p className="text-gray-600 text-sm">Este veterinário ainda não cadastrou locais de trabalho.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {locations.map((location) => (
            <div key={location.id} className="bg-white rounded-xl border border-gray-200 p-4">
              {/* Location Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Building className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{location.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        location.isActive 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {location.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  {formatDate(location.createdAt.toString())}
                </div>
              </div>

              {/* Location Details */}
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <p>
                      {location.address}, {location.number}
                      {location.complement && ` - ${location.complement}`}
                    </p>
                    <p>{location.neighborhood}</p>
                    <p className="text-gray-600">CEP: {formatZipCode(location.zipCode)}</p>
                  </div>
                </div>

                {/* Coordinates (if available) */}
                {location.latitude && location.longitude && (
                  <div className="text-xs text-gray-500">
                    Coordenadas: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 