import React from 'react';
import { Grid, Typography, Chip } from '@mui/material';
import { Order, OrderStatus } from '../../types/order';
import { getStatusText, getStatusColor, formatPrice, formatDate } from '../../utils/orderUtils';

interface OrderViewFieldsProps {
    order: Order;
}

export const OrderViewFields: React.FC<OrderViewFieldsProps> = ({ order }) => {
    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Название
                </Typography>
                <Typography variant="body1">{order.name}</Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Клиент
                </Typography>
                <Typography variant="body1">{order.client}</Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Цена
                </Typography>
                <Typography variant="body1">{formatPrice(order.price)}</Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Дата
                </Typography>
                <Typography variant="body1">{formatDate(order.date)}</Typography>
            </Grid>

            <Grid size={{ xs: 12 }}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Статус
                </Typography>
                <Chip
                    label={getStatusText(order.status)}
                    color={getStatusColor(order.status)}
                    size="small"
                />
            </Grid>
        </Grid>
    );
};
