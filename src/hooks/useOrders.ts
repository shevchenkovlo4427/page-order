/**
 * Хук для загрузки заказов через React Query.
 * Отвечает только за серверное состояние (fetch).
 */

import { useQuery } from '@tanstack/react-query';
import { fetchOrders } from '@/api/ordersApi';

/** Ключ запроса заказов — для инвалидации в других местах */
export const ORDERS_QUERY_KEY = ['orders'] as const;

export const useOrdersQuery = () => {
  return useQuery({
    queryKey: ORDERS_QUERY_KEY,
    queryFn: fetchOrders,
  });
};
