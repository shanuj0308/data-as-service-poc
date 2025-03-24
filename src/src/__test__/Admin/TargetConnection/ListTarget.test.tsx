import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';

import { useTargetConnectionList } from '../../../apis/queries';
import ListTargetConnection from '../../../pages/Admin/Administration/TargetConnection/List';

jest.mock('@/apis/queries', () => ({
  useTargetConnectionList: jest.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>{children}</BrowserRouter>
  </QueryClientProvider>
);

describe('ListTargetConnection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the list of target connections', async () => {
    const mockData = [
      { connection_name: 'Connection1', bucket_name: 'Bucket1', description: 'Description1' },
      { connection_name: 'Connection2', bucket_name: 'Bucket2', description: 'Description2' },
    ];

    (useTargetConnectionList as jest.Mock).mockReturnValue({
      isFetching: false,
      data: mockData,
    });

    render(<ListTargetConnection />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('Connection1')).toBeInTheDocument();
      expect(screen.getByText('Connection2')).toBeInTheDocument();
      expect(screen.getByText('Bucket1')).toBeInTheDocument();
      expect(screen.getByText('Bucket2')).toBeInTheDocument();
      expect(screen.getByText('Description1')).toBeInTheDocument();
      expect(screen.getByText('Description2')).toBeInTheDocument();
    });
  });

  it('renders "No results" when there are no connections', async () => {
    (useTargetConnectionList as jest.Mock).mockReturnValue({
      isFetching: false,
      data: [],
    });

    render(<ListTargetConnection />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('No results.')).toBeInTheDocument();
    });
  });

  it('renders the "Add Connection" button', () => {
    (useTargetConnectionList as jest.Mock).mockReturnValue({
      isFetching: false,
      data: [],
    });

    render(<ListTargetConnection />, { wrapper });

    expect(screen.getByText('Add Connection')).toBeInTheDocument();
  });

  it('renders the filter input', () => {
    (useTargetConnectionList as jest.Mock).mockReturnValue({
      isFetching: false,
      data: [],
    });

    render(<ListTargetConnection />, { wrapper });

    expect(screen.getByPlaceholderText('Filter by connection name ...')).toBeInTheDocument();
  });
});
