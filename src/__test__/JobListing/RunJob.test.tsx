import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import { RunJobModal } from '../../pages/JobListing/RunJob';

const mockOnClose = jest.fn();
const mockOnSubmit = jest.fn();

beforeAll(() => {
  if (!window.HTMLElement.prototype.scrollIntoView) {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  }

  global.ResizeObserver = class ResizeObserver {
    observe() {}
    disconnect() {}
    unobserve() {}
  };

  Element.prototype.setPointerCapture = jest.fn();
  Element.prototype.releasePointerCapture = jest.fn();
  Element.prototype.hasPointerCapture = jest.fn().mockReturnValue(false);
});

describe('RunJobModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal with correct title and job name', () => {
    render(<RunJobModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} jobName='TestJob' />);
    expect(screen.getByText(/Run Job for/i)).toBeInTheDocument();
    expect(screen.getByText('TestJob')).toBeInTheDocument();
  });

  it('validates workerType is required', async () => {
    render(<RunJobModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: /Run Job/i }));

    await waitFor(() => {
      expect(screen.getByText('Worker type is required')).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('defaults to "Run Now" and disables Schedule option', () => {
    render(<RunJobModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    const runNowRadio = screen.getByLabelText('Run Now');
    expect(runNowRadio).toBeChecked();

    const scheduleRadio = screen.getByLabelText('Schedule');
    expect(scheduleRadio).toBeDisabled();
  });

  it('closes the modal when cancel is clicked', async () => {
    render(<RunJobModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));

    expect(mockOnClose).toHaveBeenCalled();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('does not submit the form if workerType is not selected', async () => {
    render(<RunJobModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    fireEvent.click(screen.getByRole('button', { name: /Run Job/i }));

    await waitFor(() => {
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });
});
