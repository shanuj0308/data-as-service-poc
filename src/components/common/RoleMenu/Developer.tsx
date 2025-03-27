import { Link } from 'react-router-dom';

import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';

export function DeveloperMenu() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Connection</MenubarTrigger>
        <MenubarContent>
          <MenubarItem asChild className='cursor-pointer'>
            <Link to='/source-connection'>Source</Link>
          </MenubarItem>
          <MenubarItem asChild className='cursor-pointer'>
            <Link to='/target-connection'>Target</Link>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Policies</MenubarTrigger>
        <MenubarContent>
          <MenubarItem asChild className='cursor-pointer'>
            <Link to='/apply-retention-policy'>Retention</Link>
          </MenubarItem>
          <MenubarItem asChild className='cursor-pointer'>
            <Link to='/apply-legal-hold'>Legal Hold</Link>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>
          <Link to='/jobs/list'>Jobs</Link>
        </MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>
          <Link to='/summary-report'>Summary Report</Link>
        </MenubarTrigger>
      </MenubarMenu>
    </Menubar>
  );
}
