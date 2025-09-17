'use client';

import HookFormField from '@/components/form/hook-form-field';
import Select from '@/components/form/select';
import UIButton from '@/components/ui/button';
import { useStates } from '@/hooks/use-states';
import { getCities } from '@/lib/api/resources';
import { createWorkLocation, updateWorkLocation } from '@/lib/api/vet-work-locations';
import { City, VeterinarianWorkLocation, WorkSchedule } from '@/lib/types/api';
import { Building2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import WorkScheduleForm from './work-schedule-form';
import { cleanFormattedValue } from '@/utils/cn';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

interface WorkLocationFormProps {
  location?: VeterinarianWorkLocation | null;
  onSuccess: () => void;
  onCancel: () => void;
  onMessage?: (message: { type: 'success' | 'error'; text: string }) => void;
}

const workLocationSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  address: z.string().min(1, 'Endereço é obrigatório'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
  zipCode: z.string().min(8, 'CEP deve ter pelo menos 8 dígitos'),
  latitude: z.string().optional().refine(
    (val) => !val || val.trim() === '' || (!isNaN(Number(val)) && Number(val) >= -90 && Number(val) <= 90), 
    { message: 'Latitude deve ser um número válido entre -90 e 90' }
  ),
  longitude: z.string().optional().refine(
    (val) => !val || val.trim() === '' || (!isNaN(Number(val)) && Number(val) >= -180 && Number(val) <= 180), 
    { message: 'Longitude deve ser um número válido entre -180 e 180' }
  ),
});

type WorkLocationFormData = z.infer<typeof workLocationSchema>;

export default function WorkLocationForm({ 
  location, 
  onSuccess, 
  onCancel, 
  onMessage 
}: WorkLocationFormProps) {
  const [loading, setLoading] = useState(false);
  const [stateId, setStateId] = useState(location?.stateId || 0);
  const [cityId, setCityId] = useState(location?.cityId || 0);
  const [workSchedule, setWorkSchedule] = useState<WorkSchedule[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<WorkLocationFormData>({
    resolver: zodResolver(workLocationSchema),
    mode: 'onChange',
    defaultValues: {
      name: location?.name || '',
      address: location?.address || '',
      number: location?.number || '',
      complement: location?.complement || '',
      neighborhood: location?.neighborhood || '',
      zipCode: location?.zipCode || '',
      latitude: location?.latitude?.toString() || '',
      longitude: location?.longitude?.toString() || '',
    },
  });

  const states = useStates();
  const [cities, setCities] = useState<City[]>([]);

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
    if (stateId > 0) {
      loadCities(stateId);
    }
  }, [stateId]);

  const handleStateChange = (value: number) => {
    setStateId(value);
    setCityId(0);
  };

  const onSubmit = async (data: WorkLocationFormData) => {
    // Validar se estado e cidade foram selecionados
    if (!stateId || stateId === 0) {
      onMessage?.({ type: 'error', text: 'Por favor, selecione um estado' });
      return;
    }
    
    if (!cityId || cityId === 0) {
      onMessage?.({ type: 'error', text: 'Por favor, selecione uma cidade' });
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        name: data.name,
        address: data.address,
        number: data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        stateId,
        cityId,
        zipCode: cleanFormattedValue(data.zipCode),
        // Só incluir latitude/longitude se foram preenchidos e são válidos
        ...(data.latitude && data.latitude.trim() !== '' && !isNaN(Number(data.latitude)) && { latitude: Number(data.latitude) }),
        ...(data.longitude && data.longitude.trim() !== '' && !isNaN(Number(data.longitude)) && { longitude: Number(data.longitude) })
      };

      if (location) {
        const result = await updateWorkLocation(location.id, submitData);
        if (result.success) {
          onMessage?.({ type: 'success', text: 'Local de trabalho atualizado com sucesso' });
          onSuccess();
        } else {
          onMessage?.({ type: 'error', text: result.error || 'Erro ao atualizar local de trabalho' });
        }
      } else {
        const result = await createWorkLocation(submitData);
        if (result.success) {
          onMessage?.({ type: 'success', text: 'Local de trabalho criado com sucesso' });
          onSuccess();
        } else {
          onMessage?.({ type: 'error', text: result.error || 'Erro ao criar local de trabalho' });
        }
      }
    } catch {
      onMessage?.({ type: 'error', text: 'Erro inesperado ao salvar local de trabalho' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Building2 className="mr-2 h-5 w-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900">
            {location ? 'Editar Local de Trabalho' : 'Novo Local de Trabalho'}
          </h2>
        </div>
        <UIButton
          onClick={onCancel}
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-gray-700">
          <X className="h-4 w-4" />
        </UIButton>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <HookFormField
            name="name"
            type="text"
            label="Nome do Local"
            placeholder="Ex: Clínica Veterinária Central"
            control={control}
            error={errors.name?.message}
            required
            disabled={loading}
          />

          <div className="space-y-4">
            <Select
              name="state"
              label="Estado"
              value={stateId.toString()}
              onChange={(value) => handleStateChange(Number(value))}
              options={states.map(state => ({
                value: state.id.toString(),
                label: state.name
              }))}
              placeholder="Selecione o estado"
              required
            />

            <Select
              name="city"
              label="Cidade"
              value={cityId.toString()}
              onChange={(value) => setCityId(Number(value))}
              options={cities.map(city => ({
                value: city.id.toString(),
                label: city.name
              }))}
              placeholder="Selecione a cidade"
              required
              disabled={!stateId}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <HookFormField
            name="address"
            type="text"
            label="Endereço"
            placeholder="Ex: Rua das Flores"
            control={control}
            error={errors.address?.message}
            required
            disabled={loading}
          />

          <HookFormField
            name="number"
            type="text"
            label="Número"
            placeholder="Ex: 123"
            control={control}
            error={errors.number?.message}
            required
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <HookFormField
            name="complement"
            type="text"
            label="Complemento"
            placeholder="Ex: Sala 101, Apto 2"
            control={control}
            error={errors.complement?.message}
            disabled={loading}
          />

          <HookFormField
            name="neighborhood"
            type="text"
            label="Bairro"
            placeholder="Ex: Centro"
            control={control}
            error={errors.neighborhood?.message}
            required
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <HookFormField
            name="zipCode"
            type="text"
            label="CEP"
            placeholder="Ex: 12345-678"
            control={control}
            error={errors.zipCode?.message}
            required
            disabled={loading}
            mask="cep"
          />
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-md font-medium text-gray-900 mb-4">Coordenadas Geográficas (Opcional)</h3>
          <p className="text-sm text-gray-600 mb-4">
            As coordenadas ajudam a localizar seu estabelecimento com maior precisão nos mapas.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <HookFormField
              name="latitude"
              type="text"
              label="Latitude"
              placeholder="Ex: -23.5505"
              control={control}
              error={errors.latitude?.message}
              disabled={loading}
            />

            <HookFormField
              name="longitude"
              type="text"
              label="Longitude"
              placeholder="Ex: -46.6333"
              control={control}
              error={errors.longitude?.message}
              disabled={loading}
            />
          </div>
        </div>

        {location && (
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-md font-medium text-gray-900 mb-4">Horários de Trabalho</h3>
            <WorkScheduleForm
              locationId={location.id}
              schedule={workSchedule}
              onChange={setWorkSchedule}
            />
          </div>
        )}

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <UIButton
            type="button"
            onClick={onCancel}
            variant="outline"
            size="md">
            Cancelar
          </UIButton>
          <UIButton
            type="submit"
            variant="solid"
            size="md"
            disabled={!isValid || loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400">
            {loading ? 'Salvando...' : (location ? 'Atualizar' : 'Criar')}
          </UIButton>
        </div>
      </form>
    </div>
  );
} 