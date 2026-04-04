import React from 'react';
import { Box, Button, Stack, Alert, Slide } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import UndoIcon from '@mui/icons-material/Undo';

interface EditControlsProps {
    hasChanges: boolean;
    onSave: () => void;
    onReset: () => void;
}

export const EditControls: React.FC<EditControlsProps> = ({ hasChanges, onSave, onReset }) => {
    if (!hasChanges) return null;

    return (
        <Slide direction="down" in={hasChanges} mountOnEnter unmountOnExit>
            <Box sx={{ position: 'sticky', top: 20, zIndex: 1000, mb: 3 }}>
                <Alert
                    severity="info"
                    action={
                        <Stack direction="row" spacing={1}>
                            <Button
                                color="inherit"
                                size="small"
                                startIcon={<UndoIcon />}
                                onClick={onReset}
                            >
                                Сбросить
                            </Button>
                            <Button
                                color="primary"
                                size="small"
                                startIcon={<SaveIcon />}
                                onClick={onSave}
                                variant="contained"
                            >
                                Сохранить
                            </Button>
                        </Stack>
                    }
                    sx={{ alignItems: 'center' }}
                >
                    У вас есть несохраненные изменения
                </Alert>
            </Box>
        </Slide>
    );
};
