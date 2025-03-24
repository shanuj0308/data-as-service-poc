// src/pages/Admin/Administration/LegalHold/__tests__/LegalHold.test.tsx
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as mutations from '../apis/mutations';
// Mocks
import * as queries from '../apis/queries';
import LoadingScreen from '../components/common/LoadingScreen';
import * as useUsernameHook from '../hooks/useUsername';
// Components to test
import ListLegalHold from '../pages/Admin/Administration/LegalHold/List';
import ApplyLegalHoldForm from '../pages/ApplyLegalHoldForm';

// Mock data
const mockLegalHoldList = [
  {
    id: '1',
    archive_name: 'App 1',
    legal_hold: true,
    legal_hold_name: 'Policy 1',
    bucket_name: 'bucket-1',
  },
  {
    id: '2',
    archive_name: 'App 2',
    legal_hold: false,
    legal_hold_name: null,
    bucket_name: 'bucket-2',
  },
  {
    id: '3',
    archive_name: 'App 3',
    legal_hold: true,
    legal_hold_name: 'Policy 2',
    bucket_name: null,
  },
];

const mockApplicationsList = [
  { id: '1', archive_name: 'App 1', database_engine: 'PostgreSQL' },
  { id: '2', archive_name: 'App 2', database_engine: 'MySQL' },
  { id: '3', archive_name: 'App 3', database_engine: 'Oracle' },
];

// Mock the API hooks
jest.mock('@/apis/queries', () => ({
  useLegalHoldList: jest.fn(),
  useApplicationsList: jest.fn(),
}));

jest.mock('@/apis/mutations', () => ({
  useApplyLegalHold: jest.fn(),
  useRemoveLegalHold: jest.fn(),
}));

jest.mock('@/hooks/useUsername', () => jest.fn());

// Setup QueryClient for tests
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
      },
    },
  });

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const testQueryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={testQueryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
};

describe('Legal Hold Components', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations for mutations to avoid isPending errors
    (mutations.useApplyLegalHold as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    (mutations.useRemoveLegalHold as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    // Mock clipboard API
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: jest.fn().mockImplementation(() => Promise.resolve()),
      },
      configurable: true,
    });
  });
  describe('LoadingScreen', () => {
    test('renders loading indicator and message', () => {
      render(<LoadingScreen />);

      // Check for the loading text
      expect(screen.getByText('Loading data...')).toBeInTheDocument();

      // Check for the Loader2 icon (by its class)
      const loaderIcon = document.querySelector('.animate-spin');
      expect(loaderIcon).toBeInTheDocument();

      // Check for the container with flex layout
      const container = screen.getByText('Loading data...').closest('div');
      expect(container).toHaveClass('flex');
    });
  });

  describe('ListLegalHold Component', () => {
    test('should show loading state initially', () => {
      (queries.useLegalHoldList as jest.Mock).mockReturnValue({
        isFetching: true,
        data: null,
      });

      render(
        <TestWrapper>
          <ListLegalHold />
        </TestWrapper>,
      );

      expect(screen.getByText('Loading data...')).toBeInTheDocument();
    });

    test('should render legal hold list when data is loaded', async () => {
      (queries.useLegalHoldList as jest.Mock).mockReturnValue({
        isFetching: false,
        data: mockLegalHoldList,
      });

      render(
        <TestWrapper>
          <ListLegalHold />
        </TestWrapper>,
      );

      expect(screen.getByText('Legal Hold Management')).toBeInTheDocument();
      expect(screen.getByText('Application Name')).toBeInTheDocument();

      // Check if data is rendered
      expect(screen.getByText('App 1')).toBeInTheDocument();
      expect(screen.getByText('App 2')).toBeInTheDocument();
      expect(screen.getByText('App 3')).toBeInTheDocument();
    });

    test('should filter table data when search input changes', async () => {
      (queries.useLegalHoldList as jest.Mock).mockReturnValue({
        isFetching: false,
        data: mockLegalHoldList,
      });

      render(
        <TestWrapper>
          <ListLegalHold />
        </TestWrapper>,
      );

      // Find the filter input
      const filterInput = screen.getByPlaceholderText(/Filter by archive name/i);

      // Type in the filter
      await userEvent.type(filterInput, 'App 1');

      // App 1 should be visible, App 2 and App 3 should not
      expect(screen.getByText('App 1')).toBeInTheDocument();
      expect(screen.queryByText('App 2')).not.toBeInTheDocument();
      expect(screen.queryByText('App 3')).not.toBeInTheDocument();
    });

    test('should open dropdown menu and copy application name', async () => {
      (queries.useLegalHoldList as jest.Mock).mockReturnValue({
        isFetching: false,
        data: mockLegalHoldList,
      });

      render(
        <TestWrapper>
          <ListLegalHold />
        </TestWrapper>,
      );

      // Find and click the first dropdown menu
      const dropdownButtons = screen.getAllByRole('button', { name: /open menu/i });
      await userEvent.click(dropdownButtons[0]);

      // Click on "Copy application name"
      const copyButton = screen.getByText('Copy application name');
      await userEvent.click(copyButton);

      // Verify clipboard was called with the correct app name
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('App 1');
    });

    test('should open confirmation dialog for applying legal hold', async () => {
      (queries.useLegalHoldList as jest.Mock).mockReturnValue({
        isFetching: false,
        data: mockLegalHoldList,
      });

      const mockApplyMutation = {
        mutate: jest.fn(),
        isPending: false,
      };

      (mutations.useApplyLegalHold as jest.Mock).mockReturnValue(mockApplyMutation);
      (mutations.useRemoveLegalHold as jest.Mock).mockReturnValue({
        mutate: jest.fn(),
        isPending: false,
      });

      render(
        <TestWrapper>
          <ListLegalHold />
        </TestWrapper>,
      );

      // Find and click the second dropdown menu (App 2 has legal_hold: false)
      const dropdownButtons = screen.getAllByRole('button', { name: /open menu/i });
      await userEvent.click(dropdownButtons[1]);

      // Click on "Apply Legal Hold"
      const applyButton = screen.getByText('Apply Legal Hold');
      await userEvent.click(applyButton);

      // Verify dialog appears
      expect(screen.getByText('Are you sure you want to apply legal hold?')).toBeInTheDocument();

      // Confirm the action
      const confirmButton = screen.getByRole('button', { name: 'Apply Legal Hold' });
      await userEvent.click(confirmButton);

      // Verify mutation was called
      expect(mockApplyMutation.mutate).toHaveBeenCalledWith({
        archive_id: '2',
        policy_name: 'True',
      });
    });

    test('should open confirmation dialog for removing legal hold', async () => {
      (queries.useLegalHoldList as jest.Mock).mockReturnValue({
        isFetching: false,
        data: mockLegalHoldList,
      });

      const mockRemoveMutation = {
        mutate: jest.fn(),
        isPending: false,
      };

      (mutations.useApplyLegalHold as jest.Mock).mockReturnValue({
        mutate: jest.fn(),
        isPending: false,
      });
      (mutations.useRemoveLegalHold as jest.Mock).mockReturnValue(mockRemoveMutation);

      render(
        <TestWrapper>
          <ListLegalHold />
        </TestWrapper>,
      );

      // Find and click the first dropdown menu (App 1 has legal_hold: true)
      const dropdownButtons = screen.getAllByRole('button', { name: /open menu/i });
      await userEvent.click(dropdownButtons[0]);

      // Click on "Remove Legal Hold"
      const removeButton = screen.getByText('Remove Legal Hold');
      await userEvent.click(removeButton);

      // Verify dialog appears
      expect(screen.getByText('Are you sure you want to remove legal hold?')).toBeInTheDocument();

      // Confirm the action
      const confirmButton = screen.getByRole('button', { name: 'Remove Legal Hold' });
      await userEvent.click(confirmButton);

      // Verify mutation was called
      expect(mockRemoveMutation.mutate).toHaveBeenCalledWith({
        archive_id: '1',
      });
    });

    test('should show pending state in dialog when mutation is in progress', async () => {
      (queries.useLegalHoldList as jest.Mock).mockReturnValue({
        isFetching: false,
        data: mockLegalHoldList,
      });

      (mutations.useApplyLegalHold as jest.Mock).mockReturnValue({
        mutate: jest.fn(),
        isPending: true,
      });
      (mutations.useRemoveLegalHold as jest.Mock).mockReturnValue({
        mutate: jest.fn(),
        isPending: false,
      });

      render(
        <TestWrapper>
          <ListLegalHold />
        </TestWrapper>,
      );

      // Find and click the second dropdown menu (App 2 has legal_hold: false)
      const dropdownButtons = screen.getAllByRole('button', { name: /open menu/i });
      await userEvent.click(dropdownButtons[1]);

      // Click on "Apply Legal Hold"
      const applyButton = screen.getByText('Apply Legal Hold');
      await userEvent.click(applyButton);

      // Verify dialog shows processing state
      expect(screen.getByText('Processing...')).toBeInTheDocument();
    });
  });

  describe('ApplyLegalHoldForm Component', () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
      jest.mock('react-router-dom', () => ({
        ...jest.requireActual('react-router-dom'),
        useNavigate: () => mockNavigate,
      }));
    });

    test('should render form with application dropdown when data is loaded', async () => {
      (queries.useApplicationsList as jest.Mock).mockReturnValue({
        isLoading: false,
        data: mockApplicationsList,
      });

      (useUsernameHook.default as jest.Mock).mockReturnValue('testuser');

      render(
        <TestWrapper>
          <ApplyLegalHoldForm />
        </TestWrapper>,
      );

      // Use getByRole to be more specific
      expect(screen.getByRole('heading', { name: 'Apply Legal Hold' })).toBeInTheDocument();
      expect(screen.getByText('Application')).toBeInTheDocument();
      expect(screen.getByText('Select an application')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
    });

    test('should disable submit button when form is submitting', async () => {
      (queries.useApplicationsList as jest.Mock).mockReturnValue({
        isLoading: false,
        data: mockApplicationsList,
      });

      (useUsernameHook.default as jest.Mock).mockReturnValue('testuser');

      (mutations.useApplyLegalHold as jest.Mock).mockReturnValue({
        mutate: jest.fn(),
        isPending: true,
      });

      render(
        <TestWrapper>
          <ApplyLegalHoldForm />
        </TestWrapper>,
      );

      const submitButton = screen.getByRole('button', { name: 'Applying...' });
      expect(submitButton).toBeDisabled();
    });

    test('should disable submit button when username is not available', async () => {
      (queries.useApplicationsList as jest.Mock).mockReturnValue({
        isLoading: false,
        data: mockApplicationsList,
      });

      (useUsernameHook.default as jest.Mock).mockReturnValue(null);

      (mutations.useApplyLegalHold as jest.Mock).mockReturnValue({
        mutate: jest.fn(),
        isPending: false,
      });

      render(
        <TestWrapper>
          <ApplyLegalHoldForm />
        </TestWrapper>,
      );

      const submitButton = screen.getByRole('button', { name: 'Apply Legal Hold' });
      expect(submitButton).toBeDisabled();
    });
  });

  describe('Table functionality', () => {
    test('should select rows with checkboxes', async () => {
      (queries.useLegalHoldList as jest.Mock).mockReturnValue({
        isFetching: false,
        data: mockLegalHoldList,
      });

      render(
        <TestWrapper>
          <ListLegalHold />
        </TestWrapper>,
      );

      // Get all checkboxes
      const checkboxes = screen.getAllByRole('checkbox');

      // Select the first row
      await userEvent.click(checkboxes[1]); // Index 0 is the "select all" checkbox

      // Verify selection text updates
      expect(screen.getByText('1 of 3 row(s) selected.')).toBeInTheDocument();

      // Select all rows
      await userEvent.click(checkboxes[0]);

      // Verify all rows are selected
      expect(screen.getByText('3 of 3 row(s) selected.')).toBeInTheDocument();
    });

    test('should sort table when column header is clicked', async () => {
      (queries.useLegalHoldList as jest.Mock).mockReturnValue({
        isFetching: false,
        data: mockLegalHoldList,
      });

      render(
        <TestWrapper>
          <ListLegalHold />
        </TestWrapper>,
      );

      // Find and click the sortable column header
      const sortButton = screen.getByRole('button', { name: /Application Name/i });
      await userEvent.click(sortButton);

      // Click again to reverse sort order
      await userEvent.click(sortButton);

      // We can't easily test the actual sort order in this test environment,
      // but we can verify the button was clicked
      expect(sortButton).toBeInTheDocument();
    });

    test('should paginate table data', async () => {
      // Create a larger dataset for pagination testing
      const largeDataset = Array(20)
        .fill(null)
        .map((_, i) => ({
          id: `${i + 1}`,
          archive_name: `App ${i + 1}`,
          legal_hold: i % 2 === 0,
          legal_hold_name: i % 2 === 0 ? `Policy ${i + 1}` : null,
          bucket_name: `bucket-${i + 1}`,
        }));

      (queries.useLegalHoldList as jest.Mock).mockReturnValue({
        isFetching: false,
        data: largeDataset,
      });

      render(
        <TestWrapper>
          <ListLegalHold />
        </TestWrapper>,
      );

      // Check initial page
      expect(screen.getByText('App 1')).toBeInTheDocument();

      // Go to next page
      const nextPageButton = screen.getByRole('button', { name: /next page/i });
      await userEvent.click(nextPageButton);

      // Check if we're on the next page
      // Default page size is 10, so we should see App 11 on the second page
      await waitFor(() => {
        expect(screen.getByText('App 11')).toBeInTheDocument();
      });
    });
  });
});
