import { Link } from 'react-router-dom';

import AddTargetForm from './AddTargetForm';

import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const AddTargetCon = () => {
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
          <AddTargetForm />
        </div>
      </div>
    </div>
  );
};
export default AddTargetCon;
