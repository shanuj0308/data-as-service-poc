'use client';

/**
 * Columns are where you define the core of what your table will look like.
 * They define the data that will be displayed, how it will be formatted, sorted and filtered.
 */
import { ArrowUpDown } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

import { DataTableRowActions } from './TableRowAction';

import { Button } from '@/components/ui/button';
import { RetentionPolicy } from '@/types/common';

export const columns: ColumnDef<RetentionPolicy>[] = [
  {
    accessorKey: 'policy_name',
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Policy Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      return row.original.policy_name;
    },
  },
  {
    accessorKey: 'retention', // You can name this field as you prefer
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Retention
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { retention_type, retention_period, exact_expiry_date, retention_period_unit } = row.original;
      const periodWithUnit = retention_period ? `${retention_period} ${retention_period_unit}` : '';
      const exactDate = exact_expiry_date ? new Date(exact_expiry_date).toLocaleDateString() : '';
      return retention_type === 'retention_period' ? periodWithUnit : exactDate;
    },
  },
  {
    accessorKey: 'type',
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Type
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { retention_type } = row.original;
      return retention_type === 'retention_period' ? 'Period' : 'Exact Date';
    },
  },
  {
    accessorKey: 'description',
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Description
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <DataTableRowActions row={row.original} />,
  },
];
