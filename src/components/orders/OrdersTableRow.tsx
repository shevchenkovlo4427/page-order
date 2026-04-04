import React, { useState, useCallback } from 'react';
import {
    TableRow,
    TableCell,
    TextField,
    Select,
    MenuItem,
    Chip,
    Box,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DatePicker } from '@mui/x-date-pickers';
import { Order, OrderStatus } from '../../types/order';
import { useOrdersContext } from '../../context/OrdersContext';
import { getStatusText, getStatusColor, formatPrice, formatDate } from '../../utils/orderUtils';

interface OrdersTableRowProps {
    order: Order;
    onRowClick: (id: string) => void;
}

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

export const OrdersTableRow: React.FC<OrdersTableRowProps> = ({ order, onRowClick }) => {
    const { updateOrder, deleteOrder } = useOrdersContext();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editing, setEditing] = useState<EditingState>({
        isEditing: false,
        values: {
            name: order.name,
            client: order.client,
            price: order.price,
            date: order.date,
            status: order.status,
        }
    });

    const startEdit = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setEditing({
            isEditing: true,
            values: {
                name: order.name,
                client: order.client,
                price: order.price,
                date: order.date,
                status: order.status,
            }
        });
    }, [order]);

    const cancelEdit = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        setEditing(prev => ({ ...prev, isEditing: false }));
    }, []);

    const saveEdit = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (editing.isEditing) {
            updateOrder(order.id, editing.values);
        }
        setEditing(prev => ({ ...prev, isEditing: false }));
    }, [editing.isEditing, editing.values, order.id, updateOrder]);

    const handleFieldChange = useCallback((field: keyof EditingState['values'], value: string | number | OrderStatus) => {
        setEditing(prev => ({
            ...prev,
            values: { ...prev.values, [field]: value }
        }));
    }, []);

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

    const handleRowClick = () => {
        if (!editing.isEditing) {
            onRowClick(order.id);
        }
    };

    // форма редактирования
    if (editing.isEditing) {
        return (
            <>
                <TableRow sx={{ backgroundColor: '#fff9c4' }}>
                    <TableCell>{order.id}</TableCell>

                    {/* Название */}
                    <TableCell>
                        <TextField
                            size="small"
                            value={editing.values.name}
                            onChange={(e) => handleFieldChange('name', e.target.value)}
                            autoFocus
                            fullWidth
                        />
                    </TableCell>

                    {/* Клиент */}
                    <TableCell>
                        <TextField
                            size="small"
                            value={editing.values.client}
                            onChange={(e) => handleFieldChange('client', e.target.value)}
                            fullWidth
                        />
                    </TableCell>

                    {/* Цена */}
                    <TableCell>
                        <TextField
                            size="small"
                            type="number"
                            value={editing.values.price}
                            onChange={(e) => handleFieldChange('price', parseInt(e.target.value) || 0)}
                            sx={{ width: 120 }}
                        />
                    </TableCell>

                    {/* Дата */}
                    <TableCell>
                        <DatePicker
                            value={new Date(editing.values.date)}
                            onChange={(newValue) => handleFieldChange('date', newValue?.toISOString().split('T')[0] || '')}
                            slotProps={{ textField: { size: 'small', sx: { width: 150 } } }}
                        />
                    </TableCell>

                    {/* Статус */}
                    <TableCell>
                        <Select
                            size="small"
                            value={editing.values.status}
                            onChange={(e) => handleFieldChange('status', e.target.value as OrderStatus)}
                            sx={{ width: 130 }}
                        >
                            <MenuItem value="pending">Ожидает</MenuItem>
                            <MenuItem value="processing">В обработке</MenuItem>
                            <MenuItem value="completed">Выполнен</MenuItem>
                            <MenuItem value="cancelled">Отменён</MenuItem>
                        </Select>
                    </TableCell>

                    {/* Действия */}
                    <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            <Tooltip title="Сохранить">
                                <IconButton onClick={saveEdit} color="primary" size="small">
                                    <CheckIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Отменить">
                                <IconButton onClick={cancelEdit} color="error" size="small">
                                    <CloseIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </TableCell>
                </TableRow>
            </>
        );
    }

    // форма просмотра
    return (
        <>
            <TableRow
                hover
                onClick={handleRowClick}
                sx={{ cursor: 'pointer' }}
            >
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.name}</TableCell>
                <TableCell>{order.client}</TableCell>
                <TableCell>{formatPrice(order.price)}</TableCell>
                <TableCell>{formatDate(order.date)}</TableCell>
                <TableCell>
                    <Chip
                        label={getStatusText(order.status)}
                        color={getStatusColor(order.status)}
                        size="small"
                    />
                </TableCell>

                {/* Действия - кнопки редактирования и удаления */}
                <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        <Tooltip title="Редактировать заказ">
                            <IconButton onClick={startEdit} color="primary" size="small">
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Удалить заказ">
                            <IconButton onClick={handleDeleteClick} color="error" size="small">
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </TableCell>
            </TableRow>

            {/* Диалог подтверждения удаления */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                onClick={(e) => e.stopPropagation()}
            >
                <DialogTitle>Подтверждение удаления</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Вы действительно хотите удалить заказ <strong>{order.id} - {order.name}</strong>?
                        Это действие нельзя отменить.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>Отмена</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
