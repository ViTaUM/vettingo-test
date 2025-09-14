'use client';

import PetForm, { PetFormData } from '@/components/dashboard/pets/pet-form';
import { createPet } from '@/lib/api/pets';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function NovoPetPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: PetFormData) => {
    setLoading(true);

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

      const result = await createPet(petData);

      if (result.success && result.pet) {
        toast.success('Pet cadastrado com sucesso!');
        router.push('/dashboard/usuario');
      } else {
        toast.error(result.error || 'Erro ao cadastrar pet');
      }
    } catch {
      toast.error('Erro inesperado ao cadastrar pet');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/usuario');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/dashboard/usuario" className="mb-4 inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Cadastrar Novo Pet</h1>
        <p className="mt-2 text-gray-600">Preencha as informações do seu pet para cadastrá-lo no sistema.</p>
      </div>

      {/* Form */}
      <PetForm onSubmit={handleSubmit} submitLabel="Cadastrar Pet" loading={loading} onCancel={handleCancel} />
    </div>
  );
}
