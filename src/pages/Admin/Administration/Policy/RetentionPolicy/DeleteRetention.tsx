'use client';

import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useDeleteRetention } from '@/apis/mutations';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

const formSchema = z.object({
  policy_name: z.string(),
});

export default function DeleteRetention({
  policy_name,
  setIsOpen,
}: {
  policy_name: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const deleteRetention = useDeleteRetention();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      policy_name: policy_name,
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      deleteRetention.mutate(data.policy_name, {
        onSuccess: () => {
          setIsOpen(false);
        },
      });
    } catch (error) {
      console.error('Error while deleting', error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((policy_name) => onSubmit(policy_name))} className='space-y-6 px-4 sm:px-0'>
        <div className='flex w-full justify-center sm:space-x-6'>
          <Button
            size='lg'
            variant='outline'
            disabled={deleteRetention.isPending}
            className='hidden w-full sm:block'
            type='button'
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            size='lg'
            type='submit'
            disabled={deleteRetention.isPending}
            className='w-full bg-red-500 hover:bg-red-400'
          >
            {deleteRetention.isPending ? 'Deleting...' : <span>Delete</span>}
          </Button>
        </div>
      </form>
    </Form>
  );
}
