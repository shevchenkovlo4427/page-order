import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Card, CardContent, Typography, Divider, Chip, Snackbar } from '@mui/material';
import { useOrdersContext } from '../context/OrdersContext';
import { OrderDetailsHeader } from '../components/order-details/OrderDetailsHeader';
import { DeleteOrderDialog } from '../components/order-details/DeleteOrderDialog';
import { OrderViewFields } from '../components/orders/OrderViewFields';
import { OrderFormFields } from '../components/orders/OrderFormFields';
import { OrderStatus } from '../types/order';
import { getStatusText, getStatusColor } from '../utils/orderUtils';

interface EditingState {
    isEditing: boolean;
    values: {
        name: string;
        client: string;
        price: number;
        date: string;
        status: OrderStatus;
    };
}

export const OrderDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getOrderById, updateOrder, deleteOrder } = useOrdersContext();
    const [editing, setEditing] = useState<EditingState>({
        isEditing: false,
        values: {
            name: '',
            client: '',
            price: 0,
            date: '',
            status: 'pending'
        }
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const order = React.useMemo(() => {
        return id ? getOrderById(id) : undefined;
    }, [id, getOrderById]);

    const startEdit = useCallback(() => {
        if (order) {
            setEditing({
                isEditing: true,
                values: {
                    name: order.name,
                    client: order.client,
                    price: order.price,
                    date: order.date,
                    status: order.status
                }
            });
        }
    }, [order]);

    const cancelEdit = useCallback(() => {
        setEditing(prev => ({ ...prev, isEditing: false }));
    }, []);

    const saveEdit = useCallback(() => {
        if (order && editing.isEditing) {
            updateOrder(order.id, editing.values);
            setEditing(prev => ({ ...prev, isEditing: false }));
            setSnackbarMessage('Изменения сохранены');
            setSnackbarOpen(true);
        }
    }, [order, editing.isEditing, editing.values, updateOrder]);

    const handleFieldChange = useCallback((field: string, value: string | number | OrderStatus) => {
        setEditing(prev => ({
            ...prev,
            values: { ...prev.values, [field]: value }
        }));
    }, []);

    const handleBack = useCallback(() => {
        navigate('/orders');
    }, [navigate]);

    const handleDeleteClick = useCallback(() => {
        setDeleteDialogOpen(true);
    }, []);

    const handleDeleteConfirm = useCallback(() => {
        if (id) {
            deleteOrder(id);
            setSnackbarMessage('Заказ успешно удален');
            setSnackbarOpen(true);
            setTimeout(() => {
                navigate('/orders');
            }, 500);
        }
    }, [id, deleteOrder, navigate]);

    const handleDeleteCancel = useCallback(() => {
        setDeleteDialogOpen(false);
    }, []);

    if (!order) {
        return (
            <Container>
                <Box sx={{ py: 4, textAlign: 'center' }}>
                    <Typography variant="h5" color="error" gutterBottom>
                        Заказ не найден
                    </Typography>
                    <button onClick={handleBack}>Вернуться к списку</button>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Box sx={{ py: 4 }}>
                <OrderDetailsHeader
                    isEditing={editing.isEditing}
                    onBack={handleBack}
                    onEdit={startEdit}
                    onDelete={handleDeleteClick}
                    onSave={saveEdit}
                    onCancel={cancelEdit}
                />

                <Card>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h5" component="h1">
                                Заказ {order.id}
                            </Typography>
                            {!editing.isEditing && (
                                <Chip
                                    label={getStatusText(order.status)}
                                    color={getStatusColor(order.status)}
                                    size="medium"
                                />
                            )}
                        </Box>
                        <Divider sx={{ my: 2 }} />

                        {editing.isEditing ? (
                            <OrderFormFields
                                values={editing.values}
                                onChange={handleFieldChange}
                            />
                        ) : (
                            <OrderViewFields order={order} />
                        )}
                    </CardContent>
                </Card>
            </Box>

            <DeleteOrderDialog
                open={deleteDialogOpen}
                orderId={order.id}
                orderName={order.name}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
            />

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </Container>
    );
};
