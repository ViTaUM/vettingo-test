'use server';

import { apiRequest } from '@/lib/api/config';
import { User, UserAddress, UserEmail, UserPhone } from '@/lib/types/api';
import { revalidateTag } from 'next/cache';

export async function getCurrentUser(): Promise<{ success: boolean; user?: User; error?: string; isAuthError?: boolean }> {
  try {
    const user = await apiRequest<User>('/users/me', {
      next: {
        revalidate: 60,
        tags: ['user'],
      },
    });
    return { success: true, user };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar usuário';
    
    // Verificar se é erro de autenticação
    const isAuthError = errorMessage === 'UNAUTHORIZED_TOKEN' || 
                       errorMessage.includes('401') || 
                       errorMessage.includes('Unauthorized') ||
                       errorMessage.includes('não autorizado');
    
    return {
      success: false,
      error: errorMessage,
      isAuthError
    };
  }
}

export async function updateUser(data: {
  firstName?: string;
  lastName?: string;
  avatar?: string;
}): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const user = await apiRequest<User>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
      cache: 'no-store',
    });

    revalidateTag('user');

    return { success: true, user };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao atualizar usuário',
    };
  }
}

export async function getUserEmails(): Promise<{ success: boolean; emails?: UserEmail[]; error?: string }> {
  try {
    const emails = await apiRequest<UserEmail[]>('/users/me/emails', {
      next: {
        revalidate: 60,
        tags: ['user-emails'],
      },
    });
    return { success: true, emails };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar emails',
    };
  }
}

export async function getUserPhones(): Promise<{ success: boolean; phones?: UserPhone[]; error?: string }> {
  try {
    const phones = await apiRequest<UserPhone[]>('/users/me/phones', {
      next: {
        revalidate: 60,
        tags: ['user-phones'],
      },
    });
    return { success: true, phones };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar telefones',
    };
  }
}

export async function getUserAddresses(): Promise<{ success: boolean; addresses?: UserAddress[]; error?: string }> {
  try {
    const addresses = await apiRequest<UserAddress[]>('/users/me/addresses', {
      next: {
        revalidate: 60,
        tags: ['user-addresses'],
      },
    });
    return { success: true, addresses };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar endereços',
    };
  }
}

export async function updateUserPreferences(data: {
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  pushNotifications?: boolean;
  marketingEmails?: boolean;
  weeklyReports?: boolean;
  accountUpdates?: boolean;
  language?: string;
  timezone?: string;
  theme?: 'light' | 'dark' | 'auto';
}): Promise<{ success: boolean; error?: string }> {
  try {
    await apiRequest('/users/me/preferences', {
      method: 'PUT',
      body: JSON.stringify(data),
      cache: 'no-store',
    });

    revalidateTag('user');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao atualizar preferências',
    };
  }
}

export async function getUserPreferences(): Promise<{
  success: boolean;
  preferences?: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    marketingEmails: boolean;
    weeklyReports: boolean;
    accountUpdates: boolean;
    language: string;
    timezone: string;
    theme: 'light' | 'dark' | 'auto';
  };
  error?: string;
}> {
  try {
    const preferences = await apiRequest<{
      emailNotifications: boolean;
      smsNotifications: boolean;
      pushNotifications: boolean;
      marketingEmails: boolean;
      weeklyReports: boolean;
      accountUpdates: boolean;
      language: string;
      timezone: string;
      theme: 'light' | 'dark' | 'auto';
    }>('/users/me/preferences', {
      next: {
        revalidate: 60,
        tags: ['user-preferences'],
      },
    });
    return { success: true, preferences };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar preferências',
    };
  }
}

export async function deleteUserAccount(): Promise<{ success: boolean; error?: string }> {
  try {
    await apiRequest('/users/me', {
      method: 'DELETE',
      cache: 'no-store',
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao excluir conta',
    };
  }
}

export async function getUserById(userId: number): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const user = await apiRequest<User>(`/users/${userId}`);
    return { success: true, user };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar usuário por ID',
    };
  }
}
