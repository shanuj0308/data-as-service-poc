import { Link } from 'react-router-dom';

import { useTheme } from '@/context/theme-provider';

import { Separator } from '@/components/ui/separator';
const footerLinks = [
  {
    title: 'Overview',
    href: '#',
  },
  {
    title: 'Features',
    href: '#',
  },
  {
    title: 'Help',
    href: '#',
  },
  {
    title: 'Privacy',
    href: '#',
  },
];

const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className='flex flex-col bg-background/95 backdrop-blur'>
      <Separator />
      <div className='grow bg-muted' />
      <footer>
        <div className='mx-auto max-w-screen-xl'>
          <div className='flex flex-col items-start justify-between gap-x-8 gap-y-10 px-6 py-6 sm:flex-row xl:px-0'>
            <div>
              {/* Logo */}
              <img src={isDark ? '/kenvue-logo-rgb.svg' : '/kenvue-logo-black-rgb.svg'} className='h-10' />
            </div>

            {/* Subscribe Newsletter */}
            <div className='w-full max-w-xs'>
              <ul className='mt-3 flex flex-wrap items-center gap-4'>
                {footerLinks.map(({ title, href }) => (
                  <li key={title}>
                    <Link to={href} className='text-muted-foreground hover:text-foreground'>
                      {title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
