/**
 * API-слой для работы с заказами.
 * В продакшене здесь будут реальные HTTP-запросы.
 * Сейчас — мок с искусственной задержкой для имитации сети.
 */

import { orders as mockOrders } from '@/mocks/orders';
import type { Order } from '@/types/order';

/** Искусственная задержка для имитации сетевого запроса */
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Загрузка списка заказов.
 * В реальном приложении: const response = await fetch('/api/orders');
 */
export const fetchOrders = async (): Promise<Order[]> => {
  await delay(500);
  return mockOrders;
};
