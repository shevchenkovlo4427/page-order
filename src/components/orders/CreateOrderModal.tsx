import React, { useState, useCallback } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Alert
} from '@mui/material';
import { OrderStatus } from '../../types/order';
import { OrderFormFields } from './OrderFormFields';

interface CreateOrderModalProps {
    open: boolean;
    onClose: () => void;
    onCreateOrder: (order: {
        name: string;
        client: string;
        price: number;
        date: string;
        status: OrderStatus;
    }) => void;
}

const initialFormState = {
    name: '',
    client: '',
    price: 0,
    date: new Date().toISOString().split('T')[0],
    status: 'pending' as OrderStatus
};

export const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
                                                                      open,
                                                                      onClose,
                                                                      onCreateOrder
                                                                  }) => {
    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = useCallback(() => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Название обязательно';
        }
        if (!formData.client.trim()) {
            newErrors.client = 'Клиент обязателен';
        }
        if (formData.price <= 0) {
            newErrors.price = 'Цена должна быть больше 0';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleChange = useCallback((field: string, value: string | number | OrderStatus) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Очищаем ошибку при изменении поля
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    }, [errors]);

    const handleSubmit = useCallback(() => {
        if (validateForm()) {
            onCreateOrder(formData);
            setFormData(initialFormState);
            onClose();
        }
    }, [formData, validateForm, onCreateOrder, onClose]);

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
                    <OrderFormFields
                        values={formData}
                        onChange={handleChange}
                        errors={errors}
                    />
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
