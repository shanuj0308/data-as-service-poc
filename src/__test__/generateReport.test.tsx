// src/components/common/__tests__/GenerateReport.test.tsx
import axios from 'axios';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import GenerateReport, { emailSummaryReport, validateKenvueEmail } from '../components/common/GenerateReport';

import { downloadSummaryReport } from '@/apis';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock the File System Access API
const mockShowSaveFilePicker = jest.fn();
const mockWrite = jest.fn();
const mockClose = jest.fn();

beforeAll(() => {
  // Setup mock for File System Access API
  Object.defineProperty(window, 'showSaveFilePicker', {
    value: mockShowSaveFilePicker,
  });

  // Reset mocks before each test
  mockShowSaveFilePicker.mockImplementation(() => {
    return Promise.resolve({
      createWritable: () =>
        Promise.resolve({
          write: mockWrite,
          close: mockClose,
        }),
    });
  });
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GenerateReport Component', () => {
  const selectedArchives = [
    { archive_name: 'Archive 1', id: '1' },
    { archive_name: 'Archive 2', id: '2' },
  ];

  test('renders the generate report button', () => {
    render(<GenerateReport selectedArchives={selectedArchives} />);
    expect(screen.getByText('Generate Summary Report')).toBeInTheDocument();
  });

  test('button is disabled when no archives are selected', () => {
    render(<GenerateReport selectedArchives={[]} />);
    const button = screen.getByText('Generate Summary Report');
    expect(button).toBeDisabled();
  });

  test('button is disabled when disabled prop is true', () => {
    render(<GenerateReport selectedArchives={selectedArchives} disabled={true} />);
    const button = screen.getByText('Generate Summary Report');
    expect(button).toBeDisabled();
  });

  test('opens dialog when button is clicked', async () => {
    render(<GenerateReport selectedArchives={selectedArchives} />);
    const button = screen.getByText('Generate Summary Report');

    await userEvent.click(button);

    expect(screen.getByText('Generate Summary Report', { selector: 'h2' })).toBeInTheDocument();
    expect(screen.getByText('Download Report')).toBeInTheDocument();
    expect(screen.getByText('Email Generated Report')).toBeInTheDocument();
  });

  test('shows email input when email option is selected', async () => {
    render(<GenerateReport selectedArchives={selectedArchives} />);
    await userEvent.click(screen.getByText('Generate Summary Report'));

    await userEvent.click(screen.getByLabelText('Email Generated Report'));

    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
  });

  test('validates email format', async () => {
    render(<GenerateReport selectedArchives={selectedArchives} />);
    await userEvent.click(screen.getByText('Generate Summary Report'));
    await userEvent.click(screen.getByLabelText('Email Generated Report'));

    const emailInput = screen.getByLabelText('Email Address');
    await userEvent.type(emailInput, 'invalid@example.com');

    expect(screen.getByText('Email must be a kenvue.com address')).toBeInTheDocument();

    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'valid@kenvue.com');

    expect(screen.queryByText('Email must be a kenvue.com address')).not.toBeInTheDocument();
  });

  test('send button is disabled with invalid email', async () => {
    render(<GenerateReport selectedArchives={selectedArchives} />);
    await userEvent.click(screen.getByText('Generate Summary Report'));
    await userEvent.click(screen.getByLabelText('Email Generated Report'));

    const emailInput = screen.getByLabelText('Email Address');
    await userEvent.type(emailInput, 'invalid@example.com');

    expect(screen.getByText('Send')).toBeDisabled();
  });

  // test('calls downloadSummaryReport when download option is selected', async () => {
  //   // Mock successful response
  //   mockedAxios.post.mockResolvedValueOnce({
  //     data: new Blob(['test data'], { type: 'text/csv' }),
  //   });

  //   render(<GenerateReport selectedArchives={selectedArchives} />);
  //   await userEvent.click(screen.getByText('Generate Summary Report'));
  //   await userEvent.click(screen.getByText('Download'));

  //   await waitFor(() => {
  //     console.log('Axios calls:', mockedAxios.post.mock.calls);
  //     expect(mockedAxios.post).toHaveBeenCalledWith(
  //       {
  //         url: 'https://o33dd0mr26.execute-api.us-east-1.amazonaws.com/archive/SummaryreportRL',
  //         method: 'POST',
  //         data: { data: selectedArchives },
  //         responseType: 'blob',
  //       },
  //       { timeout: 2000 },
  //     );
  //     // expect(mockShowSaveFilePicker).toHaveBeenCalled();
  //     // expect(mockWrite).toHaveBeenCalled();
  //     // expect(mockClose).toHaveBeenCalled();
  //   });
  // });

  // test('shows loading state during processing', async () => {
  //   // Make axios take some time to resolve
  //   mockedAxios.mockImplementationOnce(() => {
  //     return new Promise((resolve) => {
  //       setTimeout(() => {
  //         resolve({
  //           data: new Blob(['test data'], { type: 'text/csv' }),
  //         });
  //       }, 100);
  //     });
  //   });

  //   render(<GenerateReport selectedArchives={selectedArchives} />);
  //   await userEvent.click(screen.getByText('Generate Summary Report'));
  //   await userEvent.click(screen.getByText('Download'));

  //   expect(screen.getByText('Processing...')).toBeInTheDocument();

  //   await waitFor(() => {
  //     expect(mockedAxios).toHaveBeenCalled();
  //   });
  // });

  test('handles download error gracefully', async () => {
    // Mock error response
    mockedAxios.get.mockRejectedValueOnce(new Error('API error'));

    // Mock window.alert
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    render(<GenerateReport selectedArchives={selectedArchives} />);
    await userEvent.click(screen.getByText('Generate Summary Report'));
    await userEvent.click(screen.getByText('Download'));

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalled();
    });

    alertMock.mockRestore();
  });

  test('validateKenvueEmail correctly validates email addresses', () => {
    expect(validateKenvueEmail('user@kenvue.com')).toBe(true);
    expect(validateKenvueEmail('user@example.com')).toBe(false);
    expect(validateKenvueEmail('user@subdomain.kenvue.com')).toBe(false);
    expect(validateKenvueEmail('')).toBe(false);
  });

  // test('downloadSummaryReport makes correct API call', async () => {
  //   const mockBlob = new Blob(['test data'], { type: 'text/csv' });
  //   mockedAxios.mockResolvedValueOnce({ data: mockBlob });

  //   const selectedArchives = [{ archive_name: 'Test Archive', id: '123' }];
  //   await downloadSummaryReport(selectedArchives);

  //   expect(mockedAxios).toHaveBeenCalledWith({
  //     url: 'https://o33dd0mr26.execute-api.us-east-1.amazonaws.com/archive/SummaryreportRL',
  //     method: 'POST',
  //     data: { data: selectedArchives },
  //     responseType: 'blob',
  //   });
  // });

  test('downloadSummaryReport handles errors', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('API error'));

    const selectedArchives = [{ archive_name: 'Test Archive', id: '123' }];
    await expect(downloadSummaryReport(selectedArchives)).rejects.toEqual(
      'Failed to generate report. Please try again.',
    );
  });

  test('emailSummaryReport formats payload correctly', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    const selectedArchives = [{ archive_name: 'Test Archive', id: '123' }];
    const email = 'test@kenvue.com';

    await emailSummaryReport(selectedArchives, email);

    expect(consoleSpy).toHaveBeenCalledWith(`Would send report to ${email} with payload:`, {
      data: selectedArchives,
      email: email,
    });

    consoleSpy.mockRestore();
  });
});
