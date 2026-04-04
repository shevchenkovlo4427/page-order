import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Alert, Paper, Snackbar, Button, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useOrdersContext } from '../context/OrdersContext';
import { OrdersTable } from '../components/orders/OrdersTable';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EditControls } from '../components/common/EditControls';
import { CreateOrderModal } from '../components/orders/CreateOrderModal';
import { Pagination } from '../components/common/Pagination';
import { Order } from '../types/order';

export const OrdersPage: React.FC = () => {
    const navigate = useNavigate();
    const {
        orders,
        isLoadingOrders,
        errorOrders,
        hasChanges,
        saveChanges,
        resetChanges,
        addOrder
    } = useOrdersContext();

    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleOrderClick = (id: string) => {
        navigate(`/orders/${id}`);
    };

    const handleSave = () => {
        saveChanges();
        setSnackbarMessage('Изменения успешно сохранены');
        setSnackbarOpen(true);
    };

    const handleReset = () => {
        resetChanges();
        setSnackbarMessage('Изменения отменены');
        setSnackbarOpen(true);
    };

    const handleAddOrder = (newOrder: Omit<Order, 'id'>) => {
        addOrder(newOrder);
        setSnackbarMessage('Заказ успешно добавлен');
        setSnackbarOpen(true);
    };

    // Пагинация
    const paginatedOrders = useMemo(() => {
        if (!orders) return [];
        const start = page * rowsPerPage;
        const end = start + rowsPerPage;
        return orders.slice(start, end);
    }, [orders, page, rowsPerPage]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (isLoadingOrders) {
        return <LoadingSpinner />;
    }

    if (errorOrders) {
        return (
            <Container>
                <Alert severity="error" sx={{ mt: 4 }}>
                    Ошибка загрузки заказов: {errorOrders.message}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ py: 4 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h4" component="h1">
                        Заказы
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => setModalOpen(true)}
                    >
                        Добавить заказ
                    </Button>
                </Stack>

                <EditControls
                    hasChanges={hasChanges}
                    onSave={handleSave}
                    onReset={handleReset}
                />

                {orders && <OrdersTable orders={paginatedOrders} onOrderClick={handleOrderClick} />}

                {orders && orders.length > 0 && (
                    <Pagination
                        count={orders.length}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                )}

                <CreateOrderModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onCreateOrder={handleAddOrder}
                />

                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={3000}
                    onClose={() => setSnackbarOpen(false)}
                    message={snackbarMessage}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                />
            </Box>
        </Container>
    );
};
