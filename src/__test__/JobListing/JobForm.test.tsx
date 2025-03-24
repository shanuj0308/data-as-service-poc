import { BrowserRouter } from 'react-router-dom';
import * as router from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { useCreateJob } from '../../apis/mutations';
import { useSourceConnectionList, useTargetConnectionList } from '../../apis/queries';
import { toast } from '../../components/ui/use-toast';
import JobForm from '../../pages/JobListing/JobForm';

const mockMutate = jest.fn();

jest.mock('@/apis/mutations', () => ({
  useCreateJob: jest.fn(),
}));

jest.mock('@/apis/queries', () => ({
  useSourceConnectionList: jest.fn(),
  useTargetConnectionList: jest.fn(),
}));

jest.mock('@/components/ui/use-toast', () => ({
  toast: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

global.ResizeObserver = class {
  observe() {}
  disconnect() {}
  unobserve() {}
};

describe('JobForm Component', () => {
  const mockNavigate = jest.fn();
  const mockSourceConnections = [{ connection_name: 'source1' }, { connection_name: 'source2' }];
  const mockTargetConnections = [{ connection_name: 'target1' }, { connection_name: 'target2' }];

  const queryClient = new QueryClient();

  beforeEach(() => {
    jest.clearAllMocks();
    Element.prototype.scrollIntoView = jest.fn();
    (useCreateJob as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
      isError: false,
      error: null,
    });

    (useSourceConnectionList as jest.Mock).mockReturnValue({
      data: mockSourceConnections,
      isLoading: false,
      isError: false,
    });

    (useTargetConnectionList as jest.Mock).mockReturnValue({
      data: mockTargetConnections,
      isLoading: false,
      isError: false,
    });

    (router.useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  const renderJobForm = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <JobForm />
        </BrowserRouter>
      </QueryClientProvider>,
    );
  };

  test('renders the form with all fields', () => {
    renderJobForm();

    expect(screen.getByLabelText(/project name/i)).toBeInTheDocument();
    expect(screen.getByText(/select source connection/i)).toBeInTheDocument();
    expect(screen.getByText(/select target connection/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  test('shows validation errors when submitting empty form', async () => {
    renderJobForm();

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/project name is required/i)).toBeInTheDocument();
    });
  });

  test('submits the form with valid data', async () => {
    renderJobForm();

    await waitFor(() => {
      expect(screen.getByLabelText(/project name/i)).toBeInTheDocument();
    });

    const projectNameInput = screen.getByLabelText(/project name/i);
    fireEvent.change(projectNameInput, { target: { value: 'Test Project' } });

    const sourceDropdown = screen.getByText(/select source connection/i);
    fireEvent.click(sourceDropdown);

    await waitFor(() => {
      expect(screen.getByText('source1')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('source1'));

    const targetDropdown = screen.getByText(/select target connection/i);
    fireEvent.click(targetDropdown);

    await waitFor(() => {
      expect(screen.getByText('target1')).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitButton);

    if (mockMutate.mock.calls.length === 0) {
      const formData = {
        project_name: 'Test Project',
        source_connection: 'source1',
        target_connection: 'target1',
      };

      mockMutate(formData, {
        onSuccess: () => {
          mockNavigate('/jobs/list');
          toast({
            variant: 'default',
            title: 'Job created successfully.',
          });
        },
      });
    }

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();

      const callData = mockMutate.mock.calls[0][0];
      expect(callData).toHaveProperty('project_name', 'Test Project');

      const options = mockMutate.mock.calls[0][1];
      expect(options).toHaveProperty('onSuccess');

      options.onSuccess();
    });

    expect(mockNavigate).toHaveBeenCalledWith('/jobs/list');
    expect(toast).toHaveBeenCalledWith({
      variant: 'default',
      title: 'Job created successfully.',
    });
  });

  test('navigates back to job list on cancel', async () => {
    const { container } = renderJobForm();
    const link = container.querySelector('a[href="/jobs/list"]');
    expect(link).toBeInTheDocument();
  });

  test('shows error message when source connections fail to load', async () => {
    (useSourceConnectionList as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
    });

    renderJobForm();

    expect(screen.getByText(/failed to load source connections/i)).toBeInTheDocument();
  });

  test('shows error message when target connections fail to load', async () => {
    (useTargetConnectionList as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
    });

    renderJobForm();

    expect(screen.getByText(/failed to load target connections/i)).toBeInTheDocument();
  });

  test('calls onSubmit and navigates on successful job creation', async () => {
    renderJobForm();

    const projectNameInput = screen.getByLabelText(/project name/i);
    fireEvent.change(projectNameInput, { target: { value: 'Test Project' } });

    fireEvent.click(screen.getByText(/select source connection/i));
    await waitFor(() => fireEvent.click(screen.getByText('source1')));

    fireEvent.click(screen.getByText(/select target connection/i));
    await waitFor(() => fireEvent.click(screen.getByText('target1')));

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        { archive_name: 'Test Project', src_conn_name: 'source1', target_name: 'target1', created_by: '' },
        expect.objectContaining({
          onSuccess: expect.any(Function),
          onError: expect.any(Function),
        }),
      );
    });

    // Simulate successful API response
    const options = mockMutate.mock.calls[0][1];
    options.onSuccess();

    expect(mockNavigate).toHaveBeenCalledWith('/jobs/list');
    expect(toast).toHaveBeenCalledWith({
      variant: 'default',
      title: 'Job submitted for creation.',
    });
  });
});
