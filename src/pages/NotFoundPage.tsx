/**
 * Страница 404 — маршрут не найден.
 */

import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ROUTES } from '@/constants/routes';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate(ROUTES.ORDERS);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          py: 4,
        }}
      >
        <Typography variant="h1" sx={{ fontSize: '6rem', color: 'text.disabled', mb: 2 }}>
          404
        </Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Страница не найдена
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Запрашиваемая страница не существует или была перемещена.
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={handleGoHome}
        >
          Вернуться к заказам
        </Button>
      </Box>
    </Container>
  );
};
