import { Fragment } from 'react/jsx-runtime';
import { Link } from 'react-router-dom';
import { ChevronsRight, Home } from 'lucide-react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export const BreadcrumbsWithBackground = ({ currentPage }: { currentPage: string }) => {
  return (
    <Breadcrumb className='rounded-lg bg-secondary px-2'>
      <BreadcrumbList className='text-lg font-medium !leading-10 tracking-tight sm:text-xl md:text-[18px] md:leading-[3.25rem]'>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to='/dashboard'>Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronsRight />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>{currentPage}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export const BreadcrumbsWithIcon = ({ currentPath }: { currentPath: string }) => {
  const pathSegments = currentPath.split('/').filter((segment) => segment !== '');
  return (
    <Breadcrumb>
      {pathSegments.length >= 1 && (
        <BreadcrumbList>
          <>
            <BreadcrumbItem key={'home'}>
              <Home className='h-4 w-4' />
            </BreadcrumbItem>
          </>

          {pathSegments.map((segment, index) => (
            <Fragment key={`fragment-${index}`}>
              <BreadcrumbSeparator key={`separator-${index}`}>
                <ChevronsRight key={`separator-${index + 1}`} />
              </BreadcrumbSeparator>
              <BreadcrumbItem key={`item-${index}`}>
                {/* <BreadcrumbLink asChild>
                <Link to={`/${pathSegments.slice(0, index + 1).join('/')}`}></Link>
              </BreadcrumbLink> */}
                {segment}
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      )}
    </Breadcrumb>
  );
};
