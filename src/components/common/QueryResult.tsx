// src/components/common/QueryResult.tsx
import { useMemo, useState } from 'react';
import { ArrowUpDown, Search } from 'lucide-react';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface QueryResultProps {
  data: Array<Record<string, unknown>>;
  maxHeight: string;
}

export default function QueryResult({ data, maxHeight = '100%' }: QueryResultProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  const numericStringSort = (
    rowA: { getValue: (arg0: any) => string },
    rowB: { getValue: (arg0: any) => string },
    columnId: any,
  ) => {
    const a = parseFloat(rowA.getValue(columnId));
    const b = parseFloat(rowB.getValue(columnId));
    return a - b;
  };

  const columns = useMemo(() => {
    if (data.length === 0) return [];

    return Object.keys(data[0]).map((key) => {
      const isNumericColumn = data.every((row) => !isNaN(Number(row[key])));

      return {
        accessorKey: key,
        header: ({ column }) => {
          return (
            <Button
              variant='ghost'
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
              className='flex items-center gap-1 p-0 font-semibold hover:bg-transparent'
            >
              {key}
              <ArrowUpDown className='ml-2 h-4 w-4' />
            </Button>
          );
        },
        cell: ({ row }) => {
          const value = row.getValue(key);
          return <div>{value !== undefined && value !== null ? String(value) : 'NULL'}</div>;
        },
        enableSorting: true,
        enableColumnFilter: true,
        sortingFn: isNumericColumn ? numericStringSort : 'alphanumeric',
      } as ColumnDef<Record<string, unknown>>;
    });
  }, [data]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (data.length === 0) {
    return <div className='mt-4 text-center text-gray-500 dark:text-gray-400'>No results to display.</div>;
  }

  return (
    <Card
      className='mt-4 min-h-[360px] rounded-xl border shadow-md dark:border-gray-700 dark:bg-gray-800'
      style={{ minHeight: maxHeight }}
    >
      <CardContent className='p-4'>
        <div className='flex items-center justify-between py-4'>
          <div className='flex items-center gap-2'>
            <div className='relative'>
              <Search className='absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500' />
              <Input
                placeholder='Search all columns...'
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className='max-w-sm pl-8'
              />
            </div>
          </div>
        </div>

        <ScrollArea className='w-full'>
          <ScrollBar orientation='vertical' />
          <div className='max-h-[320px]' style={{ maxHeight: maxHeight }}>
            <Table className='w-full border-collapse text-sm'>
              <TableHeader className='sticky top-0 bg-gray-100 dark:bg-gray-700'>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className='border px-4 py-2 text-left font-semibold text-gray-900 dark:text-gray-100'
                      >
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className='border-t hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700'
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className='border px-4 py-2 text-gray-800 dark:text-gray-300'>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <ScrollBar orientation='horizontal' />
        </ScrollArea>

        <div className='flex items-center justify-between space-x-2 py-4'>
          <div className='flex-1 text-sm text-muted-foreground'>
            Showing {table.getFilteredRowModel().rows.length} of {data.length} results
          </div>
          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button variant='outline' size='sm' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
