import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define the schema for the form
const RunJobSchema = z.object({
  runNow: z.boolean().default(true),
  workerType: z.string().min(1, 'Worker type is required'),
  maxCapacity: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 1 && Number(val) < 100, {
    message: 'Maximum capacity must be a positive number > 2',
  }).default('2'),
});

export type RunJobFormValues = z.infer<typeof RunJobSchema>;

interface RunJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: RunJobFormValues) => void;
  jobName?: string;
}

export function RunJobModal({ isOpen, onClose, onSubmit, jobName }: RunJobModalProps) {
  const form = useForm<RunJobFormValues>({
    resolver: zodResolver(RunJobSchema),
    defaultValues: {
      runNow: true,
      workerType: '',
      maxCapacity: '2',
    },
  });

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      form.reset({
        runNow: true,
        workerType: '',
        maxCapacity: '2',
      });
    }
  }, [isOpen, form]);

  const handleSubmit = (values: RunJobFormValues) => {
    onSubmit(values);
    onClose();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Run Job for <strong>{jobName ? `${jobName}` : ''}</strong></DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='runNow'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormLabel>Execution Time</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => field.onChange(value === 'true')}
                        defaultValue={field.value ? 'true' : 'false'}
                        className='flex flex-row space-x-1'
                      >
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value='true' id='run-now' />
                          <Label htmlFor='run-now'>Run Now</Label>
                        </div>
                        <div className='flex items-center space-x-2 disabled'>
                          <RadioGroupItem disabled value='false' id='schedule' />
                          <Label htmlFor='schedule'>Schedule</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='workerType'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Worker Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select worker type' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='G.1X'>G.1X</SelectItem>
                        <SelectItem value='G.2X'>G.2X</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='maxCapacity'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Worker Maximum Capacity</FormLabel>
                    <FormControl>
                      <Input type='number' placeholder='Enter maximum capacity' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className='flex justify-between'>
              <div className='flex gap-2'>
                <Button type='button' variant='outline' onClick={handleClose}>
                  Cancel
                </Button>
                <Button type='submit'>Run Job</Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
