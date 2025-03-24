import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';

import { useSourceConnectionList } from '../../../apis/queries';
import ListSourceConnection from '../../../pages/Admin/Administration/SourceConnection/List';

jest.mock('@/apis/queries', () => ({
  useSourceConnectionList: jest.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>{children}</BrowserRouter>
  </QueryClientProvider>
);

describe('ListSourceConnection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the list of target connections', async () => {
    const mockData = [
      { connection_name: 'Connection1', database_engine: 'postgresql', description: 'Description1' },
      { connection_name: 'Connection2', database_engine: 'mysql', description: 'Description2' },
    ];

    (useSourceConnectionList as jest.Mock).mockReturnValue({
      isFetching: false,
      data: mockData,
    });

    render(<ListSourceConnection />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('Connection1')).toBeInTheDocument();
      expect(screen.getByText('Connection2')).toBeInTheDocument();
      expect(screen.getByText('postgresql')).toBeInTheDocument();
      expect(screen.getByText('mysql')).toBeInTheDocument();
      expect(screen.getByText('Description1')).toBeInTheDocument();
      expect(screen.getByText('Description2')).toBeInTheDocument();
    });
  });

  it('renders "No results" when there are no connections', async () => {
    (useSourceConnectionList as jest.Mock).mockReturnValue({
      isFetching: false,
      data: [],
    });

    render(<ListSourceConnection />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('No results.')).toBeInTheDocument();
    });
  });

  it('renders the "Add Connection" button', () => {
    (useSourceConnectionList as jest.Mock).mockReturnValue({
      isFetching: false,
      data: [],
    });

    render(<ListSourceConnection />, { wrapper });

    expect(screen.getByText('Add Connection')).toBeInTheDocument();
  });

  it('renders the filter input', () => {
    (useSourceConnectionList as jest.Mock).mockReturnValue({
      isFetching: false,
      data: [],
    });

    render(<ListSourceConnection />, { wrapper });

    expect(screen.getByPlaceholderText('Filter by connection name ...')).toBeInTheDocument();
  });
});
