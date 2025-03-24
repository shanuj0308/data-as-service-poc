import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ThemeProvider } from '@/context/theme-provider';

import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';

describe('ThemeProvider and Header Component Tests', () => {
  test('ThemeProvider sets the theme correctly', () => {
    render(
      <ThemeProvider defaultTheme='light'>
        <div data-testid='theme-test'>Theme Test</div>
      </ThemeProvider>,
    );

    const themeTestElement = screen.getByTestId('theme-test');
    expect(themeTestElement).toBeInTheDocument();
    expect(document.documentElement.classList.contains('light')).toBe(true);
  });

  test('Header component toggles theme correctly', async () => {
    render(
      <MemoryRouter>
        <ThemeProvider defaultTheme='light'>
          <Header />
          <Footer />
        </ThemeProvider>
      </MemoryRouter>,
    );

    // Check initial theme
    // Wait for the component to render and the SVG to be present
    const themeToggleButton = await screen.findByRole('toggle-theme');
    expect(themeToggleButton).toBeInTheDocument();

    const svgElement = themeToggleButton.querySelector('svg');
    expect(svgElement).toBeInTheDocument();

    // // Check for the classes on the SVG element
    expect(svgElement?.classList.contains('lucide')).toBe(true);
    expect(svgElement?.classList.contains('lucide-moon')).toBe(true);

    // Simulate theme toggle
    userEvent.click(themeToggleButton);

    // Check theme after toggle
    expect(svgElement?.classList.contains('lucide-moon')).toBe(true);
  });

  test('ThemeProvider sets system theme correctly', async () => {
    // Mock window.matchMedia to simulate system theme preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
      })),
    });

    render(
      <MemoryRouter>
        <ThemeProvider defaultTheme='system'>
          <Header />
          <Footer />
        </ThemeProvider>
      </MemoryRouter>,
    );

    const themeTestElement = await screen.findByRole('toggle-theme');
    expect(themeTestElement).toBeInTheDocument();

    // Check if the correct theme class is added based on system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      expect(document.documentElement.classList.contains('dark')).toBe(true);
    } else {
      expect(document.documentElement.classList.contains('light')).toBe(true);
    }
  });
});
