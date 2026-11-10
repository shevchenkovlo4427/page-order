/**
 * Панель управления несохранёнными изменениями.
 * Отображается sticky при наличии изменений с анимацией Slide.
 */

import { memo } from 'react';
import { Box, Button, Stack, Alert, Slide } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import UndoIcon from '@mui/icons-material/Undo';

interface EditControlsProps {
  /** Есть ли несохранённые изменения */
  hasChanges: boolean;
  /** Callback сохранения */
  onSave: () => void;
  /** Callback сброса */
  onReset: () => void;
}

export const EditControls = memo<EditControlsProps>(({ hasChanges, onSave, onReset }) => {
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
                aria-label="Сбросить изменения"
              >
                Сбросить
              </Button>
              <Button
                color="primary"
                size="small"
                startIcon={<SaveIcon />}
                onClick={onSave}
                variant="contained"
                aria-label="Сохранить изменения"
              >
                Сохранить
              </Button>
            </Stack>
          }
          sx={{ alignItems: 'center' }}
        >
          У вас есть несохранённые изменения
        </Alert>
      </Box>
    </Slide>
  );
});

EditControls.displayName = 'EditControls';
