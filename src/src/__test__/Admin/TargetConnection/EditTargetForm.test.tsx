import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import fetchMock from 'jest-fetch-mock';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import EditTargetForm from '../../../pages/Admin/Administration/TargetConnection/EditTargetForm';

import { useUpdateTargetConnection } from '@/apis/mutations';
import { useTargetConnection } from '@/apis/queries';

fetchMock.enableMocks();

jest.mock('@/apis/mutations', () => ({
  useUpdateTargetConnection: jest.fn(),
}));

jest.mock('@/apis/queries', () => ({
  useTargetConnection: jest.fn(),
}));

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

describe('EditTargetForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useTargetConnection as jest.Mock).mockReturnValue({
      status: 'success',
      data: {
        connection_name: 'test-connection',
        bucket_name: 'test-bucket',
        description: 'test description',
      },
    });
    (useUpdateTargetConnection as jest.Mock).mockReturnValue({
      mutate: jest.fn((_, { onSuccess }) => {
        onSuccess();
      }),
      isPending: false,
    });
  });

  it('renders the form with initial values', () => {
    render(<EditTargetForm connection_name='test-connection' bucket_name='test-bucket' />, { wrapper });

    expect(screen.getByPlaceholderText('s3 Bucket name')).toHaveValue('test-bucket');
    expect(screen.getByPlaceholderText('connection name')).toHaveValue('test-connection');
    expect(screen.getByPlaceholderText('description')).toHaveValue('test description');
  });

  it('submits the form with valid data', async () => {
    render(<EditTargetForm connection_name='test-connection' bucket_name='test-bucket' />, { wrapper });

    await userEvent.type(screen.getByPlaceholderText('s3 Bucket name'), 'test-bucket');
    await userEvent.type(screen.getByPlaceholderText('connection name'), 'test-connection');

    fireEvent.click(screen.getByText('Update'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/target-connection');
    });
  });
});
