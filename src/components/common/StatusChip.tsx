import React from 'react';
import { Chip } from '@mui/material';
import { OrderStatus } from '../../types/order';
import { getStatusText, getStatusColor } from '../../utils/orderUtils';

interface StatusChipProps {
    status: OrderStatus;
}

export const StatusChip = React.memo<StatusChipProps>(({ status }) => {
    return (
        <Chip
            label={getStatusText(status)}
            color={getStatusColor(status)}
            size="small"
        />
    );
});

StatusChip.displayName = 'StatusChip';
