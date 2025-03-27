import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

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

describe('JobList Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the loading state', () => {
    (useJobDataList as jest.Mock).mockReturnValue({ isFetching: true });
    render(<JobList />, { wrapper });
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('renders the list of jobs', async () => {
    const mockData = [
      { job_id: '1234', job_name: 'jobname', archive_status: 'completed' },
      { job_id: '1235', job_name: 'jobname2', archive_status: 'inprogress' },
    ];
    (useJobDataList as jest.Mock).mockReturnValue({ isFetching: false, data: mockData });

    render(<JobList />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('jobname')).toBeInTheDocument();
      expect(screen.getByText('jobname2')).toBeInTheDocument();
    });
  });

  it('renders "No results" when there are no jobs', async () => {
    (useJobDataList as jest.Mock).mockReturnValue({ isFetching: false, data: [] });
    render(<JobList />, { wrapper });
    await waitFor(() => {
      expect(screen.getByText('No results.')).toBeInTheDocument();
    });
  });

  it('renders the "Add Job" button', () => {
    (useJobDataList as jest.Mock).mockReturnValue({ isFetching: false, data: [] });
    render(<JobList />, { wrapper });
    expect(screen.getByText('Add Job')).toBeInTheDocument();
  });
  it('filters jobs based on input', async () => {
    const mockData = [
      { job_id: '1234', job_name: 'jobname', archive_status: 'completed' },
      { job_id: '1235', job_name: 'anotherjob', archive_status: 'completed' },
    ];
    (useJobDataList as jest.Mock).mockReturnValue({ isFetching: false, data: mockData });
    render(<JobList />, { wrapper });

    const filterInput = screen.getByPlaceholderText('Filter by Job Name');
    fireEvent.change(filterInput, { target: { value: 'anotherjob' } });

    await waitFor(() => {
      expect(screen.getByText('anotherjob')).toBeInTheDocument();
      expect(screen.queryByText('jobname')).not.toBeInTheDocument();
    });
  });
});
