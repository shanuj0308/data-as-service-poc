// src/pages/SummaryReportPage.tsx
import { useState } from 'react';
import { ArrowUpDown, Check, ChevronDown, Columns3, RefreshCcw, SearchIcon } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
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
  VisibilityState,
} from '@tanstack/react-table';

import { getLegalHoldList } from '@/apis';
import GenerateReport from '@/components/common/GenerateReport';
import LoadingScreen from '@/components/common/LoadingScreen';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LegalHoldListItem } from '@/types/common';

const columns: ColumnDef<LegalHoldListItem>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'archive_name',
    header: ({ column }) => {
      return (
        <Button variant='ghost' className='pl-0' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <strong>Application Name</strong>
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => <div className='capitalize'>{row.getValue('archive_name')}</div>,
  },
  {
    accessorKey: 'legal_hold',
    header: ({ column }) => {
      return (
        <Button variant='ghost' className='pl-0' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <strong>Legal Hold</strong>
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className='capitalize'>
        {row.getValue('legal_hold') ? <Check className='h-4 w-4 text-green-500' /> : null}
      </div>
    ),
  },
  {
    accessorKey: 'legal_hold_name',
    header: ({ column }) => {
      return (
        <Button variant='ghost' className='pl-0' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <strong>Legal Hold Name</strong>
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => <div className='capitalize'>{row.getValue('legal_hold_name') || '-'}</div>,
  },
  {
    accessorKey: 'bucket_name',
    header: ({ column }) => {
      return (
        <Button variant='ghost' className='pl-0' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <strong>Bucket Name</strong>
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => <div className='capitalize'>{row.getValue('bucket_name') || '-'}</div>,
  },
];

const SummaryReportPage = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const {
    data: archivedApplications,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['legalHoldList'],
    queryFn: getLegalHoldList,
    staleTime: 1000 * 60 * 5,
  });

  const table = useReactTable({
    data: archivedApplications || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Get selected archives for the report
  const selectedArchives = table.getSelectedRowModel().rows.map((row) => ({
    archive_name: row.original.archive_name,
    id: row.original.id,
  }));

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='flex flex-col items-center gap-2 text-destructive'>
          <p>Error loading data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='flex items-center justify-center p-6'>
      <div className='mx-auto w-full'>
        <div className='mb-6 flex items-center justify-between'>
          <h1 className='text-2xl font-medium leading-10 tracking-tight sm:text-3xl md:text-[30px] md:leading-[3.25rem]'>
            Summary Report
          </h1>
          <GenerateReport
            selectedArchives={selectedArchives}
            disabled={selectedArchives.length === 0}
            buttonClassName=''
          />
        </div>

        <div className='w-full'>
          <div className='flex items-center gap-2 py-4'>
            <Input
              placeholder='Filter applications...'
              value={(table.getColumn('archive_name')?.getFilterValue() as string) ?? ''}
              onChange={(event) => table.getColumn('archive_name')?.setFilterValue(event.target.value)}
              className='max-w-sm'
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className='ml-auto'>
                  <Columns3 className='mr-2 h-4 w-4' /> Columns <ChevronDown className='ml-2 h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <div className='relative'>
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='pl-8'
                    placeholder='Search'
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                  <SearchIcon className='absolute inset-y-0 left-2 my-auto h-4 w-4' />
                </div>
                <DropdownMenuSeparator />
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    if (searchQuery && !column.id.toLowerCase().includes(searchQuery.toLowerCase())) {
                      return null;
                    }

                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className='capitalize'
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                        onSelect={(e) => e.preventDefault()}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    table.resetColumnVisibility();
                    setSearchQuery('');
                  }}
                >
                  <RefreshCcw className='mr-2 h-4 w-4' /> Reset
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} className='odd:bg-muted/50'>
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
        </div>
      </div>
    </div>
  );
};

export default SummaryReportPage;
