'use server';

import { cookies } from 'next/headers';

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;
  const apiUrl = process.env.API_URL || 'http://localhost:8080';

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const url = `${apiUrl}${endpoint}`;
  
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = {
          message: `Erro HTTP ${response.status}: ${response.statusText}`,
        };
      }

      console.error(`Erro na requisição para ${url}:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });

    // Se o token não for válido (401 Unauthorized), lançar erro específico
    if (response.status === 401) {
      console.log('Token inválido ou expirado detectado');
      throw new Error('UNAUTHORIZED_TOKEN');
    }

      throw new Error(errorData.message || errorData.error || `Erro ${response.status}`);
    }

    // Para métodos DELETE que retornam 204 No Content
    if (response.status === 204) {
      console.log('Resposta da API: 204 No Content');
      return null as T;
    }

    // Verifica se há conteúdo na resposta
    const contentType = response.headers.get('content-type');
    const contentLength = response.headers.get('content-length');
    
    // Se não há conteúdo ou o content-type não é JSON, retorna null
    if (contentLength === '0' || !contentType?.includes('application/json')) {
      console.log('Resposta da API: (sem conteúdo JSON)');
      return null as T;
    }

    // Tenta fazer parse do JSON
    try {
      const text = await response.text();
      
      // Se o texto está vazio, retorna null
      if (!text.trim()) {
        console.log('Resposta da API: (texto vazio)');
        return null as T;
      }

      const data = JSON.parse(text);
      console.log('Resposta da API:', data);
      return data;
    } catch (jsonError) {
      console.warn('Erro ao fazer parse do JSON, retornando null:', jsonError);
      return null as T;
  }
}
