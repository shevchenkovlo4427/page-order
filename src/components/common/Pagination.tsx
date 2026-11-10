/**
 * Компонент пагинации — обёртка над MUI TablePagination.
 * Локализован для русского языка.
 */

import { memo, type ChangeEvent } from 'react';
import { TablePagination } from '@mui/material';

interface PaginationProps {
  /** Общее количество записей */
  count: number;
  /** Текущая страница (0-based) */
  page: number;
  /** Количество строк на странице */
  rowsPerPage: number;
  /** Обработчик смены страницы */
  onPageChange: (event: unknown, newPage: number) => void;
  /** Обработчик смены количества строк на странице */
  onRowsPerPageChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const Pagination = memo<PaginationProps>(
  ({ count, page, rowsPerPage, onPageChange, onRowsPerPageChange }) => {
    return (
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        labelRowsPerPage="Строк на странице:"
        labelDisplayedRows={({ from, to, count }) => `${from}–${to} из ${count}`}
      />
    );
  },
);

Pagination.displayName = 'Pagination';
