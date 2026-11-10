/**
 * Переиспользуемый хук для управления состоянием формы заказа.
 * Устраняет дублирование логики редактирования между
 * OrdersTableRow и OrderDetailsPage.
 */

import { useState, useCallback } from 'react';

import type {
  Order,
  OrderFormValues,
  EditingState,
  OrderFormField,
  OrderFormFieldValue,
  FormErrors,
} from '@/types/order';
import { validateOrderForm, validateSingleField, hasFormErrors } from '@/utils/validation';

interface UseOrderFormOptions {
  /** Начальные значения из заказа */
  order: Order;
  /** Callback при сохранении (вызывается с валидными значениями) */
  onSave: (values: OrderFormValues) => void;
}

interface UseOrderFormReturn {
  /** Текущее состояние редактирования */
  editing: EditingState;
  /** Ошибки валидации */
  errors: FormErrors;
  /** Начать редактирование */
  startEdit: () => void;
  /** Отменить редактирование */
  cancelEdit: () => void;
  /** Сохранить изменения (с валидацией) */
  saveEdit: () => boolean;
  /** Обработчик изменения поля */
  handleFieldChange: (field: OrderFormField, value: OrderFormFieldValue) => void;
  /** Есть ли ошибки валидации */
  hasErrors: boolean;
}

/**
 * Хук формы редактирования заказа.
 * Инкапсулирует: состояние, валидацию, обработчики.
 */
export const useOrderForm = ({ order, onSave }: UseOrderFormOptions): UseOrderFormReturn => {
  const [editing, setEditing] = useState<EditingState>({
    isEditing: false,
    values: {
      name: order.name,
      client: order.client,
      price: order.price,
      date: order.date,
      status: order.status,
    },
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const startEdit = useCallback(() => {
    setEditing({
      isEditing: true,
      values: {
        name: order.name,
        client: order.client,
        price: order.price,
        date: order.date,
        status: order.status,
      },
    });
    setErrors({});
  }, [order]);

  const cancelEdit = useCallback(() => {
    setEditing((prev) => ({ ...prev, isEditing: false }));
    setErrors({});
  }, []);

  const saveEdit = useCallback((): boolean => {
    const validationErrors = validateOrderForm(editing.values);
    setErrors(validationErrors);

    if (hasFormErrors(validationErrors)) {
      return false;
    }

    onSave(editing.values);
    setEditing((prev) => ({ ...prev, isEditing: false }));
    return true;
  }, [editing.values, onSave]);

  const handleFieldChange = useCallback(
    (field: OrderFormField, value: OrderFormFieldValue) => {
      setEditing((prev) => ({
        ...prev,
        values: { ...prev.values, [field]: value },
      }));

      // Real-time валидация изменённого поля
      const fieldError = validateSingleField(field, value as string | number);
      setErrors((prev) => ({
        ...prev,
        [field]: fieldError,
      }));
    },
    [],
  );

  const currentHasErrors = hasFormErrors(errors);

  return {
    editing,
    errors,
    startEdit,
    cancelEdit,
    saveEdit,
    handleFieldChange,
    hasErrors: currentHasErrors,
  };
};
