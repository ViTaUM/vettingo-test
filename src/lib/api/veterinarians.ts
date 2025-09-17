'use server';

import {
  PaginatedResult,
  SubmitApprovalDocumentsDto,
  UserSpecialization,
  Veterinarian,
  VeterinarianApproval,
  VeterinarianSearchResult,
  VeterinarianWorkLocation,
  WorkSchedule,
} from '@/lib/types/api';
import { revalidateTag } from 'next/cache';
import { apiRequest } from './config';

export async function searchVeterinarians(params: {
  cityId: number;
  name?: string;
  page?: number;
  perPage?: number;
  crmv?: string;
  providesHomeService?: boolean;
  providesEmergencyService?: boolean;
  gender?: string;
  availableToday?: boolean;
  specializationIds?: number[];
}): Promise<{ success: boolean; data?: VeterinarianSearchResult[]; error?: string }> {
  try {
    const searchParams = new URLSearchParams();

    // Parâmetro obrigatório
    searchParams.append('cityId', params.cityId.toString());

    // Parâmetros opcionais
    if (params.name) searchParams.append('name', params.name);
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.perPage) searchParams.append('perPage', params.perPage.toString());
    if (params.crmv) searchParams.append('crmv', params.crmv);
    if (params.providesHomeService !== undefined)
      searchParams.append('providesHomeService', params.providesHomeService.toString());
    if (params.providesEmergencyService !== undefined)
      searchParams.append('providesEmergencyService', params.providesEmergencyService.toString());
    if (params.gender) searchParams.append('gender', params.gender);
    if (params.availableToday !== undefined) searchParams.append('availableToday', params.availableToday.toString());
    if (params.specializationIds) {
      params.specializationIds.forEach((id) => searchParams.append('specializationIds', id.toString()));
    }

    const url = `/pet-scheduling/search-vet?${searchParams.toString()}`;

    // A nova API retorna os dados dos veterinários diretamente
    const data = await apiRequest<VeterinarianSearchResult[]>(url);

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar veterinários',
    };
  }
}

export async function getVeterinarian(
  id: number,
): Promise<{ success: boolean; veterinarian?: Veterinarian; error?: string }> {
  try {
    const veterinarian = await apiRequest<Veterinarian>(`/veterinarians/${id}`);
    return { success: true, veterinarian };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar veterinário',
    };
  }
}

export async function getCurrentVeterinarian(): Promise<{
  success: boolean;
  veterinarian?: Veterinarian;
  error?: string;
}> {
  try {
    const veterinarian = await apiRequest<Veterinarian>('/veterinarians/me');
    return { success: true, veterinarian };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar dados do veterinário',
    };
  }
}

export async function createVeterinarianProfile(data: {
  bio?: string;
  website?: string;
  crmv: string;
  crmvStateId: number;
  phoneId?: number;
  professionalEmailId?: number;
  avatar?: string;
  profilePhotos?: string;
  providesEmergencyService?: boolean;
  providesHomeService?: boolean;
}): Promise<{
  success: boolean;
  veterinarian?: Veterinarian;
  error?: string;
}> {
  try {
    const veterinarian = await apiRequest<Veterinarian>('/veterinarians/me', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return { success: true, veterinarian };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao criar perfil do veterinário',
    };
  }
}

export async function updateVeterinarianProfile(data: {
  bio?: string;
  website?: string;
  crmv?: string;
  crmvStateId?: number;
  phoneId?: number;
  professionalEmailId?: number;
  avatar?: string;
  profilePhotos?: string;
  providesEmergencyService?: boolean;
  providesHomeService?: boolean;
}): Promise<{
  success: boolean;
  veterinarian?: Veterinarian;
  error?: string;
}> {
  try {
    const veterinarian = await apiRequest<Veterinarian>('/veterinarians/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return { success: true, veterinarian };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao atualizar perfil do veterinário',
    };
  }
}

export async function getVeterinarianWorkLocations(params?: {
  stateId?: number;
  cityId?: number;
  active?: boolean;
  orderBy?: 'name' | 'createdAt' | 'updatedAt';
  orderDirection?: 'asc' | 'desc';
}): Promise<{
  success: boolean;
  workLocations?: VeterinarianWorkLocation[];
  error?: string;
}> {
  try {
    const searchParams = new URLSearchParams();

    if (params?.stateId) searchParams.append('stateId', params.stateId.toString());
    if (params?.cityId) searchParams.append('cityId', params.cityId.toString());
    if (params?.active !== undefined) searchParams.append('active', params.active.toString());
    if (params?.orderBy) searchParams.append('orderBy', params.orderBy);
    if (params?.orderDirection) searchParams.append('orderDirection', params.orderDirection);

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

export async function getVeterinarianSpecializations(): Promise<{
  success: boolean;
  specializations?: UserSpecialization[];
  error?: string;
}> {
  try {
    const specializations = await apiRequest<UserSpecialization[]>('/veterinarians/me/specializations');
    return { success: true, specializations };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar especializações',
    };
  }
}

export async function updateVeterinarianSpecializations(specializationIds: number[]): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const result = await apiRequest<{ message: string }>('/veterinarians/me/specializations', {
      method: 'POST',
      body: JSON.stringify(specializationIds),
    });
    return { success: true, message: result.message };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao atualizar especializações',
    };
  }
}

export async function createVeterinarianWorkLocation(data: {
  stateId: number;
  cityId: number;
  name: string;
  address: string;
  number: string;
  complement?: string;
  neighborhood: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
  isActive?: boolean;
}): Promise<{
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

export async function updateVeterinarianWorkLocation(
  locationId: number,
  data: {
    stateId?: number;
    cityId?: number;
    name?: string;
    address?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    zipCode?: string;
    latitude?: number;
    longitude?: number;
    isActive?: boolean;
  },
): Promise<{
  success: boolean;
  workLocation?: VeterinarianWorkLocation;
  error?: string;
}> {
  try {
    const workLocation = await apiRequest<VeterinarianWorkLocation>(`/vet-work-locations/${locationId}`, {
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

export async function deleteVeterinarianWorkLocation(locationId: number): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  try {
    const result = await apiRequest<{ message: string }>(`/vet-work-locations/${locationId}`, {
      method: 'DELETE',
    });
    return { success: true, message: result.message };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao excluir local de trabalho',
    };
  }
}

// Funções para gerenciar horários de trabalho
export async function getWorkLocationSchedules(
  locationId: number,
  params?: {
    active?: boolean;
    orderBy?: 'dayOfWeek' | 'startTime' | 'createdAt';
    orderDirection?: 'asc' | 'desc';
  },
): Promise<{
  success: boolean;
  schedules?: WorkSchedule[];
  error?: string;
}> {
  try {
    const searchParams = new URLSearchParams();

    if (params?.active !== undefined) searchParams.append('active', params.active.toString());
    if (params?.orderBy) searchParams.append('orderBy', params.orderBy);
    if (params?.orderDirection) searchParams.append('orderDirection', params.orderDirection);

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

export async function createWorkSchedule(
  locationId: number,
  data: {
    dayOfWeek: number;
    startTime: string; // formato "HH:MM:SS"
    endTime: string; // formato "HH:MM:SS"
    isActive?: boolean;
  },
): Promise<{
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

export async function updateWorkSchedule(
  scheduleId: number,
  data: {
    dayOfWeek?: number;
    startTime?: string; // formato "HH:MM:SS"
    endTime?: string; // formato "HH:MM:SS"
    isActive?: boolean;
  },
): Promise<{
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
    const result = await apiRequest<{ message: string }>(`/vet-work-locations/schedules/${scheduleId}`, {
      method: 'DELETE',
    });
    return { success: true, message: result.message };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao excluir horário de trabalho',
    };
  }
}

export async function getVeterinarianApprovalStatus(veterinarianId: number): Promise<{
  success: boolean;
  approval?: VeterinarianApproval;
  error?: string;
}> {
  try {
    const approval = await apiRequest<VeterinarianApproval>(`/veterinarians/${veterinarianId}/approval-status`, {
      next: {
        revalidate: 0,
        tags: ['veterinarian-approval'],
      },
    });
    return { success: true, approval };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar status de aprovação',
    };
  }
}

export async function submitApprovalDocuments(
  veterinarianId: number,
  data: SubmitApprovalDocumentsDto,
): Promise<{
  success: boolean;
  approval?: VeterinarianApproval;
  error?: string;
}> {
  try {
    const approval = await apiRequest<VeterinarianApproval>(
      `/veterinarians/${veterinarianId}/submit-approval-documents`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
    );

    revalidateTag('veterinarian-approval');

    return { success: true, approval };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao enviar documentos para aprovação',
    };
  }
}
