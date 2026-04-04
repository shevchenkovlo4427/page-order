import React from 'react';
import {TablePagination} from '@mui/material';

interface PaginationProps {
    count: number;
    page: number;
    rowsPerPage: number;
    onPageChange: (event: unknown, newPage: number) => void;
    onRowsPerPageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
                                                          count,
                                                          page,
                                                          rowsPerPage,
                                                          onPageChange,
                                                          onRowsPerPageChange,
                                                      }) => {
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
            labelDisplayedRows={({from, to, count}) => `${from}-${to} из ${count}`}
        />
    );
};
