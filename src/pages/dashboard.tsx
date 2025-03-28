import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpDown, ChevronDown, Columns3, Loader2, MoreHorizontal, RefreshCcw, SearchIcon } from 'lucide-react';
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
import { ArchivedDataConstant, WebendpointConstant } from '@/constant/apiConstants';
import { ArchivalData } from '@/types/common';

const fetchArchivedData = async () => {
  const response = await fetch(WebendpointConstant.BASE_URL + WebendpointConstant.ARCHIVE_DATA_LISTING_URL);
  if (!response.ok) throw new Error('Failed to fetch data');
  const apiVal = await response.json();
  return apiVal.data;
};

// eslint-disable-next-line react-refresh/only-export-components
export const columns: ColumnDef<ArchivalData>[] = [
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
    accessorKey: ArchivedDataConstant.ARCHIVE_NAME,
    header: ({ column }) => {
      return (
        <Button variant='ghost' className='pl-0' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <strong>App Name</strong>
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className='capitalize'>{row.getValue(ArchivedDataConstant.ARCHIVE_NAME)}</div>,
  },
  {
    accessorKey: ArchivedDataConstant.DATABASE_ENGINE,
    header: ({ column }) => {
      return (
        <Button variant='ghost' className='pl-0' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <strong>Archival Type</strong>
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className='capitalize'>{row.getValue(ArchivedDataConstant.DATABASE_ENGINE)}</div>,
  },
  {
    accessorKey: ArchivedDataConstant.TIME_SUBMITTED,
    header: ({ column }) => {
      return (
        <Button variant='ghost' className='pl-0' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <strong>Completed On</strong>
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dateString: Date = row.getValue(ArchivedDataConstant.TIME_SUBMITTED);
      const date = new Date(dateString);
      const formattedDate = date.toLocaleDateString();
      return <div className='capitalize'>{formattedDate}</div>;
    },
  },
  {
    accessorKey: ArchivedDataConstant.RETENTION_POLICY,
    header: ({ column }) => {
      return (
        <Button variant='ghost' className='pl-0' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <strong>Retention Policy</strong>
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className='capitalize'>{row.getValue(ArchivedDataConstant.RETENTION_POLICY)}</div>,
  },
  {
    accessorKey: ArchivedDataConstant.EXPIRATION_DATE,
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <strong>Expiration Date</strong>
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className='capitalize'>{row.getValue(ArchivedDataConstant.EXPIRATION_DATE)}</div>,
  },
  {
    accessorKey: ArchivedDataConstant.LEGAL_HOLD,
    header: ({ column }) => {
      return (
        <Button variant='ghost' className='pl-0' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <strong>Legal Hold</strong>
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className='capitalize'>{row.getValue(ArchivedDataConstant.LEGAL_HOLD)}</div>,
  },
  {
    accessorKey: ArchivedDataConstant.GXP,
    header: ({ column }) => {
      return (
        <Button variant='ghost' className='pl-0' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <strong>GxP</strong>
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className='capitalize'>{row.getValue(ArchivedDataConstant.GXP)}</div>,
  },
  {
    id: 'actions',
    header: () => <strong>Actions</strong>,
    enableHiding: false,
    cell: ({ row }) => {
      const archiveData = row.original;
      const isStructuredArchival = archiveData.archival_type?.toLowerCase() === 'structured';

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(archiveData.app_name)}>
              Copy App Folder
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {isStructuredArchival && (
              <DropdownMenuItem>
                <Link to={`/execute-query?archive_name=${archiveData.app_name}&archive_id=${archiveData.id}`}>
                  Execute Query
                </Link>
              </DropdownMenuItem>
            )}
            {archiveData.archival_type === 'Unstructured' && (
              <DropdownMenuItem>
                <Link to='/unstructured'>View Folders</Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState<string>();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboardList'],
    queryFn: fetchArchivedData,
  });

  const table = useReactTable({
    data: data || [],
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

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='flex flex-col items-center gap-2'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
          <p className='text-sm text-muted-foreground'>Loading data...</p>
        </div>
      </div>
    );
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
    <div className='flex items-center justify-center'>
      <div className='mx-auto w-full'>
        <h1 className='text-2xl font-medium leading-10 tracking-tight sm:text-3xl md:text-[30px] md:leading-[3.25rem]'>
          Archival Dashboard
        </h1>
        <div className='w-full'>
          <div className='flex items-center gap-2 py-4'>
            <Input
              placeholder='Filter apps...'
              value={(table.getColumn('app_name')?.getFilterValue() as string) ?? ''}
              onChange={(event) => table.getColumn('app_name')?.setFilterValue(event.target.value)}
              className='max-w-sm'
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className='ml-auto'>
                  <Columns3 /> Columns <ChevronDown className='ml-3' />
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
                  <RefreshCcw /> Reset
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

export default Dashboard;
