'use client';

import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { InteractionStatus } from '@azure/msal-browser';
import { UnauthenticatedTemplate, useMsal } from '@azure/msal-react';

import { loginRequest } from '@/auth/authConfig';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3, 'Password must be at least 3 characters long'),
});

const Login = () => {
  /* Checking if user logged in */
  const { instance, inProgress } = useMsal();

  const handleLoginRedirect = () => {
    instance
      .loginPopup({
        ...loginRequest,
        prompt: 'create',
      })
      .catch((error) => console.log(error));
  };

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(formSchema),
  });

  const navigate = useNavigate();

  const onSubmit = () => {
    navigate('/dashboard');
  };

  return (
    <div className='mt-11 flex items-center justify-center'>
      <div className='flex w-full max-w-sm flex-col items-center rounded-lg border p-6 shadow-sm'>
        <div className='flex items-center'>
          <Logo />
          <p className='ml-4 text-xl font-bold tracking-tight'>Log in to Kvue Vault</p>
        </div>

        <UnauthenticatedTemplate>
          <Button onClick={handleLoginRedirect} className='mt-8 w-full gap-3'>
            <LogIn />
            {inProgress === InteractionStatus.Login ? 'Logging using popup' : 'SSO Login'}
          </Button>
        </UnauthenticatedTemplate>

        <div className='my-4 flex w-full items-center justify-center overflow-hidden'>
          <Separator />
          <span className='px-2 text-sm'>OR</span>
          <Separator />
        </div>

        <Form {...form}>
          <form className='w-full space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type='email' placeholder='Email' className='w-full' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type='password' placeholder='Password' className='w-full' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className='mt-4 w-full'>
              Continue with Email
            </Button>
          </form>
        </Form>

        <div className='mt-5 space-y-5'>
          <Link to='#' className='block text-center text-sm text-muted-foreground underline'>
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
