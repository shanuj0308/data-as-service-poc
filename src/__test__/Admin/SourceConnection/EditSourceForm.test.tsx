import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import EditSourceForm from '../../../pages/Admin/Administration/SourceConnection/EditSourceForm';

jest.mock('@/apis/mutations', () => ({
  useUpdateSourceConnection: () => ({
    mutate: jest.fn((_, { onSuccess }) => onSuccess()),
    isPending: false,
  }),
  useTestSourceConnection: () => ({
    mutate: jest.fn((_, { onSuccess }) => onSuccess()),
    isPending: false,
  }),
}));

jest.mock('@/apis/queries', () => ({
  useSourceConnection: jest.fn(), // Mocked below per test
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock useToast (assuming it's from a toast library like shadcn)
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
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

describe('EditSourceForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.body.style.pointerEvents = 'auto';
  });

  it('renders the form with initial values', async () => {
    const mockInitialValues = {
      connection_name: 'existing-connection',
      description: 'existing description',
      hostname: 'abc.xyz.com',
      port: '5432',
      database: 'existing-db',
      username: 'existing-user',
      password: 'existing-pass',
      database_engine: 'postgresql',
    };

    // Mock useSourceConnection to return initial data
    const useSourceConnectionMock = jest.requireMock('@/apis/queries').useSourceConnection;
    useSourceConnectionMock.mockReturnValue({
      data: mockInitialValues,
      status: 'success', // Ensure it’s not "pending"
      isLoading: false,
    });

    render(<EditSourceForm connection_name='existing-connection' />, { wrapper });

    // Wait for useEffect to reset the form with fetched data
    await waitFor(() => {
      expect(screen.getByPlaceholderText('connection name')).toHaveValue('existing-connection');
      expect(screen.getByPlaceholderText('connection name')).toHaveAttribute('disabled'); // Check read-only
      expect(screen.getByPlaceholderText('description')).toHaveValue('existing description');
    });

    // Add assertions for other fields if present in your full form
    expect(screen.getByPlaceholderText('hostname')).toHaveValue('abc.xyz.com');
    expect(screen.getByPlaceholderText('port')).toHaveValue('5432');
    expect(screen.getByPlaceholderText('database')).toHaveValue('existing-db');
    expect(screen.getByPlaceholderText('username')).toHaveValue('existing-user');
    expect(screen.getByPlaceholderText('password')).toHaveValue('existing-pass');

    const selectTrigger = screen.getByRole('combobox', { name: /Database Type/i });
    expect(selectTrigger).toHaveTextContent('PostgresSql'); // Adjust based on display text
  });

  it('validate data being sent to handle submit', async () => {
    const mockInitialValues = {
      connection_name: 'existing-conn',
      description: 'existing description',
      hostname: 'abc.xyz.com',
      port: '5432',
      database: 'existing-db',
      username: 'existing-user',
      password: 'existing-pass',
      database_engine: 'postgresql',
    };

    // Mock useSourceConnection with initial data
    const useSourceConnectionMock = jest.requireMock('@/apis/queries').useSourceConnection;
    useSourceConnectionMock.mockReturnValue({
      data: mockInitialValues,
      status: 'success',
      isLoading: false,
    });

    // Spy on updateConnection.mutate
    const updateConnectionMutateSpy = jest.fn((_, { onSuccess }) => onSuccess());
    const mutationsMock = jest.requireMock('@/apis/mutations');
    mutationsMock.useUpdateSourceConnection = () => ({
      mutate: updateConnectionMutateSpy,
      isPending: false,
    });

    render(<EditSourceForm connection_name='existing-conn' />, { wrapper });

    // Wait for form to load with initial values
    await waitFor(() => {
      expect(screen.getByPlaceholderText('connection name')).toHaveValue('existing-conn');
    });

    // Simulate user edits (e.g., change description, hostname, and database_engine)
    await userEvent.clear(screen.getByPlaceholderText('description'));
    await userEvent.type(screen.getByPlaceholderText('description'), 'updated description');

    await userEvent.clear(screen.getByPlaceholderText('hostname'));
    await userEvent.type(screen.getByPlaceholderText('hostname'), 'abcd.xyz.com');

    // Assuming database_engine is a combobox; adjust if different
    const selectTrigger = screen.getByRole('combobox', { name: /Database Type/i });
    selectTrigger.style.pointerEvents = 'auto';
    await userEvent.click(selectTrigger);
    const dropdown = await screen.findByRole('listbox');
    const option = within(dropdown).getByText('PostgresSql'); // Assuming same option
    await userEvent.click(option);

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /update/i });
    fireEvent.click(submitButton);

    // Verify the data sent to updateConnection.mutate
    await waitFor(() => {
      expect(updateConnectionMutateSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          connection_name: 'existing-conn', // Unchanged, read-only
          description: 'updated description', // Edited
          hostname: 'abcd.xyz.com', // Edited
          port: '5432', // Unchanged
          database: 'existing-db', // Unchanged
          username: 'existing-user', // Unchanged
          password: 'existing-pass', // Unchanged
          database_engine: 'postgresql', // Edited (assumed same value for simplicity)
        }),
        expect.any(Object), // Options object with onSuccess
      );
    });

    // Verify navigation on success
    expect(mockNavigate).toHaveBeenCalledWith('/source-connection');
  });

  it('does not call testConnection mutate if form validation fails', async () => {
    // Use the existing mock and override mutate with a spy
    const testConnectionMutateSpy = jest.fn();
    const originalMocks = jest.requireMock('@/apis/mutations');
    originalMocks.useTestSourceConnection = () => ({
      mutate: testConnectionMutateSpy,
      isPending: false,
    });

    render(<EditSourceForm connection_name='existing-connection' />, { wrapper });

    // Leave fields empty to trigger validation failure (assuming zod requires these fields)
    const testButton = screen.getByRole('button', { name: /test connection/i });
    fireEvent.click(testButton);

    // Wait briefly to ensure no mutation occurs
    await waitFor(() => {
      expect(testConnectionMutateSpy).not.toHaveBeenCalled();
    });
  });
});
