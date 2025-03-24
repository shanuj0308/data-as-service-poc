// src/pages/Admin/Administration/LegalHold/AddLegalHold.tsx
import { Link } from 'react-router-dom';

import AddLegalHoldForm from './AddLegalHoldForm';

import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const AddLegalHoldPage = () => {
  return (
    <div className='mx-auto'>
      <div className='mx-auto w-full max-w-screen-lg px-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-medium leading-10 tracking-tight sm:text-3xl md:text-[30px] md:leading-[3.25rem]'>
            Legal Hold
          </h1>
          <Link to='/legal-hold' className={buttonVariants({ variant: 'outline' })}>
            List Legal Hold
          </Link>
        </div>
        <Separator />
        <div className='w-full'>
          <AddLegalHoldForm />
        </div>
      </div>
    </div>
  );
};

export default AddLegalHoldPage;
