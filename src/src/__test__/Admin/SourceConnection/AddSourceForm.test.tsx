import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AddSourceForm from '../../../pages/Admin/Administration/SourceConnection/AddSourceForm';

// Inline mock definition to avoid initialization issues
jest.mock('@/apis/mutations', () => {
  const mockMutations = {
    useCreateSourceConnection: () => ({
      mutate: jest.fn((_, { onSuccess }) => {
        onSuccess();
      }),
      isPending: false,
    }),
    useTestSourceConnection: () => ({
      mutate: jest.fn((_, { onSuccess }) => {
        onSuccess();
      }),
      isPending: false,
    }),
  };
  return mockMutations;
});

// Mock the navigation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>{children}</BrowserRouter>
  </QueryClientProvider>
);

describe('AddSourceForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.style.pointerEvents = 'auto';
  });

  it('renders the add source form ', () => {
    render(<AddSourceForm />, { wrapper });

    expect(screen.getByText('Database Type')).toBeInTheDocument();
    expect(screen.getByText('Connection Name')).toBeInTheDocument();
    expect(screen.getByText('Hostname')).toBeInTheDocument();
    expect(screen.getByText('Database name')).toBeInTheDocument();
  });

  it('shows validation errors when submitting with empty fields', async () => {
    render(<AddSourceForm />, { wrapper });

    const submitButton = screen.getByText('Create');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Hostname must be at least 3 characters long')).toBeInTheDocument();
      expect(screen.getByText('Connection name is required')).toBeInTheDocument();
      expect(screen.getByText('Description is required')).toBeInTheDocument();
      expect(screen.getByText('Db name is required')).toBeInTheDocument();
    });
  });

  it('submits the create form with valid data', async () => {
    render(<AddSourceForm />, { wrapper });

    const selectTrigger = screen.getByRole('combobox', { name: /Database Type/i });

    // Force pointer-events to auto on trigger
    selectTrigger.style.pointerEvents = 'auto';

    await userEvent.click(selectTrigger);
    const dropdown = await screen.findByRole('listbox'); // Wait for the dropdown to appear
    const option = within(dropdown).getByText('PostgresSql');
    await userEvent.click(option); // Selects the option

    await userEvent.type(screen.getByPlaceholderText('connection name'), 'test-connection');
    await userEvent.type(screen.getByPlaceholderText('description'), 'test description');
    await userEvent.type(screen.getByPlaceholderText('hostname'), 'hostname');
    await userEvent.type(screen.getByPlaceholderText('database'), 'test description');
    await userEvent.type(screen.getByPlaceholderText('port'), '1234');
    await userEvent.type(screen.getByPlaceholderText('username'), 'test description');
    await userEvent.type(screen.getByPlaceholderText('password'), 'test description');

    const submitButton = screen.getByRole('button', { name: /create/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/source-connection');
    });
  });

  it('validate data being sent to handle submit', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    render(<AddSourceForm />, { wrapper });

    const selectTrigger = screen.getByRole('combobox', { name: /Database Type/i });

    // Force pointer-events to auto on trigger
    selectTrigger.style.pointerEvents = 'auto';

    await userEvent.click(selectTrigger);
    const dropdown = await screen.findByRole('listbox'); // Wait for the dropdown to appear
    const option = within(dropdown).getByText('PostgresSql');
    await userEvent.click(option); // Selects the option

    await userEvent.type(screen.getByPlaceholderText('connection name'), 'test-connection');
    await userEvent.type(screen.getByPlaceholderText('description'), 'test description');
    await userEvent.type(screen.getByPlaceholderText('hostname'), 'hostname');
    await userEvent.type(screen.getByPlaceholderText('database'), 'test description');
    await userEvent.type(screen.getByPlaceholderText('port'), '1234');
    await userEvent.type(screen.getByPlaceholderText('username'), 'test description');
    await userEvent.type(screen.getByPlaceholderText('password'), 'test description');

    const submitButton = screen.getByRole('button', { name: /create/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith({
        connection_name: 'test-connection',
        database_engine: 'postgresql',
        hostname: 'hostname',
        port: '1234',
        database: 'test description',
        username: 'test description',
        password: 'test description',
        description: 'test description',
      });
    });
    consoleSpy.mockRestore();
  });

  it('triggers testConnection and sends form data when Test Connection button is clicked', async () => {
    // Mock the mutate function to spy on it
    const testConnectionMutateSpy = jest.fn();
    const originalMocks = jest.requireMock('@/apis/mutations');
    originalMocks.useTestSourceConnection = () => ({
      mutate: testConnectionMutateSpy,
      isPending: false,
    });

    render(<AddSourceForm />, { wrapper });

    const selectTrigger = screen.getByRole('combobox', { name: /Database Type/i });

    // Force pointer-events to auto on trigger
    selectTrigger.style.pointerEvents = 'auto';

    await userEvent.click(selectTrigger);
    const dropdown = await screen.findByRole('listbox'); // Wait for the dropdown to appear
    const option = within(dropdown).getByText('PostgresSql');
    await userEvent.click(option); // Selects the option

    await userEvent.type(screen.getByPlaceholderText('connection name'), 'test-connection');
    await userEvent.type(screen.getByPlaceholderText('description'), 'test description');
    await userEvent.type(screen.getByPlaceholderText('hostname'), 'hostname');
    await userEvent.type(screen.getByPlaceholderText('database'), 'test description');
    await userEvent.type(screen.getByPlaceholderText('port'), '1234');
    await userEvent.type(screen.getByPlaceholderText('username'), 'test description');
    await userEvent.type(screen.getByPlaceholderText('password'), 'test description');

    // Find and click the Test Connection button
    const testButton = screen.getByRole('button', { name: /test connection/i });
    fireEvent.click(testButton);

    // Wait for the async validation and mutation
    await waitFor(() => {
      expect(testConnectionMutateSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          connection_name: 'test-connection',
          database_engine: 'postgresql',
          hostname: 'hostname',
          port: '1234',
          database: 'test description',
          username: 'test description',
          password: 'test description',
          description: 'test description',
        }),
      );
    });
  });

  it('does not call testConnection mutate if form validation fails', async () => {
    // Use the existing mock and override mutate with a spy
    const testConnectionMutateSpy = jest.fn();
    const originalMocks = jest.requireMock('@/apis/mutations');
    originalMocks.useTestSourceConnection = () => ({
      mutate: testConnectionMutateSpy,
      isPending: false,
    });

    render(<AddSourceForm />, { wrapper });

    // Leave fields empty to trigger validation failure (assuming zod requires these fields)
    const testButton = screen.getByRole('button', { name: /test connection/i });
    fireEvent.click(testButton);

    // Wait briefly to ensure no mutation occurs
    await waitFor(() => {
      expect(testConnectionMutateSpy).not.toHaveBeenCalled();
    });
  });
});
