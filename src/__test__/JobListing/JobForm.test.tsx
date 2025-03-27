import { BrowserRouter } from 'react-router-dom';
import * as router from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { useCreateJob } from '../../apis/mutations';
import { useRetentionPolicyList, useSourceConnectionList, useTargetConnectionList } from '../../apis/queries';
import { toast } from '../../components/ui/use-toast';
import JobForm from '../../pages/JobListing/JobForm';

const mockMutate = jest.fn();

jest.mock('../../apis/mutations', () => ({
  useCreateJob: jest.fn(),
}));

jest.mock('../../apis/queries', () => ({
  useSourceConnectionList: jest.fn(),
  useTargetConnectionList: jest.fn(),
  useRetentionPolicyList: jest.fn(),
}));

jest.mock('../../components/ui/use-toast', () => ({
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
    (useCreateJob as jest.Mock).mockReturnValue({ mutate: mockMutate });
    (useSourceConnectionList as jest.Mock).mockReturnValue({ data: mockSourceConnections, isLoading: false });
    (useTargetConnectionList as jest.Mock).mockReturnValue({ data: mockTargetConnections, isLoading: false });
    (useRetentionPolicyList as jest.Mock).mockReturnValue({ data: [], isLoading: false });
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

  test('renders the form with required fields', () => {
    renderJobForm();
    expect(screen.getByLabelText(/Archive Job Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/SGRC ID/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/App Id/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/App Name/i)).toBeInTheDocument();
    expect(screen.getByText(/select source connection/i)).toBeInTheDocument();
    expect(screen.getByText(/select target connection/i)).toBeInTheDocument();
    expect(screen.getByText(/select archival type/i)).toBeInTheDocument();
    expect(screen.getByText(/select retention policy/i)).toBeInTheDocument();
    expect(screen.getByText(/select legal hold/i)).toBeInTheDocument();
  });

  test('shows validation errors when submitting empty form', async () => {
    renderJobForm();
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(() => {
      expect(screen.getByText(/Archive Job Name should be like: JOB_STRUCT_APPID_APPNAME_V1.0/i)).toBeInTheDocument();
    });
  });

  test('submits the form with valid data', async () => {
    renderJobForm();
    fireEvent.change(screen.getByLabelText(/Archive Job Name/i), { target: { value: 'JOB_STRUCT_APPID_APPNAME_V1.0' } });
    fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Test Job Description' } });
    fireEvent.change(screen.getByLabelText(/SGRC ID/i), { target: { value: 'SGRC123' } });
    fireEvent.change(screen.getByLabelText(/App Id/i), { target: { value: 'APP123' } });
    fireEvent.change(screen.getByLabelText(/App Name/i), { target: { value: 'Test App' } });
       fireEvent.click(screen.getByText(/select source connection/i));
    const sourceOption = await screen.findByText('source1');
    fireEvent.click(sourceOption);
    
    fireEvent.click(screen.getByText(/select archival type/i));
    const archivalOption = await screen.findByText('Structured');
    fireEvent.click(archivalOption);

    fireEvent.click(screen.getByText(/select target connection/i));
    const targetOption = await screen.findByText('target1');
    fireEvent.click(targetOption);
    
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    await waitFor(() => expect(mockMutate).toHaveBeenCalled());
    
    expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          "app_id": "APP123", 
          "app_name": "Test App",
          "archival_type": "Structured",
          "archive_name": "JOB_STRUCT_APPID_APPNAME_V1.0",
          "created_by": "",
          "description": "Test Job Description",
          "legal_hold": "",
          "retention_policy": "",
          "sgrc_id": "SGRC123",
          "source_name": "source1",
          "target_name": "target1"}),
        expect.any(Object)
    );
    
    const options = mockMutate.mock.calls[0][1];
    options.onSuccess();
    
    expect(mockNavigate).toHaveBeenCalledWith('/jobs/list');
    expect(toast).toHaveBeenCalledWith({ title: 'Job submitted for creation.', variant: "default" });
});

  test('navigates back to job list on cancel', () => {
    const { container } = renderJobForm();
    const link = container.querySelector('a[href="/jobs/list"]');
    expect(link).toBeInTheDocument();
  });

  test('shows error message when source connections fail to load', async () => {
    (useSourceConnectionList as jest.Mock).mockReturnValue({ data: null, isError: true });
    renderJobForm();
    expect(screen.getByText(/Failed to load source connections/i)).toBeInTheDocument();
  });

  test('shows error message when target connections fail to load', async () => {
    (useTargetConnectionList as jest.Mock).mockReturnValue({ data: null, isError: true });
    renderJobForm();
    expect(screen.getByText(/Failed to load target connections/i)).toBeInTheDocument();
  });
});
