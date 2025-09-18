'use server';

import { LoginResponseDto, RegisterResponseDto } from '@/lib/types/api';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { apiRequest } from './config';

export async function loginAction(email: string, password: string) {
  try {
    const result = await apiRequest<LoginResponseDto>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      cache: 'no-store',
    });

    const cookieStore = await cookies();
    cookieStore.set('auth-token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60,
    });

    return { success: true, token: result.token };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro no login',
    };
  }
}

export async function registerAction(data: {
  email: string;
  phoneDDI: string;
  phoneDDD: string;
  phoneNumber: string;
  userFirstName: string;
  userCpf: string;
  userLastName: string;
  userBirthDate: string;
  userGender: 'M' | 'F' | 'O';
  userWantsNewsletter: boolean;
  userPassword: string;
  role: 'USER' | 'VETERINARIAN';
}) {
  try {
    const response = await apiRequest<RegisterResponseDto>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
      cache: 'no-store',
    });

    return { success: true, user: response.user, message: response.message };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro no registro',
    };
  }
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
  redirect('/login');
}

export async function changePasswordAction(currentPassword: string, newPassword: string) {
  try {
    await apiRequest('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
      cache: 'no-store',
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao alterar senha',
    };
  }
}

export async function requestPasswordResetAction(email: string) {
  try {
    await apiRequest('/auth/request-password-reset', {
      method: 'POST',
      body: JSON.stringify({ email }),
      cache: 'no-store',
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao solicitar redefinição de senha',
    };
  }
}

export async function getSecurityLogsAction() {
  try {
    const logs = await apiRequest<
      Array<{
        id: number;
        type: string;
        description: string;
        ipAddress: string;
        userAgent: string;
        createdAt: string;
      }>
    >('/auth/security-logs', {
      method: 'GET',
      cache: 'no-store',
    });

    return { success: true, logs };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar logs de segurança',
      logs: [],
    };
  }
}

export async function getActiveSessionsAction() {
  try {
    const sessions = await apiRequest<
      Array<{
        id: string;
        device: string;
        location: string;
        lastAccess: string;
        current: boolean;
      }>
    >('/auth/active-sessions', {
      method: 'GET',
      cache: 'no-store',
    });

    return { success: true, sessions };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao buscar sessões ativas',
      sessions: [],
    };
  }
}

export async function revokeSessionAction(sessionId: string) {
  try {
    await apiRequest(`/auth/revoke-session/${sessionId}`, {
      method: 'DELETE',
      cache: 'no-store',
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao revogar sessão',
    };
  }
}
