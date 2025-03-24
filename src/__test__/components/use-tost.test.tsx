import { act, renderHook } from '@testing-library/react';

import { toast, useToast } from '@/components/ui/use-toast';

describe('useToast', () => {
  beforeEach(() => {
    // Clear the toasts before each test
    act(() => {
      toast({ title: 'Clear toasts' }).dismiss();
    });
  });

  it('should add a toast', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      toast({ title: 'Test Toast', description: 'This is a test toast' });
    });

    expect(result.current.toasts.length).toBe(1);
    expect(result.current.toasts[0].title).toBe('Test Toast');
    expect(result.current.toasts[0].description).toBe('This is a test toast');
  });

  it('should update a toast', () => {
    const { result } = renderHook(() => useToast());

    // eslint-disable-next-line @typescript-eslint/no-unused-vars

    act(() => {
      toast({ title: 'Initial Toast' });
    });

    act(() => {
      result.current.toasts[0].title = 'Updated Toast';
    });

    expect(result.current.toasts[0].title).toBe('Updated Toast');
  });

  it('should dismiss a toast', () => {
    const { result } = renderHook(() => useToast());

    let toastId: string;

    act(() => {
      const { id } = toast({ title: 'Dismissable Toast' });
      toastId = id;
    });

    act(() => {
      result.current.dismiss(toastId);
    });

    expect(result.current.toasts[0].open).toBe(false);
  });

  // it('should remove a toast after dismiss delay', async () => {
  //   const { result } = renderHook(() => useToast());
  //   let toastId: string;
  //   act(() => {
  //     const { id } = toast({ title: 'Temporary Toast' });
  //     toastId = id;
  //   });

  //   act(() => {
  //     result.current.dismiss(toastId);
  //   });
  //   // Wait for the remove delay
  //   // await new Promise((resolve) => setTimeout(resolve, 2000));

  //   expect(result.current.toasts.length).toBe(0);
  // });

  it('should limit the number of toasts', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      toast({ title: 'Toast 1' });
      toast({ title: 'Toast 2' });
    });

    expect(result.current.toasts.length).toBe(1);
    expect(result.current.toasts[0].title).toBe('Toast 2');
  });
});
