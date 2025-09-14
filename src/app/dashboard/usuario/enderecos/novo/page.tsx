'use client';

import HookFormCheckbox from '@/components/form/hook-form-checkbox';
import HookFormField from '@/components/form/hook-form-field';
import HookFormSelect from '@/components/form/hook-form-select';
import { Button } from '@/components/ui/button';
import { useCities } from '@/hooks/use-cities';
import { useStates } from '@/hooks/use-states';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, MapPin, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const addressFormSchema = z.object({
  type: z.string().min(1, 'Tipo de endereço é obrigatório'),
  label: z.string().optional(),
  street: z.string().min(1, 'Rua é obrigatória'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
  zipCode: z.string().min(1, 'CEP é obrigatório'),
  cityId: z.string().min(1, 'Cidade é obrigatória'),
  stateId: z.string().min(1, 'Estado é obrigatória'),
  isPrimary: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

type AddressFormData = z.infer<typeof addressFormSchema>;

export default function NovoEnderecoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedStateId, setSelectedStateId] = useState<number | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      type: '',
      label: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      zipCode: '',
      cityId: '',
      stateId: '',
      isPrimary: false,
      isActive: true,
    },
  });

  const states = useStates();
  const cities = useCities(selectedStateId || 0);
  const watchedStateId = watch('stateId');

  // Atualizar selectedStateId quando stateId mudar
  if (watchedStateId && selectedStateId !== parseInt(watchedStateId)) {
    setSelectedStateId(parseInt(watchedStateId));
  }

  const onSubmit = async (data: AddressFormData) => {
    setLoading(true);
    try {
      // Simular criação de endereço
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Dados do endereço:', data);
      router.push('/dashboard/usuario/enderecos');
    } catch (error) {
      console.error('Erro ao criar endereço:', error);
    } finally {
      setLoading(false);
    }
  };

  const addressTypeOptions = [
    { value: 'home', label: 'Residencial' },
    { value: 'work', label: 'Trabalho' },
    { value: 'other', label: 'Outro' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/dashboard/usuario/enderecos"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Endereços
          </Link>
        </div>

        <div className="rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center">
              <MapPin className="mr-3 h-5 w-5 text-gray-500" />
              <h1 className="text-2xl font-semibold text-gray-900">Novo Endereço</h1>
            </div>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <HookFormSelect
                  label="Tipo de Endereço"
                  name="type"
                  options={addressTypeOptions}
                  control={control}
                  error={errors.type?.message}
                  required
                />

                <HookFormField
                  label="Rótulo (opcional)"
                  name="label"
                  type="text"
                  placeholder="Ex: Casa da praia"
                  control={control}
                  error={errors.label?.message}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <HookFormField
                  label="Rua"
                  name="street"
                  type="text"
                  control={control}
                  error={errors.street?.message}
                  required
                />

                <HookFormField
                  label="Número"
                  name="number"
                  type="text"
                  control={control}
                  error={errors.number?.message}
                  required
                />
              </div>

              <HookFormField
                label="Complemento (opcional)"
                name="complement"
                type="text"
                placeholder="Ex: Apto 101, Bloco B"
                control={control}
                error={errors.complement?.message}
              />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <HookFormField
                  label="Bairro"
                  name="neighborhood"
                  type="text"
                  control={control}
                  error={errors.neighborhood?.message}
                  required
                />

                <HookFormField
                  label="CEP"
                  name="zipCode"
                  type="text"
                  placeholder="00000-000"
                  control={control}
                  error={errors.zipCode?.message}
                  required
                  mask="cep"
                />
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <HookFormSelect
                  label="Estado"
                  name="stateId"
                  options={states.map((state) => ({ value: state.id.toString(), label: state.name }))}
                  control={control}
                  error={errors.stateId?.message}
                  required
                />

                <HookFormSelect
                  label="Cidade"
                  name="cityId"
                  options={cities.map((city) => ({ value: city.id.toString(), label: city.name }))}
                  control={control}
                  error={errors.cityId?.message}
                  required
                  disabled={!selectedStateId}
                />
              </div>

              <div className="space-y-4">
                <HookFormCheckbox
                  label="Endereço principal"
                  name="isPrimary"
                  control={control}
                />

                <HookFormCheckbox
                  label="Endereço ativo"
                  name="isActive"
                  control={control}
                />
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <Link
                  href="/dashboard/usuario/enderecos"
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                  Cancelar
                </Link>
                <Button
                  type="submit"
                  disabled={loading}
                  loading={loading}
                  variant="solid"
                  size="md"
                  className="bg-blue-600 hover:bg-blue-700">
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? 'Salvando...' : 'Salvar Endereço'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
