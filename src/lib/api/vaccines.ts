'use server';

import { apiRequest } from './config';

export interface PetVaccine {
  id: number;
  name: string;
  date: string;
  nextDue?: string;
  veterinarian: string;
  batch: string;
  status: 'completed' | 'due' | 'overdue';
}

export async function getPetVaccines(petId: number): Promise<{ success: boolean; vaccines?: PetVaccine[]; error?: string }> {
  try {
    const vaccines = await apiRequest<PetVaccine[]>(`/pet-vaccine/${petId}`, {
      next: {
        revalidate: 60,
        tags: [`pet-vaccines-${petId}`],
      },
    });
    return { success: true, vaccines };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar vacinas do pet',
    };
  }
} 