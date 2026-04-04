import React from 'react';
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

export const OrderDetailsHeader: React.FC<OrderDetailsHeaderProps> = ({
                                                                          isEditing,
                                                                          onBack,
                                                                          onEdit,
                                                                          onDelete,
                                                                          onSave,
                                                                          onCancel,
                                                                      }) => {
    return (
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={onBack}>
                Назад к списку
            </Button>

            <Stack direction="row" spacing={1}>
                {!isEditing ? (
                    <>
                        <Button variant="contained" startIcon={<EditIcon />} onClick={onEdit} color="primary">
                            Редактировать
                        </Button>
                        <Button variant="outlined" startIcon={<DeleteIcon />} onClick={onDelete} color="error">
                            Удалить
                        </Button>
                    </>
                ) : (
                    <>
                        <Button variant="contained" startIcon={<CheckIcon />} onClick={onSave} color="success">
                            Сохранить
                        </Button>
                        <Button variant="outlined" startIcon={<CloseIcon />} onClick={onCancel} color="error">
                            Отменить
                        </Button>
                    </>
                )}
            </Stack>
        </Stack>
    );
};
