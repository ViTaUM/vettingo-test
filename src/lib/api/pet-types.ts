'use server';

import { apiRequest } from './config';
import {
  PetType,
  PetTypeListResponseDto,
  PetTypesByCategoryResponseDto,
  CreatePetTypeDto,
  UpdatePetTypeDto,
} from '@/lib/types/api';

/**
 * Lista todos os tipos de pet com opções de filtro, busca e paginação
 */
export async function getPetTypes(params?: {
  activeOnly?: boolean;
  search?: string;
  categoryId?: number;
  orderBy?: 'name' | 'id' | 'createdAt' | 'updatedAt';
  orderDirection?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}): Promise<{ success: boolean; data?: PetTypeListResponseDto; error?: string }> {
  try {
    const searchParams = new URLSearchParams();

    if (params?.activeOnly !== undefined) searchParams.append('activeOnly', params.activeOnly.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.categoryId) searchParams.append('categoryId', params.categoryId.toString());
    if (params?.orderBy) searchParams.append('orderBy', params.orderBy);
    if (params?.orderDirection) searchParams.append('orderDirection', params.orderDirection);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString());

    const data = await apiRequest<PetTypeListResponseDto>(`/pet-types?${searchParams.toString()}`);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar tipos de pet',
    };
  }
}

/**
 * Lista tipos de pet de uma categoria específica
 */
export async function getPetTypesByCategory(
  categoryId: number,
  params?: {
    activeOnly?: boolean;
    search?: string;
    orderBy?: 'name' | 'id' | 'createdAt';
    orderDirection?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
  },
): Promise<{ success: boolean; data?: PetTypesByCategoryResponseDto; error?: string }> {
  try {
    const searchParams = new URLSearchParams();

    if (params?.activeOnly !== undefined) searchParams.append('activeOnly', params.activeOnly.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.orderBy) searchParams.append('orderBy', params.orderBy);
    if (params?.orderDirection) searchParams.append('orderDirection', params.orderDirection);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString());

    const data = await apiRequest<PetTypesByCategoryResponseDto>(
      `/pet-types/category/${categoryId}?${searchParams.toString()}`,
    );
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar tipos de pet por categoria',
    };
  }
}

/**
 * Lista apenas tipos de pet ativos, ordenados por nome
 */
export async function getActivePetTypes(): Promise<{ success: boolean; petTypes?: PetType[]; error?: string }> {
  try {
    const petTypes = await apiRequest<PetType[]>('/pet-types/active');
    return { success: true, petTypes };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar tipos de pet ativos',
    };
  }
}

/**
 * Busca um tipo de pet específico pelo ID
 */
export async function getPetType(id: number): Promise<{ success: boolean; petType?: PetType; error?: string }> {
  try {
    const petType = await apiRequest<PetType>(`/pet-types/${id}`);
    return { success: true, petType };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar tipo de pet',
    };
  }
}

/**
 * Cria um novo tipo de pet (Admin only)
 */
export async function createPetType(
  data: CreatePetTypeDto,
): Promise<{ success: boolean; petType?: PetType; error?: string }> {
  try {
    const petType = await apiRequest<PetType>('/pet-types', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return { success: true, petType };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao criar tipo de pet',
    };
  }
}

/**
 * Atualiza um tipo de pet existente (Admin only)
 */
export async function updatePetType(
  id: number,
  data: UpdatePetTypeDto,
): Promise<{ success: boolean; petType?: PetType; error?: string }> {
  try {
    const petType = await apiRequest<PetType>(`/pet-types/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return { success: true, petType };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao atualizar tipo de pet',
    };
  }
}

/**
 * Remove um tipo de pet (soft delete) (Admin only)
 */
export async function deletePetType(id: number): Promise<{ success: boolean; petType?: PetType; error?: string }> {
  try {
    const petType = await apiRequest<PetType>(`/pet-types/${id}`, {
      method: 'DELETE',
    });
    return { success: true, petType };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao remover tipo de pet',
    };
  }
}
