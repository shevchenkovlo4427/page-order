import React from 'react';
import { Grid, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { OrderStatus } from '../../types/order';

interface OrderFormFieldsProps {
    values: {
        name: string;
        client: string;
        price: number;
        date: string;
        status: OrderStatus;
    };
    onChange: (field: string, value: string | number | OrderStatus) => void;
    errors?: Record<string, string>;
}

export const OrderFormFields: React.FC<OrderFormFieldsProps> = ({ values, onChange, errors = {} }) => {
    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    fullWidth
                    label="Название"
                    size="small"
                    value={values.name}
                    onChange={(e) => onChange('name', e.target.value)}
                    error={!!errors.name}
                    helperText={errors.name}
                    variant="outlined"
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    fullWidth
                    label="Клиент"
                    size="small"
                    value={values.client}
                    onChange={(e) => onChange('client', e.target.value)}
                    error={!!errors.client}
                    helperText={errors.client}
                    variant="outlined"
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                    fullWidth
                    label="Цена"
                    size="small"
                    type="number"
                    value={values.price}
                    onChange={(e) => onChange('price', parseInt(e.target.value) || 0)}
                    error={!!errors.price}
                    helperText={errors.price}
                    variant="outlined"
                    InputProps={{ startAdornment: '₽' }}
                />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
                <DatePicker
                    label="Дата"
                    value={new Date(values.date)}
                    onChange={(newValue) => onChange('date', newValue?.toISOString().split('T')[0] || '')}
                    slotProps={{ textField: { fullWidth: true, size: 'small' } }}
                />
            </Grid>

            <Grid size={{ xs: 12 }}>
                <FormControl fullWidth size="small">
                    <InputLabel>Статус</InputLabel>
                    <Select
                        value={values.status}
                        onChange={(e) => onChange('status', e.target.value as OrderStatus)}
                        label="Статус"
                    >
                        <MenuItem value="pending">Ожидает</MenuItem>
                        <MenuItem value="processing">В обработке</MenuItem>
                        <MenuItem value="completed">Выполнен</MenuItem>
                        <MenuItem value="cancelled">Отменён</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    );
};
