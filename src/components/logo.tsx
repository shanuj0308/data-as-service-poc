import { User } from 'lucide-react';

import { cn } from '@/lib/utils';

export const Logo = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground',
        className,
      )}
      {...props}
    >
      <User className='-mt-0.5 h-5 w-5' />
    </div>
  );
};
