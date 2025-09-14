'use server';

import { apiRequest } from './config';
import {
  PetTypeCategory,
  PetTypeCategoryListResponseDto,
  PetTypeCategoryStatisticsResponse,
  CreatePetTypeCategoryDto,
  UpdatePetTypeCategoryDto,
} from '@/lib/types/api';

/**
 * Lista todas as categorias com opções de filtro, busca e paginação
 */
export async function getPetTypeCategories(params?: {
  activeOnly?: boolean;
  search?: string;
  orderBy?: 'name' | 'id' | 'createdAt' | 'updatedAt';
  orderDirection?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}): Promise<{ success: boolean; data?: PetTypeCategoryListResponseDto; error?: string }> {
  try {
    const searchParams = new URLSearchParams();

    if (params?.activeOnly !== undefined) searchParams.append('activeOnly', params.activeOnly.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.orderBy) searchParams.append('orderBy', params.orderBy);
    if (params?.orderDirection) searchParams.append('orderDirection', params.orderDirection);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString());

    const data = await apiRequest<PetTypeCategoryListResponseDto>(`/pet-type-categories?${searchParams.toString()}`);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar categorias de tipos de pet',
    };
  }
}

/**
 * Lista apenas categorias ativas, ordenadas por nome
 */
export async function getActivePetTypeCategories(): Promise<{
  success: boolean;
  categories?: PetTypeCategory[];
  error?: string;
}> {
  try {
    const categories = await apiRequest<PetTypeCategory[]>('/pet-type-categories/active');
    return { success: true, categories };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar categorias ativas',
    };
  }
}

/**
 * Busca categorias ativas por termo específico
 */
export async function searchPetTypeCategories(searchTerm: string): Promise<{
  success: boolean;
  categories?: PetTypeCategory[];
  error?: string;
}> {
  try {
    const searchParams = new URLSearchParams();
    searchParams.append('q', searchTerm);

    const categories = await apiRequest<PetTypeCategory[]>(`/pet-type-categories/search?${searchParams.toString()}`);
    return { success: true, categories };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar categorias por termo',
    };
  }
}

/**
 * Retorna estatísticas das categorias de tipos de pet
 */
export async function getPetTypeCategoriesStatistics(): Promise<{
  success: boolean;
  data?: PetTypeCategoryStatisticsResponse;
  error?: string;
}> {
  try {
    const data = await apiRequest<PetTypeCategoryStatisticsResponse>('/pet-type-categories/statistics');
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar estatísticas das categorias',
    };
  }
}

/**
 * Busca uma categoria específica pelo ID
 */
export async function getPetTypeCategory(id: number): Promise<{
  success: boolean;
  category?: PetTypeCategory;
  error?: string;
}> {
  try {
    const category = await apiRequest<PetTypeCategory>(`/pet-type-categories/${id}`);
    return { success: true, category };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar categoria',
    };
  }
}

/**
 * Cria uma nova categoria de tipo de pet (Admin only)
 */
export async function createPetTypeCategory(data: CreatePetTypeCategoryDto): Promise<{
  success: boolean;
  category?: PetTypeCategory;
  error?: string;
}> {
  try {
    const category = await apiRequest<PetTypeCategory>('/pet-type-categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return { success: true, category };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao criar categoria',
    };
  }
}

/**
 * Atualiza uma categoria existente (Admin only)
 */
export async function updatePetTypeCategory(
  id: number,
  data: UpdatePetTypeCategoryDto,
): Promise<{
  success: boolean;
  category?: PetTypeCategory;
  error?: string;
}> {
  try {
    const category = await apiRequest<PetTypeCategory>(`/pet-type-categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return { success: true, category };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao atualizar categoria',
    };
  }
}

/**
 * Remove uma categoria (soft delete) (Admin only)
 */
export async function deletePetTypeCategory(id: number): Promise<{
  success: boolean;
  category?: PetTypeCategory;
  error?: string;
}> {
  try {
    const category = await apiRequest<PetTypeCategory>(`/pet-type-categories/${id}`, {
      method: 'DELETE',
    });
    return { success: true, category };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao remover categoria',
    };
  }
}
