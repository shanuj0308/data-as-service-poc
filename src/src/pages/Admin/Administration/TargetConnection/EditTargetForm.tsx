import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useUpdateTargetConnection } from '@/apis/mutations';
import { useTargetConnection } from '@/apis/queries';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { TargetFormSchema } from '@/types/common';

export default function TargetForm({ connection_name, bucket_name }: { connection_name: string; bucket_name: string }) {
  const navigate = useNavigate();
  const getSourceConnection = useTargetConnection(connection_name, bucket_name);
  const updateConnection = useUpdateTargetConnection();

  const form = useForm<z.infer<typeof TargetFormSchema>>({
    resolver: zodResolver(TargetFormSchema),
  });
  const { control, handleSubmit, reset } = form;

  const onSubmitForm = (values: z.infer<typeof TargetFormSchema>) => {
    try {
      updateConnection.mutate(values, {
        onSuccess: () => {
          navigate('/target-connection');
        },
      });
      reset();
    } catch (error) {
      console.error('Form submission error', error);
    }
  };

  if (getSourceConnection.status === 'pending') return <p>Loading...</p>;

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmitForm)} className='mx-auto max-w-3xl space-y-3 py-10'>
          <FormField
            control={control}
            name='bucket_name'
            defaultValue={getSourceConnection.data?.bucket_name}
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
            defaultValue={getSourceConnection.data?.connection_name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Connection Name</FormLabel>
                <FormControl>
                  <Input readOnly disabled placeholder='connection name' type='text' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name='description'
            defaultValue={getSourceConnection.data?.description}
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
          <Button disabled={updateConnection.isPending} type='submit'>
            {updateConnection.isPending ? 'Updating..' : 'Update'}
          </Button>
        </form>
      </Form>
    </>
  );
}
