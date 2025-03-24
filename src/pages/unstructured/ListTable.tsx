'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowSelectionState,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';

import { BreadcrumbsWithIcon } from '@/components/common/Breadcrumbs';
import { DataTablePagination } from '@/components/reactTable/DataTablePagination';
import { DataTableViewOptions } from '@/components/reactTable/DataTableViewOptions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { S3ObjectList } from '@/types/common';

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterCol: string;
  onBack?: () => void;
  currentPath: string;
  rowSelection: RowSelectionState;
  setRowSelection: (selection: RowSelectionState) => void;
  filterValue: string;
  setFilterValue: (value: string) => void;
  onDownloadSelected: (selectedRows: S3ObjectList[]) => void;
  isDownloadPending: boolean;
};

export function ListTable<TData extends S3ObjectList, TValue>({
  columns,
  data,
  filterCol,
  onBack,
  currentPath,
  rowSelection,
  setRowSelection,
  filterValue,
  setFilterValue,
  onDownloadSelected,
  isDownloadPending,
}: DataTableProps<TData, TValue>) {
  // const [searchQuery, setSearchQuery] = useState<string>();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // This will automatically paginate your rows into pages of 10
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: (updater) => {
      // Handle the updater pattern
      if (updater instanceof Function) {
        setRowSelection(updater(rowSelection));
      } else {
        setRowSelection(updater);
      }
    }, // Controlled from parent
    enableRowSelection: true, //enable row selection for all rows
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const selectedRows = table.getSelectedRowModel().rows.map((row) => row.original);

  // Sync external filterValue with internal columnFilters
  useEffect(() => {
    setColumnFilters([{ id: filterCol, value: filterValue }]);
  }, [filterValue, filterCol]);

  return (
    <div className='w-full'>
      <div className='flex items-center gap-2 py-4'>
        <Input
          placeholder={`Filter by ${filterCol.split('_').join(' ')} ...`}
          value={filterValue}
          onChange={(event) => setFilterValue(event.target.value)}
          className='max-w-sm'
        />
        {selectedRows.length > 0 && (
          <Button variant='default' disabled={isDownloadPending} onClick={() => onDownloadSelected(selectedRows)}>
            {isDownloadPending ? 'Downloading...' : `Download (${selectedRows.length}) items`}
          </Button>
        )}
        {currentPath !== '' && (
          <Button variant='default' onClick={onBack} className='mr-2'>
            <ArrowLeft className='h-4 w-2' />
            Back
          </Button>
        )}

        <DataTableViewOptions table={table} />
      </div>
      {/* <span className='text-sm text-primary'>{currentPath === '/' ? 'Root' : currentPath}</span> */}
      <div className='mb-2'>
        <BreadcrumbsWithIcon currentPath={currentPath} />
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-end space-x-2 py-4'>
        <div className='flex-1 text-sm text-muted-foreground'>
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div>
        <div className='space-x-2'>
          <DataTablePagination table={table} />
        </div>
      </div>
    </div>
  );
}
