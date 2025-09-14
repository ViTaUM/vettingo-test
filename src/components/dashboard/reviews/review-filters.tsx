'use client';

import HookFormField from '@/components/form/hook-form-field';
import HookFormSelect from '@/components/form/hook-form-select';
import { Button } from '@/components/ui/button';
import { VetReviewFilters } from '@/lib/api/vet-reviews';
import { Option } from '@/types/option';
import { Filter, X } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface ReviewFiltersProps {
  filters: VetReviewFilters;
  onFiltersChange: (filters: VetReviewFilters) => void;
  onClearFilters: () => void;
}

const ReviewFilters = ({ filters, onFiltersChange, onClearFilters }: ReviewFiltersProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      search: filters.search || '',
      rating: filters.rating?.toString() || '',
      minRating: filters.minRating?.toString() || '',
      anonymous: filters.anonymous?.toString() || '',
      orderBy: filters.orderBy || 'createdAt',
      orderDirection: filters.orderDirection || 'desc',
    },
  });

  const ratingOptions: Option[] = [
    { value: '', label: 'Todos os ratings' },
    { value: '5', label: '5 estrelas' },
    { value: '4', label: '4 estrelas' },
    { value: '3', label: '3 estrelas' },
    { value: '2', label: '2 estrelas' },
    { value: '1', label: '1 estrela' },
  ];

  const minRatingOptions: Option[] = [
    { value: '', label: 'Qualquer rating' },
    { value: '5', label: '5+ estrelas' },
    { value: '4', label: '4+ estrelas' },
    { value: '3', label: '3+ estrelas' },
    { value: '2', label: '2+ estrelas' },
    { value: '1', label: '1+ estrela' },
  ];

  const anonymousOptions: Option[] = [
    { value: '', label: 'Todas as reviews' },
    { value: 'true', label: 'Apenas anônimas' },
    { value: 'false', label: 'Apenas identificadas' },
  ];

  const orderByOptions: Option[] = [
    { value: 'createdAt', label: 'Data de criação' },
    { value: 'rating', label: 'Rating' },
    { value: 'authorName', label: 'Nome do autor' },
  ];

  const orderDirectionOptions: Option[] = [
    { value: 'desc', label: 'Mais recentes primeiro' },
    { value: 'asc', label: 'Mais antigas primeiro' },
  ];

  const onSubmit = (data: {
    search: string;
    rating: string;
    minRating: string;
    anonymous: string;
    orderBy: 'rating' | 'createdAt' | 'authorName';
    orderDirection: 'asc' | 'desc';
  }) => {
    const newFilters: VetReviewFilters = {
      ...filters,
      search: data.search || undefined,
      rating: data.rating ? parseInt(data.rating) : undefined,
      minRating: data.minRating ? parseInt(data.minRating) : undefined,
      anonymous: data.anonymous ? data.anonymous === 'true' : undefined,
      orderBy: data.orderBy,
      orderDirection: data.orderDirection,
      page: 1, // Reset para primeira página ao filtrar
    };

    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    reset();
    onClearFilters();
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value !== undefined && value !== '' && value !== 1 && value !== 'desc'
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="text-gray-600 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            Limpar Filtros
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <HookFormField
            label="Buscar no comentário"
            name="search"
            type="text"
            control={control}
            placeholder="Digite para buscar..."
          />

          <HookFormSelect
            label="Rating específico"
            name="rating"
            control={control}
            options={ratingOptions}
            placeholder="Selecione um rating"
          />

          <HookFormSelect
            label="Rating mínimo"
            name="minRating"
            control={control}
            options={minRatingOptions}
            placeholder="Selecione um rating mínimo"
          />

          <HookFormSelect
            label="Tipo de review"
            name="anonymous"
            control={control}
            options={anonymousOptions}
            placeholder="Selecione o tipo"
          />

          <HookFormSelect
            label="Ordenar por"
            name="orderBy"
            control={control}
            options={orderByOptions}
            placeholder="Selecione o campo"
          />

          <HookFormSelect
            label="Direção da ordenação"
            name="orderDirection"
            control={control}
            options={orderDirectionOptions}
            placeholder="Selecione a direção"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleClearFilters}
            disabled={!hasActiveFilters}
          >
            Limpar
          </Button>
          <Button
            type="submit"
            variant="solid"
            disabled={!isDirty}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Aplicar Filtros
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReviewFilters; 