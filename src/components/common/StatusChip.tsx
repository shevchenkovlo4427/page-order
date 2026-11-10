/**
 * Переиспользуемый компонент Chip для отображения статуса заказа.
 * Заменяет дублирование Chip + getStatusText + getStatusColor по всему приложению.
 * Фиксированная ширина и выравнивание по центру для единообразия в таблице.
 */

import { memo } from 'react';
import { Chip } from '@mui/material';

import type { OrderStatus } from '@/types/order';
import { getStatusText, getStatusColor } from '@/utils/orderUtils';

interface StatusChipProps {
  /** Статус заказа */
  status: OrderStatus;
  /** Размер Chip */
  size?: 'small' | 'medium';
}

export const StatusChip = memo<StatusChipProps>(({ status, size = 'small' }) => {
  return (
    <Chip
      label={getStatusText(status)}
      color={getStatusColor(status)}
      size={size}
      sx={{
        minWidth: 130,
        justifyContent: 'center',
      }}
      aria-label={`Статус: ${getStatusText(status)}`}
    />
  );
});

StatusChip.displayName = 'StatusChip';
