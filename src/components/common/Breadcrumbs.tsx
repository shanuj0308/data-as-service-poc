import { Link } from 'react-router-dom';
import { ChevronsRight } from 'lucide-react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const Breadcrumbs = ({ currentPage }: { currentPage: string }) => {
  return (
    <Breadcrumb className='rounded-lg bg-secondary px-3 py-1'>
      <BreadcrumbList className='text-2xl font-medium !leading-10 tracking-tight sm:text-3xl md:text-[20px] md:leading-[3.25rem]'>
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

export default Breadcrumbs;
