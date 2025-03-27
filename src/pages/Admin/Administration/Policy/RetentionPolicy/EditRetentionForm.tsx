'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useUpdateRetention } from '@/apis/mutations';
import { useRetentionPolicy } from '@/apis/queries';
import { Button, buttonVariants } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import useUsername from '@/hooks/useUsername';
import { cn } from '@/lib/utils';
import { RetetntionFormSchema } from '@/types/common';

export default function EditRetentionForm({ policy_name }: { policy_name: string }) {
  const navigate = useNavigate();
  const updateRetention = useUpdateRetention();
  const getRetentionPolicy = useRetentionPolicy(policy_name);
  const username = useUsername();

  const form = useForm<z.infer<typeof RetetntionFormSchema>>({
    resolver: zodResolver(RetetntionFormSchema),
  });
  const { register, control, handleSubmit, reset, watch, formState } = form;

  const retentionType = watch('retention_type');

  // Set default values when data is fetched
  useEffect(() => {
    if (getRetentionPolicy.data) {
      reset(getRetentionPolicy.data); // Reset form with fetched data
    }
  }, [getRetentionPolicy.data, reset]);

  function onSubmit(values: z.infer<typeof RetetntionFormSchema>) {
    try {
      console.log(values);
      updateRetention.mutate(values, {
        onSuccess: () => {
          navigate('/retention-policy');
        },
      });
    } catch (error) {
      console.error('Form submission error', error);
    }
  }

  if (getRetentionPolicy.status === 'pending') return <p>Loading...</p>;

  console.log('Form Error:', formState.errors);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='mx-auto max-w-3xl space-y-3 py-10'>
        <FormField
          control={control}
          name='policy_name'
          defaultValue=''
          render={({ field }) => (
            <FormItem>
              <FormLabel>Policy name</FormLabel>
              <FormControl>
                <Input readOnly disabled placeholder='policy name' type='text' {...field} />
              </FormControl>
              <FormDescription>ex: CY+5, CY+15, ACT+20, CY+5-rollover</FormDescription>
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
              <FormDescription>Some description related to policy</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='retention_type'
          render={({ field }) => (
            <FormItem className='space-y-3'>
              <FormLabel>Retention type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  className='flex flex-col space-y-1'
                  defaultValue={getRetentionPolicy.data ? getRetentionPolicy.data.retention_type : ''}
                >
                  {[
                    ['Period', 'retention_period'],
                    ['Exact Date', 'exact_expiry_date'],
                  ].map((option, index) => (
                    <FormItem className='flex items-center space-x-3 space-y-0' key={index}>
                      <FormControl>
                        <RadioGroupItem value={option[1]} defaultChecked={option[1] === '1'} />
                      </FormControl>
                      <FormLabel className='font-normal'>{option[0]}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {retentionType === 'retention_period' && (
          <>
            <FormField
              control={control}
              name='retention_period_unit'
              render={({ field }) => (
                <FormItem className='space-y-3'>
                  <FormLabel>Retention period</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                      className='flex items-center gap-3'
                      defaultValue={form.getValues('retention_period_unit')}
                    >
                      {[
                        ['Days', 'days'],
                        ['Month', 'months'],
                        ['Year', 'years'],
                      ].map((option, index) => (
                        <FormItem className='flex items-center space-x-3 space-y-0' key={index}>
                          <FormControl>
                            <RadioGroupItem value={option[1]} />
                          </FormControl>
                          <FormLabel className='cursor-pointer font-normal'>{option[0]}</FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name='retention_period'
              defaultValue={0}
              render={({ field }) => (
                <FormItem>
                  <div className='flex space-x-2'>
                    <FormControl>
                      <Input
                        placeholder='Enter number'
                        type='number'
                        className='w-24'
                        {...field}
                        onChange={(e) => {
                          const value = Math.min(365, Math.max(1, parseInt(e.target.value, 10)));
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                  </div>
                  <FormDescription>If retention type is for specific period</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {retentionType === 'exact_expiry_date' && (
          <FormField
            control={control}
            name='exact_expiry_date'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Exact expiry date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn('w-[240px] pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                      >
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar mode='single' selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormDescription>If retention type is exact date</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <input type='hidden' {...register('created_by')} value={username} />

        <Button disabled={updateRetention.isPending} type='submit'>
          {updateRetention.isPending ? 'Updating..' : 'Update'}
        </Button>
        <Link to='/retention-policy' className={buttonVariants({ variant: 'outline', className: 'ml-2' })}>
          Cancel
        </Link>
      </form>
    </Form>
  );
}
