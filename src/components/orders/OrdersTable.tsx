/**
 * Таблица заказов — контейнер для строк.
 * Шапка таблицы поддерживает сортировку (клик по заголовку)
 * и поиск (иконка лупы для активации, активируется после 2 символов).
 * Для статусов — выбор из списка с чекбоксами.
 */

import { memo, useCallback, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TextField,
  Stack,
  IconButton,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  InputAdornment,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale/ru';

import type { Order, OrderColumn, SortConfig, SearchFilters, OrderStatus } from '@/types/order';
import { ORDER_COLUMN_LABELS, ORDER_STATUS_LABELS, SEARCH_MIN_CHARS } from '@/types/order';
import { OrdersTableRow } from './OrdersTableRow';

interface OrdersTableProps {
  /** Список заказов для отображения (уже отфильтрованный, отсортированный и пагинированный) */
  orders: Order[];
  /** Callback клика по строке — переход к деталям */
  onOrderClick: (id: string) => void;
  /** Текущая конфигурация сортировки */
  sortConfig: SortConfig | null;
  /** Callback изменения сортировки */
  onSortChange: (column: OrderColumn) => void;
  /** Текущие фильтры поиска */
  searchFilters: SearchFilters;
  /** Callback изменения фильтра поиска */
  onSearchChange: (column: OrderColumn, value: string | OrderStatus[] | { start: string; end: string }) => void;
}

/** Колонки, по которым доступен поиск и сортировка */
const SEARCHABLE_COLUMNS: OrderColumn[] = ['id', 'name', 'client', 'price', 'date', 'status'];

export const OrdersTable = memo<OrdersTableProps>(
  ({ orders, onOrderClick, sortConfig, onSortChange, searchFilters, onSearchChange }) => {
    // Состояние для отслеживания, какие колонки имеют активное поле поиска
    const [activeSearchColumns, setActiveSearchColumns] = useState<Set<OrderColumn>>(new Set());
    
    // Режим фильтрации по дате: 'single' (одна дата) или 'range' (диапазон)
    const [dateFilterMode, setDateFilterMode] = useState<'single' | 'range'>('single');

    const handleSortClick = useCallback(
      (column: OrderColumn) => {
        onSortChange(column);
      },
      [onSortChange],
    );

    const handleSearchIconClick = useCallback(
      (column: OrderColumn) => {
        setActiveSearchColumns((prev) => {
          const next = new Set(prev);
          if (next.has(column)) {
            next.delete(column);
          } else {
            next.add(column);
          }
          return next;
        });
      },
      [],
    );

    return (
      <TableContainer component={Paper}>
        <Table aria-label="Таблица заказов">
          <TableHead>
            <TableRow>
              {SEARCHABLE_COLUMNS.map((column) => {
                const isSearchActive = activeSearchColumns.has(column);
                const hasSearchValue =
                  column === 'status'
                    ? Array.isArray(searchFilters.status) && searchFilters.status.length > 0
                    : column === 'date'
                      ? typeof searchFilters.date === 'object' && searchFilters.date !== null
                      : searchFilters[column] && typeof searchFilters[column] === 'string' && searchFilters[column]!.length > 0;

                return (
                  <TableCell key={column}>
                    <Stack spacing={0.5}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <TableSortLabel
                          active={sortConfig?.column === column}
                          direction={sortConfig?.column === column ? sortConfig.direction : 'asc'}
                          onClick={() => handleSortClick(column)}
                        >
                          {ORDER_COLUMN_LABELS[column]}
                        </TableSortLabel>
                        <IconButton
                          size="small"
                          onClick={() => handleSearchIconClick(column)}
                          aria-label={`Поиск по ${ORDER_COLUMN_LABELS[column]}`}
                          sx={{ p: 0.5 }}
                        >
                          {hasSearchValue ? <CloseIcon fontSize="small" /> : <SearchIcon fontSize="small" />}
                        </IconButton>
                      </Box>
                      {isSearchActive && column === 'status' ? (
                        <Stack direction="row" spacing={0.5} alignItems="flex-start">
                          <FormControl size="small" fullWidth>
                            <InputLabel>Статусы</InputLabel>
                            <Select
                              multiple
                              value={searchFilters.status ?? []}
                              onChange={(e) => onSearchChange(column, e.target.value as OrderStatus[])}
                              label="Статусы"
                              renderValue={(selected) => {
                                if (selected.length === 0) return 'Выберите статусы';
                                return selected.map((s) => ORDER_STATUS_LABELS[s as OrderStatus]).join(', ');
                              }}
                              sx={{
                                '& .MuiSelect-select': {
                                  fontSize: '0.75rem',
                                },
                              }}
                            >
                              {(Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map((status) => (
                                <MenuItem key={status} value={status}>
                                  <Checkbox checked={(searchFilters.status ?? []).includes(status)} />
                                  <ListItemText primary={ORDER_STATUS_LABELS[status]} />
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <IconButton
                            size="small"
                            onClick={() => handleSearchIconClick(column)}
                            sx={{ mt: 1, p: 0.5 }}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      ) : isSearchActive && column === 'date' ? (
                        <Stack spacing={1}>
                          <RadioGroup
                            row
                            value={dateFilterMode}
                            onChange={(e) => setDateFilterMode(e.target.value as 'single' | 'range')}
                            sx={{ '& .MuiFormControlLabel-root': { mr: 1 } }}
                          >
                            <FormControlLabel value="single" control={<Radio size="small" />} label="Дата" />
                            <FormControlLabel value="range" control={<Radio size="small" />} label="Диапазон" />
                          </RadioGroup>
                          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                            {dateFilterMode === 'single' ? (
                              <DatePicker
                                value={typeof searchFilters.date === 'string' ? new Date(searchFilters.date) : null}
                                onChange={(value) => onSearchChange(column, value ? value.toISOString().split('T')[0] : '')}
                                slotProps={{
                                  textField: {
                                    size: 'small',
                                    fullWidth: true,
                                    InputProps: {
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          <IconButton
                                            size="small"
                                            onClick={() => handleSearchIconClick(column)}
                                            edge="end"
                                            sx={{ p: 0.5 }}
                                          >
                                            <CloseIcon fontSize="small" />
                                          </IconButton>
                                        </InputAdornment>
                                      ),
                                    },
                                    sx: {
                                      '& .MuiInputBase-input': {
                                        fontSize: '0.75rem',
                                      },
                                    },
                                  },
                                }}
                              />
                          ) : (
                            <Stack direction="row" spacing={1}>
                              <DatePicker
                                label="От"
                                value={typeof searchFilters.date === 'object' && searchFilters.date?.start ? new Date(searchFilters.date.start) : null}
                                onChange={(value) => {
                                  const currentRange = typeof searchFilters.date === 'object' ? searchFilters.date : { start: '', end: '' };
                                  onSearchChange(column, { ...currentRange, start: value ? value.toISOString().split('T')[0] : '' } as { start: string; end: string });
                                }}
                                slotProps={{
                                  textField: {
                                    size: 'small',
                                    sx: {
                                      '& .MuiInputBase-input': {
                                        fontSize: '0.75rem',
                                      },
                                    },
                                  },
                                }}
                              />
                              <DatePicker
                                label="До"
                                value={typeof searchFilters.date === 'object' && searchFilters.date?.end ? new Date(searchFilters.date.end) : null}
                                onChange={(value) => {
                                  const currentRange = typeof searchFilters.date === 'object' ? searchFilters.date : { start: '', end: '' };
                                  onSearchChange(column, { ...currentRange, end: value ? value.toISOString().split('T')[0] : '' } as { start: string; end: string });
                                }}
                                slotProps={{
                                  textField: {
                                    size: 'small',
                                    InputProps: {
                                      endAdornment: (
                                        <InputAdornment position="end">
                                          <IconButton
                                            size="small"
                                            onClick={() => handleSearchIconClick(column)}
                                            edge="end"
                                            sx={{ p: 0.5 }}
                                          >
                                            <CloseIcon fontSize="small" />
                                          </IconButton>
                                        </InputAdornment>
                                      ),
                                    },
                                    sx: {
                                      '& .MuiInputBase-input': {
                                        fontSize: '0.75rem',
                                      },
                                    },
                                  },
                                }}
                              />
                            </Stack>
                          )}
                          </LocalizationProvider>
                        </Stack>
                      ) : isSearchActive ? (
                        <TextField
                          size="small"
                          placeholder={`${SEARCH_MIN_CHARS}+ симв.`}
                          value={searchFilters[column] ?? ''}
                          onChange={(e) => onSearchChange(column, e.target.value)}
                          variant="standard"
                          fullWidth
                          autoFocus
                          inputProps={{
                            'aria-label': `Поиск по ${ORDER_COLUMN_LABELS[column]}`,
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  size="small"
                                  onClick={() => handleSearchIconClick(column)}
                                  edge="end"
                                  sx={{ p: 0.5 }}
                                >
                                  <CloseIcon fontSize="small" />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          sx={{
                            '& .MuiInput-input': {
                              fontSize: '0.75rem',
                              py: 0.5,
                            },
                          }}
                        />
                      ) : null}
                    </Stack>
                  </TableCell>
                );
              })}
              <TableCell align="center">Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <OrdersTableRow
                key={order.id}
                order={order}
                onRowClick={onOrderClick}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  },
);

OrdersTable.displayName = 'OrdersTable';
