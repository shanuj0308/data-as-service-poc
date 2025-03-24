// src/pages/Admin/Administration/LegalHold/AddLegalHoldForm.tsx
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCreateLegalHold } from '@/apis/mutations';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useUsername from '@/hooks/useUsername';
import { LegalHoldSchema } from '@/types/common';

export default function AddLegalHoldForm() {
  const navigate = useNavigate();
  const username = useUsername();
  const createLegalHold = useCreateLegalHold();

  const form = useForm<z.infer<typeof LegalHoldSchema>>({
    resolver: zodResolver(LegalHoldSchema),
    defaultValues: {
      legalhold_name: '',
      Description: '',
    },
  });

  const { control, handleSubmit, reset } = form;

  const onSubmit = (values: z.infer<typeof LegalHoldSchema>) => {
    try {
      const payload = {
        legalhold_name: values.legalhold_name,
        description: values.Description, // Convert Description to description
        user_id: username || 'anonymous',
      };

      createLegalHold.mutate(payload, {
        onSuccess: () => {
          navigate('/legal-hold');
          reset();
        },
      });
    } catch (error) {
      console.error('Form submission error', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='mx-auto max-w-3xl space-y-3 py-10'>
        <FormField
          control={control}
          name='legalhold_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Legal Hold Name</FormLabel>
              <FormControl>
                <Input placeholder='Enter legal hold name' type='text' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name='Description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder='Enter description' type='text' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={createLegalHold.isPending || !username} type='submit'>
          {createLegalHold.isPending ? 'Creating Legal Hold...' : 'Create Legal Hold'}
        </Button>
      </form>
    </Form>
  );
}
