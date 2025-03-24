import { Link } from 'react-router-dom';

import JobForm from './JobForm';

import { buttonVariants } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const AddJobForm = () => {
  return (
    <div className='mx-auto'>
      <div className='mx-auto w-full max-w-screen-lg px-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-medium leading-10 tracking-tight sm:text-3xl md:text-[30px] md:leading-[3.25rem]'>
            Create Job
          </h1>
          <Link to='/jobs/list' className={buttonVariants({ variant: 'outline' })}>
            List Jobs
          </Link>
        </div>
        <Separator />
        <div className='w-full'>
          <JobForm />
        </div>
      </div>
    </div>
  );
};
export default AddJobForm;
