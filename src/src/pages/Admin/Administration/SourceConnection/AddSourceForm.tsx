// src/pages/Admin/Administration/SourceConnection/AddSourceForm.tsx

import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCreateSourceConnection, useTestSourceConnection } from '@/apis/mutations';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import useUsername from '@/hooks/useUsername';
import { SourceFormSchema } from '@/types/common';

export default function AddSourceForm() {
  const navigate = useNavigate();
  const createConnection = useCreateSourceConnection();
  const testSourceConnection = useTestSourceConnection();
  const username = useUsername();

  const form = useForm<z.infer<typeof SourceFormSchema>>({
    resolver: zodResolver(SourceFormSchema),
  });
  const { control, handleSubmit, reset, trigger, getValues } = form;

  function onSubmit(values: z.infer<typeof SourceFormSchema>) {
    try {
      const payload = {
        ...values,
        created_by: username || 'anonymous',
      };
      createConnection.mutate(payload, {
        onSuccess: () => {
          navigate('/source-connection');
          reset();
        },
      });
    } catch (error) {
      console.error('Form submission error', error);
    }
  }

  async function testConnection() {
    const isValid = await trigger();
    if (isValid) {
      const values = getValues();
      testSourceConnection.mutate(values);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='mx-auto max-w-3xl space-y-3 py-10'>
        <FormField
          control={control}
          name='database_engine'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Database Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select the database type' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='oracledb'>Oracle DB</SelectItem>
                  <SelectItem value='mssql'>MsSql</SelectItem>
                  <SelectItem value='mysql'>MySql</SelectItem>
                  <SelectItem value='postgresql'>PostgresSql</SelectItem>
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

        <FormField
          control={control}
          name='hostname'
          defaultValue=''
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hostname</FormLabel>
              <FormControl>
                <Input placeholder='hostname' type='text' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='database'
          defaultValue=''
          render={({ field }) => (
            <FormItem>
              <FormLabel>Database name</FormLabel>
              <FormControl>
                <Input placeholder='database' type='text' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='port'
          defaultValue=''
          render={({ field }) => (
            <FormItem>
              <FormLabel>Port</FormLabel>
              <FormControl>
                <Input placeholder='port' type='text' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='username'
          defaultValue=''
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder='username' type='text' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='password'
          defaultValue=''
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder='password' type='password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex items-stretch justify-between gap-2'>
          <Button disabled={createConnection.isPending} type='submit'>
            {createConnection.isPending ? 'Creating..' : 'Create'}
          </Button>
          <Button onClick={testConnection} variant={'outline'} disabled={testSourceConnection.isPending} type='button'>
            {testSourceConnection.isPending ? 'Testing..' : 'Test Connection'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
