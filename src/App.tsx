/**
 * Корневой компонент приложения.
 * Иерархия провайдеров (от внешнего к внутреннему):
 * 1. ErrorBoundary — перехват ошибок рендеринга
 * 2. QueryProvider — React Query (серверное состояние)
 * 3. ThemeProvider — MUI тема
 * 4. LocalizationProvider — дата-пикер
 * 5. OrdersProvider — контекст заказов (клиентское состояние)
 * 6. BrowserRouter — маршрутизация
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale/ru';
import { setDefaultOptions } from 'date-fns';

import { QueryProvider } from '@/providers/QueryProvider';
import { OrdersProvider } from '@/context/OrdersContext';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { OrdersPage } from '@/pages/OrdersPage';
import { OrderDetailsPage } from '@/pages/OrdersDetailsPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ROUTES } from '@/constants/routes';

// Настройка начала недели с понедельника для date-fns
setDefaultOptions({ weekStartsOn: 1 });

/** Тема приложения — централизованная конфигурация дизайна */
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
            <OrdersProvider>
              <BrowserRouter>
                <Routes>
                  {/* Редирект с корня на список заказов */}
                  <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.ORDERS} replace />} />
                  <Route path={ROUTES.ORDERS} element={<OrdersPage />} />
                  <Route path={ROUTES.ORDER_DETAILS} element={<OrderDetailsPage />} />
                  {/* 404 — все неизвестные маршруты */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </BrowserRouter>
            </OrdersProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}

export default App;
