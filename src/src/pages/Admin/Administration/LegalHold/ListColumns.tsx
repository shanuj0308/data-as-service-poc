// src/pages/Admin/Administration/LegalHold/ListColumns.tsx
'use client';

import React from 'react';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

import { useApplyLegalHold, useRemoveLegalHold } from '@/apis/mutations';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LegalHoldListItem } from '@/types/common';

const LegalHoldConfirmationDialog = React.memo(
  ({
    isOpen,
    onClose,
    item,
    action,
    onConfirm,
    isPending,
  }: {
    isOpen: boolean;
    onClose: () => void;
    item: LegalHoldListItem;
    action: 'apply' | 'remove';
    onConfirm: () => void;
    isPending: boolean;
  }) => {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>{action === 'apply' ? 'Apply Legal Hold' : 'Remove Legal Hold'}</DialogTitle>
          </DialogHeader>
          <DialogDescription className='font-medium text-red-500'>
            Are you sure you want to {action === 'apply' ? 'apply' : 'remove'} legal hold?
          </DialogDescription>
          <div className='space-y-2 py-4'>
            <p>
              <strong>App ID:</strong> {item.id}
            </p>
            <p>
              <strong>App Name:</strong> {item.archive_name}
            </p>
            {item.bucket_name && (
              <p>
                <strong>TGT Location:</strong> {item.bucket_name}
              </p>
            )}
            {action === 'remove' && item.legal_hold_name && (
              <p>
                <strong>Current Legal Hold Policy Name:</strong> {item.legal_hold_name}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onConfirm} disabled={isPending}>
              {isPending ? 'Processing...' : action === 'apply' ? 'Apply Legal Hold' : 'Remove Legal Hold'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
);

LegalHoldConfirmationDialog.displayName = 'LegalHoldConfirmationDialog';

const ActionCell = React.memo(({ row }: { row: { original: LegalHoldListItem } }) => {
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const applyLegalHold = useApplyLegalHold();
  const removeLegalHold = useRemoveLegalHold();
  const item = row.original;

  const handleAction = React.useCallback(() => {
    setShowConfirmation(true);
  }, []);

  const handleConfirm = React.useCallback(() => {
    if (item.legal_hold) {
      removeLegalHold.mutate({ archive_id: item.id });
    } else {
      applyLegalHold.mutate({
        archive_id: item.id,
        policy_name: 'True',
      });
    }
    setShowConfirmation(false);
  }, [item, applyLegalHold, removeLegalHold]);

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(item.archive_name)}>
            Copy application name
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleAction}>
            {item.legal_hold ? 'Remove Legal Hold' : 'Apply Legal Hold'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LegalHoldConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        item={item}
        action={item.legal_hold ? 'remove' : 'apply'}
        onConfirm={handleConfirm}
        isPending={item.legal_hold ? removeLegalHold.isPending : applyLegalHold.isPending}
      />
    </>
  );
});

ActionCell.displayName = 'ActionCell';

export const columns: ColumnDef<LegalHoldListItem>[] = [
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
    accessorKey: 'archive_name',
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Application Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: 'legal_hold',
    header: 'Legal Hold',
    cell: ({ row }) => <span>{row.original.legal_hold ? 'Yes' : 'No'}</span>,
  },
  {
    accessorKey: 'legal_hold_name',
    header: 'Legal Hold Name',
    cell: ({ row }) => <span>{row.original.legal_hold_name || '-'}</span>,
  },
  {
    accessorKey: 'bucket_name',
    header: 'Target Location',
    cell: ({ row }) => <span>{row.original.bucket_name || '-'}</span>,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ActionCell,
  },
];
