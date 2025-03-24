import { MemoryRouter, Outlet } from 'react-router-dom';
import { MsalReactTester } from 'msal-react-tester';
import { PublicClientApplication } from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

import { loginRequest } from '@/auth/authConfig';

import Footer from '@/components/common/Footer';
import Header from '@/components/common/Header';
import Login from '@/pages/Login';

describe('Testing login and logout code', () => {
  let msalTester: MsalReactTester;
  let pca: PublicClientApplication; // Declare PublicClientApplication

  beforeEach(async () => {
    // new instance of msal tester for each test:
    msalTester = new MsalReactTester();

    // Ask msal-react-tester to handle and mock all msal-react processes:
    await msalTester.spyMsal();
    pca = msalTester.client as PublicClientApplication;
  });

  afterEach(async () => {
    // reset msal-react-tester
    await msalTester.resetSpyMsal();
  });

  test('Dashboard render correctly when user is logged in', async () => {
    msalTester.isLogged();

    render(
      <MsalProvider instance={msalTester.client}>
        <MemoryRouter>
          <Header />
          <Outlet />
          <Footer />
        </MemoryRouter>
      </MsalProvider>,
    );

    await msalTester.waitForRedirect();

    const allLoggedInButtons = await screen.findAllByRole('button');
    expect(allLoggedInButtons).toHaveLength(3);

    // Check if the User2 icon is present in the buttons
    const user2Icons = allLoggedInButtons.filter((button) =>
      button.querySelector('svg[class="lucide lucide-user-round"]'),
    );
    expect(user2Icons).toHaveLength(1);
  });

  test('Test Logout functionality', async () => {
    msalTester.isLogged();

    render(
      <MsalProvider instance={msalTester.client}>
        <MemoryRouter>
          <Header />
          <Outlet />
          <Footer />
        </MemoryRouter>
      </MsalProvider>,
    );

    await msalTester.waitForRedirect();

    // Simulate logout button click
    // Find the logout button by checking for the SVG with specific classes
    const signOutButton = Array.from(screen.getAllByRole('button')).find((button) =>
      button.querySelector('svg.lucide.lucide-log-out'),
    );

    // Ensure the button is found
    expect(signOutButton).toBeInTheDocument();
    userEvent.click(signOutButton as HTMLElement);
    await msalTester.waitForLogout();
    expect(msalTester.client.logoutRedirect).toHaveBeenCalled();
  });

  test('Login screen to show if user is not logged in', async () => {
    msalTester.isNotLogged();
    render(
      <MsalProvider instance={msalTester.client}>
        <MemoryRouter>
          <Header />
          <Login />
          <Footer />
        </MemoryRouter>
      </MsalProvider>,
    );

    await msalTester.waitForRedirect();
    // Test log in page component
    const getLogInText = screen.getByText('Log in to Kvue Vault', {
      selector: 'p',
    });
    expect(getLogInText).toBeInTheDocument();
  });

  test('Test handleLoginRedirect functionality', async () => {
    msalTester.isNotLogged();
    render(
      <MsalProvider instance={msalTester.client}>
        <MemoryRouter>
          <Header />
          <Login />
          <Footer />
        </MemoryRouter>
      </MsalProvider>,
    );

    // await msalTester.waitForRedirect();

    await waitFor(() => {
      expect(screen.getByText('SSO Login')).toBeInTheDocument();
    });
    // Simulate login button click
    const loginButton = screen.getByText('SSO Login');
    userEvent.click(loginButton);

    // Ensure handleLoginRedirect is called
    await waitFor(() => {
      expect(pca.loginPopup).toHaveBeenCalledWith({
        ...loginRequest,
        prompt: 'create',
        scopes: ['User.Read'],
      });
    });
  });
});
