import React, { createContext, useContext, useCallback, useMemo, ReactNode, useState, useEffect } from 'react';
import { Order } from '../types/order';
import { useOrders } from '../hooks/useOrders';

interface OrdersContextType {
    orders: Order[] | undefined;
    originalOrders: Order[] | undefined;
    isLoadingOrders: boolean;
    errorOrders: Error | null;
    hasChanges: boolean;
    getOrderById: (id: string) => Order | undefined;
    updateOrder: (id: string, updates: Partial<Order>) => void;
    addOrder: (order: Omit<Order, 'id'>) => void;
    deleteOrder: (id: string) => void;
    saveChanges: () => void;
    resetChanges: () => void;
    refetchOrders: () => void;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

const STORAGE_KEY = 'orders_data';

const saveToLocalStorage = (orders: Order[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
};

const loadFromLocalStorage = (): Order[] | null => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        return JSON.parse(saved);
    }
    return null;
};

const generateOrderId = (orders: Order[]): string => {
    const maxId = orders.reduce((max, order) => {
        const num = parseInt(order.id.split('-')[1]);
        return num > max ? num : max;
    }, 0);
    const newNum = maxId + 1;
    return `ORD-${newNum.toString().padStart(3, '0')}`;
};

export const OrdersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { data: fetchedOrders, isLoading: isLoadingOrders, error: errorOrders, refetch: refetchOrders } = useOrders();
    const [orders, setOrders] = useState<Order[] | undefined>(undefined);
    const [originalOrders, setOriginalOrders] = useState<Order[] | undefined>(undefined);

    useEffect(() => {
        const savedOrders = loadFromLocalStorage();

        if (savedOrders && savedOrders.length > 0) {
            setOrders(savedOrders);
            setOriginalOrders(JSON.parse(JSON.stringify(savedOrders)));
            console.log('из localStorage:', savedOrders);
        } else if (fetchedOrders) {
            setOrders(fetchedOrders);
            setOriginalOrders(JSON.parse(JSON.stringify(fetchedOrders)));
            console.log('из mocks:', fetchedOrders);
        }
    }, [fetchedOrders]);

    const hasChanges = useMemo(() => {
        if (!orders || !originalOrders) return false;
        return JSON.stringify(orders) !== JSON.stringify(originalOrders);
    }, [orders, originalOrders]);

    const getOrderById = useCallback((id: string): Order | undefined => {
        return orders?.find(order => order.id === id);
    }, [orders]);

    const updateOrder = useCallback((id: string, updates: Partial<Order>) => {
        setOrders(prevOrders => {
            if (!prevOrders) return prevOrders;
            return prevOrders.map(order =>
                order.id === id ? { ...order, ...updates } : order
            );
        });
    }, []);

    const addOrder = useCallback((newOrder: Omit<Order, 'id'>) => {
        setOrders(prevOrders => {
            if (!prevOrders) return [{
                id: 'ORD-001',
                ...newOrder
            }];

            const newId = generateOrderId(prevOrders);
            const orderWithId: Order = {
                id: newId,
                ...newOrder
            };

            return [...prevOrders, orderWithId];
        });
    }, []);

    const deleteOrder = useCallback((id: string) => {
        setOrders(prevOrders => {
            if (!prevOrders) return prevOrders;
            return prevOrders.filter(order => order.id !== id);
        });
    }, []);

    const saveChanges = useCallback(() => {
        if (orders) {
            saveToLocalStorage(orders);
            setOriginalOrders(JSON.parse(JSON.stringify(orders)));
            console.log('изменился localStorage вот так', orders);
        }
    }, [orders]);

    const resetChanges = useCallback(() => {
        if (originalOrders) {
            setOrders(JSON.parse(JSON.stringify(originalOrders)));
        }
    }, [originalOrders]);

    const value = useMemo(() => ({
        orders,
        originalOrders,
        isLoadingOrders,
        errorOrders,
        hasChanges,
        getOrderById,
        updateOrder,
        addOrder,
        deleteOrder,
        saveChanges,
        resetChanges,
        refetchOrders,
    }), [orders, originalOrders, isLoadingOrders, errorOrders, hasChanges, getOrderById, updateOrder, addOrder, deleteOrder, saveChanges, resetChanges, refetchOrders]);

    return (
        <OrdersContext.Provider value={value}>
            {children}
        </OrdersContext.Provider>
    );
};

export const useOrdersContext = () => {
    const context = useContext(OrdersContext);
    if (context === undefined) {
        throw new Error('useOrdersContext необходимо использовать внутри OrdersProvider');
    }
    return context;
};
