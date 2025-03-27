import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { useDownloadS3Files } from '@/apis/mutations';
import { useUnstructuredDataList } from '@/apis/queries';
import { toast } from '@/components/ui/use-toast';
import { handleDownload } from '@/pages/Unstructured/List'; // Adjust path to your file
import ListUnstructuredData from '@/pages/Unstructured/List';
import { columns } from '@/pages/Unstructured/ListColumns'; // Adjust path
import { S3ObjectList } from '@/types/common';

jest.mock('@/apis/queries', () => ({
  useUnstructuredDataList: jest.fn(),
}));

// Mock dependencies
jest.mock('@/apis/mutations', () => ({
  useDownloadS3Files: jest.fn(),
}));
jest.mock('@/components/ui/use-toast', () => ({
  toast: jest.fn(),
}));

// Mock table utilities
const mockTable = {
  getIsAllPageRowsSelected: jest.fn(() => false),
  getIsSomePageRowsSelected: jest.fn(() => false),
  toggleAllPageRowsSelected: jest.fn(),
};

const mockRow = {
  getIsSelected: jest.fn(() => false),
  toggleSelected: jest.fn(),
};

const mockColumn = {
  toggleSorting: jest.fn(),
  getIsSorted: jest.fn(() => false),
};

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>{children}</BrowserRouter>
  </QueryClientProvider>
);

describe('ListUnstructuredData test cases', () => {
  let downloadS3Files: any;
  let handleFolderClick: jest.Mock;
  let handleDownloadSingle: jest.Mock;
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock useDownloadS3Files
    downloadS3Files = {
      mutate: jest.fn(),
    };
    (useDownloadS3Files as jest.Mock).mockReturnValue(downloadS3Files);
  });

  it('renders the loading state', () => {
    (useUnstructuredDataList as jest.Mock).mockReturnValue({
      isFetching: true,
      data: null,
    });
    console.log('TEST_FILE_INCLUDED_DURING_BUILD');
    render(<ListUnstructuredData />, { wrapper });

    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  it('renders the list of unstructured data', async () => {
    const mockData = [
      { item_name: 'Folder1', item_type: 'folder', s3_path: 'path/to/folder1' },
      { item_name: 'File1.txt', item_type: 'file', s3_path: 'path/to/file1.txt' },
    ];
    (useUnstructuredDataList as jest.Mock).mockReturnValue({
      isFetching: false,
      data: mockData,
    });

    render(<ListUnstructuredData />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('Folder1')).toBeInTheDocument();
      expect(screen.getByText('File1.txt')).toBeInTheDocument();
    });
  });

  it('navigates to a folder when clicked', async () => {
    const mockData = [
      { item_name: 'Folder1', item_type: 'folder', s3_path: 'path/to/folder1', bucketName: 'test-bucket' },
      { item_name: 'File1.txt', item_type: 'file', s3_path: 'path/to/file1.txt', bucketName: 'test-bucket' },
    ];
    (useUnstructuredDataList as jest.Mock).mockReturnValue({
      isFetching: false,
      data: mockData,
    });

    render(<ListUnstructuredData />, { wrapper });

    await waitFor(() => {
      const folderButton = screen.getByText('Folder1');
      fireEvent.click(folderButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Back')).toBeInTheDocument();
    });
  });

  it('triggers download and creates a link on success', async () => {
    const itemsToDownload: S3ObjectList[] = [
      {
        s3_path: 'path/to/file1.txt',
        bucketName: 'test-bucket',
        item_name: 'file1.txt',
        item_type: 'file',
        size: '1024',
      },
    ];

    // Prepending _ to payload tells TypeScript it’s intentionally unused, silencing the error.
    downloadS3Files.mutate.mockImplementation((_payload: any, { onSuccess }: any) => {
      onSuccess({ url: '' });
    });

    handleDownload(itemsToDownload, downloadS3Files);

    expect(toast).toHaveBeenCalledWith({ title: 'Download triggered' });
    expect(downloadS3Files.mutate).toHaveBeenCalledWith(
      {
        bucketName: 'test-bucket',
        selected_files: ['path/to/file1.txt'],
      },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function),
      }),
    );

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({ title: 'Download started' });
    });
  });

  it('shows error toast on download failure', async () => {
    const itemsToDownload: S3ObjectList[] = [
      {
        s3_path: 'path/to/file1.txt',
        bucketName: 'test-bucket',
        item_name: 'file1.txt',
        item_type: 'file',
        size: '1024',
      },
    ];

    // Prepending _ to payload tells TypeScript it’s intentionally unused, silencing the error.
    downloadS3Files.mutate.mockImplementation((_payload: any, { onError }: any) => {
      onError();
    });

    handleDownload(itemsToDownload, downloadS3Files);

    expect(toast).toHaveBeenCalledWith({ title: 'Download triggered' });
    expect(downloadS3Files.mutate).toHaveBeenCalledWith(
      {
        bucketName: 'test-bucket',
        selected_files: ['path/to/file1.txt'],
      },
      expect.any(Object),
    );

    await waitFor(() => {
      expect(toast).toHaveBeenCalledWith({
        title: 'Download failed',
        variant: 'destructive',
      });
    });
  });

  it('displays initial empty filterValue in input', () => {
    render(<ListUnstructuredData />, { wrapper });

    const input = screen.getByPlaceholderText('Filter by item name ...');
    expect(input).toHaveValue('');
  });

  it('updates filterValue when typing in the input', async () => {
    render(<ListUnstructuredData />, { wrapper });

    const input = screen.getByPlaceholderText('Filter by item name ...');
    fireEvent.change(input, { target: { value: 'file1' } });

    await waitFor(() => {
      expect(input).toHaveValue('file1');
    });
  });

  it('Shows "Download items" button after clicking a row checkbox', async () => {
    const mockData = [
      { item_name: 'Folder1', item_type: 'folder', s3_path: 'path/to/folder1' },
      { item_name: 'File1.txt', item_type: 'file', s3_path: 'path/to/file1.txt' },
    ];
    (useUnstructuredDataList as jest.Mock).mockReturnValue({
      isFetching: false,
      data: mockData,
    });

    render(<ListUnstructuredData />, { wrapper });

    await waitFor(() => {
      expect(screen.getByText('Folder1')).toBeInTheDocument();
      expect(screen.getByText('File1.txt')).toBeInTheDocument();
    });

    // Initially, no download button since no rows are selected
    expect(screen.queryByText(/Download \(\d+\) items/)).not.toBeInTheDocument();

    // Click the first row's checkbox
    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]);

    // Wait for the button to appear
    await waitFor(() => {
      const downloadButton = screen.getByText('Download (2) items');
      expect(downloadButton).toBeInTheDocument();
    });
  });

  it('returns the correct column definitions', () => {
    handleFolderClick = jest.fn();
    handleDownloadSingle = jest.fn();
    const columnDefs = columns(handleFolderClick, handleDownloadSingle);

    expect(columnDefs).toHaveLength(5);
    expect(columnDefs[0]).toMatchObject({
      id: 'Key',
      enableSorting: false,
      enableHiding: false,
    });
    expect(columnDefs[1]).toMatchObject({
      accessorKey: 'item_name',
    });
    expect(typeof columnDefs[0].header).toBe('function');
    expect(typeof columnDefs[0].cell).toBe('function');
    expect(typeof columnDefs[1].header).toBe('function');
  });

  it('renders checkbox in header and toggles all rows selection', () => {
    const columnDefs = columns(handleFolderClick, handleDownloadSingle);
    const HeaderComponent = columnDefs[0].header as (props: { table: any }) => JSX.Element;

    render(<HeaderComponent table={mockTable} />);

    const checkbox = screen.getByRole('checkbox', { name: /select all/i });
    expect(checkbox).toBeInTheDocument();
    expect(mockTable.getIsAllPageRowsSelected).toHaveBeenCalled();
    expect(mockTable.getIsSomePageRowsSelected).toHaveBeenCalled();

    fireEvent.click(checkbox);
    expect(mockTable.toggleAllPageRowsSelected).toHaveBeenCalledWith(true);
  });

  it('renders checkbox in cell and toggles row selection', () => {
    const columnDefs = columns(handleFolderClick, handleDownloadSingle);
    const CellComponent = columnDefs[0].cell as (props: { row: any }) => JSX.Element;

    render(<CellComponent row={mockRow} />);

    const checkbox = screen.getByRole('checkbox', { name: /select row/i });
    expect(checkbox).toBeInTheDocument();
    expect(mockRow.getIsSelected).toHaveBeenCalled();

    fireEvent.click(checkbox);
    expect(mockRow.toggleSelected).toHaveBeenCalledWith(true);
  });

  it('toggles sorting when item_name header button is clicked', () => {
    const columnDefs = columns(handleFolderClick, handleDownloadSingle);
    const HeaderComponent = columnDefs[1].header as (props: { column: any }) => JSX.Element;

    render(<HeaderComponent column={mockColumn} />);

    const button = screen.getByRole('button', { name: /item name/i });
    fireEvent.click(button);

    expect(mockColumn.getIsSorted).toHaveBeenCalled();
    expect(mockColumn.toggleSorting).toHaveBeenCalledWith(false); // false === 'asc' means toggle to true
  });
});
