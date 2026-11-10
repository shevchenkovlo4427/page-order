/**
 * Утилиты для работы с заказами.
 * Все функции чистые (pure) и легко тестируемы.
 */

import {
  type Order,
  type OrderId,
  type OrderStatus,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
} from '@/types/order';

/** Получить отображаемый текст для статуса заказа */
export const getStatusText = (status: OrderStatus): string => {
  return ORDER_STATUS_LABELS[status];
};

/** Получить цвет MUI Chip для статуса заказа */
export const getStatusColor = (status: OrderStatus): 'success' | 'info' | 'warning' | 'error' => {
  return ORDER_STATUS_COLORS[status];
};

/** Форматирование цены в российском формате */
export const formatPrice = (price: number): string => {
  return `${price.toLocaleString('ru-RU')} ₽`;
};

/** Форматирование даты в российском формате */
export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('ru-RU');
};

/**
 * Глубокое сравнение двух массивов заказов.
 * Заменяет ненадёжный JSON.stringify — учитывает порядок полей.
 */
export const areOrdersEqual = (a: Order[] | undefined, b: Order[] | undefined): boolean => {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;

  return a.every((orderA, index) => {
    const orderB = b[index];
    return (
      orderA.id === orderB.id &&
      orderA.name === orderB.name &&
      orderA.client === orderB.client &&
      orderA.price === orderB.price &&
      orderA.date === orderB.date &&
      orderA.status === orderB.status
    );
  });
};

/**
 * Генерация ID для нового заказа.
 * Использует structured approach вместо хрупкого split/parseInt.
 */
export const generateOrderId = (orders: Order[]): OrderId => {
  const maxNum = orders.reduce((max, order) => {
    // Извлекаем числовую часть из "ORD-XXX"
    const match = order.id.match(/^ORD-(\d+)$/);
    const num = match ? parseInt(match[1], 10) : 0;
    return Number.isFinite(num) && num > max ? num : max;
  }, 0);

  const nextNum = maxNum + 1;
  return `ORD-${nextNum.toString().padStart(3, '0')}` as OrderId;
};

/**
 * Безопасное глубокое клонирование массива заказов.
 * Использует structuredClone (доступен в современных браузерах)
 * с fallback на JSON round-trip.
 */
export const cloneOrders = (orders: Order[]): Order[] => {
  if (typeof structuredClone === 'function') {
    return structuredClone(orders);
  }
  // Fallback для старых браузеров (Date/undefined не поддерживаются)
  return JSON.parse(JSON.stringify(orders));
};

/**
 * Сортировка заказов по колонке и направлению.
 */
export const sortOrders = (orders: Order[], column: keyof Order, direction: 'asc' | 'desc'): Order[] => {
  return [...orders].sort((a, b) => {
    const aValue = a[column];
    const bValue = b[column];

    if (aValue === bValue) return 0;

    const comparison = aValue < bValue ? -1 : 1;
    return direction === 'asc' ? comparison : -comparison;
  });
};

/**
 * Фильтрация заказов по поисковым фильтрам.
 * Поиск регистронезависимый и частичный (contains).
 * Для статусов — фильтрация по массиву выбранных значений.
 * Для дат — фильтрация по одной дате или диапазону.
 */
export const filterOrders = (
  orders: Order[],
  filters: {
    id?: string;
    name?: string;
    client?: string;
    price?: string;
    date?: string | { start: string; end: string };
    status?: OrderStatus[];
  },
): Order[] => {
  return orders.filter((order) => {
    return Object.entries(filters).every(([column, searchValue]) => {
      if (!searchValue) return true;

      // Специальная обработка для статусов
      if (column === 'status' && Array.isArray(searchValue)) {
        return searchValue.includes(order.status);
      }

      // Специальная обработка для дат (одна дата или диапазон)
      if (column === 'date') {
        const orderDate = new Date(order.date);
        if (typeof searchValue === 'string') {
          // Фильтрация по одной дате
          const filterDate = new Date(searchValue);
          return orderDate.toDateString() === filterDate.toDateString();
        } else if (typeof searchValue === 'object' && 'start' in searchValue && 'end' in searchValue) {
          // Фильтрация по диапазону дат
          const startDate = new Date(searchValue.start);
          const endDate = new Date(searchValue.end);
          return orderDate >= startDate && orderDate <= endDate;
        }
        return true;
      }

      // Обычный текстовый поиск для остальных полей
      const value = String(order[column as keyof Order]).toLowerCase();
      return value.includes(String(searchValue).toLowerCase());
    });
  });
};
