/**
 * Columns are where you define the core of what your table will look like.
 * They define the data that will be displayed, how it will be formatted, sorted and filtered.
 */
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { jobTableConstants } from '@/constant/apiConstants';
import { JobDataList } from '@/types/common';

export const columns: ColumnDef<JobDataList>[] = [
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
    header: () => <strong>Archive Status</strong>,
    cell: ({ row }) => {
      const archive_status = row.original.archive_status;
      if (archive_status === 'Archive Queue') {
        return <span className='text-yellow-500'><strong>New</strong></span>;
      } else if (archive_status === 'Archiving' || archive_status === 'Validating'){
        return <span className='text-orange-500'><strong>In Progress</strong></span>;
      } else if (archive_status === 'Archived'){
        return <span className='text-green-500'><strong>Completed</strong></span>;
      } else if (archive_status === 'Failed'){
        return <span className='text-red-500'><strong>Failed</strong></span>;
      }
    }
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
