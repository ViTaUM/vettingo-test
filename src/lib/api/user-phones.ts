'use server';

import { UserPhone } from '@/lib/types/api';
import { revalidateTag } from 'next/cache';
import { apiRequest } from './config';

export async function getUserPhones(): Promise<{
  success: boolean;
  phones?: UserPhone[];
  error?: string;
}> {
  try {
    const phones = await apiRequest<UserPhone[]>('/users/me/phones', {
      next: {
        revalidate: 60 * 60 * 24,
        tags: ['user-phones'],
      },
    });
    return { success: true, phones };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar telefones do usuário',
    };
  }
}

export async function getUserPhonesById(userId: number): Promise<{
  success: boolean;
  phones?: UserPhone[];
  error?: string;
}> {
  try {
    const phones = await apiRequest<UserPhone[]>(`/users/${userId}/phones`);
    return { success: true, phones };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar telefones do usuário',
    };
  }
}

export async function createUserPhone(data: {
  number: string;
  areaCode: string;
  countryCode: string;
  isWhatsapp?: boolean;
  isActive?: boolean;
  isPublic?: boolean;
  isPrimary?: boolean;
}): Promise<{
  success: boolean;
  phone?: UserPhone;
  error?: string;
}> {
  try {
    const phone = await apiRequest<UserPhone>('/users/me/phones', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    revalidateTag('user-phones');
    return { success: true, phone };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao criar telefone',
    };
  }
}

export async function updateUserPhone(
  phoneId: number,
  data: {
    isWhatsapp?: boolean;
    isActive?: boolean;
    isPublic?: boolean;
    isPrimary?: boolean;
  }
): Promise<{
  success: boolean;
  phone?: UserPhone;
  error?: string;
}> {
  try {
    const phone = await apiRequest<UserPhone>(`/users/me/phones/${phoneId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    revalidateTag('user-phones');
    return { success: true, phone };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao atualizar telefone',
    };
  }
}

export async function deleteUserPhone(phoneId: number): Promise<{
  success: boolean;
  phone?: UserPhone;
  error?: string;
}> {
  try {
    const phone = await apiRequest<UserPhone>(`/users/me/phones/${phoneId}`, {
      method: 'DELETE',
    });
    revalidateTag('user-phones');
    return { success: true, phone };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao deletar telefone',
    };
  }
}

export async function checkPhoneExists(
  countryCode: string,
  areaCode: string,
  number: string,
): Promise<{
  success: boolean;
  exists?: boolean;
  error?: string;
}> {
  try {
    const searchParams = new URLSearchParams();
    searchParams.append('countryCode', countryCode);
    searchParams.append('areaCode', areaCode);
    searchParams.append('number', number);

    const result = await apiRequest<{ exists: boolean }>(`/users/phones/check?${searchParams.toString()}`);
    return { success: true, exists: result.exists };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao verificar telefone',
    };
  }
}

export async function searchUserPhone(
  countryCode: string,
  areaCode: string,
  number: string,
): Promise<{
  success: boolean;
  phone?: UserPhone;
  error?: string;
}> {
  try {
    const searchParams = new URLSearchParams();
    searchParams.append('countryCode', countryCode);
    searchParams.append('areaCode', areaCode);
    searchParams.append('number', number);

    const phone = await apiRequest<UserPhone>(`/users/phones/search?${searchParams.toString()}`);
    return { success: true, phone };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar telefone',
    };
  }
}

export async function getUserPhoneById(phoneId: number): Promise<{
  success: boolean;
  phone?: UserPhone;
  error?: string;
}> {
  try {
    const phone = await apiRequest<UserPhone>(`/users/phones/${phoneId}`);
    return { success: true, phone };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar telefone por ID',
    };
  }
}
