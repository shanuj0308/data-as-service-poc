// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

// import userEvent from '@testing-library/user-event';
import { useTargetConnectionList } from '../../../apis/queries';
import SelectExisting from '../../../pages/Admin/Administration/TargetConnection/SelectExisting';

jest.mock('@/apis/queries', () => ({
  useTargetConnectionList: jest.fn(),
}));

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

// const pause = () => {
//   return new Promise((resolve) => setTimeout(resolve, 1000));
// };

describe('SelectExisting', () => {
  const mockUseTargetConnectionList = {
    isFetching: false,
    data: [{ bucket_name: 'bucket1' }, { bucket_name: 'bucket2' }],
  };

  beforeEach(() => {
    (useTargetConnectionList as jest.Mock).mockReturnValue(mockUseTargetConnectionList);
  });

  it('renders the SelectExisting component', () => {
    render(<SelectExisting />, { wrapper });
    expect(screen.getByText('S3 Buckets')).toBeInTheDocument();
    expect(screen.getByText('Select the existing s3 bucket')).toBeInTheDocument();
  });

  it('submits the form with correct data', async () => {
    render(<SelectExisting />, { wrapper });

    fireEvent.change(screen.getByRole('combobox', { name: /s3 buckets/i }), { target: { value: 'bucket1' } });
    fireEvent.change(screen.getByRole('textbox', { name: /connection name/i }), {
      target: { value: 'connection name' },
    });
    fireEvent.change(screen.getByRole('textbox', { name: /description/i }), {
      target: { value: 'connection description' },
    });

    const submitButton = screen.getByText('Create');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /s3 buckets/i })).toHaveValue('bucket1');
      expect(screen.getByRole('textbox', { name: /connection name/i })).toHaveValue('connection name');
      expect(screen.getByRole('textbox', { name: /description/i })).toHaveValue('connection description');
    });
  });

  it('shows validation errors when submitting with empty fields', async () => {
    render(<SelectExisting />, { wrapper });

    const submitButton = screen.getByText('Create');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Required')).toBeInTheDocument();
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Description is required')).toBeInTheDocument();
    });
  });
});
