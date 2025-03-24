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

    const submitButton = screen.getByRole('button', { name: /Run Job/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Worker type is required')).toBeInTheDocument();
    });
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('validates capacity input', async () => {
    render(<RunJobModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    const capacityInput = screen.getByPlaceholderText('Enter maximum capacity');
    fireEvent.change(capacityInput, { target: { value: '-5' } });

    const submitButton = screen.getByRole('button', { name: /Run Job/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Worker type is required/i)).toBeInTheDocument();
    });

    fireEvent.change(capacityInput, { target: { value: '10' } });

    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(screen.getByText(/Worker type is required/i)).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('resets form when modal is closed and reopened', async () => {
    const { rerender } = render(<RunJobModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    const capacityInput = screen.getByPlaceholderText('Enter maximum capacity');
    fireEvent.change(capacityInput, { target: { value: '5' } });

    rerender(<RunJobModal isOpen={false} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    rerender(<RunJobModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />);

    const resetCapacityInput = screen.getByPlaceholderText('Enter maximum capacity');
    expect(resetCapacityInput).toHaveValue(2);
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
});
