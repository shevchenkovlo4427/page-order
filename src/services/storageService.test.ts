/**
 * Тесты для сервиса localStorage.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { saveOrders, loadOrders, clearOrders, hasSavedOrders } from './storageService';
import type { Order } from '@/types/order';

// Мок localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

const sampleOrders: Order[] = [
  {
    id: 'ORD-001',
    name: 'Test',
    client: 'Client',
    price: 100,
    date: '2024-01-01',
    status: 'pending',
  },
];

describe('storageService', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  // --- saveOrders ---

  describe('saveOrders', () => {
    it('сохраняет заказы в localStorage', () => {
      saveOrders(sampleOrders);
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
  });

  // --- loadOrders ---

  describe('loadOrders', () => {
    it('возвращает null если localStorage пуст', () => {
      expect(loadOrders()).toBeNull();
    });

    it('загружает сохранённые заказы', () => {
      saveOrders(sampleOrders);
      const loaded = loadOrders();
      expect(loaded).toEqual(sampleOrders);
    });

    it('возвращает null и очищает при невалидном JSON', () => {
      localStorageMock.setItem('orders_data', '{invalid json');
      const loaded = loadOrders();
      expect(loaded).toBeNull();
      expect(localStorageMock.removeItem).toHaveBeenCalled();
    });

    it('возвращает null если данные не массив', () => {
      localStorageMock.setItem('orders_data', '"not an array"');
      const loaded = loadOrders();
      expect(loaded).toBeNull();
    });
  });

  // --- clearOrders ---

  describe('clearOrders', () => {
    it('удаляет данные из localStorage', () => {
      saveOrders(sampleOrders);
      clearOrders();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('orders_data');
    });
  });

  // --- hasSavedOrders ---

  describe('hasSavedOrders', () => {
    it('возвращает false если данных нет', () => {
      expect(hasSavedOrders()).toBe(false);
    });

    it('возвращает true если данные есть', () => {
      saveOrders(sampleOrders);
      expect(hasSavedOrders()).toBe(true);
    });
  });
});
