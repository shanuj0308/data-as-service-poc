import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCreateS3Connection } from '@/apis/mutations';
import { useTargetConnectionList } from '@/apis/queries';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { fetchUniqueData } from '@/lib/utils';
import { TargetFormSchema } from '@/types/common';

const SelectExisting = () => {
  const s3Buckets = useTargetConnectionList();
  const createNewConnection = useCreateS3Connection();
  const navigate = useNavigate();

  let uniqueS3Buckets: typeof s3Buckets.data = [];
  if (s3Buckets.data) {
    uniqueS3Buckets = fetchUniqueData(s3Buckets.data, 'bucket_name');
  }

  const form1 = useForm<z.infer<typeof TargetFormSchema>>({
    resolver: zodResolver(TargetFormSchema),
  });
  const { control, handleSubmit, reset } = form1;

  const onSubmitForm = (values: z.infer<typeof TargetFormSchema>) => {
    try {
      console.log(values);
      createNewConnection.mutate(values, {
        onSuccess: () => {
          navigate('/target-connection');
        },
      });
      reset();
    } catch (error) {
      console.error('Form submission error', error);
    }
  };

  if (s3Buckets.isFetching) {
    return (
      <div className='flex items-center justify-center py-8'>
        <div className='flex flex-col items-center gap-2'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
          <p className='text-sm text-muted-foreground'>Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <Form {...form1}>
      <form onSubmit={handleSubmit(onSubmitForm)} className='mx-auto max-w-3xl space-y-3 py-10'>
        <FormField
          control={control}
          name='bucket_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>S3 Buckets</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select the existing s3 bucket' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {uniqueS3Buckets!.map((connection) => (
                    <SelectItem key={connection.bucket_name} value={connection.bucket_name}>
                      {connection.bucket_name}
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
  );
};
export default SelectExisting;
