'use client';

import Select from '@/components/form/select';
import UIButton from '@/components/ui/button';
import { useStates } from '@/hooks/use-states';
import { getCities } from '@/lib/api/resources';
import { City } from '@/lib/types/api';
import { Filter, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface WorkLocationFilters {
  stateId?: number;
  cityId?: number;
  active?: boolean;
  orderBy?: 'name' | 'createdAt' | 'updatedAt';
  orderDirection?: 'asc' | 'desc';
}

interface WorkLocationFiltersProps {
  filters: WorkLocationFilters;
  onFiltersChange: (filters: WorkLocationFilters) => void;
  onClearFilters: () => void;
}

export default function WorkLocationFilters({ 
  filters, 
  onFiltersChange, 
  onClearFilters 
}: WorkLocationFiltersProps) {
  const [cities, setCities] = useState<City[]>([]);
  const states = useStates();

  const loadCities = async (stateId: number) => {
    if (stateId === 0) {
      setCities([]);
      return;
    }
    
    try {
      const result = await getCities(stateId);
      if (result.success && result.cities) {
        setCities(result.cities);
      }
    } catch (error) {
      console.error('Erro ao carregar cidades:', error);
    }
  };

  useEffect(() => {
    if (filters.stateId && filters.stateId > 0) {
      loadCities(filters.stateId);
    }
  }, [filters.stateId]);

  const handleFilterChange = (key: keyof WorkLocationFilters, value: string | number | boolean) => {
    onFiltersChange({
      ...filters,
      [key]: value,
      ...(key === 'stateId' ? { cityId: undefined } : {})
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Filter className="mr-2 h-4 w-4 text-gray-500" />
          <h3 className="text-sm font-medium text-gray-900">Filtros</h3>
        </div>
        {hasActiveFilters && (
          <UIButton
            onClick={onClearFilters}
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-gray-700">
            <X className="mr-1 h-3 w-3" />
            Limpar
          </UIButton>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select
          name="state"
          label="Estado"
          value={filters.stateId?.toString() || ''}
          onChange={(value) => handleFilterChange('stateId', Number(value))}
          options={[
            { value: '', label: 'Todos os estados' },
            ...states.map(state => ({
              value: state.id.toString(),
              label: state.name
            }))
          ]}
          placeholder="Selecione o estado"
        />

        <Select
          name="city"
          label="Cidade"
          value={filters.cityId?.toString() || ''}
          onChange={(value) => handleFilterChange('cityId', Number(value))}
          options={[
            { value: '', label: 'Todas as cidades' },
            ...cities.map(city => ({
              value: city.id.toString(),
              label: city.name
            }))
          ]}
          placeholder="Selecione a cidade"
          disabled={!filters.stateId || filters.stateId === 0}
        />

        <Select
          name="status"
          label="Status"
          value={filters.active?.toString() || ''}
          onChange={(value) => handleFilterChange('active', value === 'true')}
          options={[
            { value: '', label: 'Todos os status' },
            { value: 'true', label: 'Ativo' },
            { value: 'false', label: 'Inativo' }
          ]}
          placeholder="Selecione o status"
        />

        <Select
          name="orderBy"
          label="Ordenar por"
          value={`${filters.orderBy || 'name'}-${filters.orderDirection || 'asc'}`}
          onChange={(value) => {
            const [orderBy, orderDirection] = value.split('-');
            handleFilterChange('orderBy', orderBy as 'name' | 'createdAt' | 'updatedAt');
            handleFilterChange('orderDirection', orderDirection as 'asc' | 'desc');
          }}
          options={[
            { value: 'name-asc', label: 'Nome (A-Z)' },
            { value: 'name-desc', label: 'Nome (Z-A)' },
            { value: 'createdAt-desc', label: 'Mais recentes' },
            { value: 'createdAt-asc', label: 'Mais antigos' },
            { value: 'updatedAt-desc', label: 'Última atualização' }
          ]}
          placeholder="Ordenar por"
        />
      </div>
    </div>
  );
} 