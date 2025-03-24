'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useTestSourceConnection, useUpdateSourceConnection } from '@/apis/mutations';
import { useSourceConnection } from '@/apis/queries';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { SourceFormSchema } from '@/types/common';

export default function SourceForm({ connection_name }: { connection_name: string }) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const updateConnection = useUpdateSourceConnection();
  const getSourceConnection = useSourceConnection(connection_name);
  const testSourceConnection = useTestSourceConnection();

  const form = useForm<z.infer<typeof SourceFormSchema>>({
    resolver: zodResolver(SourceFormSchema),
    defaultValues: {
      connection_name: '',
      description: '',
      hostname: '',
      port: '',
      database: '',
      username: '',
      password: '',
      database_engine: '', // Empty string for Combobox
    },
  });
  const { control, handleSubmit, reset, trigger, getValues } = form;

  // Set default values when data is fetched
  useEffect(() => {
    if (getSourceConnection.data) {
      reset(getSourceConnection.data); // Reset form with fetched data
    }
  }, [getSourceConnection.data, reset]);

  function onSubmit(values: z.infer<typeof SourceFormSchema>) {
    try {
      const payload = {
        ...values,
        // Include the connectionId
      };
      updateConnection.mutate(payload, {
        onSuccess: () => {
          navigate('/source-connection');
        },
      });
    } catch (error) {
      console.error('Form submission error', error);
      toast({
        variant: 'destructive',
        title: 'Error updting connection.',
        description: 'Error while updating the connection. Please try again.',
      });
    }
  }

  async function testConnection() {
    const isValid = await trigger();
    if (isValid) {
      const values = getValues();
      testSourceConnection.mutate(values);
    }
  }

  if (getSourceConnection.status === 'pending') {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='flex flex-col items-center gap-2'>
          <Loader2 className='h-8 w-8 animate-spin text-primary' />
          <p className='text-sm text-muted-foreground'>Loading data...</p>
        </div>
      </div>
    );
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
              <Select onValueChange={field.onChange} defaultValue={getSourceConnection.data?.database_engine}>
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
          render={({ field }) => (
            <FormItem>
              <FormLabel>Connection Name</FormLabel>
              <FormControl>
                <Input readOnly disabled autoComplete='off' placeholder='connection name' type='text' {...field} />
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
                <Input autoComplete='off' placeholder='description' type='text' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='hostname'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hostname</FormLabel>
              <FormControl>
                <Input autoComplete='off' placeholder='hostname' type='text' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='port'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Port</FormLabel>
              <FormControl>
                <Input autoComplete='off' placeholder='port' type='text' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='database'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Database name</FormLabel>
              <FormControl>
                <Input autoComplete='off' placeholder='database' type='text' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input autoComplete='off' placeholder='username' type='text' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input autoComplete='off' placeholder='password' type='password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex items-stretch justify-between gap-2'>
          <Button disabled={updateConnection.isPending} type='submit'>
            {updateConnection.isPending ? 'Updating..' : 'Update'}
          </Button>
          <Button onClick={testConnection} variant={'outline'} disabled={testSourceConnection.isPending} type='button'>
            {testSourceConnection.isPending ? 'Testing..' : 'Test Connection'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
