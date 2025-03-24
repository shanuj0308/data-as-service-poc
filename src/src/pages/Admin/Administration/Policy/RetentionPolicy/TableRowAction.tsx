'use client';

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';

import DeleteRetention from './DeleteRetention';

import { CommonDialog } from '@/components/common/CommonDialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { RetentionPolicy } from '@/types/common';

export function DataTableRowActions({ row }: { row: RetentionPolicy }) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const policy_name = row.policy_name;
  const retentionData = row;
  return (
    <>
      <CommonDialog
        isOpen={isDeleteOpen}
        setIsOpen={setIsDeleteOpen}
        title='Delete Policy'
        description='Are you sure you want to delete this policy?'
      >
        <DeleteRetention policy_name={policy_name!} setIsOpen={setIsDeleteOpen} />
      </CommonDialog>

      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='z-50 w-[160px]'>
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(retentionData.policy_name)}>
            Copy retention name
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to={`/retention-policy/edit/${retentionData.policy_name}`}>Edit policy</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className='font-base group flex w-full items-center justify-between p-0 text-left text-sm text-neutral-500'>
            <button
              onClick={() => {
                setIsDeleteOpen(true);
              }}
              className='flex w-full justify-start rounded-md p-2 text-red-500 transition-all duration-75 hover:bg-neutral-100'
            >
              Delete Policy
            </button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
