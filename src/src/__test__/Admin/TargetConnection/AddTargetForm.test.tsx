import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import AddTargetForm from '../../../pages/Admin/Administration/TargetConnection/AddTargetForm';

jest.mock('@/apis/mutations', () => ({
  useCreateS3Connection: () => ({
    mutate: jest.fn((_, { onSuccess }) => {
      onSuccess();
    }),
  }),
}));

// Mock the navigation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>{children}</BrowserRouter>
  </QueryClientProvider>
);

describe('AddTargetForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form with radio buttons', () => {
    render(<AddTargetForm />, { wrapper });

    expect(screen.getByText('Select Existing S3 Connection')).toBeInTheDocument();
    expect(screen.getByText('Create new S3 Connection')).toBeInTheDocument();
  });

  it('shows select form by default', () => {
    render(<AddTargetForm />, { wrapper });

    expect(screen.getByText('Select Existing S3 Connection')).toBeInTheDocument();
  });

  it('switches to create form when "Create new S3 Connection" is selected', async () => {
    render(<AddTargetForm />, { wrapper });

    const createRadio = screen.getByLabelText('Create new S3 Connection');
    fireEvent.click(createRadio);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('s3 Bucket name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('connection name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('description')).toBeInTheDocument();
    });
  });

  it('submits the create form with valid data', async () => {
    render(<AddTargetForm />, { wrapper });

    const createRadio = screen.getByLabelText('Create new S3 Connection');
    fireEvent.click(createRadio);
    await userEvent.type(screen.getByPlaceholderText('s3 Bucket name'), 'test-bucket');
    await userEvent.type(screen.getByPlaceholderText('connection name'), 'test-connection');
    await userEvent.type(screen.getByPlaceholderText('description'), 'test description');

    const submitButton = screen.getByText('Create');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/target-connection');
    });
  });

  it('shows validation errors when submitting with empty fields', async () => {
    render(<AddTargetForm />, { wrapper });

    const createRadio = screen.getByLabelText('Create new S3 Connection');
    fireEvent.click(createRadio);

    const submitButton = screen.getByText('Create');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid S3 bucket name')).toBeInTheDocument();
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Description is required')).toBeInTheDocument();
    });
  });

  it('validate data being sent to handle submit', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    render(<AddTargetForm />, { wrapper });

    const createRadio = screen.getByLabelText('Create new S3 Connection');
    fireEvent.click(createRadio);

    await userEvent.type(screen.getByPlaceholderText('s3 Bucket name'), 'test-bucket');
    await userEvent.type(screen.getByPlaceholderText('connection name'), 'test-connection');
    await userEvent.type(screen.getByPlaceholderText('description'), 'test description');

    const submitButton = screen.getByText('Create');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith({
        bucket_name: 'test-bucket',
        connection_name: 'test-connection',
        description: 'test description',
      });
    });
    consoleSpy.mockRestore();
  });

  it('shows validation error for invalid S3 bucket name', async () => {
    render(<AddTargetForm />, { wrapper });

    const createRadio = screen.getByLabelText('Create new S3 Connection');
    fireEvent.click(createRadio);

    await userEvent.type(screen.getByPlaceholderText('s3 Bucket name'), 'invalid bucket name');
    await userEvent.type(screen.getByPlaceholderText('connection name'), 'test-connection');
    await userEvent.type(screen.getByPlaceholderText('description'), 'test description');

    const submitButton = screen.getByText('Create');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Invalid S3 bucket name')).toBeInTheDocument();
    });
  });
});
