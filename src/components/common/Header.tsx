import { Link } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';

import { useTheme } from '@/context/theme-provider';

const Header = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <header className='w-full border-b bg-background/95 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='mx-auto flex h-12 items-center justify-between px-4'>
        <Link to='/'>
          <img
            src={isDark ? '/kenvue-logo-rgb.svg' : '/kenvue-logo-black-rgb.svg'}
            className='h-12'
          />
        </Link>
        <div>
          {/* search */}
          <div
            className={`flex cursor-pointer items-center transition-transform duration-500 ${
              isDark ? 'rotate-180' : 'rotate-0'
            }`}
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
          >
            {isDark ? (
              <Sun className='h-6 w-6 rotate-0 text-yellow-500 transition-all' />
            ) : (
              <Moon className='h-6 w-6 rotate-0 text-blue-500 transition-all' />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;
