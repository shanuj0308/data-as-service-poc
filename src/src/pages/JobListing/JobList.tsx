import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import { Loader2 } from 'lucide-react';

import { columns } from './JobListColumns';
import { ListTable } from './JobListTable';
import { RunJobFormValues, RunJobModal } from './RunJob';

import { useRunJob } from '@/apis/mutations';
import { useJobDataList } from '@/apis/queries';
import useUsername from '@/components/hooks/useUsername';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { jobTableConstants } from '@/constant/apiConstants';
import { JobData } from '@/types/common';

export default function JobList() {
  const jobDataList = useJobDataList();
  const jobRun = useRunJob();
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isRunModalOpen, setIsRunModalOpen] = useState(false);
  const username = useUsername();

  if (jobDataList.isFetching) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='flex flex-col items-center gap-2'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
          <p className='text-sm text-muted-foreground'>Loading data...</p>
        </div>
      </div>
    );
  }

  const handleRunJob = (values: RunJobFormValues) => {
    console.log('Running job with settings:', values, 'for job:', selectedJob);
    // Implement your run job logic here
    const data = {
      archive_id: selectedJob.job_id,
      worker_capacity: values.maxCapacity,
      worker_type: values.workerType,
      archive_schedule: {
        run_now: values.runNow,
        date: '',
        time: '',
      },
      triggered_by: username,
    };
    jobRun.mutate(data);
  };

  const openRunModal = (job: JobData) => {
    setSelectedJob(job);
    setIsRunModalOpen(true);
  };

  if (jobDataList.isFetching) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='flex flex-col items-center gap-2'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
          <p className='text-sm text-muted-foreground'>Loading data...</p>
        </div>
      </div>
    );
  }

  // Create a modified columns array with the run job action
  const columnsWithActions = columns.map((col) => {
    if (col.id === 'actions') {
      return {
        ...col,
        cell: ({ row }: { row: any }) => {
          const job = row.original;
          return (
            <div className='flex items-center'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' className='h-8 w-8 p-0'>
                    <span className='sr-only'>Open menu</span>
                    <MoreHorizontal className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  {job.archive_status === 'Archive Queue' && (
                    <DropdownMenuItem onClick={() => openRunModal(job)}>Run Job</DropdownMenuItem>
                  )}
                  {/* <DropdownMenuItem>Job Details</DropdownMenuItem> */}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      };
    }
    return col;
  });
  return (
    <div className='mx-auto'>
      <div className='w-full'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-medium leading-10 tracking-tight sm:text-3xl md:text-[30px] md:leading-[3.25rem]'>
            Jobs Status
          </h1>
          <Link to='/jobs/add' className={buttonVariants({ variant: 'outline' })}>
            Add Job
          </Link>
        </div>
        <Separator />
        <div className='w-full'>
          <div className='flex items-center justify-center gap-2 py-4'>
            <ListTable
              columns={columnsWithActions}
              filterCol={jobTableConstants.JOB_NAME}
              data={jobDataList.data ?? []}
            />
          </div>
        </div>
      </div>
      {/* Run Job Modal */}
      <RunJobModal
        isOpen={isRunModalOpen}
        onClose={() => setIsRunModalOpen(false)}
        onSubmit={handleRunJob}
        jobName={selectedJob?.job_name}
      />
    </div>
  );
}
