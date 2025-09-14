'use server';

import { UserEmail } from '@/lib/types/api';
import { revalidateTag } from 'next/cache';
import { apiRequest } from './config';

export async function getUserEmails(): Promise<{
  success: boolean;
  emails?: UserEmail[];
  error?: string;
}> {
  try {
    const emails = await apiRequest<UserEmail[]>('/users/me/emails', {
      next: {
        revalidate: 60 * 60 * 24,
        tags: ['user-emails'],
      },
    });
    return { success: true, emails };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar emails do usuário',
    };
  }
}

export async function getUserEmailsById(userId: number): Promise<{
  success: boolean;
  emails?: UserEmail[];
  error?: string;
}> {
  try {
    const emails = await apiRequest<UserEmail[]>(`/users/${userId}/emails`);
    return { success: true, emails };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar emails do usuário',
    };
  }
}

export async function createUserEmail(data: {
  email: string;
  isActive?: boolean;
  isPublic?: boolean;
  isPrimary?: boolean;
}): Promise<{
  success: boolean;
  email?: UserEmail;
  error?: string;
}> {
  try {
    const email = await apiRequest<UserEmail>('/users/me/emails', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    revalidateTag('user-emails');

    return { success: true, email };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao criar email',
    };
  }
}

export async function updateUserEmail(
  emailId: number,
  data: {
    isActive?: boolean;
    isPublic?: boolean;
    isPrimary?: boolean;
  },
): Promise<{
  success: boolean;
  email?: UserEmail;
  error?: string;
}> {
  try {
    const email = await apiRequest<UserEmail>(`/users/me/emails/${emailId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });

    revalidateTag('user-emails');

    return { success: true, email };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao atualizar email',
    };
  }
}

export async function deleteUserEmail(emailId: number): Promise<{
  success: boolean;
  email?: UserEmail;
  error?: string;
}> {
  try {
    const email = await apiRequest<UserEmail>(`/users/me/emails/${emailId}`, {
      method: 'DELETE',
    });

    revalidateTag('user-emails');

    return { success: true, email };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao deletar email',
    };
  }
}

export async function checkEmailExists(email: string): Promise<{
  success: boolean;
  exists?: boolean;
  error?: string;
}> {
  try {
    const searchParams = new URLSearchParams();
    searchParams.append('email', email);

    const result = await apiRequest<{ exists: boolean }>(`/users/emails/check?${searchParams.toString()}`);
    return { success: true, exists: result.exists };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao verificar email',
    };
  }
}

export async function searchUserEmail(email: string): Promise<{
  success: boolean;
  email?: UserEmail;
  error?: string;
}> {
  try {
    const searchParams = new URLSearchParams();
    searchParams.append('email', email);

    const userEmail = await apiRequest<UserEmail>(`/users/emails/search?${searchParams.toString()}`);
    return { success: true, email: userEmail };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar email',
    };
  }
}
