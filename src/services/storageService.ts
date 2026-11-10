/**
 * Сервис для работы с localStorage.
 * Инкапсулирует логику сериализации/десериализации
 * и обеспечивает безопасную обработку ошибок.
 */

import type { Order } from '@/types/order';

const STORAGE_KEY = 'orders_data';

/**
 * Безопасное сохранение заказов в localStorage.
 * Оборачивает операцию в try-catch для обработки квоты exceeded и других ошибок.
 */
export const saveOrders = (orders: Order[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (error) {
    // localStorage может быть недоступен (private mode) или переполнен
    console.error('Failed to save orders to localStorage:', error);
  }
};

/**
 * Безопасная загрузка заказов из localStorage.
 * Возвращает null при отсутствии данных или ошибке парсинга.
 */
export const loadOrders = (): Order[] | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    const parsed: unknown = JSON.parse(saved);

    // Базовая валидация структуры данных
    if (!Array.isArray(parsed)) {
      console.warn('Invalid data in localStorage: expected array, got', typeof parsed);
      return null;
    }

    return parsed as Order[];
  } catch (error) {
    console.error('Failed to load orders from localStorage:', error);
    // Повреждённые данные — очищаем
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

/**
 * Очистка сохранённых заказов.
 */
export const clearOrders = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear orders from localStorage:', error);
  }
};

/**
 * Проверка наличия сохранённых заказов.
 */
export const hasSavedOrders = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
};
