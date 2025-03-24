import { Table } from '@tanstack/react-table';
import { fireEvent, render, screen } from '@testing-library/react';

import { DataTablePagination } from '../../components/reactTable/DataTablePagination';

jest.mock('@tanstack/react-table', () => ({
  ...jest.requireActual('@tanstack/react-table'),
  Table: jest.fn(),
}));

describe('DataTablePagination', () => {
  let table: Table<any>;

  beforeEach(() => {
    table = {
      getState: jest.fn().mockReturnValue({
        pagination: {
          pageSize: 10,
          pageIndex: 0,
        },
      }),
      getPageCount: jest.fn().mockReturnValue(5),
      getCanPreviousPage: jest.fn().mockReturnValue(true),
      getCanNextPage: jest.fn().mockReturnValue(true),
      setPageSize: jest.fn(),
      setPageIndex: jest.fn(),
      previousPage: jest.fn(),
      nextPage: jest.fn(),
    } as unknown as Table<any>;
  });

  it('renders the pagination controls', () => {
    render(<DataTablePagination table={table} />);

    expect(screen.getByText('Rows per page')).toBeInTheDocument();
    expect(screen.getByText('Page 1 of 5')).toBeInTheDocument();
    expect(screen.getByText('Go to first page')).toBeInTheDocument();
    expect(screen.getByText('Go to previous page')).toBeInTheDocument();
    expect(screen.getByText('Go to next page')).toBeInTheDocument();
    expect(screen.getByText('Go to last page')).toBeInTheDocument();
  });

  it('changes page size when a new value is selected', () => {
    render(<DataTablePagination table={table} />);

    fireEvent.click(screen.getByText('10'));
    fireEvent.click(screen.getByText('20'));

    expect(table.setPageSize).toHaveBeenCalledWith(20);
  });

  it('goes to the first page when the first page button is clicked', () => {
    render(<DataTablePagination table={table} />);

    fireEvent.click(screen.getByText('Go to first page'));

    expect(table.setPageIndex).toHaveBeenCalledWith(0);
  });

  it('goes to the previous page when the previous page button is clicked', () => {
    render(<DataTablePagination table={table} />);

    fireEvent.click(screen.getByText('Go to previous page'));

    expect(table.previousPage).toHaveBeenCalled();
  });

  it('goes to the next page when the next page button is clicked', () => {
    render(<DataTablePagination table={table} />);

    fireEvent.click(screen.getByText('Go to next page'));

    expect(table.nextPage).toHaveBeenCalled();
  });

  it('goes to the last page when the last page button is clicked', () => {
    render(<DataTablePagination table={table} />);

    fireEvent.click(screen.getByText('Go to last page'));

    expect(table.setPageIndex).toHaveBeenCalledWith(4);
  });

  it('disables the previous page button when on the first page', () => {
    (table.getCanPreviousPage as jest.Mock).mockReturnValue(false);

    render(<DataTablePagination table={table} />);

    expect(screen.getByText('Go to previous page').closest('button')).toBeDisabled();
  });

  it('disables the next page button when on the last page', () => {
    (table.getCanNextPage as jest.Mock).mockReturnValue(false);

    render(<DataTablePagination table={table} />);

    expect(screen.getByText('Go to next page').closest('button')).toBeDisabled();
  });
});
