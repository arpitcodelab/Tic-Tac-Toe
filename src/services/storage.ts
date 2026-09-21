import type { StateStorage } from 'zustand/middleware';

class MemoryStorage implements StateStorage {
  private store = new Map<string, string>();

  getItem(name: string): string | null {
    return this.store.get(name) ?? null;
  }

  setItem(name: string, value: string): void {
    this.store.set(name, value);
  }

  removeItem(name: string): void {
    this.store.delete(name);
  }
}

const memoryFallback = new MemoryStorage();

/**
 * Safe wrapper around localStorage that seamlessly falls back to an in-memory
 * store if localStorage is blocked (e.g. private browsing mode) or throws quota errors.
 */
export const safeStorage: StateStorage = {
  getItem(name: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(name);
      }
    } catch {
      // Fallback to memory
    }
    return memoryFallback.getItem(name);
  },

  setItem(name: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(name, value);
        return;
      }
    } catch {
      // Fallback to memory
    }
    memoryFallback.setItem(name, value);
  },

  removeItem(name: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(name);
        return;
      }
    } catch {
      // Fallback to memory
    }
    memoryFallback.removeItem(name);
  },
};

