/**
 * Диалог подтверждения удаления заказа.
 * Переиспользуемый компонент — используется в OrdersTableRow и OrderDetailsPage.
 * Мемоизирован для предотвращения лишних рендеров.
 */

import { memo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

interface DeleteOrderDialogProps {
  open: boolean;
  orderId: string;
  orderName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteOrderDialog = memo<DeleteOrderDialogProps>(
  ({ open, orderId, orderName, onConfirm, onCancel }) => {
    return (
      <Dialog
        open={open}
        onClose={onCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Подтверждение удаления</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Вы действительно хотите удалить заказ <strong>{orderId} — {orderName}</strong>?
            Это действие нельзя отменить.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>Отмена</Button>
          <Button onClick={onConfirm} color="error" variant="contained" autoFocus>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    );
  },
);

DeleteOrderDialog.displayName = 'DeleteOrderDialog';
