/**
 * Utilitário para tratamento de erros de autenticação
 */

import { clearAuthToken } from '@/lib/api/auth';

/**
 * Verifica se um erro indica que o token é inválido ou expirado
 */
export function isAuthError(error: string | Error): boolean {
  const errorMessage = typeof error === 'string' ? error : error.message;
  
  return (
    errorMessage.includes('401') ||
    errorMessage.includes('Unauthorized') ||
    errorMessage.includes('Token') ||
    errorMessage.includes('não autorizado') ||
    errorMessage.includes('unauthorized') ||
    errorMessage.includes('token') ||
    errorMessage.includes('expired') ||
    errorMessage.includes('expirado') ||
    errorMessage.includes('invalid') ||
    errorMessage.includes('inválido') ||
    errorMessage === 'UNAUTHORIZED_TOKEN'
  );
}

/**
 * Trata erros de autenticação fazendo logout automático
 */
export async function handleAuthError(error: string | Error): Promise<void> {
  if (isAuthError(error)) {
    console.log('Erro de autenticação detectado, fazendo logout automático...');
    
    // Se estamos no lado do cliente, usar window.location
    if (typeof window !== 'undefined') {
      // Tentar limpar o cookie via server action primeiro
      try {
        await clearAuthToken();
      } catch (serverError) {
        console.warn('Erro ao limpar token via server action:', serverError);
      }
      
      // Limpar qualquer token do localStorage se existir
      localStorage.removeItem('auth-token');
      sessionStorage.removeItem('auth-token');
      
      // Limpar cookies do lado do cliente (se possível)
      document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      // Redirecionar diretamente
      window.location.href = '/login';
      return;
    }
    
    // Se estamos no servidor, tentar usar a server action
    try {
      await clearAuthToken();
    } catch (logoutError) {
      console.error('Erro ao fazer logout via server action:', logoutError);
    }
  }
}

/**
 * Wrapper para funções que podem gerar erros de autenticação
 */
export async function withAuthErrorHandling<T>(
  fn: () => Promise<T>
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    await handleAuthError(error as Error);
    return null;
  }
}

/**
 * Força logout imediato (para usar em casos críticos)
 */
export function forceLogout(): void {
  console.log('Forçando logout imediato...');
  
  if (typeof window !== 'undefined') {
    // Limpar qualquer token armazenado
    localStorage.removeItem('auth-token');
    sessionStorage.removeItem('auth-token');
    
    // Limpar cookies do lado do cliente (se possível)
    document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    // Redirecionar
    window.location.href = '/login';
  }
} 