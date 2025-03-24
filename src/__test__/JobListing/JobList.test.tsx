import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';

import { useJobDataList } from '../../apis/queries';
import JobList from '../../pages/JobListing/JobList';

jest.mock('@/apis/queries', () => ({
  useJobDataList: jest.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>{children}</BrowserRouter>
  </QueryClientProvider>
);

describe('List Jobs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the list of target connections', async () => {
    const mockData = [
      {
        job_id: '1234',
        job_name: 'jobname',
        archive_type: 'structured',
        archive_status: 'completed',
        start_time: '2022-01-01',
        end_time: '2022-01-02',
      },
      {
        job_id: '1235',
        job_name: 'jobname2',
        archive_type: 'unstructured',
        archive_status: 'inprogress',
        start_time: '2022-01-03',
        end_time: '2022-01-03',
      },
    ];

    (useJobDataList as jest.Mock).mockReturnValue({
      isFetching: false,
      data: mockData,
    });

    render(<JobList />, { wrapper });

    await waitFor(() => {
      const cells = screen.getAllByRole('cell');
      expect(cells.some((cell) => cell.textContent === 'jobname')).toBeTruthy();
      expect(cells.some((cell) => cell.textContent === 'jobname2')).toBeTruthy();
    });
  });

  it('renders "No results" when there are no connections', async () => {
    (useJobDataList as jest.Mock).mockReturnValue({
      isFetching: false,
      data: [],
    });

    render(<JobList />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('No results.')).toBeInTheDocument();
    });
  });

  it('renders the "Add Job" button', () => {
    (useJobDataList as jest.Mock).mockReturnValue({
      isFetching: false,
      data: [],
    });

    render(<JobList />, { wrapper });

    expect(screen.getByText('Add Job')).toBeInTheDocument();
  });

  it('renders the filter input', () => {
    (useJobDataList as jest.Mock).mockReturnValue({
      isFetching: false,
      data: [],
    });

    render(<JobList />, { wrapper });

    expect(screen.getByPlaceholderText('Filter by Job Name')).toBeInTheDocument();
  });
});
