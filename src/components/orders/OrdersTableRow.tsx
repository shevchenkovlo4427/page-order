/**
 * Строка таблицы заказов.
 * Поддерживает inline-редактирование через useOrderForm.
 * Использует StatusChip и DeleteOrderDialog (устраняет дублирование).
 * Мемоизирована для оптимизации рендера списка.
 */

import { memo, useState, useCallback } from 'react';
import {
  TableRow,
  TableCell,
  TextField,
  Select,
  MenuItem,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import type { Order, OrderStatus, OrderFormValues } from '@/types/order';
import { useOrdersContext } from '@/context/OrdersContext';
import { useOrderForm } from '@/hooks/useOrderForm';
import { StatusChip } from '@/components/common/StatusChip';
import { DeleteOrderDialog } from '@/components/order-details/DeleteOrderDialog';
import { formatPrice, formatDate } from '@/utils/orderUtils';
import { ORDER_STATUS_LABELS } from '@/types/order';

interface OrdersTableRowProps {
  order: Order;
  onRowClick: (id: string) => void;
}

/** Список статусов для Select */
const STATUS_OPTIONS = Object.entries(ORDER_STATUS_LABELS) as [keyof typeof ORDER_STATUS_LABELS, string][];

export const OrdersTableRow = memo<OrdersTableRowProps>(({ order, onRowClick }) => {
  const { updateOrder, deleteOrder } = useOrdersContext();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleSave = useCallback(
    (values: OrderFormValues) => {
      updateOrder(order.id, values);
    },
    [updateOrder, order.id],
  );

  const {
    editing,
    errors,
    startEdit,
    cancelEdit,
    saveEdit,
    handleFieldChange,
  } = useOrderForm({ order, onSave: handleSave });

  const handleStartEdit = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      startEdit();
    },
    [startEdit],
  );

  const handleCancelEdit = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      cancelEdit();
    },
    [cancelEdit],
  );

  const handleSaveEdit = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      saveEdit();
    },
    [saveEdit],
  );

  const handleDeleteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    deleteOrder(order.id);
    setDeleteDialogOpen(false);
  }, [deleteOrder, order.id]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialogOpen(false);
  }, []);

  const handleRowClick = useCallback(() => {
    if (!editing.isEditing) {
      onRowClick(order.id);
    }
  }, [editing.isEditing, onRowClick, order.id]);

  // Режим редактирования
  if (editing.isEditing) {
    return (
      <>
        <TableRow sx={{ backgroundColor: '#fff9c4' }} role="row">
          <TableCell>{order.id}</TableCell>

          <TableCell>
            <TextField
              size="small"
              value={editing.values.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              autoFocus
              fullWidth
            />
          </TableCell>

          <TableCell>
            <TextField
              size="small"
              value={editing.values.client}
              onChange={(e) => handleFieldChange('client', e.target.value)}
              error={!!errors.client}
              helperText={errors.client}
              fullWidth
            />
          </TableCell>

          <TableCell>
            <TextField
              size="small"
              type="number"
              value={editing.values.price}
              onChange={(e) => {
                const num = parseFloat(e.target.value);
                handleFieldChange('price', Number.isFinite(num) ? num : 0);
              }}
              error={!!errors.price}
              helperText={errors.price}
              sx={{ width: 120 }}
            />
          </TableCell>

          <TableCell>
            <DatePicker
              value={new Date(editing.values.date)}
              onChange={(newValue) =>
                handleFieldChange('date', newValue?.toISOString().split('T')[0] ?? '')
              }
              slotProps={{ textField: { size: 'small', sx: { width: 150 } } }}
            />
          </TableCell>

          <TableCell>
            <Select
              size="small"
              value={editing.values.status}
              onChange={(e) => handleFieldChange('status', e.target.value as OrderStatus)}
              sx={{ width: 130 }}
            >
              {STATUS_OPTIONS.map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </TableCell>

          <TableCell align="center">
            <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
              <Tooltip title="Сохранить">
                <IconButton onClick={handleSaveEdit} color="primary" size="small" aria-label="Сохранить">
                  <CheckIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Отменить">
                <IconButton onClick={handleCancelEdit} color="error" size="small" aria-label="Отменить">
                  <CloseIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </TableCell>
        </TableRow>
      </>
    );
  }

  // Режим просмотра
  return (
    <>
      <TableRow
        hover
        onClick={handleRowClick}
        sx={{ cursor: 'pointer' }}
        role="row"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleRowClick();
          }
        }}
      >
        <TableCell>{order.id}</TableCell>
        <TableCell>{order.name}</TableCell>
        <TableCell>{order.client}</TableCell>
        <TableCell>{formatPrice(order.price)}</TableCell>
        <TableCell>{formatDate(order.date)}</TableCell>
        <TableCell>
          <StatusChip status={order.status} />
        </TableCell>

        <TableCell align="center">
          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
            <Tooltip title="Редактировать заказ">
              <IconButton onClick={handleStartEdit} color="primary" size="small" aria-label="Редактировать">
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Удалить заказ">
              <IconButton onClick={handleDeleteClick} color="error" size="small" aria-label="Удалить">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>

      {/* Используем переиспользуемый DeleteOrderDialog вместо inline */}
      <DeleteOrderDialog
        open={deleteDialogOpen}
        orderId={order.id}
        orderName={order.name}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  );
});

OrdersTableRow.displayName = 'OrdersTableRow';
