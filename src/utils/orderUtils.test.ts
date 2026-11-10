/**
 * Тесты для утилит работы с заказами.
 */

import { describe, it, expect } from 'vitest';
import {
  getStatusText,
  getStatusColor,
  formatPrice,
  formatDate,
  areOrdersEqual,
  generateOrderId,
  cloneOrders,
} from './orderUtils';
import type { Order } from '@/types/order';

// --- getStatusText ---

describe('getStatusText', () => {
  it('возвращает правильный текст для каждого статуса', () => {
    expect(getStatusText('pending')).toBe('Ожидает');
    expect(getStatusText('processing')).toBe('В обработке');
    expect(getStatusText('completed')).toBe('Выполнен');
    expect(getStatusText('cancelled')).toBe('Отменён');
  });
});

// --- getStatusColor ---

describe('getStatusColor', () => {
  it('возвращает правильный цвет для каждого статуса', () => {
    expect(getStatusColor('pending')).toBe('warning');
    expect(getStatusColor('processing')).toBe('info');
    expect(getStatusColor('completed')).toBe('success');
    expect(getStatusColor('cancelled')).toBe('error');
  });
});

// --- formatPrice ---

describe('formatPrice', () => {
  it('форматирует цену в российском формате', () => {
    // ru-RU locale использует неразрывный пробел (U+00A0) как разделитель тысяч
    const nbsp = '\u00A0';
    expect(formatPrice(159990)).toBe(`159${nbsp}990 ₽`);
    expect(formatPrice(1000)).toBe(`1${nbsp}000 ₽`);
    expect(formatPrice(0)).toBe('0 ₽');
  });

  it('форматирует дробные цены', () => {
    expect(formatPrice(99.99)).toBe('99,99 ₽');
  });
});

// --- formatDate ---

describe('formatDate', () => {
  it('форматирует дату в российском формате', () => {
    expect(formatDate('2024-03-15')).toBe('15.03.2024');
  });

  it('обрабатывает разные даты', () => {
    expect(formatDate('2024-01-01')).toBe('01.01.2024');
    expect(formatDate('2024-12-31')).toBe('31.12.2024');
  });
});

// --- areOrdersEqual ---

describe('areOrdersEqual', () => {
  const orderA: Order = {
    id: 'ORD-001',
    name: 'Test',
    client: 'Client',
    price: 100,
    date: '2024-01-01',
    status: 'pending',
  };

  const orderB: Order = {
    id: 'ORD-001',
    name: 'Test',
    client: 'Client',
    price: 100,
    date: '2024-01-01',
    status: 'pending',
  };

  it('возвращает true для одинаковых массивов', () => {
    expect(areOrdersEqual([orderA], [orderB])).toBe(true);
  });

  it('возвращает true для undefined', () => {
    expect(areOrdersEqual(undefined, undefined)).toBe(true);
  });

  it('возвращает false если один undefined', () => {
    expect(areOrdersEqual([orderA], undefined)).toBe(false);
    expect(areOrdersEqual(undefined, [orderA])).toBe(false);
  });

  it('возвращает false для разной длины', () => {
    expect(areOrdersEqual([orderA], [orderA, orderB])).toBe(false);
  });

  it('возвращает false для разных данных', () => {
    const different: Order = { ...orderB, name: 'Different' };
    expect(areOrdersEqual([orderA], [different])).toBe(false);
  });
});

// --- generateOrderId ---

describe('generateOrderId', () => {
  it('генерирует ORD-001 для пустого массива', () => {
    expect(generateOrderId([])).toBe('ORD-001');
  });

  it('генерирует следующий ID после максимального', () => {
    const orders: Order[] = [
      { id: 'ORD-001', name: 'A', client: 'C', price: 1, date: '2024-01-01', status: 'pending' },
      { id: 'ORD-003', name: 'B', client: 'C', price: 2, date: '2024-01-01', status: 'pending' },
    ];
    expect(generateOrderId(orders)).toBe('ORD-004');
  });

  it('обрабатывает нестандартные ID без краша', () => {
    const orders: Order[] = [
      { id: 'ORD-001', name: 'A', client: 'C', price: 1, date: '2024-01-01', status: 'pending' },
      { id: 'INVALID' as Order['id'], name: 'B', client: 'C', price: 2, date: '2024-01-01', status: 'pending' },
    ];
    // Не должно крашиться, должно сгенерировать ORD-002
    expect(generateOrderId(orders)).toBe('ORD-002');
  });
});

// --- cloneOrders ---

describe('cloneOrders', () => {
  it('создаёт глубокую копию массива', () => {
    const orders: Order[] = [
      { id: 'ORD-001', name: 'Test', client: 'Client', price: 100, date: '2024-01-01', status: 'pending' },
    ];
    const cloned = cloneOrders(orders);

    // Равенство значений
    expect(cloned).toEqual(orders);
    // Разные ссылки
    expect(cloned).not.toBe(orders);
    expect(cloned[0]).not.toBe(orders[0]);
  });
});
