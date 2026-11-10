/**
 * Контекст управления заказами.
 * Отвечает за: загрузку, CRUD-операции, синхронизацию с localStorage,
 * отслеживание изменений.
 *
 * Разделение ответственности:
 * - Серверное состояние: React Query (useOrdersQuery)
 * - Клиентское состояние: React Context (orders, originalOrders)
 * - Персистенция: storageService (localStorage)
 */

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from 'react';

import type { Order, CreateOrderData, UpdateOrderData } from '@/types/order';
import { useOrdersQuery } from '@/hooks/useOrders';
import { saveOrders, loadOrders } from '@/services/storageService';
import { areOrdersEqual, generateOrderId, cloneOrders } from '@/utils/orderUtils';

/** Публичный интерфейс контекста заказов */
interface OrdersContextValue {
  /** Текущий список заказов (может содержать несохранённые изменения) */
  orders: Order[];
  /** Исходный список заказов (последнее сохранённое состояние) */
  originalOrders: Order[];
  /** Загрузка данных с сервера */
  isLoading: boolean;
  /** Ошибка загрузки */
  error: Error | null;
  /** Есть ли несохранённые изменения */
  hasChanges: boolean;
  /** Получить заказ по ID */
  getOrderById: (id: string) => Order | undefined;
  /** Обновить заказ (частично) */
  updateOrder: (id: string, updates: UpdateOrderData) => void;
  /** Добавить новый заказ */
  addOrder: (data: CreateOrderData) => void;
  /** Удалить заказ */
  deleteOrder: (id: string) => void;
  /** Сохранить все изменения в localStorage */
  saveChanges: () => void;
  /** Откатить все изменения к последнему сохранённому состоянию */
  resetChanges: () => void;
  /** Повторно загрузить данные с сервера */
  refetchOrders: () => void;
}

const OrdersContext = createContext<OrdersContextValue | undefined>(undefined);

/** Пустое начальное состояние для orders */
const EMPTY_ORDERS: Order[] = [];

interface OrdersProviderProps {
  children: ReactNode;
}

export const OrdersProvider = ({ children }: OrdersProviderProps) => {
  const { data: fetchedOrders, isLoading, error, refetch: refetchOrders } = useOrdersQuery();

  const [orders, setOrders] = useState<Order[]>(EMPTY_ORDERS);
  const [originalOrders, setOriginalOrders] = useState<Order[]>(EMPTY_ORDERS);
  const [isInitialized, setIsInitialized] = useState(false);

  // Инициализация данных: приоритет localStorage, fallback — серверные данные
  useEffect(() => {
    if (isInitialized) return;

    // Сначала проверяем localStorage
    const savedOrders = loadOrders();
    if (savedOrders && savedOrders.length > 0) {
      setOrders(savedOrders);
      setOriginalOrders(cloneOrders(savedOrders));
      setIsInitialized(true);
      return;
    }

    // Если localStorage пуст — используем данные с сервера
    if (fetchedOrders) {
      setOrders(fetchedOrders);
      setOriginalOrders(cloneOrders(fetchedOrders));
      setIsInitialized(true);
    }
  }, [fetchedOrders, isInitialized]);

  // Отслеживание наличия изменений (побитовое сравнение вместо JSON.stringify)
  const hasChanges = useMemo(() => {
    return !areOrdersEqual(orders, originalOrders);
  }, [orders, originalOrders]);

  const getOrderById = useCallback(
    (id: string): Order | undefined => {
      return orders.find((order) => order.id === id);
    },
    [orders],
  );

  const updateOrder = useCallback((id: string, updates: UpdateOrderData) => {
    setOrders((prev) =>
      prev.map((order) => (order.id === id ? { ...order, ...updates } : order)),
    );
  }, []);

  const addOrder = useCallback((data: CreateOrderData) => {
    setOrders((prev) => {
      const newId = generateOrderId(prev);
      const newOrder: Order = { id: newId, ...data };
      return [...prev, newOrder];
    });
  }, []);

  const deleteOrder = useCallback((id: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== id));
  }, []);

  const saveChanges = useCallback(() => {
    saveOrders(orders);
    setOriginalOrders(cloneOrders(orders));
  }, [orders]);

  const resetChanges = useCallback(() => {
    setOrders(cloneOrders(originalOrders));
  }, [originalOrders]);

  const value = useMemo<OrdersContextValue>(
    () => ({
      orders,
      originalOrders,
      isLoading,
      error,
      hasChanges,
      getOrderById,
      updateOrder,
      addOrder,
      deleteOrder,
      saveChanges,
      resetChanges,
      refetchOrders,
    }),
    [
      orders,
      originalOrders,
      isLoading,
      error,
      hasChanges,
      getOrderById,
      updateOrder,
      addOrder,
      deleteOrder,
      saveChanges,
      resetChanges,
      refetchOrders,
    ],
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
};

/**
 * Хук для доступа к контексту заказов.
 * Бросает ошибку, если использован вне OrdersProvider.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useOrdersContext = (): OrdersContextValue => {
  const context = useContext(OrdersContext);

  if (context === undefined) {
    throw new Error('useOrdersContext must be used within an OrdersProvider');
  }

  return context;
};
