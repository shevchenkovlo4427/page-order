/**
 * Поля формы заказа — переиспользуемый компонент.
 * Используется как при создании, так и при редактировании заказа.
 * Типобезопасный onChange через OrderFormField.
 */

import { Grid, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';

import type { OrderFormValues, OrderFormField, OrderFormFieldValue, FormErrors } from '@/types/order';
import { ORDER_STATUS_LABELS } from '@/types/order';

interface OrderFormFieldsProps {
  /** Текущие значения формы */
  values: OrderFormValues;
  /** Обработчик изменения поля — типобезопасный */
  onChange: (field: OrderFormField, value: OrderFormFieldValue) => void;
  /** Ошибки валидации */
  errors?: FormErrors;
}

/** Список статусов для Select */
const STATUS_OPTIONS = Object.entries(ORDER_STATUS_LABELS) as [keyof typeof ORDER_STATUS_LABELS, string][];

export const OrderFormFields = ({ values, onChange, errors = {} }: OrderFormFieldsProps) => {
  return (
    <Grid container spacing={3}>
      {/* Название */}
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
          inputProps={{ 'aria-label': 'Название заказа' }}
        />
      </Grid>

      {/* Клиент */}
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
          inputProps={{ 'aria-label': 'Клиент' }}
        />
      </Grid>

      {/* Цена */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          label="Цена"
          size="small"
          type="number"
          value={values.price}
          onChange={(e) => {
            const numValue = parseFloat(e.target.value);
            onChange('price', Number.isFinite(numValue) ? numValue : 0);
          }}
          error={!!errors.price}
          helperText={errors.price}
          variant="outlined"
          InputProps={{ startAdornment: '₽' }}
          inputProps={{ 'aria-label': 'Цена', min: 0 }}
        />
      </Grid>

      {/* Дата */}
      <Grid size={{ xs: 12, sm: 6 }}>
        <DatePicker
          label="Дата"
          value={new Date(values.date)}
          onChange={(newValue) => onChange('date', newValue?.toISOString().split('T')[0] ?? '')}
          slotProps={{
            textField: {
              fullWidth: true,
              size: 'small',
              error: !!errors.date,
              helperText: errors.date,
            },
          }}
        />
      </Grid>

      {/* Статус */}
      <Grid size={{ xs: 12 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Статус</InputLabel>
          <Select
            value={values.status}
            onChange={(e) => onChange('status', e.target.value as keyof typeof ORDER_STATUS_LABELS)}
            label="Статус"
          >
            {STATUS_OPTIONS.map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};
