/**
 * Страница деталей заказа.
 * Поддерживает просмотр и редактирование через useOrderForm.
 * Использует DeleteOrderDialog и StatusChip.
 */

import { useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Snackbar,
  Button,
} from '@mui/material';

import { useOrdersContext } from '@/context/OrdersContext';
import { useOrderForm } from '@/hooks/useOrderForm';
import { OrderDetailsHeader } from '@/components/order-details/OrderDetailsHeader';
import { DeleteOrderDialog } from '@/components/order-details/DeleteOrderDialog';
import { OrderViewFields } from '@/components/orders/OrderViewFields';
import { OrderFormFields } from '@/components/orders/OrderFormFields';
import { StatusChip } from '@/components/common/StatusChip';
import { ROUTES } from '@/constants/routes';
import type { OrderFormValues } from '@/types/order';

export const OrderDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOrderById, updateOrder, deleteOrder } = useOrdersContext();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const order = useMemo(() => {
    return id ? getOrderById(id) : undefined;
  }, [id, getOrderById]);

  const handleSave = useCallback(
    (values: OrderFormValues) => {
      if (!order) return;
      updateOrder(order.id, values);
    },
    [order, updateOrder],
  );

  const {
    editing,
    errors,
    startEdit,
    cancelEdit,
    saveEdit,
    handleFieldChange,
  } = useOrderForm({
    order: order!,
    onSave: handleSave,
  });

  const showSnackbar = useCallback((message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  }, []);

  const handleSaveEdit = useCallback(() => {
    const success = saveEdit();
    if (success) {
      showSnackbar('Изменения сохранены');
    }
  }, [saveEdit, showSnackbar]);

  const handleBack = useCallback(() => {
    navigate(ROUTES.ORDERS);
  }, [navigate]);

  const handleDeleteClick = useCallback(() => {
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (id) {
      deleteOrder(id);
      setDeleteDialogOpen(false);
      showSnackbar('Заказ успешно удалён');
      // Навигация после закрытия snackbar — без setTimeout
      navigate(ROUTES.ORDERS);
    }
  }, [id, deleteOrder, navigate, showSnackbar]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialogOpen(false);
  }, []);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  if (!order) {
    return (
      <Container>
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            Заказ не найден
          </Typography>
          <Button variant="contained" onClick={handleBack}>
            Вернуться к списку
          </Button>
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
          onSave={handleSaveEdit}
          onCancel={cancelEdit}
        />

        <Card>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h5" component="h1">
                Заказ {order.id}
              </Typography>
              {!editing.isEditing && <StatusChip status={order.status} size="medium" />}
            </Box>

            <Divider sx={{ mb: 3 }} />

            {editing.isEditing ? (
              <OrderFormFields
                values={editing.values}
                onChange={handleFieldChange}
                errors={errors}
              />
            ) : (
              <OrderViewFields order={order} />
            )}
          </CardContent>
        </Card>

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
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Box>
    </Container>
  );
};
