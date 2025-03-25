// src/pages/ApplyRetentionPolicyForm.tsx
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import LoadingScreen from '../../components/common/LoadingScreen';

import { useApplyRetentionPolicy } from '@/apis/mutations';
import { useApplicationsList, useRetentionPolicyList } from '@/apis/queries';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import useUsername from '@/hooks/useUsername';

const ApplyRetentionPolicyFormSchema = z.object({
  archive_id: z.string().min(1, 'Application is required'),
  policy_name: z.string().min(1, 'Retention policy is required'),
});

type FormValues = z.infer<typeof ApplyRetentionPolicyFormSchema>;

export default function ApplyRetentionPolicyForm() {
  const navigate = useNavigate();
  const applyRetentionPolicy = useApplyRetentionPolicy();
  const applications = useApplicationsList();
  const retentionPolicies = useRetentionPolicyList();
  const username = useUsername();

  const form = useForm<FormValues>({
    resolver: zodResolver(ApplyRetentionPolicyFormSchema),
    defaultValues: {
      archive_id: '',
      policy_name: '',
    },
  });

  const { control, handleSubmit } = form;

  if (applications.isLoading || retentionPolicies.isLoading) {
    return <LoadingScreen />;
  }

  const onSubmit = (values: FormValues) => {
    try {
      applyRetentionPolicy.mutate(
        {
          archive_id: values.archive_id,
          policy_name: values.policy_name,
        },
        {
          onSuccess: () => {
            navigate('/apply-retention-policy');
          },
        },
      );
    } catch (error) {
      console.error('Error applying retention policy:', error);
    }
  };

  return (
    <div className='mx-auto'>
      <div className='mx-auto w-full max-w-screen-lg px-6'>
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-medium leading-10 tracking-tight sm:text-3xl md:text-[30px] md:leading-[3.25rem]'>
            Apply Retention Policy
          </h1>
          <Button variant='outline' onClick={() => navigate('/apply-retention-policy')}>
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

            <FormField
              control={control}
              name='policy_name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Retention Policy</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a retention policy' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {retentionPolicies.data?.map((policy) => (
                        <SelectItem key={policy.policy_name} value={policy.policy_name}>
                          {policy.policy_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='flex justify-end pt-6'>
              <Button type='submit' disabled={applyRetentionPolicy.isPending || !username}>
                {applyRetentionPolicy.isPending ? 'Applying...' : 'Apply Retention Policy'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
