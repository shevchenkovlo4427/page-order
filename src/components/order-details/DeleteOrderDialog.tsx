import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

interface DeleteOrderDialogProps {
    open: boolean;
    orderId: string;
    orderName: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export const DeleteOrderDialog: React.FC<DeleteOrderDialogProps> = ({
                                                                        open,
                                                                        orderId,
                                                                        orderName,
                                                                        onConfirm,
                                                                        onCancel,
                                                                    }) => {
    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>Подтверждение удаления</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Вы действительно хотите удалить заказ <strong>{orderId} - {orderName}</strong>?
                    Это действие нельзя отменить.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Отмена</Button>
                <Button onClick={onConfirm} color="error" variant="contained">
                    Удалить
                </Button>
            </DialogActions>
        </Dialog>
    );
};
