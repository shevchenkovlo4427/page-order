import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: react(),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'build',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Выделяем MUI в отдельный чанк — он редко меняется и хорошо кэшируется
          'vendor-mui': [
            '@mui/material',
            '@mui/icons-material',
            '@mui/x-date-pickers',
          ],
          // React Query тоже выделяем отдельно
          'vendor-query': ['@tanstack/react-query'],
        },
      },
    },
  },
  esbuild: {
    // В production удаляем console.log и debugger из бандла
    drop: mode === 'production' ? (['console', 'debugger'] as const) : [],
  },
}));
