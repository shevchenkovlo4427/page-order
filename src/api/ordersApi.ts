import { orders } from '../mocks/orders';
import {Order} from "../types/order";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchOrders = async (): Promise<Order[]> => {
    await delay(500);
    return orders;
};
