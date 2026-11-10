/**
 * Шапка страницы деталей заказа.
 * Содержит навигацию (назад) и кнопки действий (редактировать/удалить/сохранить/отменить).
 * Мемоизирован для оптимизации.
 */

import { memo } from 'react';
import { Stack, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

interface OrderDetailsHeaderProps {
  isEditing: boolean;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export const OrderDetailsHeader = memo<OrderDetailsHeaderProps>(
  ({ isEditing, onBack, onEdit, onDelete, onSave, onCancel }) => {
    return (
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Button startIcon={<ArrowBackIcon />} onClick={onBack} aria-label="Вернуться к списку заказов">
          Назад к списку
        </Button>

        <Stack direction="row" spacing={1}>
          {!isEditing ? (
            <>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={onEdit}
                color="primary"
                aria-label="Редактировать заказ"
              >
                Редактировать
              </Button>
              <Button
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={onDelete}
                color="error"
                aria-label="Удалить заказ"
              >
                Удалить
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                startIcon={<CheckIcon />}
                onClick={onSave}
                color="success"
                aria-label="Сохранить изменения"
              >
                Сохранить
              </Button>
              <Button
                variant="outlined"
                startIcon={<CloseIcon />}
                onClick={onCancel}
                color="error"
                aria-label="Отменить редактирование"
              >
                Отменить
              </Button>
            </>
          )}
        </Stack>
      </Stack>
    );
  },
);

OrderDetailsHeader.displayName = 'OrderDetailsHeader';
