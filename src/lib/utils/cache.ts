interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class Cache {
  private cache = new Map<string, CacheItem<unknown>>();
  private defaultTTL = 5 * 60 * 1000;

  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL,
    });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data as T;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  invalidatePattern(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }
}

export const cache = new Cache();

export const cacheKeys = {
  payments: {
    list: 'payments:list',
    byId: (id: number) => `payments:${id}`,
    byUser: (userId: number) => `payments:user:${userId}`,
  },
  subscriptions: {
    current: 'subscriptions:current',
    byId: (id: number) => `subscriptions:${id}`,
    byUser: (userId: number) => `subscriptions:user:${userId}`,
  },
  plans: {
    list: 'plans:list',
    byId: (id: number) => `plans:${id}`,
    bySlug: (slug: string) => `plans:slug:${slug}`,
  },
};

export function invalidateUserData(userId: number): void {
  cache.invalidatePattern(`payments:user:${userId}`);
  cache.invalidatePattern(`subscriptions:user:${userId}`);
  cache.invalidate(cacheKeys.payments.list);
  cache.invalidate(cacheKeys.subscriptions.current);
}

export function invalidatePaymentData(): void {
  cache.invalidatePattern('payments:');
}

export function invalidateSubscriptionData(): void {
  cache.invalidatePattern('subscriptions:');
}

export function invalidatePlanData(): void {
  cache.invalidatePattern('plans:');
}
