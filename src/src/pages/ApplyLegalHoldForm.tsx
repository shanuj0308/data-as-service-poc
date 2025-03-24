// src/pages/ApplyLegalHoldForm.tsx
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import LoadingScreen from '../components/common/LoadingScreen';

import { useApplyLegalHold } from '@/apis/mutations';
import { useApplicationsList } from '@/apis/queries';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import useUsername from '@/hooks/useUsername';

const ApplyLegalHoldFormSchema = z.object({
  archive_id: z.string().min(1, 'Application is required'),
});

type FormValues = z.infer<typeof ApplyLegalHoldFormSchema>;

export default function ApplyLegalHoldForm() {
  const navigate = useNavigate();
  const applyLegalHold = useApplyLegalHold();
  const applications = useApplicationsList();
  const username = useUsername();

  const form = useForm<FormValues>({
    resolver: zodResolver(ApplyLegalHoldFormSchema),
    defaultValues: {
      archive_id: '',
    },
  });

  const { control, handleSubmit } = form;

  if (applications.isLoading) {
    return <LoadingScreen />;
  }

  const onSubmit = (values: FormValues) => {
    try {
      applyLegalHold.mutate(
        {
          archive_id: values.archive_id,
          policy_name: 'True',
        },
        {
          onSuccess: () => {
            navigate('/apply-legal-hold');
          },
        },
      );
    } catch (error) {
      console.error('Error applying legal hold:', error);
    }
  };

  return (
    <div className='mx-auto'>
      <div className='mx-auto w-full max-w-screen-lg px-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-medium leading-10 tracking-tight sm:text-3xl md:text-[30px] md:leading-[3.25rem]'>
            Apply Legal Hold
          </h1>
          <Button variant='outline' onClick={() => navigate('/apply-legal-hold')}>
            Back
          </Button>
        </div>
        <Separator />
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className='mx-auto max-w-3xl space-y-6 py-10'>
            <FormField
              control={control}
              name='archive_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select an application' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {applications.data?.map((app) => (
                        <SelectItem key={app.id} value={app.id}>
                          {app.archive_name} ({app.database_engine})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end pt-6'>
              <Button type='submit' disabled={applyLegalHold.isPending || !username}>
                {applyLegalHold.isPending ? 'Applying...' : 'Apply Legal Hold'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
