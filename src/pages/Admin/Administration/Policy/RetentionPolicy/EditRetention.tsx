import { Link, useParams } from 'react-router-dom';

import EditRetentionForm from './EditRetentionForm';

import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const EditRetention = () => {
  const { policy_name } = useParams();

  return (
    <div className='mx-auto'>
      <div className='mx-auto w-full max-w-screen-lg px-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-medium leading-10 tracking-tight sm:text-3xl md:text-[30px] md:leading-[3.25rem]'>
            Retention Policy
          </h1>
          <Link to='/retention-policy' className={buttonVariants({ variant: 'outline' })}>
            List Retention
          </Link>
        </div>
        <Separator />
        <div className='w-full'>
          <EditRetentionForm policy_name={policy_name ?? ''} />
        </div>
      </div>
    </div>
  );
};
export default EditRetention;
