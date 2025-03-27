import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import { columns } from './ListColumns';
import { ListTable } from './ListTable';

import { useRetentionPolicyList } from '@/apis/queries';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import useLoggedInUserRole from '@/hooks/useLoggedInUserRole';

export default function ListRetentionPolicy() {
  const retentionList = useRetentionPolicyList();
  const { highestRole } = useLoggedInUserRole();

  if (retentionList.isFetching) {
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
            Retention Policies
          </h1>
          <Button variant={'outline'} user_role={highestRole}>
            <Link to='/retention-policy/add'>Add Policies</Link>
          </Button>
        </div>
        <Separator />
        <div className='w-full'>
          <div className='flex items-center justify-center gap-2 py-4'>
            <ListTable columns={columns(highestRole)} filterCol='policy_name' data={retentionList.data ?? []} />
          </div>
        </div>
      </div>
    </div>
  );
}
