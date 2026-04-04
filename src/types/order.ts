export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface Order {
    id: string;
    name: string;
    client: string;
    price: number;
    date: string;
    status: OrderStatus;
}
