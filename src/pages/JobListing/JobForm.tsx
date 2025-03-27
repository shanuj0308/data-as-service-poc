import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCreateJob } from '@/apis/mutations';
import { useRetentionPolicyList, useSourceConnectionList, useTargetConnectionList } from '@/apis/queries';
import { Button } from '@/components/ui/button';
import Combobox from '@/components/ui/combobox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import useUsername from '@/hooks/useUsername';
import { JobFormSchema } from '@/types/common';

export default function JobForm() {
  const navigate = useNavigate();

  const createJob = useCreateJob();
  const username = useUsername();

  const defaultValues = {
    archive_name: '',
    description: '',
    sgrc_id: '',
    app_id: '',
    app_name: '',
    archival_type: '',
    source_name: '',
    target_name: '',
    created_by: '',
    retention_policy: '',
    legal_hold: '',
  };

  const form = useForm<z.infer<typeof JobFormSchema>>({
    resolver: zodResolver(JobFormSchema),
    defaultValues,
  });
  const { control, setValue, handleSubmit, reset } = form;

  // Fetch dropdown options using TanStack Query
  const { data: sourceConnections, isLoading: isSourceLoading, isError: isSourceError } = useSourceConnectionList();
  const { data: targetConnections, isLoading: isTargetLoading, isError: isTargetError } = useTargetConnectionList();
  const { data: retentionPolicy, isLoading: isRetentionLoading, isError: isRetentionError } = useRetentionPolicyList();

  if (username) {
    setValue('created_by', username);
  }

  function onSubmit(values: z.infer<typeof JobFormSchema>) {
    try {
      console.log(values);
      toast({
        variant: 'default',
        title: 'Job submitted for creation.',
      });
      navigate('/jobs/list');

      createJob.mutate(values, {
        onSuccess: () => {},
        onError: (error) => {
          console.log('Job creation error', error);
          reset(defaultValues);
        },
      });

      reset(defaultValues);
    } catch (error) {
      console.error('Form submission error', error);
      reset(defaultValues);
    }
  }

  return (
    <span>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className='mx-auto justify-items-center space-y-3 pb-4 pt-10'>
          <FormField
            control={control}
            name='archive_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Archive Job Name</FormLabel>
                <FormControl>
                  <Input className='w-[500px]' placeholder='Please enter archive job name' type='text' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input className='w-[500px]' placeholder='Please enter description' type='text' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='sgrc_id'
            render={({ field }) => (
              <FormItem>
                <FormLabel>SGRC ID</FormLabel>
                <FormControl>
                  <Input className='w-[500px]' placeholder='Please enter sgrc id' type='text' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='app_id'
            render={({ field }) => (
              <FormItem>
                <FormLabel>App Id</FormLabel>
                <FormControl>
                  <Input className='w-[500px]' placeholder='Please enter app id' type='text' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='app_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>App Name</FormLabel>
                <FormControl>
                  <Input className='w-[500px]' placeholder='Please enter app name' type='text' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Archival Type Combobox */}
          <FormField
            control={control}
            name='archival_type'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Archival Type</FormLabel>
                <Combobox
                  label='Archival Type'
                  items={['Structured', 'Unstructured']}
                  selectedValue={field.value}
                  setSelectedValue={field.onChange}
                  width={500}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Source Connection Combobox */}
          <FormField
            control={control}
            name='source_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source Connection</FormLabel>
                {isSourceError ? (
                  <p className='text-red-500'> Failed to load source connections. Please try again.</p>
                ) : (
                  <Combobox
                    label='Source Connection'
                    items={sourceConnections?.map((conn) => conn.connection_name) || []}
                    selectedValue={field.value}
                    setSelectedValue={field.onChange}
                    isLoading={isSourceLoading}
                    width={500}
                  />
                )}

                <FormMessage />
              </FormItem>
            )}
          />

          {/* Target Connection Combobox */}
          <FormField
            control={control}
            name='target_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Target Connection</FormLabel>
                {isTargetError ? (
                  <p className='text-red-500'> Failed to load target connections. Please try again.</p>
                ) : (
                  <Combobox
                    label='Target Connection'
                    items={targetConnections?.map((conn) => conn.connection_name) || []}
                    selectedValue={field.value}
                    setSelectedValue={field.onChange}
                    isLoading={isTargetLoading}
                    width={500}
                  />
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Retention Policy Combobox */}
          <FormField
            control={control}
            name='retention_policy'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Retention Policy</FormLabel>
                {isRetentionError ? (
                  <p className='text-red-500'> Failed to Retention Policies. Please try again.</p>
                ) : (
                  <Combobox
                    label='Retention Policy'
                    items={retentionPolicy?.map((retention_policy) => retention_policy.policy_name) || []}
                    selectedValue={field.value}
                    setSelectedValue={field.onChange}
                    isLoading={isRetentionLoading}
                    width={500}
                  />
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Legal Hold Policy Combobox */}
          <FormField
            control={control}
            name='legal_hold'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Legal Hold</FormLabel>
                <Combobox
                  label='Legal Hold'
                  items={['True', 'False']}
                  selectedValue={field.value}
                  setSelectedValue={field.onChange}
                  width={500}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex justify-center pt-4'>
            <Button style={{ width: '360px' }} type='submit' variant={'outline'}>
              Submit
            </Button>
          </div>
        </form>
      </Form>
      <div className='flex justify-center'>
        <Link to='/jobs/list'>
          <Button style={{ width: '360px' }}> Cancel</Button>
        </Link>
      </div>
    </span>
  );
}
