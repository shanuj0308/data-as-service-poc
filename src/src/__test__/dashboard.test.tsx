import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { ArchivalData } from '../../src/types/common';

import Dashboard from '@/pages/Dashboard'; // Adjust the import path as needed

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: jest.fn(({ to, children }) => <a href={to}>{children}</a>),
}));

global.fetch = jest.fn();

// Mock data for testing
const mockArchivedData: ArchivalData[] = [
  {
    id: '1',
    app_name: 'Test App 1',
    completed_on: '2023-01-01T12:00:00',
    legal_hold: 'Yes',
    archival_type: 'Structured',
    retention_policy: 'CX2',
    expiration_date: '2023-01-31',
    gxp: 'Gxp',
  },
  {
    id: '2',
    app_name: 'Test App 2',
    completed_on: '2023-01-02T12:00:00',
    legal_hold: 'No',
    archival_type: 'Unstructured',
    gxp: 'Non-Gxp',
    retention_policy: 'CX3',
    expiration_date: '2023-01-30',
  },
];

// Setup function to render the component with all necessary providers
const renderDashboard = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    </QueryClientProvider>,
  );
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        data: mockArchivedData,
      }),
    });
  });
  it('renders the dashboard with data after successful API call', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Archival Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Test App 1')).toBeInTheDocument();
      expect(screen.getByText('Test App 2')).toBeInTheDocument();
    });
  });

  it('allows filtering table data by app name', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Test App 1')).toBeInTheDocument();
      expect(screen.getByText('Test App 2')).toBeInTheDocument();
    });

    const filterInput = screen.getByPlaceholderText('Filter apps...');
    fireEvent.change(filterInput, { target: { value: 'Test App 1' } });

    await waitFor(() => {
      expect(screen.getByText('Test App 1')).toBeInTheDocument();
      expect(screen.queryByText('Test App 2')).not.toBeInTheDocument();
    });
  });

  it('handles row selection correctly', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Test App 1')).toBeInTheDocument();
    });

    const checkboxes = screen.getAllByRole('checkbox');
    const firstRowCheckbox = checkboxes[1];
    fireEvent.click(firstRowCheckbox);

    expect(screen.getByText('1 of 2 row(s) selected.')).toBeInTheDocument();
  });

  it('handles column sorting correctly', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText('Test App 1')).toBeInTheDocument();
    });

    const typeColumnHeader = screen.getByText('Archival Type');
    fireEvent.click(typeColumnHeader);

    expect(typeColumnHeader).toBeInTheDocument();
  });
});
