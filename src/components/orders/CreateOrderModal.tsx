/**
 * Модальное окно создания нового заказа.
 * Использует централизованную валидацию из validation.ts.
 * Типобезопасные пропсы через CreateOrderData.
 */

import { useState, useCallback } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box } from '@mui/material';

import type { CreateOrderData, OrderFormValues, OrderFormField, OrderFormFieldValue, FormErrors } from '@/types/order';
import { OrderFormFields } from './OrderFormFields';
import { validateOrderForm, validateSingleField, hasFormErrors } from '@/utils/validation';

interface CreateOrderModalProps {
  open: boolean;
  onClose: () => void;
  onCreateOrder: (order: CreateOrderData) => void;
}

const initialFormState: OrderFormValues = {
  name: '',
  client: '',
  price: 0,
  date: new Date().toISOString().split('T')[0],
  status: 'pending',
};

export const CreateOrderModal = ({ open, onClose, onCreateOrder }: CreateOrderModalProps) => {
  const [formData, setFormData] = useState<OrderFormValues>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = useCallback(
    (field: OrderFormField, value: OrderFormFieldValue) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Real-time валидация изменённого поля
      const fieldError = validateSingleField(field, value as string | number);
      setErrors((prev) => ({ ...prev, [field]: fieldError }));
    },
    [],
  );

  const handleSubmit = useCallback(() => {
    const validationErrors = validateOrderForm(formData);
    setErrors(validationErrors);

    if (hasFormErrors(validationErrors)) {
      return;
    }

    onCreateOrder(formData);
    setFormData(initialFormState);
    setErrors({});
    onClose();
  }, [formData, onCreateOrder, onClose]);

  const handleClose = useCallback(() => {
    setFormData(initialFormState);
    setErrors({});
    onClose();
  }, [onClose]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Добавить новый заказ</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <OrderFormFields values={formData} onChange={handleChange} errors={errors} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Отмена</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Добавить
        </Button>
      </DialogActions>
    </Dialog>
  );
};
