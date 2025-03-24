/**
 * Columns are where you define the core of what your table will look like.
 * They define the data that will be displayed, how it will be formatted, sorted and filtered.
 */
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { jobTableConstants } from '@/constant/apiConstants';
import { JobData } from '@/types/common';

export const columns: ColumnDef<JobData>[] = [
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
    accessorKey: jobTableConstants.JOB_ID,
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          <strong>Job Id</strong>
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: jobTableConstants.JOB_NAME,
    header: () => <strong>Job Name</strong>,
  },
  {
    accessorKey: 'job_type',
    header: () => <strong>Job Type</strong>
  },
  {
    accessorKey: jobTableConstants.ARCHIVE_STATUS,
    header: () => <strong>Archive Status</strong>
  },
  {
    accessorKey: jobTableConstants.START_TIME,
    header: () => <strong>Start Time</strong>,
    cell: ({ row }) => {
      const start_time = row.original.start_time;
      return start_time ? new Date(start_time).toLocaleString() : 'N/A';
    },
  },
  {
    accessorKey: jobTableConstants.END_TIME,
    header: () => <strong>End Time</strong>,
    cell: ({ row }) => {
      const end_time = row.original.end_time;
      return end_time ? new Date(end_time).toLocaleString() : 'N/A';
    },
  },
  {
    accessorKey: jobTableConstants.DURATION,
    header: () => <strong>Duration</strong>,
    // cell: ({ row }) => {
    //   const start_time = row.original.start_time;
    //   const end_time = row.original.end_time;
    //   if (!start_time || !end_time) return 'N/A';

    //   const start = new Date(start_time);
    //   const end = new Date(end_time);
    //   // operation is valid for dates
    //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   // @ts-expect-error
    //   const durationMs = end - start;
    //   const minutes = Math.floor(durationMs / 60000);
    //   const seconds = Math.floor((durationMs % 60000) / 1000);

    //   return `${minutes}m ${seconds}s`;
    // },
  },
  {
    accessorKey: jobTableConstants.TRIGGERED_BY,
    header: () => <strong>Triggered By</strong>,
  },
  {
    id: 'actions',
    header: () => <strong>Actions</strong>,
    cell: () => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem>Run Job</DropdownMenuItem>
            <DropdownMenuItem>Job Details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
