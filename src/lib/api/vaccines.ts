'use server';

import { apiRequest } from './config';

export interface PetVaccine {
  id: number;
  petId: number;
  vaccineName: string;
  vaccinationDate: string;
  nextDueDate?: string;
  vetId: number;
  batchNumber?: string;
  status: 'PENDENTE' | 'APLICADA' | 'ATRASADA' | 'NÃO APLICADA';
  notes?: string;
  createdAt: string;
}

export interface CreatePetVaccineDto {
  vaccineName: string;
  vaccinationDate: string;
  nextDueDate?: string;
  vetId: number;
  batchNumber?: string;
  status: 'PENDENTE' | 'APLICADA' | 'ATRASADA' | 'NÃO APLICADA';
  notes?: string;
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

export async function createPetVaccine(petId: number, data: CreatePetVaccineDto): Promise<{ success: boolean; vaccine?: PetVaccine; error?: string }> {
  try {
    const vaccine = await apiRequest<PetVaccine>(`/pet-vaccine/${petId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return { success: true, vaccine };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao criar vacina do pet',
    };
  }
} 