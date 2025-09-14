'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

export interface LoadingState {
  id: string;
  isLoading: boolean;
  message?: string;
  type?: 'spinner' | 'skeleton' | 'pet' | 'data';
  size?: 'sm' | 'md' | 'lg';
  inline?: boolean;
  fullScreen?: boolean;
}

export interface LoadingConfig {
  message?: string;
  type?: 'spinner' | 'skeleton' | 'pet' | 'data';
  size?: 'sm' | 'md' | 'lg';
  inline?: boolean;
  fullScreen?: boolean;
  timeout?: number; // Timeout em ms para auto-hide
  showProgress?: boolean;
}

class LoadingManager {
  private listeners: Set<(states: Map<string, LoadingState>) => void> = new Set();
  private states: Map<string, LoadingState> = new Map();
  private timeouts: Map<string, NodeJS.Timeout> = new Map();

  subscribe(listener: (states: Map<string, LoadingState>) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.states));
  }

  start(id: string, config: LoadingConfig = {}) {
    const { timeout, ...loadingConfig } = config;

    const state: LoadingState = {
      id,
      isLoading: true,
      ...loadingConfig,
    };

    this.states.set(id, state);
    this.notify();

    // Configurar timeout se especificado
    if (timeout) {
      const timeoutId = setTimeout(() => {
        this.stop(id);
      }, timeout);
      this.timeouts.set(id, timeoutId);
    }
  }

  stop(id: string) {
    this.states.delete(id);

    // Limpar timeout se existir
    const timeoutId = this.timeouts.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.timeouts.delete(id);
    }

    this.notify();
  }

  update(id: string, updates: Partial<LoadingState>) {
    const currentState = this.states.get(id);
    if (currentState) {
      this.states.set(id, { ...currentState, ...updates });
      this.notify();
    }
  }

  getState(id: string): LoadingState | undefined {
    return this.states.get(id);
  }

  getAllStates(): Map<string, LoadingState> {
    return new Map(this.states);
  }

  clearAll() {
    this.states.clear();
    this.timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
    this.timeouts.clear();
    this.notify();
  }
}

// Instância global do gerenciador
const loadingManager = new LoadingManager();

export function useLoading() {
  const [states, setStates] = useState<Map<string, LoadingState>>(new Map());

  useEffect(() => {
    const unsubscribe = loadingManager.subscribe(setStates);
    return unsubscribe;
  }, []);

  const startLoading = useCallback((id: string, config: LoadingConfig = {}) => {
    loadingManager.start(id, config);
  }, []);

  const stopLoading = useCallback((id: string) => {
    loadingManager.stop(id);
  }, []);

  const updateLoading = useCallback((id: string, updates: Partial<LoadingState>) => {
    loadingManager.update(id, updates);
  }, []);

  const getLoadingState = useCallback((id: string) => {
    return loadingManager.getState(id);
  }, []);

  const isLoading = useCallback((id: string) => {
    return loadingManager.getState(id)?.isLoading || false;
  }, []);

  const clearAll = useCallback(() => {
    loadingManager.clearAll();
  }, []);

  return {
    states,
    startLoading,
    stopLoading,
    updateLoading,
    getLoadingState,
    isLoading,
    clearAll,
  };
}

// Hook para usar loading com ID automático
export function useLoadingState(config: LoadingConfig = {}) {
  const idRef = useRef<string>(`loading-${Math.random().toString(36).substr(2, 9)}`);
  const { startLoading, stopLoading, updateLoading, getLoadingState, isLoading } = useLoading();

  const start = useCallback(
    (customConfig?: LoadingConfig) => {
      startLoading(idRef.current, { ...config, ...customConfig });
    },
    [startLoading, config],
  );

  const stop = useCallback(() => {
    stopLoading(idRef.current);
  }, [stopLoading]);

  const update = useCallback(
    (updates: Partial<LoadingState>) => {
      updateLoading(idRef.current, updates);
    },
    [updateLoading],
  );

  const getState = useCallback(() => {
    return getLoadingState(idRef.current);
  }, [getLoadingState]);

  const loading = useCallback(() => {
    return isLoading(idRef.current);
  }, [isLoading]);

  return {
    start,
    stop,
    update,
    getState,
    loading,
    id: idRef.current,
  };
}

// Hook para loading com async/await
export function useAsyncLoading(config: LoadingConfig = {}) {
  const { start, stop, update } = useLoadingState(config);

  const withLoading = useCallback(
    async <T>(asyncFn: () => Promise<T>, customConfig?: LoadingConfig): Promise<T> => {
      try {
        start(customConfig);
        const result = await asyncFn();
        return result;
      } finally {
        stop();
      }
    },
    [start, stop],
  );

  return {
    withLoading,
    start,
    stop,
    update,
  };
}

// Hook para loading de dados específicos
export function useDataLoading<T>(fetchFn: () => Promise<T>, config: LoadingConfig = {}) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { withLoading } = useAsyncLoading(config);

  const fetch = useCallback(async () => {
    try {
      setError(null);
      const result = await withLoading(fetchFn);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      throw err;
    }
  }, [fetchFn, withLoading]);

  return {
    data,
    error,
    fetch,
    setData,
    setError,
  };
}
