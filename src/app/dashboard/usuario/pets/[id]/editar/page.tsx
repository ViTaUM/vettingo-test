'use client';

import PetForm, { PetFormData } from '@/components/dashboard/pets/pet-form';
import { getPetById, updatePet } from '@/lib/api/pets';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function EditarPetPage() {
  const params = useParams();
  const router = useRouter();
  const petId = parseInt(params.id as string);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [initialData, setInitialData] = useState<PetFormData | undefined>(undefined);

  useEffect(() => {
    const fetchPet = async () => {
      const result = await getPetById(petId);
      if (result.success && result.pet) {
        const pet = result.pet;
        setInitialData({
          name: pet.name,
          petTypeId: pet.petTypeId.toString(),
          breed: pet.breed || '',
          birthDate: pet.birthDate ? new Date(pet.birthDate).toISOString().split('T')[0] : '',
          gender: pet.gender || '',
          weight:
            typeof pet.weight === 'number' ? pet.weight : pet.weight ? parseFloat(pet.weight as string) : undefined,
          hasPedigree: pet.hasPedigree,
          pedigreeNumber: pet.pedigreeNumber || '',
          description: pet.description || '',
          avatar: pet.avatar || '',
        });
      } else {
        toast.error('Pet não encontrado');
        router.push('/dashboard/usuario');
      }
      setLoading(false);
    };

    if (petId) {
      fetchPet();
    }
  }, [petId, router]);

  const handleSubmit = async (formData: PetFormData) => {
    setSaving(true);

    try {
      const petData = {
        name: formData.name,
        petTypeId: parseInt(formData.petTypeId),
        ...(formData.breed && { breed: formData.breed }),
        ...(formData.age && { age: parseInt(formData.age) }),
        ...(formData.birthDate && { birthDate: formData.birthDate }),
        ...(formData.gender && { gender: formData.gender as 'M' | 'F' | 'O' }),
        ...(formData.weight && { weight: formData.weight.toString() }),
        hasPedigree: formData.hasPedigree,
        ...(formData.pedigreeNumber && { pedigreeNumber: formData.pedigreeNumber }),
        ...(formData.description && { description: formData.description }),
        ...(formData.avatar && { avatar: formData.avatar }),
      };

      const result = await updatePet(petId, petData);

      if (result.success) {
        toast.success('Pet atualizado com sucesso!');
        router.push(`/dashboard/usuario/pets/${petId}`);
      } else {
        toast.error(result.error || 'Erro ao atualizar pet');
      }
    } catch {
      toast.error('Erro inesperado ao atualizar pet');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push(`/dashboard/usuario/pets/${petId}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"></div>
          <p className="text-gray-500">Carregando informações do pet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href={`/dashboard/usuario/pets/${petId}`}
          className="mb-4 inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar aos Detalhes
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Editar Pet</h1>
        <p className="mt-2 text-gray-600">Atualize as informações do seu pet e veja as mudanças em tempo real.</p>
      </div>

      {/* Form */}
      {initialData && (
        <PetForm
          initialData={initialData}
          onSubmit={handleSubmit}
          submitLabel="Salvar Alterações"
          loading={saving}
          onCancel={handleCancel}
          isEdit={true}
        />
      )}
    </div>
  );
}
