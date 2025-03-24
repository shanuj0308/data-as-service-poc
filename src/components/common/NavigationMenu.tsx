import { Link } from 'react-router-dom';
import { BookOpen, Home, Rss } from 'lucide-react';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

const navigationMenuItems = [
  { title: 'Home', href: '#', icon: Home, isActive: true },
  { title: 'Blog', href: '#blog', icon: Rss },
  { title: 'Docs', href: '#docs', icon: BookOpen },
];

export default function NavigationMenuWithActiveItem() {
  return (
    <NavigationMenu>
      <NavigationMenuList className='space-x-8'>
        {navigationMenuItems.map((item) => (
          <NavigationMenuItem key={item.title}>
            <NavigationMenuLink
              className={cn(
                'group relative inline-flex h-9 w-max items-center justify-center px-0.5 py-2 text-sm font-medium',
                'before:absolute before:inset-x-0 before:bottom-0 before:h-[2px] before:scale-x-0 before:bg-primary before:transition-transform',
                'hover:text-accent-foreground hover:before:scale-x-100',
                'focus:text-accent-foreground focus:outline-none focus:before:scale-x-100',
                'disabled:pointer-events-none disabled:opacity-50',
                'data-[active]:before:scale-x-100 data-[state=open]:before:scale-x-100',
              )}
              asChild
              active={item.isActive}
            >
              <Link to={item.href}>
                <item.icon className='mr-2 h-5 w-5' />
                {item.title}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
