import {
  AuthenticationResult,
  EventMessage,
  EventType,
  PublicClientApplication,
} from '@azure/msal-browser';
import { MsalProvider } from '@azure/msal-react';

import { msalConfig } from '@/auth/authConfig';

type AuthProviderProps = {
  children: React.ReactNode;
};

export const msalInstance = new PublicClientApplication(msalConfig); // msal Instance

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Default to using the first account if no account is active on page load
  // check if current account is active, if not active and getAllAccounts is not empty, set active account
  // as the first active account in the array
  if (
    !msalInstance.getActiveAccount() &&
    msalInstance.getAllAccounts().length > 0
  ) {
    // Account selection logic is app dependent. Adjust as needed for different use cases.
    msalInstance.setActiveAccount(msalInstance.getAllAccounts()[0]);
  }

  // Listen for sign-in event and set active account
  // check if its been successfull login, then also set the active account
  // to the account that was just logged in
  msalInstance.addEventCallback((event: EventMessage) => {
    const authenticationResult = event.payload as AuthenticationResult;
    const account = authenticationResult?.account;
    if (event.eventType === EventType.LOGIN_SUCCESS && account) {
      msalInstance.setActiveAccount(account);
    }
  });

  return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
};

export function useAuthProvider() {
  return { AuthProvider };
}
