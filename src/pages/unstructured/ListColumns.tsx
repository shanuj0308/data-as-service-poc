'use client';

/**
 * Columns are where you define the core of what your table will look like.
 * They define the data that will be displayed, how it will be formatted, sorted and filtered.
 */
// import { Link } from 'react-router-dom';
import { ArrowUpDown, FileText, FolderOpen, MoreHorizontal } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { S3ObjectList } from '@/types/common';

export const columns = (
  handleFolderClick: (folder: S3ObjectList) => void,
  handleDownloadSingle: (file: S3ObjectList) => void,
): ColumnDef<S3ObjectList>[] => [
  {
    id: 'Key',
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
        onCheckedChange={(value) => {
          row.toggleSelected(!!value);
        }}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'item_name',
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Item Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isFolder = row.original.item_type;

      return (
        <div className='flex items-center'>
          {isFolder === 'folder' ? (
            <>
              <FolderOpen className='mr-2' />
              <Button variant='link' onClick={() => handleFolderClick(row.original)}>
                {row.getValue('item_name')}
              </Button>
            </>
          ) : (
            <>
              <FileText className='mr-2' />
              <span>{row.getValue('item_name')}</span>
            </>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'item_type',
    header: 'Type',
  },
  {
    accessorKey: 'size',
    header: 'Size',
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const s3Data = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem
              className='cursor-pointer'
              onClick={() => navigator.clipboard.writeText(s3Data.item_name)}
            >
              Copy Item name
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className='cursor-pointer' onClick={() => handleDownloadSingle(s3Data)}>
              Download
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
