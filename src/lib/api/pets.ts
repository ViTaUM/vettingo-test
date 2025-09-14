'use server';

import { Pet, CreatePetDto, UpdatePetDto } from '@/lib/types/api';
import { apiRequest } from './config';
import { revalidateTag } from 'next/cache';

export async function createPet(data: CreatePetDto): Promise<{ success: boolean; pet?: Pet; error?: string }> {
  try {
    const pet = await apiRequest<Pet>('/pets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      cache: 'no-store',
    });

    revalidateTag('pets');

    return { success: true, pet };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao cadastrar pet',
    };
  }
}

export async function getUserPets(): Promise<{ success: boolean; pets?: Pet[]; error?: string }> {
  try {
    const pets = await apiRequest<Pet[]>('/pets', {
      next: {
        revalidate: 60,
        tags: ['pets'],
      },
    });
    return { success: true, pets };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar pets',
    };
  }
}

export async function getPetById(id: number): Promise<{ success: boolean; pet?: Pet; error?: string }> {
  try {
    const pet = await apiRequest<Pet>(`/pets/${id}`, {
      next: {
        revalidate: 60,
        tags: [`pet-${id}`],
      },
    });
    return { success: true, pet };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar pet',
    };
  }
}

export async function updatePet(
  id: number,
  data: UpdatePetDto,
): Promise<{ success: boolean; pet?: Pet; error?: string }> {
  try {
    const pet = await apiRequest<Pet>(`/pets/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    revalidateTag('pets');

    return { success: true, pet };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao atualizar pet',
    };
  }
}

export async function deletePet(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    await apiRequest(`/pets/${id}`, {
      method: 'DELETE',
    });

    revalidateTag('pets');

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao excluir pet',
    };
  }
}
