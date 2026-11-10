/**
 * Провайдер React Query.
 * Настраивает глобальные параметры кэширования и кэширование.
 * В development-режиме подключает DevTools для отладки.
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { ReactNode } from 'react';

/** Глобальный экземпляр QueryClient — создаётся один раз */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Данные считаются свежими 5 минут — повторные запросы не отправляются
      staleTime: 5 * 60 * 1000,
      // Не рефetchить при переключении вкладки (данные из localStorage)
      refetchOnWindowFocus: false,
      // Повторная попытка при ошибке — максимум 2 раза
      retry: 2,
    },
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools доступны только в development-режиме */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
