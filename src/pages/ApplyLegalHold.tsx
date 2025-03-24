// src/pages/ApplyLegalHold.tsx
import { Loader2 } from 'lucide-react';

import { columns } from './Admin/Administration/LegalHold/ListColumns';
import { ListTable } from './Admin/Administration/LegalHold/ListTable';

import { useLegalHoldList } from '@/apis/queries';
import { Separator } from '@/components/ui/separator';

export default function ApplyLegalHold() {
  const legalHoldList = useLegalHoldList();

  if (legalHoldList.isFetching) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='flex flex-col items-center gap-2'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
          <p className='text-sm text-muted-foreground'>Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='mx-auto'>
      <div className='mx-auto w-full max-w-screen-lg px-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-medium leading-10 tracking-tight sm:text-3xl md:text-[30px] md:leading-[3.25rem]'>
            Legal Hold Management
          </h1>
        </div>
        <Separator />
        <div className='w-full'>
          <ListTable columns={columns} data={legalHoldList.data ?? []} filterCol='archive_name' />
        </div>
      </div>
    </div>
  );
}
