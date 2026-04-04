import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { QueryProvider } from './providers/QueryProvider';
import { OrdersProvider } from './context/OrdersContext';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailsPage } from './pages/OrdersDetailsPage';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

function App() {
    return (
        <QueryProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <OrdersProvider>
                        <BrowserRouter>
                            <Routes>
                                <Route path="/" element={<OrdersPage />} />
                                <Route path="/orders" element={<OrdersPage />} />
                                <Route path="/orders/:id" element={<OrderDetailsPage />} />
                            </Routes>
                        </BrowserRouter>
                    </OrdersProvider>
                </LocalizationProvider>
            </ThemeProvider>
        </QueryProvider>
    );
}

export default App;
