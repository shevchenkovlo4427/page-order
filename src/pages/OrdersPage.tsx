/**
 * Страница списка заказов.
 * Содержит: таблицу с сортировкой/поиском, пагинацию, создание, сохранение/сброс изменений.
 * Пайплайн данных: orders → filter (search) → sort → paginate
 */

import { useState, useMemo, useCallback, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Alert,
  Snackbar,
  Button,
  Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { useOrdersContext } from '@/context/OrdersContext';
import { OrdersTable } from '@/components/orders/OrdersTable';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EditControls } from '@/components/common/EditControls';
import { CreateOrderModal } from '@/components/orders/CreateOrderModal';
import { Pagination } from '@/components/common/Pagination';
import { getOrderDetailsPath } from '@/constants/routes';
import type { CreateOrderData, OrderColumn, SortConfig, SortDirection, SearchFilters, OrderStatus } from '@/types/order';
import { SEARCH_MIN_CHARS } from '@/types/order';
import { sortOrders, filterOrders } from '@/utils/orderUtils';

export const OrdersPage = () => {
  const navigate = useNavigate();
  const {
    orders,
    isLoading,
    error,
    hasChanges,
    saveChanges,
    resetChanges,
    addOrder,
  } = useOrdersContext();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Сортировка
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  // Поиск по колонкам
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});

  const handleOrderClick = useCallback(
    (id: string) => {
      navigate(getOrderDetailsPath(id));
    },
    [navigate],
  );

  const showSnackbar = useCallback((message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  }, []);

  const handleSave = useCallback(() => {
    saveChanges();
    showSnackbar('Изменения успешно сохранены');
  }, [saveChanges, showSnackbar]);

  const handleReset = useCallback(() => {
    resetChanges();
    showSnackbar('Изменения отменены');
  }, [resetChanges, showSnackbar]);

  const handleAddOrder = useCallback(
    (newOrder: CreateOrderData) => {
      addOrder(newOrder);
      showSnackbar('Заказ успешно добавлен');
    },
    [addOrder, showSnackbar],
  );

  // Обработчик сортировки — переключает направление или устанавливает новую колонку
  const handleSortChange = useCallback((column: OrderColumn) => {
    setSortConfig((prev) => {
      if (prev?.column === column) {
        // Переключаем направление, после desc — сбрасываем
        if (prev.direction === 'asc') return { column, direction: 'desc' as SortDirection };
        return null;
      }
      return { column, direction: 'asc' as SortDirection };
    });
    // При смене сортировки сбрасываем страницу
    setPage(0);
  }, []);

  // Обработчик поиска — обновляет фильтр для конкретной колонки
  const handleSearchChange = useCallback((column: OrderColumn, value: string | OrderStatus[] | { start: string; end: string }) => {
    setSearchFilters((prev) => ({
      ...prev,
      [column]: value,
    }));
    // При изменении поиска сбрасываем страницу
    setPage(0);
  }, []);

  // Активные фильтры — только те, где есть данные
  const activeFilters = useMemo<SearchFilters>(() => {
    const result: SearchFilters = {};
    for (const [column, value] of Object.entries(searchFilters)) {
      if (column === 'status') {
        // Для статусов — массив выбранных значений
        if (Array.isArray(value) && value.length > 0) {
          result.status = value as OrderStatus[];
        }
      } else if (typeof value === 'string' && value.length >= SEARCH_MIN_CHARS) {
        // Для остальных колонок — строка с минимальным количеством символов
        if (column === 'id') result.id = value;
        else if (column === 'name') result.name = value;
        else if (column === 'client') result.client = value;
        else if (column === 'price') result.price = value;
        else if (column === 'date') result.date = value;
      }
    }
    return result;
  }, [searchFilters]);

  // Пайплайн: фильтрация → сортировка → пагинация
  const filteredOrders = useMemo(() => {
    return filterOrders(orders, activeFilters);
  }, [orders, activeFilters]);

  const sortedOrders = useMemo(() => {
    if (!sortConfig) return filteredOrders;
    return sortOrders(filteredOrders, sortConfig.column, sortConfig.direction);
  }, [filteredOrders, sortConfig]);

  const paginatedOrders = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedOrders.slice(start, end);
  }, [sortedOrders, page, rowsPerPage]);

  const handleChangePage = useCallback((_event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    },
    [],
  );

  const handleCloseSnackbar = useCallback(() => {
    setSnackbarOpen(false);
  }, []);

  if (isLoading) {
    return <LoadingSpinner label="Загрузка заказов..." />;
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          Ошибка загрузки заказов: {error.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 2 }}
        >
          <Typography variant="h4" component="h1">
            Заказы
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setModalOpen(true)}
            aria-label="Добавить новый заказ"
          >
            Добавить заказ
          </Button>
        </Stack>

        <EditControls
          hasChanges={hasChanges}
          onSave={handleSave}
          onReset={handleReset}
        />

        {orders.length > 0 && (
          <OrdersTable
            orders={paginatedOrders}
            onOrderClick={handleOrderClick}
            sortConfig={sortConfig}
            onSortChange={handleSortChange}
            searchFilters={searchFilters}
            onSearchChange={handleSearchChange}
          />
        )}

        {sortedOrders.length > 0 && (
          <Pagination
            count={sortedOrders.length}
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
          onClose={handleCloseSnackbar}
          message={snackbarMessage}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />
      </Box>
    </Container>
  );
};
