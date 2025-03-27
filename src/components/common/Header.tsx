import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Moon, Sun, User2 } from 'lucide-react';
import { AuthenticatedTemplate, useMsal } from '@azure/msal-react';

import { useTheme } from '@/context/theme-provider';

import { AdminMenu } from '@/components/common/RoleMenu/Admin';
import { DeveloperMenu } from '@/components/common/RoleMenu/Developer';
import { EndUserMenu } from '@/components/common/RoleMenu/EndUser';
import { Button } from '@/components/ui/button';
import useLoggedInUserRole from '@/hooks/useLoggedInUserRole';

const Header = () => {
  const { highestRole } = useLoggedInUserRole();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();
  const handleLogoutRedirect = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: '/',
      onRedirectNavigate: () => {
        navigate('/');
        return false;
      },
    });
  };

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='mx-auto flex h-12 items-center justify-between px-4'>
        <Link to='/'>
          <img src={isDark ? '/kenvue-logo-rgb.svg' : '/kenvue-logo-black-rgb.svg'} className='h-12' />
        </Link>
        {activeAccount && highestRole === 'KVUEVAULT_DEV_ADMIN' && <AdminMenu />}
        {activeAccount && highestRole === 'KVUEVAULT_DEV_DEVELOPER' && <DeveloperMenu />}
        {activeAccount && highestRole === 'END_USER' && <EndUserMenu />}
        <div>
          <div className='mx-auto flex h-12 items-center justify-between px-4'>
            <AuthenticatedTemplate>
              {activeAccount ? (
                <>
                  <Button onClick={handleLogoutRedirect} className='mx-2 w-full gap-2'>
                    <LogOut />
                  </Button>
                  <Link to='/profile'>
                    <Button className='w-full gap-2'>
                      <User2 />
                    </Button>
                  </Link>
                </>
              ) : null}
            </AuthenticatedTemplate>
            <div
              role='toggle-theme'
              className={`flex cursor-pointer items-center transition-transform duration-500 ${
                isDark ? 'rotate-180' : 'rotate-0'
              }`}
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
            >
              {isDark ? (
                <Sun className='h-6 w-6 rotate-0 text-yellow-500 transition-all' />
              ) : (
                <Moon className='h-6 w-6 rotate-0 text-teal-500 transition-all' />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
