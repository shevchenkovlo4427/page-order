/**
 * Тесты для валидации формы заказа.
 */

import { describe, it, expect } from 'vitest';
import { validateOrderForm, hasFormErrors, validateSingleField } from './validation';
import type { OrderFormValues } from '@/types/order';

const validForm: OrderFormValues = {
  name: 'Ноутбук',
  client: 'ООО "ТехноСити"',
  price: 159990,
  date: '2024-03-15',
  status: 'pending',
};

// --- validateOrderForm ---

describe('validateOrderForm', () => {
  it('возвращает пустой объект для валидной формы', () => {
    const errors = validateOrderForm(validForm);
    expect(hasFormErrors(errors)).toBe(false);
  });

  it('требует название', () => {
    const errors = validateOrderForm({ ...validForm, name: '' });
    expect(errors.name).toBeDefined();
  });

  it('требует название минимум 2 символа', () => {
    const errors = validateOrderForm({ ...validForm, name: 'А' });
    expect(errors.name).toBeDefined();
  });

  it('требует клиента', () => {
    const errors = validateOrderForm({ ...validForm, client: '' });
    expect(errors.client).toBeDefined();
  });

  it('требует положительную цену', () => {
    const errors = validateOrderForm({ ...validForm, price: 0 });
    expect(errors.price).toBeDefined();
  });

  it('требует отрицательную цену как ошибку', () => {
    const errors = validateOrderForm({ ...validForm, price: -100 });
    expect(errors.price).toBeDefined();
  });

  it('требует дату', () => {
    const errors = validateOrderForm({ ...validForm, date: '' });
    expect(errors.date).toBeDefined();
  });
});

// --- validateSingleField ---

describe('validateSingleField', () => {
  it('возвращает undefined для валидного поля', () => {
    expect(validateSingleField('name', 'Ноутбук')).toBeUndefined();
    expect(validateSingleField('price', 100)).toBeUndefined();
  });

  it('возвращает ошибку для невалидного поля', () => {
    expect(validateSingleField('name', '')).toBeDefined();
    expect(validateSingleField('price', 0)).toBeDefined();
  });
});

// --- hasFormErrors ---

describe('hasFormErrors', () => {
  it('возвращает false для пустого объекта', () => {
    expect(hasFormErrors({})).toBe(false);
  });

  it('возвращает true при наличии ошибок', () => {
    expect(hasFormErrors({ name: 'Обязательно' })).toBe(true);
  });
});
