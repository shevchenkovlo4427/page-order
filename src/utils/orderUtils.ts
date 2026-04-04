import { OrderStatus } from '../types/order';

export const getStatusText = (status: OrderStatus): string => {
    const statusMap: Record<OrderStatus, string> = {
        pending: 'Ожидает',
        processing: 'В обработке',
        completed: 'Выполнен',
        cancelled: 'Отменён'
    };
    return statusMap[status];
};

export const getStatusColor = (status: OrderStatus): 'success' | 'info' | 'warning' | 'error' => {
    const colorMap: Record<OrderStatus, 'success' | 'info' | 'warning' | 'error'> = {
        completed: 'success',
        processing: 'info',
        pending: 'warning',
        cancelled: 'error'
    };
    return colorMap[status];
};

export const formatPrice = (price: number): string => {
    return `${price.toLocaleString('ru-RU')} ₽`;
};

export const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('ru-RU');
};
