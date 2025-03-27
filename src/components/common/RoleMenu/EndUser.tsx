import { Link } from 'react-router-dom';

import { Menubar, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar';

export function EndUserMenu() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>
          <Link to='/summary-report'>Summary Report</Link>
        </MenubarTrigger>
      </MenubarMenu>
    </Menubar>
  );
}
