import { Link, useParams } from 'react-router-dom';

import EditTargetForm from './EditTargetForm';

import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const EditTargetCon = () => {
  const { connection_name, bucket_name } = useParams();

  return (
    <div className='mx-auto'>
      <div className='mx-auto w-full max-w-screen-lg px-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-medium leading-10 tracking-tight sm:text-3xl md:text-[30px] md:leading-[3.25rem]'>
            Target Connections
          </h1>
          <Link to='/target-connection' className={buttonVariants({ variant: 'outline' })}>
            List Connection
          </Link>
        </div>
        <Separator />
        <div className='w-full'>
          <EditTargetForm connection_name={connection_name ?? ''} bucket_name={bucket_name ?? ''} />
        </div>
      </div>
    </div>
  );
};
export default EditTargetCon;
