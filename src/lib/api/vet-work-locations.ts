'use server';

import { VeterinarianWorkLocation, WorkSchedule } from '../types/api';
import { apiRequest } from './config';

export interface CreateWorkLocationDto {
  name: string;
  address: string;
  number: string;
  complement?: string;
  neighborhood: string;
  zipCode: string;
  stateId: number;
  cityId: number;
  latitude?: number;
  longitude?: number;
}

export interface UpdateWorkLocationDto {
  name?: string;
  address?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  zipCode?: string;
  stateId?: number;
  cityId?: number;
  latitude?: number;
  longitude?: number;
}

export interface CreateWorkScheduleDto {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface UpdateWorkScheduleDto {
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
  isActive?: boolean;
}

export interface WorkLocationFilters {
  stateId?: number;
  cityId?: number;
  active?: boolean;
  orderBy?: 'name' | 'createdAt' | 'updatedAt';
  orderDirection?: 'asc' | 'desc';
}

export interface WorkScheduleFilters {
  active?: boolean;
  orderBy?: 'dayOfWeek' | 'startTime' | 'createdAt';
  orderDirection?: 'asc' | 'desc';
}

export async function createWorkLocation(data: CreateWorkLocationDto): Promise<{
  success: boolean;
  workLocation?: VeterinarianWorkLocation;
  error?: string;
}> {
  try {
    const workLocation = await apiRequest<VeterinarianWorkLocation>('/vet-work-locations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return { success: true, workLocation };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao criar local de trabalho',
    };
  }
}

export async function getWorkLocations(filters?: WorkLocationFilters): Promise<{
  success: boolean;
  workLocations?: VeterinarianWorkLocation[];
  error?: string;
}> {
  try {
    const searchParams = new URLSearchParams();
    
    if (filters?.stateId) searchParams.append('stateId', filters.stateId.toString());
    if (filters?.cityId) searchParams.append('cityId', filters.cityId.toString());
    if (filters?.active !== undefined) searchParams.append('active', filters.active.toString());
    if (filters?.orderBy) searchParams.append('orderBy', filters.orderBy);
    if (filters?.orderDirection) searchParams.append('orderDirection', filters.orderDirection);

    const queryString = searchParams.toString();
    const url = queryString ? `/vet-work-locations?${queryString}` : '/vet-work-locations';
    
    const workLocations = await apiRequest<VeterinarianWorkLocation[]>(url);
    return { success: true, workLocations };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar locais de trabalho',
    };
  }
}

export async function getWorkLocationById(id: number): Promise<{
  success: boolean;
  workLocation?: VeterinarianWorkLocation;
  error?: string;
}> {
  try {
    const workLocation = await apiRequest<VeterinarianWorkLocation>(`/vet-work-locations/${id}`);
    return { success: true, workLocation };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar local de trabalho',
    };
  }
}

export async function updateWorkLocation(id: number, data: UpdateWorkLocationDto): Promise<{
  success: boolean;
  workLocation?: VeterinarianWorkLocation;
  error?: string;
}> {
  try {
    const workLocation = await apiRequest<VeterinarianWorkLocation>(`/vet-work-locations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return { success: true, workLocation };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao atualizar local de trabalho',
    };
  }
}

export async function deleteWorkLocation(id: number): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const result = await apiRequest<{ message: string } | null>(`/vet-work-locations/${id}`, {
      method: 'DELETE',
    });
    
    // Se result é null (204 No Content ou resposta vazia), ainda é sucesso
    return { 
      success: true, 
      message: result?.message || 'Local de trabalho excluído com sucesso' 
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao excluir local de trabalho',
    };
  }
}

export async function createWorkSchedule(locationId: number, data: CreateWorkScheduleDto): Promise<{
  success: boolean;
  schedule?: WorkSchedule;
  error?: string;
}> {
  try {
    const schedule = await apiRequest<WorkSchedule>(`/vet-work-locations/${locationId}/schedules`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return { success: true, schedule };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao criar horário de trabalho',
    };
  }
}

export async function getWorkSchedules(locationId: number, filters?: WorkScheduleFilters): Promise<{
  success: boolean;
  schedules?: WorkSchedule[];
  error?: string;
}> {
  try {
    const searchParams = new URLSearchParams();
    
    if (filters?.active !== undefined) searchParams.append('active', filters.active.toString());
    if (filters?.orderBy) searchParams.append('orderBy', filters.orderBy);
    if (filters?.orderDirection) searchParams.append('orderDirection', filters.orderDirection);

    const queryString = searchParams.toString();
    const url = queryString 
      ? `/vet-work-locations/${locationId}/schedules?${queryString}` 
      : `/vet-work-locations/${locationId}/schedules`;
    
    const schedules = await apiRequest<WorkSchedule[]>(url);
    return { success: true, schedules };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar horários de trabalho',
    };
  }
}

export async function getWorkScheduleById(scheduleId: number): Promise<{
  success: boolean;
  schedule?: WorkSchedule;
  error?: string;
}> {
  try {
    const schedule = await apiRequest<WorkSchedule>(`/vet-work-locations/schedules/${scheduleId}`);
    return { success: true, schedule };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar horário de trabalho',
    };
  }
}

export async function updateWorkSchedule(scheduleId: number, data: UpdateWorkScheduleDto): Promise<{
  success: boolean;
  schedule?: WorkSchedule;
  error?: string;
}> {
  try {
    const schedule = await apiRequest<WorkSchedule>(`/vet-work-locations/schedules/${scheduleId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return { success: true, schedule };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao atualizar horário de trabalho',
    };
  }
}

export async function deleteWorkSchedule(scheduleId: number): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const result = await apiRequest<{ message: string } | null>(`/vet-work-locations/schedules/${scheduleId}`, {
      method: 'DELETE',
    });
    
    // Se result é null (204 No Content ou resposta vazia), ainda é sucesso
    return { 
      success: true, 
      message: result?.message || 'Horário excluído com sucesso' 
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao excluir horário de trabalho',
    };
  }
} 

export async function getVetWorkLocationsByVeterinarianId(
  veterinarianId: number,
  filters: {
    cityId?: number;
    active?: boolean;
    orderBy?: 'name' | 'createdAt' | 'updatedAt';
    orderDirection?: 'asc' | 'desc';
  } = {}
): Promise<{ success: boolean; data?: VeterinarianWorkLocation[]; error?: string }> {
  try {
    const searchParams = new URLSearchParams();
    if (filters.cityId) searchParams.append('cityId', filters.cityId.toString());
    if (filters.active !== undefined) searchParams.append('active', filters.active.toString());
    if (filters.orderBy) searchParams.append('orderBy', filters.orderBy);
    if (filters.orderDirection) searchParams.append('orderDirection', filters.orderDirection);
    
    const data = await apiRequest<VeterinarianWorkLocation[]>(`/vet-work-locations/veterinarian/${veterinarianId}?${searchParams.toString()}`);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar locais de trabalho',
    };
  }
} 

export async function searchVeterinariansByWorkLocation(params: {
  cityId: number;
  name?: string;
  crmv?: string;
  providesHomeService?: boolean;
  providesEmergencyService?: boolean;
  gender?: string;
  availableToday?: boolean;
  specializationIds?: number[];
}): Promise<{ success: boolean; data?: any[]; error?: string }> {
  try {
    const searchParams = new URLSearchParams();

    // Parâmetro obrigatório
    searchParams.append('cityId', params.cityId.toString());

    // Parâmetros opcionais
    if (params.name) searchParams.append('name', params.name);
    if (params.crmv) searchParams.append('crmv', params.crmv);
    if (params.providesHomeService !== undefined)
      searchParams.append('providesHomeService', params.providesHomeService.toString());
    if (params.providesEmergencyService !== undefined)
      searchParams.append('providesEmergencyService', params.providesEmergencyService.toString());
    if (params.gender) searchParams.append('gender', params.gender);
    if (params.availableToday !== undefined) 
      searchParams.append('availableToday', params.availableToday.toString());
    if (params.specializationIds) {
      params.specializationIds.forEach((id) => searchParams.append('specializationIds', id.toString()));
    }

    const url = `/vet-work-locations/any?${searchParams.toString()}`;
    
    const data = await apiRequest<any[]>(url);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar veterinários por locais de trabalho',
    };
  }
} 

export async function getVeterinarianDashboard(vetId: number, cityId: number): Promise<{
  success: boolean;
  data?: {
    veterinarian: any[];
    review: any[];
  };
  error?: string;
}> {
  try {
    const searchParams = new URLSearchParams();
    searchParams.append('vetId', vetId.toString());
    searchParams.append('cityId', cityId.toString());

    const url = `/vet-dashboard?${searchParams.toString()}`;
    
    const data = await apiRequest<{
      veterinarian: any[];
      review: any[];
    }>(url);
    
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar dados do veterinário',
    };
  }
} 

// Utilitários para client-side
const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:8080';
};

const getTokenFromCookie = (): string | null => {
  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth-token='));
    if (authCookie) {
      const token = authCookie.split('=')[1];
      return decodeURIComponent(token);
    }
  }
  return null;
};

// Função client-side para buscar veterinários com autenticação
export async function searchVeterinariansByWorkLocationClient(params: {
  cityId: number;
  name?: string;
  crmv?: string;
  providesHomeService?: boolean;
  providesEmergencyService?: boolean;
  gender?: string;
  availableToday?: boolean;
  specializationIds?: number[];
}): Promise<{ success: boolean; data?: any[]; error?: string }> {
  try {
    const searchParams = new URLSearchParams();

    // Parâmetro obrigatório
    searchParams.append('cityId', params.cityId.toString());

    // Parâmetros opcionais
    if (params.name) searchParams.append('name', params.name);
    if (params.crmv) searchParams.append('crmv', params.crmv);
    if (params.providesHomeService !== undefined)
      searchParams.append('providesHomeService', params.providesHomeService.toString());
    if (params.providesEmergencyService !== undefined)
      searchParams.append('providesEmergencyService', params.providesEmergencyService.toString());
    if (params.gender) searchParams.append('gender', params.gender);
    if (params.availableToday !== undefined) 
      searchParams.append('availableToday', params.availableToday.toString());
    if (params.specializationIds) {
      params.specializationIds.forEach((id) => searchParams.append('specializationIds', id.toString()));
    }

    const url = `/vet-work-locations/any?${searchParams.toString()}`;
    const apiUrl = getApiUrl();
    const token = getTokenFromCookie();
    
    const response = await fetch(`${apiUrl}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = {
          message: `Erro HTTP ${response.status}: ${response.statusText}`,
        };
      }

      if (response.status === 401) {
        throw new Error('Token inválido ou expirado');
      }

      throw new Error(errorData.message || errorData.error || `Erro ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar veterinários por locais de trabalho',
    };
  }
}

// Função client-side para buscar dados do dashboard do veterinário
export async function getVeterinarianDashboardClient(vetId: number, cityId: number): Promise<{
  success: boolean;
  data?: {
    veterinarian: any[];
    review: any[];
  };
  error?: string;
}> {
  try {
    const searchParams = new URLSearchParams();
    searchParams.append('vetId', vetId.toString());
    searchParams.append('cityId', cityId.toString());

    const url = `/vet-dashboard?${searchParams.toString()}`;
    const apiUrl = getApiUrl();
    const token = getTokenFromCookie();
    
    const response = await fetch(`${apiUrl}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = {
          message: `Erro HTTP ${response.status}: ${response.statusText}`,
        };
      }

      if (response.status === 401) {
        throw new Error('Token inválido ou expirado');
      }

      throw new Error(errorData.message || errorData.error || `Erro ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar dados do veterinário',
    };
  }
} 