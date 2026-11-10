/**
 * Компонент индикатора загрузки.
 * Мемоизирован, т.к. не имеет изменяемых пропсов.
 */

import { memo } from 'react';
import { CircularProgress, Box } from '@mui/material';

interface LoadingSpinnerProps {
  /** Сообщение для screen readers */
  label?: string;
}

export const LoadingSpinner = memo<LoadingSpinnerProps>(({ label = 'Загрузка...' }) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="200px"
      role="status"
      aria-label={label}
    >
      <CircularProgress />
    </Box>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';
