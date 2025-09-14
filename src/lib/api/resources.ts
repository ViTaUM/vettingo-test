'use server';

import { apiRequest } from '@/lib/api/config';
import { City, PaginatedResponse, SpecializationCategory, State } from '@/lib/types/api';

export async function getStates(params?: {
  activeOnly?: boolean;
  search?: string;
  orderBy?: 'name' | 'uf' | 'id';
  orderDirection?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}): Promise<{ success: boolean; states?: State[]; error?: string }> {
  try {
    const searchParams = new URLSearchParams();

    if (params?.activeOnly !== undefined) searchParams.append('activeOnly', params.activeOnly ? '1' : '0');
    if (params?.search) searchParams.append('search', params.search);
    if (params?.orderBy) searchParams.append('orderBy', params.orderBy);
    if (params?.orderDirection) searchParams.append('orderDirection', params.orderDirection);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString());

    const response = await apiRequest<PaginatedResponse<State>>(`/location/states?${searchParams.toString()}`, {
      next: {
        revalidate: 3600,
        tags: ['states'],
      },
    });

    // Extrai apenas os items para manter compatibilidade
    const states = response.items;

    return { success: true, states };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar estados',
    };
  }
}

export async function getCities(
  stateId: number,
  params?: {
    activeOnly?: boolean;
    search?: string;
    orderBy?: 'name' | 'id';
    orderDirection?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
  },
): Promise<{ success: boolean; cities?: City[]; error?: string }> {
  try {
    const searchParams = new URLSearchParams();

    if (params?.activeOnly !== undefined) searchParams.append('activeOnly', params.activeOnly ? '1' : '0');
    if (params?.search) searchParams.append('search', params.search);
    if (params?.orderBy) searchParams.append('orderBy', params.orderBy);
    if (params?.orderDirection) searchParams.append('orderDirection', params.orderDirection);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString());

    const response = await apiRequest<PaginatedResponse<City>>(
      `/location/states/${stateId}/cities?${searchParams.toString()}`,
      {
        next: {
          revalidate: 3600,
          tags: [`${stateId}/cities`],
        },
      },
    );

    // Extrai apenas os items para manter compatibilidade
    const cities = response.items;

    return { success: true, cities };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar cidades',
    };
  }
}

export async function getSpecializations(): Promise<{
  success: boolean;
  specializations?: SpecializationCategory[];
  error?: string;
}> {
  try {
    const specializations = await apiRequest<SpecializationCategory[]>('/specializations');
    return { success: true, specializations };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar especializações',
    };
  }
}
