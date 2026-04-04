import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography
} from '@mui/material';
import { Order } from '../../types/order';
import { OrdersTableRow } from './OrdersTableRow';

interface OrdersTableProps {
    orders: Order[];
    onOrderClick: (id: string) => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({ orders, onOrderClick }) => {
    if (orders.length === 0) {
        return (
            <Typography variant="body1" color="textSecondary" align="center" sx={{ py: 4 }}>
                Заказы не найдены
            </Typography>
        );
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Название</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Клиент</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Цена</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Дата</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Статус</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>Действия</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((order) => (
                        <OrdersTableRow
                            key={order.id}
                            order={order}
                            onRowClick={onOrderClick}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
