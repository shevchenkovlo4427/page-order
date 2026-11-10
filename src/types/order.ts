/**
 * Типы доменной области "Заказ".
 * Все типы строго типизированы для предотвращения ошибок на этапе компиляции.
 */

/** Статус заказа — union type с фиксированным набором значений */
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

/** Основной интерфейс заказа */
export interface Order {
  readonly id: OrderId;
  name: string;
  client: string;
  price: number;
  date: string;
  status: OrderStatus;
}

/** Брендовый тип для ID заказа — предотвращает передачу произвольных строк */
export type OrderId = `ORD-${string}`;

/** Данные для создания заказа (без ID — генерируется автоматически) */
export type CreateOrderData = Omit<Order, 'id'>;

/** Данные для обновления заказа — все поля опциональны */
export type UpdateOrderData = Partial<CreateOrderData>;

/** Значения формы редактирования заказа */
export interface OrderFormValues {
  name: string;
  client: string;
  price: number;
  date: string;
  status: OrderStatus;
}

/** Состояние формы редактирования */
export interface EditingState {
  isEditing: boolean;
  values: OrderFormValues;
}

/** Ключи полей формы — для типобезопасного onChange */
export type OrderFormField = keyof OrderFormValues;

/** Тип значения поля формы */
export type OrderFormFieldValue = string | number | OrderStatus;

/** Ошибки валидации формы */
export type FormErrors = Partial<Record<OrderFormField, string>>;

/** Маппинг статус → отображаемый текст */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Ожидает',
  processing: 'В обработке',
  completed: 'Выполнен',
  cancelled: 'Отменён',
} as const;

/** Маппинг статус → цвет MUI Chip */
export const ORDER_STATUS_COLORS: Record<OrderStatus, 'success' | 'info' | 'warning' | 'error'> = {
  completed: 'success',
  processing: 'info',
  pending: 'warning',
  cancelled: 'error',
} as const;

/** Ключи колонок таблицы заказов */
export type OrderColumn = 'id' | 'name' | 'client' | 'price' | 'date' | 'status';

/** Маппинг колонка → заголовок */
export const ORDER_COLUMN_LABELS: Record<OrderColumn, string> = {
  id: 'ID',
  name: 'Название',
  client: 'Клиент',
  price: 'Цена',
  date: 'Дата',
  status: 'Статус',
} as const;

/** Направление сортировки */
export type SortDirection = 'asc' | 'desc';

/** Конфигурация сортировки */
export interface SortConfig {
  column: OrderColumn;
  direction: SortDirection;
}

/** Фильтры поиска по колонкам */
export type SearchFilters = {
  id?: string;
  name?: string;
  client?: string;
  price?: string;
  date?: string | { start: string; end: string };
  status?: OrderStatus[];
};

/** Минимальное количество символов для активации поиска */
export const SEARCH_MIN_CHARS = 2;
