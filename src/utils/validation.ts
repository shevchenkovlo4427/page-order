/**
 * Валидация формы заказа.
 * Централизованная логика валидации — используется
 * как при создании, так и при редактировании.
 */

import type { OrderFormValues, FormErrors, OrderFormField } from '@/types/order';

/** Правила валидации для каждого поля */
const validateField = (field: OrderFormField, value: string | number): string | undefined => {
  switch (field) {
    case 'name':
      if (!String(value).trim()) return 'Название обязательно';
      if (String(value).trim().length < 2) return 'Минимум 2 символа';
      return undefined;

    case 'client':
      if (!String(value).trim()) return 'Клиент обязателен';
      if (String(value).trim().length < 2) return 'Минимум 2 символа';
      return undefined;

    case 'price':
      if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0)
        return 'Цена должна быть больше 0';
      return undefined;

    case 'date':
      if (!value) return 'Дата обязательна';
      if (isNaN(Date.parse(String(value)))) return 'Некорректная дата';
      return undefined;

    case 'status':
      if (!value) return 'Статус обязателен';
      return undefined;

    default:
      return undefined;
  }
};

/**
 * Валидация всей формы заказа.
 * Возвращает объект с ошибками (пустой объект = валидно).
 */
export const validateOrderForm = (values: OrderFormValues): FormErrors => {
  const errors: FormErrors = {};

  const fields: OrderFormField[] = ['name', 'client', 'price', 'date', 'status'];

  for (const field of fields) {
    const error = validateField(field, values[field]);
    if (error) {
      errors[field] = error;
    }
  }

  return errors;
};

/**
 * Проверка, есть ли ошибки в форме.
 */
export const hasFormErrors = (errors: FormErrors): boolean => {
  return Object.values(errors).some((error) => Boolean(error));
};

/**
 * Валидация отдельного поля (для real-time валидации).
 */
export const validateSingleField = (
  field: OrderFormField,
  value: string | number,
): string | undefined => {
  return validateField(field, value);
};
