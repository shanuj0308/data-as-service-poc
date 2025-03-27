// src/components/common/NavigationMenuWithDropdown.tsx
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Cog, FileBadge, FileText, User, UserCog2 } from 'lucide-react';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

export default function NavigationMenuWithDropdown() {
  return (
    <NavigationMenu className='z-20'>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <User className='mr-2 h-5 w-5' />
            Administration
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className='lg:grid-cols-full grid w-full gap-1 px-2 py-2'>
              <ListItem to='/source-connection' title='Source Connection'></ListItem>
              <ListItem to='/target-connection' title='Target Connection'></ListItem>
              <ListItem to='/retention-policy' title='Retention Policy'></ListItem>
              {/* <ListItem to='/legal-hold' title='Legal Hold'></ListItem> */}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
            <Link to='/jobs/list'>
              <Cog className='mr-2 h-5 w-5' />
              Jobs
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
            <Link to='/profile'>
              <UserCog2 className='mr-2 h-5 w-5' />
              Profile
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Legal Hold button */}
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
            <Link to='/apply-legal-hold'>
              <FileBadge className='mr-2 h-5 w-5' />
              Legal Hold
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Retention Policy button */}
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
            <Link to='/apply-retention-policy'>
              <FileText className='mr-2 h-5 w-5' />
              Retention Policy
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        {/* Summary Report button */}
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
            <Link to='/summary-report'>
              <FileText className='mr-2 h-5 w-5' />
              Summary Report
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<React.ElementRef<typeof Link>, React.ComponentPropsWithoutRef<typeof Link>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <Link
            ref={ref}
            className={cn(
              'block select-none space-y-1 rounded-md px-4 py-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className,
            )}
            {...props}
          >
            <div className='text-sm font-medium leading-none'>{title}</div>
            <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>{children}</p>
          </Link>
        </NavigationMenuLink>
      </li>
    );
  },
);
ListItem.displayName = 'ListItem';
