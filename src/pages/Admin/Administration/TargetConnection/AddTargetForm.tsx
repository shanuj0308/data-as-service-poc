import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import SelectExisting from './SelectExisting';
import RadioGroupOrientationDemo from './SwitchFormRadio';

import { useCreateS3Connection } from '@/apis/mutations';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useUsername from '@/hooks/useUsername';
import { TargetFormSchema } from '@/types/common';

export default function FormSelection() {
  const navigate = useNavigate();
  const createNewConnection = useCreateS3Connection();
  const [selectedForm, setSelectedForm] = useState<'select' | 'create' | null>('select');
  const username = useUsername();

  const form = useForm<z.infer<typeof TargetFormSchema>>({
    resolver: zodResolver(TargetFormSchema),
  });
  const { control, handleSubmit, reset } = form;

  const onSubmitForm = (values: z.infer<typeof TargetFormSchema>) => {
    try {
      const payload = {
        ...values,
        created_by: username || 'anonymous',
      };
      createNewConnection.mutate(payload, {
        onSuccess: () => {
          navigate('/target-connection');
        },
      });
      reset();
    } catch (error) {
      console.error('Form submission error', error);
    }
  };

  return (
    <>
      <RadioGroupOrientationDemo setForm={setSelectedForm} />
      {selectedForm === 'select' && <SelectExisting />}
      {selectedForm === 'create' && (
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmitForm)} className='mx-auto max-w-3xl space-y-3 py-10'>
            <FormField
              control={control}
              name='bucket_name'
              defaultValue=''
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bucket Name</FormLabel>
                  <FormControl>
                    <Input placeholder='s3 Bucket name' type='text' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name='connection_name'
              defaultValue=''
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Connection Name</FormLabel>
                  <FormControl>
                    <Input placeholder='connection name' type='text' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name='description'
              defaultValue=''
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder='description' type='text' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={createNewConnection.isPending} type='submit'>
              {createNewConnection.isPending ? 'Creating..' : 'Create'}
            </Button>
          </form>
        </Form>
      )}
    </>
  );
}
