'use client';

import WorkLocationCard from '@/components/dashboard/work-locations/work-location-card';
import WorkLocationFilters, { WorkLocationFilters as Filters } from '@/components/dashboard/work-locations/work-location-filters';
import WorkLocationForm from '@/components/dashboard/work-locations/work-location-form';
import WorkLocationStats from '@/components/dashboard/work-locations/work-location-stats';
import UIButton from '@/components/ui/button';
import { deleteWorkLocation, getWorkLocations } from '@/lib/api/vet-work-locations';
import { VeterinarianWorkLocation } from '@/lib/types/api';
import { MapPin, Plus } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function LocaisPage() {
  const [workLocations, setWorkLocations] = useState<VeterinarianWorkLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState<VeterinarianWorkLocation | null>(null);
  const [filters, setFilters] = useState<Filters>({
    active: true,
    orderBy: 'name',
    orderDirection: 'asc'
  });

  const loadWorkLocations = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getWorkLocations(filters);
      if (result.success && result.workLocations) {
        setWorkLocations(result.workLocations);
      } else {
        toast.error(result.error || 'Erro ao carregar locais de trabalho');
      }
    } catch {
      toast.error('Erro ao carregar locais de trabalho');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadWorkLocations();
  }, [loadWorkLocations]);

  const handleMessage = useCallback((newMessage: { type: 'success' | 'error'; text: string }) => {
    if (newMessage.type === 'success') {
      toast.success(newMessage.text);
    } else {
      toast.error(newMessage.text);
    }
  }, []);

  const handleEdit = (location: VeterinarianWorkLocation) => {
    setEditingLocation(location);
    setShowForm(true);
  };

  const handleDelete = async (locationId: number) => {
    if (!confirm('Tem certeza que deseja excluir este local de trabalho?')) {
      return;
    }

    try {
      const result = await deleteWorkLocation(locationId);
      if (result.success) {
        toast.success('Local de trabalho excluído com sucesso');
        loadWorkLocations();
      } else {
        toast.error(result.error || 'Erro ao excluir local de trabalho');
      }
    } catch {
      toast.error('Erro ao excluir local de trabalho');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingLocation(null);
    loadWorkLocations();
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingLocation(null);
  };

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      active: true,
      orderBy: 'name',
      orderDirection: 'asc'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Locais de Atendimento1</h1>
          <p className="text-gray-600">Gerencie os locais onde você atende seus pacientes.</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Carregando locais...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Locais de Atendimento2</h1>
          <p className="text-gray-600">Gerencie os locais onde você atende seus pacientes.</p>
        </div>
        <UIButton
          onClick={() => setShowForm(true)}
          variant="solid"
          size="md"
          className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Local
        </UIButton>
      </div>

      {workLocations.length > 0 && (
        <WorkLocationStats locations={workLocations} />
      )}

      <WorkLocationFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      {showForm && (
        <WorkLocationForm
          location={editingLocation}
          onSuccess={handleFormSuccess}
          onCancel={handleCancelForm}
          onMessage={handleMessage}
        />
      )}

      {workLocations.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <MapPin className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum local cadastrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            Comece adicionando seu primeiro local de atendimento.
          </p>
          <div className="mt-6">
            <UIButton
              onClick={() => setShowForm(true)}
              variant="solid"
              size="md"
              className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Local
            </UIButton>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {workLocations.map((location) => (
            <WorkLocationCard
              key={location.id}
              location={location}
              onEdit={() => handleEdit(location)}
              onDelete={() => handleDelete(location.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
} 