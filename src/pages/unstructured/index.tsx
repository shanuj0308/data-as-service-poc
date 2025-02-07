import { useState } from 'react';
import {
  ArrowUpDown,
  DownloadIcon,
  FileText,
  FolderOpen,
  RefreshCcw,
} from 'lucide-react';
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

import BreadcrumbsWithBackground from '@/components/common/Breadcrumbs';
import { DownloadDialog } from '@/components/common/DownloadDialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import data from '@/constant/explorerData';
import { ExplorerData, ExplorerItem } from '@/types/explorerDataTypes';

const Unstructured = () => {
  const columns: ColumnDef<ExplorerData>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
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
      accessorKey: 'item_name',
      header: 'Item name',
      cell: ({ row }) => {
        const isFolder = row.original.isFolder;

        return (
          <div className='flex items-center'>
            {isFolder ? (
              <FolderOpen className='mr-2' />
            ) : (
              <FileText className='mr-2' />
            )}
            {isFolder ? (
              <Button
                variant='link'
                onClick={() => handleFolderClick(row.original)}
              >
                {row.getValue('item_name')}
              </Button>
            ) : (
              <span className='capitalize'>{row.getValue('item_name')}</span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'item_type',
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Type
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className='capitalize'>{row.getValue('item_type')}</div>
      ),
    },
    {
      accessorKey: 'last_accessed',
      header: 'last accessed',
      cell: ({ row }) => (
        <div className='capitalize'>{row.getValue('last_accessed')}</div>
      ),
    },
    {
      accessorKey: 'size',
      header: 'Size',
      cell: ({ row }) => (
        <div className='capitalize'>{row.getValue('size')}</div>
      ),
    },
  ];

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [currentDirectory, setCurrentDirectory] =
    useState<ExplorerData[]>(data);
  const [directoryStack, setDirectoryStack] = useState<ExplorerData[][]>([]);

  const handleFolderClick = (folder: ExplorerItem) => {
    if (folder.isFolder) {
      setDirectoryStack([...directoryStack, currentDirectory]);
      setCurrentDirectory(folder.items);
      setRowSelection({});
    }
  };

  const handleBackClick = () => {
    const previousDirectory = directoryStack[directoryStack.length - 1];
    setDirectoryStack(directoryStack.slice(0, -1));
    setCurrentDirectory(previousDirectory);
    setRowSelection({});
  };

  const table = useReactTable({
    data: currentDirectory,
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

  const selectedRows = table
    .getSelectedRowModel()
    .rows.map((row) => row.original);

  return (
    <div className='flex items-center justify-center'>
      <div className='mx-auto w-full max-w-screen-lg px-6'>
        <BreadcrumbsWithBackground currentPage='APP0001-Application_name_123' />
        <div className='w-full'>
          <div className='flex items-center gap-2 py-4'>
            <Input
              placeholder='Filter apps...'
              value={
                (table.getColumn('item_name')?.getFilterValue() as string) ?? ''
              }
              onChange={(event) =>
                table.getColumn('item_name')?.setFilterValue(event.target.value)
              }
              className='max-w-sm'
            />
            {directoryStack.length > 0 && (
              <Button onClick={handleBackClick}>Back</Button>
            )}
            {/* Download Button */}
            <DownloadDialog
              selectedItems={selectedRows.map((row) => row.item_id)}
              trigger={
                <Button
                  variant={selectedRows.length > 0 ? 'default' : 'outline'}
                  disabled={selectedRows.length === 0}
                >
                  <DownloadIcon className='mr-2 h-4 w-4' />
                  Download
                </Button>
              }
            />
            {/* Reset Button */}
            <Button
              variant='outline'
              disabled={selectedRows.length === 0}
              onClick={() => table.resetRowSelection()}
            >
              <RefreshCcw className='mr-2 h-4 w-4' />
              Reset
            </Button>
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
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      className='odd:bg-muted/50'
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className='h-24 text-center'
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unstructured;
