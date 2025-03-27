// src/pages/Admin/Administration/RetentionPolicy/ListColumns.tsx
'use client';

import React, { useState } from 'react';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

import { useApplyRetentionPolicy } from '@/apis/mutations';
import { useRetentionPolicyList } from '@/apis/queries';
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
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RetentionPolicyListItem } from '@/types/common';

// RetentionPolicyDialog component remains the same...
const RetentionPolicyDialog = React.memo(
  ({
    isOpen,
    onClose,
    item,
    onApply,
    isPending,
  }: {
    isOpen: boolean;
    onClose: () => void;
    item: RetentionPolicyListItem;
    onApply: (policyName: string) => void;
    isPending: boolean;
  }) => {
    const [selectedPolicy, setSelectedPolicy] = useState('');
    const [selectedPolicyDetails, setSelectedPolicyDetails] = useState<any>(null);
    const retentionPolicies = useRetentionPolicyList();

    const handlePolicyChange = (value: string) => {
      setSelectedPolicy(value);
      const policyDetails = retentionPolicies.data?.find((policy) => policy.policy_name === value);
      setSelectedPolicyDetails(policyDetails);
    };

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Apply Retention Policy</DialogTitle>
            <DialogDescription>
              Select a retention policy to apply to <strong>{item.archive_name}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='policy'>Retention Policy</Label>
              <Select value={selectedPolicy} onValueChange={handlePolicyChange}>
                <SelectTrigger id='policy'>
                  <SelectValue placeholder='Select a policy' />
                </SelectTrigger>
                <SelectContent>
                  {retentionPolicies.isLoading ? (
                    <SelectItem value='loading' disabled>
                      Loading policies...
                    </SelectItem>
                  ) : (
                    retentionPolicies.data?.map((policy) => (
                      <SelectItem key={policy.policy_name} value={policy.policy_name}>
                        {policy.policy_name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {selectedPolicyDetails && (
              <div className='rounded-md bg-muted p-3 text-sm'>
                <p>
                  <strong>Policy Type:</strong> {selectedPolicyDetails.retention_type}
                </p>
                {selectedPolicyDetails.retention_period && (
                  <p>
                    <strong>Retention Period:</strong> {selectedPolicyDetails.retention_period}{' '}
                    {selectedPolicyDetails.retention_period_unit}
                  </p>
                )}
                {selectedPolicyDetails.exact_expiry_date && (
                  <p>
                    <strong>Expiry Date:</strong>{' '}
                    {new Date(selectedPolicyDetails.exact_expiry_date).toLocaleDateString()}
                  </p>
                )}
                <p>
                  <strong>Description:</strong> {selectedPolicyDetails.description}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => onApply(selectedPolicy)} disabled={isPending || !selectedPolicy}>
              {isPending ? 'Applying...' : 'Apply Policy'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
);

RetentionPolicyDialog.displayName = 'RetentionPolicyDialog';

// ActionCell component remains the same...
const ActionCell = React.memo(({ row }: { row: { original: RetentionPolicyListItem } }) => {
  const [showPolicyDialog, setShowPolicyDialog] = useState(false);
  const applyRetentionPolicy = useApplyRetentionPolicy();
  const item = row.original;
  const hasRetentionPolicy = !!item.retention_policy;

  const handleApplyPolicy = (policyName: string) => {
    applyRetentionPolicy.mutate(
      {
        archive_id: item.id,
        policy_name: policyName,
      },
      {
        onSuccess: () => {
          setShowPolicyDialog(false);
        },
      },
    );
  };

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
          {hasRetentionPolicy ? (
            <DropdownMenuItem disabled>Update Retention Policy</DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => setShowPolicyDialog(true)}>Apply Retention Policy</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <RetentionPolicyDialog
        isOpen={showPolicyDialog}
        onClose={() => setShowPolicyDialog(false)}
        item={item}
        onApply={handleApplyPolicy}
        isPending={applyRetentionPolicy.isPending}
      />
    </>
  );
});

ActionCell.displayName = 'ActionCell';

export const columns: ColumnDef<RetentionPolicyListItem>[] = [
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
    accessorKey: 'retention_policy',
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Retention Policy
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => <span>{row.original.retention_policy || '-'}</span>,
  },
  {
    accessorKey: 'expiration_date',
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Expiration Date
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => <span>{row.original.expiration_date || '-'}</span>,
  },
  {
    accessorKey: 'bucket_name',
    header: ({ column }) => {
      return (
        <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Target Location
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => <span>{row.original.bucket_name || '-'}</span>,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ActionCell,
  },
];
